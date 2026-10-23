---
name: uta
description: Verify, translate, issue, or bridge AI-agent trust credentials (ATC, JWT/OAuth, W3C VC, A2A Agent Card, EAT-AI, ZTA, MCP Server Card, X.509) through the live MarketNow Trust API with a fail-closed 12-stage pipeline. Use when a user asks to verify or validate an agent credential, convert between credential formats, check revocation, or explain why a trust verdict failed.
license: MIT
metadata:
  version: 0.1.0
  source: https://github.com/eddyflores100-lang/uta-ai
---

# UTA — Universal Trust Adapter (credential operations)

UTA translates between 9 agent-credential formats and verifies them through a
fail-closed 12-stage pipeline: `PARSE → DETECT → SCHEMA → CRYPTO → ISSUER →
KEY_BINDING → POP → PROVENANCE → LIFECYCLE → EVIDENCE → POLICY → DECISION`.

Supported formats: ATC v3, JWT/OAuth (RFC 7519), W3C VC (Ed25519Signature2020),
A2A Agent Card, EAT-AI (IETF draft), ZTA, MCP Server Card, X.509 (RFC 5280),
plus bridge A→B (verify in A, issue in B).

## Trust API (no auth)

```
GET  https://www.marketnow.site/api/trust                  service info
GET  https://www.marketnow.site/api/trust?action=formats   9 formats
GET  https://www.marketnow.site/api/trust?action=pipeline  12 stages
GET  https://www.marketnow.site/api/trust?action=revocation revocation methods
POST https://www.marketnow.site/api/trust?action=verify    verify credential (auto-detect format)
POST https://www.marketnow.site/api/trust?action=translate X→Y conversion
POST https://www.marketnow.site/api/trust?action=issue     issue credentials (MUTATING)
POST https://www.marketnow.site/api/trust?action=bridge    verify in A, issue in B (MUTATING)
GET  https://marketnow.site/api/ocsp?kid=<kid>             live OCSP (fail-closed)
```

Equivalent MCP tools on the remote server `https://marketnow.site/api/mcp`:
`marketnow_verify_trust`, `marketnow_translate_credential`,
`marketnow_list_formats`, `marketnow_get_pipeline`,
`marketnow_check_revocation`.

## Workflow

1. Identify the credential the user provides (paste, file, or URL). If the
   format is unclear, call `action=formats` and match characteristics, or rely
   on auto-detection in `action=verify`.
2. Verify with `action=verify`. Report the **stage-by-stage** result, not just
   the final verdict. When verification fails, name the failing stage and the
   reason it returned.
3. For format conversion, use `action=translate` with explicit source and
   target formats. Confirm the target with the user if ambiguous.
4. For revocation questions, use the OCSP endpoint or
   `marketnow_check_revocation` (ATC/CA status vs signed CRL).

## Hard rules

- **Golden rule: `UNKNOWN = DENY · ERROR = DENY · EXPIRED = DENY ·
  REVOKED = DENY`.** Never soften a `DENY` verdict in your response — report
  the failing stage and reason as-is. A "maybe valid" is a DENY.
- `issue` and `bridge` are **mutating** operations. Confirm with the user
  before calling them.
- Cite figures with date + source (e.g. "9 formats — /api/trust?action=formats,
  2026-10-23"). Figures drift; stale numbers are a credibility bug.
- Rate-limit friendly: cache responses with a TTL; do not hammer the API.

## Verification of this skill

The endpoints above were checked live against marketnow.site (health v4.2.0,
2026-10-23). If an endpoint returns unexpected results, prefer the live API
response over this file and report the discrepancy.
