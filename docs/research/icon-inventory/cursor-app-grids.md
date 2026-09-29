<!-- Catalogue of the owner's Cursor screenshots (2026-09-28): the Cursor Icons app grid, the 16/24px outline and filled sheet, and the migration grid (the older codicon-style set). Positions refer to zoomed tiles of those screenshots, which are not stored in the repository. Summarised in ../icon-inventory.md. -->

# Cursor icon inventory B — images 11, 14, 10 vs Area

Catalogued from zoomed crops of `images/11.png` (Cursor Icons app, 13 visible rows × 20), `images/14.png`
(Cursor: Icons sheet, 5 bands × 17 columns, one icon per column shown outline/filled at 16 and 24px) and
`images/10.png` (Cursor Icons Migration, "Showing Before" — the older codicon-style set, 11 full rows × 17).
Read-only research; nothing in the repository was changed.

**Position** — `rXcY a.b (grid …)`: the tile (`tiles/imgNN-rXcY.png`, left→right then top→bottom), the
row.column inside that tile, and the position in the whole grid. img11 tiles hold rows 1–4, 5–8, 9–13 and
columns 1–10 / 11–20 (row 9 is split across r1/r2 and is counted in r2). img10 tiles hold rows 1–4, 5–8, 9–11
and columns 1–8 / 9–17 (row 8 and column 9 are split; counted in r1 and c1). img14 tiles hold bands A–B / C–E
and columns 1–8 / 9–17.

**Status** — `exists`: Area draws the same object for the same meaning (a different drawing of it, such as
a closed rather than open book, is noted in *what it shows*). `variant`: Area has the base and Cursor adds a
modifier, turn or repeat (named). `missing`: nothing in Area. Every Area, Lucide and Fluent name below was
checked against `area-icons.txt`, `lucide-tags.json` and the Fluent icon folder (16px cut, else 20px).

**Caveats** — names ending in `?` are guesses from the shape. Cursor's own names are not visible (the
"Names" toggle is off), so concepts are descriptive. img10 cells are tinted: *green* cells appear kept in the
migration and *pink* cells are probably the ones marked Removed (the colour is sampled, the meaning inferred).
Partially visible rows at the image edges are included only where the glyph is legible (img11 row 13, img14
bands A and E); img10's cut 12th row and img14's cut edge columns are skipped.

## Counts

| image | icons | exists | variant | missing |
|---|---|---|---|---|
| 11 | 260 | 108 | 90 | 62 |
| 14 | 85 | 62 | 16 | 7 |
| 10 | 187 | 88 | 64 | 35 |
| all | 532 | 258 | 170 | 104 |

Deduplicated across the three images: **75 missing concepts** (2 of them brand marks:
Cursor's logo and GitHub Copilot) and **128 distinct variants** (base + modifier).

## Image 11 — Cursor Icons app grid

260 icons: 108 exists, 90 variant, 62 missing.

| image | tile row.col position | concept | what it shows | area | status | lucide | fluent | uses |
|---|---|---|---|---|---|---|---|---|
| 11 | r0c0 1.1 (g1.1) | navigation-pointer | notched arrowhead pointer aimed up-right (Cursor's agent/cursor mark?); Area send is a similar notched kite pointing right | — | missing | navigation | location_arrow_16 | agent, cursor, locate |
| 11 | r0c0 1.2 (g1.2) | navigation-pointer-circle | the same pointer inside a circle | — | missing | navigation | location_arrow_16 | agent badge, locate |
| 11 | r0c0 1.3 (g1.3) | navigation-pointer-square | the same pointer inside a rounded square | — | missing | navigation | location_arrow_16 | agent tile, app badge |
| 11 | r0c0 1.4 (g1.4) | navigation-pointer-double? | pointer with a parallel stroke trailing behind it | — | missing | navigation | location_arrow_16 | fast or auto agent? |
| 11 | r0c0 1.5 (g1.5) | navigation-pointer-grid? | four small pointers in a 2x2 grid | — | missing | navigation | location_arrow_16 | multiple agents? |
| 11 | r0c0 1.6 (g1.6) | alarm | alarm clock with bells and feet | alarm | exists | alarm-clock | clock_alarm_16 | alarms, reminders |
| 11 | r0c0 1.7 (g1.7) | archive | box with lid and handle slot | archive | exists | archive | archive_16 | archive items |
| 11 | r0c0 1.8 (g1.8) | dome-flag? | semicircular dome with a centre door tick and a pennant on top | — | missing | dome | flag_16 | landmark, goal reached? |
| 11 | r0c0 1.9 (g1.9) | arrow-big-down | outlined block arrow pointing down | shift | variant: rotated 180° | arrow-big-down | keyboard_shift_16 | move down, emphasis |
| 11 | r0c0 1.10 (g1.10) | arrow-big-left | outlined block arrow pointing left | shift | variant: rotated 90° | arrow-big-left | keyboard_shift_16 | back, previous |
| 11 | r0c1 1.1 (g1.11) | arrow-big-down-dash | block arrow down with a bar above it | shift | variant: rotated 180° + bar | arrow-big-down-dash | keyboard_shift_uppercase_16 | move to bottom |
| 11 | r0c1 1.2 (g1.12) | arrow-big-left-dash | block arrow left with a bar at its tail | shift | variant: rotated 90° + bar | arrow-big-left-dash | keyboard_shift_uppercase_16 | move to start |
| 11 | r0c1 1.3 (g1.13) | arrow-big-right-dash | block arrow right with a bar at its tail | shift | variant: rotated 90° + bar | arrow-big-right-dash | keyboard_shift_uppercase_16 | move to end |
| 11 | r0c1 1.4 (g1.14) | arrow-big-up-dash | block arrow up with a bar below (caps lock) | shift | variant: + bar below | arrow-big-up-dash | keyboard_shift_uppercase_16 | caps lock key |
| 11 | r0c1 1.5 (g1.15) | arrow-big-right | outlined block arrow pointing right | shift | variant: rotated 90° | arrow-big-right | keyboard_shift_16 | forward, next |
| 11 | r0c1 1.6 (g1.16) | arrow-big-up | outlined block arrow pointing up | shift | exists | arrow-big-up | keyboard_shift_16 | shift key, upvote |
| 11 | r0c1 1.7 (g1.17) | arrow-down-from-bracket | arrow pointing down out of an open bracket at the top | upload | variant: rotated 180° | arrow-down-from-line | arrow_between_down_20 | pull down, unstash |
| 11 | r0c1 1.8 (g1.18) | arrow-left-from-bracket | arrow pointing left away from a bracket on the right | log-out | variant: mirrored | arrow-left-from-line | arrow_export_rtl_16 | exit (RTL), leave |
| 11 | r0c1 1.9 (g1.19) | arrow-right-from-bracket | arrow pointing right out of a bracket on the left | log-out | exists | log-out | arrow_exit_16 | sign out, exit |
| 11 | r0c1 1.10 (g1.20) | upload | arrow up out of a tray | upload | exists | upload | arrow_upload_16 | upload files |
| 11 | r0c0 2.1 (g2.1) | upload-dashed | upload arrow with a dashed shaft over a tray | upload | variant: dashed shaft | upload | arrow_upload_16 | uploading, pending upload |
| 11 | r0c0 2.2 (g2.2) | download | arrow down into a tray | download | exists | download | arrow_download_16 | download, save |
| 11 | r0c0 2.3 (g2.3) | arrow-left-to-bracket | arrow pointing left into a bracket on the left | log-in | variant: mirrored | arrow-left-to-line | arrow_enter_16 | enter (RTL), import |
| 11 | r0c0 2.4 (g2.4) | arrow-right-to-bracket | arrow pointing right into a bracket on the right | log-in | exists | log-in | arrow_enter_16 | sign in, enter |
| 11 | r0c0 2.5 (g2.5) | arrow-up-to-bracket | arrow pointing up into an open bracket at the top | download | variant: rotated 180° | arrow-up-to-line | arrow_upload_16 | move to top, push up |
| 11 | r0c0 2.6 (g2.6) | rotate-ccw | open circular arrow, head at top left | reset | exists | rotate-ccw | arrow_counterclockwise_16 | reset, rotate left |
| 11 | r0c0 2.7 (g2.7) | arrow-down-circle | arrow down in a circle | arrow-up-circle | variant: rotated 180° | circle-arrow-down | arrow_circle_down_16 | scroll down, download |
| 11 | r0c0 2.8 (g2.8) | arrow-left-circle | arrow left in a circle | arrow-up-circle | variant: rotated 90° | circle-arrow-left | arrow_circle_left_16 | back, previous |
| 11 | r0c0 2.9 (g2.9) | arrow-right-circle | arrow right in a circle | arrow-up-circle | variant: rotated 90° | circle-arrow-right | arrow_circle_right_16 | next, go |
| 11 | r0c0 2.10 (g2.10) | arrow-up-circle | arrow up in a circle | arrow-up-circle | exists | circle-arrow-up | arrow_circle_up_16 | submit, send |
| 11 | r0c1 2.1 (g2.11) | rotate-cw | open circular arrow, head at top right | refresh | exists | rotate-cw | arrow_clockwise_16 | refresh, regenerate |
| 11 | r0c1 2.2 (g2.12) | arrow-down | arrow pointing down | arrow-down | exists | arrow-down | arrow_down_16 | down, descending |
| 11 | r0c1 2.3 (g2.13) | arrow-left | arrow pointing left | arrow-left | exists | arrow-left | arrow_left_16 | back, previous step |
| 11 | r0c1 2.4 (g2.14) | arrow-down-left | diagonal arrow down-left | arrow-down-left | exists | arrow-down-left | arrow_down_left_16 | direction, incoming |
| 11 | r0c1 2.5 (g2.15) | arrow-up-left | diagonal arrow up-left | arrow-up-left | exists | arrow-up-left | arrow_up_left_16 | direction, move diagonally |
| 11 | r0c1 2.6 (g2.16) | arrow-right | arrow pointing right | arrow-right | exists | arrow-right | arrow_right_16 | next, go |
| 11 | r0c1 2.7 (g2.17) | arrow-down-right | diagonal arrow down-right | arrow-down-right | exists | arrow-down-right | arrow_down_right_16 | direction, move diagonally |
| 11 | r0c1 2.8 (g2.18) | arrow-up-right | diagonal arrow up-right | arrow-up-right | exists | arrow-up-right | arrow_up_right_16 | open link, trend up |
| 11 | r0c1 2.9 (g2.19) | arrow-down-square | arrow down inside a rounded square | arrow-down | variant: + square | square-arrow-down | arrow_square_down_20 | download, move down |
| 11 | r0c1 2.10 (g2.20) | arrow-down-from-square | arrow pointing down out of a box open at the bottom | share | variant: rotated 180° | arrow-down-from-line | arrow_between_down_20 | export down, drop out |
| 11 | r0c0 3.1 (g3.1) | arrow-left-from-square | arrow pointing left out of a box open on its left | log-out | variant: mirrored, box form | square-arrow-right-exit | arrow_exit_16 | exit (RTL) |
| 11 | r0c0 3.2 (g3.2) | arrow-right-from-square | arrow pointing right out of a box open on its right (box form of log-out) | log-out | exists | square-arrow-right-exit | arrow_exit_16 | sign out, exit |
| 11 | r0c0 3.3 (g3.3) | share | arrow up out of an open-top box | share | exists | share | share_ios_20 | share, export |
| 11 | r0c0 3.4 (g3.4) | arrow-left-square | arrow left inside a rounded square | arrow-left | variant: + square | square-arrow-left | arrow_square_down_20 | back, collapse |
| 11 | r0c0 3.5 (g3.5) | arrow-down-left-square | diagonal arrow down-left inside a rounded square | arrow-down-left | variant: + square | square-arrow-down-left | arrow_square_up_right_20 | direction, dock |
| 11 | r0c0 3.6 (g3.6) | arrow-up-left-square | diagonal arrow up-left inside a rounded square | arrow-up-left | variant: + square | square-arrow-up-left | arrow_square_up_right_20 | direction, dock top-left |
| 11 | r0c0 3.7 (g3.7) | arrow-right-square | arrow right inside a rounded square | arrow-right | variant: + square | square-arrow-right | arrow_square_down_20 | next, go to |
| 11 | r0c0 3.8 (g3.8) | arrow-down-right-square | diagonal arrow down-right inside a rounded square | arrow-down-right | variant: + square | square-arrow-down-right | arrow_square_up_right_20 | direction, dock bottom-right |
| 11 | r0c0 3.9 (g3.9) | arrow-up-right-square | diagonal arrow up-right inside a rounded square | arrow-up-right | variant: + square | square-arrow-up-right | arrow_square_up_right_20 | open, pop out |
| 11 | r0c0 3.10 (g3.10) | import | arrow down into a box open at the top | download | variant: box instead of tray | import | arrow_download_16 | import, save into |
| 11 | r0c1 3.1 (g3.11) | arrow-left-into-square | arrow pointing left into a box open on its right | log-in | variant: mirrored, box form | square-arrow-right-enter | arrow_enter_16 | enter (RTL), move into |
| 11 | r0c1 3.2 (g3.12) | arrow-right-into-square | arrow pointing right into a box open on its left (box form of log-in) | log-in | exists | square-arrow-right-enter | arrow_enter_16 | sign in, enter |
| 11 | r0c1 3.3 (g3.13) | arrow-up-into-square | arrow pointing up into a box open at the bottom | download | variant: box form, rotated 180° | arrow-up-to-line | arrow_upload_16 | move up into, raise |
| 11 | r0c1 3.4 (g3.14) | arrow-up-square | arrow up inside a rounded square | arrow-up | variant: + square | square-arrow-up | arrow_square_down_20 | upload, move up |
| 11 | r0c1 3.5 (g3.15) | undo | hooked arrow pointing left | undo | exists | undo-2 | arrow_undo_16 | undo last action |
| 11 | r0c1 3.6 (g3.16) | redo | hooked arrow pointing right | redo | exists | redo-2 | arrow_redo_16 | redo last action |
| 11 | r0c1 3.7 (g3.17) | arrow-up | arrow pointing up | arrow-up | exists | arrow-up | arrow_up_16 | send, up |
| 11 | r0c1 3.8 (g3.18) | arrow-left-right | one double-headed horizontal arrow (↔) | — | missing | move-horizontal | arrow_bidirectional_left_right_16 | resize width, swap |
| 11 | r0c1 3.9 (g3.19) | arrow-up-down | one double-headed vertical arrow (↕) | — | missing | move-vertical | arrow_bidirectional_up_down_16 | resize height, reorder |
| 11 | r0c1 3.10 (g3.20) | refresh-ccw | two arcs, heads at top left and bottom right | sync | exists | refresh-ccw | arrow_sync_16 | sync, refresh |
| 11 | r0c0 4.1 (g4.1) | repeat | loop of two elbowed arrows (← top left, → bottom right; Area's is mirrored) | repeat | exists | repeat | arrow_repeat_all_16 | repeat, loop |
| 11 | r0c0 4.2 (g4.2) | shrink | four diagonal arrows pointing in from the corners | collapse | variant: four arrows instead of two | shrink | arrow_minimize_16 | exit full screen, minimize |
| 11 | r0c0 4.3 (g4.3) | minimize-2 | two diagonal arrows pointing inward | collapse | exists | minimize-2 | arrow_minimize_16 | collapse, exit full screen |
| 11 | r0c0 4.4 (g4.4) | refresh-cw | two arcs, heads at top right and bottom left | sync | variant: mirrored (clockwise) | refresh-cw | arrow_sync_16 | refresh, reload |
| 11 | r0c0 4.5 (g4.5) | arrow-down-up | down arrow beside a raised up arrow | sort | exists | arrow-down-up | arrow_sort_16 | sort, reorder |
| 11 | r0c0 4.6 (g4.6) | expand-corners | four diagonal arrows pointing out to the corners | expand | variant: four arrows instead of two | expand | arrow_maximize_16 | full screen, maximize |
| 11 | r0c0 4.7 (g4.7) | maximize-2 | two diagonal arrows pointing outward | expand | exists | maximize-2 | arrow_maximize_16 | expand, full screen |
| 11 | r0c0 4.8 (g4.8) | arrow-right-left | two stacked opposed arrows (→ over ←); Area sort turned 90° | sort | variant: rotated 90° | arrow-right-left | arrow_swap_16 | swap, exchange, transfer |
| 11 | r0c0 4.9 (g4.9) | move | four-way arrows | move | exists | move | arrow_move_20 | move, drag |
| 11 | r0c0 4.10 (g4.10) | asterisk | five-armed asterisk | — | missing | asterisk | text_asterisk_16 | required field, wildcard |
| 11 | r0c1 4.1 (g4.11) | at | @ sign | at | exists | at-sign | mention_16 | mention, email |
| 11 | r0c1 4.2 (g4.12) | atom | nucleus dot with two crossing elliptical orbits | — | missing | atom | — | science, React, physics |
| 11 | r0c1 4.3 (g4.13) | bandage | diagonal rounded band-aid with a centre pad | — | missing | bandage | — | health, fix, patch |
| 11 | r0c1 4.4 (g4.14) | banknote | note with an oval in the middle | banknote | exists | banknote | money_16 | cash, payment |
| 11 | r0c1 4.5 (g4.15) | banknote-stack | square with a banknote on top and two bands below | banknote | variant: stacked | banknote | money_16 | cash, pricing, billing |
| 11 | r0c1 4.6 (g4.16) | dumbbell | dumbbell: two plates on a bar | — | missing | dumbbell | dumbbell_16 | fitness, workout |
| 11 | r0c1 4.7 (g4.17) | basketball | ball with a horizontal seam and two curved seams | — | missing | volleyball | sport_basketball_20 | sports, games |
| 11 | r0c1 4.8 (g4.18) | beach-umbrella | tilted parasol with a diagonal pole | umbrella | exists | umbrella | beach_16 | beach, vacation, insurance |
| 11 | r0c1 4.9 (g4.19) | nightstand? | cabinet on two legs with an overhanging top and a drawer handle | — | missing | — | — | furniture, bedroom?, storage |
| 11 | r0c1 4.10 (g4.20) | bell | bell | bell | exists | bell | alert_16 | notifications, alerts |
| 11 | r1c0 1.1 (g5.1) | bell-dot | bell with a filled dot at top right | bell | variant: + dot | bell-dot | alert_badge_16 | unread notifications |
| 11 | r1c0 1.2 (g5.2) | bell-off | bell with a slash | bell-off | exists | bell-off | alert_off_16 | mute notifications |
| 11 | r1c0 1.3 (g5.3) | binary | digits 01 over 10 | — | missing | binary | — | binary data, code |
| 11 | r1c0 1.4 (g5.4) | binoculars | binoculars | — | missing | binoculars | — | explore, watch, search |
| 11 | r1c0 1.5 (g5.5) | bluetooth | bluetooth rune | bluetooth | exists | bluetooth | bluetooth_16 | bluetooth, devices |
| 11 | r1c0 1.6 (g5.6) | square-kanban | rounded square with three bars hanging from the top | kanban | exists | square-kanban | board_16 | board, projects |
| 11 | r1c0 1.7 (g5.7) | book-closed | closed book with a curled spine (Area's book is open) | book | exists | book | book_16 | docs, guides |
| 11 | r1c0 1.8 (g5.8) | book-open | open book | book | exists | book-open | book_open_16 | docs, reading |
| 11 | r1c0 1.9 (g5.9) | bookmark | bookmark ribbon | bookmark | exists | bookmark | bookmark_16 | save, bookmark |
| 11 | r1c0 1.10 (g5.10) | library | slanted book beside three spines | library | exists | library | library_16 | library, collections |
| 11 | r1c1 1.1 (g5.11) | bow-tie | bow tie | — | missing | — | bow_tie_20 | formal, style, persona? |
| 11 | r1c1 1.2 (g5.12) | braces | curly braces { } | braces | exists | braces | braces_16 | code, JSON |
| 11 | r1c1 1.3 (g5.13) | braces-dot | { } with a dot at lower right | braces | variant: + dot | braces | braces_16 | modified code, variable |
| 11 | r1c1 1.4 (g5.14) | braces-x | { } with an × at lower right | braces | variant: + x | braces | braces_dismiss_16 | invalid JSON, remove |
| 11 | r1c1 1.5 (g5.15) | brackets | square brackets [ ] | — | missing | brackets | — | arrays, code |
| 11 | r1c1 1.6 (g5.16) | brain | brain with folds and a branching centre stem | — | missing | brain | brain_16 | AI, thinking, memory |
| 11 | r1c1 1.7 (g5.17) | brain-hourglass | half brain with an hourglass | — | missing | brain | brain_16 | thinking, reasoning in progress |
| 11 | r1c1 1.8 (g5.18) | brain-circuit? | brain outline with a branched centre line | — | missing | brain-circuit | brain_circuit_20 | AI model, reasoning |
| 11 | r1c1 1.9 (g5.19) | brain-outline | two-lobed brain outline with a centre line | — | missing | brain | brain_16 | thinking, memory |
| 11 | r1c1 1.10 (g5.20) | brain-off | brain with a slash | — | missing | brain | brain_16 | reasoning off |
| 11 | r1c0 2.1 (g6.1) | briefcase | briefcase | briefcase | exists | briefcase | briefcase_16 | work, business |
| 11 | r1c0 2.2 (g6.2) | browser | window with a header line (same glyph as Area panel-top) | panel-top | exists | panel-top | window_16 | browser, web preview |
| 11 | r1c0 2.3 (g6.3) | browsers | two stacked windows with header lines | panel-top | variant: stacked copy | app-window | window_multiple_16 | tabs, multiple windows |
| 11 | r1c0 2.4 (g6.4) | brush | angled flat paintbrush | paintbrush | exists | brush | paint_brush_16 | style, paint |
| 11 | r1c0 2.5 (g6.5) | bug | bug | bug | exists | bug | bug_16 | debug, report bug |
| 11 | r1c0 2.6 (g6.6) | bug-off | bug with a slash | bug | variant: + slash | bug-off | bug_prohibited_20 | debugging off |
| 11 | r1c0 2.7 (g6.7) | building | tall building with windows | building | exists | building | building_16 | company, organization |
| 11 | r1c0 2.8 (g6.8) | buildings | tall building with a shorter one beside it | building | variant: + second building | building-complex | building_multiple_16 | organization, companies |
| 11 | r1c0 2.9 (g6.9) | bullseye | target rings with a dart | — | missing | target | target_arrow_16 | goals, objectives, focus |
| 11 | r1c0 2.10 (g6.10) | calculator | calculator | calculator | exists | calculator | calculator_16 | calculate, math |
| 11 | r1c1 2.1 (g6.11) | calendar | calendar | calendar | exists | calendar | calendar_16 | date, schedule |
| 11 | r1c1 2.2 (g6.12) | calendar-hourglass | calendar with an hourglass at lower right | calendar | variant: + hourglass | calendar-clock | calendar_clock_16 | scheduled, pending date |
| 11 | r1c1 2.3 (g6.13) | camera | camera | camera | exists | camera | camera_16 | photo, capture |
| 11 | r1c1 2.4 (g6.14) | car | car, front view | car | exists | car-front | vehicle_car_16 | travel, vehicle |
| 11 | r1c1 2.5 (g6.15) | cardholder | card wallet with a notched pocket | wallet | exists | wallet-cards | wallet_credit_card_16 | cards, payment methods |
| 11 | r1c1 2.6 (g6.16) | castle | fortress with a central turret | — | missing | castle | chess_16 | security, fortress, games |
| 11 | r1c1 2.7 (g6.17) | disc | circle with a small centre ring (CD) | — | missing | disc | cd_16 | media, disk, album |
| 11 | r1c1 2.8 (g6.18) | bar-chart | three vertical bars, no axes | bar-chart | exists | chart-no-axes-column | data_bar_vertical_16 | stats, usage |
| 11 | r1c1 2.9 (g6.19) | line-chart | axes with a zigzag line | chart | exists | chart-line | data_line_16 | analytics, trends |
| 11 | r1c1 2.10 (g6.20) | pie-chart | circle with a quarter wedge | pie-chart | exists | chart-pie | data_pie_16 | breakdown, share |
| 11 | r1c0 3.1 (g7.1) | chart-pyramid | triangle cut into horizontal bands | — | missing | pyramid | data_funnel_20 | funnel, hierarchy chart |
| 11 | r1c0 3.2 (g7.2) | chart-scatter | axes with scattered dots | — | missing | chart-scatter | data_scatter_20 | correlation, data plot |
| 11 | r1c0 3.3 (g7.3) | chat-round | round speech bubble with a pointed lower-left corner | chat | exists | message-circle | chat_16 | chat, comment |
| 11 | r1c0 3.4 (g7.4) | chat-code | round bubble with <> | chat | variant: + code | message-circle-code | chat_16 | code chat, snippet |
| 11 | r1c0 3.5 (g7.5) | chat-more | round bubble with … | chat | variant: + ellipsis | message-circle-more | chat_16 | typing, more replies |
| 11 | r1c0 3.6 (g7.6) | chat-warning | round bubble with ! | chat | variant: + exclamation | message-circle-warning | chat_warning_16 | failed message, flagged |
| 11 | r1c0 3.7 (g7.7) | chat-edit | round bubble opened at top right with a pencil (Area compose is the square version) | chat | variant: + pencil | square-pen | comment_edit_16 | new chat, compose |
| 11 | r1c0 3.8 (g7.8) | chat-question | round bubble with ? | chat | variant: + question mark | message-circle-question-mark | chat_help_16 | help, FAQ |
| 11 | r1c0 3.9 (g7.9) | chat-multiple | two overlapping round bubbles | chat-multiple | exists | messages-circle | chat_multiple_16 | conversations, threads |
| 11 | r1c0 3.10 (g7.10) | chat-grid | four small round bubbles in a 2x2 grid | chat | variant: repeated x4 in a grid | messages-circle | chat_multiple_16 | all chats, chat list? |
| 11 | r1c1 3.1 (g7.11) | check | check mark | check | exists | check | checkmark_16 | confirm, done |
| 11 | r1c1 3.2 (g7.12) | check-circle | check in a circle | status-available | exists | circle-check | checkmark_circle_16 | success, done |
| 11 | r1c1 3.3 (g7.13) | check-square | check in a rounded square | checkbox | exists | square-check | checkbox_checked_16 | completed task |
| 11 | r1c1 3.4 (g7.14) | check-check | two stacked check marks | check | variant: doubled | check-check | checkmark_16 | read receipt, all done |
| 11 | r1c1 3.5 (g7.15) | chef-hat | chef's toque | — | missing | chef-hat | food_16 | cooking, recipes |
| 11 | r1c1 3.6 (g7.16) | chess-king | king piece with a cross | — | missing | chess-king | chess_16 | games, strategy |
| 11 | r1c1 3.7 (g7.17) | chess-rook | rook piece | — | missing | chess-rook | chess_16 | games, strategy |
| 11 | r1c1 3.8 (g7.18) | chevron-down-circle | chevron down in a circle | chevron-down | variant: + circle | circle-chevron-down | chevron_circle_down_16 | expand, dropdown |
| 11 | r1c1 3.9 (g7.19) | chevron-left-circle | chevron left in a circle | chevron-left | variant: + circle | circle-chevron-left | chevron_circle_left_16 | previous, go back |
| 11 | r1c1 3.10 (g7.20) | chevron-right-circle | chevron right in a circle | chevron-right | variant: + circle | circle-chevron-right | chevron_circle_right_16 | next, go forward |
| 11 | r1c0 4.1 (g8.1) | chevron-up-circle | chevron up in a circle | chevron-up | variant: + circle | circle-chevron-up | chevron_circle_up_16 | collapse, back to top |
| 11 | r1c0 4.2 (g8.2) | chevron-down | chevron down | chevron-down | exists | chevron-down | chevron_down_16 | expand, dropdown |
| 11 | r1c0 4.3 (g8.3) | chevron-down-small | small chevron down | chevron-down | exists | chevron-down | chevron_down_16 | inline dropdown |
| 11 | r1c0 4.4 (g8.4) | chevron-left | chevron left | chevron-left | exists | chevron-left | chevron_left_16 | previous, back |
| 11 | r1c0 4.5 (g8.5) | chevron-left-small | small chevron left | chevron-left | exists | chevron-left | chevron_left_16 | inline back |
| 11 | r1c0 4.6 (g8.6) | chevron-right | chevron right | chevron-right | exists | chevron-right | chevron_right_16 | next, open |
| 11 | r1c0 4.7 (g8.7) | chevron-right-small | small chevron right | chevron-right | exists | chevron-right | chevron_right_16 | breadcrumb, disclosure |
| 11 | r1c0 4.8 (g8.8) | chevron-up | chevron up | chevron-up | exists | chevron-up | chevron_up_16 | collapse, move up |
| 11 | r1c0 4.9 (g8.9) | chevron-up-small | small chevron up | chevron-up | exists | chevron-up | chevron_up_16 | inline collapse |
| 11 | r1c0 4.10 (g8.10) | chevrons-down-bold | outlined heavy double chevron down (rank-badge shape) | — | missing | chevrons-down | chevron_double_down_16 | demote, low priority |
| 11 | r1c1 4.1 (g8.11) | chevrons-left-bold | outlined heavy double chevron left | — | missing | chevrons-left | chevron_double_left_16 | jump back |
| 11 | r1c1 4.2 (g8.12) | chevrons-right-bold | outlined heavy double chevron right | — | missing | chevrons-right | chevron_double_right_16 | skip ahead |
| 11 | r1c1 4.3 (g8.13) | chevrons-up-bold | outlined heavy double chevron up | — | missing | chevrons-up | chevron_double_up_16 | promote, high priority |
| 11 | r1c1 4.4 (g8.14) | chevrons-down | double chevron down | chevron-down | variant: doubled | chevrons-down | chevron_double_down_16 | expand all, to bottom |
| 11 | r1c1 4.5 (g8.15) | chevrons-down-up | chevrons pointing toward each other (fold) | chevrons-up-down | variant: inverted | chevrons-down-up | chevron_up_down_16 | collapse all, fold |
| 11 | r1c1 4.6 (g8.16) | chevrons-left | double chevron left | chevron-left | variant: doubled | chevrons-left | chevron_double_left_16 | first page, collapse sidebar |
| 11 | r1c1 4.7 (g8.17) | chevrons-left-right | chevrons pointing apart horizontally (< >) | chevrons-up-down | variant: rotated 90° | chevrons-left-right | chevron_up_down_16 | expand width |
| 11 | r1c1 4.8 (g8.18) | chevrons-right | double chevron right | chevron-right | variant: doubled | chevrons-right | chevron_double_right_16 | last page, expand |
| 11 | r1c1 4.9 (g8.19) | chevrons-right-dashed | double chevron right, the trailing one dashed | chevron-right | variant: doubled, trailing one dashed | chevrons-right | chevron_double_right_16 | skip, step over? |
| 11 | r1c1 4.10 (g8.20) | chevrons-up | double chevron up | chevron-up | variant: doubled | chevrons-up | chevron_double_up_16 | scroll to top |
| 11 | r2c0 1.1 (g9.1) | chevrons-up-down | chevrons pointing apart vertically | chevrons-up-down | exists | chevrons-up-down | chevron_up_down_16 | select, sort |
| 11 | r2c0 1.2 (g9.2) | chip-grid | square quartered by a cross whose arms run out as pins | chip | exists | cpu | developer_board_16 | processor, compute |
| 11 | r2c0 1.3 (g9.3) | chip | square with pins on every side | chip | exists | cpu | developer_board_16 | processor, model |
| 11 | r2c0 1.4 (g9.4) | circle | plain circle | ellipse | exists | circle | circle_16 | shape, status |
| 11 | r2c0 1.5 (g9.5) | circle-dot | ring with an inner ring (◎, same glyph as Area token) | token | exists | circle-dot | circle_multiple_concentric_16 | radio, target, record |
| 11 | r2c0 1.6 (g9.6) | circle-dashed | dashed circle | ellipse | variant: dashed | circle-dashed | circle_hint_16 | draft, pending, placeholder |
| 11 | r2c0 1.7 (g9.7) | circle-stack | circle with a second circle's arc behind it | ellipse | variant: stacked copy | circle-pile | — | sessions, runs, instances? |
| 11 | r2c0 1.8 (g9.8) | circle-stack-check | stacked circles with a check in the front one | ellipse | variant: stacked copy + check | circle-check | circle_multiple_subtract_checkmark_20 | completed runs, all passed |
| 11 | r2c0 1.9 (g9.9) | clipboard-list | clipboard with text lines | clipboard | variant: + text lines | clipboard-list | clipboard_text_ltr_16 | tasks, plan, notes |
| 11 | r2c0 1.10 (g9.10) | clock | clock | clock | exists | clock | clock_16 | time, history |
| 11 | r2c1 1.1 (g9.11) | cloud | cloud | cloud | exists | cloud | cloud_16 | cloud, sync |
| 11 | r2c1 1.2 (g9.12) | cloud-download | cloud with a down arrow | cloud-download | exists | cloud-download | cloud_arrow_down_16 | download from cloud |
| 11 | r2c1 1.3 (g9.13) | cloud-upload | cloud with an up arrow | cloud-upload | exists | cloud-upload | cloud_arrow_up_16 | upload to cloud |
| 11 | r2c1 1.4 (g9.14) | code-xml | </> with a slash | code | variant: + slash | code-xml | code_16 | HTML, markup, code view |
| 11 | r2c1 1.5 (g9.15) | code | <> chevrons | code | exists | code | code_16 | code, source view |
| 11 | r2c1 1.6 (g9.16) | cog | eight-toothed gear | settings | exists | cog | settings_16 | settings, preferences |
| 11 | r2c1 1.7 (g9.17) | collection? | trapezoid tray with a separate lid line above | — | missing | archive | collections_16 | collections, saved items |
| 11 | r2c1 1.8 (g9.18) | collection-add? | the same tray with a + at lower right | — | missing | archive | collections_add_20 | add to collection |
| 11 | r2c1 1.9 (g9.19) | contrast-hatched | circle with its right half hatched | contrast | exists | contrast | circle_half_fill_16 | appearance, theme |
| 11 | r2c1 1.10 (g9.20) | command | ⌘ key | command | exists | command | key_command_16 | shortcuts, command key |
| 11 | r2c0 2.1 (g10.1) | chat-square | square speech bubble with a V tail | chat | exists | message-square | comment_16 | comment, feedback |
| 11 | r2c0 2.2 (g10.2) | chat-dashed | dashed square speech bubble | chat | variant: dashed | message-square-dashed | comment_16 | draft comment |
| 11 | r2c0 2.3 (g10.3) | chat-dot | square bubble with a dot at top right | chat | variant: + dot | message-square-dot | comment_badge_16 | unread message |
| 11 | r2c0 2.4 (g10.4) | chat-multiple-square | two stacked square bubbles | chat-multiple | exists | messages-square | comment_multiple_16 | threads, conversations |
| 11 | r2c0 2.5 (g10.5) | compass | compass | compass | exists | compass | compass_northwest_16 | explore, discover |
| 11 | r2c0 2.6 (g10.6) | compass-check | compass (ring broken at lower right) with a check | compass | variant: + check | compass | compass_northwest_16 | explored, visited |
| 11 | r2c0 2.7 (g10.7) | compass-dot | compass with a dot at lower right | compass | variant: + dot | compass | compass_northwest_16 | new to explore |
| 11 | r2c0 2.8 (g10.8) | cookie | cookie with a bite and chips | — | missing | cookie | cookies_16 | cookies, privacy |
| 11 | r2c0 2.9 (g10.9) | copy | two overlapping squares | copy | exists | copy | copy_16 | copy to clipboard |
| 11 | r2c0 2.10 (g10.10) | corners-in | four corner marks facing inward | corners | variant: inverted (pointing in) | minimize | full_screen_minimize_16 | exit full screen |
| 11 | r2c1 2.1 (g10.11) | corners | four corner marks | corners | exists | scan | full_screen_maximize_16 | focus, full screen, frame |
| 11 | r2c1 2.2 (g10.12) | corners-check | corner marks with a check inside | corners | variant: + check | scan | scan_type_checkmark_20 | verified capture, scan done |
| 11 | r2c1 2.3 (g10.13) | corners-sparkle | corner marks with a sparkle inside | corners | variant: + sparkle | scan | square_hint_sparkles_16 | AI selection, smart capture |
| 11 | r2c1 2.4 (g10.14) | cost-high | $$$ | — | missing | dollar-sign | currency_dollar_euro_16 | price tier, expensive model |
| 11 | r2c1 2.5 (g10.15) | cost-low | $ | — | missing | dollar-sign | currency_dollar_euro_16 | price tier, cheap |
| 11 | r2c1 2.6 (g10.16) | cost-medium | $$ | — | missing | dollar-sign | currency_dollar_euro_16 | price tier |
| 11 | r2c1 2.7 (g10.17) | credit-card | card with a stripe and a short dash | credit-card | exists | credit-card | payment_16 | payment, billing |
| 11 | r2c1 2.8 (g10.18) | cross | outlined plus-shaped cross | — | missing | cross | — | medical, health |
| 11 | r2c1 2.9 (g10.19) | crosshair | circle with four ticks and a centre dot | — | missing | crosshair | target_16 | aim, locate, pick element |
| 11 | r2c1 2.10 (g10.20) | crown | crown | crown | exists | crown | crown_16 | premium, owner |
| 11 | r2c0 3.1 (g11.1) | crystal-ball | orb on a stand with a sparkle | — | missing | — | — | predictions, magic, insights |
| 11 | r2c0 3.2 (g11.2) | cube | isometric cube (Area package is the same box with tape) | package | exists | box | cube_16 | 3D object, package |
| 11 | r2c0 3.3 (g11.3) | hexagon-inverted-y? | hexagon with a short three-spoke mark inside | — | missing | hexagon | hexagon_16 | 3D, model? |
| 11 | r2c0 3.4 (g11.4) | nodes-tripod? | three small circles joined at a centre point | — | missing | git-fork | organization_16 | graph, integrations? |
| 11 | r2c0 3.5 (g11.5) | cube-transparent? | hexagon with six spokes (wireframe cube) | — | missing | box | cube_16 | 3D wireframe, geometry |
| 11 | r2c0 3.6 (g11.6) | bitcoin | ₿ sign | — | missing | bitcoin | — | crypto, payments |
| 11 | r2c0 3.7 (g11.7) | dollar | $ sign | — | missing | dollar-sign | currency_dollar_euro_16 | currency, pricing, billing |
| 11 | r2c0 3.8 (g11.8) | ethereum | faceted diamond (ETH logo) | — | missing | — | — | crypto, wallet |
| 11 | r2c0 3.9 (g11.9) | cursor-logo | hexagon with a pointer inside (Cursor brand) | — | missing | — | — | brand, product |
| 11 | r2c0 3.10 (g11.10) | text-cursor | I-beam text cursor | text-cursor | exists | text-cursor | — | text insertion |
| 11 | r2c1 3.1 (g11.11) | utensils | fork and spoon | — | missing | utensils | food_16 | food, restaurants |
| 11 | r2c1 3.2 (g11.12) | cylinder | single cylinder (Area database is three disks) | database | exists | cylinder | database_16 | storage, 3D shape |
| 11 | r2c1 3.3 (g11.13) | dashboard-layout | square with a left pane and two stacked right panes | layout | exists | layout-panel-left | board_16 | dashboard, layout |
| 11 | r2c1 3.4 (g11.14) | database | three stacked disks | database | exists | database | database_stack_16 | data, DB |
| 11 | r2c1 3.5 (g11.15) | database-network? | two-tier cylinder on a stem and base line | database | variant: + network base | database | database_link_20 | connected DB, data source |
| 11 | r2c1 3.6 (g11.16) | deck-chair | lounger with a parasol | — | missing | tree-palm | beach_16 | vacation, leisure, away |
| 11 | r2c1 3.7 (g11.17) | sitemap | box linked to two boxes below | — | missing | network | organization_16 | hierarchy, sitemap, org chart |
| 11 | r2c1 3.8 (g11.18) | diff-split | two tall panes side by side, divided at different heights | — | missing | columns-2 | split_vertical_16 | side-by-side diff, compare |
| 11 | r2c1 3.9 (g11.19) | diff-added | + in a square | add | variant: + square | square-plus | add_square_16 | added lines, git status |
| 11 | r2c1 3.10 (g11.20) | diff-ignored | backslash in a square | line | variant: + square | square-slash | — | ignored file, git status |
| 11 | r2c0 4.1 (g12.1) | diff-modified | dot in a square | stop | variant: + dot | square-dot | checkbox_indeterminate_16 | modified file, git status |
| 11 | r2c0 4.2 (g12.2) | diff-multiple | two stacked pages with ± | — | missing | file-diff | document_multiple_16 | multi-file diff |
| 11 | r2c0 4.3 (g12.3) | diff-removed | − in a square | minus | variant: + square | square-minus | subtract_square_16 | removed lines, git status |
| 11 | r2c0 4.4 (g12.4) | diff-renamed | → in a square | arrow-right | variant: + square | square-arrow-right | arrow_square_down_20 | renamed file, git status |
| 11 | r2c0 4.5 (g12.5) | diff-single | page with ± | — | missing | file-diff | document_16 | file diff, changes |
| 11 | r2c0 4.6 (g12.6) | diff-open | page with ± and ↗ | — | missing | file-diff | document_arrow_right_16 | open diff |
| 11 | r2c0 4.7 (g12.7) | diff-dot | page with ± and a dot | — | missing | file-diff | document_16 | pending changes |
| 11 | r2c0 4.8 (g12.8) | desktop | monitor on a stand | desktop | exists | monitor | desktop_16 | device, system |
| 11 | r2c0 4.9 (g12.9) | desktop-check | monitor with a check at top right | desktop | variant: + check | monitor-check | desktop_checkmark_16 | device connected |
| 11 | r2c0 4.10 (g12.10) | desktop-ring | monitor with a hollow ring at top right | desktop | variant: + dot (ring) | monitor-dot | desktop_16 | device status |
| 11 | r2c1 4.1 (g12.11) | desktop-remote | monitor with >< chevrons at top right | desktop | variant: + remote chevrons | monitor | desktop_arrow_right_16 | remote session, SSH |
| 11 | r2c1 4.2 (g12.12) | desktop-play | monitor with a play triangle at top right | desktop | variant: + play | monitor-play | desktop_16 | run app, preview |
| 11 | r2c1 4.3 (g12.13) | desktop-cast | monitor with signal arcs at top right | desktop | variant: + signal arcs | cast | desktop_signal_20 | cast, remote display |
| 11 | r2c1 4.4 (g12.14) | desktops | two stacked monitors | desktop | variant: stacked copy | monitor | desktop_16 | multiple displays, machines |
| 11 | r2c1 4.5 (g12.15) | more-horizontal | three dots in a row | more-horizontal | exists | ellipsis | more_horizontal_16 | more actions |
| 11 | r2c1 4.6 (g12.16) | more-vertical | three dots in a column | more-vertical | exists | ellipsis-vertical | more_vertical_16 | more actions |
| 11 | r2c1 4.7 (g12.17) | droplet | droplet | color | exists | droplet | drop_16 | color, fill |
| 11 | r2c1 4.8 (g12.18) | easel | presentation board on a tripod | — | missing | presentation | whiteboard_16 | presentations, slides |
| 11 | r2c1 4.9 (g12.19) | elephant | elephant | — | missing | — | — | PHP/Postgres logos?, memory |
| 11 | r2c1 4.10 (g12.20) | envelope | envelope | mail | exists | mail | mail_16 | email, inbox |
| 11 | r2c0 5.1 (g13.1) | mail-open | open envelope | mail-open | exists | mail-open | mail_read_16 | read mail |
| 11 | r2c0 5.2 (g13.2) | eraser | eraser | eraser | exists | eraser | eraser_20 | erase, clear |
| 11 | r2c0 5.3 (g13.3) | alert-circle | ! in a circle | warning | variant: circle instead of triangle | circle-alert | error_circle_16 | error, alert |
| 11 | r2c0 5.4 (g13.4) | warning | ! in a triangle | warning | exists | triangle-alert | warning_16 | warning, caution |
| 11 | r2c0 5.5 (g13.5) | arrow-right-triple? | three parallel shafts meeting one arrowhead (⇛) | arrow-right | variant: three shafts | — | — | execute?, fast forward |
| 11 | r2c0 5.6 (g13.6) | arrows-right-double? | two small arrows in a row (→→) | arrow-right | variant: doubled | arrow-right | arrow_right_16 | skip ahead?, next step |
| 11 | r2c0 5.7 (g13.7) | blocks | three squares in an L plus one offset square (Area puzzle covers the extensions meaning) | — | missing | blocks | apps_add_in_16 | extensions, add-ons, apps |
| 11 | r2c0 5.8 (g13.8) | eye | eye | eye | exists | eye | eye_16 | show, view |
| 11 | r2c0 5.9 (g13.9) | eye-closed | closed eye with lashes | eye-off | exists | eye-closed | eye_off_16 | hide, conceal |
| 11 | r2c0 5.10 (g13.10) | eye-slash | eye with a slash | eye | variant: + slash | eye-off | eye_off_16 | hidden, visibility off |
| 11 | r2c1 5.1 (g13.11) | rewind | two left triangles | rewind | exists | rewind | rewind_16 | rewind, skip back |
| 11 | r2c1 5.2 (g13.12) | fast-forward | two right triangles | fast-forward | exists | fast-forward | fast_forward_16 | fast forward |
| 11 | r2c1 5.3 (g13.13) | file | page with a folded corner | document | exists | file | document_16 | file, document |
| 11 | r2c1 5.4 (g13.14) | file-arrow | page with ↗ at lower right | document | variant: + arrow | file-symlink | document_arrow_right_16 | open file, shortcut |
| 11 | r2c1 5.5 (g13.15) | file-code | page with <> | file-code | exists | file-code | document_code_16 | code file |
| 11 | r2c1 5.6 (g13.16) | file-image | page with a mountain | file-image | exists | file-image | document_image_16 | image file |
| 11 | r2c1 5.7 (g13.17) | file-list | page with a bulleted list | document | variant: + bulleted list | file-text | document_bullet_list_16 | text file, notes |
| 11 | r2c1 5.8 (g13.18) | file-lock | page with a padlock | document | variant: + lock | file-lock | document_lock_16 | protected file |
| 11 | r2c1 5.9 (g13.19) | file-pdf | page with a PDF label | document | variant: + PDF label | file-text | document_pdf_16 | PDF files |
| 11 | r2c1 5.10 (g13.20) | file-add | page with + | document-add | exists | file-plus | document_add_16 | new file |

## Image 14 — Cursor: Icons sheet

85 icons: 62 exists, 16 variant, 7 missing.

| image | tile row.col position | concept | what it shows | area | status | lucide | fluent | uses |
|---|---|---|---|---|---|---|---|---|
| 14 | r0c0 1.1 (band A, col 1) | globe | globe with meridian and parallels | globe | exists | globe | globe_16 | language, web |
| 14 | r0c0 1.2 (band A, col 2) | navigation-pointer | notched arrowhead pointer aimed up-right (Cursor's agent/cursor mark?) | — | missing | navigation | location_arrow_16 | agent, cursor, locate |
| 14 | r0c0 1.3 (band A, col 3) | cube | isometric cube | package | exists | box | cube_16 | 3D object, package |
| 14 | r0c0 1.4 (band A, col 4) | mic | microphone | mic | exists | mic | mic_16 | dictate, voice |
| 14 | r0c0 1.5 (band A, col 5) | clock | clock | clock | exists | clock | clock_16 | time, history |
| 14 | r0c0 1.6 (band A, col 6) | tag | price tag with a hole | tag | exists | tag | tag_16 | label, tag |
| 14 | r0c0 1.7 (band A, col 7) | sparkles | large four-point sparkle with a small one at top right (Area drops the satellite by owner preference) | sparkle | exists | sparkles | sparkle_16 | AI, generate |
| 14 | r0c0 1.8 (band A, col 8) | at | @ sign | at | exists | at-sign | mention_16 | mention, email |
| 14 | r0c1 1.1 (band A, col 9) | database | three stacked disks | database | exists | database | database_stack_16 | data, DB |
| 14 | r0c1 1.2 (band A, col 10) | video | video camera | video | exists | video | video_16 | video, camera |
| 14 | r0c1 1.3 (band A, col 11) | arrow-right-to-line | arrow right into a vertical bar (→\|) | arrow-right | variant: + end bar | arrow-right-to-line | keyboard_tab_20 | tab key, move to end |
| 14 | r0c1 1.4 (band A, col 12) | add | plus | add | exists | plus | add_16 | add, new |
| 14 | r0c1 1.5 (band A, col 13) | dismiss | × mark | dismiss | exists | x | dismiss_16 | close, remove |
| 14 | r0c1 1.6 (band A, col 14) | arrow-up | arrow pointing up | arrow-up | exists | arrow-up | arrow_up_16 | send, up |
| 14 | r0c1 1.7 (band A, col 15) | arrow-down | arrow pointing down | arrow-down | exists | arrow-down | arrow_down_16 | down, descending |
| 14 | r0c1 1.8 (band A, col 16) | arrow-left | arrow pointing left | arrow-left | exists | arrow-left | arrow_left_16 | back, previous |
| 14 | r0c1 1.9 (band A, col 17) | arrow-right | arrow pointing right | arrow-right | exists | arrow-right | arrow_right_16 | next, go |
| 14 | r0c0 2.1 (band B, col 1) | image | square picture frame with sun and hill | image | exists | image | image_16 | image, media |
| 14 | r0c0 2.2 (band B, col 2) | image-landscape | landscape picture frame with sun and hill | image | exists | image | image_16 | image, photo |
| 14 | r0c0 2.3 (band B, col 3) | camera | camera | camera | exists | camera | camera_16 | photo, capture |
| 14 | r0c0 2.4 (band B, col 4) | rectangle-stack | two stacked landscape rectangles (back one shown as an L) | rectangle | variant: stacked copy | square-stack | stack_16 | windows, duplicates, versions |
| 14 | r0c0 2.5 (band B, col 5) | panel-left | window with a left pane | panel-left | exists | panel-left | panel_left_16 | sidebar, navigation |
| 14 | r0c0 2.6 (band B, col 6) | panel-bottom | window with a bottom pane | panel-bottom | exists | panel-bottom | panel_bottom_20 | bottom panel, terminal |
| 14 | r0c0 2.7 (band B, col 7) | panel-right | window with a right pane | panel-right | exists | panel-right | panel_right_16 | inspector, side chat |
| 14 | r0c0 2.8 (band B, col 8) | split | rectangle split in half by a vertical divider | columns | exists | columns-2 | split_vertical_16 | split view, columns |
| 14 | r0c1 2.1 (band B, col 9) | folder | folder | folder | exists | folder | folder_16 | folder, project |
| 14 | r0c1 2.2 (band B, col 10) | terminal | window with >_ | terminal | exists | square-terminal | window_console_20 | terminal, shell |
| 14 | r0c1 2.3 (band B, col 11) | more-horizontal | three dots in a row (no filled cut) | more-horizontal | exists | ellipsis | more_horizontal_16 | more actions |
| 14 | r0c1 2.4 (band B, col 12) | search | magnifier | search | exists | search | search_16 | search, find |
| 14 | r0c1 2.5 (band B, col 13) | cursor-logo | hexagon with a pointer inside (Cursor brand) | — | missing | — | — | brand, product |
| 14 | r0c1 2.6 (band B, col 14) | file | page with a folded corner | document | exists | file | document_16 | file, document |
| 14 | r0c1 2.7 (band B, col 15) | files | two stacked pages | document | variant: stacked copy | files | document_multiple_16 | multiple files |
| 14 | r0c1 2.8 (band B, col 16) | file-add | page with + (no filled cut) | document-add | exists | file-plus | document_add_16 | new file |
| 14 | r0c1 2.9 (band B, col 17) | pop-out | ↗ in a square over a dashed square behind | — | missing | square-arrow-out-up-right | window_new_16 | pop out, new window, detach |
| 14 | r1c0 1.1 (band C, col 1) | sliders | two sliders with knobs | options | exists | sliders-horizontal | options_16 | settings, adjust |
| 14 | r1c0 1.2 (band C, col 2) | credit-card | card with a stripe and a short dash | credit-card | exists | credit-card | payment_16 | payment, billing |
| 14 | r1c0 1.3 (band C, col 3) | laptop | laptop | laptop | exists | laptop | laptop_16 | device, local |
| 14 | r1c0 1.4 (band C, col 4) | desktop | monitor on a stand | desktop | exists | monitor | desktop_16 | device, system |
| 14 | r1c0 1.5 (band C, col 5) | git-commit-vertical | vertical line through a small circle | git-commit | exists | git-commit-vertical | — | commit, timeline |
| 14 | r1c0 1.6 (band C, col 6) | git-branch | branch with two nodes | git-branch | exists | git-branch | branch_16 | branch, version control |
| 14 | r1c0 1.7 (band C, col 7) | git-merge | node line curving into a second node | git-merge | exists | git-merge | merge_16 | merge, version control |
| 14 | r1c0 1.8 (band C, col 8) | git-pull-request | pull-request nodes and curve | git-pull-request | exists | git-pull-request | branch_request_16 | pull request, review |
| 14 | r1c1 1.1 (band C, col 9) | arrow-down-dashed | arrow down with a dashed shaft (outline only) | arrow-down | variant: dashed shaft | arrow-down | arrow_down_16 | pending download, fetch |
| 14 | r1c1 1.2 (band C, col 10) | arrow-down-to-node | arrow down onto a node on a horizontal line | git-commit | variant: + arrow in | arrow-down-to-dot | arrow_step_in_16 | git pull, fetch |
| 14 | r1c1 1.3 (band C, col 11) | arrow-up-from-node | arrow up from a node on a horizontal line | git-commit | variant: + arrow out | arrow-up-from-dot | arrow_step_out_16 | git push, publish |
| 14 | r1c1 1.4 (band C, col 12) | command | ⌘ key | command | exists | command | key_command_16 | shortcuts, command key |
| 14 | r1c1 1.5 (band C, col 13) | moon | crescent moon | moon | exists | moon | weather_moon_16 | dark mode |
| 14 | r1c1 1.6 (band C, col 14) | sun | sun with rays | sun | exists | sun | weather_sunny_16 | light mode |
| 14 | r1c1 1.7 (band C, col 15) | route-x | dot, S-shaped path and an × at the end (Area spline is a curve between two dots) | — | missing | route | — | route, trace, destination |
| 14 | r1c1 1.8 (band C, col 16) | cloud | cloud | cloud | exists | cloud | cloud_16 | cloud, sync |
| 14 | r1c1 1.9 (band C, col 17) | nodes-tripod? | three circles joined at a centre point | — | missing | git-fork | organization_16 | graph, integrations? |
| 14 | r1c0 2.1 (band D, col 1) | expand-corners | four diagonal arrows pointing out to the corners | expand | variant: four arrows instead of two | expand | arrow_maximize_16 | full screen, maximize |
| 14 | r1c0 2.2 (band D, col 2) | shrink | four diagonal arrows pointing in from the corners | collapse | variant: four arrows instead of two | shrink | arrow_minimize_16 | exit full screen |
| 14 | r1c0 2.3 (band D, col 3) | maximize-2 | two diagonal arrows pointing outward | expand | exists | maximize-2 | arrow_maximize_16 | expand, full screen |
| 14 | r1c0 2.4 (band D, col 4) | minimize-2 | two diagonal arrows pointing inward | collapse | exists | minimize-2 | arrow_minimize_16 | collapse, exit full screen |
| 14 | r1c0 2.5 (band D, col 5) | link | chain link | link | exists | link | link_16 | link, URL |
| 14 | r1c0 2.6 (band D, col 6) | person | head and shoulders | person | exists | user | person_16 | profile, account |
| 14 | r1c0 2.7 (band D, col 7) | arrow-big-up | outlined block arrow up | shift | exists | arrow-big-up | keyboard_shift_16 | shift key, upvote |
| 14 | r1c0 2.8 (band D, col 8) | arrow-big-right | outlined block arrow right | shift | variant: rotated 90° | arrow-big-right | keyboard_shift_16 | forward, next |
| 14 | r1c1 2.1 (band D, col 9) | arrow-big-down | outlined block arrow down | shift | variant: rotated 180° | arrow-big-down | keyboard_shift_16 | move down |
| 14 | r1c1 2.2 (band D, col 10) | arrow-big-left | outlined block arrow left | shift | variant: rotated 90° | arrow-big-left | keyboard_shift_16 | back, previous |
| 14 | r1c1 2.3 (band D, col 11) | arrow-up-circle | arrow up in a circle | arrow-up-circle | exists | circle-arrow-up | arrow_circle_up_16 | submit, send |
| 14 | r1c1 2.4 (band D, col 12) | arrow-right-circle | arrow right in a circle | arrow-up-circle | variant: rotated 90° | circle-arrow-right | arrow_circle_right_16 | next, go |
| 14 | r1c1 2.5 (band D, col 13) | arrow-down-circle | arrow down in a circle | arrow-up-circle | variant: rotated 180° | circle-arrow-down | arrow_circle_down_16 | scroll down |
| 14 | r1c1 2.6 (band D, col 14) | arrow-left-circle | arrow left in a circle | arrow-up-circle | variant: rotated 90° | circle-arrow-left | arrow_circle_left_16 | back, previous |
| 14 | r1c1 2.7 (band D, col 15) | pencil | pencil | pencil | exists | pencil | edit_16 | edit, rename |
| 14 | r1c1 2.8 (band D, col 16) | compose | square with a pencil | compose | exists | square-pen | compose_16 | new chat, edit |
| 14 | r1c1 2.9 (band D, col 17) | pie-chart | circle with a quarter wedge | pie-chart | exists | chart-pie | data_pie_16 | breakdown, usage |
| 14 | r1c0 3.1 (band E, col 1) | help | ? in a circle | help | exists | circle-question-mark | question_circle_16 | help, support |
| 14 | r1c0 3.2 (band E, col 2) | thumbs-up | thumbs up | thumbs-up | exists | thumbs-up | thumb_like_16 | like, good response |
| 14 | r1c0 3.3 (band E, col 3) | thumbs-down | thumbs down | thumbs-down | exists | thumbs-down | thumb_dislike_16 | dislike, bad response |
| 14 | r1c0 3.4 (band E, col 4) | more-vertical | three dots in a column | more-vertical | exists | ellipsis-vertical | more_vertical_16 | more actions |
| 14 | r1c0 3.5 (band E, col 5) | circle-dashed-check | check inside a dashed circle | status-available | variant: dashed ring | circle-dashed-check | checkmark_circle_hint_16 | pending approval, in review |
| 14 | r1c0 3.6 (band E, col 6) | prohibited | circle with a slash | prohibited | exists | ban | prohibited_16 | blocked, not allowed |
| 14 | r1c0 3.7 (band E, col 7) | compass | compass | compass | exists | compass | compass_northwest_16 | explore, discover |
| 14 | r1c0 3.8 (band E, col 8) | arrow-left-right | one double-headed horizontal arrow (↔) | — | missing | move-horizontal | arrow_bidirectional_left_right_16 | resize width, swap |
| 14 | r1c1 3.1 (band E, col 9) | arrow-up-down | one double-headed vertical arrow (↕) | — | missing | move-vertical | arrow_bidirectional_up_down_16 | resize height, reorder |
| 14 | r1c1 3.2 (band E, col 10) | list-filter | three centred lines, each shorter (funnel of lines) | filter | exists | list-filter | filter_16 | filter, refine |
| 14 | r1c1 3.3 (band E, col 11) | circle-dashed | dashed circle | ellipse | variant: dashed | circle-dashed | circle_hint_16 | draft, pending, placeholder |
| 14 | r1c1 3.4 (band E, col 12) | calendar | calendar | calendar | exists | calendar | calendar_16 | date, schedule |
| 14 | r1c1 3.5 (band E, col 13) | panel-left-close | window with a left pane and a < chevron | panel-left-close | exists | panel-left-close | panel_left_contract_16 | collapse sidebar |
| 14 | r1c1 3.6 (band E, col 14) | panel-left-open | window with a left pane and a > chevron | panel-left-open | exists | panel-left-open | panel_left_expand_16 | expand sidebar |
| 14 | r1c1 3.7 (band E, col 15) | bell | bell | bell | exists | bell | alert_16 | notifications, alerts |
| 14 | r1c1 3.8 (band E, col 16) | layers | three stacked layers | layers | exists | layers | layer_20 | layers, stack |
| 14 | r1c1 3.9 (band E, col 17) | lightbulb | light bulb | lightbulb | exists | lightbulb | lightbulb_16 | tip, idea |

## Image 10 — Cursor Icons Migration (older set)

187 icons: 88 exists, 64 variant, 35 missing.

| image | tile row.col position | concept | what it shows | area | status | lucide | fluent | uses |
|---|---|---|---|---|---|---|---|---|
| 10 | r0c0 1.1 (g1.1) | person-circle | person in a circle · green cell | person-circle | exists | circle-user | person_circle_16 | account, profile |
| 10 | r0c0 1.2 (g1.2) | circle-stack-filled | filled circle in front of an outlined circle (activate breakpoints) · green cell | ellipse | variant: stacked copy, front filled | circle-pile | — | toggle all breakpoints |
| 10 | r0c0 1.3 (g1.3) | add | plus · green cell | add | exists | plus | add_16 | add, new |
| 10 | r0c0 1.4 (g1.4) | add | plus, duplicate · pink cell | add | exists | plus | add_16 | add, new |
| 10 | r0c0 1.5 (g1.5) | archive | box with lid and handle slot · green cell | archive | exists | archive | archive_16 | archive items |
| 10 | r0c0 1.6 (g1.6) | arrow-left-right | one double-headed horizontal arrow (↔) · green cell | — | missing | move-horizontal | arrow_bidirectional_left_right_16 | resize width, swap |
| 10 | r0c0 1.7 (g1.7) | arrow-down-circle | arrow down in a circle · green cell | arrow-up-circle | variant: rotated 180° | circle-arrow-down | arrow_circle_down_16 | scroll down |
| 10 | r0c0 1.8 (g1.8) | arrow-left-circle | arrow left in a circle · green cell | arrow-up-circle | variant: rotated 90° | circle-arrow-left | arrow_circle_left_16 | back, previous |
| 10 | r0c1 1.1 (g1.9) | arrow-right-circle | arrow right in a circle · green cell | arrow-up-circle | variant: rotated 90° | circle-arrow-right | arrow_circle_right_16 | next, forward |
| 10 | r0c1 1.2 (g1.10) | arrow-up-circle | arrow up in a circle · green cell | arrow-up-circle | exists | circle-arrow-up | arrow_circle_up_16 | submit, send |
| 10 | r0c1 1.3 (g1.11) | arrow-down | arrow pointing down · green cell | arrow-down | exists | arrow-down | arrow_down_16 | down, descending |
| 10 | r0c1 1.4 (g1.12) | arrow-left | arrow pointing left · green cell | arrow-left | exists | arrow-left | arrow_left_16 | back, previous |
| 10 | r0c1 1.5 (g1.13) | arrow-left | arrow pointing left, duplicate · pink cell | arrow-left | exists | arrow-left | arrow_left_16 | back, previous |
| 10 | r0c1 1.6 (g1.14) | arrow-right | arrow pointing right · green cell | arrow-right | exists | arrow-right | arrow_right_16 | next, forward |
| 10 | r0c1 1.7 (g1.15) | arrow-down-small | small arrow down · pink cell | arrow-down | exists | arrow-down | arrow_down_16 | inline down |
| 10 | r0c1 1.8 (g1.16) | arrow-left-small | small arrow left · pink cell | arrow-left | exists | arrow-left | arrow_left_16 | inline back |
| 10 | r0c1 1.9 (g1.17) | arrow-right-small | small arrow right · pink cell | arrow-right | exists | arrow-right | arrow_right_16 | inline next |
| 10 | r0c0 2.1 (g2.1) | arrow-up-small | small arrow up · pink cell | arrow-up | exists | arrow-up | arrow_up_16 | inline up |
| 10 | r0c0 2.2 (g2.2) | arrow-right-left | two stacked opposed arrows (⇄); Area sort turned 90° · green cell | sort | variant: rotated 90° | arrow-right-left | arrow_swap_16 | swap, exchange |
| 10 | r0c0 2.3 (g2.3) | arrow-up | arrow pointing up · green cell | arrow-up | exists | arrow-up | arrow_up_16 | send, up |
| 10 | r0c0 2.4 (g2.4) | arrow-up-right | diagonal arrow up-right · green cell | arrow-up-right | exists | arrow-up-right | arrow_up_right_16 | open link |
| 10 | r0c0 2.5 (g2.5) | arrow-up-right-square | ↗ inside a rounded square · green cell | arrow-up-right | variant: + square | square-arrow-up-right | arrow_square_up_right_20 | open, pop out |
| 10 | r0c0 2.6 (g2.6) | arrow-up | arrow pointing up, duplicate · pink cell | arrow-up | exists | arrow-up | arrow_up_16 | up, ascending |
| 10 | r0c0 2.7 (g2.7) | maximize-2 | two diagonal arrows out, filled heads · green cell | expand | exists | maximize-2 | arrow_maximize_16 | expand, full screen |
| 10 | r0c0 2.8 (g2.8) | minimize-2 | two diagonal arrows in, filled heads · green cell | collapse | exists | minimize-2 | arrow_minimize_16 | collapse, exit full screen |
| 10 | r0c1 2.1 (g2.9) | asterisk | six-armed asterisk · green cell | — | missing | asterisk | text_asterisk_16 | required, wildcard |
| 10 | r0c1 2.2 (g2.10) | at | @ sign · green cell | at | exists | at-sign | mention_16 | mention, email |
| 10 | r0c1 2.3 (g2.11) | attach | paperclip · pink cell | attach | exists | paperclip | attach_16 | attach file |
| 10 | r0c1 2.4 (g2.12) | beaker | conical flask · green cell | flask | exists | flask-conical | beaker_16 | labs, experiments |
| 10 | r0c1 2.5 (g2.13) | beaker-stop | conical flask with a prohibited badge · green cell | flask | variant: + prohibited badge | flask-conical-off | beaker_off_20 | stop tests, disable labs |
| 10 | r0c1 2.6 (g2.14) | bell | bell · green cell | bell | exists | bell | alert_16 | notifications, alerts |
| 10 | r0c1 2.7 (g2.15) | bell-dot | bell with a filled dot · green cell | bell | variant: + dot | bell-dot | alert_badge_16 | unread notifications |
| 10 | r0c1 2.8 (g2.16) | bell-off | bell with a slash · green cell | bell-off | exists | bell-off | alert_off_16 | mute notifications |
| 10 | r0c1 2.9 (g2.17) | bell-off-dot | slashed bell with a dot · pink cell | bell-off | variant: + dot | bell-off | alert_off_16 | muted with unread |
| 10 | r0c0 3.1 (g3.1) | bold | letter B · green cell | bold | exists | bold | text_bold_16 | bold text |
| 10 | r0c0 3.2 (g3.2) | book-open-text | open book with text lines · green cell | book | exists | book-open-text | book_open_16 | docs, reading |
| 10 | r0c0 3.3 (g3.3) | bookmark | bookmark ribbon · green cell | bookmark | exists | bookmark | bookmark_16 | save, bookmark |
| 10 | r0c0 3.4 (g3.4) | braces-dot | { } with a filled dot · green cell | braces | variant: + dot | braces | braces_16 | modified code |
| 10 | r0c0 3.5 (g3.5) | braces-error | { } with an × in a circle badge · green cell | braces | variant: + error badge | braces | braces_dismiss_16 | code error, invalid JSON |
| 10 | r0c0 3.6 (g3.6) | brain | brain · green cell | — | missing | brain | brain_16 | AI, thinking |
| 10 | r0c0 3.7 (g3.7) | git-branch | three circles joined as a branch · green cell | git-branch | exists | git-branch | branch_16 | branch, source control |
| 10 | r0c0 3.8 (g3.8) | git-merge | two stacked circles with a third joined on the right · pink cell | git-merge | exists | git-merge | merge_16 | merge, source control |
| 10 | r0c1 3.1 (g3.9) | briefcase | briefcase · green cell | briefcase | exists | briefcase | briefcase_16 | work, business |
| 10 | r0c1 3.2 (g3.10) | broadcast | dot on a stem inside concentric arcs · pink cell | — | missing | radio | live_16 | live, broadcast, podcast |
| 10 | r0c1 3.3 (g3.11) | browser | window with a header band · green cell | panel-top | exists | panel-top | window_16 | browser, web preview |
| 10 | r0c1 3.4 (g3.12) | broom | broom sweeping (brush) · green cell | — | missing | brush-cleaning | broom_16 | clear, clean up |
| 10 | r0c1 3.5 (g3.13) | chat-edit | square bubble with a pencil (Area compose is the plain square version) · green cell | chat | variant: + pencil | square-pen | comment_edit_16 | edit message, draft |
| 10 | r0c1 3.6 (g3.14) | bug | bug · green cell | bug | exists | bug | bug_16 | debug, report bug |
| 10 | r0c1 3.7 (g3.15) | check-refresh | circular arrow round a check (Bugbot/build?) · green cell | refresh | variant: + check inside | refresh-cw | arrow_sync_checkmark_20 | re-run checks, review loop |
| 10 | r0c1 3.8 (g3.16) | calendar-dots | calendar with a grid of day dots · green cell | calendar | exists | calendar | calendar_16 | date, schedule |
| 10 | r0c1 3.9 (g3.17) | calendar-header | calendar with a solid header band · pink cell | calendar | exists | calendar | calendar_16 | date, schedule |
| 10 | r0c0 4.1 (g4.1) | call-incoming | phone handset with ↙ · pink cell | call | variant: + arrow in | phone-incoming | call_inbound_16 | incoming call |
| 10 | r0c0 4.2 (g4.2) | call-outgoing | phone handset with ↗ · pink cell | call | variant: + arrow out | phone-outgoing | call_outbound_16 | outgoing call |
| 10 | r0c0 4.3 (g4.3) | case-sensitive | letters Aa · green cell | — | missing | case-sensitive | text_case_title_16 | match case in search |
| 10 | r0c0 4.4 (g4.4) | comment | square speech bubble · green cell | chat | exists | message-square | comment_16 | comment, feedback |
| 10 | r0c0 4.5 (g4.5) | comment-question | speech bubble with ? · green cell | chat | variant: + question mark | message-square | chat_help_16 | ask, help |
| 10 | r0c0 4.6 (g4.6) | chat-sparkle | speech bubble with sparkles · pink cell | chat | variant: + sparkle | bot-message-square | chat_sparkle_16 | AI chat |
| 10 | r0c0 4.7 (g4.7) | chat-sparkle-error | sparkle bubble with an × badge · pink cell | chat | variant: + sparkle + error badge | bot-message-square | chat_sparkle_16 | AI chat failed |
| 10 | r0c0 4.8 (g4.8) | chat-sparkle-warning | sparkle bubble with a warning-triangle badge · pink cell | chat | variant: + sparkle + warning badge | bot-message-square | chat_sparkle_16 | AI chat warning |
| 10 | r0c1 4.1 (g4.9) | check | check mark · green cell | check | exists | check | checkmark_16 | done, confirm |
| 10 | r0c1 4.2 (g4.10) | check-all | two overlapping check marks · green cell | check | variant: doubled | check-check | checkmark_16 | all done, read |
| 10 | r0c1 4.3 (g4.11) | pass | check in a circle · green cell | status-available | exists | circle-check | checkmark_circle_16 | passed, success |
| 10 | r0c1 4.4 (g4.12) | check-heavy | heavy check mark · pink cell | check | exists | check | checkmark_16 | done, confirm |
| 10 | r0c1 4.5 (g4.13) | checklist | three small checks beside lines · green cell | list-checklist | exists | list-checks | multiselect_ltr_16 | checklist, tasks |
| 10 | r0c1 4.6 (g4.14) | chevrons-left | double chevron left · green cell | chevron-left | variant: doubled | chevrons-left | chevron_double_left_16 | first page, collapse |
| 10 | r0c1 4.7 (g4.15) | chevron-down | chevron down · green cell | chevron-down | exists | chevron-down | chevron_down_16 | expand, dropdown |
| 10 | r0c1 4.8 (g4.16) | chevrons-right-dashed | double chevron right, the trailing one dotted · green cell | chevron-right | variant: doubled, trailing one dashed | chevrons-right | chevron_double_right_16 | skip, step over? |
| 10 | r0c1 4.9 (g4.17) | chevron-left | chevron left · green cell | chevron-left | exists | chevron-left | chevron_left_16 | previous, back |
| 10 | r1c0 1.1 (g5.1) | chevron-right | chevron right · green cell | chevron-right | exists | chevron-right | chevron_right_16 | next, open |
| 10 | r1c0 1.2 (g5.2) | chevron-up | chevron up · green cell | chevron-up | exists | chevron-up | chevron_up_16 | collapse, move up |
| 10 | r1c0 1.3 (g5.3) | chevrons-up-down | chevrons pointing apart vertically (grey, fold) · green cell | chevrons-up-down | exists | chevrons-up-down | chevron_up_down_16 | select, fold |
| 10 | r1c0 1.4 (g5.4) | chip | square with pins on every side · green cell | chip | exists | cpu | developer_board_16 | processor, model |
| 10 | r1c0 1.5 (g5.5) | window-close | × (window chrome close) · pink cell | dismiss | exists | x | dismiss_16 | close window |
| 10 | r1c0 1.6 (g5.6) | window-maximize | plain square (window chrome maximize) · pink cell | stop | exists | square | square_16 | maximize window |
| 10 | r1c0 1.7 (g5.7) | window-minimize | horizontal line (window chrome minimize) · pink cell | minus | exists | minus | subtract_16 | minimize window |
| 10 | r1c0 1.8 (g5.8) | window-restore | two overlapping squares (window chrome restore) · green cell | copy | exists | copy | square_multiple_16 | restore window |
| 10 | r1c1 1.1 (g5.9) | circle-small | small outlined circle · pink cell | ellipse | exists | circle | circle_16 | status, bullet |
| 10 | r1c1 1.2 (g5.10) | circle-small-filled | small filled dot · pink cell | ellipse | exists | circle | circle_16 | status, bullet |
| 10 | r1c1 1.3 (g5.11) | circle-large | large outlined circle · green cell | ellipse | exists | circle | circle_16 | shape, status |
| 10 | r1c1 1.4 (g5.12) | circle-large-filled | large filled disc · pink cell | ellipse | exists | circle | circle_16 | shape, status |
| 10 | r1c1 1.5 (g5.13) | loading-radial | eight radial dashes (spinner) · green cell | loader | exists | loader | spinner_ios_16 | loading, in progress |
| 10 | r1c1 1.6 (g5.14) | circle-slash | circle with a slash · green cell | prohibited | exists | circle-slash | prohibited_16 | blocked, disabled |
| 10 | r1c1 1.7 (g5.15) | circle-tiny | tiny outlined circle · pink cell | ellipse | exists | circle | circle_16 | status dot |
| 10 | r1c1 1.8 (g5.16) | dot | tiny filled dot · pink cell | ellipse | exists | circle | circle_16 | status dot, bullet |
| 10 | r1c1 1.9 (g5.17) | circuit-board | board with traces and nodes · pink cell | — | missing | circuit-board | developer_board_16 | hardware, integrations |
| 10 | r1c0 2.1 (g6.1) | clear-all | three lines with an × · green cell | list | variant: + x | list-x | text_bullet_list_dismiss_20 | clear all, clear output |
| 10 | r1c0 2.2 (g6.2) | clipboard-list | clipboard with text lines · green cell | clipboard | variant: + text lines | clipboard-list | clipboard_text_ltr_16 | tasks, notes |
| 10 | r1c0 2.3 (g6.3) | clipboard-arrows | clipboard with ↑↓ arrows · pink cell | clipboard | variant: + up/down arrows | clipboard | clipboard_arrow_right_16 | paste special, sync clipboard? |
| 10 | r1c0 2.4 (g6.4) | copy-download | stacked rounded squares, ↓ in the front one · pink cell | copy | variant: + arrow-down | square-stack | copy_arrow_right_16 | clone, download copy |
| 10 | r1c0 2.5 (g6.5) | close | × · pink cell | dismiss | exists | x | dismiss_16 | close, dismiss |
| 10 | r1c0 2.6 (g6.6) | close-all | stacked squares with × in front · green cell | copy | variant: + x | copy-x | dismiss_square_multiple_16 | close all tabs |
| 10 | r1c0 2.7 (g6.7) | cloud | cloud · green cell | cloud | exists | cloud | cloud_16 | cloud, sync |
| 10 | r1c0 2.8 (g6.8) | cloud-download | cloud with a down arrow · green cell | cloud-download | exists | cloud-download | cloud_arrow_down_16 | download from cloud |
| 10 | r1c1 2.1 (g6.9) | cloud | cloud, duplicate · pink cell | cloud | exists | cloud | cloud_16 | cloud, sync |
| 10 | r1c1 2.2 (g6.10) | cloud-upload | cloud with an up arrow · green cell | cloud-upload | exists | cloud-upload | cloud_arrow_up_16 | upload to cloud |
| 10 | r1c1 2.3 (g6.11) | code-xml | </> with a slash · green cell | code | variant: + slash | code-xml | code_16 | code, markup |
| 10 | r1c1 2.4 (g6.12) | panel-text? | rectangle with a left band and text lines on the right · pink cell | panel-left | variant: + text lines | notebook-text | notebook_16 | outline?, codebase?, docs |
| 10 | r1c1 2.5 (g6.13) | chat-code | square bubble with <> (code review?) · green cell | chat | variant: + code | message-square-code | comment_16 | code review, code chat |
| 10 | r1c1 2.6 (g6.14) | coffee | steaming cup · pink cell | coffee | exists | coffee | drink_coffee_16 | break, sponsor |
| 10 | r1c1 2.7 (g6.15) | collapse-all | stacked squares with − in front · green cell | copy | variant: + minus | copy-minus | subtract_square_multiple_16 | collapse all |
| 10 | r1c1 2.8 (g6.16) | copy-portrait | two stacked portrait sheets · green cell | copy | exists | copy | copy_16 | copy, collection? |
| 10 | r1c1 2.9 (g6.17) | color-mode | half-filled circle · green cell | contrast | exists | contrast | circle_half_fill_16 | theme, appearance |
| 10 | r1c0 3.1 (g7.1) | combine | three small squares, an arrow, one tall bar · pink cell | — | missing | combine | merge_16 | combine, merge items |
| 10 | r1c0 3.2 (g7.2) | comment | square speech bubble · green cell | chat | exists | message-square | comment_16 | comment, feedback |
| 10 | r1c0 3.3 (g7.3) | comment-discussion | two overlapping bubbles · green cell | chat-multiple | exists | messages-square | comment_multiple_16 | discussion, threads |
| 10 | r1c0 3.4 (g7.4) | comment-discussion-sparkle | two bubbles with sparkles · pink cell | chat-multiple | variant: + sparkle | messages-square | chat_multiple_16 | AI conversations |
| 10 | r1c0 3.5 (g7.5) | comment-draft | dashed speech bubble · green cell | chat | variant: dashed | message-square-dashed | comment_16 | draft comment |
| 10 | r1c0 3.6 (g7.6) | comment-unresolved | speech bubble with a filled dot · green cell | chat | variant: + dot | message-square-dot | comment_badge_16 | unresolved, unread |
| 10 | r1c0 3.7 (g7.7) | compass | compass · green cell | compass | exists | compass | compass_northwest_16 | explore, discover |
| 10 | r1c0 3.8 (g7.8) | compass-check | compass with a check badge · green cell | compass | variant: + check | compass | compass_northwest_16 | explored, visited |
| 10 | r1c1 3.1 (g7.9) | compass-dot | compass with a dot badge · green cell | compass | variant: + dot | compass | compass_northwest_16 | new to explore |
| 10 | r1c1 3.2 (g7.10) | compose | square with a pencil · green cell | compose | exists | square-pen | compose_16 | new chat, edit |
| 10 | r1c1 3.3 (g7.11) | copilot | goggled assistant face (GitHub Copilot brand) · pink cell | — | missing | bot | bot_16 | Copilot, AI assistant |
| 10 | r1c1 3.4 (g7.12) | copilot-blocked | Copilot face with a − badge · pink cell | — | missing | bot-off | bot_16 | Copilot blocked |
| 10 | r1c1 3.5 (g7.13) | copilot-error | Copilot face with an × badge · pink cell | — | missing | bot | bot_16 | Copilot error |
| 10 | r1c1 3.6 (g7.14) | copilot-in-progress | Copilot face with a sync badge · pink cell | — | missing | bot | bot_16 | Copilot working |
| 10 | r1c1 3.7 (g7.15) | copilot-large | larger Copilot face · pink cell | — | missing | bot | bot_16 | Copilot, AI assistant |
| 10 | r1c1 3.8 (g7.16) | copilot-unavailable | Copilot face with an outlined × badge · pink cell | — | missing | bot-off | bot_16 | Copilot unavailable |
| 10 | r1c1 3.9 (g7.17) | copilot-snooze | Copilot face with zZ · pink cell | — | missing | bot | bot_16 | Copilot snoozed |
| 10 | r1c0 4.1 (g8.1) | copilot-success | Copilot face with a check badge · pink cell | — | missing | bot | bot_16 | Copilot ready |
| 10 | r1c0 4.2 (g8.2) | copilot-disabled | Copilot face with a slash · pink cell | — | missing | bot-off | bot_16 | Copilot disabled |
| 10 | r1c0 4.3 (g8.3) | copilot-warning | Copilot face with a ! badge · pink cell | — | missing | bot | bot_16 | Copilot warning |
| 10 | r1c0 4.4 (g8.4) | copilot-warning-large | large Copilot face with a ! badge · pink cell | — | missing | bot | bot_16 | Copilot warning |
| 10 | r1c0 4.5 (g8.5) | copilot-large-alt | large Copilot face · pink cell | — | missing | bot | bot_16 | Copilot, AI assistant |
| 10 | r1c0 4.6 (g8.6) | copy-files | two overlapping pages · green cell | copy | exists | copy | document_copy_16 | copy files |
| 10 | r1c0 4.7 (g8.7) | copy | two stacked rounded squares · pink cell | copy | exists | copy | copy_16 | copy to clipboard |
| 10 | r1c0 4.8 (g8.8) | circle-stack-check | stacked circles with a check in front · green cell | ellipse | variant: stacked copy + check | circle-check | circle_multiple_subtract_checkmark_20 | coverage?, all passed |
| 10 | r1c1 4.1 (g8.9) | credit-card | card with a stripe and a short dash · green cell | credit-card | exists | credit-card | payment_16 | billing, payment |
| 10 | r1c1 4.2 (g8.10) | cube | isometric cube · green cell | package | exists | box | cube_16 | 3D object, package |
| 10 | r1c1 4.3 (g8.11) | nodes-tripod? | three filled dots joined at a centre point · green cell | — | missing | git-fork | organization_16 | graph, integrations? |
| 10 | r1c1 4.4 (g8.12) | cursor-logo | hexagon with a pointer inside (Cursor brand) · green cell | — | missing | — | — | brand, product |
| 10 | r1c1 4.5 (g8.13) | globe | wireframe globe · pink cell | globe | exists | globe | globe_16 | web, language |
| 10 | r1c1 4.6 (g8.14) | cursor-logo-alt | hexagon with a pointer, heavier (Cursor brand) · pink cell | — | missing | — | — | brand, product |
| 10 | r1c1 4.7 (g8.15) | browser-pointer | window with a mouse pointer at lower right · pink cell | panel-top | variant: + pointer | square-mouse-pointer | desktop_cursor_16 | browser control, computer use |
| 10 | r1c1 4.8 (g8.16) | cursor-logo-alt-2 | hexagon with a pointer (Cursor brand) · pink cell | — | missing | — | — | brand, product |
| 10 | r1c1 4.9 (g8.17) | cursor-logo-alt-3 | hexagon with a pointer (Cursor brand) · pink cell | — | missing | — | — | brand, product |
| 10 | r2c0 1.1 (g9.1) | database | three stacked disks · pink cell | database | exists | database | database_stack_16 | data, DB |
| 10 | r2c0 1.2 (g9.2) | dash | short horizontal line · pink cell | minus | exists | minus | subtract_16 | dash, minus |
| 10 | r2c0 1.3 (g9.3) | dashboard-gauge | gauge dial inside a circle · green cell | gauge | exists | gauge | gauge_16 | dashboard, performance |
| 10 | r2c0 1.4 (g9.4) | database-cylinder | single cylinder · green cell | database | exists | database | database_16 | data, DB |
| 10 | r2c0 1.5 (g9.5) | debug-x | bug with an × on its body · pink cell | bug | variant: + x | bug-off | bug_prohibited_20 | debug error?, stop debugging |
| 10 | r2c0 1.6 (g9.6) | debug-alt | bug with a double-chevron play mark · green cell | bug | variant: + play | bug-play | bug_16 | start debugging |
| 10 | r2c0 1.7 (g9.7) | debug-alt-small | bug with a play triangle · green cell | bug | variant: + play | bug-play | bug_16 | start debugging |
| 10 | r2c0 1.8 (g9.8) | debug-alt-outline | bug with a small play outline · pink cell | bug | variant: + play | bug-play | bug_16 | run and debug |
| 10 | r2c1 1.1 (g9.9) | breakpoint-conditional | filled dot with = · pink cell | — | missing | circle-equal | — | conditional breakpoint |
| 10 | r2c1 1.2 (g9.10) | breakpoint-conditional-unverified | outlined circle with = · pink cell | — | missing | circle-equal | — | unverified breakpoint |
| 10 | r2c1 1.3 (g9.11) | breakpoint-data | filled hexagon · pink cell | — | missing | hexagon | hexagon_16 | data breakpoint, shape |
| 10 | r2c1 1.4 (g9.12) | breakpoint-data-unverified | outlined hexagon · pink cell | — | missing | hexagon | hexagon_16 | data breakpoint, shape |
| 10 | r2c1 1.5 (g9.13) | breakpoint-function | filled triangle · pink cell | polygon | exists | triangle | triangle_16 | function breakpoint |
| 10 | r2c1 1.6 (g9.14) | breakpoint-function-unverified | outlined triangle · pink cell | polygon | exists | triangle | triangle_16 | function breakpoint |
| 10 | r2c1 1.7 (g9.15) | breakpoint-log | filled diamond · pink cell | diamond | exists | diamond | diamond_16 | logpoint, debugging |
| 10 | r2c1 1.8 (g9.16) | breakpoint-log-unverified | outlined diamond · pink cell | diamond | exists | diamond | diamond_16 | logpoint, debugging |
| 10 | r2c1 1.9 (g9.17) | breakpoint-unsupported | filled dot with ! · pink cell | warning | variant: circle instead of triangle, filled | circle-alert | error_circle_16 | unsupported breakpoint, error |
| 10 | r2c0 2.1 (g10.1) | debug-console | bug beside a terminal box · pink cell | terminal | variant: + bug | square-terminal | window_console_20 | debug console |
| 10 | r2c0 2.2 (g10.2) | debug-continue | heavy bar then play triangle (\|▷) · pink cell | play | variant: + leading bar | step-forward | play_16 | continue, resume |
| 10 | r2c0 2.3 (g10.3) | debug-continue-small | thin bar then play triangle · pink cell | play | variant: + leading bar | step-forward | play_16 | continue, resume |
| 10 | r2c0 2.4 (g10.4) | debug-hint? | filled bulb or pin beside a play chevron · pink cell | — | missing | — | — | debug coverage?, run hint |
| 10 | r2c0 2.5 (g10.5) | debug-disconnect | plug pulled apart · green cell | plug | variant: disconnected (split) | unplug | plug_disconnected_16 | disconnect, detach |
| 10 | r2c0 2.6 (g10.6) | debug-rerun | ↺ with a play chevron · pink cell | reset | variant: + play | rotate-ccw | arrow_counterclockwise_16 | rerun, restart |
| 10 | r2c0 2.7 (g10.7) | debug-restart | heavy ↺ · green cell | reset | exists | rotate-ccw | arrow_counterclockwise_16 | restart, reset |
| 10 | r2c0 2.8 (g10.8) | debug-restart-frame | text lines with a small ↺ · pink cell | list | variant: + reset arrow | list-restart | — | restart frame, replay list |
| 10 | r2c1 2.1 (g10.9) | debug-reverse-continue | left triangle then bar (◁\|) · pink cell | play | variant: reversed + trailing bar | step-back | previous_16 | reverse, step back |
| 10 | r2c1 2.2 (g10.10) | debug-stackframe | pentagon tag pointing right (like Area tag without the hole) · pink cell | — | missing | tag | tag_16 | stack frame, current step |
| 10 | r2c1 2.3 (g10.11) | debug-stackframe-active | pentagon tag with a dot · pink cell | — | missing | tag | tag_16 | active stack frame |
| 10 | r2c1 2.4 (g10.12) | debug-start | play triangle · pink cell | play | exists | play | play_16 | run, start |
| 10 | r2c1 2.5 (g10.13) | debug-step-back | ↶ over a dot · pink cell | undo | variant: + dot | undo-dot | arrow_step_back_16 | step back |
| 10 | r2c1 2.6 (g10.14) | debug-step-into | ↓ onto a dot · pink cell | arrow-down | variant: + dot | arrow-down-to-dot | arrow_step_in_16 | step into |
| 10 | r2c1 2.7 (g10.15) | debug-step-out | ↑ from a dot · pink cell | arrow-up | variant: + dot | arrow-up-from-dot | arrow_step_out_16 | step out |
| 10 | r2c1 2.8 (g10.16) | debug-step-over | ↷ over a dot · pink cell | redo | variant: + dot | redo-dot | arrow_step_over_16 | step over |
| 10 | r2c1 2.9 (g10.17) | debug-stop | filled rounded square · pink cell | stop | exists | square | stop_16 | stop, end session |
| 10 | r2c0 3.1 (g11.1) | desktop-download | monitor with ↓ at lower right · pink cell | desktop | variant: + arrow-down | monitor-down | desktop_arrow_down_16 | download app, install |
| 10 | r2c0 3.2 (g11.2) | device-camera | camera · green cell | camera | exists | camera | camera_16 | photo, capture |
| 10 | r2c0 3.3 (g11.3) | device-camera-video | video camera · green cell | video | exists | video | video_16 | video, recording |
| 10 | r2c0 3.4 (g11.4) | device-mobile | phone · green cell | phone | exists | smartphone | phone_16 | mobile, phone |
| 10 | r2c0 3.5 (g11.5) | diff-split | two panes side by side, divided at different heights · green cell | — | missing | columns-2 | split_vertical_16 | side-by-side diff |
| 10 | r2c0 3.6 (g11.6) | diff-added | + in a square · green cell | add | variant: + square | square-plus | add_square_16 | added, git status |
| 10 | r2c0 3.7 (g11.7) | diff-ignored | / in a square · green cell | line | variant: + square | square-slash | — | ignored, git status |
| 10 | r2c0 3.8 (g11.8) | diff-modified | dot in a square · green cell | stop | variant: + dot | square-dot | checkbox_indeterminate_16 | modified, git status |
| 10 | r2c1 3.1 (g11.9) | diff-multiple | stacked pages with ± · green cell | — | missing | file-diff | document_multiple_16 | multi-file diff |
| 10 | r2c1 3.2 (g11.10) | diff-removed | − in a square · green cell | minus | variant: + square | square-minus | subtract_square_16 | removed, git status |
| 10 | r2c1 3.3 (g11.11) | diff-renamed | filled → in a square · green cell | arrow-right | variant: + square | square-arrow-right | arrow_square_down_20 | renamed, git status |
| 10 | r2c1 3.4 (g11.12) | diff-single | page with ± · green cell | — | missing | file-diff | document_16 | file diff |
| 10 | r2c1 3.5 (g11.13) | discard | hooked arrow ↶ · pink cell | undo | exists | undo-2 | arrow_undo_16 | discard changes |
| 10 | r2c1 3.6 (g11.14) | circle-dotted | dotted circle · green cell | ellipse | variant: dotted | circle-dashed | circle_hint_16 | loading?, placeholder |
| 10 | r2c1 3.7 (g11.15) | terminal-stack | two stacked terminal windows · pink cell | terminal | variant: stacked copy | square-terminal | window_console_20 | multiple terminals |
| 10 | r2c1 3.8 (g11.16) | laptop-download | laptop with ↓ on its screen · pink cell | laptop | variant: + arrow-down | laptop | laptop_16 | download to device |
| 10 | r2c1 3.9 (g11.17) | copy-download | stacked squares with ↓ in front (same glyph as r6c4) · pink cell | copy | variant: + arrow-down | square-stack | copy_arrow_right_16 | clone, download copy |

## Exists under another name or drawing

Cursor concepts marked `exists` whose Area icon has another name, or draws the same object differently (see
*what it shows* in the image tables). Useful as a Cursor → Area name map.

| Area icon | Cursor concepts | seen in |
|---|---|---|
| arrow-down | arrow-down-small | 10 |
| arrow-left | arrow-left-small | 10 |
| arrow-right | arrow-right-small | 10 |
| arrow-up | arrow-up-small | 10 |
| book | book-closed, book-open, book-open-text | 11, 10 |
| calendar | calendar-dots, calendar-header | 10 |
| camera | device-camera | 10 |
| chart | line-chart | 11 |
| chat | chat-round, chat-square, comment | 11, 10 |
| chat-multiple | chat-multiple-square, comment-discussion | 11, 10 |
| check | check-heavy | 10 |
| checkbox | check-square | 11 |
| chevron-down | chevron-down-small | 11 |
| chevron-left | chevron-left-small | 11 |
| chevron-right | chevron-right-small | 11 |
| chevron-up | chevron-up-small | 11 |
| chip | chip-grid | 11 |
| collapse | minimize-2 | 11, 14, 10 |
| color | droplet | 11 |
| columns | split | 14 |
| contrast | contrast-hatched, color-mode | 11, 10 |
| copy | window-restore, copy-portrait, copy-files | 10 |
| database | cylinder, database-cylinder | 11, 10 |
| diamond | breakpoint-log, breakpoint-log-unverified | 10 |
| dismiss | window-close, close | 10 |
| document | file | 11, 14 |
| document-add | file-add | 11, 14 |
| ellipse | circle, circle-small, circle-small-filled, circle-large, circle-large-filled, circle-tiny, dot | 11, 10 |
| expand | maximize-2 | 11, 14, 10 |
| eye-off | eye-closed | 11 |
| filter | list-filter | 14 |
| flask | beaker | 10 |
| gauge | dashboard-gauge | 10 |
| git-commit | git-commit-vertical | 14 |
| image | image-landscape | 14 |
| kanban | square-kanban | 11 |
| layout | dashboard-layout | 11 |
| list-checklist | checklist | 10 |
| loader | loading-radial | 10 |
| log-in | arrow-right-to-bracket, arrow-right-into-square | 11 |
| log-out | arrow-right-from-bracket, arrow-right-from-square | 11 |
| mail | envelope | 11 |
| minus | window-minimize, dash | 10 |
| options | sliders | 14 |
| package | cube | 11, 14, 10 |
| paintbrush | brush | 11 |
| panel-top | browser | 11, 10 |
| phone | device-mobile | 10 |
| play | debug-start | 10 |
| polygon | breakpoint-function, breakpoint-function-unverified | 10 |
| prohibited | circle-slash | 10 |
| refresh | rotate-cw | 11 |
| reset | rotate-ccw, debug-restart | 11, 10 |
| settings | cog | 11 |
| shift | arrow-big-up | 11, 14 |
| sort | arrow-down-up | 11 |
| sparkle | sparkles | 14 |
| status-available | check-circle, pass | 11, 10 |
| stop | window-maximize, debug-stop | 10 |
| sync | refresh-ccw | 11 |
| token | circle-dot | 11 |
| umbrella | beach-umbrella | 11 |
| undo | discard | 10 |
| video | device-camera-video | 10 |
| wallet | cardholder | 11 |

## Missing concepts

Deduplicated across images 11, 14 and 10; grouped by family. *Seen in* lists the images. Filled and
"unverified" (outline) breakpoint pairs count as one concept, as do the four Cursor-logo cuts and the Copilot faces.

| concept | family | seen in | lucide | fluent | uses |
|---|---|---|---|---|---|
| arrow-left-right | Arrows and direction | 11, 14, 10 | move-horizontal | arrow_bidirectional_left_right_16 | resize width, swap |
| arrow-up-down | Arrows and direction | 11, 14 | move-vertical | arrow_bidirectional_up_down_16 | resize height, reorder |
| chevrons-down-bold | Chevrons | 11 | chevrons-down | chevron_double_down_16 | demote, low priority |
| chevrons-left-bold | Chevrons | 11 | chevrons-left | chevron_double_left_16 | jump back |
| chevrons-right-bold | Chevrons | 11 | chevrons-right | chevron_double_right_16 | skip ahead |
| chevrons-up-bold | Chevrons | 11 | chevrons-up | chevron_double_up_16 | promote, high priority |
| navigation-pointer | Cursor pointer family | 11, 14 | navigation | location_arrow_16 | agent, cursor, locate |
| navigation-pointer-circle | Cursor pointer family | 11 | navigation | location_arrow_16 | agent badge, locate |
| navigation-pointer-double? | Cursor pointer family | 11 | navigation | location_arrow_16 | fast or auto agent? |
| navigation-pointer-grid? | Cursor pointer family | 11 | navigation | location_arrow_16 | multiple agents? |
| navigation-pointer-square | Cursor pointer family | 11 | navigation | location_arrow_16 | agent tile, app badge |
| diff-dot | Files and diff | 11 | file-diff | document_16 | pending changes |
| diff-multiple | Files and diff | 11, 10 | file-diff | document_multiple_16 | multi-file diff |
| diff-open | Files and diff | 11 | file-diff | document_arrow_right_16 | open diff |
| diff-single | Files and diff | 11, 10 | file-diff | document_16 | file diff, changes |
| diff-split | Files and diff | 11, 10 | columns-2 | split_vertical_16 | side-by-side diff, compare |
| brain | Brain | 11, 10 | brain | brain_16 | AI, thinking, memory |
| brain-circuit? | Brain | 11 | brain-circuit | brain_circuit_20 | AI model, reasoning |
| brain-hourglass | Brain | 11 | brain | brain_16 | thinking, reasoning in progress |
| brain-off | Brain | 11 | brain | brain_16 | reasoning off |
| brain-outline | Brain | 11 | brain | brain_16 | thinking, memory |
| chart-pyramid | Charts | 11 | pyramid | data_funnel_20 | funnel, hierarchy chart |
| chart-scatter | Charts | 11 | chart-scatter | data_scatter_20 | correlation, data plot |
| bitcoin | Money | 11 | bitcoin | — | crypto, payments |
| cost-high | Money | 11 | dollar-sign | currency_dollar_euro_16 | price tier, expensive model |
| cost-low | Money | 11 | dollar-sign | currency_dollar_euro_16 | price tier, cheap |
| cost-medium | Money | 11 | dollar-sign | currency_dollar_euro_16 | price tier |
| dollar | Money | 11 | dollar-sign | currency_dollar_euro_16 | currency, pricing, billing |
| ethereum | Money | 11 | — | — | crypto, wallet |
| asterisk | UI, dev and shapes | 11, 10 | asterisk | text_asterisk_16 | required field, wildcard |
| atom | UI, dev and shapes | 11 | atom | — | science, React, physics |
| binary | UI, dev and shapes | 11 | binary | — | binary data, code |
| blocks | UI, dev and shapes | 11 | blocks | apps_add_in_16 | extensions, add-ons, apps |
| brackets | UI, dev and shapes | 11 | brackets | — | arrays, code |
| broadcast | UI, dev and shapes | 10 | radio | live_16 | live, broadcast, podcast |
| broom | UI, dev and shapes | 10 | brush-cleaning | broom_16 | clear, clean up |
| case-sensitive | UI, dev and shapes | 10 | case-sensitive | text_case_title_16 | match case in search |
| circle-equal (breakpoint-conditional) | UI, dev and shapes | 10 | circle-equal | — | conditional breakpoint |
| circuit-board | UI, dev and shapes | 10 | circuit-board | developer_board_16 | hardware, integrations |
| collection-add? | UI, dev and shapes | 11 | archive | collections_add_20 | add to collection |
| collection? | UI, dev and shapes | 11 | archive | collections_16 | collections, saved items |
| combine | UI, dev and shapes | 10 | combine | merge_16 | combine, merge items |
| cross | UI, dev and shapes | 11 | cross | — | medical, health |
| crosshair | UI, dev and shapes | 11 | crosshair | target_16 | aim, locate, pick element |
| cube-transparent? | UI, dev and shapes | 11 | box | cube_16 | 3D wireframe, geometry |
| debug-hint? | UI, dev and shapes | 10 | — | — | debug coverage?, run hint |
| debug-stackframe | UI, dev and shapes | 10 | tag | tag_16 | stack frame, current step |
| debug-stackframe-active | UI, dev and shapes | 10 | tag | tag_16 | active stack frame |
| dome-flag? | UI, dev and shapes | 11 | dome | flag_16 | landmark, goal reached? |
| hexagon (breakpoint-data) | UI, dev and shapes | 10 | hexagon | hexagon_16 | data breakpoint, shape |
| hexagon-inverted-y? | UI, dev and shapes | 11 | hexagon | hexagon_16 | 3D, model? |
| nodes-tripod? | UI, dev and shapes | 11, 14, 10 | git-fork | organization_16 | graph, integrations? |
| pop-out | UI, dev and shapes | 14 | square-arrow-out-up-right | window_new_16 | pop out, new window, detach |
| route-x | UI, dev and shapes | 14 | route | — | route, trace, destination |
| sitemap | UI, dev and shapes | 11 | network | organization_16 | hierarchy, sitemap, org chart |
| bandage | Objects | 11 | bandage | — | health, fix, patch |
| basketball | Objects | 11 | volleyball | sport_basketball_20 | sports, games |
| binoculars | Objects | 11 | binoculars | — | explore, watch, search |
| bow-tie | Objects | 11 | — | bow_tie_20 | formal, style, persona? |
| bullseye | Objects | 11 | target | target_arrow_16 | goals, objectives, focus |
| castle | Objects | 11 | castle | chess_16 | security, fortress, games |
| chef-hat | Objects | 11 | chef-hat | food_16 | cooking, recipes |
| chess-king | Objects | 11 | chess-king | chess_16 | games, strategy |
| chess-rook | Objects | 11 | chess-rook | chess_16 | games, strategy |
| cookie | Objects | 11 | cookie | cookies_16 | cookies, privacy |
| crystal-ball | Objects | 11 | — | — | predictions, magic, insights |
| deck-chair | Objects | 11 | tree-palm | beach_16 | vacation, leisure, away |
| disc | Objects | 11 | disc | cd_16 | media, disk, album |
| dumbbell | Objects | 11 | dumbbell | dumbbell_16 | fitness, workout |
| easel | Objects | 11 | presentation | whiteboard_16 | presentations, slides |
| elephant | Objects | 11 | — | — | PHP/Postgres logos?, memory |
| nightstand? | Objects | 11 | — | — | furniture, bedroom?, storage |
| utensils | Objects | 11 | utensils | food_16 | food, restaurants |
| copilot (brand) | Brand marks (probably out of scope) | 10 | bot | bot_16 | Copilot, AI assistant |
| cursor-logo (brand) | Brand marks (probably out of scope) | 11, 14, 10 | — | — | brand, product |

## Variants

Deduplicated as Area base + modifier. *Cursor concepts* are the rows that produce it.

| base (Area) | modifier | Cursor concepts | seen in |
|---|---|---|---|
| add | + square | diff-added | 11, 10 |
| arrow-down | + dot | debug-step-into | 10 |
| arrow-down | + square | arrow-down-square | 11 |
| arrow-down | dashed shaft | arrow-down-dashed | 14 |
| arrow-down-left | + square | arrow-down-left-square | 11 |
| arrow-down-right | + square | arrow-down-right-square | 11 |
| arrow-left | + square | arrow-left-square | 11 |
| arrow-right | + end bar | arrow-right-to-line | 14 |
| arrow-right | + square | arrow-right-square, diff-renamed | 11, 10 |
| arrow-right | doubled | arrows-right-double | 11 |
| arrow-right | three shafts | arrow-right-triple | 11 |
| arrow-up | + dot | debug-step-out | 10 |
| arrow-up | + square | arrow-up-square | 11 |
| arrow-up-circle | rotated 180° | arrow-down-circle | 11, 14, 10 |
| arrow-up-circle | rotated 90° | arrow-left-circle, arrow-right-circle | 11, 14, 10 |
| arrow-up-left | + square | arrow-up-left-square | 11 |
| arrow-up-right | + square | arrow-up-right-square | 11, 10 |
| banknote | stacked | banknote-stack | 11 |
| bell | + dot | bell-dot | 11, 10 |
| bell-off | + dot | bell-off-dot | 10 |
| braces | + dot | braces-dot | 11, 10 |
| braces | + error badge | braces-error | 10 |
| braces | + x | braces-x | 11 |
| bug | + play | debug-alt, debug-alt-small, debug-alt-outline | 10 |
| bug | + slash | bug-off | 11 |
| bug | + x | debug-x | 10 |
| building | + second building | buildings | 11 |
| calendar | + hourglass | calendar-hourglass | 11 |
| call | + arrow in | call-incoming | 10 |
| call | + arrow out | call-outgoing | 10 |
| chat | + code | chat-code | 11, 10 |
| chat | + dot | chat-dot, comment-unresolved | 11, 10 |
| chat | + ellipsis | chat-more | 11 |
| chat | + exclamation | chat-warning | 11 |
| chat | + pencil | chat-edit | 11, 10 |
| chat | + question mark | chat-question, comment-question | 11, 10 |
| chat | + sparkle | chat-sparkle | 10 |
| chat | + sparkle + error badge | chat-sparkle-error | 10 |
| chat | + sparkle + warning badge | chat-sparkle-warning | 10 |
| chat | dashed | chat-dashed, comment-draft | 11, 10 |
| chat | repeated x4 in a grid | chat-grid | 11 |
| chat-multiple | + sparkle | comment-discussion-sparkle | 10 |
| check | doubled | check-check, check-all | 11, 10 |
| chevron-down | + circle | chevron-down-circle | 11 |
| chevron-down | doubled | chevrons-down | 11 |
| chevron-left | + circle | chevron-left-circle | 11 |
| chevron-left | doubled | chevrons-left | 11, 10 |
| chevron-right | + circle | chevron-right-circle | 11 |
| chevron-right | doubled | chevrons-right | 11 |
| chevron-right | doubled, trailing one dashed | chevrons-right-dashed | 11, 10 |
| chevron-up | + circle | chevron-up-circle | 11 |
| chevron-up | doubled | chevrons-up | 11 |
| chevrons-up-down | inverted | chevrons-down-up | 11 |
| chevrons-up-down | rotated 90° | chevrons-left-right | 11 |
| clipboard | + text lines | clipboard-list | 11, 10 |
| clipboard | + up/down arrows | clipboard-arrows | 10 |
| code | + slash | code-xml | 11, 10 |
| collapse | four arrows instead of two | shrink | 11, 14 |
| compass | + check | compass-check | 11, 10 |
| compass | + dot | compass-dot | 11, 10 |
| copy | + arrow-down | copy-download | 10 |
| copy | + minus | collapse-all | 10 |
| copy | + x | close-all | 10 |
| corners | + check | corners-check | 11 |
| corners | + sparkle | corners-sparkle | 11 |
| corners | inverted (pointing in) | corners-in | 11 |
| database | + network base | database-network | 11 |
| desktop | + arrow-down | desktop-download | 10 |
| desktop | + check | desktop-check | 11 |
| desktop | + dot (ring) | desktop-ring | 11 |
| desktop | + play | desktop-play | 11 |
| desktop | + remote chevrons | desktop-remote | 11 |
| desktop | + signal arcs | desktop-cast | 11 |
| desktop | stacked copy | desktops | 11 |
| document | + arrow | file-arrow | 11 |
| document | + bulleted list | file-list | 11 |
| document | + lock | file-lock | 11 |
| document | + PDF label | file-pdf | 11 |
| document | stacked copy | files | 14 |
| download | box form, rotated 180° | arrow-up-into-square | 11 |
| download | box instead of tray | import | 11 |
| download | rotated 180° | arrow-up-to-bracket | 11 |
| ellipse | dashed | circle-dashed | 11, 14 |
| ellipse | dotted | circle-dotted | 10 |
| ellipse | stacked copy | circle-stack | 11 |
| ellipse | stacked copy + check | circle-stack-check | 11, 10 |
| ellipse | stacked copy, front filled | circle-stack-filled | 10 |
| expand | four arrows instead of two | expand-corners | 11, 14 |
| eye | + slash | eye-slash | 11 |
| flask | + prohibited badge | beaker-stop | 10 |
| git-commit | + arrow in | arrow-down-to-node | 14 |
| git-commit | + arrow out | arrow-up-from-node | 14 |
| laptop | + arrow-down | laptop-download | 10 |
| line | + square | diff-ignored | 11, 10 |
| list | + reset arrow | debug-restart-frame | 10 |
| list | + x | clear-all | 10 |
| log-in | mirrored | arrow-left-to-bracket | 11 |
| log-in | mirrored, box form | arrow-left-into-square | 11 |
| log-out | mirrored | arrow-left-from-bracket | 11 |
| log-out | mirrored, box form | arrow-left-from-square | 11 |
| minus | + square | diff-removed | 11, 10 |
| panel-left | + text lines | panel-text | 10 |
| panel-top | + pointer | browser-pointer | 10 |
| panel-top | stacked copy | browsers | 11 |
| play | + leading bar | debug-continue, debug-continue-small | 10 |
| play | reversed + trailing bar | debug-reverse-continue | 10 |
| plug | disconnected (split) | debug-disconnect | 10 |
| rectangle | stacked copy | rectangle-stack | 14 |
| redo | + dot | debug-step-over | 10 |
| refresh | + check inside | check-refresh | 10 |
| reset | + play | debug-rerun | 10 |
| share | rotated 180° | arrow-down-from-square | 11 |
| shift | + bar below | arrow-big-up-dash | 11 |
| shift | rotated 180° | arrow-big-down | 11, 14 |
| shift | rotated 180° + bar | arrow-big-down-dash | 11 |
| shift | rotated 90° | arrow-big-left, arrow-big-right | 11, 14 |
| shift | rotated 90° + bar | arrow-big-left-dash, arrow-big-right-dash | 11 |
| sort | rotated 90° | arrow-right-left | 11, 10 |
| status-available | dashed ring | circle-dashed-check | 14 |
| stop | + dot | diff-modified | 11, 10 |
| sync | mirrored (clockwise) | refresh-cw | 11 |
| terminal | + bug | debug-console | 10 |
| terminal | stacked copy | terminal-stack | 10 |
| undo | + dot | debug-step-back | 10 |
| upload | dashed shaft | upload-dashed | 11 |
| upload | rotated 180° | arrow-down-from-bracket | 11 |
| warning | circle instead of triangle | alert-circle | 11 |
| warning | circle instead of triangle, filled | breakpoint-unsupported | 10 |
