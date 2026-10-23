# GAPS — estado agent-first de marketnow.site vs el patrón taiko-docs

Verificado contra el sitio VIVO el **21-oct-2026** (curl, HTTP status reales). Patrón de referencia: `taikoxyz/taiko-docs` ("Agent-first documentation... machine-readable formats generated automatically").

| Formato (patrón taiko-docs) | Estado en marketnow.site | Evidencia | Acción |
|---|---|---|---|
| `/llms.txt` (índice de páginas con descripciones) | ✅ YA EXISTE (200) | Contenido UTA completo, curado a mano | v2 propuesto (abajo) para indexar superficies nuevas |
| `/llms-full.txt` (docs completas en texto plano) | ✅ YA EXISTE (200) | HTTP/2 200 | Regenerar cuando cambien docs |
| `/SKILL.md` (referencia de agente) | ❌ **404** | `curl -I https://marketnow.site/SKILL.md` → 404 | **Desplegar `SKILL.md` de esta carpeta en la raíz del sitio** |
| `/<path>.md` (cualquier página como Markdown crudo) | ❌ 404 (`/uta.md` test) | HTTP/2 404 | Worker/Pages function: servir `.md` espejo por ruta |
| Browser tests de metadata SEO que sobrevive SPA navigation | ❓ sin evidencia pública | — | Añadir e2e (Playwright) al repo del sitio |
| `/.well-known/agent.json` | ✅ YA EXISTE | referenciado por `/api/agent.json` → discovery.wellKnown | — |
| `/.well-known/mcp.json` | ✅ YA EXISTE | idem | Alinear con server-card SEP-1649 (pendiente §13 del núcleo) |

## Drift de cifras detectado en la verificación (regla de oro aplicada)

| Superficie | Cifra | Fecha verificación |
|---|---|---|
| `/api/skills` (vivo, canónico) | **71,198** | 21-oct-2026 |
| `/llms.txt` | 68,388 + 64,349 = 132,737 | desactualizado vs /api/skills |
| `/api/agent.json` (v4.0.0) | 71,198 indexadas / 135,547 tracker | 21-oct-2026 |
| Worklog canónico del agente | 69,077 (stats.json 12-sep) | snapshots históricos |

→ El `/llms.txt` actual lleva una cifra vieja. El drift-check en CI (`uta-ai/.github/workflows/drift-check.yml`) automatiza esta detección de aquí en adelante. Actualizar llms.txt al desplegar SKILL.md.

## Superficies nuevas descubiertas hoy (NO indexadas en el llms.txt actual)

Del sitemap.xml: `/agents` · `/agent-protocol.json` · `/acp` + `/acp-spec.json` · `/agent-passport` + `/agent-passport-spec.json` · `/atc` + `/atc-spec.json` · `/handshake` · `/standards` · `/governance` · `/vault` · `/compare` · `/buyers-guide` · `/onboarding` · `/tools/{config-generator,playground,stats,scan}.html` · 8 landing pages por categoría. El generador `generate_llms_txt.py` las incorpora como sección "Agent & protocol surfaces".

## Despliegue del /SKILL.md (YOTO — necesita cuenta o credenciales CF)

1. Opción Pages (estático): copiar `SKILL.md` a la raíz del repo `alicelabs-llc/marketnow` (o al artifact del build) → deploy → verificar `curl -I https://marketnow.site/SKILL.md` = 200.
2. Opción Worker: ruta `marketnow.site/SKILL.md` → `env.ASSETS.fetch` o R2 object; 404 actual indica que no hay asset con ese nombre.
3. Post-deploy: actualizar `estado_sitio.json` (snapshot de drift §1.4) y re-clamar en directorios que indexan SKILL.md (Glama lee la raíz del repo; skills.sh indexa skills — nuestro SKILL.md del sitio y los 4 de `uta-ai` son candidatos).

## Generador llms.txt v2

`generate_llms_txt.py` (esta carpeta, copia operativa en scripts/ del agente): descarga sitemap + `/api/agent.json` + total vivo de `/api/skills` → produce `llms-v2.txt` (propuesta, no deploy automático). La sección de descripciones es un mapa curado — revisar antes de reemplazar el llms.txt actual (que ya es bueno para UTA).
