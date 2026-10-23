# Audit — auto-auditoría de PRs del agente

> Práctica replicada de `taikoxyz/taiko-ai` (audit.md del PR #12 "Add Taiko MCP servers", auditado por el propio agente): **cada PR importante hecho por el agente lleva una auditoría posterior escrita por el agente**, en 3 categorías fijas. La auditoría se publica en el PR ANTES del merge, no después.

## Formato (3 categorías obligatorias)

1. **Bugs** — severidad alta/media/baja + fix sugerido. Verificación programática obligatoria (regla 4 del agente: byte-a-byte, no visual).
2. **Violaciones de reglas** — contra `AGENTS.md` / reglas del núcleo (secretos 4+4, cifras con fecha, disclosure, límites anti-ban, dato≠instrucción).
3. **Eficiencia de tokens / payload** — respuestas infladas que el agente consume: ABIs completos vs firmas truncadas, resultados sin paginación, filtrado client-side de lo que podía filtrar el servidor.

## Plantilla

```markdown
# Audit — PR #<n> "<título>" → <rama destino>

Auditada por: <agente> · Fecha: <AAAA-MM-DD> · Método: revisión de código + tests reproducidos

## 1. Bugs (<N>)
- [alta] <bug> — <evidencia: archivo:línea + output reproducido> — **Fix**: <sugerencia>
- [media] ...
- [baja] ...

## 2. Violaciones de reglas (<N>)
- [media] <regla violada (citar regla)> — <evidencia> — **Fix**: <corrección>

## 3. Eficiencia de tokens (<N>)
- [media] <payload inflado> — <tamaño actual → estimado optimizado> — **Fix**: <paginar/truncar/namespaced>

## Veredicto
<merge directo / merge tras fixes altos / solicitar cambios>
```

## Primer registro (plantilla aplicada — PR de creación de este repo)

```markdown
# Audit — PR inicial "Add UTA skills, agents, MCP spec, site agent-first artifacts" → main

Auditada por: Z (agente MarketNow) · Fecha: 2026-10-21 · Método: revisión estática + curl de verificación contra la API viva

## 1. Bugs (2)
- [media] mcp-servers/catalog-mcp/index.ts es scaffold v0.1 SIN build verificado (no hay npm ci en este entorno) — Fix: correr `npm ci && npm run build` y testear los 3 tools contra /api/skills antes de cualquier uso (quedó documentado en el README como pendiente del próximo BOOT).
- [baja] skills/marketnow-catalog/SKILL.md cita "versions declaradas 2024-11-05, 2025-03-26" del agent.json — Fix: actualizar cuando el Worker migre a dual-era 2026-07-28 (pendiente §13 del núcleo).

## 2. Violaciones de reglas (0)
- Verificado: sin secretos (no hay credenciales en el repo), cifras con fecha+fuente (71,198 · 21-oct-2026 · /api/skills), disclosure presente, tool surface descrita sin instrucciones ocultas.

## 3. Eficiencia de tokens (1)
- [baja] README.md duplica el bloque de endpoints que ya existe en skills/uta/SKILL.md — Fix: dejar el resumen en README y la referencia canónica en la skill (aplicado en la redacción actual).

## Veredicto
Merge tras fix documentado del scaffold (el build queda como gate del próximo BOOT con credenciales).
```
