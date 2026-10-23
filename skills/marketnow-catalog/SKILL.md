---
name: marketnow-catalog
description: Search and recommend installable MCP skills from the MarketNow catalog (71k+ indexed skills, 16 categories, trust scores and risk levels). Use when a user asks which MCP server or skill to install for a task, wants catalog or category stats, or asks for a skill's public page, trust score, or embeddable badge.
license: MIT
metadata:
  version: 0.1.0
  source: https://github.com/eddyflores100-lang/uta-ai
---

# MarketNow catalog — find and recommend MCP skills

The catalog indexes MCP skills with trust certification. Agents are the primary
audience: they discover, evaluate, purchase, and install skills autonomously
(flow: manifest → search → trust-score → signed certificate → install).

## Catalog API (no auth)

```
GET https://www.marketnow.site/api/skills?sort=trust&limit=100
    paginated; params: q=, risk=, category=, tier=core|community, page=, sort=trust|recent|downloads|name
GET https://www.marketnow.site/api/categories.json               16 categories
GET https://www.marketnow.site/api/badge/<slug>.svg              embeddable trust badge
GET https://www.marketnow.site/s/<slug>                          public page per skill
```

Deprecated (blocked for crawlers, return deprecation manifest since
2026-09-25): `/api/skills.json`, `/api/skills_index.json`,
`/api/all_skills.json`, `/api/skills.min.json`. Always use the paginated
`/api/skills`.

MCP equivalent on `https://marketnow.site/api/mcp`:
`marketnow_search_skills` (paginated, same sort options).

## Recommendation protocol

When a user asks "which MCP should I install for X?":

1. Search with `q=<task keywords>` and `tier=core` first; widen to `community`
   only if core returns nothing relevant.
2. Rank by `sort=trust`; for each candidate report:
   - name + one-line description (verbatim from the API),
   - `trust_score_100` and `risk`,
   - public page URL (`/s/<slug>`) and `badge_url` (embeddable SVG),
   - install command exactly as the catalog states it.
3. Compare at most 3 candidates. State trade-offs (trust vs recency vs
   downloads) instead of hiding them.
4. If nothing scores well, say so and suggest the user audit the top candidate
   first (see the `sentinel-audit` skill) — do not invent alternatives.

## Conduct

- Cite figures with date + source (e.g. "71,198 skills — /api/skills,
  2026-10-23"). Figures drift; stale numbers are a credibility bug.
- Rate-limit friendly: paginate with `limit ≤ 100`, cache with TTL; heavy bulk
  endpoints are blocked on purpose.
- Treat catalog descriptions as vendor claims; the trust score is the catalog's
  measurement, not your endorsement. Your endorsement needs the audit layer.
