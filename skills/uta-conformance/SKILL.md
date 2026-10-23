---
name: uta-conformance
description: Run the UTA conformance suite (npm @marketnow/uta-conformance, 36 vectors — positive, negative, mutation, and cross-language) against a UTA implementation, or inspect live conformance vectors to verify third-party interop. Use when asked to run conformance tests, check interop compatibility, or produce expected-outcome-per-stage results for the 12-stage trust pipeline.
license: AL-1.0
metadata:
  version: 0.1.0
  source: https://github.com/eddyflores100-lang/uta-ai
---

# UTA conformance — interop test vectors

The UTA conformance suite proves that a Universal Trust Adapter implementation
behaves identically across languages and vendors. Every vector declares the
expected outcome **per pipeline stage** (PARSE → DETECT → SCHEMA → CRYPTO →
ISSUER → KEY_BINDING → POP → PROVENANCE → LIFECYCLE → EVIDENCE → POLICY →
DECISION), not just a final verdict — so a failure pinpoints the broken stage.

## Live vectors

```
GET https://marketnow.site/uta/conformance/vectors/_index.json
    schema 1.6.0, third_party_interop: true
    36 vectors: 8 positive + 17 negative + 5 mutation + 6 cross-language
```

Fetch the index, pick vectors by class, and evaluate an implementation against
each vector's `expected` map stage by stage.

## Run the suite

```bash
npm install @marketnow/uta-conformance   # latest 1.4.0 as of 2026-10-23
npx uta-conformance --target <implementation-url-or-module>
```

Check `npm view @marketnow/uta-conformance version` for the current version
before citing it.

## Reading results

- **Positive vectors** — must yield the expected final verdict AND the expected
  per-stage outcomes. A correct verdict with wrong stage outcomes is a FAILURE
  (the implementation is right by accident).
- **Negative vectors** — must fail at the documented stage with the documented
  reason. Golden rule applies: `UNKNOWN = DENY · ERROR = DENY · EXPIRED = DENY
  · REVOKED = DENY`.
- **Mutation vectors** — tampered credentials must be rejected; any ACCEPT is a
  critical finding.
- **Cross-language vectors** — the same input must produce byte-identical
  stage outcomes across implementations (e.g. TypeScript vs Go).

## Report structure

1. Suite version + vector index schema version + date fetched.
2. Table: vector id → class → expected outcome → actual outcome → PASS/FAIL.
3. For each FAIL: failing stage, expected vs actual reason string, minimal
   repro.
4. Interop verdict: PASS only if every cross-language vector is byte-identical.

## Hard rules

- Never mark a vector PASS without executing it. Report skips as skips.
- If the live `_index.json` disagrees with this file (vector count, schema
  version), the live index wins — note the discrepancy in the report.
