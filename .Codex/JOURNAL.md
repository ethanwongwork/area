# Project journal

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
