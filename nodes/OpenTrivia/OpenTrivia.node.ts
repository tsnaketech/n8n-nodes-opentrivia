import type {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE = 'https://opentdb.com';

const RESPONSE_CODE_MESSAGES: Record<number, string> = {
	1: 'No Results — the API does not have enough questions for this query (try a lower amount, a different category, or Any Difficulty/Type).',
	2: 'Invalid Parameter — one of the values passed to the API is not valid.',
	3: 'Token Not Found — the session token does not exist. Request a new one.',
	4: 'Token Empty — the session token has returned all possible questions for this query. Reset the token to continue.',
	5: 'Rate Limited — Open Trivia DB allows only one request every 5 seconds per IP. Slow down and retry.',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function openTriviaRequest(
	ctx: IExecuteFunctions,
	path: string,
	qs?: IDataObject,
): Promise<IDataObject> {
	try {
		return (await ctx.helpers.httpRequest({
			method: 'GET',
			url: `${API_BASE}${path}`,
			qs,
			json: true,
		})) as IDataObject;
	} catch (err: unknown) {
		const msg = err instanceof Error ? err.message : String(err);
		throw new NodeApiError(ctx.getNode(), { message: msg } as never);
	}
}

function assertResponseCode(
	ctx: IExecuteFunctions,
	response: { response_code?: number; response_message?: string },
	itemIndex: number,
): void {
	const code = response.response_code;
	if (code !== undefined && code !== 0) {
		const message =
			RESPONSE_CODE_MESSAGES[code] ?? response.response_message ?? `Unknown error (code ${code})`;
		throw new NodeOperationError(ctx.getNode(), `Open Trivia DB error: ${message}`, {
			itemIndex,
		});
	}
}

function decodeBase64(value: string): string {
	return Buffer.from(value, 'base64').toString('utf8');
}

function decodeQuestion(question: IDataObject): IDataObject {
	return {
		...question,
		category: decodeBase64(question.category as string),
		type: decodeBase64(question.type as string),
		difficulty: decodeBase64(question.difficulty as string),
		question: decodeBase64(question.question as string),
		correct_answer: decodeBase64(question.correct_answer as string),
		incorrect_answers: (question.incorrect_answers as string[]).map(decodeBase64),
	};
}

// ─── Node ─────────────────────────────────────────────────────────────────────

export class OpenTrivia implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Open Trivia',
		name: 'openTrivia',
		icon: {
			light: 'file:../../icons/opentrivia.svg',
			dark: 'file:../../icons/opentrivia.dark.svg',
		},
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + " · " + $parameter["resource"]}}',
		description:
			'Fetch trivia questions, categories and session tokens from the Open Trivia Database (opentdb.com)',
		defaults: { name: 'Open Trivia' },
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [],
		properties: [
			// ── Resource ───────────────────────────────────────────────────────────
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Question', value: 'question' },
					{ name: 'Category', value: 'category' },
					{ name: 'Session Token', value: 'sessionToken' },
				],
				default: 'question',
			},

			// ══════════════════════════════════════════════════════════════════════
			// QUESTION
			// ══════════════════════════════════════════════════════════════════════
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['question'] } },
				options: [
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Fetch one or more trivia questions',
						action: 'Get many questions',
					},
				],
				default: 'getMany',
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 50 },
				default: 10,
				displayOptions: { show: { resource: ['question'], operation: ['getMany'] } },
				description: 'Number of questions to fetch (max 50 per Open Trivia DB)',
			},
			{
				displayName: 'Category Name or ID',
				name: 'category',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCategories' },
				default: 0,
				displayOptions: { show: { resource: ['question'], operation: ['getMany'] } },
				description:
					'Trivia category to pull questions from. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Difficulty',
				name: 'difficulty',
				type: 'options',
				options: [
					{ name: 'Any', value: '' },
					{ name: 'Easy', value: 'easy' },
					{ name: 'Medium', value: 'medium' },
					{ name: 'Hard', value: 'hard' },
				],
				default: '',
				displayOptions: { show: { resource: ['question'], operation: ['getMany'] } },
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Any', value: '' },
					{ name: 'Multiple Choice', value: 'multiple' },
					{ name: 'True / False', value: 'boolean' },
				],
				default: '',
				displayOptions: { show: { resource: ['question'], operation: ['getMany'] } },
			},
			{
				displayName: 'Session Token',
				name: 'sessionToken',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				displayOptions: { show: { resource: ['question'], operation: ['getMany'] } },
				description:
					'Optional token (see the Session Token resource) so Open Trivia DB avoids repeating questions already served',
			},

			// ══════════════════════════════════════════════════════════════════════
			// CATEGORY
			// ══════════════════════════════════════════════════════════════════════
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['category'] } },
				options: [
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'List all available trivia categories',
						action: 'Get many categories',
					},
					{
						name: 'Get Question Count',
						value: 'getCount',
						description: 'Get the number of questions available for a category',
						action: 'Get question count for a category',
					},
					{
						name: 'Get Global Question Count',
						value: 'getGlobalCount',
						description: 'Get the total number of questions available across all categories',
						action: 'Get global question count',
					},
				],
				default: 'getMany',
			},
			{
				displayName: 'Category Name or ID',
				name: 'category',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCategoriesNoAny' },
				default: 9,
				displayOptions: { show: { resource: ['category'], operation: ['getCount'] } },
				description:
					'Trivia category to get the question count for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},

			// ══════════════════════════════════════════════════════════════════════
			// SESSION TOKEN
			// ══════════════════════════════════════════════════════════════════════
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['sessionToken'] } },
				options: [
					{
						name: 'Request',
						value: 'request',
						description: 'Request a new session token',
						action: 'Request a session token',
					},
					{
						name: 'Reset',
						value: 'reset',
						description: 'Reset an existing session token so its questions can be served again',
						action: 'Reset a session token',
					},
				],
				default: 'request',
			},
			{
				displayName: 'Token',
				name: 'token',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				required: true,
				displayOptions: { show: { resource: ['sessionToken'], operation: ['reset'] } },
				description: 'The session token to reset',
			},
		],
		usableAsTool: true,
	};

	methods = {
		loadOptions: {
			async getCategories(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = (await this.helpers.httpRequest({
					method: 'GET',
					url: `${API_BASE}/api_category.php`,
					json: true,
				})) as { trivia_categories: Array<{ id: number; name: string }> };

				return [
					{ name: 'Any Category', value: 0 },
					...response.trivia_categories.map((c) => ({ name: c.name, value: c.id })),
				];
			},
			async getCategoriesNoAny(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = (await this.helpers.httpRequest({
					method: 'GET',
					url: `${API_BASE}/api_category.php`,
					json: true,
				})) as { trivia_categories: Array<{ id: number; name: string }> };

				return response.trivia_categories.map((c) => ({ name: c.name, value: c.id }));
			},
		},
	};

	// ─── Execute ──────────────────────────────────────────────────────────────

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: unknown;

				// ── QUESTION ────────────────────────────────────────────────────────
				if (resource === 'question' && operation === 'getMany') {
					const amount = this.getNodeParameter('amount', i) as number;
					const category = this.getNodeParameter('category', i, 0) as number;
					const difficulty = this.getNodeParameter('difficulty', i, '') as string;
					const type = this.getNodeParameter('type', i, '') as string;
					const sessionToken = this.getNodeParameter('sessionToken', i, '') as string;

					const qs: IDataObject = { amount, encode: 'base64' };
					if (category) qs.category = category;
					if (difficulty) qs.difficulty = difficulty;
					if (type) qs.type = type;
					if (sessionToken) qs.token = sessionToken;

					const resp = (await openTriviaRequest(this, '/api.php', qs)) as {
						response_code: number;
						results: IDataObject[];
					};

					assertResponseCode(this, resp, i);
					responseData = resp.results.map(decodeQuestion);
				}

				// ── CATEGORY ────────────────────────────────────────────────────────
				if (resource === 'category' && operation === 'getMany') {
					const resp = (await openTriviaRequest(this, '/api_category.php')) as {
						trivia_categories: IDataObject[];
					};
					responseData = resp.trivia_categories;
				}

				if (resource === 'category' && operation === 'getCount') {
					const category = this.getNodeParameter('category', i) as number;
					responseData = await openTriviaRequest(this, '/api_count.php', { category });
				}

				if (resource === 'category' && operation === 'getGlobalCount') {
					responseData = await openTriviaRequest(this, '/api_count_global.php');
				}

				// ── SESSION TOKEN ───────────────────────────────────────────────────
				if (resource === 'sessionToken' && operation === 'request') {
					const resp = (await openTriviaRequest(this, '/api_token.php', {
						command: 'request',
					})) as { response_code: number; response_message: string; token: string };
					assertResponseCode(this, resp, i);
					responseData = resp;
				}

				if (resource === 'sessionToken' && operation === 'reset') {
					const token = this.getNodeParameter('token', i) as string;
					const resp = (await openTriviaRequest(this, '/api_token.php', {
						command: 'reset',
						token,
					})) as { response_code: number; response_message: string; token: string };
					assertResponseCode(this, resp, i);
					responseData = resp;
				}

				const execData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray((responseData ?? {}) as IDataObject | IDataObject[]),
					{ itemData: { item: i } },
				);
				returnData.push(...execData);
			} catch (error: unknown) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error instanceof Error ? error.message : String(error) },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(
					this.getNode(),
					error instanceof Error ? error : String(error),
					{ itemIndex: i },
				);
			}
		}

		return [returnData];
	}
}
