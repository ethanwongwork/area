# Project journal

## 2026-09-14 — Stroke trial and system completion audit

Tried the user's 75/100/150 light stroke progression across the shared decorative/faint/subtle
roles; dark, hover and focus stayed unchanged. Five existing stroke assertion groups now
fail across all 33 light color themes (165 tests); the thresholds were preserved so a visual
trial cannot silently redefine the contrast policy. Decorative 75 still passes its floor;
faint 150/subtle 200 are the immediate route back to the existing stroke checks.

The [system audit](../docs/SYSTEM_AUDIT.md) and [roadmap](../docs/ROADMAP.md) record source,
browser and measured evidence, with 17 primary research sources and reproducible probes.
The strongest next work is nested theme resolution, accurate rendered text/focus contrast,
and complete component behavior; motion-none and public-package/API parity also have
confirmed gaps. The eight-axis concept remains useful, but 50,688 choices and disjoint
namespaces do not prove all rendered combinations work. No roadmap fixes or external
primitive dependencies were adopted. This checkpoint is local; push remains unauthorized.

Current Area decisions, newest first. Earlier records are preserved in
[the historical journal](../archive/history/journal-before-area-name.md).

## 2026-09-14 — A coordinated stroke hierarchy

Neutral 50 made dividers too faint beside controls that still used stronger outlines.
Dividers now use 100; floating menu/popover frames and segmented tracks use 150; field
outlines use 200, shared with neutral outline buttons and selected segmented items.
The changes reuse existing semantic roles, leave hover/focus distinct, and add a gate
for the segmented track against its actual inset background. Dark roles remain quieter
than interactive state indicators. Verification: 8,975 tests and 178 passing contrast
assertions across 66 themes, with the same four existing waivers.

## 2026-09-14 — Area naming and decorative borders

The current product, custom icon source, generated icon namespace and palette metadata
now use Area consistently. Earlier project names remain only in archived records;
Fluent glyph names remain their upstream names. Asset geometry and palette colors are
unchanged by the rename. Decorative container edges and dividers now share a dedicated
neutral-50 token in light themes, with a neutral-800 dark counterpart. Control outlines,
focus indicators and their existing contrast thresholds remain separate.

## 2026-09-14 — Codex migration

Agent guidance now starts with AGENTS.md and points to detailed repository documentation.
The previous playground and disconnected tooling are archived. The icon generator uses
portable paths, and the maintenance guide records actual verification commands and limits.
