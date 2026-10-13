# One-time code input: design-system source evidence

Researched 2026-10-12. Every repo was read at the default branch's HEAD commit, taken from the GitHub API (`repos/<r>/commits/HEAD`). Citations use `path:line-line @ <short sha>`. Pixel values come from rem or Tailwind class names at a 16px root (Tailwind v4 `--spacing` = 0.25rem).

| Repo | Short SHA |
|---|---|
| shadcn-ui/ui | 30a58d4 |
| guilhermerodz/input-otp | cf81845 |
| mantinedev/mantine | e243f7f |
| ant-design/ant-design | 5a102fe |
| chakra-ui/zag | 055a34f |
| chakra-ui/ark | 4529383 |
| chakra-ui/chakra-ui | fa9696f |
| untitleduico/react (Untitled UI React; the brief's `untitleduidev/untitledui-react` is this repo) | 1d410cb |
| mui/base-ui (extra: ships `OTPField`) | 25080b2 |
| radix-ui/primitives (extra: ships unstable `OneTimePasswordField`) | a2324b5 |
| alphagov/govuk-design-system | d261b19 |
| alphagov/govuk-frontend | 18a320e |
| whatwg/html | 86190a4 |
| WICG/web-otp | d9efe8d |
| GoogleChrome/web.dev | a64d870 |

---

## 1. `input-otp` (guilhermerodz): one hidden real input

File: `packages/input-otp/src/input.tsx @ cf81845`. Supporting files: `types.ts`, `regexp.ts` and `README.md`.

- **Architecture.** A single real `<input>` is positioned `absolute; inset:0` over the slots, inside a `pointer-events:none` wrapper. The input itself has `pointer-events:all` (`input.tsx:546-553`, `377-399`). It is painted invisibly with `color: transparent`, `caretColor: transparent`, `background: transparent`, no border, no outline, `letterSpacing: -.5em` and `fontSize: var(--root-height)`. It keeps **`opacity: '1'` ("Mandatory for iOS hold-paste")** (`input.tsx:377-401`). The slots are your own markup. They get state from `OTPInputContext` or a `render` prop (`input.tsx:479-524`).
- **Why (README.md:36-53).** The README makes these points:
  - HTML has no `<input type="otp">`.
  - Products that split the code into six inputs "quietly lose SMS autofill, screen reader support, partial paste, undo, and half the keyboard" (`38-41`).
  - `autocomplete="one-time-code"` "only means something on a single field" (`47`).
  - Screen readers get "one control, one name, one value, one caret, one tab stop" (`48`).
  - Native keybindings keep working: select-all, word-delete, shift-arrow ranges, undo and the iOS long-press menu (`49`).
  - Real paste works, including a partial paste into the middle of the code (`50`).
  - Forms get one `name`, one `FormData` entry and a real `<label>` (`51`).
  - The edge-case table (`128-136`) lists further problems and fixes: collapsed-caret-to-slot mapping, ArrowLeft skipping, delete not firing `selectionchange`, password-manager badges, iOS paste, `:autofill` paint and a no-JS fallback.
- **Active slot and selection.** On every `selectionchange`, a collapsed caret is rewritten into a one-character selection, except at the append position. Direction is inferred from the previous selection (`input.tsx:102-164`). A slot is active when it is inside the mirrored selection (`482-488`).
- **Caret.** The real caret is transparent. Each slot gets `hasFakeCaret: isActive && char === null` and draws its own blinking caret (`input.tsx:498`; `types.ts:1-6`).
- **Keyboard.** The library does not add its own arrow or backspace handlers. The native input handles them, and the selection mirror maps the result onto slots. On delete, a `selectionchange` is dispatched by hand (`input.tsx:299-308`).
- **Paste.** Native paste fills the value and is clipped by `maxLength`. A custom handler runs only on iOS or when `pasteTransformer` is set. It replaces or inserts at the selection, then caps to `maxLength` (`input.tsx:324-363`).
- **Type and pattern.** `inputMode` defaults to `'numeric'` (`input.tsx:23`). `pattern` accepts a string or a RegExp. Changes that fail the pattern are rejected (`294-298`) and the pattern is also set as the native `pattern` attribute (`433`). The library exports these regexps: `REGEXP_ONLY_DIGITS` = `^\d+$`, `REGEXP_ONLY_CHARS` and `REGEXP_ONLY_DIGITS_AND_CHARS` (`regexp.ts:1-3`).
- **Autocomplete.** `autoComplete` defaults to `'one-time-code'` (`input.tsx:426`). `spellCheck` defaults to `false` (`439`). The container has `translate="no"` (`540`).
- **Completion.** `onComplete(value)` fires when the length goes from below `maxLength` to `maxLength` (`input.tsx:270-282`).
- **Count.** `maxLength` is required and has no default (`types.ts:19`).
- **Mask.** Not found as a prop (looked in `types.ts`, `input.tsx`).
- **Separator.** None. Grouping is left to your markup.
- **Disabled.** The `disabled` prop passes through. The root cursor becomes `default` (`input.tsx:369`) and `isHovering` turns off (`502`).
- **Placeholder.** Per-slot `placeholderChar` comes from the `placeholder` string (`input.tsx:491-492`).
- **Password managers.** `pushPasswordManagerStrategy: 'increase-width'` widens the input behind a `clip-path` (`input.tsx:25, 381-386`).
- **Accessible name.** One input, so it takes your `<label>`, `aria-label` or `aria-labelledby`.

## 2. shadcn/ui InputOTP (wraps `input-otp`)

Files are at `30a58d4`:
- `apps/v4/registry/new-york-v4/ui/input-otp.tsx`
- `apps/v4/registry/bases/{radix,base,aria}/ui/input-otp.tsx` (all three are identical)
- `apps/v4/registry/styles/style-*.css`

- **Architecture.** This is the `input-otp` single hidden input. Its parts are `InputOTP` (the `OTPInput` root), `InputOTPGroup`, `InputOTPSlot index` and `InputOTPSeparator` (`new-york-v4/ui/input-otp.tsx:8-76`).
- **Slot (new-york-v4, `:53`).** Classes are `h-9 w-9` (**36×36**), `text-sm` (**14px**), `border-y border-r border-input` and `shadow-xs`. The slots are **attached**: there is no gap inside a group, `first:rounded-l-md first:border-l` and `last:rounded-r-md` (**6px** outer corners only). Dark mode adds `dark:bg-input/30`.
- **Active slot (`:53`).** `data-[active=true]:z-10 border-ring ring-[3px] ring-ring/50`. With `aria-invalid`, the border becomes `border-destructive` and the ring `ring-destructive/20`, or `/40` in dark mode.
- **Caret (`:59-63`).** A centred `h-4 w-px` (**16×1px**) bar with `animate-caret-blink bg-foreground duration-1000`. It renders only when `hasFakeCaret`.
- **Gap between groups.** `InputOTP` uses `containerClassName="flex items-center gap-2"` (**8px**). Disabled is `has-disabled:opacity-50` plus `disabled:cursor-not-allowed` (`:18-22`).
- **Separator (`:68-74`).** A `div role="separator"` containing `MinusIcon`. In the bases it is `size-4` (`style-vega.css:698-700`).
- **v4 style variants (`.cn-input-otp-slot`).**

  | Style | Lines | Slot size | Text | Corners | Active ring |
  |---|---|---|---|---|---|
  | vega | `style-vega.css:682-700` | `size-9` (36) | `text-sm` | `rounded-l-md`/`r-md` | `ring-3`, plus `shadow-xs` |
  | nova | `style-nova.css:690-692` | `size-8` (32) | `text-sm` | `rounded-l-lg` | `ring-3` |
  | maia | `style-maia.css:691-693` | `size-9` | `text-sm` | `rounded-l-4xl` | `ring-[3px]` |
  | lyra | `style-lyra.css:665-667` | `size-8` | `text-xs` | `rounded-none` | `ring-1` |
  | mira | `style-mira.css:690-692` | `size-7` (28) | `text-xs/relaxed` | `rounded-l-md` | `ring-2`, `ring-ring/30` |
  | luma | `style-luma.css:359-361` | `size-9` | — | `rounded-l-3xl` | `ring-3`, `ring-ring/30`, `bg-input/50` |

  All six styles set `.cn-input-otp` to `gap-2` and the caret to `h-4 w-px`. The bases also put the invalid ring on the group: `.cn-input-otp-group` gets `has-aria-invalid:ring-3 border-destructive` (`style-vega.css:686-688`).
- **Count.** The consumer renders N slots through `maxLength`. shadcn's wrapper sets no default.
- **Keyboard, paste, autocomplete, completion.** Inherited from `input-otp` (`one-time-code`, `inputMode="numeric"`, `onComplete`).
- **Accessible name.** The single input. Slots carry no ARIA.
- **Mask.** Not found.

## 3. Mantine PinInput

Files: `packages/@mantine/core/src/components/PinInput/{PinInput.tsx,PinInput.module.css} @ e243f7f`. Also read: `components/Input/Input.module.css`, `Input.tsx` and `core/MantineProvider/default-css-variables.css`.

- **Architecture.** **One `<input>` per slot.** Each is a Mantine `Input` (`PinInput.tsx:429-471`), wrapped in a `Group role="group" dir="ltr"` (`416-428`). A separate `<input type="hidden" name form value>` carries the form value (`474`).
- **Defaults (`:138-147`).** `length: 4`, `gap: 'sm'`, `size: 'sm'`, `type: 'alphanumeric'`, `placeholder: '○'`, `manageFocus: true`, `oneTimeCode: true` and `ariaLabel: 'PinInput'`.
- **Type.**
  - Regex is `number` → `/^[0-9]+$/` or `alphanumeric` (`:25-28`). A custom RegExp is allowed (`:92`).
  - `inputMode` is `numeric` when type is number, `text` otherwise (`:444`).
  - The input `type` is `password` when `mask` is set, `tel` when type is number, `text` otherwise (`:450`).
  - In numeric mode, non-digit keys are blocked on keydown (`:316-326`).
- **Autocomplete.** `autoComplete={oneTimeCode ? 'one-time-code' : 'off'}` is set on **every** input (`:76-77, 462`).
- **Keyboard (`:312-381`).**
  - ArrowLeft and ArrowRight move between inputs.
  - Shift+Tab goes to the previous input.
  - Space advances.
  - Delete clears the current input.
  - Backspace on an empty input focuses the previous one. Otherwise it clears the current input and moves back (except on the last input).
  - Typing the same character that is already there advances.
  - Focus selects the content (`:383-386`).
  - The placeholder hides on the focused input (`:463`).
- **Paste.** Whitespace and newlines are stripped. The pasted value is validated and spread across all slots. Focus moves to the first empty slot, or to the last slot when all are filled (`:392-412`). A multi-character `onChange` (length > 2) is also treated as a paste, which covers autofill (`:278-290`).
- **Completion.** `onComplete(value)` fires once when the length reaches `length`. It re-arms when the length drops below (`:222-237`).
- **Accessible name.** **The same `aria-label` (default `'PinInput'`) on every input** (`:467`). Ids are `${uuid}-${index+1}` (`:442`). There is no per-digit label.
- **States.**
  - `error` sets `aria-invalid` and error styles on all inputs (`:85-86`). `success` exists (`:88-89`). `disabled` and `readOnly` apply to every input.
  - Error borders use `--mantine-color-error` (`Input.module.css:143-150`). Disabled uses `--input-disabled-bg` and `--input-disabled-color` (`Input.module.css:240-245`).
- **Separator or grouping.** Not found (no prop in `PinInputProps`, `:36-129`).
- **Mask.** `mask` sets `type="password"` (`:94-95, 450`).
- **Dimensions.**
  - Slot is square `--pin-input-size`: xs 30, **sm 36 (default)**, md 42, lg 50, xl 60 px (`PinInput.module.css:1-13`). Padding is `0` and text is centred (`PinInput.tsx:433-436`).
  - Font size is `--input-fz` = `getFontSize(size)` (`Input.tsx:238`). At sm that is `--mantine-font-size-sm` = 0.875rem = **14px** (`default-css-variables.css:43`).
  - Radius is `--mantine-radius-default` = 0.5rem = **8px** (`Input.module.css:19`; `default-css-variables.css:26`).
  - Gap `sm` = 0.75rem = **12px** (`default-css-variables.css:38`).
  - The border is 1px (`Input.module.css:182`).
- **Focus.** `outline: none`. The border changes to `--input-bd-focus` = `--mantine-primary-color-filled`, or to the error colour when in error (`Input.module.css:107, 208-215`). There is no ring.

## 4. Ant Design Input.OTP

Files: `components/input/OTP/{index.tsx,OTPInput.tsx}`, `components/input/style/{otp.ts,token.ts,index.ts,variants.ts}` and `components/theme/themes/seed.ts`, all `@ 5a102fe`.

- **Architecture.** **One antd `Input` per slot** (`OTP/index.tsx:347-379`). The wrapper is a `div role="group"` (`:344`). Each input has `htmlSize={1}` (`:358`).
- **Count.** `length = 6` by default (`:108`).
- **Keyboard (`OTPInput.tsx:53-67`).** ArrowLeft and ArrowRight move. Backspace on an empty input moves to the previous one. Ctrl/Cmd+Z is blocked. Focus, mousedown and mouseup select the content (`:38-50, 88-89`). Focus is held on the first empty cell: focusing a later cell redirects there (`index.tsx:303-313`).
- **Paste.** A multi-character input at index i replaces cells from i onward, is clipped to `length`, and moves focus to `min(index + txt.length, length-1)` (`index.tsx:247-296`).
- **Type.** `type` passes through to the HTML input type. The default is `password` when masked, `text` otherwise (`OTPInput.tsx:82`). `inputMode` and `autoComplete` only pass through (`index.tsx:121,124,316-324`). **No default `one-time-code` and no default `inputMode` were found.** `formatter(value)` can transform input, for example to uppercase (`:61, 214`).
- **Mask.** `mask?: boolean | string`. The default glyph is `'•'` (`OTPInput.tsx:18,25`). The glyph is drawn as an overlay span over a transparent-text input (`OTPInput.tsx:72-77`; `style/otp.ts:21-35`).
- **Separator.** `separator?: ReactNode | (index) => ReactNode`, rendered between slots as `span.{prefix}-separator` (`index.tsx:62, 84-103, 368-376`).
- **Accessible name.** Each input defaults to `aria-label={\`OTP Input ${index + 1}\`}` (`OTPInput.tsx:80`). The group has `role="group"`.
- **Completion.** `onChange(value)` fires **only when every cell is filled** and something changed. Per-keystroke changes go to `onInput(string[])` (`index.tsx:228-245`).
- **States.** `status` is `'error' | 'warning'` and merges with the Form context (`:66, 183-194`). `disabled` passes through. Variants are inherited from Input.
- **Dimensions.**
  - Gap is `columnGap: paddingXS` = **8px** (`style/otp.ts:17`; `sizeXS` = 8).
  - Slot `paddingInline` is `paddingXXS` (4px). Small is 2px and large is 8px (`otp.ts:49-61`).
  - Width is intrinsic: `size=1` plus padding.
  - Height is `controlHeight` **32** (seed `seed.ts:69`). Small is ×0.75 = 24 and large is ×1.25 = 40 (`genControlHeight.ts:7-9`).
  - Font is `inputFontSize` = `fontSize` **14**, and `fontSizeLG` for large (`token.ts:135-137`; `seed.ts:42`).
  - Radius is `token.borderRadius`, seed **6** (`style/index.ts:74`; `seed.ts:61`). SM and LG use `borderRadiusSM` and `borderRadiusLG` (`index.ts:49,56`).
- **Focus.** `borderColor: activeBorderColor` (`colorPrimary`) plus `boxShadow: activeShadow` = `0 0 0 ${controlOutlineWidth}px controlOutline`, where `controlOutlineWidth = lineWidth*2` = **2px** (`token.ts:155-157`; `variants.ts:56-57`; `alias.ts:95`).

## 5. Zag pin-input machine and Ark UI / Chakra UI v3 PinInput

Sources:
- Zag `packages/machines/pin-input/src/{pin-input.machine.ts,pin-input.connect.ts,pin-input.utils.ts,pin-input.types.ts} @ 055a34f`
- Ark `packages/react/src/components/pin-input/*.tsx @ 4529383`
- Chakra `packages/panda-preset/src/slot-recipes/pin-input.ts` and `apps/compositions/src/ui/pin-input.tsx @ fa9696f`

- **Architecture.** **One input per slot**, plus a visually hidden form input. The hidden input has `aria-hidden`, `tabIndex -1`, `minLength = maxLength = count` and `pattern` = e.g. `[0-9]{6}`. If native validation focuses it, it hands focus to a slot (`connect.ts:95-117`; `utils.ts:26-30`). The Ark parts are `Root`, `Label`, `Control`, `Input index` and `HiddenInput`.
- **Roving tab stop.** Only one slot has `tabIndex 0`. It is the focused slot, or else `min(filledCount, count-1)` (`connect.ts:39, 134`). Focus is clamped to the first empty slot (`machine.ts:204-207`).
- **Count.** Zag has no default and infers the count from the rendered inputs (`machine.ts:162-173`). Chakra's composition uses `count = 4` (`compositions/ui/pin-input.tsx:13`).
- **Defaults (`machine.ts:10-18`).** `placeholder: '○'`, `otp: false` and `type: 'numeric'`.
- **Type.**
  - Regexes are `numeric`, `alphabetic` and `alphanumeric`, or a custom `pattern` (`utils.ts:1-24`).
  - `inputMode` is `numeric` when `otp` is set or `type === 'numeric'`, `text` otherwise.
  - The input `type` is `password` when masked, otherwise `tel` for numeric and `text` for the rest (`connect.ts:129, 142, 146`).
  - Other attributes: `autoCapitalize: none` and `enterKeyHint` `next`, or `done` on the last slot (`:145, 150`).
- **Autocomplete.** `autoComplete: otp ? 'one-time-code' : 'off'` on every slot (`connect.ts:151`). It is **opt-in** through `otp`.
- **Keyboard (`connect.ts:221-280`; `machine.ts:96-146`).**
  - ArrowLeft and ArrowRight move, but never past the first empty slot (`machine.ts:285-291`).
  - Home and ArrowUp go to the first slot. End and ArrowDown go to the last filled slot. Ctrl/Cmd+Arrow jumps to the ends.
  - Backspace clears the current slot and moves back, or moves back and clears when the slot is empty (`machine.ts:131-139`).
  - **Delete splices the value and shifts the remaining characters left** (`machine.ts:267-275`).
  - Enter calls `requestSubmit()` on the form (`machine.ts:304-308`).
  - Typing the same character advances (`connect.ts:237-242`).
  - IME composition is ignored (`:224`).
- **Paste.** `onPaste` reads the clipboard, applies the optional `sanitizeValue` (for example to strip dashes), and validates. Invalid input fires `onValueInvalid` (`connect.ts:153-170`). Valid input keeps the characters left of the cursor and fills from there to the end. Focus then goes to the last filled slot (`machine.ts:236-256, 293-297`). A `value.length > 2` change is treated as a paste, which covers autofill (`connect.ts:202-207`).
- **Completion.** `onValueComplete({value, valueAsString})` (`machine.ts:188-194`). Optional `blurOnComplete` and `autoSubmit` (`types.ts:114-118`; `machine.ts:298-313`). There is also `selectOnFocus` (`types.ts:122`).
- **Mask.** `mask` sets `type=password` (`types.ts:110`; `connect.ts:146`).
- **Accessible name.**
  - Each slot gets `aria-label` from `translations.inputLabel`, default `` `pin code ${index + 1} of ${length}` `` (`connect.ts:20-22, 141`).
  - The `Label` part is `htmlFor` the hidden input. Clicking it focuses the first slot (`:77-93`).
  - The root has no `role="group"` (not found in `getRootProps`, `:65-75`).
- **States.** `invalid` sets `aria-invalid` and `data-invalid`. `disabled`, `readOnly` and `required` also exist. Exposed data attributes are `data-complete`, `data-filled` and `data-index` (`connect.ts:65-75, 133-144`).
- **Separator.** No part (Ark parts list: control, hidden-input, input, label, root). Chakra's `attached` variant joins the slots instead (see below).
- **Chakra v3 recipe (`slot-recipes/pin-input.ts`).**
  - The input is a square of `--input-height`, text-centred, radius `l2` (= `radii.sm` = 0.25rem = **4px**; `semantic-tokens/radii.ts:7-9`, `tokens/radii.ts:13-15`).
  - Control gap is `2` (**8px**) (`:7-31`).
  - Sizes (`:34-83`):

    | Size | Height | Text |
    |---|---|---|
    | 2xs | 28 | `xs` |
    | xs | 32 | `xs` |
    | sm | 36 | `sm` 14/20 |
    | **md (default)** | **40** | `sm` 14/20 |
    | lg | 44 | `md` 16/24 |
    | xl | 48 | `md` |
    | 2xl | 64 | `lg` |

    All sizes use `px 1` (4px).
  - Variants are `outline` (1px `border`, `focusVisibleRing: inside`), `subtle` and `flushed` (bottom border, with a `0 1px 0 0` focus shadow) (`:85-121`).
  - `attached: true` gives gap 0, `spaceX -1px`, inner radii 0 and `zIndex 1` on focus-visible (`:122-140`).
  - Invalid sets `borderColor` and `focusRingColor` to `border.error` (`:20-25`). Disabled uses `layerStyle: disabled` (`:15-17`).

## 6. Untitled UI React: PinInput / verification code input

Files: `components/base/input/pin-input.tsx`, `pin-input.demo.tsx`, `styles/theme.css` and `utils/cx.ts`, all `@ 1d410cb`.

- **Architecture.** **It wraps `input-otp`**, so it is a single hidden input (`pin-input.tsx:5, 76-93`). Its parts are `Root` (`div role="group"`), `Label`, `Group` (the `OTPInput`), `Slot`, `Separator` and `Description`.
- **Count.** `maxLength = 4` by default (`:76`). The demos use 4 and 6 (`demo.tsx:10, 164`).
- **Type.** The demos pass `pattern={REGEXP_ONLY_DIGITS}`. Otherwise `input-otp`'s defaults apply: `inputMode` numeric and `autoComplete` one-time-code.
- **Accessible name.**
  - The hidden input gets `aria-label="Enter your pin"`, `aria-labelledby` the Label and `aria-describedby` the Description (`:85-88`). `Label` is `htmlFor` the input (`:146`).
  - **Each slot div also gets `aria-label="Enter digit N of M"`** (`:113`). These are non-focusable divs.
- **States.** `invalid` puts `aria-invalid` on each slot plus `text-error-primary ring-error_subtle`. `disabled` gives `opacity-50` and disables the input (`:41-47, 112, 119-120`).
- **Completion.** Uses `input-otp`'s `onComplete` (props pass through, `:69, 81`).
- **Mask.** Not found.
- **Separator.** `div role="separator"` containing "-", styled `text-display-xl font-medium text-utility-neutral-300` (`:134-140`). The demo uses a 3-3 layout (`demo.tsx:160-176`).
- **Empty slot.** Shows a `0` placeholder glyph in `text-placeholder/40` (`:115, 124`).
- **Caret (`:130-132`).** `h-[1em] w-0.5` (**2px** wide, one em tall), `animate-caret-blink bg-fg-brand-primary`. The keyframe is a 1s hard blink: opacity 1 for 0–50%, 0 for 51–100% (`theme.css:80, 91-100`).
- **Base slot (`:115`).** `rounded-xl` (12px), `bg-primary`, `shadow-xs` (`0 1px 2px rgba(0,0,0,.05)`, `theme.css:54`), `ring-1 ring-primary ring-inset` (a 1px inset ring stands in for the border) and `transition-[box-shadow,background-color] duration-100 ease-linear`.
- **Active slot (`:117`).** `ring-2 ring-brand` plus `outline-2 outline-offset-2 outline-brand`, so a 2px ring and a 2px outline offset by 2px.
- **Filled slot (`:118`).** `text-brand-tertiary_alt ring-2 ring-brand`.
- **Sizes (`:60-67`).** `cx` is tailwind-merge (`utils/cx.ts:1-15`), so the per-size `rounded-lg` overrides `rounded-xl`. Type scale is `text-sm` 14, `text-md` 16, `display-lg` 48 and `display-xl` 60 (`theme.css:11,14,33,37`).

  | size | slot | gap | font | radius | padding |
  |---|---|---|---|---|---|
  | xxxs | 36×36 (`size-9`) | 6 (`gap-1.5`) | 14 medium | 8 (`rounded-lg`) | px-3 py-2 |
  | xxs | 40×40 | 8 | 16 medium | 8 | px-3 py-2 |
  | xs | 44×44 | 8 | 16 medium | 8 | px-3.5 py-2.5 |
  | sm | 64×64 | 8 | 48 medium | 12 | px-2 py-0.5 |
  | **md (default, `:49`)** | **80×80** | **12** | **48 medium** | **12** | px-2 py-2.5 |
  | lg | 96×96 | 12 | 60 medium | 12 | px-2 py-3 |

  Root gap between label, group and hint is `gap-1.5` (6px) (`:54`).

## 7. Base UI `OTPField` (mui/base-ui): one input per slot

The brief did not ask for this one, but it is directly relevant. Files: `packages/react/src/otp-field/{root/OTPFieldRoot.tsx,input/OTPFieldInput.tsx,utils/otp.ts}` and `docs/.../otp-field/{page.mdx,demos/hero/css-modules/*}`, all `@ 25080b2`.

- **Architecture.** One `<input>` per slot inside a root `role="group"` (`OTPFieldRoot.tsx:400`). A hidden validation input carries `autoComplete`, `inputMode`, `minLength`/`maxLength = length`, `pattern`, `aria-hidden` and `tabIndex -1` (`:455-470`). The parts are `Root`, `Input` and `Separator` (`page.mdx:25-28`). Docs suggest `123-456` groups (`page.mdx:89-92`).
- **Count and type.**
  - `length` is required.
  - `validationType` defaults to `'numeric'` and also accepts `alpha`, `alphanumeric` or `none` (`Root:65`; `otp.ts:8-29`).
  - Per-slot `pattern` is `\d{1}` and `inputMode` is numeric (`otp.ts:11-16`).
  - Whitespace is stripped (`otp.ts:39-41`). `normalizeValue` is available.
- **Autocomplete.** `autoComplete = 'one-time-code'` (`Root:55`), applied **only to the first slot**. Other slots get `off` (`Input:149`).
- **`maxLength`.** Set only on slot 0, "to avoid password manager bubbles appearing after later inputs" (`Input:153-154`).
- **Other input attributes.** `autoCorrect off`, `spellCheck false`, and `enterKeyHint` `next`, or `done` on the last slot (`Input:150-152`).
- **Mask.** `mask` sets `type=password` (`Input:147`).
- **Roving tab stop.** `tabIndex` is 0 only on the active slot (`Input:155`).
- **Keyboard (`Input:219-304`).**
  - Arrows are RTL-aware. Ctrl/Cmd+Arrow jumps to the ends.
  - Home and ArrowUp go to the first slot. End and ArrowDown go to the last filled slot.
  - Ctrl/Cmd+Backspace clears everything.
  - Delete removes the character at the current slot.
  - Backspace on an empty slot deletes the previous character and moves back.
  - Typing the same character advances.
  - Keys are ignored during IME composition.
- **Paste.** The whole string is committed through normalisation (`Input:305-329`). Focus is clamped to the first empty slot (`Root:218-228`).
- **Completion.** `onValueComplete(value)` (`Root:59, 194`). `autoSubmit` is also available (`page.mdx:77-78`).
- **Accessible name.**
  - **The first slot uses the field `<label>`.** `aria-label` on the first input is ignored with a dev warning (`Input:85-98`).
  - The docs put `aria-label="Character N of 6"` on the other slots (`page.mdx:35-51`; hero demo `index.tsx:26`).
  - `aria-invalid` is set on slots when invalid (`Input:162`).
- **Demo CSS (`hero/css-modules/index.module.css`).** Slot **40×40**, 1px border, radius 0, font **16px**/24, gap **8px** (`:21-40`). Focus is `outline: 2px solid; outline-offset: -1px` (`:50-57`).

## 8. Radix `OneTimePasswordField` (unstable)

File: `packages/react/one-time-password-field/src/one-time-password-field.tsx @ a2324b5`.

- **Architecture.** One input per slot in a `role="group"` (`:497-499`). A `type="hidden"` input carries the name and value (`:540-560`). Focus uses a `RovingFocusGroup`. A slot is focusable only up to the first empty slot (`:654-670`).
- **Defaults.** `autoComplete` defaults to `'one-time-code'` (`:232`). `validationType` defaults to `'numeric'`, which gives `pattern \d{1}` and `inputMode numeric` (`:37-57, 241`).
- **Autocomplete and `maxLength` placement.** Both are set **only on the current tab-stop slot**: `maxLength = size` there, and 1 everywhere else. Other slots get `autoComplete off` plus password-manager ignore attributes (`data-1p-ignore`, `data-lpignore`, `data-protonpass-ignore`, `data-bwignore`) (`:672-685`).
- **Accessible name.** Each slot has `aria-label` `` `Character ${index + 1} of ${size}` `` (`:678`).
- **Keyboard (`:794-857`).**
  - Backspace on an empty slot focuses the previous one. Ctrl/Cmd+Backspace or Clear empties the field. Delete on an empty slot does nothing.
  - Enter calls `attemptSubmit`.
  - ArrowUp and ArrowDown are prevented in horizontal orientation.
  - Typing the same key advances.
  - Focus selects the content (`:693-695`).
- **Paste.** Sanitised, then sliced to the slot count (`:385-398`).
- **Completion.** There is no `onComplete`. `onAutoSubmit(value)` fires when `autoSubmit` is set and every slot is filled (`:157-161, 461-464`). `onValueChange` reports every change (`:166`).

## 9. Systems with no OTP / pin component

Searched the full recursive git tree at HEAD for `OTP|Otp|otp[-_./]|PinInput|pin-input|PinCode|OneTime|one-time|VerificationCode|passcode`. All trees came back with `truncated=false`.

- **MUI Material** (`mui/material-ui @ ade9a69`): not found. There are only sign-in templates (ForgotPassword).
- **React Aria / React Spectrum** (`adobe/react-spectrum @ 9b7a06e`): not found.
- **Fluent UI** (`microsoft/fluentui @ 16fcf57`): not found.
- **Carbon** (`carbon-design-system/carbon @ c9b1f79`): not found.
- **Primer React** (`primer/react @ 7f5303d`): not found.
- **Polaris** (`Shopify/polaris @ 3f7954a`): not found. The repo now resolves to `Shopify/polaris-react-archive`, which is `archived=true`.
- Within the MUI family, **Base UI** (section 7) is the one that ships `OTPField`.

## 10. Platform: `autocomplete="one-time-code"`, WebOTP and GOV.UK

**WHATWG HTML** (`source @ 86190a4`).
- `one-time-code` is an autofill field name defined as "One-time code used for verifying user identity". Its format is free-form text with no newlines, the example is `123456`, and its control group is **Password** (`source:62053-62060`).

**web.dev "SMS OTP form best practices"** (`src/site/content/en/identity/sms-otp-form/index.md @ a64d870`).
- The checklist asks for **one `<input>`** with `type="text"`, `inputmode="numeric"` and `autocomplete="one-time-code"` (`:60-69`). The example also adds `pattern="\d{6}" required` (`:78-86`).
- It explains why to avoid `type="number"` (`:91-103`).
- `one-time-code` works on Safari 12+ on iOS, iPadOS and macOS (`:124-128`).
- Chrome, Opera and Vivaldi on Android support origin-bound codes through WebOTP, "though not through `autocomplete="one-time-code"`" (`:216-218`).

**WebOTP** (`WICG/web-otp index.bs @ d9efe8d`).
- `navigator.credentials.get({ otp: { transport: ["sms"] } })` returns `{code, type}` (`index.bs:94-101`).
- The server sends an origin-bound message ending in `@example.com #123456` (`:114-124`).
- The spec's own polyfill example fills a single `<input>` (`:161-198`).
- The README credits Apple's `one-time-code` autocomplete API as an inspiration (`README.md:18`).

**GOV.UK Design System** (`alphagov/govuk-design-system @ d261b19`).
- *Confirm a phone number* (`src/patterns/confirm-a-phone-number/index.md`): send a **5-digit** code (`:37-41`). "Let the user enter the code in whatever format is familiar to them. Allow additional spaces, hyphens and dashes." (`:47`). The code has a 15-minute expiry (`:49`). The guidance covers domain-bound codes (`:80-88`) and error messages for too few, too many or non-numeric digits (`:96-103`).
- The pattern's example is **one `govukInput`** labelled "Security code", with `type: "text"`, `autocomplete: "one-time-code"`, `inputmode: "numeric"` and `classes: "govuk-input--width-4 govuk-input--extra-letter-spacing"` (`src/patterns/confirm-a-phone-number/default/index.njk:13-23`).
- *Text input → Codes and sequences* (`src/components/text-input/index.md:125-131`): style the input's text "to visually separate each character" for security codes. The method is letter spacing within one input. `.govuk-input--extra-letter-spacing` is tabular numbers plus `letter-spacing: 0.05em` (`govuk-frontend packages/govuk-frontend/src/govuk/components/input/_index.scss:54-57 @ 18a320e`).
- *Text input* also says not to use `type="number"` (`index.md:121-123`), to use `inputmode="numeric"` (`:102`), and that a restrictive maximum length stops users formatting the value their usual way (`:181`).
- **No explicit sentence saying "do not split the code into separate boxes" was found.** I looked in `confirm-a-phone-number/index.md`, `confirm-an-email-address/index.md` and `text-input/index.md`, and ran a repo code search for "separate boxes", "individual boxes", "each digit", "one box" and "split". The single-input recommendation is shown by the pattern's example and the letter-spacing guidance, not stated as a prohibition.

---

## Summary table

`otc` = `autocomplete="one-time-code"`. "1 hidden" = one real input under rendered slots. "N" = one input per slot.

| System | Inputs | Default count | numeric / inputMode | otc | Mask | Separator | Accessible name | Completion | Paste fills | Delete / backspace | Default slot (W×H / font / gap / radius) | Active styling |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| input-otp | 1 hidden | none (`maxLength` required) | `inputMode` numeric default; regexp `pattern` | default | no | your markup | single input's label | `onComplete` | yes (native, partial OK) | native | unstyled | `isActive` + fake caret |
| shadcn new-york-v4 | 1 hidden | none | inherited | inherited | no | `role=separator` Minus icon | single input | `onComplete` | yes | native | 36×36 / 14 / attached in group, 8 between groups / 6 outer | border-ring + 3px ring/50, z-10; caret 1×16 blink 1s |
| Untitled UI | 1 hidden | 4 | REGEXP_ONLY_DIGITS in demos | inherited | no | "-" `role=separator` | input: label + "Enter your pin"; slot divs "Enter digit N of M" | `onComplete` | yes | native | md 80×80 / 48 / 12 / 12 (xxxs 36 / 14 / 6 / 8) | 2px brand ring + 2px outline offset 2; filled also ring-2; caret 2px × 1em |
| Mantine | N + hidden | 4 | `type` number → `inputMode` numeric, `type=tel`; default alphanumeric | all inputs, default on | `mask` → password | none | same `aria-label` "PinInput" on all | `onComplete` | yes, all slots | ←→, Backspace back, Delete clears | 36×36 / 14 / 12 / 8 | border → primary, no ring |
| Ant Design | N | 6 | no default `inputMode` | not default | bool or char (`•`) | `separator` node or fn(i) | "OTP Input N" each; `role=group` | `onChange` only when full; `onInput` per key | yes, from index | ←→, Backspace on empty goes back | 32 h, intrinsic w (`size=1` + 4px pad) / 14 / 8 / 6 | primary border + 0 0 0 2px outline |
| Zag / Ark / Chakra v3 | N + hidden | Zag inferred; Chakra 4 | numeric default (`tel`, numeric) | opt-in `otp` | yes | none (`attached` variant) | "pin code N of M" each; label → hidden input | `onValueComplete`, `blurOnComplete`, `autoSubmit` | yes, from cursor, `sanitizeValue` | ←→ Home End, Backspace, Delete shifts left, Enter submits; roving tab | md 40×40 / 14 / 8 / 4 | inside focus ring; invalid → error colour |
| Base UI OTPField | N + hidden | required | numeric default | first slot only | yes | `OTPField.Separator` | first slot uses `<label>`; others "Character N of M" (docs); `role=group` | `onValueComplete`, `autoSubmit` | yes | full set + Ctrl+Backspace; roving tab | demo 40×40 / 16 / 8 / 0 | demo 2px outline, offset −1 |
| Radix OTP (unstable) | N + hidden | from items | numeric default | current tab stop only | `type` password | none | "Character N of M" each; `role=group` | `onAutoSubmit` only | yes | Backspace back, Ctrl+Backspace clears, Enter submits; roving | unstyled | — |
| MUI, Spectrum/RAC, Fluent, Carbon, Primer, Polaris | not found | | | | | | | | | | | |
| GOV.UK | **1 visible plain input** | 5-digit codes | `inputmode` numeric, `type` text | yes | — | user may type spaces or hyphens | normal label "Security code" | form submit | — | native | `width-4` + letter-spacing 0.05em, tabular nums | standard input focus |

## Consensus

- **Two architectures exist, and the strongest accessibility and autofill argument favours one real input.**
  - `input-otp` (and so shadcn and Untitled UI), GOV.UK, web.dev and WebOTP's example all use a single input.
  - Mantine, Ant, Zag/Ark/Chakra, Base UI and Radix use one input per slot plus a hidden form input. They spend a lot of code recovering what a single input gives for free: paste distribution, roving tabindex, focus clamping and controlling where autofill attaches.
  - The per-slot systems that care about autofill restrict `one-time-code` and `maxLength` to one slot. Base UI uses the first slot and Radix the current tab stop, partly to avoid password-manager bubbles.
- **Numeric by default.** Every system with a default chooses numeric. `inputMode="numeric"` is near-universal. Avoid `type="number"`: per-slot systems use `tel` or `text`, and GOV.UK and web.dev use `text`. A regexp gate such as `^\d+$` or `\d{1}` is used for validation.
- **`autocomplete="one-time-code"` on by default** in input-otp, Mantine, Base UI and Radix. Ant and Zag do not set it by default.
- **Default count is 4 or 6.** Mantine, Untitled and Chakra use 4. Ant and the shadcn and Base UI docs use 6. GOV.UK recommends 5-digit codes.
- **Paste fills all slots,** after sanitising whitespace or dashes. GOV.UK says users should be allowed to type spaces and hyphens.
- **Keyboard (per-slot systems).** Arrows move between slots. Backspace on an empty slot moves back and deletes. Typing the same character advances. Focus selects the content. Focus is held at or before the first empty slot. Newer systems (Zag, Base UI, Radix) add Home/End, Ctrl+Backspace to clear, Enter to submit, and a single roving tab stop.
- **Completion callback is standard:** `onComplete`, `onValueComplete`, or Ant's complete-only `onChange`. Optional auto-submit or blur on complete appears in Zag, Base UI and Radix.
- **Accessible name.** One group label is wired to the real input. Per-slot systems add "N of M" labels: "Character N of M" in Radix and Base UI, "pin code N of M" in Zag, "OTP Input N" in Ant. Mantine's identical label on every input is the outlier. The root uses `role="group"`.
- **Invalid and disabled.** `aria-invalid` drives the error border or ring. Disabled is about 50% opacity or the input's disabled paint.
- **Visual consensus at a compact scale.**
  - Slot is a square of 36–40px. Font is 14px, or 16px in the Base UI demo. Gap is 8px.
  - Radius is 4–8px for separate boxes. shadcn's attached group rounds only the outer corners.
  - Active slot: the border changes to the focus colour plus a ring (shadcn 3px at 50%, Ant 2px, Untitled 2px plus an offset outline). The active slot is raised with z-index in attached layouts.
  - Single-input designs draw a 1px-wide (Untitled 2px) blinking caret, about 16px tall, centred in the empty active slot, on a 1s cycle.
- **Grouping such as 3-3** uses a separator element (`role="separator"`, a dash or minus) between slot groups: shadcn, Untitled, Ant's `separator` prop and Base UI. Zag, Mantine and Radix have none.
- **Masking** is an opt-in that switches to `type="password"` (Mantine, Ant with a custom glyph, Zag, Base UI, Radix). `input-otp` has no mask.
