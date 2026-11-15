# Password field spec

**Captures:** `docs/research/captures/password-field/`
**Research:** [design-system sources](../research/compass-components-2026-10-13/password-field.md) (pinned commits, cited lines)
**Peers:** Input (the shell, sizes, variants, focus, InputAction), Search field (the other Input wrapper with an end
action), Field (label, description, error)

## Owner decisions

- 2026-10-13: after the Compass review ("add copy and reset to the gallery tiles, work on the rest of it too after") →
  Password field, OTP field, Time field, Progress circle and Stepper, the components Compass ships that Area's
  backlog already lists ("Entry and forms: PasswordField … OTP input"; "Reuse Input/Field for search and password
  anatomy; promote a wrapper when behavior such as reveal … is included").

## Job and boundaries

A password field takes a secret: a sign-in password, a new password, an API key. It is an Input whose value is
masked, with a reveal action at the end that shows it as text and hides it again. Not a strength meter (Chakra ships
that as a sibling; Area would compose Meter), not a caps-lock warning (no system ships one; Safari draws its own),
not the one-time code (OTP field).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | outline (default), soft | Input's | every system styles it as its text input |
| size | sm, md (default), lg | Input's tiers | Mantine sizes; Carbon sm/md/lg |
| state | hidden (default), shown | Carbon, Mantine, Ant, Chakra, Untitled UI, Fluent v8, GOV.UK | Edge's native reveal |
| state | invalid, disabled, read-only | Input's | — |
| content | `autoComplete` current-password (default) / new-password | GOV.UK default; MDN, WCAG 3.3.8 (let password managers fill) | Figma's sign-in (`current-password`, captured) |

Excluded: a strength meter, a caps-lock indicator, a "generate password" action, a reveal toggle outside the field.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| figma | target product | Sign-in page password field: no reveal action; masked with 3.6px letter spacing | figma.com/login, logged out, 2026-10-13 | evidence only | `figma--login-password--rest--light` |
| mantine | design system (rendered + source) | PasswordInput sm: 26 action in a 36 field, 4 from the end, `tabindex=-1`, `aria-pressed`, "Toggle password visibility" | mantine.dev/core/password-input; `PasswordInput.tsx` at `e243f7f` | MIT | `mantine--sm--rest--light` |
| carbon | design system (source) | PasswordInput: a full-height button, name swaps Show / Hide password, in the Tab order | `TextInput/PasswordInput.tsx` at `c9b1f79` | Apache-2.0 | — |
| ant, chakra, untitled, fluent-v8, gov-uk | design systems (source) | See the research file: element, Tab order, naming, icons, focus | pinned in the research file | MIT / Apache-2.0 / OGL | — |
| area | this system | Every gallery tile at 1:1, light and dark | the app, headless Edge | — | `area--*` (22) |

Target products searched without a reveal: Figma's sign-in (no reveal). ChatGPT's sign-in reveals with an eye, but
reaching its password step needs an email typed in; Notion's Settings › Change password may send the owner a
verification email. Neither was opened.

## Anatomy

```
mantine  div.Input-input (36, 1 edge, 8 radius, 0 34 0 12 padding) · input (absolute) ·
         div.section 34×34 at the end · button 26×26 (4 in, radius 8, subtle) · svg 20
area     div.area-input.area-password-field   Input's shell: height, edge, fill, radius, focus
           input.area-input__control[type=password|text][autocomplete=current-password]
           span.area-input__action > button.area-input__action-button.area-password-field__reveal
                                               [aria-label=Show password|Hide password][aria-controls=<input>]
             span.area-input__action-icon > svg[data-area-glyph=eye|eye-off]
```

Insets are Input's (`inset.css`): the action is the field less 8 (20 / 24 / 32), 4 in from the end, so its glyph sits
8 from the end at md, the same as the leading icon's inset.

## Measurements

`node scripts/capture-compare.mjs docs/research/captures/password-field/{mantine--sm,area--size-md}--rest--light.json`
(trimmed):

| slot · property | mantine · sm | area · md |
|---|---|---|
| **shell** size | 340 × 36 | 256 × 32 |
| **shell** border / radius | 1 #ced4da / 8 | 1 / 8 (Input) |
| **action** size · radius | 26 · 8 | 24 · 4 (concentric) |
| **action** edge from shell (end) | 5 (1 + 4) | 4 |
| **action-icon** box | 20 | 16 |
| **action** tab order | `tabindex=-1` | in the Tab order |

Figma's sign-in field (53 tall, 18/25 masked text with 3.6 tracking, a floating label) is a marketing-page field, not
the app's density; it is evidence that a target product ships no reveal, not a size source.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| shell, sizes, variants, focus, invalid, disabled | Input's, unchanged | Peer Input (accepted) | — |
| reveal · element | InputAction (a `button type=button` with an Area Tooltip) | Carbon, Mantine, Chakra, Untitled UI, Fluent v8, GOV.UK: a real button | Ant uses `span role=button`; not adopted |
| reveal · box | InputAction's: field − 8, 4 in, concentric radius, ghost plates | Mantine 26 in 36, 4 in; peer Search field's clear | — |
| reveal · glyph | the action: Area `eye` while hidden, `eye-off` (the closed eye) while shown | Carbon, Mantine, Chakra, Untitled, Fluent, Edge's native control | Ant shows the state instead; not adopted |
| reveal · name and state | the name says what it does: "Show password" / "Hide password" (`showLabel` / `hideLabel`), also the tooltip; `aria-controls` the input | Carbon, GOV.UK (APG: one model, a swapped name or a pressed state, not both) | Mantine and Fluent v8 keep one name with `aria-pressed`; PRODUCT_UI rule 6 (pressed toggles) covers chrome toggles, while this is a named action |
| reveal · Tab order | in the Tab order | Carbon, Ant, Untitled, Fluent, GOV.UK | Mantine and Chakra take it out; nothing else reaches it from the keyboard, unlike Search field's clear (Escape) |
| reveal · pointer | a press keeps focus and the caret in the field; the selection survives the type change | Mantine, Ant, Chakra (mousedown prevented); Ant keeps the caret | — |
| disabled | no reveal action | Mantine hides it | Others disable it; a disabled value isn't read |
| read-only | the reveal still works | none handles it | A read-only key or token is still something to look at |
| autocomplete | `current-password` | GOV.UK; MDN, WCAG 3.3.8 | Mantine defaults to `off`, against that guidance |
| after submit | the form's submit hides it again | GOV.UK (resets on submit) | — |
| native reveal | Edge's `::-ms-reveal` hidden (already in input.css) | Mantine, Ant, GOV.UK | — |
| spelling | `spellcheck=false`, `autocapitalize=off`, `autocorrect=off` | a shown password is still a secret | — |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| hidden | `type=password`, the eye, "Show password" | all |
| shown | `type=text`, the closed eye, "Hide password" | all |
| action hover / pressed / focus-visible | InputAction's plates and focus ring | peer Input |
| invalid / disabled / read-only | Input's paint; no action when disabled | peer Input |

## Behavior and accessibility

- The input keeps its own name (`aria-label` or a Field label). The action is named by what it does and controls the
  input. Its tooltip is the name, so it only shows (InputAction's `describes` rule).
- Toggling keeps focus in the field after a pointer press and restores the selection. Keyboard users Tab to the action
  and press Enter or Space; focus stays on the action.
- `visible` / `defaultVisible` / `onVisibleChange` control it; a submit of the owning form calls `onVisibleChange(false)`.
- Not verified: Safari's AutoFill key and caps-lock indicator sharing the end with the action (WebKit draws them inside
  password inputs); screen-reader announcement of the name swap.

## Visual pass

Compared in the app at 1× and 2×, light and dark, Default and Compact: the action reads as Search field's clear does,
and the eye and closed eye sit in the same 16 box as Input's icons. The Input gallery's "Password" tile now renders
Password field instead of its own recipe (it drew the Fluent eye).

## Review note, 2026-10-13

- **What changed:** new. A password field: Input with an eye at the end that shows the password and hides it again.
- **Why:** the backlog's PasswordField, built from Carbon, Mantine, Ant, Chakra, Untitled UI and GOV.UK; Figma's own
  sign-in field has no reveal.

## Open questions

1. A target product's reveal was not captured (ChatGPT's sign-in step needs an email typed; Notion's dialog may email a
   code). Recommendation: keep InputAction's box until a capture says otherwise.

## Feedback log

- 2026-10-13 · owner, review round 24: approved (no notes).

### 2026-11-07 · onValueChange (components audit O3)

- **What changed:** Input's `onValueChange(value, event)` reaches the field.
- **Why:** PasswordField.tsx:9-18 passed props to Input, which had none. From the components audit's internal peer comparison (`docs/research/components-audit-2026-11-07/internal.md`); the owner took every recommendation ("Take all recs", 2026-11-07).
- **Verdict:** awaiting the owner.

### 2026-11-14 · One field shell (system plan, Phase 2, B3)

- Its field is Input, now drawn by the one field shell. No visible change.
- Why: docs/research/system-evaluation-2026-11-11 (B3.1, B3.2, B3.3, B2.2 in fields; README §5); the owner took every recommendation on 2026-11-11 and the 24 targets on 2026-11-13. B3.2: field text stays on Button's inset (Keep 10, the pick), so nothing moved.
- Verdict: awaiting the owner.
