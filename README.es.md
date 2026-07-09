# n8n-nodes-opentrivia

Este es un nodo comunitario de n8n. Permite obtener preguntas de trivia, categorías y tokens de sesión desde la [Open Trivia Database](https://opentdb.com) (opentdb.com) en tus flujos de trabajo de n8n.

Open Trivia DB es una base de datos de preguntas de trivia gratuita y comunitaria. No se necesita clave de API ni credenciales para usarla.

[n8n](https://n8n.io/) es una plataforma de automatización de flujos de trabajo con licencia [fair-code](https://docs.n8n.io/reference/license/).

[Instalación](#instalación)
[Recursos y operaciones](#recursos-y-operaciones)
[Credenciales](#credenciales)
[Notas](#notas)
[Compatibilidad](#compatibilidad)
[Recursos externos](#recursos-externos)

## Instalación

Sigue la [guía de instalación](https://docs.n8n.io/integrations/community-nodes/installation/) de los nodos comunitarios de n8n.

Para una instancia autoalojada, también puedes colocar este paquete en tu carpeta `N8N_CUSTOM_EXTENSIONS` y reiniciar n8n:

```bash
npm install
npm run build
```

## Recursos y operaciones

### Question

- **Get Many** — Obtiene una o varias preguntas de trivia.
  - `Amount` — número de preguntas a obtener (1 a 50).
  - `Category` — categoría de trivia (cargada dinámicamente desde la API), o «Any Category».
  - `Difficulty` — Any / Easy / Medium / Hard.
  - `Type` — Any / Multiple Choice / True-False.
  - `Session Token` — token opcional para evitar recibir preguntas repetidas.

### Category

- **Get Many** — Lista todas las categorías de trivia disponibles.
- **Get Question Count** — Obtiene el número de preguntas disponibles para una categoría dada (desglosado por dificultad).
- **Get Global Question Count** — Obtiene el número total de preguntas disponibles en todas las categorías.

### Session Token

- **Request** — Solicita un nuevo token de sesión para que la API pueda rastrear qué preguntas ya te ha servido.
- **Reset** — Reinicia un token de sesión existente para que sus preguntas puedan servirse de nuevo.

## Credenciales

Ninguna. La API de Open Trivia Database es gratuita y no requiere autenticación.

## Notas

- Las preguntas siempre se solicitan a la API con codificación base64 y el nodo las decodifica automáticamente, por lo que obtienes texto limpio en la salida, sin entidades HTML (`&quot;`, `&#039;`, etc.) que limpiar.
- Open Trivia DB limita las solicitudes a una cada 5 segundos por dirección IP (código de respuesta 5). Si alcanzas este límite, añade una pausa entre solicitudes.
- El número máximo de preguntas por solicitud es 50.

## Compatibilidad

- Requiere n8n con `n8nNodesApiVersion` 1.
- Requiere Node.js >= 22.

## Recursos externos

- [Documentación de la API de Open Trivia Database](https://opentdb.com/api_config.php)
- [Documentación de nodos comunitarios de n8n](https://docs.n8n.io/integrations/community-nodes/)

## Licencia

[MIT](LICENSE)
