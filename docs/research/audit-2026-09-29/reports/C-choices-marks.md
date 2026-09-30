# C — Choices and marks audit (checkbox, radio, switch, slider, chip, badge-group, badge, count, indicator, avatar/presence)

Read-only audit, 2026-09-29, worktree `component-audit-visual-guide-ac7bc4`. Paths are relative to the repo root.
Grey values are the neutral (gray) light theme from `packages/styles/dist/area.css`: `bg-component` #f7,
`bg-component-hover` #f3, `bg-component-active` #ee, `edge-control` (border-faint) #e2, `edge-control-hover`
(border-subtle) #d4, `fill-toggle` #d4, `border-hover` #b4, `neutral-solid` #28. Nothing was run in a browser;
visual outcomes are inferred from CSS unless marked verified.

## Summary

- **The "off / empty" grey and the "neutral soft plate" each have 3–4 values.** After the owner lightened the Switch off track to #e2, the choice controls show #d4 (Checkbox/Radio edge), #dd (Slider/Progress rail), #ce (Slider thumb edge) and #e2 (Switch, Chip edge). Neutral soft plates are #f7 (Badge), ≈#f0 (Count, a literal), and #ee (Avatar, Chip selected). A #f7 Badge on a hovered #f3 row reads as a lighter hole. (C-1, C-2)
- **Nested dismiss has three constructions, and none follows the DESIGN_SYSTEM rule.** Alert uses 28px with the small-button radius. Chip uses a 20/24/32 circle with a 12% plate on an untinted ground. Badge uses a 12/16 circle with the badge's hover fill on a tinted ground and no 24px hit area. The API is split three ways too: `onRemove`, `onDismiss`, and a default label of "Remove chip". (C-4, C-5, C-6, C-7)
- **There are real interaction gaps in the form choices.** RadioGroup generates no `name`, so without one the radios are not a native group. The uncontrolled RadioGroup ignores form reset, while Switch and Slider handle it. Slider's readout formatter never reaches `aria-valuetext`. Slider RTL is likely wrong in Chromium. Checkbox and Radio have no behaviour tests. (C-8, C-9, C-10, C-11, C-12)
- **The system rules don't match what was shipped.** Indicator defaults to danger although "tone defaults are neutral in every family". The Indicator count is 10px, off the 12px type floor. "500 only on fills" is applied four different ways. Tone sets range from 2 to 9 values, and one tone is spelled `inverse` in Avatar and `inverted` in Badge. (C-3, C-14, C-15, C-16)
- **Many docs are stale about sm, 20/24/28, #d4 and 16px remove.** DESIGN_SYSTEM (glyph ladder "16 at sm", Badge "20/24/28", the "await owner review" note), the cohesion-audit shared rules, six specs, a docs page note and HANDOFF all lag behind code and owner decisions. (C-26)

## Findings

### C-1  The choice controls' "off" greys have drifted apart
- Families: switch, slider (and progress), checkbox, radio, chip
- Category: consistency · Severity: medium · Type: DECISION
- What: The owner lightened the Switch off track to #e2 (2026-09-28). The other "empty" surfaces kept their older greys. The Slider rail is now darker than the Switch off track. The Switch spec still claims its off fill matches the Checkbox #d4.
- Evidence:

  | Role | Value | Where |
  |---|---|---|
  | Checkbox/Radio rest edge | `edge-control-hover` #d4 | choice.css:55 |
  | Checkbox/Radio hover edge | `border-hover` #b4 | choice.css:246 |
  | Switch off track / hover | `edge-control` #e2 / #d4 | switch.css:20-21 |
  | Slider + Progress rail | `fill-toggle` mixed 20% toward surface ≈ #dd | slider.css:27, 91 |
  | Slider thumb edge | `border-hover` mixed 35% toward surface ≈ #ce | slider.css:31 |
  | Chip rest edge | `edge-control` #e2 | chip.css:34 |

  switch.md:141 says "Checkbox, Radio | off glyph grey | rest edge #d4d4d4 | off fill #d4d4d4 | match", which is stale. Handoff: "Figma's tracks #f5 / #e6 are lighter than Area's shared rail #dd" (open).
- Options:
  A. Keep as is and fix the docs.
  B. Put the Slider/Progress rail on `edge-control` (#e2), the Switch off-track role. That gives one "track" grey. Keep the glyph edge at #d4 (the DS rule for small glyphs).
  C. Also move the Slider thumb edge to `edge-control-hover` (#d4), the same edge as the Checkbox glyph.
  - Recommended: B + C. That leaves two greys with clear jobs: #e2 for tracks and #d4 for glyph edges. It moves toward Figma's #e6 rail and ChatGPT's ≈#e6 off track, and it removes two ad-hoc `color-mix` literals.
- Visual: A Switch (off), Slider, Progress, Checkbox (empty) and Chip side by side at 4× zoom, each with its hex. Below that, the same row after B + C.

### C-2  Neutral soft plates: #f7, ≈#f0 and #ee, and a Badge disappears on a hovered row
- Families: badge, count, avatar, chip
- Category: consistency / visual · Severity: medium · Type: DECISION
- What: Four families paint "neutral soft" with three different fills. Badge's #f7 is lighter than the row hover (#f3) and selection (#ee) plates it sits on in Table and Nav rows. Count chose a translucent plate for exactly this reason (count.css:70-72).
- Evidence:

  | Family | Neutral soft plate | Source |
  |---|---|---|
  | Badge soft (default) | `bg-component` #f7 | badge.css:14, 55 |
  | Chip `kind="input"` | `bg-component` #f7 | chip.css:79 |
  | Count soft | `light-dark(rgb(0 0 0/.06), rgb(255 255 255/.1))` ≈ #f0 | count.css:72 |
  | Avatar neutral | `bg-component-active` #ee | display.css:11, 53 |
  | Chip selected | `bg-component-active` #ee | chip.css:104 |
- Options:
  A. Keep, and record each fill as a separate role.
  B. Give Badge neutral soft Count's translucent 6% plate, so a badge stays visible on hover and selection plates.
  C. Put all static marks (Badge soft, Count soft, Avatar) on `bg-component-active` #ee.
  - Recommended: B. Badge is placed in Nav trailing slots and Table rows, where a #f7 badge on a #f3/#ee plate inverts. Count already solved this. Avatar and Chip selected stay at #ee, which is the selection step.
- Visual: A Badge "Status" and a soft Count "12" on a white row, a hovered row (#f3) and a selected row (#ee). Show current vs option B.

### C-3  "500 only for labels on fills" is applied four different ways
- Families: badge, count, chip, avatar (vs button, segmented)
- Category: system-rule / consistency · Severity: medium · Type: DECISION
- What: The DS rule (DESIGN_SYSTEM.md:43-45) lists "buttons, segmented options, badges, counts, avatar initials". The code interprets "fill" differently in each family.
- Evidence:

  | Family | 400 | 500 |
  |---|---|---|
  | Button | soft, outline, ghost (button.css:32) | solid only (button.css:314) |
  | Badge | — | every treatment, including outline and modern, which have no fill (badge.css:28) |
  | Count | plain | soft (count.css:68, 74) |
  | Chip | always, even on the #f7 input fill and the #ee selected fill (chip.md "label weight 400") | — |
  | Avatar initials | — | 500 on a soft plate (display.css:28) |
  | Segmented | — | every option (segmented.css:94) |
- Options:
  A. Rewrite the rule as "500 for compact identity/metadata marks (Badge, Count soft, Avatar initials, Indicator) and for solid Buttons and Segmented; 400 for every other control label". This matches the code.
  B. Make "fill" mean solid only, which puts Badge soft/outline, Count soft and Avatar initials at 400 (Notion select tag, Notion person and Figma avatars are 400).
  C. Keep all Badge treatments at 500, but put the outline Badge at 400.
  - Recommended: A. The owner explicitly kept Badge at 500 when shrinking it to 12px (badge.md:54-56), so the doc should describe the rule that was chosen.
- Visual: A grid of Button soft, Badge soft/outline, Count plain/soft, Chip selected and Avatar with the weight annotated.

### C-4  Nested dismiss comes in three constructions, and neither Chip nor Badge follows the DS rule
- Families: chip, badge (vs alert)
- Category: system-rule / consistency · Severity: medium · Type: DECISION
- What: DESIGN_SYSTEM.md:76-77 says nested dismiss is "28px, the small-button radius, fixed ink, and a plate on hover (the component hover fill, or 12% of the ink on a tinted ground)". Chip uses the 12% ink plate on an untinted surface. Badge soft is the tinted ground, but it uses its own hover fill. The sizes, shapes and glyph sources all differ too.
- Evidence:

  | | Box | Shape | Glyph | Ink | Hover plate | Source |
  |---|---|---|---|---|---|---|
  | Alert | 28 | `radius-control-sm` | 16 | full | 12% of ink | surface.css:703-719 |
  | Chip remove | 20 / 24 / 32 (height − 8) | circle | 16, Fluent path | `fg-muted` | `currentColor` 12% on a white chip | chip.css:27, 220-232; primitives.tsx:947 |
  | Badge dismiss | 12 (sm) / 16 | circle (`--_badge-radius`) | 12, Area glyph | badge ink | the badge's own `--_bg-hover` | badge.css:201-203; Badge.tsx:41 |
- Options:
  A. Follow the DS literally: Chip plate → `bg-component-hover`, Badge soft/colour → 12% ink. Amend the size clause to "a circle concentric with a pill host".
  B. Use one recipe everywhere: 12% of the ink on every ground (it also works on solid badges), a circle concentric with the host (Chip, Badge) or 28px radius-control-sm (Alert, Toast, Dialog), and one glyph family. Update the DS sentence.
  C. Leave the code and delete the DS rule.
  - Recommended: B. One plate recipe needs no knowledge of the ground. The Chip's 12% plate is already owner-reviewed (chip.md "remove · hover"). Only Badge changes paint.
- Visual: Hover states of an Alert dismiss, a Chip remove (md) and a Badge dismiss (md, soft success) at 4×, each labelled with its box, shape and plate.

### C-5  Badge dismiss is a 12–16px target with no 24px hit extension
- Families: badge
- Category: a11y · Severity: medium · Type: FIX
- What: Badge links get a ≥24px (44px coarse) invisible hit area. The dismiss button inside the same badge does not. It is 16×16 at md and 12×12 at sm, below WCAG 2.2 2.5.8 (24px) unless spacing saves it. Chip remove (≥20) and Alert dismiss (28) are larger.
- Evidence: badge.css:185-186 (`:is(a, button).area-badge::after` min 24 / 44). badge.css:188 sm `--_media: icon-xs` (12). badge.css:201 dismiss box = `--_media`.
- Visual: The Badge md dismiss with its actual 16px box outlined, next to the 24px target it should expose.

### C-6  Chip remove has no content-aware name, no Backspace/Delete, and no focus hand-off
- Families: chip (vs badge)
- Category: interaction / a11y · Severity: medium · Type: FIX
- What: `removeLabel` defaults to the generic "Remove chip", so a row of chips announces identical buttons. Badge instead throws when `dismissLabel` is missing. Nothing removes a focused chip with Backspace/Delete (Material, Spectrum TagGroup), and focus is lost when the removed chip unmounts.
- Evidence: primitives.tsx:857 `removeLabel = "Remove chip"`. primitives.tsx:895 remove `onClick` just calls `onRemove()`. There is no key handler (a grep for Backspace/Delete finds only Kbd glyph names, primitives.tsx:1783-1784). Badge.tsx:28 throws without `dismissLabel`.
- Visual: A screen-reader list view of three input chips all reading "Remove chip", beside "Remove Irene Yamaguchi".

### C-7  The dismiss and change APIs are named differently in each family
- Families: chip, badge, switch, checkbox, radio, slider (vs alert)
- Category: api · Severity: medium · Type: DECISION
- What: The same jobs have different prop names and callback shapes.
- Evidence:

  | Job | Chip | Badge | Alert | Switch | Checkbox | RadioGroup | Slider |
  |---|---|---|---|---|---|---|---|
  | dismiss | `onRemove` / `removeLabel` / `removeIcon` | `onDismiss` / `dismissLabel` (no icon) | `onDismiss` / `dismissLabel` / `dismissIcon` | | | | |
  | value change | `onSelectedChange(selected)` | | | `onCheckedChange(checked)` | none (native `onChange` only) | `onValueChange(value, event)` | `onValueChange(value)` (no event) |
  | read-only / loading | | | | yes | no | no | no |
  | label position | | | | `labelPosition: end \| start` | | | `labelPosition: inline \| top` |

  Sources: primitives.tsx:821-857 (Chip), Badge.tsx:8-13, primitives.tsx:141-163 (Alert), Switch.tsx:7-15, forms.tsx:106-121, forms.tsx:231, primitives.tsx:675, 686.
- Options:
  A. Standardise on `onDismiss` / `dismissLabel` / `dismissIcon` and keep `onRemove` as an alias. Add `Checkbox.onCheckedChange`. Pass `(value, event)` everywhere.
  B. Document the differences only.
  - Recommended: A. Two of three dismiss APIs already use `dismiss`. The DS calls the pattern "nested dismiss", and Checkbox is the only boolean choice without a value callback.
- Visual: A props table with the aligned names highlighted.

### C-8  RadioGroup doesn't generate a `name`
- Families: radio
- Category: interaction · Severity: high · Type: FIX
- What: `name` is optional on RadioGroup. Radio falls back to `group?.name`, which is undefined. Without a name, the inputs are not one native radio group: each is its own Tab stop, arrow keys don't move the selection, and nothing is submitted with a form. React state still shows mutual exclusion visually, which hides the problem.
- Evidence: forms.tsx:228 `name?: string`. forms.tsx:280 `const resolvedName = name ?? group?.name`. forms.tsx:296 `name={resolvedName}`. Every gallery demo passes `name` (gallery.tsx:1767, 1781), so the gap never shows. Verified by reading the code; not executed.
- Visual: Keyboard focus path through a RadioGroup without `name` (three Tab stops) vs with one (one stop, arrow keys).

### C-9  The uncontrolled RadioGroup ignores form reset (Switch and Slider handle it)
- Families: radio (vs switch, slider)
- Category: interaction · Severity: medium · Type: FIX
- What: An uncontrolled `RadioGroup defaultValue` keeps its value in React state and renders each Radio as controlled (`checked`). No form `reset` listener syncs that state. Switch and Slider both listen, per the DS rule "uncontrolled state must synchronize with native input and form reset". After a reset, the DOM and React state can disagree until the next render, and `onValueChange` does not fire (the visible outcome is unverified).
- Evidence: forms.tsx:241 `useState(defaultValue)`, forms.tsx:298-299. Switch.tsx:50-57 and primitives.tsx:758-767 add reset listeners. No test file covers Checkbox or Radio behaviour (only `tone.test.mjs` mentions them). The gallery has no form-reset specimen for either.
- Visual: A form with a RadioGroup: choose "Two", press Reset, and show the DOM state vs the React state.

### C-10  Slider readout formatting never reaches assistive tech
- Families: slider
- Category: a11y · Severity: medium · Type: FIX
- What: `readout` can format the value ("60%", "1×"), but the readout is `aria-hidden` and no `aria-valuetext` is derived from it, so a screen reader hears "60" or "1".
- Evidence: primitives.tsx:813 `<span className="area-slider__value" aria-hidden="true">`. No `aria-valuetext` appears in the Slider. gallery.tsx:1893, 1901 use `${value}%` and `${value}×`. slider.md "Behavior" says "the input announces the value".
- Visual: A visible "1.25×" beside the announced "1.25".

### C-11  Slider RTL is likely wrong in Chromium; the range composition is LTR-only
- Families: slider
- Category: interaction (RTL) · Severity: medium · Type: FIX (verify first)
- What: RTL mirrors the fill with `scale: -1 1` on `::-webkit-slider-runnable-track`. In Blink the thumb is a child of that track, and Chromium already positions the thumb from the right in RTL. Mirroring the track probably flips the thumb back to the left while the fill moves right, so they disagree (Firefox's track and thumb are siblings, so Firefox should be right). The selector only matches a `dir` on an ancestor: `<Slider dir="rtl">` puts `dir` on the input itself (via the rest spread), so no rule matches. The range demo maps the pointer with `clientX - bounds.left`.
- Evidence: slider.css:203-204 (`[dir="rtl"] .area-slider__control::-webkit-slider-runnable-track { scale: -1 1; }`). primitives.tsx:795 (`{...rest}` on the input). slider-range.tsx:33. slider.md:133 says "Unverified on screen: the RTL mirror". Indicator uses `:dir(rtl)` (indicator.css:51), a different selector idiom.
- Visual: A Slider at 25% in LTR and RTL, in Chromium and in Firefox.

### C-12  The range slider is a demo-only composition outside the manifest
- Families: slider
- Category: api / system-rule · Severity: medium · Type: DECISION
- What: `.area-slider-range*` ships in the stylesheet, but it has no manifest entry and no React component; it is only the docs demo `SliderRangeComposition`. The parity check misses it because `area-slider-range` isn't `area-slider--`/`__`. It also has these gaps:
  - The fill is hard-coded neutral, so `tone="accent"` can't reach it.
  - The track is fixed at `control-md` with no size tiers.
  - The Input and Slider controls share the accessible names "Minimum" and "Maximum".
  - `minmax(80px, 1fr)` is an unmarked literal.
- Evidence: slider.css:89-148 (`--_range-fill: var(--area-neutral-solid)` :90, `block-size: var(--area-control-md)` :101, `80px` :93). manifest-parity.mjs:31 matches only the `block--`/`block__` prefixes. slider-range.tsx:56, 72-73, 77.
- Options:
  A. Promote it to a `SliderRange` component with a manifest block, tone and size.
  B. Declare it a recipe: move the CSS under a documented composition and add the block to the manifest so parity covers it.
  C. Keep it as is.
  - Recommended: A. The gallery shows it as a first-class tile ("Composition / range with inputs"), and consumers will expect tone and keyboard parity.
- Visual: The range tile in neutral vs accent, with the accent failing to reach the fill.

### C-13  Chip and Slider recolour an edge on focus; the other families draw only the ring
- Families: chip, slider (vs button, checkbox, radio, switch, badge, segmented); checkbox/radio card
- Category: consistency · Severity: low · Type: FIX
- What: Chip turns its border and the Slider its thumb border to `focus-color` in addition to the 2px ring. Button, Segmented, Checkbox, Radio, Switch and Badge draw the ring only. Checkbox/Radio cards draw two rings, one on the card and one on the glyph.
- Evidence: chip.css:65-69, slider.css:265-276 vs button.css:145-148, segmented.css:101-104, choice.css:254-258. Cards: choice.css:133-137 ("the glyph keeps its own ring too").
- Visual: Focus states side by side: Button, Chip, Slider thumb and Checkbox card (showing the two rings).

### C-14  Indicator defaults to danger, against "Tone defaults are neutral in every family"
- Families: indicator
- Category: system-rule / docs-drift · Severity: medium · Type: DECISION
- What: The base rule and the manifest default are danger. The DS states the neutral default without exceptions.
- Evidence: indicator.css:3 (`--_bg: var(--area-danger-solid)`). manifest.ts:333 `defaults: {kind: "dot", tone: "danger"}`. DESIGN_SYSTEM.md:84. indicator.md:35 records "danger (default)", and count.md relies on it ("danger by default").
- Options:
  A. Keep danger and write Indicator into the DS as the one exception (notification semantics: Figma's red dot, Untitled's error count, Fluent).
  B. Default to neutral.
  - Recommended: A. Every product reference is red, and Count exists precisely as the neutral counterpart.
- Visual: The default Indicator dot and count on a bell button: red (current) vs neutral.

### C-15  The small numeric and label marks disagree at 16/20px, and the Indicator count is off the type ramp
- Families: indicator, count, badge (vs kbd)
- Category: consistency / system-rule · Severity: medium · Type: DECISION
- What: Three pill marks share heights but not their text, gutters or alignment. The Indicator count uses 10/14, below the 12/16 floor that Chip cited when it moved avatar initials from 10 to 12.
- Evidence:

  | 16px mark | Text | Weight | Gutter | min-width | vertical-align | Source |
  |---|---|---|---|---|---|---|
  | Indicator count | **10/14** | 500 | 4 | 16 | middle | indicator.css:6-11 |
  | Count sm | 12/16 | 400 plain / 500 soft | 4 | 16 | middle | count.css:23, 47, 53-54 |
  | Badge sm | 12/16 | 500 | 6 | — | baseline | badge.css:11, 22, 188 |
  | Kbd small | 11 (open, cohesion audit) | | | | | cohesion-audit.md:75 |

  At 20px: Count md has gutter 6, Badge md gutter 8, both 12/16. The type ramp's smallest size is 12/16 (DESIGN_SYSTEM.md:151-153). chip.md, "avatar initials": "Type ramp floor 12 … Was 10px, off the ramp".
- Options:
  A. Keep 10px (Fluent small and Untitled use 10) and name it as a ramp exception in the DS.
  B. Set the Indicator count to Count sm (12/16, 500), so one 16px numeric mark exists.
  C. Also align the Badge sm and Count sm gutters.
  - Recommended: B. The system already enforced the 12px floor on Chip initials, and Count and Indicator share `count-format.ts`. Check the two-digit width on a 32px avatar before adopting it.
- Visual: An Indicator count "24", a Count sm "24" and a Badge sm "24" on one baseline at 4×.

### C-16  Tone sets range from 2 to 9 values, and one tone has two spellings
- Families: badge, indicator, count, chip, checkbox, radio, switch, slider, avatar (vs alert, button)
- Category: api / consistency · Severity: medium · Type: DECISION
- What: The same semantic tone vocabulary is offered unevenly across families. Avatar's `inverse` and Badge's `inverted` are the same idea (both use `bg-inverse`). `custom` exists only on Switch.
- Evidence:

  | Family | Tones | Source |
  |---|---|---|
  | Badge | neutral, accent, info, success, warning, caution, danger, discovery, **inverted** | manifest.ts:321 |
  | Button | eight semantic tones (no inverted) | build.mjs gallery list |
  | Alert, Indicator | neutral, accent, info, success, warning, danger (no caution or discovery) | manifest.ts:535, 331 |
  | Avatar | neutral, accent, **inverse** | manifest.ts:374 |
  | Switch | neutral, accent, **custom** | manifest.ts:268 |
  | Checkbox, Radio, Chip, Slider, Count | neutral, accent | manifest.ts:227, 245, 294, 282, 338 |
- Options:
  A. Spell it `inverse` everywhere (matching the `bg-inverse` and `fg-on-inverse` tokens); give Indicator (and Alert) caution and discovery to match Badge; keep controls at two tones; decide whether `custom` should spread or be dropped.
  B. Rename only; leave the sets as they are.
  - Recommended: A. Indicator and Badge share solid paints, so a Badge-toned status should have an Indicator twin.
- Visual: A tone × family matrix with blanks where a tone is missing.

### C-17  Badge base rule differs from the React default (muted vs default ink)
- Families: badge
- Category: system-rule · Severity: low · Type: FIX
- What: "The base rule renders the manifest's default tier and tone" (DESIGN_SYSTEM.md:130-131). A bare `.area-badge` uses `--_tone-fg: fg-default`, but React's default (`--neutral`) uses `fg-muted`. Framework-free markup is therefore darker than the React default.
- Evidence: badge.css:15 vs badge.css:69. manifest.ts:326 default tone neutral. variants.ts:31-35 emits default classes.
- Visual: `<span class="area-badge">` vs `<Badge>` side by side.

### C-18  Dead or no-op API and CSS
- Families: badge, chip, choice, switch
- Category: api · Severity: low · Type: FIX
- What: Several booleans and properties change nothing:
  - The `pill` boolean on Badge and Chip is a no-op. Both blocks are already pill-only; the owner made Badge pill-only on 2026-09-24.
  - Badge `--_dot` is never read.
  - `--_surface-active` is set in eight tone rules but never consumed.
  - Switch has an empty `.area-switch--short {}`.
  - `.area-radio-group__legend` sets its weight twice.
- Evidence: badge.css:12, 173; chip.css:46, 247; manifest.ts:295, 324. badge.css:19 (`--_dot`; the dot uses `space-6` directly at :51); badge.css:57/79/92/104/116/128/140/153. switch.css:41. choice.css:278, 282.
- Visual: none; a list is enough.

### C-19  Size tiers differ between choices, and Checkbox/Radio lg repeats the reasoning that removed sm
- Families: checkbox, radio, switch, slider, chip, badge, count, presence
- Category: consistency / api · Severity: medium · Type: DECISION
- What: The owner removed Checkbox/Radio sm because it "differed from md only by a 4px label gap". lg now differs from md only by a 16 → 20 glyph: text is 14/20 at both tiers, and `gap-lg` = `gap-md` = 8. Switch sm vs md also shares 14/20 text. Presence exposes `xs`, although the DS says not to expose xs merely because the ramp has it.
- Evidence: choice.css:407-418. density.ts:76-77 (md and lg are both 14/20, gap 8). Tier sets:

  | Family | Tiers | Source |
  |---|---|---|
  | Checkbox, Radio | md, lg | manifest.ts:227, 245 |
  | Switch, Slider, Chip, Badge, Avatar | sm, md, lg | manifest.ts |
  | Count | sm, md | manifest.ts |
  | Presence | xs (10), sm, md, lg | presence.css:17 |

  DESIGN_SYSTEM.md:143-147 has the xs/xl guidance.
- Options:
  A. Keep lg, since a 20px glyph is a visible, touch-relevant difference (Untitled md 20), and drop Presence xs.
  B. Collapse Checkbox/Radio to one size, as Notion and Figma do, and leave the rest to density.
  C. Keep lg but give it a real type step.
  - Recommended: A. Unlike the removed sm, the lg glyph really changes, and the Slider lg thumb (20) follows it.
- Visual: Checkbox md vs lg, and Switch sm vs md, each pair overlaid on the same label.

### C-20  Checkbox/Radio "card" shares nothing with Card
- Families: checkbox, radio (vs card)
- Category: visual / consistency · Severity: low · Type: DECISION
- What: The word "card" means two different constructions.
- Evidence:

  | | Choice card | Card |
  |---|---|---|
  | Corner | `radius-container` 12 | `radius-control-md` + 16 = 24 |
  | Inset | 12 | 16 to the text |
  | Edge | `edge-control` #e2, hover #d4 | #ee (neutral 100) with a two-layer halo |
  | Selected | 1px `neutral-solid` #28 edge | — |

  Sources: choice.css:108-131, surface.css:40-60.
- Options:
  A. Keep it: an in-form option is not a surface. Record the difference in both specs.
  B. Align the corner and edge with Card.
  C. Rename the variant (e.g. `contained`) so the word "card" means one thing.
  - Recommended: A. The owner shaped these cards on 2026-09-28 from shadcn Choice Card references.
- Visual: A Checkbox card and a Card md stacked at the same width.

### C-21  Avatar's tone axis also switches treatment
- Families: avatar (vs badge)
- Category: consistency · Severity: low · Type: DECISION
- What: Changing Avatar's tone also changes its treatment.
- Evidence:

  | Tone | Avatar paint | Source | Badge equivalent |
  |---|---|---|---|
  | neutral | soft plate #ee, muted ink | display.css:52-55 | |
  | accent | solid `accent-solid`, white ink | display.css:57-60 | soft `accent-surface` + `fg-accent` (badge.css:74-84) |
  | inverse | solid | display.css:62 | |
- Options:
  A. Keep it (a hued fallback reads as identity) and document tone = treatment for Avatar.
  B. Make accent soft, as in Badge.
  - Recommended: A. It is Figma's per-user hue pattern (avatar.md).
- Visual: Avatar neutral, accent and inverse beside Badge soft neutral and accent.

### C-22  Avatar renders a `<div>` that is nested inside Chip's `<button>` and Badge's `<span>`
- Families: avatar, chip, badge
- Category: a11y / api · Severity: low · Type: FIX
- What: `<div>` is not phrasing content. The Chip avatar slot places it inside a `<button>`; the Badge avatar slot places it inside a `<span>`.
- Evidence: primitives.tsx:88-89 (Avatar renders `div`). primitives.tsx:873 and Badge.tsx:35 (span slots). gallery.tsx:570-571, badge.tsx:180.
- Visual: none.

### C-23  ChipGroup has no group semantics, and the docs describe single selection that doesn't exist
- Families: chip
- Category: a11y / docs-drift · Severity: medium · Type: DECISION
- What: ChipGroup renders a plain `div` with no role, no label and no roving focus. Every chip is an independent `aria-pressed` toggle. Yet the manifest says Chip "Selects one value from a set", and the chip.css header promises "or a radio in a group". Neither is implemented.
- Evidence: primitives.tsx:955-960, manifest.ts:293, chip.css:13-14. BadgeGroup renders its overflow as `role="group"` (BadgeGroup.tsx:71); AvatarGroup has `role="group"` by default (primitives.tsx:122).
- Options:
  A. Add `role="group"` and a required label to ChipGroup, and fix both descriptions to say "toggles".
  B. Add `ChipGroup type="single|multiple"` with radiogroup semantics and roving arrows.
  - Recommended: A now. B is a new capability that should wait for the owner.
- Visual: The accessibility tree of the current ChipGroup vs option A.

### C-24  Removable Chip: native props land on the wrong element or are dropped
- Families: chip
- Category: api · Severity: medium · Type: FIX
- What: With `onRemove`, `className` and state go on the outer span, but `...rest` (style, id, aria-*, data-*) goes on the inner action button. For a non-clickable input chip, `rest` is dropped entirely, and the `ref` moves to the remove button.
- Evidence: primitives.tsx:887-897 (`<span className={classes} {...state}>`, `{...rest}` only on `.area-chip__action`, `ref={primaryInteractive ? undefined : ref}`). chip.test.mjs:21-34 check only structure.
- Visual: none.

### C-25  Indicator `disabled` means "hide", and its labels are hard-coded
- Families: indicator (vs count)
- Category: api · Severity: low · Type: DECISION
- What: `disabled` returns `null`, a Mantine carry-over that clashes with the system meaning of disabled (dimmed and inert). Its default names ("N notifications", "New activity", "Processing") are English literals with no `label` prop, while Count has `label`.
- Evidence: Indicator.tsx:11, 24, 26. Count.tsx:20, 33.
- Options:
  A. Rename to `hidden` (keeping an alias) and add `label` as in Count.
  B. Keep it.
  - Recommended: A.
- Visual: none.

### C-26  Stale docs, where code or owner decisions have moved on
- Families: all
- Category: docs-drift · Severity: medium · Type: FIX
- Evidence:
  - DESIGN_SYSTEM.md:163-164 says "Badge has a dedicated 20/24/28px label ramp" and "16px at sm and md". The code has Badge 16/20/24 (badge.css:4-7, badge.md:444) and no Checkbox/Radio sm (choice.css:404-406).
  - DESIGN_SYSTEM.md:52-55 says Checkbox, Radio, Chip and AlignmentPicker "await owner review". All are approved (component-status.mjs:24, 28, 35).
  - DESIGN_SYSTEM.md:76-77 (the dismiss rule) and :84 (neutral tone defaults) are contradicted by C-4 and C-14.
  - DESIGN_SYSTEM.md:207 ("icons 12/16/24") is contradicted by the Avatar md icon of 20 (display.css:76) and the choice tile visual of 20 (choice.css:153).
  - cohesion-audit.md:50 still says "16px at sm and md".
  - The choice.css:1 comment still reads "16 / 16 / 20px".
  - checkbox.md:29, 97 and radio.md:29 still list sm and `gap-sm`. checkbox.md:59, 79 say the control has `shadow-1`; it has none.
  - checkbox.md:122-123 and radio.md:107 say there is "no forced-colors rule". forced-colors.css:38-54 covers both.
  - switch.md: line 78 (off fill #d4), line 118 (hover `fill-toggle-hover` #c5) and line 141 (match #d4) are stale.
  - slider.md: the States table says the hover darkens the rail ("rail `fill-toggle-hover`"), but slider.css:30 keeps the rail. The Decisions row calls the rail "shared with Switch"; the Switch moved to `edge-control`.
  - chip.md: line 64 (remove 16px), line 83 (sm 12/16) and line 145 (Badge 20/24/28) are stale.
  - avatar.md:134 says "Chip avatar … 12px at md match"; Avatar md is 14.
  - pages.mjs:714 says the Switch track is "28×16, 36×20 and 44×24". The code has 28/32/36 (switch.css:5-6).
  - manifest.ts:310 describes `choiceLabel` as "The title and description beside a checkbox, radio or switch". Switch uses its own `__text` / `__label` / `__description` (Switch.tsx:104-107).
  - HANDOFF.md:6 says "Indicator stays In review"; it is approved (component-status.mjs:12).
- Visual: none; this is a checklist.

### C-27  Group spacing, legends and disabled groups differ across families
- Families: chip, badge-group, checkbox, radio (vs field)
- Category: consistency · Severity: low · Type: DECISION
- What: Chip and Badge wrap sets use different gaps, choice-group legends sit twice as far from their options as a Field label from its control, and a disabled fieldset dims its options but not its legend, while a disabled Field mutes its label.
- Evidence:

  | Measurement | Value | Source |
  |---|---|---|
  | ChipGroup gap | 4 / 4 | chip.css:264; chip.md "Area spacing", no external basis |
  | BadgeGroup gap | 6 / 8 (Notion) | badge.css:207 |
  | Choice-group legend → options | 12 | choice.css:302, 336 |
  | Field label → control | 6 | field.css:12 |
  | Disabled choice group | options at 50% | choice.css:313, 347 |
  | Disabled Field label | muted | field.css:55-57 |
- Options:
  A. ChipGroup to 8 / 8 (Material chip set 8), legend gap to Field's 6, and dim the whole disabled fieldset.
  B. Keep it and document.
  - Recommended: A for the legend and the disabled state (the DS says "dim as a whole"). The ChipGroup gap is the owner's call.
- Visual: A Field above a RadioGroup and a CheckboxGroup, both enabled and disabled, with the gaps annotated.

### C-28  Forced-colours gaps in the marks
- Families: avatar, badge, checkbox/radio card
- Category: a11y · Severity: low · Type: FIX (unverified)
- What: Three visual states probably don't survive forced colours:
  - The Avatar active ring is a `box-shadow`, so it disappears and the active state is lost.
  - The Badge forced-colours rule paints `.area-badge__dot` (the 8px square slot), while the round disc is its `::before`. This probably renders a square dot.
  - A chosen choice card's edge is forced to CanvasText, the same as an unchosen card; only the glyph shows the choice.
- Evidence: display.css:68-72. badge.css:50-51, 230. choice.css:128-131; no card rule in forced-colors.css.
- Visual: A Windows High Contrast mock of an active Avatar, a dot Badge, and chosen vs unchosen cards.

### C-29  Unmarked literals in Slider; compact density splits the thumb from the glyph ladder
- Families: slider
- Category: system-rule · Severity: low · Type: FIX
- What: Slider carries literals without `/* spec */`. Also, the thumb uses density-varying icon tokens, while the Checkbox glyphs use fixed space tokens, so under compact density the sm thumb becomes 12 while the glyphs stay 16.
- Evidence:
  - `calc(var(--_track) + 6px)` (slider.css:47) and `minmax(80px, 1fr)` (slider.css:93) have no `/* spec */`.
  - The 42% / 46% dot stops (slider.css:222) are unmarked, though documented in the spec.
  - Thumb `--_thumb: var(--area-icon-sm/md)` (slider.css:305-306); compact `icon-sm` = 12 (density.ts:92). Checkbox uses `space-16/20` (choice.css:408, 414).
- Visual: Compact density: Slider sm next to Checkbox md.

### C-30  Gallery hygiene
- Families: checkbox, radio, switch, count, indicator, badge
- Category: gallery · Severity: low · Type: FIX
- Evidence:
  - **Product copy in tiles (against "Example copy").** Checkbox card tiles use "Notifications", "Mentions", "When someone @mentions you", "Page updates" and "Edits to pages you follow" (gallery.tsx:505-523). The Radio card uses "Plan", "Basic", "Up to 10 members and 20 GB", "Business" and "Enterprise" (gallery.tsx:1767-1770). The Badge "State / Open, Done, Closed, Draft, Queued" tiles and "Japan"/"Design" (badge.tsx:181-184) are borderline.
  - **SwitchList has a bold label.** The Settings list tile (build.mjs:1000) uses `<strong>Label</strong>` (switch.tsx:24). No reset sets `strong`'s weight (reset.css, base.css), so it likely renders bold, off the 400/500 policy.
  - **Radio lacks tiles Checkbox has.** There is no `card-accent` or `disabled-selected` Radio tile (build.mjs:655-667 vs 634-653).
  - **Count "Size / sm" mixes axes.** It also switches to `variant="soft"` (count.tsx:8), so the size tile shows two variables.
  - **Indicator tiles use Badge names.** Its specimens are still named `GalleryBadge*` (build.mjs:521-541).
  - **Docs demos show several sizes in one container.** BadgeSizes, SwitchSizes and BadgePresenceSizes (badge.tsx:17-21, switch.tsx:34-40, badge.tsx:192) are docs-page demos only; the docs site is hidden.
- Visual: None needed.

### C-31  Open owner questions still unresolved in specs and handoff
- Families: count, badge, slider/progress, icons
- Category: docs-drift · Severity: low · Type: DECISION
- Evidence:
  1. Count text: 14 (Notion) or 12 (count.md, Visual pass: "Open for the owner").
  2. Badge md: the 12px label hangs 0.7px below a 14/20 line (badge.md:57-59, "Open: whether to absorb it").
  3. Slider:
     - thumb 16 vs the common 20 at md;
     - a hover/drag response on the thumb;
     - a value tooltip;
     - Shift+arrow large steps.
     (slider.md feedback 2026-09-27)
  4. Figma's lighter tracks (#f5/#e6) vs Area's #dd rail (HANDOFF.md:292-293); ties to C-1.
  5. The size model (12–20px) and the 12px glyphs in Badge (sm icon and dismiss) and NumberField (HANDOFF.md:354-355).
  6. Dark theme is unverified for every family here (switch.md:159, count.md, avatar.md).
- Options: each needs a yes/no from the owner. The recommendations, where evidence supports one:
  - (1) Keep 12, to match Badge.
  - (3) Add Shift+arrow ×10 steps (Carbon, MUI) and keep the thumb at 16.
  - (4) Follow C-1 B.
- Visual: For (1), a Nav row with Count 12 vs 14. For (3), Slider md with a 16 vs 20 thumb.

### C-32  Chip `assist`, `suggestion` and `filter` look identical
- Families: chip
- Category: visual · Severity: low · Type: DECISION
- What: `assist` and `suggestion` set `--_bg` to surface, which is already the base; `filter` is empty. Three "Variant /" gallery tiles therefore render identically at rest. They differ only in `aria-pressed` behaviour.
- Evidence: chip.css:71-76; build.mjs:793-796.
- Options:
  A. Keep them (kind is an interaction role, per DS naming) and group the tiles under "Behavior" instead of "Variant".
  B. Give assist or suggestion a visual difference, such as a bare rest like ChatGPT's tool pill (chip.md Sources).
  - Recommended: A.
- Visual: Four kind tiles side by side.

## Confirmed consistent

- Checked, selected and current paint is neutral by default with an accent override in Checkbox, Radio, Switch, Slider, Chip (selected) and the Avatar ring (choice.css:18-35, switch.css:14-15, slider.css:25-26, chip.css:102-116, display.css:67-73).
- Chip selected (#ee `bg-component-active`) equals Button selected and the row selection plate, one step above hover (#f3) (chip.css:104, button.css:422-424).
- Disabled dims the whole control to 50% in Checkbox, Radio, Switch, Slider and Chip, with no second recolour (choice.css:37-41, switch.css:104, slider.css:160-163, chip.css:125-128).
- Ink stays fixed on hover in every family here: Chip label and remove, Badge links, Switch, Checkbox and Slider change only plate, edge or fill.
- Focus ring geometry (2px `focus-color`, 2px offset) is shared everywhere; forced colours map it to Highlight (forced-colors.css:25-31).
- Checkbox and Radio share the 16/20 glyph ladder and the #d4 rest edge; the Slider thumb follows the ladder at default density (choice.css:404-418, slider.css:305-307).
- Switch travel is 12px at every size (track = height + 12), as the DS states (switch.css:5-7).
- Radii come from roles: Checkbox `min(radius-small, size/4)`, Avatar square `radius-control`, choice card `radius-container`; pills and circles are `radius-full` by identity.
- There are no physical left/right properties and no palette rungs in these families' CSS; Indicator placement flips with `:dir(rtl)`.
- Motion: the Switch thumb and the Indicator pulse stop under both `data-area-motion="none"` and reduced motion (switch.css:119-120, indicator.css:58-59).
- Count and Indicator share `count-format.ts` (max+, zero hiding), and Count's `label` adds visually hidden words.
- Badge solid, Indicator and Presence use the same `*-solid` / `fg-on-*` tone roles.
- The AvatarGroup ring and the IndicatorAnchor cutout are both a 1px surface ring (display.css:102, indicator.css:43).
- Every wrapper forwards refs. Switch, Slider, Checkbox and Radio spread native props onto the native input. Switch and Slider sync with form reset.
- Avatar handles image failure, including cached failures before hydration, and names itself via `alt` or `aria-label` (primitives.tsx:74-117, avatar.test.mjs).
- People in these families' demos are Irene Yamaguchi, and groups use teams (gallery.tsx:64-80, 570-571).
