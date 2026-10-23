---
name: sentinel-audit
description: Audit and certify an MCP server, npm package, or agent tool for security and trust. Combines Sentinel certification (L1 catalog checks, L2 deep tarball scans with 29 rules) with the UTA Shield provider-side firewall checklist (identity gates, IOC blocking, rate limits, DLP masking, metering, fail-closed audit). Use when asked to audit, certify, score, badge, or harden an MCP server or AI tool.
license: MIT
metadata:
  version: 0.1.0
  source: https://github.com/eddyflores100-lang/uta-ai
---

# Sentinel audit — certify an MCP server

Two complementary layers, both live:

1. **Sentinel certification** (marketnow.site): index-level (L1) and deep
   tarball (L2) scans of npm/MCP artifacts, with public methodology and
   evidence.
2. **UTA Shield firewall audit** (provider-side): a runtime firewall for MCP
   servers — verified identity, IOC/campaign blocking on args AND responses,
   two-tier rate limits, DLP masking, per-call metering, fail-closed JSONL
   audit trail. Zero dependencies, ships as `npx uta-shield mcp`.

## Sentinel endpoints (no auth)

```
GET https://www.marketnow.site/api/certification                 L1/L2 methodology + checks
GET https://www.marketnow.site/api/certification?package=<name>  deep-scan verdict for a package (L2 subset)
GET https://www.marketnow.site/api/certification-scans.json      raw 29-rule findings (shasum-verified)
GET https://www.marketnow.site/api/security                      10 security layers with evidence
GET https://www.marketnow.site/api/sentinel-benchmark.json       precision/recall/F1
GET https://www.marketnow.site/api/badge/<slug>.svg              embeddable trust badge
GET https://www.marketnow.site/s/<slug>                          public page per skill
```

MCP equivalent on `https://marketnow.site/api/mcp`: `marketnow_fingerprint_tool`
(SHA-256 + RFC 8785 JCS fingerprint of tool definitions — detects tool-surface
drift between versions).

## UTA Shield firewall checklist (runtime audit)

For each control, mark PRESENT / MISSING / UNVERIFIED in the report:

- [ ] **Identity gates** — every caller authenticated; anonymous callers rejected
      before reaching the upstream tool.
- [ ] **IOC blocking (inbound)** — tool arguments screened against a
      threat-intel feed; blocked IOC classes documented.
- [ ] **IOC blocking (outbound)** — responses screened too; exfiltration
      attempts (secrets, feed resale) caught on the way out.
- [ ] **Rate limits** — per-agent two-tier limits (normal + burst), enforced
      server-side, not client-honored.
- [ ] **DLP masking** — sensitive patterns masked in responses; masking happens
      before the audit log write, not after.
- [ ] **Metering** — per-call usage records (x402-ready) so the operator can
      charge per use.
- [ ] **Fail-closed audit** — audit trail written on failure paths; admin
      endpoint returns 404 without credentials and requires a timing-safe
      admin header (`x-uta-admin`) when enabled; IOCs and agent names in the
      trail are operator telemetry, never public.
- [ ] **Safe errors** — upstream failures return fixed messages; detail goes to
      the audit log, never the client.
- [ ] **Supply chain** — dependency count and unpacked size stated (reference
      implementation: `uta-shield`, 0 runtime dependencies).

Live reference implementation: `npx uta-shield mcp` (npm `uta-shield`,
https://wall.utalabs.tech, listed in the Official MCP Registry as
`io.github.eddyflores100-lang/uta-shield`).

## Report structure

1. **Verdict** — certify / certify-with-conditions / reject, in the first line.
2. **Sentinel evidence** — L1 checks passed, L2 rule findings (cite
   `/api/certification?package=` response verbatim).
3. **Firewall checklist** — the 9 items above with PRESENT/MISSING/UNVERIFIED.
4. **Hardening roadmap** — top 5 gaps, each with the smallest change that
   closes it.
5. **Badge** — if certified, embed `badge_url` from the catalog entry.

## Hard rules

- Never certify what you could not check — write UNVERIFIED, not a guess.
- A security product with 47 transitive dependencies is an attack surface, not
  a defense: always report dependency count and unpacked size.
- Cite figures with date + source. Figures drift; stale numbers are a
  credibility bug.
