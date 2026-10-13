# OTP field spec

**Status:** accepted · 2026-10-13 (owner, review round 24)
**Captures:** `docs/research/captures/otp-field/`
**Research:** [design-system sources](../research/compass-components-2026-10-13/otp-input.md) (pinned commits, cited lines)
**Peers:** Input (the slot is its shell; focus, invalid, disabled), Password field (masked entry), Field (label, description,
error), Search field

## Owner decisions

- 2026-10-13: the Compass review → the backlog's "OTP input" ("Entry and forms"), with Password field, Time field,
  Progress circle and Stepper (see [password-field.md](password-field.md#owner-decisions)).

## Job and boundaries

An OTP field takes a short one-time code (a sign-in or verification code, a PIN) and shows it as a row of character
slots so the length is visible and each character reads on its own. Not a general masked input, not a Number field,
not a Password field (an arbitrary-length secret).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| length | 6 (default), any | Ant, shadcn, Base UI docs 6; Mantine, Untitled UI, Chakra 4 | every system |
| groups | none (default), e.g. [3, 3] | shadcn, Untitled UI, Ant `separator`, Base UI: a dash between groups | — |
| characters | digits (default), alphanumeric | input-otp `REGEXP_ONLY_DIGITS(_AND_CHARS)`; Mantine `type`; Ant | — |
| mask | off (default), on | Ant `mask`, Base UI / Radix `type="password"`, Mantine `mask` | — |
| variant | outline (default), soft | Input's | — |
| size | sm, md (default), lg | Input's tiers; Untitled UI xxxs-lg | — |
| state | empty, partly typed, filled, invalid, disabled, read-only | all | — |

Excluded: attached slots (shadcn's joined group; most systems separate them), a resend-code action (a Button beside
it), auto-submit (the page calls its own submit from `onComplete`).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| input-otp | library (source) | One real input over drawn slots; why (autofill, paste, one Tab stop, undo); selection mirroring | `packages/input-otp/src/input.tsx`, `README.md:36-53` at `cf81845` | MIT | — |
| shadcn | design system (source) | InputOTP on input-otp: 36 slots, 14 type, 8 between groups, active ring, 1×16 caret blinking 1s | `new-york-v4/ui/input-otp.tsx:8-76` at `30a58d4` | MIT | — |
| untitled | design system (source) | PinInput sizes xxxs 36 / 14 / 6 gap … md 80 / 48 / 12 | `untitleduico/react` at `1d410cb` | MIT | — |
| mantine, ant, zag/ark, base-ui, radix | design systems (source) | one input per slot, paste spreading, roving focus, "Character N of M" | pinned in the research file | MIT | — |
| gov-uk | guidance | a single input for a security code, `one-time-code`, numeric, letter spacing | `src/patterns/confirm-a-phone-number/default/index.njk:13-23` at `18a320e` | OGL | — |
| area | this system | Every gallery tile at 1:1, light and dark | the app, headless Edge | — | `area--*` (28) |

Target products: ChatGPT, Notion and Figma ask for emailed or authenticator codes in a single text field on their
sign-in pages (seen before; not reachable here without signing out). That is the GOV.UK pattern; Area keeps the single
real input and draws slots over it, as input-otp does, so the product behavior (one field, autofill, paste) is kept.

## Anatomy

```
area  div.area-otp-field[translate=no]           row: inline-flex, gap 8; owns size tier, invalid / disabled paint
        span.area-otp-field__group               slots of one group, gap 8
          span.area-otp-field__slot[data-active][data-filled]   Input's shell, square: --_height, edge, fill, corner
            (the character, or • when masked)
            span.area-otp-field__caret           1 × the line, in the slot the code continues in
        span.area-otp-field__separator           16 box, the subtract glyph, muted (between groups)
        input.area-otp-field__control            absolute over the whole row, transparent, owns value and caret
```

## Measurements

From the Area captures (md light): row 232 × 32 (6 × 32 + 5 × 8); slot 32 × 32, radius 8 (Input md's), 14px type;
sm 208 × 28; lg 280 × 40; groups [3, 3] 256 (the separator 16 plus 8 either side); four digits 152.

| slot · property | shadcn (vega) | Untitled UI xxxs | Mantine md | Area md |
|---|---|---|---|---|
| slot size | 36 | 36 | 40 (Chakra md 40) | 32 (Input md) |
| type | 14 | 14 | 16 | 14 (Input md) |
| gap | 0 in a group, 8 between | 6 | 10 | 8 |
| radius | 6, outer corners only | 8 | 4 | 8 (Input md) |
| active | ring 3px at 50% | 2px ring + offset outline | focus border | Input's focus edge, halo and outline |
| caret | 1 × 16, 1s | — | native | 1 × line height, 1s |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| structure | one real input over drawn slots | input-otp (shadcn, Untitled UI), GOV.UK, the products' single field | Per-slot inputs (Mantine, Ant, Zag, Base UI, Radix) lose single-field autofill and need their own paste, focus and undo |
| slot | Input's shell, square at the tier's height: edge, fill, corner, type | peer Input | Systems size slots 36-40 at their default; Area's fields are 32 (28 compact), and a code sits beside them |
| gap | 8 between slots and around the dash | Mantine, Ant, Untitled UI, shadcn's `gap-2` | — |
| active slot | Input's focus edge, halo and outline, raised | shadcn, Ant, Untitled UI: the active slot takes the focus ring | — |
| caret | drawn: 1 wide, the line's height, blinking at 1s; still under reduced motion and motion none | shadcn's `animate-caret-blink` | — |
| caret position | a collapsed caret before a typed character selects it, so typing replaces that slot; Left and Right move one slot | input-otp's selection mirroring | — |
| paste | spaces, dashes and other characters dropped, then capped to `length`, at the selection | every system strips separators | `maxLength` alone would cut "123 456" at the space |
| input | `inputmode=numeric` (digits), `pattern`, `autocomplete=one-time-code`, `maxlength`, `spellcheck=false`, `translate=no` | input-otp, Base UI, Radix, GOV.UK | — |
| mask | dots in the slots, the input `type=password` | Base UI, Radix | — |
| invalid / disabled | Input's paint on every slot; `aria-invalid` from a Field | peer Input | — |
| name | the one input's: `aria-label` or a Field label | input-otp (one control, one name) | Per-slot systems add "Character N of M"; one input needs none |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| empty, focused | the first slot active with the caret | shadcn |
| partly typed | the next slot active with the caret | shadcn |
| a slot selected (arrows, a press) | that slot active, no caret | input-otp |
| filled | the last slot active while focused; `onComplete` fired once | all |
| hover | the slots' edge takes Input's hover edge | peer Input |
| invalid / disabled / read-only | Input's paint | peer Input |

## Behavior and accessibility

- One input, so a screen reader hears one field, its name and its value; arrows, Backspace, select-all, undo and paste
  are the platform's. `onComplete` runs when the code reaches `length` from below.
- The slots and the separator are hidden from assistive tech; the input is transparent but fully opaque to the browser,
  so iOS still offers paste on it.
- Not verified: SMS autofill on iOS and Android, password-manager inline badges (input-otp widens its input for them),
  IME composition.

## Visual pass

In the app at 1× and 2×, light and dark, Default and Compact: the slots read as six small Inputs, the active one as a
focused Input; the dash between groups sits on the slots' centre. Typed with real keys: "4a8" gives "48", Backspace and
arrows move by slot, typing over a selected slot replaces it, a paste of "12 34-56" fills "123456".

## Review note, 2026-10-13

- **What changed:** new. A one-time code field: a row of slots, one per character, over a single real input.
- **Why:** the backlog's OTP input; slots after shadcn and Untitled UI, one real input so text-message autofill and paste
  keep working, as input-otp and GOV.UK argue.

## Open questions

1. Slot size: Input's height (32, 28 compact) or the systems' larger code slots (36-40)? Recommendation: Input's, so a
   code beside other fields lines up; a sign-in page can use `size="lg"` (40).

## Feedback log

- 2026-10-13 · owner, review round 24: approved (no notes).
