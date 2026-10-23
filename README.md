# uta-ai — Official AI agent surface for UTA & MarketNow

> Réplica del patrón verificado en `taikoxyz/taiko-ai` (caso de estudio 21-oct-2026): **el proyecto entero como superficie de agente** — skills instalables, subagentes especializados, servidores MCP, plugin de Claude Code y auditoría de PRs por el propio agente.
> UTA = Universal Trust Adapter: traduce entre 9 formatos de credenciales de agentes para que cualquier agente verifique a cualquier otro (v4.0.0, 71,198 skills indexadas — `/api/skills`, 21-oct-2026).

## Qué contiene

| Directorio | Qué es | Equivalente en taiko-ai |
|---|---|---|
| `skills/` | 4 skills formato agentskills.io (SKILL.md con frontmatter) | `skills/taiko`, `taiko-node`... |
| `agents/` | 2 definiciones de subagentes especializados (markdown con frontmatter) | `agents/taiko-developer.md` |
| `mcp-servers/` | Spec + scaffold de servidores MCP locales (stdio) | `mcp-servers/taiko-data` (16 tools) |
| `.claude-plugin/` | `marketplace.json` + `plugin.json` para Claude Code | idéntico |
| `audit.md` | Auditoría de PRs HECHA POR el agente (bugs / violaciones de reglas / eficiencia de tokens) | `audit.md` del PR #12 |
| `.github/workflows/` | CI + **drift-check**: detector diario de cifras muertas (números vivos automatizado) | `.github/workflows/` |
| `site-agent-first/` | Artefactos para servir en marketnow.site: `/SKILL.md`, generador `/llms.txt` v2, reporte de gaps | `taiko-docs` (llms.txt, SKILL.md) |

## Instalación (3 vías, como taiko-ai)

```bash
# 1. Como skills del estándar abierto (Cursor, Copilot, Windsurf, Cline, Codex...)
npx skills add alicelabs-llc/uta-ai

# 2. Como plugin de Claude Code
/plugin marketplace add alicelabs-llc/uta-ai
/plugin install uta@alicelabs-llc

# 3. Servidor MCP remoto (ya vivo, no requiere este repo)
{
  "mcpServers": {
    "marketnow": {
      "url": "https://marketnow.site/api/mcp"
    }
  }
}
```

## Superficie viva detrás de este repo (verificada 21-oct-2026)

- **API de confianza (sin auth)**: `GET/POST https://www.marketnow.site/api/trust` — verify / translate / issue / bridge (pipeline fail-closed de 12 etapas: `UNKNOWN = DENY`).
- **9 tools MCP remotas** en `https://marketnow.site/api/mcp`: `marketnow_search_skills`, `marketnow_verify_trust`, `marketnow_translate_credential`, `marketnow_list_formats`, `marketnow_get_pipeline`, `marketnow_check_domain`, `marketnow_check_revocation`, `marketnow_fingerprint_tool`, `marketnow_submit_skill`.
- **Catálogo**: 71,198 skills indexadas (L1) + 135,547 en tracker de ecosistema — `/api/skills` paginado, `/api/categories.json`, página pública por skill en `/s/<slug>`, badge SVG por skill.
- **Agent card**: `https://marketnow.site/api/agent.json` (v4.0.0) y well-known `/.well-known/agent.json`.
- **Conformance**: `@marketnow/uta-conformance@1.4.0` (npm) + vectores vivos en `/uta/conformance/vectors/_index.json` (schema 1.6.0).

## Los 4 skills

| Skill | Dispara cuando |
|---|---|
| `uta` | "UTA", "verify credential", "ATC", "trust card", "translate credential", "revocation" |
| `sentinel-audit` | "audita este MCP", "certifica", "trust score", "badge", "publish skill" |
| `marketnow-catalog` | "busca skills", "catálogo", "recomienda un MCP para X" |
| `uta-conformance` | "corre la conformance", "vectores", "expected outcomes", "interop third-party" |

## Estado del scaffold y roles

- **Hecho por el agente (YO)**: todos los SKILL.md, agents/, plugin, spec de MCP servers, audit.md, workflows, artefactos del sitio — este repo ES el entregable.
- **Scaffold v0.1** (`mcp-servers/catalog-mcp/`): implementación mínima a validar con `npm ci && npm run build` antes de usar — el agente la completa contra la API viva en el próximo BOOT con credenciales.
- **Drift-check en CI**: cada día compara el total vivo de `/api/skills` contra el número escrito en `llms.txt`/`SKILL.md` — si difiere, falla el build. El "número muerto = bug de credibilidad" queda automatizado.

## Licencia

MIT — see `LICENSE`. Scope: the uta-ai agent surface only; the UTA core stays AL-1.0 source-available at alicelabs-llc/universal-trust-adapter (https://marketnow.site/licensing).

## Caso de estudio origen

Análisis completo y plan de réplica: `agente-marketnow-v2/iniciativa-agent-first/` (CASO_ESTUDIO_TAIKO.md · PLAN_REPLICACION.md). Fuentes verificadas 21-oct-2026: github.com/taikoxyz/taiko-ai (91 commits, v1.5.0, contribuidores dantaik + claude) · github.com/taikoxyz/taiko-docs (llms.txt / llms-full.txt / .md por página / SKILL.md).
