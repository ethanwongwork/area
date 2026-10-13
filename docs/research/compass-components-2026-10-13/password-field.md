# PasswordField: design-system source evidence

Researched 2026-10-12. Every citation is `path:line-line @ <short sha>` on the default branch at that SHA. A statement is only made when it was read in the source. "Not found" means the named files were read and the feature is absent.

| Repo | Branch | SHA |
|---|---|---|
| carbon-design-system/carbon | main | `c9b1f79128df` |
| mantinedev/mantine | master | `e243f7f999b3` |
| ant-design/ant-design | master | `5a102fe28abc` |
| chakra-ui/chakra-ui | main | `fa9696f328ea` |
| untitleduico/react (Untitled UI React; the public repo is `untitleduico/react`, not `untitleduidev/untitledui-react`) | main | `1d410cb8facd` |
| primer/react | main | `7f5303d80398` |
| microsoft/fluentui | master | `16fcf57fe487` |
| adobe/react-spectrum | main | `9b7a06eedc6b` |
| Shopify/polaris-react (archived; description says "(Deprecated)") | main | `3f7954ae42fa` |
| alphagov/govuk-frontend (extra reference: the most thoroughly documented a11y implementation) | main | `18a320e71842` |
| w3c/aria-practices | main | `0f765e4dc33e` |
| w3c/wcag | main | `23bad5904949` |
| mdn/content | main | `19370346042e` |
| MicrosoftDocs/edge-developer | main | `97ea90deb3b8` |
| WebKit/WebKit | main | `ff9e538b9535` |

---

## Carbon: `PasswordInput`

Files: `packages/react/src/components/TextInput/PasswordInput.tsx` (P), `packages/react/src/components/Tooltip/Tooltip.tsx` (T), `packages/styles/scss/components/text-input/_text-input.scss` (S). The `packages/react/scss/...` copy only `@forward`s the styles package. All at `c9b1f79128df`.

- **Element:** a real `<button type="button">` wrapped in Carbon `Tooltip` (P:384-395; `type="button"` P:389).
- **Tab order:** no `tabIndex` is set (P:388-392), so the button is in the Tab order.
- **Accessible name and state:** the tooltip `label` is `passwordIsVisible ? hidePasswordLabel : showPasswordLabel` (P:387). `Tooltip` turns `label` into `aria-labelledby` on the trigger (T:91-99, T:150-151, T:167). The state is conveyed by **swapping the label**. There is no `aria-pressed` and no `aria-controls`. The defaults are `'Show password'` and `'Hide password'` (P:188, P:201). The component warns when either label is blank (P:357-363). The older `ControlledPasswordInput.tsx:244-252` uses the same swap in a visually hidden `assistive-text` span.
- **Icons:** `View` and `ViewOff` from `@carbon/icons-react` (P:18). Hidden shows `View` (the eye); visible shows `ViewOff` (the eye with a slash) (P:317-322). **The icon shows the action, not the current state.**
- **Focus and caret:** the click handler only flips state and calls the callback (P:226-229). There is no `preventDefault` on mousedown and no refocus, so a mouse click moves focus to the button. The caret and selection are not handled.
- **Disabled and read-only:** `disabled` goes to both the input (P:379) and the button (P:391), so the button leaves the Tab order. The disabled icon fill is `$icon-disabled` and the cursor is `not-allowed` (S:185-199). `readOnly` reaches the input only (P:256). The button stays active on a read-only field. The v12 read-only styling squares the toggle's corners (S:338-343).
- **Visibility API:** `type?: 'password' | 'text'` (P:160-163) seeds internal state (P:211) and re-syncs through `useEffect` (P:399-401). There is also `onTogglePasswordVisibility(evt)` (P:119-126). There are no `visible`, `defaultVisible` or `onVisibilityChange` props. Only `type` gives semi-controlled behaviour. The input gets `data-toggle-password-visibility` (P:380).
- **autocomplete:** no default is set (none in P).
- **Caps lock and strength meter:** not found (looked in P and S).
- **Sizing:** the toggle is absolutely positioned at `inset-inline-end: 0`, with `block-size: 100%`, `aspect-ratio: 1`, padding 0, no border and no background (S:134-154). The tooltip host is also square, inset to the full height (S:120-127). The button is therefore a square the full height of the input. Input heights are xs 24, sm 32, md 40 (default) and lg 48 px (`packages/styles/scss/utilities/_layout.scss:17-23`; `S:36` uses `$default: 'md'`). The input reserves `padding-inline-end: layout.size('height')` (S:80-82). When invalid or warning, it reserves `height + 1.5rem` (S:174-177) and moves the invalid icon to `inset-inline-end: height` (S:179-183). The icon fill is `$icon-primary` (S:160-163). The focus style is a full outline on the button (S:165-167). The v12 radius is `$border-radius-04` (S:151-153).
- **`::-ms-reveal`:** not found in S.

## Mantine: `PasswordInput`

Directory `packages/@mantine/core/src/components/PasswordInput/` at `e243f7f999b3`: `PasswordInput.tsx` (P), `PasswordToggleIcon.tsx` (I), `PasswordInput.module.css` (C). Also `../Input/Input.module.css` (IC).

- **Element:** Mantine `ActionIcon<'button'>`, `variant="subtle"`, `color="gray"` (P:175-206; variant P:183-184). The toggle sits in the input's `rightSection`. A custom `rightSection` **replaces** it (P:250).
- **Tab order:** `tabIndex={visibilityToggleFocusable ? 0 : -1}` (P:180), and `visibilityToggleFocusable` defaults to `false` (P:50, P:71-75). **By default the toggle is not in the Tab order.**
- **Accessible name and state:** a fixed `aria-label="Toggle password visibility"` plus `aria-pressed={_visible}` (P:179-181). The label does not swap. Tests assert `aria-pressed` false and true (`PasswordInput.test.tsx:71-80`). There is no `aria-controls`.
- **Icons:** the built-in SVG takes a `reveal` prop. `reveal=true` (visible) draws the eye with a slash (I:14-33); `false` draws the open eye (I:34-56). **The icon shows the action.** The icon can be replaced with `visibilityToggleIcon: React.FC<{reveal}>` (P:44-45).
- **Focus and caret:** the toggle acts on **`onMouseDown` with `preventDefault()`** (P:191-195) and `onTouchEnd` with `preventDefault()` (P:186-190), so focus stays in the input. The keyboard path is Space or Enter on the button (P:196-202). The caret and selection are not handled explicitly.
- **Disabled and read-only:** `disabled` goes to the button (P:177), and **a disabled toggle is hidden** (`&:disabled { display: none }`, C:59-61). Read-only: not found (no `readOnly` reference in P).
- **Visibility API:** `visible`, `defaultVisible` and `onVisibilityChange(visible)` (P:53-60), through `useUncontrolled` with `finalValue: false` (P:140-145). `visibilityToggleButtonProps` is spread onto the button (P:47-48, P:182). Docs demo: `@docs/demos/.../PasswordInput.demo.controlledVisibility.tsx` (two fields share one `visible` state).
- **autocomplete:** **defaults to `'off'`**: `autoComplete={rest.autoComplete || 'off'}` (P:272).
- **Caps lock:** not found. **Strength meter:** none in core. There is a docs demo composing `Popover` and `Progress` (`@docs/demos/.../PasswordInput.demo.strengthMeter.tsx:3`).
- **Sizing:**
  - Button sizes are xs 22, sm 26 (default), md 28, lg 32 and xl 40 px (C:2-6, C:14).
  - Icon sizes are xs 16, sm 20 (default), md 22, lg 24 and xl 28 px (C:8-12, C:15).
  - Input heights are xs 30, sm 36 (default), md 42, lg 50 and xl 60 px (IC:6-10, IC:18).
  - The right section width is `input-height - 2px` (IC:33-36), and the input pads inline-end by that width (IC:77-78).
  - At the default sm size, a **26 px button sits in a 34 px section of a 36 px input**.
- **`::-ms-reveal`:** `&::-ms-reveal { display: none; }` (C:48-50).

## Ant Design: `Input.Password`

`components/input/Password.tsx` (P) and `components/input/style/index.ts` (S) at `5a102fe28abc`.

- **Element:** `<span role="button">`, not a `<button>` (P:137-166), placed in the Input `suffix` (P:183-188).
- **Tab order:** `tabIndex={mergedDisabled ? -1 : (iconTabIndex ?? 0)}` (P:140). It is **in the Tab order by default** and can be overridden with `visibilityToggle.tabIndex` (P:21-25, P:134).
- **Accessible name and state:** **both** `aria-pressed={visible}` and a swapped `aria-label={visible ? locale.hide : locale.show}` (P:143-144). The English locale strings are `'Show'` and `'Hide'` (`components/locale/en_US.ts:20-21`). It also has `aria-disabled` (P:142). There is no `aria-controls`.
- **Icons:** `visible ? <EyeOutlined/> : <EyeInvisibleOutlined/>` (P:18-19). **The icon shows the current state**, the opposite of Carbon, Mantine, Chakra, Untitled and Fluent. Custom icons go through `iconRender(visible)` (P:35, P:132).
- **Focus and caret:** `onMouseDown` calls `preventDefault()` with the comment "Prevent focused state lost" (issue #15173, P:145-149). `onMouseUp` calls `preventDefault()` with the comment "Prevent caret position change" (issue #23524, P:150-154). **This is the only system that explicitly preserves the caret.** The keyboard path is Enter or Space, and repeats are ignored (`!e.repeat`) (P:155-162). `action: 'click' | 'hover'` (P:29, P:38-41) can toggle on mouse-over.
- **Security detail:** when hiding, `removePasswordTimeout()` removes the DOM `value` attribute while the type is `password` (P:116-118; `hooks/useRemovePasswordTimeout.ts:10-22`).
- **Disabled and read-only:** the handler returns early when disabled (P:112-115). The tabIndex becomes -1 (P:140). The icon keeps `colorIcon` with `cursor: not-allowed` and no hover change (S:533-543). Read-only: not found (no handling in P).
- **Visibility API:** `visibilityToggle?: boolean | { visible?, onVisibleChange?, tabIndex? }`, default `true` (P:21-30, P:47). It is controlled when `visible !== undefined` (P:95-107).
- **autocomplete:** no default (not set in P).
- **Caps lock and strength meter:** not found (looked in P and S).
- **Sizing:** the icon is an inline-flex text-size glyph with no box size. It uses `colorIcon` and turns `colorIconHover` on hover (S:513-522). The suffix sits `inputAffixPadding = token.paddingXXS` from the text (S:508-510; `style/token.ts:100-103`).
- **`::-ms-reveal`:** `'&::-ms-reveal': { display: 'none' }` on the affix input (S:468-470).

## Chakra UI v3: `PasswordInput` snippet

`apps/compositions/src/ui/password-input.tsx` (P) at `fa9696f328ea`. Docs: `apps/www/content/docs/components/password-input.mdx`.

- **Element:** `IconButton`, `variant="ghost"`, `size="sm"` (P:93-109). Chakra `Button` renders `type="button"` (`packages/react/src/components/button/button.tsx:66-67`). It sits in the `InputGroup` `endElement` (P:68-83).
- **Tab order:** `tabIndex={-1}` (P:97). **It is not in the Tab order**, and there is no prop to change that.
- **Accessible name and state:** a fixed `aria-label="Toggle password visibility"` (P:104). There is **no `aria-pressed`** and no `aria-controls`. The state is not exposed.
- **Icons:** the default is `{ on: <LuEye/>, off: <LuEyeOff/> }` (Lucide) (P:55). It renders `visible ? off : on` (P:79): **hidden shows the eye, visible shows the eye-off**, so the icon shows the action.
- **Focus and caret:** the toggle acts on **`onPointerDown`**. It skips when disabled or when `e.button !== 0`, then calls `preventDefault()` and toggles (P:72-77). Focus stays in the input. The caret is not handled explicitly.
- **Disabled and read-only:** `disabled={rest.disabled}` goes to the trigger (P:71), and there is a guard in the handler (P:73). Read-only: not found.
- **Visibility API:** `visible`, `defaultVisible` and `onVisibleChange` through `useControllableState` (P:22-39, P:59-63). Custom icons use `visibilityIcon` (P:38).
- **autocomplete:** no default.
- **Caps lock:** not found.
- **Strength meter:** `PasswordStrengthMeter` (P:111-147). It draws `max = 4` segments, each `height="1"` with `rounded="sm"`. The labels are Low, Medium and High at less than 33%, less than 66% and otherwise, coloured red, orange and green (P:149-158). The docs say to compute `value` yourself (mdx:69-74).
- **Sizing:**
  - The trigger has `height="calc(100% - {spacing.2})"` (100% minus 8 px), `aspectRatio="square"` and `me="-2"` (-8 px) (P:99-103).
  - The button sm icon is `_icon` 4 × 4 (16 px) (`packages/react/src/theme/recipes/button.ts:64-67`).
  - The default input is md, `--input-height: sizes.10` (40 px) (`theme/recipes/input.ts:43-47, 98-101`).
  - So at the default size the **toggle is a 32 × 32 square in a 40 px input**.
- **`::-ms-reveal`:** not found in P.

## Untitled UI React: password mode of `InputBase`

`components/base/input/input.tsx` (P) and `inputs.demo.tsx` (D) at `1d410cb8facd`. There is no separate PasswordInput. `type="password"` on `InputBase` adds the toggle.

- **Element:** a react-aria-components `Button` (`AriaButton`) (P:6, P:173-182).
- **Tab order:** no `tabIndex` (P:173-180), so it is in the Tab order.
- **Accessible name and state:** a fixed `aria-label="Toggle password visibility"` (P:174). There is no `aria-pressed` and no `aria-controls`.
- **Icons:** `Eye` and `EyeOff` from `@untitledui/icons` (P:4). The code is `isPasswordVisible ? <EyeOff/> : <Eye/>`, each `size-4` (16 px) at `stroke-[2.25px]` (P:181). The icon shows the action.
- **Focus and caret:** a plain `onClick` (P:175). No focus or caret handling.
- **Style:** `text-fg-quaternary`, with `hover:` and `focus:text-fg-quaternary_hover`, and `focus:outline-hidden` (P:177). **The button has no focus ring of its own.** The group draws a ring through `isFocusWithin` (P:104).
- **Disabled and read-only:** the group handles `isDisabled` (opacity 50, `cursor-not-allowed`; P:97-108). The button is not given `isDisabled` (P:173-180). Read-only: not found.
- **Visibility API:** internal `useState(false)` only (P:64). Not controllable.
- **autocomplete:** no default in P. The demo sets `autoComplete="new-password"` on `TextField` (D:167).
- **Caps lock:** not found.
- **Strength meter:** none. The demo uses a hint, "Must be at least 8 characters.", with a check icon that turns success at 8 or more characters (D:170-179).
- **Sizing:** the button is absolutely positioned at `right-3` (12 px) for sm and md, and `right-3.5` (14 px) for lg (P:78-91). It has no box size. In password mode the trailing tooltip and invalid icon are suppressed (P:144, P:160). The `pr-9` input padding only applies when `tooltip || isInvalid` (P:67, P:77), not for the password toggle.
- **`::-ms-reveal`:** not found.

## Fluent UI

**Fluent 2 (v9, `@fluentui/react-input`): none.**
- The v8 to v9 migration doc says "v9 `Input` does not provide built in password reveal behavior" for both `canRevealPassword` and `revealPasswordAriaLabel` (`apps/public-docsite-v9/src/Concepts/Migration/FromV8/Components/Input.mdx:229-230` @ `16fcf57fe487`).
- The spec says "TBD if/how we want to handle this in converged" (`packages/react-components/react-input/library/docs/Spec-variants.md:81-89`).
- The only `password` hit in the v9 Input types is the `type` union (`.../Input/Input.types.ts:97`).

**Fluent v8 `TextField` with `canRevealPassword`** (`packages/react/src/components/TextField/`, @ `16fcf57fe487`):
- **Element:** `<button type="button">` with the comment "default button type within a form is 'submit'" (`TextField.base.tsx:265-271`).
- **Tab order:** no tabIndex, so it is in the Tab order.
- **Accessible name and state:** `aria-label={revealPasswordAriaLabel}` (a static, consumer-supplied label such as "Show password") **plus `aria-pressed={!!isRevealingPassword}`** (`TextField.base.tsx:267, 270`; `TextField.types.ts:284-298`).
- **Icons:** `isRevealingPassword ? 'Hide' : 'RedEye'` (`TextField.base.tsx:63-64, 276`). The icon shows the action.
- **Focus:** a plain `onClick` toggle (`:575-577`). No focus or caret handling.
- **Native reveal:** the custom button renders only when `_browserNeedsRevealButton()`, which is false in IE11 and Edge (`/Edg/` user agent). **Fluent defers to Edge's native reveal instead of hiding it** (`TextField.base.tsx:231, 679-695`; `TextField.types.ts:286-297`).
- **Sizing:** the reveal button is 30 × 32 px with padding `0 4px`, colour `semanticColors.link`, an inset-1 focus style and a hover background (`TextField.styles.tsx:419-449`). The icon is `IconFontSizes.medium` (`:455-463`).

## Spectrum 2 / React Spectrum: none

`TextInputDOMProps.type` allows `'password'` (`packages/@react-types/shared/src/dom.d.ts:165, 197-203` @ `9b7a06eedc6b`). `packages/@react-spectrum/s2/src/TextField.tsx` has no `password` or `reveal` code, and the repo tree has no file named `*password*`. There is no reveal control.

## Primer React: none

The repo tree at `7f5303d80398` has no file matching `password`. The closest primitive is `TextInput`'s `trailingAction` (`packages/react/src/TextInput/TextInput.tsx:48, 264`), rendered by `TextInput.Action`:
- An `IconButton` with `type="button"`, `size="small"` and default tooltip direction `'s'`. `aria-label` is both the name and the tooltip text (`packages/react/src/internal/components/TextInputInnerAction.tsx:17-18, 79-90`).
- The action box `--inner-action-size` is 24 px by default, 20 px small and 28 px large (`TextInputWrapper.module.css:96, 99, 114`). Input heights are a 32 px minimum, 28 px small and 40 px large (`:3, :101, :116`).
- The invisible variant has 2 px / 4 px padding and `fgColor-muted`, turning `fgColor-default` on hover or focus. On coarse pointers a 44 px minimum hit area is added (`TextInputInnerAction.module.css:1-31`). There is a 4 px inline margin (`:33-38`).

## Polaris: none (and the repo is deprecated)

`polaris-react/src/components/TextField/TextField.tsx` @ `3f7954ae42fa` accepts `type: 'password'` (`:33`) and has no reveal. Worth noting: when `autoComplete === 'off'` it adds password-manager opt-outs `data-1p-ignore`, `data-lpignore` and `data-form-type="other"` (`:610-615`). The newer Polaris web components are not in this repo and were not checked.

## GOV.UK Frontend: `govukPasswordInput` (extra reference)

`packages/govuk-frontend/src/govuk/components/password-input/` @ `18a320e71842`: `password-input.mjs` (J), `template.njk` (N), `_mixin.scss` (S).

- **Element:** a visible **text button** ("Show" / "Hide"), a secondary button beside the input, not inside it (N:48-61; S:32-54, `flex-basis: 5em`). It is `hidden` until JS runs (N:56-59, J:85). JS throws if it is not `type="button"` (J:70-74).
- **Accessible name and state:** **`aria-controls` = the input id** (N:54). The name swaps between `aria-label` "Show password" and "Hide password", and the visible text swaps too (J:173-180, J:201-210). A **polite live region** ("Your password is visible" / "Your password is hidden") is inserted between the input and the button for reading order (J:87-96, J:182-185). No `aria-pressed`.
- **Resetting to hidden:** the field reverts to hidden on form `submit` (J:101-104), on a bfcache restore (`pageshow` with `persisted`; J:106-111) and at init (J:113-114).
- **Input attributes:** `spellcheck: false`, `autocapitalize: "none"` and **`autocomplete` defaulting to `"current-password"`** (N:86-88).
- **`::-ms-reveal`:** set to `display: none` "so that there aren't two controls … that do the same thing but aren't in sync". Edge's **Alt+F8** shortcut "cannot be programmatically disabled" (S:22-29).

---

## Accessibility and platform guidance

- **WAI-ARIA APG, Button pattern** (`content/patterns/button/button-pattern.html` @ `0f765e4dc33e`): a toggle button uses `aria-pressed`, and "it is critical the label on a toggle does not change when its state changes". If the label changes (Mute to Unmute), "the aria-pressed attribute would not be needed" (lines 29-34; also 103-104). **So pick one: a static label with `aria-pressed`, or a swapped label without it.** Ant Design does both, which the APG text advises against.
- **WCAG 2.2, Understanding 3.3.8 Accessible Authentication (Minimum)** (`understanding/22/accessible-authentication-minimum.html` @ `23bad5904949`):
  - Showing the password optionally "can improve the chance of success for some people with cognitive disabilities" (line 131). Its figure is "a button next to it to toggle the display" with an eye icon (134-135).
  - Fields must allow password managers to fill them and must allow paste (59, 66, 72). Blocking either fails the criterion.
- **MDN, `<input type="password">`** (`files/en-us/web/html/reference/elements/input/password/index.md` @ `19370346042e`):
  - `autocomplete` should typically be `on`, `current-password` or `new-password`; `on` "isn't as informative" (126-141).
  - Use `one-time-code` or `off` for one-time PINs (160).
  - The `autocomplete` token list is in `attributes/autocomplete/index.md:176-178`.
- **Microsoft Edge native reveal** (`microsoft-edge/web-platform/password-reveal.md` @ `97ea90deb3b8`):
  - Edge inserts an eye **password reveal** button into every password input's shadow DOM. Alt+F8 also reveals. Users or enterprises can turn it off from Edge 87 onwards (12, 22).
  - The icon gets a slash when revealed (18-20).
  - Remove it with `::-ms-reveal { display: none; }` (34-40). The docs recommend keeping it because of its security behaviour (42).
  - The button appears only after the user types. It is removed when focus leaves or when script changes the field, and it is unavailable when the password manager autofilled the field (73-81).
  - There are no state selectors for the toggled state (67).
- **Safari / WebKit** (`Source/WebCore/css/html.css` @ `ff9e538b9535`):
  - **WebKit draws its own caps-lock indicator** inside password inputs: `input::-webkit-caps-lock-indicator`, a 17 px SVG with `max-width: 17px` and `flex: none` (691-697).
  - The credentials AutoFill key button is `input::-webkit-credentials-auto-fill-button`, 24 × 24 px (609-614).
  - There is a strong-password AutoFill button (`::-webkit-strong-password-auto-fill-button`, 597-607).
  - No native reveal pseudo-element was found in this stylesheet.
  - A custom trailing reveal button therefore shares the trailing edge with up to two WebKit controls.

---

## Summary table

| | Carbon | Mantine | Ant Design | Chakra v3 | Untitled UI | Fluent v8 | GOV.UK |
|---|---|---|---|---|---|---|---|
| Element | `<button type=button>` | `<button>` (ActionIcon) | `<span role=button>` | `<button type=button>` (IconButton ghost sm) | RAC `<Button>` | `<button type=button>` | text `<button type=button>` beside input |
| In Tab order | yes | **no** (`-1`; opt-in prop) | yes (`0`; prop) | **no** (`-1`) | yes | yes | yes |
| Name | swaps "Show/Hide password" (tooltip `aria-labelledby`) | static "Toggle password visibility" | swaps "Show/Hide" | static "Toggle password visibility" | static "Toggle password visibility" | static (consumer) | swaps "Show/Hide password" + visible text |
| `aria-pressed` | no | yes | yes (and swaps label) | no | no | yes | no |
| `aria-controls` | no | no | no | no | no | no | **yes** |
| Live announcement | no | no | no | no | no | no | **polite region** |
| Icon when hidden → visible | eye → eye-off | eye → eye-off | eye-off → eye (state) | eye → eye-off | eye → eye-off | RedEye → Hide | text Show → Hide |
| Keeps focus in input | no | yes (mousedown/touchend preventDefault) | yes (mousedown preventDefault) | yes (pointerdown preventDefault) | no | no | no (focus on button) |
| Preserves caret | no | not explicit | **yes** (mouseup preventDefault) | not explicit | no | no | no |
| Disabled | button disabled, icon-disabled fill | toggle **hidden** | aria-disabled, tabIndex -1, not-allowed | button disabled | group dims; button not disabled | n/a | input disabled |
| Read-only | button stays active | not handled | not handled | not handled | not handled | not handled | not handled |
| Controlled props | `type` + `onTogglePasswordVisibility` | `visible` / `defaultVisible` / `onVisibilityChange` | `visibilityToggle={{visible, onVisibleChange}}` | `visible` / `defaultVisible` / `onVisibleChange` | none | none | none |
| autocomplete default | none | **`off`** | none | none | none (demo `new-password`) | none | **`current-password`** |
| Hides `::-ms-reveal` | no | yes | yes | no | no | defers to Edge (no custom button) | yes |
| Caps-lock warning | no | no | no | no | no | no | no |
| Strength meter | no | demo only | no | `PasswordStrengthMeter` (4 segments) | hint text demo | no | no |
| Button vs input (default) | square = input height (40 in 40) | 26 in 36 (34 section) | text-size glyph, 4 px gap | 32 in 40 (100% − 8 px, square) | 16 px icon, 12 px from edge | 30 × 32 | separate button, 5em wide |

Spectrum 2, Fluent 2 (v9), Primer and Polaris ship **no** reveal control.

## Consensus

- **Element.** Use a real `<button type="button">` inside the trailing edge of the input. Five of six inline implementations use a button; Ant Design's `span role=button` is the outlier. `type="button"` is called out explicitly to avoid form submission (Fluent comment; GOV.UK throws without it).
- **Icon.** Show the action: an eye while hidden and an eye with a slash while visible. Carbon, Mantine, Chakra, Untitled and Fluent all do this, and it matches Edge's native control. Ant Design alone shows the state.
- **Naming.** There is no single convention. Follow APG's rule of picking one model:
  - a static name with `aria-pressed` (Mantine, Fluent v8), or
  - a swapped "Show password" / "Hide password" name without `aria-pressed` (Carbon, GOV.UK).

  The static "Toggle password visibility" without `aria-pressed` (Chakra, Untitled) exposes no state. Ant Design's label swap plus `aria-pressed` runs against the APG note. GOV.UK adds `aria-controls` and a polite live region.
- **Focus.** Libraries whose toggle sits inside the field keep focus in the input on pointer press by calling `preventDefault` on mousedown, pointerdown or touchend (Mantine, Ant Design, Chakra). Only Ant Design also preserves the caret (mouseup `preventDefault`). Carbon, Untitled and Fluent v8 let the button take focus.
- **Tab order is split.** Carbon, Ant Design, Untitled, Fluent and GOV.UK keep the toggle tabbable; Mantine (by default) and Chakra remove it. Mantine and Ant Design expose a prop for it.
- **Visibility API.** Controlled plus uncontrolled visibility is the norm where it exists: `visible` / `defaultVisible` / `onVisibilityChange` (Mantine) or `onVisibleChange` (Chakra, and Ant Design's object form). The default is always hidden.
- **Disabled and read-only.** Disabling the field disables the toggle everywhere (Mantine hides it). No system handles read-only; Carbon leaves the toggle active on a read-only field.
- **Native controls.** Hide Edge's native reveal with `::-ms-reveal { display: none }` so there aren't two unsynced controls (Mantine, Ant Design, GOV.UK). Fluent v8 instead suppresses its own button in Edge. Alt+F8 cannot be disabled. Safari's own caps-lock indicator (17 px) and AutoFill key button (24 px) also occupy the trailing edge.
- **Autocomplete.** No system checked defaults to `new-password`; that is left to the consumer (Untitled's demo uses it). GOV.UK defaults to `current-password`, which matches MDN and WCAG 3.3.8's emphasis on password-manager fill. Mantine's default of `off` works against that guidance.
- **Not part of the field.** No system ships a caps-lock warning (WebKit draws one natively). Only Chakra ships a strength meter, as a separate sibling component; Mantine and Untitled show it as a demo composition.
- **Sizing.** The toggle is a square icon button inset inside the field. It is 4 to 10 px shorter than the input in Mantine and Chakra, full height in Carbon, and a bare 16 px icon in Untitled and Ant Design. The input reserves trailing padding for it.
