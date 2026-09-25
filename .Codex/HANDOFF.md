# Handoff — 2026-09-24 checkpoint

This checkpoint saves the full refinement session on `main`; GitHub `origin` is canonical.
Use `git log -1` for the checkpoint SHA and `git status` for any subsequent edits.
Local preview runs at http://localhost:4321/gallery.html#gallery-section-indicator.
No new owner completion was granted; refined components remain In review.

## Owner direction

- Untitled UI is the preferred first source for structure and visual quality. Use real
  licensed source, explicit shell/text/icon/action slot ownership, then Area tokens.
- Canonical process: docs/COMPONENT_ADAPTATION.md. Source shortlist:
  docs/DESIGN_REFERENCES.md. Visual skill: .agents/skills/area-visual-language/SKILL.md.
  AGENTS.md links them. One component variant per gallery tile.
- ChatGPT/Notion/Cursor/Figma guide product visual language. Do not infer private tokens
  or CSS dimensions from screenshots. Gallery Inspect structure is optional; @Browser
  can inspect DOM/applied styles, and native annotation Adjust supports style feedback.

## Current implementation

- Indicator is one family for count, activity dot and presence status. Use
  `Indicator status="available" size="sm"`; Presence remains a compatibility export and
  internal renderer, with its own styling manifest. No separate Presence docs/gallery.
- Native Fluent Regular presence cuts replace heavy available/away/DND Filled glyphs;
  busy remains Fluent’s solid dot. Status glyph sizes 10/12/16/20; counts16, activity10.
- Four corner anchors only. Rectangular compact inset4px; circular inset14.64466% puts
  the indicator center on the circle’s 45-degree rim. Compact no longer cancels it.
- Indicator gallery status/size/out-of-office/count variants each occupy their own tile.
- Badge pill-only, soft/solid/outline/color/modern, 20/24/28px. Fluent icons16 with equal
  icon-side optical inset; dismiss native12. One neutralsoft link; dot8 slot/6 disc.
  Custom/ghost/plain/redundant composition variants removed. BadgeGroup is separate.
- ColorPicker solid HSV/alpha and split ColorField; actual Area palette demo swatches.
  AlignmentPicker uses three bars, 2px dots, no selected backplate, stretch examples.
  ButtonGroup, Toolbar, Composer, dialog inset and gallery clipping refinements included.
- Source pins and MIT notices retained, including published-package file lists.

## Verification

Build/docs audit, typecheck, 87 React tests, 14 contracts, consumer checks, 19,491 token
checks and 370 contrast assertions across66 themes pass. Browser checked light/dark,
exact native glyph sizes, one indicator per tile, corrected rectangle/circle anchors,
zero visibility, motion-off and structure-inspector keyboard/picking/escape behavior.
Earlier 390px checks covered Presence/color controls; unrelated gallery-wide narrow
specimen overflow remains. Cross-engine, screen-reader and native forced-colors execution
remain unverified. Skill YAML validated with Ruby; Python validator lacked PyYAML.

## Start next session

1. Read README and current owner request. Review Indicator visuals before further changes.
2. Use Untitled UI first for the next requested component; preserve Area token/inset rules.
3. Keep status owner-confirmed. No mandatory redesign sweep or new component inferred.
