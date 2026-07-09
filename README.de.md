# n8n-nodes-opentrivia

Dies ist ein n8n-Community-Node. Er ermöglicht es, Trivia-Fragen, Kategorien und Sitzungstoken von der [Open Trivia Database](https://opentdb.com) (opentdb.com) in deinen n8n-Workflows abzurufen.

Open Trivia DB ist eine kostenlose, community-basierte Quizfragendatenbank. Es wird kein API-Schlüssel und keine Anmeldedaten benötigt.

[n8n](https://n8n.io/) ist eine Workflow-Automatisierungsplattform mit [Fair-Code-Lizenz](https://docs.n8n.io/reference/license/).

[Installation](#installation)
[Ressourcen und Operationen](#ressourcen-und-operationen)
[Anmeldedaten](#anmeldedaten)
[Hinweise](#hinweise)
[Kompatibilität](#kompatibilität)
[Externe Ressourcen](#externe-ressourcen)

## Installation

Folge der [Installationsanleitung](https://docs.n8n.io/integrations/community-nodes/installation/) für n8n-Community-Nodes.

Bei einer selbst gehosteten Instanz kannst du dieses Paket auch in deinen `N8N_CUSTOM_EXTENSIONS`-Ordner legen und n8n neu starten:

```bash
npm install
npm run build
```

## Ressourcen und Operationen

### Question

- **Get Many** — Ruft eine oder mehrere Trivia-Fragen ab.
  - `Amount` — Anzahl der abzurufenden Fragen (1 bis 50).
  - `Category` — Trivia-Kategorie (wird dynamisch von der API geladen), oder „Any Category“.
  - `Difficulty` — Any / Easy / Medium / Hard.
  - `Type` — Any / Multiple Choice / True-False.
  - `Session Token` — optionales Token, um wiederholte Fragen zu vermeiden.

### Category

- **Get Many** — Listet alle verfügbaren Trivia-Kategorien auf.
- **Get Question Count** — Ruft die Anzahl der verfügbaren Fragen für eine bestimmte Kategorie ab (aufgeschlüsselt nach Schwierigkeitsgrad).
- **Get Global Question Count** — Ruft die Gesamtzahl der verfügbaren Fragen über alle Kategorien hinweg ab.

### Session Token

- **Request** — Fordert ein neues Sitzungstoken an, damit die API nachverfolgen kann, welche Fragen dir bereits geliefert wurden.
- **Reset** — Setzt ein vorhandenes Sitzungstoken zurück, damit dessen Fragen erneut geliefert werden können.

## Anmeldedaten

Keine. Die Open-Trivia-Database-API ist kostenlos und erfordert keine Authentifizierung.

## Hinweise

- Fragen werden immer base64-kodiert von der API angefordert und vom Node automatisch dekodiert — du erhältst also saubere Texte in der Ausgabe, ohne HTML-Entities (`&quot;`, `&#039;` usw.), die bereinigt werden müssten.
- Open Trivia DB begrenzt Anfragen auf eine pro 5 Sekunden pro IP-Adresse (Antwortcode 5). Wenn dieses Limit erreicht wird, füge eine Verzögerung zwischen den Anfragen ein.
- Die maximale Anzahl an Fragen pro Anfrage beträgt 50.

## Kompatibilität

- Erfordert n8n mit `n8nNodesApiVersion` 1.
- Erfordert Node.js >= 22.

## Externe Ressourcen

- [Dokumentation der Open-Trivia-Database-API](https://opentdb.com/api_config.php)
- [Dokumentation zu n8n-Community-Nodes](https://docs.n8n.io/integrations/community-nodes/)

## Lizenz

[MIT](LICENSE)
