# n8n-nodes-opentrivia

Ce package est un node communautaire n8n. Il permet de récupérer des questions de culture générale, des catégories et des jetons de session depuis l'[Open Trivia Database](https://opentdb.com) (opentdb.com) dans vos workflows n8n.

Open Trivia DB est une base de questions de quiz gratuite et communautaire. Aucune clé d'API ni identifiant n'est nécessaire pour l'utiliser.

[n8n](https://n8n.io/) est une plateforme d'automatisation de workflows sous licence [fair-code](https://docs.n8n.io/reference/license/).

[Installation](#installation)
[Ressources et opérations](#ressources-et-opérations)
[Identifiants](#identifiants)
[Remarques](#remarques)
[Compatibilité](#compatibilité)
[Ressources externes](#ressources-externes)

## Installation

Suivez le [guide d'installation](https://docs.n8n.io/integrations/community-nodes/installation/) des nodes communautaires n8n.

Pour une instance auto-hébergée, vous pouvez aussi placer ce package dans votre dossier `N8N_CUSTOM_EXTENSIONS` et redémarrer n8n :

```bash
npm install
npm run build
```

## Ressources et opérations

### Question

- **Get Many** — Récupère une ou plusieurs questions de quiz.
  - `Amount` — nombre de questions à récupérer (1 à 50).
  - `Category` — catégorie de quiz (chargée dynamiquement depuis l'API), ou « Any Category ».
  - `Difficulty` — Any / Easy / Medium / Hard.
  - `Type` — Any / Multiple Choice / True-False.
  - `Session Token` — jeton optionnel pour éviter de recevoir des questions déjà servies.

### Category

- **Get Many** — Liste toutes les catégories de quiz disponibles.
- **Get Question Count** — Récupère le nombre de questions disponibles pour une catégorie donnée (détaillé par difficulté).
- **Get Global Question Count** — Récupère le nombre total de questions disponibles sur toutes les catégories.

### Session Token

- **Request** — Demande un nouveau jeton de session pour que l'API puisse suivre les questions déjà servies.
- **Reset** — Réinitialise un jeton de session existant pour que ses questions puissent être servies à nouveau.

## Identifiants

Aucun. L'API Open Trivia Database est gratuite et ne nécessite pas d'authentification.

## Remarques

- Les questions sont toujours demandées à l'API avec un encodage base64, puis décodées automatiquement par le node : vous obtenez donc un texte propre en sortie, sans entités HTML (`&quot;`, `&#039;`, etc.) à nettoyer.
- Open Trivia DB limite les requêtes à une par 5 secondes par adresse IP (code de réponse 5). Si vous atteignez cette limite, ajoutez un délai entre vos requêtes.
- Le nombre maximum de questions par requête est de 50.

## Compatibilité

- Nécessite n8n avec `n8nNodesApiVersion` 1.
- Nécessite Node.js >= 22.

## Ressources externes

- [Documentation de l'API Open Trivia Database](https://opentdb.com/api_config.php)
- [Documentation des nodes communautaires n8n](https://docs.n8n.io/integrations/community-nodes/)

## Licence

[MIT](LICENSE)
