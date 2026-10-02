# Icon coverage audit

**Date:** 2026-10-01. **Scope:** coverage only (which concepts Area has, lacks or names
differently); drawing quality is audited separately. **Data:** `area-map.json` beside this file.

## Method and counts

- **Area set.** 451 sources in `apps/docs/assets/area-icons-pilot/*.svg` (explore/ and status
  marks excluded) plus 62 derived turns and mirrors from `data-rotations`, the same expansion
  `scripts/gen-pilot-icons.mjs` performs: **513 names**, identical to the `name:` list in
  `src/pilot-icons.tsx`.
- **References.** Fluent `@fluentui/svg-icons` 1.1.341 (2,925 regular stems); Lucide
  `lucide-static` 1.49 (1,857 canonical names from `tags.json`; aliases such as `trash-2`,
  `history`, `smile` resolved to their canonical names); Phosphor core 2.1.1 (1,512); Hugeicons
  free 4.3.5 (6,067 export names); SF Symbols (name list from `name_availability.plist`,
  names only).
- **Matching.** A script proposed candidates by token match with synonyms (trash ↔ delete,
  settings ↔ gear/gearshape, search ↔ magnifying-glass, add ↔ plus, dismiss ↔ x/xmark,
  person ↔ user …); every row was then chosen by hand by meaning (after rendering the
  ambiguous Area drawings), and every name in the map was checked against the library
  files. A key is omitted when the library has no counterpart for the concept. Modifier
  variants (chat-code, folder-check, panel-left-close …) are mapped only when the library has
  the same modifier, never to the bare base icon, so the map does not overstate coverage.
  Where Hugeicons has both a native name and a Lucide-style alias, the native one is used
  (`Delete02`, `Settings01`, `Favourite`, `Sent`).

| | Fluent | Lucide | Phosphor | Hugeicons | SF Symbols |
|---|---|---|---|---|---|
| Area names with a counterpart (of 513) | 430 | 462 | 421 | 461 | 411 |

By breadth: 348 Area names have a counterpart in all five libraries, 71 in four, 38 in
three, 19 in two, 9 in one and 28 in none.

**Gap search.** Every library name was reduced to a concept key (same synonyms, numbers and
`.fill` dropped) and keys present in 3 or more libraries were collected: 733 concepts, 356 of
them not reached by any Area mapping. That list (plus a manual sweep of common product-UI
concepts the key match misses, such as duplicate, paste, add-to-cart) was filtered to what a
product UI kit plausibly needs: brands, flags, emoji sets, numbered or lettered series, food,
animals, medical, sport and vehicle objects, weather extras and variants Area already covers
under another name were dropped. Each kept row was re-verified by name in each library and
needs at least 3 of the 5. Result: **81 new concepts (40 priority)** plus **9 concepts already
queued** in `docs/research/icon-inventory.md`.

## Gaps

"priority" marks the ~40 most useful for a product UI kit; "new" are plausible but secondary.
Library names are the counterparts to read when drawing.

**Priority list:** corner-down-right, navigation, chevrons-first-last, mouse-pointer-click,
import · signature, duplicate, text-color, group, bring-to-front, remove-formatting ·
file-text, clipboard-check, clipboard-paste, list-tree, workflow, list-plus, file-zip,
cloud-check, archive-restore · headset, contact, person-settings, bell-ring, chat-text,
life-buoy · image-plus · toggle, radio-button, accessibility, shield-alert, octagon-alert,
square-x, more-circle · star-half · cart-add, discount, currency-euro · book-open,
calendar-clock.

### Navigation & arrows

| Concept | Status | Libraries | Use |
|---|---|---|---|
| corner-down-right | **priority** | 5: Fluent `arrow_turn_down_right` · Lucide `corner-down-right` · Phosphor `arrow-elbow-down-right` · Huge `CornerDownRight` · SF `arrow.turn.down.right` | sub-item, reply thread, nested row |
| navigation | **priority** | 5: Fluent `location_arrow` · Lucide `navigation` · Phosphor `navigation-arrow` · Huge `Navigation03` · SF `location` | current location, directions, send location |
| chevrons-first-last | **priority** | 4: Fluent `arrow_previous` · Lucide `chevron-first` · Phosphor `caret-line-left` · SF `chevron.left.to.line` | first / last page in pagination, jump to start or end |
| mouse-pointer-click | **priority** | 4: Fluent `cursor_click` · Lucide `mouse-pointer-click` · Phosphor `cursor-click` · SF `cursorarrow.click` | click action, interaction step, tutorials |
| import | **priority** | 3: Fluent `arrow_import` · Lucide `import` · SF `square.and.arrow.down` | import data, bring in a file |
| exit-door | new | 5: Fluent `door_arrow_right` · Lucide `door-open` · Phosphor `door-open` · Huge `DoorOpen` · SF `door.left.hand.open` | leave a room / workspace, exit |
| locate | new | 5: Fluent `location_target_square` · Lucide `locate-fixed` · Phosphor `gps-fix` · Huge `Gps01` · SF `location.viewfinder` | centre map on me, find my location |

### Editing & text

| Concept | Status | Libraries | Use |
|---|---|---|---|
| signature | **priority** | 5: Fluent `signature` · Lucide `signature` · Phosphor `signature` · Huge `Signature` · SF `signature` | e-signature, sign a document |
| duplicate | **priority** | 4: Fluent `copy_add` · Lucide `copy-plus` · Huge `CopyPlus` · SF `plus.square.on.square` | duplicate an item, page or layer |
| text-color | **priority** | 4: Fluent `text_color` · Lucide `baseline` · Phosphor `text-a-underline` · Huge `TextColor` | text colour in a formatting toolbar |
| bring-to-front | **priority** | 3: Lucide `bring-to-front` · Huge `SendToBack` · SF `square.3.layers.3d.top.filled` | arrange order: bring forward / send back |
| group | **priority** | 3: Fluent `group` · Lucide `group` · Huge `Group01` | group / ungroup selected objects |
| remove-formatting | **priority** | 3: Fluent `text_clear_formatting` · Lucide `remove-formatting` · Huge `TextClear` | clear formatting in a rich-text toolbar |
| lasso | new | 5: Fluent `lasso` · Lucide `lasso` · Phosphor `lasso` · Huge `Lasso` · SF `lasso` | lasso selection in canvas tools |
| pilcrow | new | 5: Fluent `text_paragraph` · Lucide `pilcrow` · Phosphor `paragraph` · Huge `Paragraph` · SF `paragraphsign` | paragraph marks, block type, show formatting |
| insert-row | new | 4: Fluent `table_insert_row` · Lucide `between-horizontal-start` · Phosphor `rows-plus-bottom` · Huge `RowInsert` | insert row / column in tables |
| spell-check | new | 3: Fluent `text_proofing_tools` · Lucide `spell-check` · SF `textformat.abc.dottedunderline` | spelling and grammar checks |
| text-wrap | new | 3: Fluent `text_wrap` · Lucide `text-wrap` · Huge `TextWrap` | wrap / no-wrap toggle in editors and tables |

### Files & data

| Concept | Status | Libraries | Use |
|---|---|---|---|
| cloud-check | **priority** | 5: Fluent `cloud_checkmark` · Lucide `cloud-check` · Phosphor `cloud-check` · Huge `CloudSavingDone01` · SF `checkmark.icloud` | saved to cloud, synced |
| file-text | **priority** | 5: Fluent `document_text` · Lucide `file-text` · Phosphor `file-text` · Huge `FileText` · SF `doc.text` | text document, notes, docs page (document with lines) |
| file-zip | **priority** | 5: Fluent `folder_zip` · Lucide `file-archive` · Phosphor `file-zip` · Huge `FileZip` · SF `doc.zipper` | zip archive, compressed download |
| list-plus | **priority** | 5: Fluent `text_bullet_list_add` · Lucide `list-plus` · Phosphor `list-plus` · Huge `ListPlus` · SF `text.badge.plus` | add to list / playlist / queue |
| list-tree | **priority** | 5: Fluent `text_bullet_list_tree` · Lucide `list-tree` · Phosphor `tree-view` · Huge `ListTree` · SF `list.bullet.indent` | file tree, outline, hierarchy view |
| workflow | **priority** | 5: Fluent `flowchart` · Lucide `workflow` · Phosphor `flow-arrow` · Huge `WorkflowSquare01` · SF `flowchart` | automations, flows, pipelines |
| archive-restore | **priority** | 4: Fluent `archive_arrow_back` · Lucide `archive-restore` · Huge `ArchiveRestore` · SF `arrow.up.bin` | restore from archive or trash |
| clipboard-paste | **priority** | 4: Fluent `clipboard_paste` · Lucide `clipboard-paste` · Huge `ClipboardPaste` · SF `doc.on.clipboard` | paste action |
| clipboard-check | **priority** | 3: Fluent `clipboard_checkmark` · Lucide `clipboard-check` · Huge `ClipboardCheck` | copied / done confirmation after copy, checked task |
| file-search | new | 5: Fluent `document_search` · Lucide `file-search` · Phosphor `file-magnifying-glass` · Huge `FileSearch` · SF `doc.text.magnifyingglass` | search in files, find document |
| file-spreadsheet | new | 5: Fluent `document_table` · Lucide `file-spreadsheet` · Phosphor `file-xls` · Huge `Xls01` · SF `tablecells` | spreadsheet / CSV file |
| rss | new | 5: Fluent `rss` · Lucide `rss` · Phosphor `rss` · Huge `Rss` · SF `dot.radiowaves.up.forward` | feeds, subscriptions |
| file-pen | new | 4: Fluent `document_edit` · Lucide `file-pen` · Phosphor `note-pencil` · Huge `FileEdit` | draft, edit document |
| folder-lock | new | 4: Lucide `folder-lock` · Phosphor `folder-lock` · Huge `FolderLock` · SF `lock.rectangle.stack` | private folder |
| chart-gantt | new | 3: Fluent `gantt_chart` · Lucide `chart-gantt` · Huge `ChartGantt` | timeline / project schedule view |
| webhook | new | 3: Lucide `webhook` · Phosphor `webhooks-logo` · Huge `Webhook` | webhooks and integrations |

### Communication

| Concept | Status | Libraries | Use |
|---|---|---|---|
| bell-ring | **priority** | 5: Fluent `alert_on` · Lucide `bell-ring` · Phosphor `bell-ringing` · Huge `BellRing` · SF `bell.and.waves.left.and.right` | ringing / active notification, reminders on |
| chat-text | **priority** | 5: Fluent `comment_text` · Lucide `message-square-text` · Phosphor `chat-text` · Huge `MessageSquareText` · SF `text.bubble` | comment / message with text lines |
| contact | **priority** | 5: Fluent `contact_card` · Lucide `contact` · Phosphor `address-book` · Huge `Contact01` · SF `person.crop.rectangle` | contacts / address book |
| headset | **priority** | 5: Fluent `headset` · Lucide `headset` · Phosphor `headset` · Huge `CustomerSupport` · SF `headset` | customer support, help desk, call centre |
| person-settings | **priority** | 5: Fluent `person_settings` · Lucide `user-cog` · Phosphor `user-gear` · Huge `UserSettings01` · SF `person.badge.gearshape` | account settings, manage member |
| life-buoy | **priority** | 4: Lucide `life-buoy` · Phosphor `lifebuoy` · Huge `Lifebuoy` · SF `lifepreserver` | help centre, support resources |
| voicemail | new | 5: Fluent `voicemail` · Lucide `voicemail` · Phosphor `voicemail` · Huge `Voicemail` · SF `recordingtape` | voicemail |
| phone-missed | new | 4: Fluent `call_missed` · Lucide `phone-missed` · Phosphor `phone-x` · Huge `CallMissed01` | missed call |

### Media

| Concept | Status | Libraries | Use |
|---|---|---|---|
| image-plus | **priority** | 4: Fluent `image_add` · Lucide `image-plus` · Huge `ImageAdd01` · SF `photo.badge.plus` | add / upload image |
| broadcast | new | 5: Fluent `live` · Lucide `radio-tower` · Phosphor `broadcast` · Huge `RadioTower` · SF `antenna.radiowaves.left.and.right` | live, broadcast, go live |
| cast | new | 5: Fluent `cast` · Lucide `cast` · Phosphor `screencast` · Huge `Cast` · SF `airplayvideo` | cast to a screen |
| image-off | new | 5: Fluent `image_off` · Lucide `image-off` · Phosphor `image-broken` · Huge `ImageNotFound01` · SF `photo.badge.exclamationmark` | broken or missing image placeholder |
| radio | new | 4: Lucide `radio` · Phosphor `radio` · Huge `Radio` · SF `radio` | radio / live audio |

### Devices & system

| Concept | Status | Libraries | Use |
|---|---|---|---|
| accessibility | **priority** | 5: Fluent `accessibility` · Lucide `accessibility` · Phosphor `person-arms-spread` · Huge `Accessibility` · SF `accessibility` | accessibility settings and statements |
| more-circle | **priority** | 5: Fluent `more_circle` · Lucide `circle-ellipsis` · Phosphor `dots-three-circle` · Huge `MoreHorizontalCircle01` · SF `ellipsis.circle` | more options in a ring (completes circle family) |
| radio-button | **priority** | 5: Fluent `radio_button` · Lucide `circle-dot` · Phosphor `radio-button` · Huge `RadioButton` · SF `circle.inset.filled` | single-choice control icon (form builder) |
| shield-alert | **priority** | 5: Fluent `shield_error` · Lucide `shield-alert` · Phosphor `shield-warning` · Huge `ShieldAlert` · SF `exclamationmark.shield` | security warning, risk detected |
| square-x | **priority** | 5: Fluent `dismiss_square` · Lucide `square-x` · Phosphor `x-square` · Huge `CancelSquare` · SF `xmark.square` | close inside a square container (completes square family) |
| toggle | **priority** | 5: Fluent `toggle_right` · Lucide `toggle-right` · Phosphor `toggle-right` · Huge `ToggleOn` · SF `switch.2` | switch / feature toggle in settings and filters |
| octagon-alert | **priority** | 4: Lucide `octagon-alert` · Phosphor `warning-octagon` · Huge `OctagonAlert` · SF `exclamationmark.octagon` | critical error / stop alert |
| battery-charging | new | 5: Fluent `battery_charge` · Lucide `battery-charging` · Phosphor `battery-charging` · Huge `BatteryCharging01` · SF `battery.100.bolt` | charging state |
| battery-low | new | 5: Fluent `battery_warning` · Lucide `battery-low` · Phosphor `battery-low` · Huge `BatteryLow` · SF `battery.25` | low battery |
| brightness | new | 5: Fluent `brightness_high` · Lucide `sun-dim` · Phosphor `sun-dim` · Huge `SunDim` · SF `sun.min` | display brightness |
| devices | new | 5: Fluent `phone_desktop` · Lucide `monitor-smartphone` · Phosphor `devices` · Huge `ComputerPhoneSync` · SF `macbook.and.iphone` | responsive preview, multiple devices |
| gamepad | new | 5: Fluent `games` · Lucide `gamepad-2` · Phosphor `game-controller` · Huge `GameController01` · SF `gamecontroller` | gaming, controller |
| signal | new | 5: Fluent `cellular_data_1` · Lucide `signal` · Phosphor `cell-signal-full` · Huge `Signal` · SF `cellularbars` | connection / cellular signal strength |
| usb | new | 5: Fluent `usb_stick` · Lucide `usb` · Phosphor `usb` · Huge `Usb` · SF `cable.connector` | USB device / connector |
| scan-face | new | 4: Lucide `scan-face` · Phosphor `scan-smiley` · Huge `FaceId` · SF `faceid` | face ID, face recognition sign-in |
| shield-off | new | 4: Lucide `shield-off` · Phosphor `shield-slash` · Huge `ShieldOff` · SF `shield.slash` | protection disabled |

### People & status

| Concept | Status | Libraries | Use |
|---|---|---|---|
| star-half | **priority** | 5: Fluent `star_half` · Lucide `star-half` · Phosphor `star-half` · Huge `StarHalf` · SF `star.leadinghalf.filled` | half-star ratings |
| badge | new | 4: Fluent `badge` · Lucide `badge` · Phosphor `seal` · SF `seal` | status badge / label shape |
| handshake | new | 4: Fluent `handshake` · Lucide `handshake` · Phosphor `handshake` · Huge `Agreement01` | deals, partners, agreement |
| meh | new | 4: Fluent `emoji_meh` · Lucide `face-neutral` · Phosphor `smiley-meh` · Huge `Meh` | neutral rating / feedback faces |

### Commerce

| Concept | Status | Libraries | Use |
|---|---|---|---|
| currency-euro | **priority** | 4: Lucide `euro` · Phosphor `currency-eur` · Huge `Euro` · SF `eurosign` | non-dollar currencies (euro, pound, yen) |
| discount | **priority** | 4: Fluent `tag_percent` · Lucide `badge-percent` · Phosphor `seal-percent` · Huge `Discount` | discount, sale, promo code |
| cart-add | **priority** | 3: Lucide `shopping-cart-plus` · Huge `ShoppingCartAdd01` · SF `cart.badge.plus` | add to cart |
| basket | new | 4: Lucide `shopping-basket` · Phosphor `basket` · Huge `ShoppingBasket01` · SF `basket` | shopping basket (grocery-style cart) |
| piggy-bank | new | 4: Fluent `savings` · Lucide `piggy-bank` · Phosphor `piggy-bank` · Huge `PiggyBank` | savings, budget |
| scale | new | 4: Fluent `scales` · Lucide `scale` · Phosphor `scales` · Huge `BalanceScale` | legal, compare, balance |

### Objects & misc

| Concept | Status | Libraries | Use |
|---|---|---|---|
| book-open | **priority** | 5: Fluent `book_open` · Lucide `book-open` · Phosphor `book-open` · Huge `BookOpen01` · SF `book` | docs, reading, knowledge base, guides |
| calendar-clock | **priority** | 4: Fluent `calendar_clock` · Lucide `calendar-clock` · Huge `CalendarClock` · SF `calendar.badge.clock` | scheduled, schedule a send |
| cloud-snow | new | 5: Fluent `weather_snow` · Lucide `cloud-snow` · Phosphor `cloud-snow` · Huge `CloudSnow` · SF `cloud.snow` | weather set: snow, fog, night |
| dice | new | 4: Lucide `dices` · Phosphor `dice-five` · Huge `Dice` · SF `dice` | random, shuffle a value |
| hammer | new | 4: Lucide `hammer` · Phosphor `hammer` · Huge `Hammer` · SF `hammer` | build, construct, tools |
| notebook | new | 4: Fluent `notebook` · Lucide `notebook` · Phosphor `notebook` · Huge `Notebook` | notebooks, journals |
| party-popper | new | 4: Lucide `party-popper` · Phosphor `confetti` · Huge `PartyPopper` · SF `party.popper` | celebration, success, onboarding done |
| pentagon-octagon | new | 4: Lucide `pentagon` · Phosphor `pentagon` · Huge `Pentagon` · SF `pentagon` | more shape primitives for shape pickers |

### Already queued in icon-inventory.md

| Concept | Status | Libraries | Use |
|---|---|---|---|
| binary | queued (batch 51) | 3: Lucide `binary` · Phosphor `binary` · Huge `Binary` | binary data, bits |
| broom | queued (batch 55) | 4: Fluent `broom` · Lucide `brush-cleaning` · Phosphor `broom` · Huge `BrushCleaning` | clean up, clear all |
| radar | queued (batch 55) | 3: Fluent `radar` · Lucide `radar` · Huge `Radar01` | scan, monitor |
| goal | queued (batch 55) | 3: Fluent `target_arrow` · Lucide `goal` · Huge `Goal` | goals, objectives |
| chat-question | queued (batch 54) | 4: Fluent `chat_help` · Lucide `message-circle-question-mark` · Huge `BubbleChatQuestion` · SF `questionmark.bubble` | help, FAQ |
| plug-off | queued (batch 47) | 4: Fluent `plug_disconnected` · Lucide `unplug` · Phosphor `plugs` · Huge `Unplug` | disconnected |
| file-diff | queued (batch 50) | 3: Lucide `file-diff` · Phosphor `git-diff` · Huge `FileDiff` | changes, review, diff |
| brain-thinking | queued (batch 48) | 4: Fluent `brain_circuit` · Lucide `brain-cog` · Huge `BrainCog` · SF `brain.head.profile` | thinking, reasoning in progress |
| deck-chair | queued (later) | 5: Fluent `beach` · Lucide `tree-palm` · Phosphor `tree-palm` · Huge `TreePalm` · SF `beach.umbrella` | away, vacation |

Not counted as gaps (fewer than 3 libraries after checking): chat-dashed, bug-play,
satellite and folder-dashed from the queue; podcast, person-shield and find-and-replace from
the sweep. Families Area deliberately covers with one drawing (bell-dot for ringing variants,
person-remove for user-x) are not listed.

## Unique: Area icons with a counterpart in fewer than 2 libraries

| Area icons | Counterparts | Note |
|---|---|---|
| agent, agent-circle, agent-square | Fluent `agents` (agent only) | Area's own agent mark; expected |
| bot-agent, bot-automator, bot-builder, bot-designer, bot-generator, bot-guard, bot-lead, bot-researcher, bot-scholar | none (each library has only a plain `bot`/`robot`, mapped from Area `bot`) | persona cast; expected |
| flow, flow-vertical, flow-free, flow-wrap, auto-layout | none | Figma auto-layout direction set |
| padding, padding-axis, padding-sides; padding-side, padding-ends | none; Fluent `padding_left`, `padding_top` | Figma padding controls |
| sides, token | none | design-tool properties; `token` (concentric rings) is ambiguous, check its meaning and label |
| letter-spacing, line-height | Hugeicons `LetterSpacing`; Fluent `text_line_spacing` | typography controls; fine |
| breakpoint, stack-frame | none | debugger set (debug-step-over has Fluent and Hugeicons counterparts); fine |
| brain-off, compass-dot, square-smile, grid-sparkle, corners-sparkle, square-badge, scan-check | none or one (Hugeicons `AiScan`, SF `app.badge`, Fluent `scan_type_checkmark`) | Area modifier variants with no direct equivalent; fine if the products use them |
| crystal-ball | none | worth checking: "Predictions" has no reference anywhere |
| escape | SF `escape` | keyboard key glyph; fine |

## Naming: Area names that differ from the majority convention

Listed only; no renames proposed here. "Majority" counts Fluent, Lucide, Phosphor, Hugeicons and SF.

| Area name | Majority form | Why it is worth a look |
|---|---|---|
| `pin` (map pin) vs `pushpin`, `unpin` | Lucide/Fluent/Phosphor/SF: `pin` = pushpin, `map-pin`/`mappin`/`location` = location | Area's `pin` means the opposite of the majority, and `unpin` is the slashed **pushpin**, so `pin`/`unpin` are not a pair |
| `phone` (mobile device) vs `call` (handset) | Lucide/Phosphor/SF `phone` = handset; device is `smartphone`/`device-mobile`/`iphone` | likely to be picked for "call" by people used to other sets (Fluent shares Area's usage) |
| `minus` and `subtract` | one `minus` | the two sources are byte-identical drawings; plus `boolean-subtract` exists, so `subtract` reads as the boolean op |
| `document`, `document-add/-check/-remove` vs `file-code/-export/-image/-lock`, `files` | `file` (Lucide, Phosphor, Hugeicons) | Area mixes `document-*` and `file-*` for the same object |
| `*-add` / `*-remove` (bookmark, calendar, chat, document, filter, folder, person) vs `grid-plus`, `square-plus`, `smile-plus`, `square-minus` | `-plus` / `-minus` (Lucide, Phosphor, SF `badge.plus`) | two modifier conventions inside Area (Fluent's add/remove and Lucide's plus/minus) |
| `add`, `add-circle`, `remove-circle` | `plus`, `circle-plus`/`plus-circle`, `circle-minus` | Fluent words; Area's own `square-plus`/`square-minus` use plus/minus |
| `add-circle`, `arrow-up-circle`, `chevron-down-circle`, `pause-circle` … vs `square-plus`, `square-arrow-up` … | one order: Lucide puts the container first for both (`circle-plus`, `square-plus`) | Area puts `circle` last and `square` first |
| `dismiss` | `x` / `xmark` / `close` | Fluent-only word |
| `bar-chart`, `pie-chart` vs `chart`, `chart-scatter` | `chart-bar`, `chart-pie` (Lucide, Phosphor, SF) | Area mixes `x-chart` and `chart-x` |
| `list` (justified lines) vs `menu`, `list-bullet` | `list` = bulleted list (Lucide); justified lines = `text-align-justify`/`text.justify` | the plain name points to the less common drawing |
| `grip` (two bars) | `grip` = dot grid (Lucide, Hugeicons); two bars = `equal`/`re_order` | name suggests dots, as `grip-vertical`/`grip-horizontal` are |
| `options` (horizontal sliders) vs `sliders` (vertical) | `sliders-horizontal` / `sliders-vertical`, SF `slider.horizontal.3` | one concept under two unrelated names |
| `open` (external link) | `external-link`, `arrow-square-out`, `arrow.up.forward.square` | `open` collides with `folder-open`, `mail-open`, `panel-left-open` |
| `corner` (radius) vs `corners` (scan frame) | `square-round-corner` vs `scan` / `frame-corners` / `viewfinder` | near-identical names for unrelated concepts |
| `home`, `person`, `people` | `house` (Lucide, Phosphor, SF); `user`/`users` (Lucide, Phosphor, Hugeicons) | 2 vs 3 split; fine to keep, worth an alias in search |
| `chip` | `cpu` (Lucide, Phosphor, SF) | search alias |
| `attach`, `color`, `help`, `prohibited`, `more-horizontal` | `paperclip`, `droplet`/`drop`, `circle-help`/`question`, `ban`/`prohibit`, `ellipsis` | Fluent words; search aliases cover them |
| `frame` (Figma # frame) | picture frame / crop frame in Fluent and Phosphor | ambiguous outside design tools |
