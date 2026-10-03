# Cursor desktop and Figma against the compact inventory (2026-10-02)

Second pass after `cursor-web.md`. Light theme only.

- **Cursor 3.23 desktop** (Electron 42), relaunched with the owner's approval with
  `--remote-debugging-port=9222`; `area-capture.js` ran in the renderer over CDP (fingerprint
  `091bb143`) and wrote captures straight to disk. Two surfaces:
  - `cursor-app--*` (25): the **Agents window**, Cursor's new `ui-*` / glass system — sidebar,
    new-chat and follow-up composer, chat prose, side list, pills, select trigger, browser tab,
    upsell popover, chat-actions menu.
  - `cursor-ide--*` (30): the **IDE window** with no folder open (opening a project could start
    indexing) — welcome action cards, recent list, title and status bars, command palette,
    Keyboard Shortcuts table and editor tab, panel tabs, Cursor Tab status popover, empty
    notification center, Cursor Settings (cards, nav, buttons, select, layout picker).
- **Figma web editor** in the owner's Chrome, on the owner's copy of the iOS 27 community kit:
  `figma--share-dialog*` (3), `figma--coach-mark-popover`, `figma--sectioned-popover` (Edit
  text style). Opened and closed only; nothing shared or edited.

All 60 pass `capture-compare.mjs` and are redacted (no names, email, project or chat titles).
No toast with actions was available (none pending; not created), and no code block (the only
chat has prose).

## Two densities inside Cursor

The IDE keeps VS Code's rhythm: rows 22–24, palette 22, status bar 22, panel tabs 22, table 24,
settings nav 24, 20-tall settings buttons, corners 3–8. The Agents window — Cursor's newer
product surface — is looser: rows 28–30, menu 30, corners 8–18, chat prose 15/24. Area compact
sits on the IDE side; the Agents window is closer to Area default.

## Values the captures settle

| # | Value | Compact ships | Evidence | Read |
|---|---|---|---|---|
| 1, 2, 31 | control-xs height · gutter · corner | 20 · 6 · 4 | Cursor Settings buttons 20 tall, sides 6 + 1 border, corner 4; Agents icon button 20 at corner 4 | **First dense capture of 20**: rule confirmed. Corner applied 3 → 4 (standard dense xs, 2026-10-02). |
| 17 | ui-row | 24 | IDE palette rows 22, Keyboard Shortcuts rows 24, settings nav 24; Agents menu 30, sidebar 30, side list 28 | Supported for the IDE side. |
| 18, 19, 44 | Row inset · gap · label column | 8 · 8 · 32 | Agents menu: icon 8 in from the highlight plate, label 32 in from it (plate inset 6, icon 14, gap 10) | **Label column 32 matches exactly.** Sidebar: icon 7 in, label 30. |
| 41 | Menu row gap | 0 | Agents menu rows flush (30, 30, …) | Matches R7. |
| 42 | Separator | 4 / 1 / 4 | Agents menu 6 / 1 / 6, rule inset 14 from both sides; Cursor web 5 / 1 / 5; VS Code 5 / 1 / 5; Figma 7 / 1 / 7 | Four products, all larger. |
| 40, 43 | Menu inset · row corner | 4 · 4 (in 8) | Agents menu: block pad 6, plate inset 6, plate corner 8 in a 14 menu (concentric) | Larger and rounder than Area at both densities. |
| 52 | Popover inset | 8 (R9 kept) | Cursor upsell popover 16 all sides; Figma Edit text style and Share header 16 sides / 12 top; Figma color picker 16 | **Three dense products at 16** against Area's 8 (default 12). R9's VS Code hover is a tooltip, not a popover. |
| 53, 54 | Popover title → body · body → action | 6 (cluster) | Cursor 4 · 12 (title 13/18 semibold, pill action 24) | — |
| 65, 66 | Dialog inset · corner | 12 · 12 (R8) | Figma Share: header title 16 in, 12 down; field row 16 in; action rows 36 at 8 in; corner 13; two panels 8 apart | Figma holds 16 sides; R8's 12 rests on VS Code alone. |
| 36 | Container corner | 8 | IDE palette 8; Agents menu 14, popover 12, composer 18; Cursor Settings cards 12; Figma 13 | IDE agrees; the Agents window and Figma do not. |
| 103 | Composer inset · gap | 6 · 6 | Agents new-chat composer: toolbar pad 8 + 1 border, controls 24, gap 4; editor pad 8 × 12; corner 18. Follow-up: a 42 pill, pad 8, gap 4 | Inset brackets Area (9 vs 6); gap is tighter (4). Cursor web was 12 / 12. |
| 104 | Composer corner | 12 | 18 (new chat), pill (follow-up) | — |
| 16, 29 | Chat / body text | 14/20 | Agents chat prose 15/24, paragraphs 16 apart; composer editor 15/24 | **Cursor reads larger in chat than in its chrome (13/18).** Dense UI type does not imply dense reading text. |
| 32 | radius-control-sm (24) | 4 | Agents 24 icon buttons and select trigger 6; IDE palette row 6 | Second product at 6 (with Cursor web). |
| 73 | Kbd | 16 / 2 / 4 | IDE keycap 18, pad 3, corner 3, 11px, inset shadow — VS Code's | Unchanged from the VS Code capture. |
| 96, 97 | Table cell | block 6 · sides 8 | Keyboard Shortcuts: rows 24, cell sides 10, header 29 at 13 bold | Sides bracket Area (10 vs 8). |
| 86–90 | Card | — | Cursor Settings card: filled ink 4%, no border, corner 12, title and description 13/18 stacked, inset 12; IDE action card 60 tall, pad 10 × 12, corner 6 | First dense card evidence. |
| 114 | Tabs | underline | IDE panel tabs are 22 pills: pad 4 × 6, 4 apart, corner 4, selected ink 7%, label 12 medium | Not an underline tab; no change. |
| 6, 11 | Icon in controls and rows | 16 | 14 throughout the Agents window; 13 in 20 buttons; codicons 16 in the IDE | Cursor's new UI draws 14. |

## Effect on the open recommendations

- **R9 (popover 8): applied 2026-10-02 (owner).** Popover holds 12 at compact; Cursor and
  Figma inset 16, none 8.
- **R8 (dialog 12 / 12): applied 2026-10-02 (owner).** Dialog holds 16 at compact, corner 16
  (concentric, at the cap); Figma's Share dialog keeps 16 sides at corner 13.
- **R10 (separator): applied 2026-10-02 (owner)** — 6 / 1 / 6, compact 5 / 1 / 5.
- **R11 (one-rung spacing): keep.** The IDE's rows, buttons and tables agree with compact; the
  Agents window agrees with default. Neither argues for a different single rung.
- **Confirmed by first dense captures:** control-xs 20 / 6, label column 32, menu rows flush.
- **Tooltip:** the Agents window's tooltip is a light surface, ~30 tall, sides 10, corner 8,
  13/18 with 16 keycaps (`cursor-app--tooltip--open--light`, captured mid-fade at scale 0.98):
  Area's default geometry, not compact. The IDE hover (VS Code's) stays the compact reference.
- **Family pass (2026-10-02, after the owner applied R8/R9):**
  - Applied: Popover compact inset 12 (held) and corner 12 (concentric with its close), Dialog
    compact inset 16 / corner 16, standard
    dense xs corner 4.
  - Matched, no change: Card text column 12 (Cursor Settings card), Command palette search 40
    and row corner 4, menu rows flush, label column 32, settings-nav row corner 6
    (`radius-row` compact 6), Popover section gap 12 (Cursor body → action 12).
  - Bracketed, no change: Composer inset (Cursor 9 desktop, 12 web; Area 6) and gap (4, 12;
    Area 6), table cell sides (10; Area 8), radius-control-sm (Cursor 6, VS Code 4, Figma 5).
  - Kept by rule despite data: Card corner 18 (concentric with the Button; Cursor 12), Kbd 16
    (marks hold; VS Code and Cursor 18), chat text 14/20 (Cursor's Agents prose 15/24 belongs
    to its looser surface).
  - Applied (owner): menu separator 6 / 1 / 6, compact 5 / 1 / 5 (was 4 / 1 / 4).
- **Dark (2026-10-02, owner's yes):** Cursor switched to "Cursor Dark" (auto-detect off) for
  the session and restored afterwards (settings file back to its backup; both windows light).
  48 `cursor-app--*--dark` / `cursor-ide--*--dark` captures, the same surfaces as light minus
  the chat prose, thought header, select trigger and tooltip (not rendered or not hoverable in
  a background window). Geometry is identical to light. Paints:

  | Surface | Cursor Dark | Dark-pass range (ChatGPT · Notion · Figma) | Area |
  |---|---|---|---|
  | page | IDE #141414, editor #181818 | #0e0e0e · #191919 · #2c2c2c | #020202 (owner: near black) |
  | floating fill (menu, popover) | oklch 0.209 ≈ #181818; palette #141414 | #212121 · #252525 · #1e1e1e | #1d1d1d |
  | floating edge | 1px inset ring, white 12% (menu) / 8% (palette) ≈ #32 / #26 | 20% white · #383836 · 35% white 0.5px | #4b (`border-float`, neutral 650) |
  | lift | popover 0 3 8 + 0 2 5 at 12% black; palette 0 12 24 + 0 24 36 at 24% | 12–64% | `shadow-float` 20% |
  | row hover / selected | white 6% (sidebar, menu plate), 8% (composer chips), 12% (palette) | 10% · 5.5% white | `bg-component-hover` #33 on #1d |
  | composer | #212121 field, 1px white 12% | — | — |
  | settings card | white 4% fill, no edge | Notion 5% white fill, no edge; Figma 1px #444 | #333 edge, no shadow |
  | text | #f0f0f0 (oklch 0.955) | — | #eee |

  Read: Cursor is the darkest floating fill and the faintest edge measured; Area sits inside
  the range on fill, hover and lift, and at the bright end on the edge (ChatGPT's). No change.
  A filled, edgeless dark card now has two products (Notion, Cursor), but it is a different
  card variant from Area's outlined card.
- **Toast with actions (vscode.dev, isolated browser, 2026-10-02):** `vscode--toast-actions--open--dark`
  (the extension-recommendation toast; nothing installed): corner 8, 1px edge, icon 9 in and 7
  down, text buttons 26 tall at corner 4 ending 7 from the end and the bottom, message 13/22.
  Area compact: corner 8, icon 8 / 8, trailing control 4 in at corner 4 (concentric). **Matches;
  no change** (#62–64 now measured).
- **Code panel (Figma Dev Mode, 2026-10-02, values only):** Dev Mode is paywalled on the owner's
  plan, but its Code panel frame renders behind the upgrade dialog with placeholder code: well
  without fill or border, corner 5, code 8 from the top, line-number gutter 21 (4 each side),
  text column 29, code 11/18 Roboto Mono. Area compact code block: inset 8, corner 8. The 8
  inset agrees; corner follows Area's radius rule. No change; no capture saved (a locked view).
- **Chat code block (GitHub Copilot, 2026-10-02):** one throwaway chat, created with the owner's
  permission (Cursor web and Copilot had none). Corner 12, 1px edge, header 41 (16 / 24 sides),
  code 14/20.3, sides 24, top 12. Copilot is a 14px default-density UI, so this confirms Area's
  default corner 12 and says nothing new for compact. No change.
  `captures/code-block/github-copilot--chat-code-block--rest--light`.
- **Still unmeasured:** a chat code block in a dense product (VS Code's Markdown preview renders
  in a cross-origin webview the capture script cannot read; Cursor's chat needs an agent run),
  the Cursor dark tooltip.
