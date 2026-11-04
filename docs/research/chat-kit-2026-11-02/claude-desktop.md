# Claude desktop: chat in a wide column vs a narrow panel (read 2026-11-02)

Claude desktop 4.4212.0. `Contents/Resources/ion-dist.asar`, extracted with `npx @electron/asar extract`. All paths
below are under `assets/v1/` (the hashes are from this build). The quick-entry window is in `app.asar`,
`.vite/renderer/quick_window/`. Values are resolved from tokens at rem 16 and `--cds-rem-scale` 1.

**Density is now confirmed.** The Code tab mounts its CDS provider with `density:"compact"`
(`c3af3d0ed-BpDc0VHY.js`). The earlier audit (`docs/research/claude-code-ui-audit-2026-10-31.md`) listed this as
unconfirmed. Nothing here was measured in the live window: the app can't be driven over CDP from here. Where the
bundle leaves a choice open, the entry says so. This extends `inspector-chat-2026-10-18/claude-code.md` (the VS Code
extension) and `consistent-nav-2026-11-01/README.md` § Claude desktop, and doesn't repeat them.

Sources are abbreviated as follows:

- **MAIN**: `c6a992d55-DOxJvg9D.css` (the CDS tokens and utilities)
- **SH**: `shared-styles-BawOO5XW.css`
- **MD**: `c19e90103-B2A_3nR4.css` (`.epitaxy-markdown`)
- **DOC**: `c3fde7009-BszyXGym.css` (the document viewer)
- **TS**: `c734f318c-CmuZIsKT.js` (the CDS `TurnStatus` component), with its constants in `shared-frame-Cetv9ixB.js`
- **COL**: `shared-6-DjPDEsys.js` (the Code column)
- **CODE**: `c19e90103-AkPh2oW3.js` (Code blocks and bash output)
- **CHATROW**: `cc1aae219-BwKj3o0f.js` and `c05b96c7f-BE-al_cp.js` (the Chat tab's tool rows and timeline)
- **PEEK**: `c041f89c8-CE8MtWmt.js` (the compact chat override)

## Four renderers in one app

| Surface | Markdown | Column | Body type |
|---|---|---|---|
| Chat / Cowork (claude.ai renderer) | `.prose` + `[data-cds=Prose]`, em-based | `max-w-[var(--transcript-width,48rem)]` (MAIN) | 15/21 serif (measured live) |
| Code tab | `.epitaxy-markdown` (MD); spacing from the line height | 768 / 960 / 1280 + 32 gutters (COL) | `--chat-body` 14 / leading 1.4286 = 20 |
| Compact peek (`compactPeek`, spin-off and dispatch chats) | the claude.ai renderer plus one override class (PEEK) | the host panel | 13, leading 1.5 |
| Document viewer (files opened from Code) | `.epitaxy-document-prose` (DOC), em-based | `--document-measure` = body × 36 (540 at 15) | 15 × 1.6 = 24 |

## 1. Code tab transcript

### Type and rhythm (`.epitaxy-root .epitaxy-transcript-typography`, MAIN)

The "Transcript text size" setting has three values, Small / Medium / Large (`data-chat-text-size` s/m/l; labels in
`c0db37792-Zib3L6-s.js`).

| Token | Small | Medium (default) | Large | Rule |
|---|---|---|---|---|
| `--chat-body` | 13 | 14 | 15 | `[data-chat-text-size=s\|l] .epitaxy-transcript-typography` |
| `--chat-leading` | 1.4286 (18.6) | 1.4286 (20) | 1.46667 (22) | same |
| `--chat-item-gap` (between blocks in a reply) | 9.3 | **10** | 11 | `body × leading × .5` (half a line) |
| `--chat-turn-gap` (between rows of a turn) | 13.9 | **15** | 16.5 | `body × leading × .75` |
| `--chat-reply-gap` (after a reply) | 50 | 50 | 50 | `mb-[var(--chat-reply-gap,50px)]`; 28 in the overview feed |
| `--chat-line-gap` (under a hover line) | 22 | 22 | 22 | `mb-[var(--chat-line-gap,22px)]`; by speaker 8 or 32−8 |
| transcript row gap | 20, compact 16 | | | `[&>[data-transcript-row]]:!mt-5`, `compact:!mt-4` |
| `--prompt-text-size` (composer) | 13 | 14 | 15 | `.epitaxy-root`; **16 on `(pointer:coarse)`** (SH) |
| Code (CDS compact) | 12/17 | | | `--cds-font-size-code` / `--cds-leading-code`; replaced by the "Code font size" setting (`[data-code-font-size]`) |

`text-body` rows outside the markdown (tool rows, labels) use the CDS compact body, 13/19. When a message carries
`data-text-size` sm or lg, the body becomes 13/19 or 15/22 (`[data-text-size=sm|lg]` blocks, MAIN). The Code tab
maps s→sm, m→base, l→lg (`sL` in `c96d752d0-BKceltwO.js`). So at Medium, rows stay 13/19 while markdown is 14/20.
That's how the bundle reads; it wasn't checked live.

### Turn summary, tool rows, Done and Thinking: one component, `TurnStatus` (TS)

The Code tab builds every status line from CDS `TurnStatus` (`data-cds="TurnStatus"`). This includes the turn
summary ("read 3 files, edited 5 files, ran 2 commands"), each tool step (`TurnStatus.Step`, `data-cds="TurnStatusStep"`),
the busy, Done and "Thought for Ns" lines, and the approval line (`codeTurnStatusRows` in `c96d752d0`). The summary
phrases come from `c24951e9f-Bm0nLIAV.js`: `read` / `viewed` / `created` / `edited` + "a file / # files"; `ran` +
"a command / # commands", "code" or "# agents"; `searched` + "code", "for files" or "the web # times"; `fetched` +
"# pages"; `updated todos`; `proposed a plan`.

| Part | Value (compact) | Class or token, source |
|---|---|---|
| Row | flex, `gap-xs` **6**, `items-center`, `text-body` 13/19 | `TI` = `flex min-w-0 items-center gap-xs text-start font-sans text-body font-normal` |
| Row height | **24** = `--cds-h-control` (one line padded to the control height) | `AI` = `py-[calc((var(--cds-h-control) - 1lh)/2)]` |
| Row inset | `px-xs` 4, pulled out by an outset of 4 so the text aligns with the message text | `wI` + `--cds-outset-x: var(--cds-pad-xs)` |
| Leading mark (Spark while busy) | a **20**-wide box, end margin 12 − gap 6, so the label starts **32** in (`--cds-turn-status-hang` 32); glyph `size-icon` 16 | `QI` "20px", `$I` "12px", `pL` = `w-[20px] me-[calc(12px - var(--cds-gap-xs))]` |
| Label (verb or phrases) | `text-muted` when done; `text-secondary` when busy, open, or the row is hovered or focused | `Xe.status`, `Qe` |
| Busy label | shimmer text, `variant:"secondary"` | `Te` |
| Meta (detail, e.g. a path) | `text-secondary`, primary on hover; one line with an ellipsis (`py-[0.125em] -my-[0.125em]`) | TS `$t` / `T` |
| Outcome word | Failed `text-danger`; Stopped and Denied `text-secondary`; "Needs approval" `text-warning` | `SI` in shared-frame |
| Elapsed time | `shrink-0 tabular-nums text-muted`; narrow Intl units, up to 3 ("1m 4s") | `XI`, `gI` |
| Trailing slot | `ms-xs` 6, `h-[1lh]` | TS `Wr` |
| Media slot (trailing kind) | `order-last ms-auto h-[1lh]` | `data-cds-row-media` |
| Disclosure caret | CaretRightFilled at `xs` (12), muted; turns 90° when open over `duration-fast` | `$e` |
| Focus | `inset 0 0 0 1px var(--cds-fill-accent)`, rounded | TS `Je` |
| Expanded steps | wrapper `pt-sm pb-xs` (6/4) and start padding **32** (under the label, not the mark); a card `rounded-card` **10** with a hairline ring (`shadow-card-ring`) and `divide-y`; cells `px-md py-sm` (**8/6**) | `zt`, `Ke`, `et` |
| Step detail (thinking text, output) | `flex gap-xs text-body text-secondary`; `pt-xs` 6 under a row, `pt-sm` + 2 in a card | `Ot`, `qe` |

**No rail.** The Code tab joins steps with the 32 hang and a divided card, not a line. The railed timeline belongs
to the Chat tab (below).

### Code block and tool output (CODE, MD, MAIN)

| Part | Value | Source |
|---|---|---|
| Fence | `rounded-lg` **8**, `overflow-clip`; edge = inset 1px `--cds-border` plus an inner 1px of the transcript surface | `.epitaxy-fence` / `.epitaxy-card-outline-layer:after` |
| Code padding | block `--cds-pad-md` **8**; inline start `10px + 1ch`, end = button gutter + 1ch | `unsafeCSS` `[data-file]` |
| Language label | `h-control` 24, `text-caption` (11/17), `text-muted-as-secondary`, at most 20ch | `data-code-label` |
| Copy and actions | sticky at `fade-height + 5`, `gap-0.75` (3), ghost buttons `size:"base"`, backdrop blur while it scrolls | CODE |
| Bash output card | `rounded-lg` 8, 1px outline overlay, `max-h-100` (**400**) scrolling, `px-md py-1.25` (**8/5**), 5 under the command | `l_` |
| Space around a block | item gap + `--codeblock-bump` **4** above and below | MD |
| Scrollbars | 8, thumb `alpha-3` on an `alpha-1` track, full radius | MD |

### Markdown (`.epitaxy-markdown`, MD)

| Element | Value |
|---|---|
| Block gap | `gap: var(--chat-item-gap)` 10 (flex column) |
| h1 / h2 / h3 | 1.14286em (16) / 1.07143em (15) / 1em; semibold; −.01em tracking; margins **12 / 10 / 7 px above, −4 px below** |
| Lists | indent 20px; item gap `--cds-pad-sm` 6 |
| Inline code | body − 1px, `alpha-1` fill, radius 4, padding 1/2, line height 1.4 |
| kbd | body − 2px, 1px border with a 2px bottom, radius 4 |
| Blockquote | 2px `alpha-2` rule, `pad-md` 8, secondary text |
| Table | `border-spacing: 2px`; cells `pad-sm` 6, radius 3; th `alpha-2` medium, td `alpha-1`; horizontal scroll when it overflows |
| hr | .5px `alpha-3`; item gap above and below |

### Column, user message, composer (COL, MAIN)

| Item | Value | Source |
|---|---|---|
| Text column | **768** by default; 960 (Medium), 1280 (Wide). Setting "Transcript width", described as "Maximum width of the transcript and composer columns" | `Eq`: `--max-content-width` |
| Gutters | **32** a side (outer column 832); **16** when the tile is ≤ 560 | `xq`, `--chat-gutter` |
| User message | CDS `UserMessage` bubble, right-aligned (`.epitaxy-user-turn` `justify-end`); radius `--cds-radius` + 4 = **10**; padding `pad-lg` × `pad-md` = **12 × 8**; max **85%**; fill `--cds-bg-neutral` = `alpha-1` | MAIN `[data-cds=UserMessage]` |
| User enter | `code-user-bubble-enter`, `dur-slow`, overshoot easing, from the right | MAIN |
| Composer | the same column; radius `--cds-radius-composer` **12** | COL, MAIN |

### Colours (MAIN, `.cds-root` light / dark)

| Role | Light | Dark |
|---|---|---|
| text primary | `#0b0b0b` (gray-900) | `#f0efec` (gray-50) |
| text secondary | `#52514e` (gray-600) | `#c3c2b7` (gray-200) |
| text muted (finished labels, time) | `#898781` (gray-400) | `#898781` (gray-400) |
| alpha-1 / 2 / 3 / 4 | 5 / 10 / 20 / 35% of `#0b0b0b` | 5 / 10 / 20 / 35% of `#fff` |
| border, ring | alpha-2 | alpha-2 |
| user bubble | alpha-1 (hover alpha-2) | alpha-1 |
| transcript surface | `--cds-surface-1` `#fcfcfb` (or the page `#f9f9f7`) | `#151515` (page `#0b0b0b`) |

## 2. Chat tab tool timeline (the railed one, CHATROW)

| Part | Value |
|---|---|
| Group box | `rounded-[var(--msg-block-radius,.5rem)]`, `border-0.5 border-border-300`, `my-3` (`mt-2`/`mb-2` at the message's ends), `leading-normal` |
| Icon column | **20** wide, centred; the icon is `text-text-500` (= `--cds-text-muted`), secondary on hover |
| Rail | `w-[1px]` at the column's centre (x = 10); 8-tall rail stubs between items; a missing icon falls back to an **8** dot (`bg-border-100`, `mt-0.5`) |
| Row | `py-1` (4) in the group; standalone `px-2.5 py-2` (10/8), radius 8, text `text-text-300` (= secondary), label `text-body` muted, `gap-1` |
| Collapse | 3 or more steps show the last 2, behind a "N steps" button (`px-3 py-2 text-sm text-text-300`, CaretDown at `sm`) |
| Expanded output | card `mx-2.5 mt-1 mb-2 rounded-lg border-[0.5px] border-border-300 bg-bg-000`, `p-2`, max **200** scrolling, code `text-xs` (12) |
| Expanded output in CDS mode | no card: `px-0`, outset `mx-outset w-stretch px-xs`, `py-3`, max 4000 (`c62cd56ac-DNNzgnji.js`) |
| Code card in a tool | `bg-surface-1 rounded-md` (6), `p-3` (12), gap 12; header `text-footnote` or 11px mono |

## 3. Narrow-width rules (everything found)

| Trigger | What changes | Source |
|---|---|---|
| Code tile ≤ **560** (`@container tile-slot`; tiles in split view) | Gutters 32 → **16**; a queued message's remove button pulls in by 16 | MAIN, COL `vq`/`yq` |
| Code tile ≤ 500 | Approval dock floor 144 → **208** | COL `Xq` |
| Code tile ≤ 480 | One chat-panel element is hidden (`bq`); the element wasn't identified | COL |
| Any CDS assistant message | Right text stop `clamp(0px, (100% − 384px) × .175, 56px)`: **0 at ≤ 384, 56 at ≥ 704**. The only fluid prose rule. | MAIN `[data-cds=AssistantMessage]` |
| Chat tab at viewport < 768 (`max-md`) | Transcript list `px-3` (12); widget bleed 12 | MAIN |
| Compact peek (`compactPeek`) | Message **13**, leading 1.5; timeline rows 12; code 12; h2 17, h3 15, h4/h5 14, h6 13; table 13; message gap 4; assistant bottom padding 6; pill padding 2; question card `p-2 my-1`; composer `p-2`, height 40 to 160 | PEEK `l`, `u` |
| `(pointer:coarse)` | Composer and text entry 16 (no zoom on iOS) | SH, MAIN `--cds-font-size-text-entry-floor` |
| Viewport height ≤ 420 | Approval card max `max(60vh, 256)` | MAIN |
| Document viewer (`container-type:size`) | Side padding `clamp(20, 6cqi, 64)`; top `clamp(32, 6cqi, 56)`, bottom 96; the outline rail appears only once the gutter is ≥ 76; tables and figures bleed into the gutter | DOC |
| VS Code extension (earlier notes) | Tool bodies hidden < 500 wide | `inspector-chat-2026-10-18/claude-code.md` |

Not found anywhere: a width rule that changes body size, heading size, bubble measure (always 85%) or markdown
spacing. Tables and code scroll horizontally at every width (`overflow-x:auto`); nothing reflows them. The
quick-entry window (`quick_window/main-*.js`) has no transcript markup, only the prompt. The Chrome extension isn't
installed on this machine, so its side panel wasn't read.

## 4. Font-relative or fixed, and one component or two

| Renderer | Block gap | Headings | Lists, cells | Follows |
|---|---|---|---|---|
| CDS `.prose` (Chat, Cowork, peek) | `--_prose-flow-base` **.75em**; `data-prose-spacing=lg` 1em | space above ×3 / 2.5 / 2 / 1.667 flow; in replies h1 = h2 = `1em + .125rem`, h3+ 1em; `.prose` alone h1 1.75em, h2 1.375em, h3 1.125em | th/td `.4375em + 1px` block, 1.5em between columns | the font size (em) |
| Code `.epitaxy-markdown` | **half a line** (`body × leading × .5`); turns ¾ of a line | **fixed px** margins 12 / 10 / 7, −4; em sizes | **fixed** 20 indent, density `pad-sm` 6 gaps, 6 cell padding | line height for gaps; px for headings |
| Document `.epitaxy-document-prose` | em throughout (chunks 1 / 2 / 2.5 / 3em before h3 / h2 / h1) | 1.75 / 1.35 / 1.125em | `.5em .875em` cells | the font size (em) |

The same markdown component serves wide and narrow: none of `.prose`, `.epitaxy-markdown` or
`.epitaxy-document-prose` has a width-conditional rule. Narrow surfaces change only the frame: gutters (Code tiles),
the text stop (CDS clamp), or one override class that resets sizes (the compact peek). Because the spacing is font-
or line-relative, a smaller body tightens the rhythm with no extra rules.

## Takeaways for Area

1. **Width changes the frame, not the prose.** Keep one markdown style; let narrow change the gutters (32 → 16 at
   ≤ 560), and let the reply's right stop shrink fluidly (0 at 384, 56 at 704).
2. **A dense panel is a type size, not a width.** Claude's peek drops the body to 13 with a 1.5 leading and code
   to 12. In the Code tab that is the Small setting (13), a setting rather than a breakpoint.
3. **Tool rows are status lines, 24 tall at 13/19.** The label is muted and the detail secondary; time sits at the
   end in tabular numbers. The leading mark is 20 wide with a 32 hang. Expanded steps sit in a 10-radius card with
   dividers, 8/6 cells. A rail (1px at x 10, 8 dots) is the Chat tab's older pattern.
4. **Gaps derive from the line.** A block gap of ½ a line (10 at 14/20) and a turn gap of ¾ (15) scale with the text
   setting automatically.
5. **Columns are 768 / 960 / 1280,** user-chosen and shared by transcript and composer. The user bubble is 85%,
   radius 10 and padding 12 × 8 at every width.
