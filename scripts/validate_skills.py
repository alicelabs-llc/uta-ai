#!/usr/bin/env python3
"""Valida el frontmatter de skills/*/SKILL.md según agentskills.io.

Reglas: frontmatter YAML presente · name como slug · description presente
y <= 1024 chars. Exit 1 al primer fallo (para CI).
"""
import re
import sys
from pathlib import Path

MAX_DESC = 1024  # agentskills.io: description <= 1024
root = Path(__file__).resolve().parent.parent
skills = sorted(root.glob("skills/*/SKILL.md"))
failures = []

for sk in skills:
    text = sk.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not m:
        failures.append(f"{sk.name}: sin frontmatter YAML")
        continue
    fm = m.group(1)
    name = re.search(r"^name:\s*(\S+)", fm, re.M)
    if not name:
        failures.append(f"{sk.name}: falta name")
    elif not re.fullmatch(r"[a-z0-9][a-z0-9-]*", name.group(1)):
        failures.append(f"{sk.name}: name '{name.group(1)}' no es slug válido")
    desc = re.search(r"^description:\s*(.+?)(?=^\w|\Z)", fm, re.M | re.S)
    if not desc:
        failures.append(f"{sk.name}: falta description")
    elif len(desc.group(1).strip()) > MAX_DESC:
        failures.append(f"{sk.name}: description > {MAX_DESC} chars ({len(desc.group(1).strip())})")

if failures:
    for f in failures:
        print(f"FAIL {f}")
    sys.exit(1)

print(f"OK {len(skills)} skills válidas (agentskills.io)")
