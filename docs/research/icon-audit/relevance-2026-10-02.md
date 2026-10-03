# Icon relevance audit

**Date:** 2026-10-02. **Scope:** whether each Area icon is broadly used, and which broadly used
concepts Area still lacks. This is research only: it changes no icon, generator or spec.
**Rule (owner, today):** build a concept only when at least 3 of the 5 reference systems have
it, and prefer 4 or more. **Data:** `area-map.json` beside this file, now covering all 599 names.

## Method

- **Area set.** 536 sources in `apps/docs/assets/area-icons-pilot/*.svg` (`explore/` excluded,
  four of them `data-alias-of`: padding-axis → padding-sides, subtract → minus, images → gallery,
  flow-wrap → grid) plus 63 derived turns and mirrors from `data-rotations`: **599 names**.
  `src/pilot-icons.tsx` lists 609 because it is stale. It still has the 10 batch-65 names the
  owner removed today (beach, brain-thinking, bug-play, chat-dashed, compass-check,
  cost-low/-medium/-high, folder-dashed, satellite) and has no sources for them, so they are not counted.
- **References.** Fluent `@fluentui/svg-icons` 1.1.341, Lucide `lucide-static` **1.50.0** (was
  1.49 in `coverage.md`), Phosphor core 2.1.1, Hugeicons free 4.3.5, and SF Symbols (names from
  `name_availability.plist`). All are loaded by `libs.py`.
- **Map.** The 513 entries from 2026-10-01 are kept. 86 new names were added. Most were the gap
  rows of `coverage.md`, so their candidates came from there. Each was re-searched in every
  library, which added 8 counterparts the first audit missed (Huge `Badge`, `BringToFront`,
  `Import`, `MousePointerClick`, `SpellCheck`; Fluent `position_to_front`; SF
  `long.text.page.and.pencil`; Lucide's new `broom`). Every entry under 3 was also re-searched by
  hand, and 6 old entries changed: circle-dot-dashed gets Huge `CircleDotDashed`, letter-spacing
  gets Fluent `font_space_tracking_out`, crystal-ball gets Fluent `predictions`, flow and
  flow-vertical get Lucide 1.50's `layout-arrow-right` and `layout-arrow-down` (the same drawing),
  and square-smile, labelled "Sticker", gets `sticker` in Fluent, Lucide, Phosphor and Hugeicons.
  The matching discipline is unchanged: names match by meaning, a modifier variant counts only
  when the library has the same modifier, and a script checked that every name in the map exists.
- **Usage.** `packages/react/src` and `apps/docs/src` were searched for each low-breadth name
  (Glyph names and `Pilot…Icon` imports). `demos/icons.tsx` only lists the catalogue, so it does
  not count as use.
- **Gaps.** The first audit's concept-key pass (synonyms, numbers and `.fill` dropped,
  order-insensitive) was re-run against the new map, and a manual sweep of product-UI concepts
  was added, because the key match misses cross-library modifier spellings. The same filter as
  before applies: no brands, flags, emoji sets, numbered series, food, animals, medical, sport,
  vehicles, weather extras, or variants Area covers under another name. The owner's 2026-10-02
  skips still stand: file-text, chat-text, contact and book-open are covered by document, chat,
  id-card and book. Every library name in the gap tables was checked by script.

## Counts

| | Fluent | Lucide | Phosphor | Hugeicons | SF Symbols |
|---|---|---|---|---|---|
| Area names with a counterpart (of 599) | 502 | 551 | 490 | 549 | 475 |

| Systems with a counterpart | 5 | 4 | 3 | 2 | 1 | 0 |
|---|---|---|---|---|---|---|
| Area names | 390 | 104 | 50 | 20 | 11 | 24 |

544 names (91%) pass the 3-of-5 rule, and 494 (82%) reach 4 or more. **55 names fall below 3.**
Of the 86 names added since 2026-10-01, 85 pass. file-diff is the exception: 2 by strict
matching, see the notes. Eleven new names sit exactly at 3: binary, cart-add, chart-gantt,
clipboard-check, folder-zip, goal, group, radar, remove-formatting, text-wrap and webhook.

## Niche: Area icons in fewer than 3 systems

"In use" means a real reference in `packages/react` or a docs demo, not the icon catalogue. The
recommendations are conservative, and the owner decides.

| Kind | Area icon | n | Systems | In use | Recommendation |
|---|---|---|---|---|---|
| Agent / bot cast | agent | 1 | Fluent `agents` | – | **keep**: owner-chosen product concept (agent cast, spec 2026-09-29) |
| | agent-circle, agent-square | 0 | – | – | **keep** with agent (container variants of the owner's mark) |
| | bot-agent, bot-automator, bot-builder, bot-designer, bot-generator, bot-guard, bot-lead, bot-researcher, bot-scholar | 0 | – (every library has only a plain bot) | – | **keep**: owner's persona cast |
| Component glyphs | corner | 2 | Lucide · Huge `square-round-corner` | BoxField, gallery | **keep**: component glyph (`glyphs.ts`) |
| | corner-top-right, corner-bottom-left, corner-bottom-right | 2 | same | – | **keep**: derived mirrors of corner, no extra source |
| | padding-side | 1 | Fluent `padding_left` | BoxField | **keep**: component glyph |
| | padding-axis | 0 | – | BoxField | **keep**: component glyph (alias of padding-sides) |
| | sides | 0 | – | BoxField | **keep**: component glyph |
| Figma inspector | padding-sides | 0 | – | – (its alias is used) | **keep**: source of padding-axis |
| | padding | 0 | – | – | keep only if the inspector demo needs all-sides padding; else **remove** |
| | padding-ends | 1 | Fluent `padding_top` | – | **merge**: a derived transpose of padding-sides with no source of its own; BoxField gets the same glyph by rotating padding-axis, so the name can go |
| | auto-layout, flow-free | 0 | – | – | keep as Figma auto-layout controls (owner batch 4); otherwise **remove** |
| | flow, flow-vertical | 1 | Lucide `layout-arrow-right` / `-down` | – | **keep** (Lucide 1.50 now draws the same thing) |
| | flow-wrap | 0 | – | – | **alias already** (of grid); keep the name, no drawing cost |
| | letter-spacing | 2 | Fluent `font_space_tracking_out` · Huge `LetterSpacing` | – | **keep**: typography inspector |
| | line-height | 1 | Fluent `text_line_spacing` | – | **keep**: typography inspector |
| | stroke-weight | 2 | Fluent `line_thickness` · SF `lineweight` | – | **keep**: design-tool stroke |
| | shadow, blur | 2 | Fluent + SF / Fluent + Huge | – | **keep**: Figma effects (gallery demo lists both effects) |
| | mask | 2 | Huge `LayerMask01` · SF `circle.square` | – | **keep**: Figma boolean/mask set |
| | zoom-fit | 2 | Fluent `zoom_fit` · SF | – | **keep**: canvas zoom set |
| | dots-four ("Components") | 2 | Fluent `grid_dots` · SF `circle.grid.2x2` | – | keep; the 3-system "component" concept (Lucide `component`, Phosphor `diamonds-four`, Huge `Component`) is the broader form if the owner wants to swap |
| | token | 0 | – | – | **remove** (or merge into variable): two rings read as disc/target, and no library has it |
| Debugger | breakpoint, stack-frame | 0 | – | – | **remove** unless a debugger surface is planned |
| | debug-step-over | 2 | Fluent `arrow_step_over` · Huge `StepOver` | – | same as breakpoint |
| Modifier variants | brain-off | 0 | – | – | **remove** (niche; brain stays) |
| | compass-dot | 0 | – | – | **remove**: merge into compass + bell-dot pattern if ever needed |
| | grid-sparkle | 0 | – | – | **remove** (niche; sparkle / chat-sparkle cover AI) |
| | corners-sparkle | 1 | Huge `AiScan` | – | **remove** (niche) |
| | scan-check | 1 | Fluent `scan_type_checkmark` | – | **remove** (niche) |
| | square-badge | 1 | SF `app.badge` | – | **remove** (niche; bell-dot / chat-dot carry the unread dot) |
| | mail-dot | 2 | Fluent `mail_unread` · SF `envelope.badge` | – | borderline; **keep** as unread mail in the dot family, or remove for strictness |
| | folder-check | 2 | Lucide · Huge | – | **remove** (niche) |
| | grid-plus | 2 | Lucide `grid-2x2-plus` · Huge | – | **remove** (niche) |
| | bookmark-remove | 2 | Lucide `bookmark-minus` · Huge | – | **merge**: libraries draw bookmark-off (4: Fluent, Lucide, Huge, SF); replace or drop |
| | search-off | 2 | Lucide `search-slash` · Huge | – | borderline; keep for empty states, or swap to search-alert (3) |
| | chat-code | 2 | Lucide `message-square-code` · Huge | – | borderline; keep only for a coding-assistant surface |
| | file-diff | 2 | Lucide `file-diff` · Huge `FileDiff` | – | borderline; 3 if Phosphor `git-diff` counts by concept; git-compare (4) is the broader icon |
| Objects / keys | crystal-ball | 1 | Fluent `predictions` | – | **remove** (niche) |
| | markdown | 2 | Fluent `markdown` · Phosphor `markdown-logo` | – | borderline; **remove** unless a Markdown mode toggle ships |
| | escape | 1 | SF `escape` | – (Kbd renders text, not this icon) | keep to complete the keycap set (command, option, shift, caps-lock, return, backspace), or remove |

**Tally (55).** Keep 31: the agent/bot cast (12), component glyphs (7) and inspector controls
(12). Conditional 2: auto-layout and flow-free stay only if the inspector set stays. Remove 14:
padding, token, breakpoint, stack-frame, debug-step-over, brain-off, compass-dot, grid-sparkle,
corners-sparkle, scan-check, square-badge, folder-check, grid-plus and crystal-ball. Merge 2:
padding-ends and bookmark-remove. Borderline 6: mail-dot, search-off, chat-code, file-diff,
markdown and escape.

## Gaps: concepts in 4 or 5 systems that Area lacks

Ranked by breadth, then usefulness. "Build next" marks the list to draw from first. Library
names are the counterparts to read.

| # | Concept | Status | Breadth | Library names to read | Use |
|---|---|---|---|---|---|
| 1 | password | **build next** | 5 | Fluent `password` · Lucide `rectangle-ellipsis` · Phosphor `password` · Huge `PasswordValidation` · SF `ellipsis.rectangle` | password field, credentials, show/hide secret |
| 2 | pencil-off | **build next** | 5 | Fluent `edit_off` · Lucide `pencil-off` · Phosphor `pencil-slash` · Huge `PencilOff` · SF `pencil.slash` | read-only, editing locked |
| 3 | file-download | **build next** | 5 | Fluent `document_arrow_down` · Lucide `file-down` · Phosphor `file-arrow-down` · Huge `FileDownload` · SF `arrow.down.doc` | download a file / export to file (pairs with file-export) |
| 4 | volume-low | **build next** | 5 | Fluent `speaker_1` · Lucide `volume-1` · Phosphor `speaker-low` · Huge `VolumeLow` · SF `speaker.wave.1` | volume level steps (volume = high, volume-off = mute) |
| 5 | zap-off | **build next** | 5 | Fluent `flash_off` · Lucide `zap-off` · Phosphor `lightning-slash` · Huge `ZapOff` · SF `bolt.slash` | automation / power-saving off, no boost |
| 6 | merge | **build next** | 5 | Fluent `merge` · Lucide `merge` · Phosphor `arrows-merge` · Huge `Merge` · SF `arrow.merge` | merge items / records (non-git) |
| 7 | duplicate | **build next** | 4 | Fluent `copy_add` · Lucide `copy-plus` · Huge `CopyPlus` · SF `plus.square.on.square` | duplicate item, page, layer |
| 8 | toggle-off | **build next** | 4 | Fluent `toggle_left` · Lucide `toggle-left` · Phosphor `toggle-left` · Huge `ToggleOff` | off state of toggle (feature disabled) |
| 9 | cloud-alert | **build next** | 4 | Fluent `cloud_error` · Lucide `cloud-alert` · Phosphor `cloud-warning` · Huge `CloudAlert` | sync failed, not saved |
| 10 | clock-alert | **build next** | 4 | Fluent `clock_warning` · Lucide `clock-alert` · Huge `ClockAlert` · SF `clock.badge.exclamationmark` | overdue, SLA breach, expired |
| 11 | shield-user | **build next** | 4 | Fluent `shield_person` · Lucide `shield-user` · Huge `ShieldUser` · SF `person.2.shield` | admin, roles and permissions |
| 12 | share-nodes | **build next** | 4 | Fluent `share_android` · Lucide `share-2` · Phosphor `share-network` · Huge `Share08` | share (network form; share is the box-arrow form) |
| 13 | location-off | **build next** | 4 | Fluent `location_off` · Lucide `map-pin-off` · Huge `MapPinOff` · SF `mappin.slash` | location sharing off |
| 14 | chat-off | **build next** | 4 | Fluent `chat_off` · Lucide `message-square-off` · Phosphor `chat-slash` · Huge `MessageSquareOff` | comments disabled, chat muted |
| 15 | git-fork | **build next** | 4 | Fluent `branch_fork` · Lucide `git-fork` · Phosphor `git-fork` · Huge `GitFork` | fork a repo / conversation branch |
| 16 | git-compare | **build next** | 4 | Fluent `branch_compare` · Lucide `git-compare` · Phosphor `git-diff` · Huge `GitCompare` | compare branches / versions |
| 17 | screen-share-off | **build next** | 4 | Fluent `share_screen_stop` · Lucide `screen-share-off` · Huge `ScreenShareOff` · SF `rectangle.on.rectangle.slash` | stop sharing in calls |
| 18 | mail-plus | **build next** | 4 | Fluent `mail_add` · Lucide `mail-plus` · Huge `MailAdd01` · SF `envelope.badge.plus` | new email, add address |
| 19 | bookmark-off | **build next** | 4 | Fluent `bookmark_off` · Lucide `bookmark-off` · Huge `BookmarkOff01` · SF `bookmark.slash` | unsave (the 4-system form of bookmark-remove) |
| 20 | heart-off | **build next** | 4 | Fluent `heart_off` · Lucide `heart-off` · Huge `HeartOff` · SF `heart.slash` | unlike, remove favourite (star-off exists) |
| 21 | flag-off | **build next** | 4 | Fluent `flag_off` · Lucide `flag-off` · Huge `FlagOff` · SF `flag.slash` | unflag, resolve report |
| 22 | person-x | **build next** | 4 | Fluent `person_delete` · Lucide `user-x` · Huge `UserX` · SF `person.fill.xmark` | remove / reject member (x form of person-remove) |
| 23 | file-cog | **build next** | 4 | Fluent `document_settings` · Lucide `file-cog` · Huge `FileCog` · SF `doc.badge.gearshape` | file / document settings, config file |
| 24 | shield-x | **build next** | 4 | Fluent `shield_dismiss` · Lucide `shield-x` · Huge `ShieldX` · SF `xmark.shield` | unprotected, blocked by policy |
| 25 | shield-plus | **build next** | 4 | Fluent `shield_add` · Lucide `shield-plus` · Phosphor `shield-plus` · Huge `ShieldPlus` | add protection / policy |
| 26 | bluetooth-off | **build next** | 4 | Fluent `bluetooth_disabled` · Lucide `bluetooth-off` · Phosphor `bluetooth-slash` · Huge `BluetoothOff` | bluetooth disabled |
| 27 | bluetooth-connected | **build next** | 4 | Fluent `bluetooth_connected` · Lucide `bluetooth-connected` · Phosphor `bluetooth-connected` · Huge `BluetoothConnected` | device paired |
| 28 | playlist | **build next** | 4 | Lucide `list-music` · Phosphor `playlist` · Huge `Playlist01` · SF `music.note.list` | playlist, queue |
| 29 | chart-bar-horizontal | **build next** | 4 | Fluent `data_bar_horizontal` · Lucide `chart-bar` · Phosphor `chart-bar-horizontal` · Huge `BarChartHorizontal` | horizontal bar chart |
| 30 | equal | **build next** | 4 | Lucide `equal` · Phosphor `equals` · Huge `Equal` · SF `equal` | formula / comparison operator (completes plus-minus, percent) |
| 31 | person-key | **build next** | 4 | Fluent `person_key` · Lucide `user-key` · Huge `UserKey` · SF `person.badge.key` | credentials, access keys per user |
| 32 | person-square | **build next** | 4 | Fluent `person_square` · Lucide `square-user` · Phosphor `user-square` · Huge `UserSquare` | profile picture placeholder, contact tile |
| 33 | book-plus | later | 4 | Fluent `book_add` · Lucide `book-plus` · Huge `BookPlus` · SF `book.badge.plus` | add to library / new notebook |
| 34 | arrow-up-right-circle | later | 4 | Fluent `arrow_circle_up_right` · Phosphor `arrow-circle-up-right` · Huge `CircleArrowUpRight` · SF `arrow.up.forward.circle` | diagonal circle arrows (the 4 diagonals complete the arrow-*-circle set) |
| 35 | toolbox | later | 4 | Fluent `toolbox` · Lucide `toolbox` · Phosphor `toolbox` · Huge `Toolbox` | tools, integrations |
| 36 | scroll | later | 4 | Lucide `scroll` · Phosphor `scroll` · Huge `Scroll` · SF `scroll` | terms, script, long document |
| 37 | gavel | later | 4 | Fluent `gavel` · Lucide `gavel` · Phosphor `gavel` · Huge `Gavel` | legal, auction, moderation ruling |

**Not counted as gaps.** These were dropped by the filter: pen-line (5, pencil covers it), pi (5),
balloon (5), circle-off (4, prohibited covers it), test-tube (4, flask covers it), sticker (4, now
mapped to square-smile), file-text, book-open and chat-text (owner skips). Also dropped are
medical, travel, animal, food, sport and household objects (pill, stethoscope, tent, bed,
backpack, bus, cat, fish, carrot, popcorn, volleyball, microwave, oven, refrigerator, fan, engine,
guitar, metronome, drone, joystick, flashlight, mailbox, recycle, clover, cross, rainbow,
tornado and others).

**Headings.** h1, h2 and h3 are in 4 systems (Fluent `text_header_1`, Lucide `heading-1`,
Phosphor `text-h-one`, Huge `Heading01`). They form a numbered series, so the rule excludes them,
but block-type menus in editors need them. Area's `heading` covers the generic case. This is
listed here for the owner to decide.

## Also worth building: 3-of-5 product-UI essentials


| Concept | Libraries | Why it is a product-UI essential |
|---|---|---|
| tags | 3: Fluent `tag_multiple` · Lucide `tags` · Huge `Tags` | multi-tag / labels manager |
| eye-closed | 3: Lucide `eye-closed` · Phosphor `eye-closed` · Huge `EyeClosed` | password hidden state (eye-off is 'hidden from view') |
| cloud-sync | 3: Fluent `cloud_sync` · Lucide `cloud-sync` · Huge `CloudSync` | syncing state beside cloud-check / cloud-off |
| folder-search | 3: Fluent `folder_search` · Lucide `folder-search` · Huge `FolderSearch` | search in folder |
| person-search | 3: Fluent `person_search` · Lucide `user-search` · Huge `UserSearch01` | find people, invite search |
| person-lock | 3: Fluent `person_lock` · Lucide `user-lock` · Huge `UserLock01` | private account, locked member |
| person-edit | 3: Fluent `person_edit` · Lucide `user-pen` · Huge `UserEdit01` | edit profile |
| shield-cog | 3: Fluent `shield_settings` · Lucide `shield-cog` · Huge `ShieldCog` | security settings |
| mail-check | 3: Fluent `mail_checkmark` · Lucide `mail-check` · Huge `MailCheck` | email verified / sent |
| calendar-off | 3: Lucide `calendar-off` · Phosphor `calendar-slash` · Huge `CalendarOff` | no availability, out of office |
| calendar-search | 3: Fluent `calendar_search` · Lucide `calendar-search` · Huge `CalendarSearch` | find a date |
| calendar-sync | 3: Fluent `calendar_sync` · Lucide `calendar-sync` · Huge `CalendarSync` | calendar connected |
| alarm-off | 3: Lucide `alarm-clock-off` · Huge `AlarmClockOff` · SF `alarm.slash` | snooze / reminder off |
| search-alert | 3: Lucide `search-alert` · Huge `SearchAlert` · SF `exclamationmark.magnifyingglass` | no results, search error |
| table-cells-merge | 3: Fluent `table_cells_merge` · Lucide `table-cells-merge` · Huge `TableCellsMerge` | table editor merge |
| table-cells-split | 3: Fluent `table_cells_split` · Lucide `table-cells-split` · Huge `TableCellsSplit` | table editor split |
| form | 3: Fluent `form` · Lucide `form` · Huge `Form` | forms, form builder |
| gif | 3: Fluent `gif` · Phosphor `gif` · Huge `Gif01` | GIF picker in composers |
| timeline | 3: Fluent `timeline` · Lucide `timeline` · Huge `Timeline` | activity timeline view |
| component | 3: Lucide `component` · Phosphor `diamonds-four` · Huge `Component` | design-system component (Figma); dots-four is Area's 'Components' today |
| hand-wave | 3: Fluent `hand_wave` · Phosphor `hand-waving` · SF `hand.wave` | raise hand / greet in calls |
| scan-qr | 3: Fluent `scan_qr_code` · Lucide `scan-qr-code` · Huge `QrCodeScan` | scan a QR code |
| wifi-low | 3: Lucide `wifi-low` · Phosphor `wifi-low` · Huge `WifiLow` | weak connection |
| webcam | 3: Lucide `webcam` · Phosphor `webcam` · Huge `Webcam` | camera device settings |
| file-x | 3: Lucide `file-x` · Phosphor `file-x` · Huge `FileX` | invalid / rejected file |
| globe-off | 3: Fluent `globe_off` · Lucide `globe-off` · Huge `GlobeOff` | offline, site unpublished |

## Notes on judgment calls

- **square-smile → sticker.** The Area label is "Sticker". Lucide's and Fluent's `sticker` are a
  rounded square with a smile, and Phosphor's and Hugeicons' are a peeled-corner square. This is
  mapped by meaning, which is how square-smile reaches 4. Its drawing has no peeled corner; a
  redraw toward the majority is optional.
- **file-diff** strictly counts 2. The first audit's queue counted Phosphor `git-diff` (two nodes
  and arrows). That is a git-compare drawing and has no file modifier, so this audit counts it
  toward git-compare instead.
- **share-nodes** uses Hugeicons `Share08`, which has three nodes and two links (read from its
  paths). SF's three-node symbol is already mapped to waypoints, so it is not reused here.
- **password** uses Hugeicons `PasswordValidation`, a field with dots plus a check badge. It is the
  nearest field-with-dots drawing; Hugeicons has no plain one.
- **shield-user** uses SF `person.2.shield` (two people), the closest SF form.
- **Off states.** heart-off, flag-off, bookmark-off, bluetooth-off, zap-off, pencil-off,
  location-off, chat-off and screen-share-off reuse Area's shared slash, so each is cheap. They
  rank by breadth, not by drawing effort.
- **Stale generated file.** `src/pilot-icons.tsx` and `PILOT_BATCHES` still carry the 10 removed
  batch-65 names. They disappear the next time `gen-pilot-icons.mjs` runs; this audit did not
  run it.
