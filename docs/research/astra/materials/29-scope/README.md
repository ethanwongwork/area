# 29 · Material scope: which components, how strongly

**Question (owner, 2026-10-17):** "is the research sufficient enough to know exactly how these visual styles will be
applied to the components? … the difficult part is knowing what other components will be styled and to what degree?
mostly it would be extremely subtle, and some or most of the components wont even have any styles. do more research"

**Answer:** it wasn't; it is now. Reports 04 and 05 gave every part a role but no strength, and lumped layout wrappers
in with visible cards.

Sixteen sources agree on how a material spreads:
- four platforms (`platforms.md`);
- nine libraries that apply a style across all their components (`libraries.md`);
- three historic system styles (`history.md`).

The rules:
- One primary control carries it.
- Thumbs and ticked boxes carry it too.
- Fields are recessed wells.
- Only the selected row echoes it.
- Pressed flips to recessed; disabled drops it.
- Overlays lift, and turn to glass only in glass materials.
- Chrome is where glass belongs.
- Content stays plain.
- Never material on material.

Applied to Area (`families.json`): 10 families carry, 32 echo (usually on one part: a field's well or the selected row),
11 are overlays, 5 are chrome, and 36 take none.

**Page:** https://claude.ai/artifact/4GwjuWZeFx9Tj8S31iVEQ7. It shows one app screen painted two ways, scoped by the
rules and with every lever on every part, plus the tier table.

## Into the levers (27-levers, regenerated)

- **Part groups replace the four targets:**
  - Primary: solid buttons, the selected segment, thumbs, ticked boxes.
  - Secondary: outline and soft buttons.
  - Badges: solid badges.
  - Fields: fields, tracks, unticked boxes.
  - Selected rows: menus, nav.
  - Cards.
  - Overlays.
- **Each group has a strength** (`--lv-scope-*`): Primary, Cards and Overlays 1; Secondary, Badges, Fields and Selected
  rows 0.5.
- **Each lever's default groups follow the rules.** For example, gradient and sheen reach Primary only, and
  transparency and frost reach Overlays only.
- **Ghost buttons, text, tables, lists, code, avatars and keycaps** have no receiver.
- **Pressed parts** paint recessed; **disabled parts** drop the material.

## Owner decisions (2026-10-17)

- **Glass reaches both cards and overlays** (and chrome). Transparency and frost default to Cards, Overlays and Chrome.
- **Chrome is in the mockup:** the sidebar and top bar are a Chrome group (`data-lv-chrome`; `.area-titlebar` in Area).
  They take glass and a rim only, over a wallpaper option; their buttons stay ghost.
- **No progress gloss:** progress keeps its track as a well; the fill takes no material.

Also fixed: frost had never painted. The saturation term multiplied a length by a percentage, which dropped the whole
`backdrop-filter`. It now uses the unitless strength.
