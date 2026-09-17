# Project journal

## 2026-09-16 — Curated UI scale, Field/Input, and Token audit

The docs exposed that independent typography and density controls could create a UI that no
real product would ship. Area now packages UI type, control geometry, icons, insets, and gaps
into compact/default scale choices, while fields retain a documented 16rem contained measure
and their nested action owns a real 24px hit box. The Token audit records a deliberate boundary:
Area Token names a static design token, whereas removable or selected values need a future
TokenInput/Tag behavior contract.

## 2026-09-15 — Docs shell density and component refinement

The visual pass exposed a real mismatch: the docs inspector rendered compact axis inputs
inside a default-density panel, and a stale wordmark offset no longer matched the nav label
column. The inspector now uses medium form controls, has a narrower persistent resizable
rail, and the gallery contains one representative component specimen per tile. Cards keep
their requested 8px media and 12px content layers; chips, Kbd, Slider, Dialog and panel
rows now share the same visual hierarchy across the docs.

## 2026-09-15 — Shared optical insets and first-line sizing

V04 turns the user's box-based alignment reference into a shared CSS contract: measure
outer-edge clearance, subtract the border once, and use a consistent cap reference for
text without per-glyph corrections. Multiline icons keep equal top/leading insets and
center on the first text line; title/description leading remains intact. Chip, Segmented
and Select share their tier's sizing with Button/Input; status messages use medium UI type.
The browser matrix passes 5,728 checks at both desktop and mobile. The user explicitly
authorized pushing this batch and all earlier local checkpoints to GitHub.


## 2026-09-15 — V03 native control polish

The user’s OpenAI-sized switch, Primer keybinding and soft gray focus references exposed four
small inconsistencies that shared one cause: compact geometry lacked enough optical allowance
for state. V03 makes the default Switch 32×20px, holds Checkbox/Radio outer geometry constant
across selection, frames each keyboard chord once in a native UI face, and gives
Input/Textarea/Select a neutral opaque focus edge inside a 6px 6%/8% halo. Shadow opacity
returns to 6%/8% while V02’s tight geometry remains. Increased contrast restores accent field
focus and strong state edges; its 21,120 rendered checks pass, while standard’s 3,012 quiet-edge
shortfalls remain explicit. Palette inputs are unchanged. [V03 evidence](../docs/batches/V03/README.md)
includes the supplied references, Area before/after captures and browser measurements. E05
behavior architecture remains next.

## 2026-09-14 — V02 tonal harmony and component gallery

Matching outline luminance alone left green visibly neon beside other tones. V02 derives all chromatic strokes as measured tints of existing readable ink, cutting green rest chroma from 0.1296 to 0.0248 while preserving palette inputs and contrast floors; shadows now use 4%/6% ink with much shorter offset/blur and a shared boxed-button contact shadow. The new alphabetical gallery exposes 32 component families in native-sized square specimens, including dedicated Code, Code block and Segmented docs; mobile review also fixed a rail cascade overlap and preserved desktop preferences across resizing. [V02 evidence](../docs/batches/V02/README.md) records captures, palette hashes and checks; E05 behavior architecture remains next, with soft-mode limitations explicit.

## 2026-09-14 — V01 quiet presentation without a palette rewrite

The user's seven new references exposed that E03 had made required-indicator contrast the default visual language everywhere. V01 separates quiet control presentation from an explicit/OS increased-contrast preference using existing palette endpoints, and coordinates 6%/8% shadows, selection plates, compact table spacing and stable navigation labels. The distinction remains measurable: standard has 3,696 non-text audit shortfalls, more passes 21,120 checks, and neither result is presented as overall accessibility conformance. [The V01 study](../docs/batches/V01/README.md) preserves the references, matched captures, live workspace composition, palette hashes and next priorities; behavior and platform release work remain open.

## 2026-09-14 — E04 public vocabulary and compiled contracts

Accent and neutral now name the public axis/tones consistently, with a one-time docs preference migration preserving saved choices. Literal manifest types and component-scoped positive state checks found hidden size tiers, a Nav class mismatch, undeclared table slots and dead CodeBlock toolbar markup. Packed ESM/declarations now pass strict isolated NodeNext, Node SSR and browser CSS/tree-shaking checks; Theme alone keeps a client directive. The matched contrast specimen is byte-identical and both browser matrices remain green; behavior failures and unverified RSC/peer/browser combinations stay explicit in the [E04 report](../docs/batches/E04/README.md).

## 2026-09-14 — E03: separate quiet framing from required information

The 75/100/150 trial revealed that decoration and empty fields could not share one contrast
contract. E03 preserves the quiet 75 seam, restores supplementary 150/200 edges and gives
required controls/selection their own measured strokes that survive Elevated. An opaque
outline replaces the 45% focus halo; normal-text tests now cover placeholders, hover and active
fills, and measured syntax selection removes every waiver. Actual browser inspection also
exposed zero-size checkbox/radio marks and flat-mode shadow-list invalidity, which token
ratios alone could not catch. All 16,316 token tests and 21,120 Chromium paint comparisons pass;
Safari/Gecko and native forced colors remain explicit validation work. See [E03](../docs/batches/E03/README.md).


## 2026-09-14 — E02: color polarity belongs at consumption

Independent color scopes now retain light/dark pairs until consumed, so changing a neutral
or accent inside dark no longer resets polarity, and light islands inherit the correct hues.
Pairing theme-owned shadow color was also necessary: an inherited shadow recipe had already
substituted its opacity at the ancestor. React Theme carries a complete contextual selection
to portal destinations; it deliberately requires an explicit host bridge rather than guessing
raw DOM attributes. The matched matrix lost all 3,174 failures; expanded 73,507 comparisons
pass in Chromium and Safari, with Gecko still pending and the 165 contrast failures unchanged.
See [the E02 report](../docs/batches/E02/README.md) and [scope contract](../docs/THEMING.md).


## 2026-09-14 — E01: a visible regression baseline

The first implementation batch adds the System lab, six representative profiles, and
22 rendered checks; 14 existing defects remain visible in each profile instead of being
waived. The preview now publishes only successful audited builds, retains its last working
snapshot on failure, and filters duplicate filesystem notifications by source content.
The user requested a real before/after visual summary after every batch; matched specimens
and screenshots now live in [docs/batches/E01](../docs/batches/E01/README.md), alongside the
known-red token, keyboard and packed-consumer evidence. No component styling or token values
changed: E02 theme correctness must precede E03 stroke and contrast refinements.

## 2026-09-14 — Authorized implementation sequence

The user authorized broad design and implementation improvements, including token/API renames,
structure changes and new components. [IMPLEMENTATION_PLAN.md](../docs/IMPLEMENTATION_PLAN.md)
now defines E01–E12, starting with regression evidence and theme scope correctness, then
semantic contrast/strokes, early API/package cleanup, existing component behavior and visual
refinement; customization and new widgets follow a dependable core. The quiet appearance
remains the direction, while 75/100/150 is a comparison reference rather than an immutable
control-boundary policy. This turn produced the plan only: no source behavior or test
threshold changed, no dependency was adopted, and the 165 known stroke failures remain.

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
