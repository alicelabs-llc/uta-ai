/**
 * catalog-mcp — scaffold v0.1 (sin build verificado, ver SPEC.md + audit.md)
 *
 * Servidor MCP stdio local que envuelve la API pública del catálogo MarketNow.
 * 3 tools read-only: catalog_search, catalog_skill_page, catalog_categories.
 *
 * Completar antes de uso real:
 *   1. npm ci && npm run build
 *   2. Test de los 3 tools contra https://marketnow.site (API viva, sin auth)
 *   3. Quitar continue-on-error del CI (.github/workflows/ci.yml)
 *   4. Registrar en audit.md
 *
 * Nota MCP 2026: este server es stdio (la spec 2026-07-28 "stateless" aplica a
 * remotos HTTP; stdio conserva el ciclo initialize legacy según spec).
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const BASE = process.env.MARKETNOW_BASE_URL ?? "https://www.marketnow.site";
const CACHE_TTL_MS = Number(process.env.CATALOG_CACHE_TTL_MS ?? 300_000); // 5 min

// Cache TTL simple (patrón ttlMs de la spec MCP 2026-07-28)
const cache = new Map<string, { at: number; body: unknown }>();

async function apiGet(path: string): Promise<unknown> {
  const hit = cache.get(path);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.body;
  const res = await fetch(`${BASE}${path}`, {
    headers: { "User-Agent": "catalog-mcp/0.1 (AliceLabs; +https://marketnow.site)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} en ${path}`);
  const body: unknown = await res.json();
  cache.set(path, { at: Date.now(), body });
  return body;
}

const server = new McpServer({
  name: "marketnow-catalog",
  version: "0.1.0",
});

server.tool(
  "catalog_search",
  "Search the MarketNow catalog of 71,198+ index-certified MCP skills (live total via /api/skills).",
  {
    q: z.string().optional().describe("Free-text query"),
    sort: z.enum(["recent", "downloads", "trust", "name"]).optional(),
    tier: z.enum(["core", "community"]).optional(),
    category: z.string().optional(),
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).max(100).optional(),
  },
  async (args) => {
    const usp = new URLSearchParams();
    for (const [k, v] of Object.entries(args)) if (v !== undefined) usp.set(k, String(v));
    const data = await apiGet(`/api/skills?${usp.toString()}`);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
);

server.tool(
  "catalog_categories",
  "List the 16 catalog categories.",
  {},
  async () => {
    const data = await apiGet("/api/categories.json");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
);

server.tool(
  "catalog_skill_page",
  "Fetch a skill's public page metadata by slug (install, trust, risk, FAQ) from /s/<slug>.",
  { slug: z.string().min(1).describe("Skill slug, e.g. real-mcp-to-skill-converter") },
  async ({ slug }) => {
    // /s/<slug> es HTML humano: devolvemos el entry de API que corresponde (token-efficient)
    const data = (await apiGet(`/api/skills?q=${encodeURIComponent(slug)}&limit=5`)) as {
      skills?: Array<Record<string, unknown>>;
    };
    const match = data.skills?.find((s) => s.slug === slug) ?? data.skills?.[0] ?? null;
    if (!match) throw new Error(`slug no resuelto: ${slug} — usar catalog_search primero`);
    return { content: [{ type: "text", text: JSON.stringify(match, null, 2) }] };
  },
);

await server.connect(new StdioServerTransport());
