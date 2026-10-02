# Compact evidence audit (2026-10-02)

Owner direction (2026-10-02): values come from measured data (real products and design systems)
and from what holds together across the whole system; owner picks are adjustments, not the source
of truth. This audit classifies every compact value by its evidence and recommends a value where
the data disagrees with what ships.

## Files

- `inventory.md` / `inventory.json`: all 119 compact values with default, compact, evidence class
  and the capture or rule behind each (claims checked against the capture JSON).
- `density-systems.md` / `density-systems.json`: how systems with a density switch step down,
  pinned to package source (antd 5.29.3 `compactAlgorithm`, Angular Material M3 density −2, MDC
  density mixins, Spectrum large → medium, Carbon, Primer condensed).
- New captures in `../captures/compact/` (vscode.dev, dark, redacted, 2026-10-02):
  `vscode--save-dialog--open`, `vscode--editor-hover--open`, `vscode--keybindings-table--rest`,
  `vscode--settings-tabs--selected`, `vscode--settings-editor-body--rest`,
  `vscode--notification-center--open`.
- Read live in the owner's Chrome (computed style, not saved: personal content): Notion menu
  (shell corner 10, rows 28 with corner 6, inset 4, 20 icon 8 in), Notion sidebar rows (30, 5 / 8
  padding, corner 6, 14/21), Notion search modal (corner 20, rows 36), Figma file-browser menu
  (rows 24, 11/16, sides 8, top inset 8). Code block corners: GitHub Docs 6, Vercel Geist 8,
  shadcn docs 18, ChatGPT 24.

## Evidence classes

| Class | Values | Meaning |
|---|---|---|
| Measured in a dense product | 22 | A VS Code or Figma capture shows the value or the step |
| Rule only | 81 | Derived by a stated rule (one rung down, concentric, equal insets); about 47 are "one rung down" with no capture |
| Conflict | 11 | A capture contradicts the shipped value |
| Pick only | 4 | Owner pick with no capture |
| Measured elsewhere | 1 | Calendar day 28 from Notion (a default-density product) |

## What the data says, system-wide

1. **Heights shrink everywhere** (antd 32 → 28, Material and Spectrum 40 → 32; table rows −15 to
   −33%). Area's control ladder (32 → 28, rows 32 → 24) is well supported.
2. **Radius is held by every density system** (antd, Material, Spectrum, Primer), but **dense
   products draw smaller corners outright** (VS Code surfaces 8, controls 4; Figma 5). Area's
   compact targets dense products, so stepping corners down is supported by product data, not by
   system data. Keep the step; fix the components whose compact corner is still above the products.
3. **Surface insets are mostly held** by systems (antd popover 12 and menu inset 4 held; Spectrum
   popover 8 held; Material dialog 24 held) and are 8–16 in dense products (VS Code hover 8 + 1,
   save dialog content 13 from the side and 21 from the top, actions 9 from the edges; Figma color
   picker and inspector 16). The blanket "one rung down" on surfaces overshoots where Figma holds 16.
4. **Spacing next to text is split** (antd and Material hold control padding; Spectrum and Primer
   shrink it). Dense products bracket Area's compact gaps (VS Code 4, Figma 8 around Area's 6), so
   the one-rung gaps are plausible but unproven.
5. **Type**: density systems hold type except antd (14 → 12); dense products use 12–13 UI type.
   Area's 12/16 is supported.

## Recommendations

Applied 2026-10-02: R1–R6 (high confidence), then R7 and R8 (owner yes). Default density
unchanged. R9–R12 keep what ships.

| # | Value | Ships (default → compact) | Evidence | Recommend | Confidence |
|---|---|---|---|---|---|
| R1 | Row glyph edge `ui-row-inset` | 8 → 6 | Figma 8, VS Code 9 | **8 at both** (label column 32) | High |
| R2 | Tooltip sides | 10 → 10 | VS Code 9, Figma 8 | **8 at compact** | High |
| R3 | Tooltip corner | 10 → 8 | VS Code 3, Figma 5; a 24 box reads `radius-control-sm` 4 | **4 at compact** (radius follows height) | High |
| R4 | Panel md sides | 16 → 12 | Figma inspector 16 | **hold 16** | High |
| R5 | Color picker body inset | 16 → 12 | Figma color picker 16 | **hold 16** | High |
| R6 | `control-xl` / `gutter-xl` | 48 / 16 → 36 / 14 | none; off the ladder and the 4px grid | **40 / 12** (one rung: compact xl = default lg) | High |
| R7 | Menu row gap | 2 → 2 | VS Code 0, Figma 0 | **0 at compact**: new role `ui-row-gap` (2 / 0) in Menu, Nav, Tree view, Command palette, Combobox; separator keeps 4 / 1 / 4 | Medium |
| R8 | Dialog inset · corner | 16 · 16 → 16 · 16 | VS Code save dialog: content 13 / 21, actions 9, corner 8; antd 24 → 16; Material holds 24 | **inset 12, corner 12** (the compact close sits 6 in at radius 6: 12 concentric; VS Code 8) | Medium |
| R9 | Popover inset | 12 → 8 | VS Code editor hover 8 + 1 sides; antd and Spectrum hold; Figma color picker 16 | **keep 8** (VS Code hover is the closest surface) | Medium |
| R10 | Menu separator | 4 / 1 / 4 | VS Code 5 / 1 / 5, Figma 7 / 1 / 7 | **keep** (both products are larger than Area at default too; a default change, not a compact one) | Low |
| R11 | One-rung spacing (≈47 gaps) | e.g. 8 → 6, 16 → 12 | systems split; products bracket 4–8 | **keep**, re-check against a Cursor capture | Low |
| R12 | Titles hold 16/24 | held | Material holds type; antd shrinks headings | **keep** | Medium |

Corrections to the compact-pass note (found by the audit): VS Code's "settings dialog 24" is not in
the capture (header padding only); the top table's Toast "6 × 8, 28 tall" was superseded by round 3
(8 × 8, 32 tall); `compact/vscode--checkbox` is a 22.6 toggle (the 18 checkbox is
`checkbox/vscode--settings-checkbox`).

## Still unmeasured

Cursor itself (desktop app; chat panel, composer, code block, menus), a Figma dialog and a Figma
popover with sections (the owner's Chrome did not open them from the file browser), a dense card,
a dense toast with actions.
