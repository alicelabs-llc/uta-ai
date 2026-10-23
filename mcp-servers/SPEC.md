# MCP servers — spec y scaffold

Réplica del patrón `mcp-servers/taiko-data` (16 tools) · `taiko-explorer` (10) · `taiko-bridge` (8) · `taiko-node-monitor` (7): **servidores MCP locales (stdio) que envuelven la superficie viva de MarketNow/UTA** para que un agente sin red pública o con política de allowlists pueda operar.

La superficie REMOTA ya existe y está viva (`https://marketnow.site/api/mcp`, 9 tools — ver skills/marketnow-catalog). Estos servidores LOCALES son la capa de acceso determinista + cache + offline.

## uta-local (TypeScript — por construir en el próximo BOOT)

Envuelve `/api/trust` + OCSP. 8 tools:

| Tool | Type | Envuelve | Env |
|---|---|---|---|
| `uta_service_info` | read | `GET /api/trust` | — |
| `uta_list_formats` | read | `GET /api/trust?action=formats` | — |
| `uta_get_pipeline` | read | `GET /api/trust?action=pipeline` | — |
| `uta_verify` | read | `POST /api/trust?action=verify` | — |
| `uta_translate` | read | `POST /api/trust?action=translate` | — |
| `uta_issue` | **write** | `POST /api/trust?action=issue` | `UTA_ISSUE_TOKEN` |
| `uta_bridge` | **write** | `POST /api/trust?action=bridge` | `UTA_ISSUE_TOKEN` |
| `uta_check_revocation` | read | `GET /api/ocsp?kid=` | — |

Reglas: tools write piden confirmación explícita del host (destructiveHint) · veredictos fail-closed sin reinterpretación · `--json` schema de salida fijo: `{ schema_version, command, status, network, data, errors, warnings, metrics }` (patrón CLI de taiko-ai).

## catalog-cache (scaffold incluido aquí — v0.1)

Envuelve `/api/skills` + `/api/categories.json` con cache TTL. 3 tools read-only:

| Tool | Envuelve |
|---|---|
| `catalog_search` | `GET /api/skills?q=&sort=&tier=&limit=` |
| `catalog_skill_page` | `GET /s/<slug>` (metadatos del resultado) |
| `catalog_categories` | `GET /api/categories.json` |

Estado: **scaffold v0.1 sin build verificado** (este entorno no corre npm ci contra la registry) — ver audit.md §1. Completar con: `npm ci && npm run build`, test de los 3 tools contra la API viva, y luego quitar `continue-on-error` del CI.

## Convenciones (copiadas de taiko-ai y endurecidas)

1. Env vars documentadas en cada README de server; secretos solo como huella 4+4 en logs.
2. Respuestas token-efficiency: campos exactos, sin payloads completos de la API (paginar server-side).
3. `inputSchema` JSON Schema 2020-12 · `tools/list` determinista · sin batching legacy.
4. Cada server con su `audit.md` entry cuando se complete (categorías: bugs / reglas / token-efficiency).
