# n8n-nodes-opentrivia

This is an n8n community node. It lets you fetch trivia questions, categories, and session tokens from the [Open Trivia Database](https://opentdb.com) (opentdb.com) in your n8n workflows.

Open Trivia DB is a free, community-driven trivia question database. No API key or credentials are required to use it.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Resources & Operations](#resources--operations)
[Credentials](#credentials)
[Notes](#notes)
[Compatibility](#compatibility)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) for n8n community nodes.

For a self-hosted instance, you can also drop this package into your `N8N_CUSTOM_EXTENSIONS` folder and restart n8n:

```bash
npm install
npm run build
```

## Resources & Operations

### Question

- **Get Many** — Fetch one or more trivia questions.
  - `Amount` — number of questions to fetch (1–50).
  - `Category` — trivia category (loaded dynamically from the API), or "Any Category".
  - `Difficulty` — Any / Easy / Medium / Hard.
  - `Type` — Any / Multiple Choice / True-False.
  - `Session Token` — optional token to avoid getting repeated questions.

### Category

- **Get Many** — List all available trivia categories.
- **Get Question Count** — Get the number of questions available for a given category (broken down by difficulty).
- **Get Global Question Count** — Get the total number of questions available across all categories.

### Session Token

- **Request** — Request a new session token so the API can track which questions it has already served you.
- **Reset** — Reset an existing session token so its questions can be served again.

## Credentials

None. The Open Trivia Database API is free and does not require authentication.

## Notes

- Questions are always requested from the API with base64 encoding and decoded automatically by the node, so you get clean text in your output — no HTML entities (`&quot;`, `&#039;`, etc.) to clean up.
- Open Trivia DB rate-limits requests to one per 5 seconds per IP address (response code 5). If you hit this, add a delay between requests.
- The maximum number of questions per request is 50.

## Compatibility

- Requires n8n with `n8nNodesApiVersion` 1.
- Requires Node.js >= 22.

## Resources

- [Open Trivia Database API documentation](https://opentdb.com/api_config.php)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE)
