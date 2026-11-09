# Copy button spec

**Captures:** none of its own: the geometry is Button's (`docs/specs/button.md`); product reads below.
**Peers:** Button (plate, sizes, focus), Code block (its copy), Token row (copies from the whole row), Input group

## Owner decisions

- 2026-10-15: "go with your rec" → build the Copy button from `docs/PRODUCT_UI.md`, "Open component gaps": the app
  borrowed a CopyButton of its own and Typography's icon-only copy gave assistive tech no feedback; the same copy
  logic was written three times (Code block, Token row, the app).

## Job and boundaries

Copies a piece of text when pressed and confirms it in place: the icon turns to a check for two seconds and the shared
announcer says the result once, politely. It is a Button: variants, tones, sizes, focus, disabled and the icon box are
Button's.

Not this component: copying announced by a Toast (Notion's and Figma's "Copy link" menu rows; a Menu item calls
`navigator.clipboard` and the app shows a Toast); a whole row that copies (Token row, which shares the behaviour
through `useCopy` and `CopyStatus`).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| content | icon-only (no children) | ChatGPT copies in place with icon-only buttons | ChatGPT "Copy message", "Copy" (code), "Copy table" |
| content | with a label | Untitled UI's trailing "Copy" button in an input | uui `inputs.demo.tsx:153` |
| variant / tone / size | Button's | the plate is a Button | — |

No copied-state variant: the state is runtime (`data-copy-state`), not a design-time choice.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| uui | design system source | `useClipboard`: `DEFAULT_TIMEOUT = 2000` (`hooks/use-clipboard.ts:5`); the labelled copy keeps its label "Copy" and swaps `iconLeading` to `Check` (`components/base/input/inputs.demo.tsx:153`) | untitleduico/react@1d410cb8 | MIT | — |
| shadcn | design system source | `CopyButton`: icon-only, `sr-only` "Copy" fixed, `IconCopy` → `IconCheck`, `data-copied`, resets after 2000 ms (`apps/v4/components/copy-button.tsx:79-86, 117-118`) | shadcn-ui/ui@c2477f31 | MIT | — |
| mantine | design system source | `CopyButton` render prop, `timeout: 1e3` (`esm/components/CopyButton/CopyButton.mjs:15-17`); `useClipboard` `timeout = 2e3` (`esm/use-clipboard/use-clipboard.mjs:4`) | @mantine/core@7.17.8, @mantine/hooks@7.17.8 | MIT | — |
| zag | design system source (Ark, Chakra) | `timeout: 3e3`; trigger `aria-label` switches "Copy to clipboard" → "Copied to clipboard" (`dist/index.mjs:110, 128`) | @zag-js/clipboard@1.15.0 | MIT | — |
| chatgpt | target product, live DOM (read 2026-10-15, Claude in Chrome, read-only; nothing pressed) | "Copy message" and the code "Copy": `button`, 32 × 32, radius 8, padding 0, transparent ground, ink rgb(143,143,143), a 20 × 20 svg, no visible text, no `aria-live` ancestor; "Copy table": 36 × 36, radius 9999, 16 × 16 svg | chatgpt.com | n/a (evidence only) | — |
| notion, figma | target products | "Copy link" is a menu row confirmed by a toast | — | n/a | not captured |
| chatgpt-pressed | target product, live DOM (2026-10-16, Claude in Chrome; a canvas document's header "Copy" pressed, which only copied it) | 36 × 36 pill, 20 × 20 icon; pressed, the icon turned to a check and the name and tooltip to "Copied" at 225 ms, back to "Copy" at 2241 ms: **2016 ms** held (20 ms poll); no live region. Message "Copy": 32 × 32, radius 8, 20 × 20 icon, ink rgb(143,143,143) | chatgpt.com | n/a (evidence only) | `chatgpt--canvas-copy-icon--rest--light.json`, `--copied--light.json`, `chatgpt--message-copy-icon--rest--light.json` |
| notion-code | target product, live DOM (2026-10-16, a public page's code block, `todesign2020.notion.site`, read-only) | the code block's hover toolbar: language, an icon-only copy (24 × 24, radius 4, a 13.25 × 16 "duplicate" glyph, ink rgb(142,139,134), named "Copy code to clipboard"); pressed, the button does not change: a toast and a live region say "Copied code to clipboard" (toast lifetime not measured: repeated presses extend it) | todesign2020.notion.site | n/a (evidence only) | `notion--code-copy-icon--hover-block--light.json`, `--copied--light.json`, `notion--code-toolbar--hover-block--light.json` |

The copied state in ChatGPT was not observed: pressing it writes the owner's clipboard.

## Anatomy

```
Area
button.area-button.area-copy-button   Button's shell: height, padding, radius, plate, focus
  span.area-button__icon              Button's icon box; the copy glyph, or the check while copied
  span.area-button__label             only with children
```

Inset equations are Button's (`docs/specs/button.md`).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| feedback · duration | 2000 ms (`COPY_FEEDBACK_MS`) | uui `use-clipboard.ts:5`; shadcn 2000; Mantine's hook 2000; ChatGPT's canvas copy measured 2016 ms (chatgpt-pressed) | was 1600 in Code block and Token row with no source; Mantine's component 1000 and Zag's 3000 are the outliers |
| feedback · what changes | the icon only: copy → check; the label and the name stay | uui (label stays), shadcn (sr-only name stays); Area audit G-21 (Code block: one fixed name) | Zag renames the button, and so does ChatGPT (name and tooltip "Copied", chatgpt-pressed); Notion changes nothing on the button (a toast and a live region, notion-code); a changing name is read on focus, not as a result |
| feedback · announcement | the shared announcer, polite, "Copied to clipboard" / "Copy failed" (`useCopy` says it) | Code block's (audit G-21); components audit D1 | was a polite live region beside the button until 2026-11-07 |
| feedback · motion | the check enters from scale 0.6 with opacity over `duration-fast`, ease-out; the copy glyph returns at once | Code block, MOTION.md (2026-10-07) | moved from code.css to copy-button.css |
| default variant / tone / size | ghost / neutral / sm | Code block's copy (the approved instance); ChatGPT's ghost icon buttons | ChatGPT's 32 / 20 icon is Button md's role; sm is Code block's, and `size` is open |
| glyphs | Fluent copy and check cuts (Code block's); `icon` / `copiedIcon` override | Code block | the app passes Area's CopyIcon and CheckIcon |
| icon-only name | `label`, "Copy" | shadcn's sr-only "Copy"; ChatGPT "Copy" | — |
| value | a string, or a function read at the click | Code block reads highlighted HTML back off its cells at the click | — |

## States

| State | Changes | Evidence |
|---|---|---|
| rest, hover, press, focus, disabled | Button's | button.md |
| copied (`data-copy-state="copied"`) | the icon is the check, entering scaled; the announcer says "Copied to clipboard" | above |
| failed (`data-copy-state="failed"`) | the copy glyph stays; the announcer says "Copy failed" | Code block |

## Behavior and accessibility

A native `button type="button"` (Button). Icon-only takes `aria-label` from `label`; with children the visible label
is the name. The result is said through the shared announcer, so it never joins the button's name. A second press restarts the
two-second clock. `onClick` runs first; `preventDefault()` there skips the copy. A refused or missing clipboard, or a
`value` function that throws, is the failed state. Forced colours: Button's. Reduced motion: the check's entry is a
`duration-fast` animation, which Motion 0 and reduced motion zero.

## Adoption

- Code block's copy is `<CopyButton value={read} label={copyLabel} />` (its own live region removed).
- Token row uses `useCopy` with its own `copiedLabel` (2000 ms, was 1600). `CopyStatus` is deprecated and renders
  nothing.
- The app: `apps/desktop/src/copy.tsx` wraps CopyButton as an outline, labelled Button with Area's icons (it used to
  rename itself "Copied"); Typography's icon-only token copy is a CopyButton inside its Tooltip.

## Verification

- `packages/react/tests/copy-button.test.mjs`: icon-only name and no live region of its own, labelled name, Button props,
  Code block and Token row on the same control and clock.
- App preview: see the handoff.

## Review note, 2026-10-15

- **What it is:** one copy button for the whole library. Pressed, its icon turns to a check for two seconds and a
  screen reader hears "Copied to clipboard" once; the button keeps its name and width.
- **Based on:** Code block's approved copy, with Untitled UI's and shadcn's two seconds (it was 1.6 with no source)
  and Untitled UI's labelled copy. Code block, Token row and the app now all use it.
- **Why its own component:** it is a Button: it renders `Button`, and every variant, size, tone and focus ring is
  Button's. What it adds is behaviour: the clipboard write, the two-second check and the one-time announcement,
  which three places had written separately. A Button with `useCopy` does the same where a wrapper doesn't fit.
  shadcn, Mantine and Untitled UI each ship a copy button too.

## Feedback log

- 2026-10-15 · owner: "go with your rec" (new components from the backlog) → Copy button, from PRODUCT_UI.md's open gaps.
- 2026-10-16 · owner (on a parallel build of the same gap): "add my evidence" → sources chatgpt-pressed (ChatGPT's copied state held 2016 ms; it renames to "Copied") and notion-code (Notion's code-block copy: icon-only 24 × 24, confirmed by a toast and a live region, the button unchanged), with their captures. Evidence only: no value changes.
- 2026-10-16 · owner, review round 27 (components27) → approved → Complete in `component-status.mjs`.

### 2026-11-07 · One announcer (components audit D1)

The result moved from a sibling `span.area-sr-only[aria-live=polite]` to the shared announcer (`announce` / `useAnnouncement` (packages/react/src/components/announce.ts; DESIGN_SYSTEM.md, "Announcements")): `useCopy` takes
`copiedLabel` / `failedLabel` and says the result when it settles, so Copy button renders only its Button. `CopyStatus`
is deprecated (renders nothing; Governance § Deprecated). No visible change.
