# G — Conversation and code families audit

Scope: Message, Composer, Prompt suggestions, Model picker, Scroll to latest, Code (+ Token), Code block, Separator. Read-only. Colour values are from the built tokens (`packages/tokens/dist/css/tokens.css`, built 2026-09-29 09:33). Nothing here was checked in a browser. Behaviour marked "unverified" is worked out from the code.

## Summary

- **Surfaces that stand alone on a white page use the lightest seam (#f3), and in dark mode the Code block's rules disappear.** Composer and Code block have a white fill, a #f3 edge and no shadow. Card uses #ee plus a halo, and Input uses #e2. In dark mode `bg-code` and `border-decorative` are both #282828, so the Code block's header rule, toggle rule and flush rule are the same colour as the block and can't be seen. Inline Code's edge also vanishes, and Code `subtle` looks identical to the default.
- **There are two "quiet ink" values.** The owner set neutral ghost and outline Buttons to 75% of the way to muted (about #56). Message actions override that back to fully muted (#666). Prompt suggestions and the Code block's tabs and toggle also use #666. A pressed Message action toggle stays muted, which contradicts "selected toggles keep body ink".
- **Model picker and Composer have real behaviour gaps.**
  - Model picker builds its own menu button. It places the menu with CSS anchor positioning only, uses a physical `span-left`, has no ArrowDown/ArrowUp to open and doesn't close on Tab. The shared `Menu trigger` path already handles all of this.
  - Composer `busy` disables the textarea. Focus drops out after every send, and nobody can type while an answer streams.
  - Composer `disabled` doesn't reach the + button or the model picker, although the docs say "actions dim".
  - The IME guard is `isComposing` only.
- **Docs have drifted in several places.** Code block, Code and Separator specs still list `border-divider` rules, the old #fafafa ground, old 550 syntax values and Kbd `control-xs`. DESIGN_SYSTEM.md still says keycaps are radius 4 and concentric, and that toolbar separators are dividers. The owner changed all of these.
- **Open owner questions:**
  - Code block corner and code size against ChatGPT (24 and 12/20).
  - The composer-derived 16 corner on the bubble and suggestion rows, which stays 8 under the Sharp preset.
  - A shadow on Scroll to latest.
  - Model picker `size`.
  - The syntax palette reuses danger and accent colours.
  - Language tabs don't look like Tabs.

## Findings

### G-1  Quiet controls use two different inks
- Families: Message, Prompt suggestions, Code block (compared with Model picker, Scroll to latest, Composer actions and Button)
- Category: consistency
- Severity: medium
- Type: DECISION
- What: The owner lightened every neutral ghost and outline Button to 75% of the way from default toward muted, "for consistency". Message actions are ghost Buttons, but they override that back to full `fg-muted`. Prompt-suggestion rows and the Code block's tabs and toggle also use `fg-muted`. Because `message.css` loads after `button.css` with equal specificity, a `data-selected` action toggle (such as "Good response") also stays muted instead of taking body ink.
- Evidence:

  | Control | Ink | Source |
  |---|---|---|
  | Neutral ghost / outline Button | `color-mix(fg-default, fg-muted 75%)` ≈ #56 | button.css:386-389; HANDOFF.md:193-194 |
  | Model picker trigger, Scroll to latest, Composer "+", Code block copy, suggestion dismiss | ≈ #56 (these are Buttons) | ModelPicker.tsx:60, ScrollToLatest.tsx:39 |
  | Message actions | `fg-muted` #666 | message.css:50 |
  | Prompt-suggestion rows | `fg-muted` #666 | prompt-suggestions.css:16 |
  | Code block tab (unselected), show/hide toggle | `fg-muted` #666 | code.css:92, 456 |
  | ChatGPT | message actions #8f, suggestions #8f → #0d on hover, picker #8f, scroll glyph #5d | message.md:45, prompt-suggestions.md:32, model-picker.md:26, scroll-to-latest.md:24 |

- Options:
  - A: Every quiet control uses the ghost-Button ink. Drop message.css:50, and set suggestion rows and the Code block's tabs and toggle to the same mix.
  - B: Keep two levels, the Button ink for controls and #666 for text-like rows (suggestions, tabs). Only the Message override goes, because those are Buttons.
  - C: Keep things as they are and document #666 as a "chrome under content" level.
  - Recommended: B. The owner's decision was about Buttons, and Message actions are Buttons (their override is from before 2026-09-28). Suggestion text and tab labels are text, where the muted/default pair of the unselected-option rule already applies.
- Visual: A row of Message actions, the model picker trigger and the scroll button side by side. Show the Message icons (#666) visibly lighter than the others (#56), plus a pressed "Good response" that stays muted.

### G-2  Composer and Code block sit on the page with the faintest edge
- Families: Composer, Code block (compared with Card, Input and Textarea)
- Category: visual / system-rule
- Severity: high
- Type: DECISION
- What: DESIGN_SYSTEM says a surface that "stands alone on the page, with the page's fill and little or no lift" takes a firmer edge (DESIGN_SYSTEM.md:95-101). Card follows this (#ee plus a halo). Composer lost ChatGPT's shadow (owner: no resting shadow), and the Code block's ground became the page white in batch 22. Both now show white-on-white with a #f3 hairline, about 1.1:1 against the page, which is lighter than any field edge. Composer also has no hover edge step, while Input and Textarea do.
- Evidence:

  | Surface | Fill | Edge | Shadow | Hover | Radius |
  |---|---|---|---|---|---|
  | Composer | `input-bg` #fff | `border-decorative` #f3 (composer.css:15) | none (:25) | none | 16 |
  | Code block | `bg-code` #fff (curves.ts:139) | `border-decorative` #f3 (code.css:186) | none | — | 12 |
  | Card md | `bg-surface` #fff | neutral-100 #ee (surface.css:56, 85) | 2-layer 3% halo | edge step | 24 |
  | Input / Textarea | `bg-surface` | `edge-control` #e2 (input.css:21, 36) | none | edge step (input.css:63) | 8 |
  | ChatGPT composer | #fff | 4% ring | 0 2 8 4% + 0 4 80 8 2.4% | — | 26 (composer.md:42) |
  | ChatGPT code block | 5% black fill | 5% edge | — | — | 24 (code-block.md:151) |

- Options:
  - A: Both take Card's standalone edge, neutral-100 #ee, without Card's halo.
  - B: Both take `border-divider` #e2, as the DS text says. The Composer then equals the Input edge, and could share Input's hover step.
  - C: Keep #f3, and give the Code block back a tinted ground (a #fa stripe) so it separates by fill.
  - Recommended: A. It respects the owner's "lighter" and "no resting shadow" preferences while meeting the DS rule. It also makes every content surface on a white page use one edge. For Composer, add Input's hover edge step either way.
- Visual: A white page with Composer, Code block, Card and Input stacked. Show the Composer and Code block edges barely visible next to Card and Input.

### G-3  Dark mode: Code block rules and inline Code edge match their own fill
- Families: Code block, Code
- Category: visual
- Severity: high
- Type: FIX
- What: In dark mode `bg-code` = `bg-stripe` = `bg-subtle` = `border-decorative` = #282828. The Code block's header rule, toggle rule and flush top rule are drawn in `border-decorative` on a `bg-code` ground, so they can't be seen in dark. The shell edge and inline Code's edge also vanish; the block still separates from the #121212 page by its fill. Both specs list dark mode as unverified (code-block.md:157, code.md:130). This comes from the token values and was not checked on screen.
- Evidence: tokens.css: `--area-bg-code: light-dark(#ffffff, #282828)`, `--area-border-decorative: light-dark(#f3f3f3, #282828)`, `--area-bg-stripe: light-dark(#fafafa, #282828)`, `--area-bg-subtle: light-dark(#f7f7f7, #282828)`. The rules are at code.css:39 (header), 201 (flush) and 454 (toggle). Inline Code's edge is at code.css:142.
- Visual: A dark Code block with a header and a collapsed toggle. Show the header and toggle rules missing, next to the light version where they show.

### G-4  Code `subtle` is darker than the default in light, and identical in dark
- Families: Code, Token
- Category: visual
- Severity: medium
- Type: DECISION
- What: `subtle` is documented as "A quieter treatment". It paints `bg-subtle` (#f7f7f7), which is darker than the default `bg-stripe` (#fafafa); in dark both are #282828. The only non-default variant is therefore inverted in light and missing in dark.
- Evidence: token.css:46-50; tokens/src/emit/base.ts:175-176; code.css:141; the default and treatments tiles measure rgb(250) and rgb(247) (code.md:76).
- Options:
  - A: Remove `subtle`. Token is already a deprecated alias, and Code would keep only `on-color`.
  - B: Make `subtle` genuinely quieter: no fill, keeping the edge (or the page fill), in both themes.
  - C: Keep it.
  - Recommended: B. It keeps the documented job ("a derived reference") and makes the variant distinct and correctly ordered in both themes.
- Visual: Default and subtle Code side by side in light and dark. Show subtle darker in light and identical in dark.

### G-5  The syntax palette reuses the danger tone and the accent
- Families: Code block
- Category: system-rule
- Severity: medium
- Type: DECISION
- What: Keywords paint in `fg-danger-vivid`, the same token as the diff "removed" marker, so in a diff a keyword and a deletion share one red. Strings follow the accent axis by default. Tag, attribute and string are three blue-violet families (#8d4df3, #006df5, #5c5dfe), and a consumer's blue accent would make strings and attributes the same colour. The owner explicitly kept accent strings (code-block.md:19-20). The finding is that this bends "Tone means meaning" and "accent by override" (DESIGN_SYSTEM.md:38-50) without syntax roles of its own.
- Evidence: code.css:412-415 (the syntax rules) against code.css:370-376 (the diff markers). tokens.css: danger-vivid #e80945, discovery #8d4df3, info #006df5, accent #5c5dfe. The code.css:404-410 comment acknowledges the crowded blue-violet family.
- Options:
  - A: Keep it (owner decision, 2026-09-26).
  - B: Add four syntax roles (`syntax-keyword/tag/attr/string`) that alias today's vivid rungs. The colours don't change now, but syntax stops borrowing danger and accent names and can be tuned without touching tones.
  - C: As B, but strings also move off the accent axis, onto an unused hue such as success-vivid green, so an accent change never recolours code.
  - Recommended: B now, and keep C in mind if a blue accent ships. It's the smallest change that satisfies "Additional roles require a clear job".
- Visual: A diff block with a removed line containing a keyword, both in the same red. Beside it, the same sample with a blue accent, where strings and attributes read the same.

### G-6  Code block language tabs look different from Tabs
- Families: Code block (compared with Tabs)
- Category: consistency
- Severity: medium
- Type: DECISION
- What: The header tabs are a separate implementation. Their indicator, hover model, focus offset and forced-colours handling all differ from Tabs, yet the spec calls them a "match" and gets Tabs' underline thickness wrong.
- Evidence:

  | | Tabs (navigation.css) | Code block tab (code.css) |
  |---|---|---|
  | Selected indicator | 2px (`space-2`), full tab width, radius-full (:54-63, 97-100) | 1px (`border-width`), 6px in, radius-small (:114-122) |
  | Hover | pending indicator `border-hover`, no plate (:66-69) | `bg-component-hover` plate (:101-103) |
  | Focus | inset, offset −2 (:102-107) | offset +2 (:105-108) |
  | Forced colours | indicator restored with Highlight (forced-colors.css:62) | none |
  | Spec claim | — | "1px underline… match" (code-block.md:137) |

- Options:
  - A: Render the language switcher as Tabs `size="sm"` inside the header.
  - B: Keep a bespoke header tab, but take Tabs' 2px indicator, pending-indicator hover, inset focus and forced-colours rule.
  - C: Keep it as it is and fix the spec.
  - Recommended: A. There is one tab language, and the forced-colours behaviour comes for free.
- Visual: A Tabs sm row above the Code block header tabs. Show the 2px full-width bar against the 1px inset line, and the hover plate against the pending bar.

### G-7  Code block and Code specs describe values the code no longer has
- Families: Code block, Code
- Category: docs-drift
- Severity: medium
- Type: FIX
- What: Batch 22 and the "never darker than its container" rule changed the CSS, but several spec tables weren't updated.
- Evidence:
  - code-block.md:59, 66 (anatomy) say the header and toggle rules are `border-divider`. The actual value is `border-decorative` (code.css:39, 454); code-block.md:100 already says so.
  - code-block.md:83 (shell background rgb(250)) and :154 ("#fa fill") are stale. The ground is #fff (curves.ts:139).
  - code-block.md:85 lists syntax rgb(207,3,60) etc., the 550 rungs. :109 lists the 500 values.
  - code-block.md:139 says Code's ground is `bg-code` = match. Inline Code uses `bg-stripe` (code.css:141).
  - code-block.md:141 says Separator, Panel and Menu separator all use `border-divider`. The Menu separator and the Code block rules are decorative.
  - code-block.md:129 says "a failure is not announced separately". A live region announces "Copy failed" (primitives.tsx:1744-1746).
  - code.md:114 gives Kbd radius `control-xs`. It is `radius-control-sm` 6 (kbd.css:18). code.md:116 claims Code block ground = match.
  - code.css:27-29 says the header is "a control tier tall" (32). It measures 37 (4 + 28 + 4 + 1; code-block.md:69).
- Visual: none (a text table of spec line against code line).

### G-8  Separator spec and the DESIGN_SYSTEM divider list are stale
- Families: Separator (compared with the Menu, Toolbar and Nav separators)
- Category: docs-drift
- Severity: medium
- Type: FIX
- What: The Separator's paint is right: `border-divider` #e2 (display.css:108). Its docs and peers table are not.
- Evidence:
  - separator.md:3-4 says "the owner has not re-reviewed it", but component-status.mjs:39 lists it as Complete and batch 22 approved it.
  - separator.md:106 describes the Menu separator as `border-divider` with 8px margins. Actual: `border-decorative`, 2px block margin (surface.css:1126-1134).
  - separator.md:108 describes the Toolbar separator as `border-divider`. Actual: `border-decorative` (toolbar.css:67), which the owner lightened in round 3 (HANDOFF.md:320-322).
  - separator.md:109 says Code block and Panel use `border-divider`. Both are decorative now.
  - DESIGN_SYSTEM.md:97-98 still lists "toolbar separators" among the divider rules.
  - cohesion-audit.md:83 still reads "Separator confirmed border-decorative" (first-pass history) with no note that it was superseded.

  | Rule | Token | Light |
  |---|---|---|
  | Separator | `border-divider` | #e2 |
  | Nav separator | `border-divider` (nav.css:228) | #e2 |
  | Tabs track | `border-divider` (navigation.css:75) | #e2 |
  | Menu separator | `border-decorative` | #f3 |
  | Toolbar separator | `border-decorative` | #f3 |
  | Code block / Panel rules | `border-decorative` | #f3 |

- Visual: none (a docs table). Optionally show the six rules in a row to confirm the two intended levels.

### G-9  DESIGN_SYSTEM's keycap rule contradicts the approved Kbd
- Families: Kbd (the Code vs Kbd jobs)
- Category: docs-drift
- Severity: low
- Type: FIX
- What: DESIGN_SYSTEM.md:81-83 says keycaps are "radius 4" and, inside a Button, "concentric with the button's". The owner's batch 11 decision is 6px everywhere and not concentric (kbd.css:16-18; HANDOFF.md:112-124; component-status.mjs:20).
- Evidence: As above.
- Visual: none.

### G-10  Code and Kbd corners come from different radius roles, and Kbd has no cap
- Families: Code, Kbd
- Category: system-rule
- Severity: low
- Type: DECISION
- What: Code uses `min(radius-small, height × radius-cap)` (code.css:153-156). Kbd uses `radius-control-sm` with no cap (kbd.css:18). Both are 6 at Standard, but they diverge on other presets. Under Pill, Kbd becomes a full pill (control-sm 999) while Code stays about 8.8. DS: "respect the box cap". Their on-colour mixes also differ: Code uses oklab 8% fill / 20% edge (token.css:52-57), Kbd uses srgb 14% (kbd.css:97).

  | Preset | Code | Kbd |
  |---|---|---|
  | Subtle | 2 | 3 |
  | Standard | 6 | 6 |
  | Round | 8 | 8 |
  | Pill | ≈ 8.8 | 999 (pill) |

- Options:
  - A: Both use `min(radius-control-sm, height × cap)`.
  - B: Both use `radius-small`.
  - C: Keep them as they are.
  - Recommended: A. The owner named the keycap token (control-sm), and the cap keeps Pill from turning keys into lozenges.
- Visual: Code and Kbd side by side under the Subtle, Standard and Pill presets.

### G-11  Model picker has its own menu button without the shared overlay behaviour
- Families: Model picker (compared with Menu `trigger`, Split button)
- Category: interaction
- Severity: high
- Type: FIX
- What: Menu's `trigger` (AnchoredMenu) already provides the APG menu button: JS positioning, ArrowDown/ArrowUp to open, Tab to close and a native invoker. ModelPicker drives a bare hosted Menu itself. Three gaps follow:
  1. **Positioning is CSS anchor only.** With `margin: 0` and no `@supports` fallback, the popover would sit at the viewport's top-left in engines without anchor positioning (unverified in a browser). The handoff records that Split button menus were "misplaced" by CSS anchor and moved to `useAnchoredPosition`.
  2. **The placement is physical.** `position-area: bottom span-left` extends leftward in RTL too, where the trigger already sits at the composer's left. The fallback flips only on the block axis.
  3. **Keyboard gaps.** ArrowDown/ArrowUp on the trigger don't open the menu, and Tab leaves the menu open.
- Evidence:
  - model-picker.css:12-23 (anchor only, `span-left`, `flip-block`).
  - ModelPicker.tsx:41-50 and 60-67 (manual `showPopover`, click toggle, Escape).
  - Overlays.tsx:120 (`useAnchoredPosition`), :140 (Tab closes), :171-177 (trigger arrow keys).
  - SplitButton.tsx:68.
  - HANDOFF.md:320-321.
  - primitives.tsx:1055-1060: without a trigger, "the host… handles the item keys itself".
- Visual: A composer at the bottom of an RTL page with the menu opening off the composer's edge, beside the LTR placement.

### G-12  Only Model picker paints its trigger while the menu is open
- Families: Model picker (compared with Menu trigger Buttons, Split button, Select)
- Category: consistency
- Severity: low
- Type: DECISION
- What: The picker keeps the hover wash while open (`[aria-expanded="true"] { --_bg: var(--_bg-hover) }`, following ChatGPT's 5%). Every other menu trigger shows nothing while open; Split button only rotates its chevron.
- Evidence: model-picker.css:11; split-button.css:87; no other `aria-expanded` paint in `packages/styles/src`.
- Options:
  - A: Every menu-button trigger keeps its hover plate while open, following ChatGPT.
  - B: Only Model picker does (as now).
  - C: None do.
  - Recommended: A. The trigger stays anchored to its open surface, and one rule in button.css covers every family.
- Visual: A Model picker, a Menu trigger and a Split button, each open. Only the picker's trigger shows a plate.

### G-13  Composer `busy` disables the field, which removes focus and blocks typing
- Families: Composer
- Category: interaction
- Severity: high
- Type: DECISION
- What: `busy` sets the textarea to `disabled`. After each send, focus leaves the composer, because a disabled control loses focus. The person also can't draft the next prompt while the answer streams. ChatGPT keeps the field editable and turns send into Stop. There is no `aria-busy`, and the prop is named `busy` while Button's equivalent is `loading`.
- Evidence: Composer.tsx:85 `disabled={disabled || busy}`; Composer.tsx:80 sets only `data-busy`; composer.css:38 sets only the cursor; Button.tsx:34 `loading`; pages.mjs:167 says "(sending: the field and send pause)".
- Options:
  - A: `busy` keeps the field editable and focused, and the send slot becomes a Stop Button (`onStop`), following ChatGPT.
  - B: Keep the field editable and focused, with only send disabled.
  - C: Keep it as it is.
  - Recommended: A (or B if Stop is out of scope). Whichever is chosen, add `aria-busy` and rename to `loading` to match Button.
- Visual: A busy composer with the caret still in the field and a square Stop in the send position, next to today's greyed state.

### G-14  A disabled Composer doesn't disable its actions, though the docs say it does
- Families: Composer, Model picker
- Category: interaction / docs-drift
- Severity: medium
- Type: FIX
- What: `disabled` paints the field and disables send. The consumer's leading and trailing actions and the `mode` slot (for example a ModelPicker) stay active at full ink. The API table promises "(field paint; actions dim)".
- Evidence: composer.css:35-37 (field paint only); Composer.tsx:78-79 (send only); pages.mjs:167.
- Fix: Wrap the action slots in `<fieldset disabled>`, which disables every nested button natively and would pick up Button's 50%, or pass `disabled` through context. Otherwise correct the doc.
- Visual: The disabled tile with a live "+" and model picker at full ink.

### G-15  Composer: IME guard, form reset, prop/ref targets and tests
- Families: Composer
- Category: interaction / api
- Severity: medium
- Type: FIX
- What: Four smaller gaps.
  - **IME:** The guard only reads `nativeEvent.isComposing`. In Safari, the Enter that commits an IME candidate can arrive after `compositionend` with `isComposing` false, so Japanese or Chinese input would send mid-composition. The usual guard also checks `keyCode === 229`. This is based on WebKit's known behaviour and wasn't tested.
  - **Form contract:** The textarea is always internally controlled (`value={text}`), so a form reset won't clear an uncontrolled Composer (DS:134-136). This wasn't tested.
  - **Targets:** The ref goes to the textarea, but `...rest` (aria-*, data-*, id) goes to the outer div. The generated `id` overrides `inputProps.id`. `onSubmit` receives `text.trim()`, which strips the leading indentation of pasted code.
  - **Tests:** No test covers Enter, Shift+Enter, Cmd+Enter, IME, the empty guard or auto-grow. packages/react/tests has no Composer test, although composer.md:86 claims "all 87 React tests".
- Evidence: Composer.tsx:67, 73, 80, 84-85; `grep Composer packages/react/tests` finds nothing.
- Visual: none.

### G-16  Prompt text doesn't line up with the composer's text (off by 8)
- Families: Prompt suggestions, Composer
- Category: visual
- Severity: medium
- Type: FIX
- What: The icon centres line up (24 and 24, which is what the spec verified), but the text columns don't. Composer text starts at 8 (shell) + 32 (action) + 8 (gap) + 8 (textarea padding) = 56. Suggestion text starts at 8 + 32 + 8 = 48. ChatGPT puts both at 52. The numbers are computed from the CSS; the text column wasn't measured.
- Evidence: composer.css:14, 39 (gap 8), 43 (padding-inline 8); prompt-suggestions.css:23, 30, 56; prompt-suggestions.md:33-34, 47, 67-68.
- Fix: Give the suggestion text gap 16 (or add an 8 inset on `__text`) so prompts start under the placeholder.
- Visual: The composer above the suggestion list, with a vertical guide at x = 56 against 48.

### G-17  The composer-derived 16 corner: rows, bubble and the Sharp preset
- Families: Prompt suggestions, Message, Composer
- Category: system-rule
- Severity: medium
- Type: DECISION
- What: Composer, the Message bubble and the suggestion rows all use `radius-control-md + 8`. Suggestion rows are rows, yet every other row uses `radius-row` 8 (Menu, Nav), and ChatGPT's suggestion rows are 8. Under the Sharp preset ("square corners throughout") all three stay at 8. The bubble ignores `submitPill`. This was already an open owner question in the fourth pass.
- Evidence: prompt-suggestions.css:34; message.css:30; composer.css:21-22; nav.css:237 (`radius-row`); radius.ts:99 (Sharp control 0); cohesion-audit.md:317.

  | Preset | Composer / bubble / suggestion row | Menu / Nav row | Container |
  |---|---|---|---|
  | Sharp | 8 | 0 | 0 |
  | Standard | 16 | 8 | 12 |
  | Pill | 24 | pill | 24 |

- Options:
  - A: Suggestion rows use the row role (8, as ChatGPT does). Composer and bubble keep the concentric 16, but written as `max(0, control-md) + min(8, control-md)` or similar, so they go square under Sharp.
  - B: Keep all three at 16 and only fix Sharp.
  - C: Keep them as they are.
  - Recommended: A. Rows look like rows, the corner matches the evidence, and the radius axis is respected.
- Visual: Standard and Sharp side by side, each with a composer, suggestion rows and a Menu. The composer stays rounded under Sharp.

### G-18  Prompt-suggestion rows: no pressed plate and an oversized dismiss
- Families: Prompt suggestions
- Category: system-rule
- Severity: low
- Type: FIX
- What: Rows have hover and focus plates but no `:active` state. DS shared state paint says pressed is `bg-component-active`. The dismiss is an md 32 Button; the DS rule for nested dismiss and close actions is 28 at the small-button radius, which the Code block's copy and Toast's dismiss both follow.
- Evidence: prompt-suggestions.css:47-49 (no `:active`); PromptSuggestions.tsx:44 `size="md"`; DESIGN_SYSTEM.md:62-64, 76-77.
- Visual: A pressed row next to a pressed Menu row, and the 32 dismiss next to the 28 Code block copy.

### G-19  Scroll to latest ignores content growth and drops focus
- Families: Scroll to latest
- Category: interaction / a11y
- Severity: medium
- Type: FIX
- What: Two behaviour gaps and one open question.
  - **Visibility:** Visibility is recomputed only on scroll and when the container resizes. Streamed content that grows `scrollHeight` without a scroll leaves the button hidden while the reader falls behind.
  - **Focus:** After a click, the focused button becomes `aria-hidden`, `tabIndex -1` and `visibility: hidden`, so keyboard focus falls to `<body>`.
  - **Open owner question:** a shadow for the button. The `visible` manifest state has no gallery tile; the only tile is hidden until scrolled.
- Evidence:
  - ScrollToLatest.tsx:23-28: the ResizeObserver watches only the container.
  - ScrollToLatest.tsx:39-40 and scroll-to-latest.css:20-24 (hiding).
  - cohesion-audit.md:315 (shadow question); build.mjs:433-435 (one tile); manifest.ts:455.
  - The spec contradicts itself: "16 icon in default ink" (scroll-to-latest.md:43) against "now matches" #56 (:45).
- Fix: Observe the content element (or use a MutationObserver). After scrolling, move focus to the composer or the last message.
- Visual: A tile frozen in the visible state, plus a streaming sequence where the button fails to appear.

### G-20  Forced colours: separators, the selected language tab and line marks disappear
- Families: Separator, Code block (and Menu, Nav and Toolbar separators)
- Category: a11y
- Severity: medium
- Type: FIX
- What: Forced colours replace authored backgrounds and drop box-shadows. The following are painted only that way, so they vanish:
  - Separator and the Menu, Nav and Toolbar rules (all `background-color`).
  - The Code block's selected-tab underline (`::after` background), which leaves the selected tab indistinguishable.
  - The `:target` rail (`box-shadow`).
  - Highlighted-line tints.

  forced-colors.css restores only the Split button and Button group dividers and the Tabs indicator. separator.md:98-100 already lists this as unverified. The conclusion is reasoned from forced-colours rules and wasn't observed.
- Evidence: display.css:106-110; code.css:114-122, 358-360, 382; forced-colors.css:13-17, 62.
- Visual: A Windows High Contrast mock with a Separator, language tabs and a highlighted or linked line, all flattened.

### G-21  Code block: copy, toggle and link semantics
- Families: Code block
- Category: a11y
- Severity: low
- Type: FIX
- What: Six smaller gaps.
  - **Copy:** A successful copy changes the button's name to "Copied" and also announces "Copied to clipboard" through the live region, which is likely a double announcement. A failure has no visual state.
  - **Toggle:** The show/hide toggle changes its label and `aria-expanded` together (double state) and has no `aria-controls`.
  - **Collapsed lines:** They are clipped but stay in the accessibility tree, and linked line numbers stay in the tab order.
  - **Linked lines:** `linkLines` makes every line number a tab stop and a "Line n" link inside `<pre>`.
  - **Hard-coded names:** "Language" is fixed for both the tablist and the Select.
  - **Scrolling without tabs:** Without tabs, the horizontally scrolling `<pre>` has no tabindex.
- Evidence: primitives.tsx:1620, 1657, 1676, 1693, about 1718 (line links), 1737, 1744.
- Visual: A screen-reader transcript of copy and expand, next to a collapsed block with focus landing on a hidden line number.

### G-22  The stacked Composer's mode demo copies ModelPicker without its semantics
- Families: Composer, Model picker
- Category: gallery / a11y
- Severity: low
- Type: FIX
- What: The stacked Composer demo builds its own mode control: a soft Button plus Menu rows marked with `data-selected` and a check drawn in the shortcut slot. These are `menuitem` rows with no `aria-checked`. ModelPicker, the component for this job, is a ghost trigger with `menuitemradio` rows. The two "mode" controls in the same component family look and announce differently.
- Evidence: gallery.tsx:2154 compared with ModelPicker.tsx:60-70.
- Visual: The stacked composer's soft "Standard ⌄" next to the inline composer's ghost "Instant ⌄".

### G-23  Example copy in conversation demos uses a product story and a real product name
- Families: Message, Prompt suggestions, Model picker, Scroll to latest, Composer
- Category: gallery
- Severity: low
- Type: DECISION
- What: DESIGN_SYSTEM's Example copy says to use slot names and "not invent a product, a person or a domain". Conversation demos instead use:
  - `authorName="ChatGPT"`, which puts a real product's name in the accessible name "ChatGPT said".
  - Inspector-panel Q&A as message content.
  - "Summarize the latest design review notes" and similar as prompts.
  - Model names "Auto / Instant / Thinking" and "Leaving on October 14".

  Code and Code block demos follow the vocabulary ("Button", "Code", "Placeholder"). No people appear, so the Irene Yamaguchi rule is not triggered.
- Evidence: DESIGN_SYSTEM.md:220-241; gallery.tsx:1096-1100, 1135-1159, 1170-1175, 1191-1194, 1202-1206.
- Options:
  - A: Switch to slot vocabulary: "Body text", "Item one", "Option one", `authorName` "Assistant", placeholder "Placeholder".
  - B: Allow a conversation exception, like verification fixtures, but drop "ChatGPT".
  - C: Keep it.
  - Recommended: B at minimum (remove the real product name). Choose A if the owner wants strict parity.
- Visual: The same conversation tile with product copy and with slot copy.

### G-24  API naming and targets differ across the conversation and code families
- Families: all eight
- Category: api
- Severity: medium
- Type: DECISION
- What: The same concepts are named and routed differently from one family to the next.

  | Concern | Composer | Model picker | Code block | Prompt suggestions | Message | Scroll to latest |
  |---|---|---|---|---|---|---|
  | Value change | `onValueChange` | `onValueChange` | `onLanguageChange` | `onSelect`, `onDismiss` | — | — |
  | Pending | `busy` (Button: `loading`) | — | — | — | `streaming` | — |
  | Ref target | textarea | wrapper div (trigger unreachable) | root | ul | article | wrapper (Button unreachable) |
  | `...rest` target | outer div (≠ ref) | wrapper | root | ul | article | wrapper |
  | Size | — | `size` prop, not in manifest (open q, cohesion-audit.md:318) | — | — | — | — |
  | Default in manifest | layout inline | — | — | layout list | **none** (`author` required; a bare `.area-message` has no layout; DS:137-138) | — |

  Also: the chips layout silently ignores `onDismiss` (PromptSuggestions.tsx:30-35). The 480 width is written twice with no public hook (composer.css:12, prompt-suggestions.css:12), while Input has `--area-input-inline-size`.
- Options:
  - A: Normalise. Use `onValueChange` everywhere (CodeBlock keeps `onLanguageChange` as an alias), rename `busy` to `loading`, send ref and rest to the same element (with `triggerProps` / `buttonProps` for wrapped controls), give Message a default author, and add a `--area-composer-inline-size` hook shared with suggestions.
  - B: Keep the names and document the differences.
  - Recommended: A. DS: "wrappers still need to forward native props and refs".
- Visual: none (an API table).

### G-25  Message: small spec and DS mismatches
- Families: Message
- Category: docs-drift
- Severity: low
- Type: FIX
- What: Two small mismatches.
  - The user's actions sit 12 below the bubble (the shared `gap`). ChatGPT measured 4 (message.md:58), and the decisions row gives no reason for the difference.
  - DESIGN_SYSTEM.md:194 says "message content use[s] medium UI type" (14/20), but Message prose is 16/24 (message.css:17-18). The line may refer to Alert and Toast messages; either way it needs clarifying.
- Evidence: As above.
- Visual: The user bubble with its actions 12 below against ChatGPT's 4.

### G-26  Code: inline type sizes and a 500 weight outside the ramp
- Families: Code, Code block
- Category: system-rule
- Severity: low
- Type: DECISION
- What:
  - **Inline Code:** It uses `font-size: 0.875em; line-height: 1.35` with no `/* spec */` marker. That gives 12.25px in 14px chrome and a 24.9px box, neither on the ramp nor the 4px grid. The owner question about em-based padding is still open (code.md:153).
  - **Diff markers:** They use `weight-strong` (500), although they aren't labels on fills.
  - **ChatGPT for comparison:** 0.92em, no edge, a #e9 fill.
- Evidence: code.css:148, 175-176, 320; code.md:74, 78, 124-129.
- Options:
  - A: Keep the relative size but mark it `/* spec */`, and put the markers at 400.
  - B: Snap inline Code to the ramp by context: 14 in 16 prose, 12 in 14 chrome.
  - Recommended: A.
- Visual: Inline Code in a 14px table cell showing the 12.25px glyphs, next to 12px Kbd text.

### G-27  Code block corner and code size against ChatGPT (open owner question)
- Families: Code block (compared with Card, Panel, Dialog)
- Category: visual
- Severity: medium
- Type: DECISION
- What: The handoff leaves open ChatGPT's 24 corner, 48 header and 12/20 code against Area's 12 (`radius-container`), 37 header and 14/20. Since Card moved to 24 at md, the Code block is the one standalone content surface still on the 12 container corner.
- Evidence: HANDOFF.md:204-205; code-block.md:149-156; code.css:187; Card surface.css:44 (md 24); Panel and Popover use `radius-container` 12 (panel.css:60, surface.css:867); Dialog 16.
- Options:
  - A: Keep 12 and 14/20.
  - B: Use Card's corner (24 at md) and keep 14/20, because 12/20 isn't on Area's ramp (12 pairs with 16).
  - C: Go to the full ChatGPT scale: 24, a 48 header, 12/20.
  - Recommended: B. Content surfaces on the page then share one corner, and type stays on the ramp.
- Visual: A Code block at 12 and at 24 next to a Card, and 14/20 against 12/20 code.

### G-28  Separator: always a semantic separator; the inset hook is one-sided
- Families: Separator
- Category: api / a11y
- Severity: low
- Type: FIX
- What: Three small gaps.
  - The Separator always renders `role="separator"`. There's no `decorative` option for purely visual rules, which Radix provides.
  - Vertical rules rely on a flex parent (`block-size: auto; align-self: stretch`), so they are 0 tall anywhere else.
  - Vertical inset has a hook (`--area-separator-inset`), but horizontal inset is a fixed 16.
- Evidence: primitives.tsx:327-339; display.css:119-135; separator.md:81.
- Visual: A vertical separator in a block container, collapsed to 0 height.

## Confirmed consistent

- Composer focus matches Input and Textarea exactly: field-focus border, outline and halo (composer.css:32; input.css:67-70; textarea.css:81-84). Its forced-colours ring is present (forced-colors.css:27).
- Composer disabled uses Textarea's field paint with no opacity (composer.css:35 against textarea.css:118-121), and the send Button keeps its own 50%.
- The Composer send is a solid neutral md icon-only Button with a 32 plate, and the shell is concentric at 16. `submitPill` turns it into a pill (composer.css:21-22, 58).
- The Composer placeholder uses `input-placeholder`, the same as Input. The sr-only `<label>` names the field. Enter sends, Shift+Enter adds a line and Cmd/Ctrl+Enter sends when Enter submission is off, as specified. Auto-grow refits on width changes.
- Message actions are ghost neutral md Buttons whose hover plate (`bg-component-hover`) matches Menu, Nav and Table rows. The actions stay hidden (`visibility`) while streaming.
- The Message streaming dot stops under both `prefers-reduced-motion` and `data-area-motion="none"`, and keeps CanvasText in forced colours (message.css:68-71).
- Message semantics: each turn is an `article` named "{name} said" with `aria-busy` while streaming, and the actions are a named group. User actions show on hover and focus-within, and always on touch.
- Prompt-suggestion hover is Menu's plate with fixed ink, per the cohesion rule (the ChatGPT ink lift is deliberately not followed). The dismiss hovers one step firmer. The list is a `ul` of named buttons.
- Prompt-suggestion chips are outline neutral Buttons, not Chip. That's correct under the DS job split (these are actions, not choices).
- The Model picker menu is the Menu surface with the shared floating lift (surface.css:871-874). Rows are `menuitemradio` with `aria-checked` and a trailing check. Focus opens on the current model, and choosing one returns focus to the trigger.
- The Model picker trigger follows the owner's lighter ghost ink (button.css:386-389), which settles batch 20's ink question.
- Scroll to latest is Button outline neutral pill (32), centred 24 above the composer. It isn't focusable while hidden, and the smooth scroll respects both motion settings.
- Code block linked-line rail is neutral `fg-default` and flips in RTL (code.css:382-385). No accent or focus colour is used as a marker.
- Code block ink is fixed on hover: tabs use a plate, line links and the toggle use an underline. The toggle label is 400.
- Code block's internal rules take the container's `border-decorative`, per the owner's "never darker than the container" rule. In light mode only; see G-3 for dark.
- Code block line numbers are `user-select: none` and `aria-hidden`, and copy reads `code` or the text cells, so the gutter never reaches the clipboard. Language tabs are an APG tablist with Arrow, Home and End keys, mirrored in RTL.
- Code block copy is a 28 sm ghost Button, which fits the nested-action rule.
- Syntax colours use semantic vivid tokens, not palette rungs; the batch-22 move from 550 to 500 happened through the tokens.
- Token paints exactly as Code (base.ts:175-178 alias the Code roles), and its swatch insets follow inset.css:215-228.
- Separator is 1px `border-divider` #e2 as the DS says, and matches the Nav separator and the Tabs track.
- Separator exposes `aria-orientation`, and its gallery has one variant per tile (full, inset, vertical full, vertical inset, spacing).
- Gallery tiles in these families each show one size. No example people appear.
