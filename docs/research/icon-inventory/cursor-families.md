<!-- Catalogue of the owner's Cursor screenshots (2026-09-28): outline and filled pairs, the agent, bug and cube families, the dot scale, the think search and the concept table. Positions refer to zoomed tiles of those screenshots, which are not stored in the repository. Summarised in ../icon-inventory.md. -->

# Cursor icon inventory C: images 4–9, 12 and 13

Read-only research for Area's icon gaps. Area's list is `scratchpad/area-icons.txt` (376 names). **exists**: Area has an icon showing the same object or serving the same meaning (a different drawing is noted in brackets). **variant**: Area has the base and Cursor adds a modifier (named in the status). **missing**: neither.

Method: every image read whole and as 2–4× crops made with `sips` (the scratch files are in `scratchpad/invC-crops/`; safe to delete). Area drawings were checked in `apps/docs/assets/area-icons-pilot/*.svg` and `apps/docs/src/icons.tsx`, and concepts searched with `npm run icons:find`. Every Lucide name is in `lucide-tags.json` and every Fluent name was checked with `ls` in `@fluentui/svg-icons/icons` (16px regular, else 20px). Numbers in Part 2 are pixel sums from images 4 and 9.

## Counts

| image | contents | icons | exists | variant | missing |
|---|---|---|---|---|---|
| 4 | outline/filled pairs | 12 | 11 | 0 | 1 |
| 5 | 18 icons | 18 | 16 | 0 | 2 |
| 6 | agent family + off icons | 35 | 15 | 11 | 9 |
| 7 | bug, cube, play families | 12 | 3 | 7 | 2 |
| 8 | flat-cap sheet | 15 | 9 | 2 | 4 |
| 9 | dot sizes | 25 | 9 | 7 | 9 |
| 12 | search 'think' | 9 | 1 | 0 | 8 |
| 13 | Concepts table | 14 | 10 | 2 | 2 |
| **all** | | **140** | **74** | **29** | **37** |

After merging repeats, there are 26 missing concepts (Part 3; the brain and head families count once each) and 24 variants.

## Part 1: Catalogue

Positions are row and column (rNcM). In image 4 the position is the cell in the outline block, and the filled twin sits in the same cell of the right block. In image 6, L is the left 5×5 block and R the right block of off icons. Image 9 positions are dot-size row · column, image 12 is result order, and image 13 is the table row. The UI chrome in images 12 and 13 (menu, search, clear ×) is not counted; Area has menu, search and dismiss.

| image | position | concept | what it shows | area | status | lucide | fluent | uses |
|---|---|---|---|---|---|---|---|---|
| 4 | r1c1 | mic | Capsule mic on a U cradle with a stem. Filled: capsule solid; cradle and stem stay lines at outline weight. | mic | exists | mic | mic_16_regular | dictate, voice input (ChatGPT) |
| 4 | r1c2 | database | Cylinder of three layers (top ellipse + two bands). Filled: three solid layers split by line-width gaps. (Area's has two layers.) | database | exists | database | database_16_regular | storage, data source, Notion databases |
| 4 | r1c3 | command | Looped ⌘. Filled: the same ⌘ about 1.6× heavier, loop counters left open. | command | exists | command | key_command_16_regular | shortcut, cmd key, command palette |
| 4 | r2c1 | smile | Ring face, two short vertical-dash eyes, smile arc. Filled: solid disc, eyes and mouth knocked out. | smile | exists | face-slightly-smiling | emoji_16_regular | emoji, reaction, feedback |
| 4 | r2c2 | pause | Two bare vertical bars, no ring. Filled: bars about 1.6× the line. | pause | exists | pause | pause_16_regular | pause playback, voice mode |
| 4 | r2c3 | sparkles | Four-point star with a small four-point star at top right. Filled: both stars solid. (Area: one star, no satellite, by owner choice.) | sparkle | exists | sparkles | sparkle_16_regular | AI, generate, Notion AI |
| 4 | r3c1 | pushpin | Tilted pushpin head with a long needle. Filled: head solid, needle stays a line. | pushpin | exists | pin | pin_16_regular | pin chat, pin page |
| 4 | r3c2 | atom | Two crossed ellipses with a nucleus dot. Filled: four solid lobes and a solid centre lens split by line-width gaps; nucleus becomes a hole. | — | missing | atom | — | science, React, physics |
| 4 | r3c3 | volume | Speaker with two sound-wave arcs. Filled: speaker solid, waves stay lines. | volume | exists | volume-2 | speaker_2_16_regular | sound on, read aloud |
| 4 | r4c1 | square-kanban | Rounded square with three hanging bars (long, short, medium). Filled: solid square, bars knocked out. (Area's board has a header and columns.) | kanban | exists | square-kanban | board_16_regular | board view, tasks, Notion boards |
| 4 | r4c2 | paper-plane | The agent dart with a fold line from notch to tip. Filled: two solid facets split by a line-width fold gap. | send | exists | send | send_16_regular | send, submit, agent (Cursor) |
| 4 | r4c3 | bug | Round beetle: centre split, V antennae, three straight leg pairs. Filled: body solid, split by a line-width gap; legs and antennae stay lines. | bug | exists | bug | bug_16_regular | debug, report issue |
| 5 | r1c1 | bookmark | Ribbon bookmark with a V notch. | bookmark | exists | bookmark | bookmark_16_regular | save, read later |
| 5 | r1c2 | map-pin | Teardrop pin with an inner ring. | pin | exists | map-pin | location_16_regular | location, place |
| 5 | r1c3 | bell | Bell with flared base and clapper. | bell | exists | bell | alert_16_regular | notifications, alerts |
| 5 | r1c4 | lightbulb | Bulb with a banded base. | lightbulb | exists | lightbulb | lightbulb_16_regular | idea, tip, think |
| 5 | r1c5 | bold | Letter B drawn as an outline stroke. (Area's B is solid by owner choice.) | bold | exists | bold | text_bold_16_regular | bold text, formatting |
| 5 | r1c6 | hourglass | Hourglass with caps and crossing glass lines. | hourglass | exists | hourglass | hourglass_16_regular | pending, waiting |
| 5 | r2c1 | video | Camcorder: rounded body and a triangle lens. | video | exists | video | video_16_regular | video call, camera on |
| 5 | r2c2 | key | Horizontal key: oval bow right, shaft with two teeth left. | key | exists | key | key_16_regular | API key, password, access |
| 5 | r2c3 | volume | Speaker with two waves (as image 4). | volume | exists | volume-2 | speaker_2_16_regular | sound, audio |
| 5 | r2c4 | eye-closed | Closed eyelid arc with three lashes. (Area's eye-off is the same closed eye.) | eye-off | exists | eye-closed | eye_off_16_regular | hide, hidden |
| 5 | r2c5 | cloud | Cloud outline on a flat foot. | cloud | exists | cloud | cloud_16_regular | cloud, sync, cloud agents |
| 5 | r2c6 | banknote | Landscape note with a full-height oval in the middle. | banknote | exists | banknote | money_16_regular | cash, billing, pricing |
| 5 | r3c1 | wrench | Open-ended wrench on a diagonal. | — | missing | wrench | wrench_16_regular | tools, settings, fix, MCP tools |
| 5 | r3c2 | pushpin | Tilted pushpin (as image 4). | pushpin | exists | pin | pin_16_regular | pin, keep on top |
| 5 | r3c3 | bandage | Diagonal capsule band-aid with a centre pad. | — | missing | bandage | — | fix, heal, patch |
| 5 | r3c4 | link | Two chain links on a diagonal. | link | exists | link | link_16_regular | link, URL |
| 5 | r3c5 | pencil | Diagonal pencil with a blunt tip and ferrule line. | pencil | exists | pencil | edit_16_regular | edit, rename |
| 5 | r3c6 | ruler | Diagonal ruler with three ticks. | ruler | exists | ruler | ruler_16_regular | measure, dimensions (Figma) |
| 6 | L r1c1 | agent-hexagon | Agent dart inside a pointy-top hexagon (the cube silhouette). | send | variant: + hexagon around | hexagon (+ navigation) | hexagon_16_regular (container only) | Cursor agent mark, agent mode |
| 6 | L r1c2 | agent | Flat dart: horizontal top edge, notch at centre, tip at top right, no fold line. (Area's send is the same dart pointing right.) | send | exists | navigation | location_arrow_16_regular | Cursor Agent, navigate, send |
| 6 | L r1c3 | paper-plane | The dart plus a fold line from notch to tip. | send | exists | send | send_16_regular | send, submit |
| 6 | L r1c4 | agent-circle | Small agent dart inside a ring. | send | variant: + circle around | — (navigation + circle) | — | agent status, agent avatar |
| 6 | L r1c5 | agent-square | Small agent dart inside a rounded square. | send | variant: + square around | — (navigation + square) | — | agent tab, agent app |
| 6 | L r2c1 | agents-stacked | Dart with a second dart behind it; only the back copy's top and right edges are drawn. | send | variant: + stacked back copy | — | — | background agents, agent queue |
| 6 | L r2c2 | agents-swarm | Four small darts in a 2×2 grid (Cursor's 'Agents' concept). | send | variant: ×4 group | — | — | multiple, parallel agents |
| 6 | L r2c3 | blocks | Three squares in an L and a fourth lifted off at top right. (Area shows this meaning as a puzzle piece.) | puzzle | exists | blocks | apps_add_in_16_regular | extensions, add-ons, integrations |
| 6 | L r2c4 | sparkles | Four-point star with a small star at top right. | sparkle | exists | sparkles | sparkle_16_regular | AI, generate |
| 6 | L r2c5 | satellite | Sputnik-style orb at top right trailing three antenna lines (left, down-left, down). | — | missing | satellite | — | orbit, remote, broadcast |
| 6 | L r3c1 | airplane | Line-drawn airplane heading up-right (fuselage, wing and tail strokes), the same build as Area's plane. | plane | exists | plane | airplane_16_regular | travel, flight |
| 6 | L r3c2 | image | Frame with a mountain and a sun. | image | exists | image | image_16_regular | image, photo, attach image |
| 6 | L r3c3 | options | Two rails with large knobs at opposite ends. | options | exists | settings-2 | options_16_regular | settings, filters, preferences |
| 6 | L r3c4 | route | S-shaped path from a start ring (bottom left) to an × (top right). | — | missing | route | flow_dot_16_regular | plan, path, journey |
| 6 | L r3c5 | compass | Ring with a diamond needle. | compass | exists | compass | compass_northwest_16_regular | explore, browse |
| 6 | L r4c1 | pie-chart | Ring with two radii marking a top-right quarter. | pie-chart | exists | chart-pie | data_pie_16_regular | breakdown, usage |
| 6 | L r4c2 | target-arrow | Two concentric rings open at top right, a dart with fletching entering the centre. | — | missing | target, goal | target_arrow_16_regular | goal, objective, focus |
| 6 | L r4c3 | radar | Two concentric rings open at top right, a sweep line from the centre to the gap. | — | missing | radar | radar_20_regular | scan, detect, monitor |
| 6 | L r4c4 | cookie | Round cookie with a bitten top-right edge and three chips. | — | missing | cookie | cookies_16_regular | cookie consent, privacy, browser data |
| 6 | L r4c5 | gauge | Open arc on short feet with a diagonal needle. | gauge | exists | gauge | gauge_16_regular | performance, speed, usage |
| 6 | L r5c1 | z-fold-panels | Two upright panels at different heights joined by a slanted panel (a zig-zag strip). Meaning unclear. | — | missing | — | — | fold, transition, perspective (unclear) |
| 6 | L r5c2 | person-chat | Small figure (head ring, bent shoulder line) beside a large round speech bubble with a square bottom-left corner. | person | variant: + speech bubble beside | — (user-round + message-circle) | person_chat_16_regular | contact, feedback, talk |
| 6 | L r5c3 | pipe | Pipe elbow: two parallel curved walls with a flange across each end. | — | missing | — | pipeline_20_regular | pipeline, CI, data flow |
| 6 | L r5c4 | arrow-down-up | Down arrow and up arrow side by side (Area's sort). | sort | exists | arrow-down-up | arrow_sort_16_regular | sort, swap, reorder |
| 6 | L r5c5 | arrow-right-left | Right arrow over left arrow (horizontal swap). | — | missing | arrow-right-left | arrow_swap_16_regular | swap, switch, transfer, compare |
| 6 | R r1c1 | prohibited | Ring with a 45° slash. | prohibited | exists | ban | prohibited_16_regular | blocked, not allowed |
| 6 | R r1c2 | eye-off | Eye with the corner-to-corner slash; pupil clipped to a half-disc above the slash. (Area's eye-off is a closed eye by owner choice.) | eye-off | exists | eye-off | eye_off_16_regular | hide, private |
| 6 | R r2c1 | bell-off | Bell with the slash drawn over it. | bell-off | exists | bell-off | alert_off_16_regular | mute notifications |
| 6 | R r2c2 | plug-off | Two-prong plug with the slash drawn over it. | plug | variant: + slash | unplug | plug_disconnected_16_regular | disconnected, MCP server off |
| 6 | R r3c1 | brain-off | Brain with the slash (base brain is missing in Area). | — | missing | — (brain + slash) | — | thinking off |
| 6 | R r3c2 | pin-off | Pushpin with the slash; the head below the slash only partly drawn. | unpin | exists | pin-off | pin_off_16_regular | unpin |
| 6 | R r4c1 | square-slash | Rounded square with a short free diagonal inside (top left to bottom right, not touching the frame). | rectangle / stop (square) | variant: + short slash inside | square-slash | — | none, no fill, disabled |
| 6 | R r4c2 | bugbot | Bug struck by the slash, which also stands in for its two collinear diagonal legs; lower-left body arc stops short of the slash; centre split and antennae gone. | bug | variant: + slash | bug-off | bug_prohibited_20_regular | Bugbot code review, bugs off |
| 6 | R r5c1 | search-off | Lens drawn as an open arc with a small prohibited badge at top right; handle to bottom right. | search | variant: + prohibited badge (top right) | search-slash | — | no results, search disabled |
| 6 | R r5c2 | flask-off | Flask (lip, neck, liquid line) with a small prohibited badge at bottom right; flask cut back round it. | flask | variant: + prohibited badge (bottom right) | flask-conical-off | beaker_off_20_regular | beta off, experiments disabled |
| 7 | r1c1 | bug | Full bug (as image 4). | bug | exists | bug | bug_16_regular | debug, Bug concept |
| 7 | r1c2 | bugbot | Bug + slash (as image 6 R r4c2). | bug | variant: + slash | bug-off | bug_prohibited_20_regular | Bugbot |
| 7 | r1c3 | bug-play | Large play triangle left open at its lower left, a small simplified bug (oval, three leg pairs, no split or antennae) in that corner. | play | variant: + small bug badge (lower left) | bug-play | — | run and debug, start debugging |
| 7 | r1c4 | debug-continue | Small bug + an open play corner followed by a second chevron (fast-forward). | fast-forward | variant: + small bug badge (lower left) | — (bug-play + fast-forward) | — | continue, run all, step |
| 7 | r2c1 | cube | Isometric cube: pointy-top hexagon with a Y of inner edges. (Area's package is the taped box.) | — (nearest: package) | missing | box | cube_16_regular | 3D, object, model |
| 7 | r2c2 | cube-wireframe | Hexagon cut into six triangles by three diameters: a transparent cube with its hidden edges drawn. | — | missing | — (box) | — (cube_16_regular) | 3D, mesh, geometry |
| 7 | r2c3 | package | Cube with a tape flap on the top face. | package | exists | package | box_16_regular | package, shipping, dependency |
| 7 | r2c4 | agent-hexagon | Agent dart inside the hexagon (as image 6 L r1c1). | send | variant: + hexagon around | hexagon (+ navigation) | hexagon_16_regular (container only) | Cursor agent mark |
| 7 | r3c1 | play | Rounded triangle. | play | exists | play | play_16_regular | play, run |
| 7 | r3c2 | play-circle | Ring with a small play triangle. | play | variant: + circle around | circle-play | play_circle_16_regular | play video, run |
| 7 | r3c3 | monitor-play | Monitor on a stand with a play badge at top right; the screen's top-right corner cut away round it. | desktop | variant: + play badge (top right) | monitor-play | — (desktop_16_regular base) | run preview, present, launch app |
| 7 | r3c4 | bug-play | Repeat of r1c3. | play | variant: + small bug badge (lower left) | bug-play | — | run and debug |
| 8 | r1c1 | database | Three-layer cylinder (flat-cap sheet). | database | exists | database | database_16_regular | storage, data |
| 8 | r1c2 | gauge | Open arc and needle with flat-cut ends. | gauge | exists | gauge | gauge_16_regular | performance, speed |
| 8 | r1c3 | package | Cube with a tape flap. | package | exists | package | box_16_regular | package, dependency |
| 8 | r1c4 | target-arrow | Open rings with a fletched dart (as image 6). | — | missing | target, goal | target_arrow_16_regular | goal, objective |
| 8 | r1c5 | bug | Bug with flat-ended legs. | bug | exists | bug | bug_16_regular | debug |
| 8 | r2c1 | file-pdf | Page with a folded top-left corner; its lower part replaced by a bold 'PDF' label. | document | variant: + 'PDF' label | file-text | document_pdf_16_regular | PDF file, attachment, export |
| 8 | r2c2 | mic | Mic on its cradle, flat-cut stem. | mic | exists | mic | mic_16_regular | dictate |
| 8 | r2c3 | flame | Three-tongued outer flame with an inner flame. (Area's flame is single.) | flame | exists | flame | fire_16_regular | trending, hot |
| 8 | r2c4 | case-upper | Uppercase letters 'AB'. (Area's text icon is a T.) | — (nearest: text) | missing | case-upper | text_case_uppercase_16_regular | typography, font file, text case |
| 8 | r2c5 | at | @ with a long flat tail. | at | exists | at-sign | mention_16_regular | mention, @-context (Cursor) |
| 8 | r3c1 | camera | Camera body with a raised top and a lens ring. | camera | exists | camera | camera_16_regular | photo, screenshot |
| 8 | r3c2 | binary | Digits '01' over '10'. | — | missing | binary | — | binary file, code, data |
| 8 | r3c3 | chat | Square speech bubble with a centred downward tail. (Area's bubble is rounded, tail bottom left.) | chat | exists | message-square | comment_16_regular | comment, message |
| 8 | r3c4 | circle-dashed | Dashed ring, eight flat-ended dashes. | — (nearest: square-dashed) | missing | circle-dashed | circle_hint_16_regular | pending, draft, not started |
| 8 | r3c5 | download-square | Rounded square with a down arrow inside. | arrow-down | variant: + square around | square-arrow-down | arrow_square_down_20_regular | download, import, install |
| 9 | 1.5 · c1 | elephant | Stylised elephant (ear, trunk, legs) with a 1.5 eye dot. | — | missing | — | — | PHP/Postgres file type?, memory |
| 9 | 1.5 · c2 | document-list | Page with a dog-ear at top left and two rows of 1.5 bullet + line. (Area's document has two text lines.) | document | exists | file-text | document_bullet_list_16_regular | rules, notes, list file |
| 9 | 1.5 · c3 | dog-face | Pug face: folded ears, 1.5 eye dots, frowning muzzle. | — (nearest: paw) | missing | dog | animal_dog_16_regular | Pug template file?, pets, mascot |
| 9 | 1.75 · c1 | app-window | Landscape window with three 1.75 dots at top left. | — (nearest: panel-top) | missing | app-window-mac | window_16_regular | browser, app window, preview |
| 9 | 1.75 · c2 | server | Two stacked units, each with two 1.75 lights. | server | exists | server | server_16_regular | server, hosting |
| 9 | 1.75 · c3 | shield-question | Shield with a question mark (1.75 dot). | shield | variant: + ? inside | shield-question-mark | shield_question_16_regular | unverified, permissions |
| 9 | 1.75 · c4 | badge-question | Eight-point scalloped seal with a question mark (1.75 dot). | — (no seal shape) | missing | badge-question-mark | — (seal: checkmark_starburst_16_regular) | help, unverified, FAQ |
| 9 | 2.0 · c1 | atom | Crossed ellipses with a 2.0 nucleus. | — | missing | atom | — | science, React |
| 9 | 2.0 · c2 | keyboard | Landscape rounded rect with 3 + 2 staggered 2.0 key dots (Area's keyboard is also dotted). | keyboard | exists | keyboard | keyboard_16_regular | shortcuts, keyboard |
| 9 | 2.0 · c3 | cookie | Bitten cookie with three 2.0 chips. | — | missing | cookie | cookies_16_regular | cookies, privacy |
| 9 | 2.0 · c4 | speaker | Tall speaker box: 2.0 tweeter dot over a woofer ring. | speaker | exists | speaker | speaker_box_16_regular | audio output, speaker |
| 9 | 2.0 · c5 | chart-scatter | L axes with five 2.0 points. | — (chart is a line chart) | missing | chart-scatter | data_scatter_20_regular | analytics, correlation, data |
| 9 | 2.0 · c6 | info | Ring with an i (2.0 dot). | info | exists | info | info_16_regular | info, details |
| 9 | 2.0 · c7 | help | Ring with a ? (2.0 dot). | help | exists | circle-question-mark | question_circle_16_regular | help, Ask mode (Cursor) |
| 9 | 2.0 · c8 | question-mark | Bare question mark with a 2.0 dot, no ring. (Area only has the ringed help.) | help | exists | — (circle-question-mark) | question_16_regular | help, unknown |
| 9 | 2.5 · c1 | ellipsis | Three 2.5 dots in a row. | more-horizontal | exists | ellipsis | more_horizontal_16_regular | more, overflow menu |
| 9 | 2.5 · c2 | list | Three 2.5 bullets with lines. | list-bullet | exists | list | text_bullet_list_ltr_16_regular | bulleted list |
| 9 | 2.5 · c3 | circle-dot-dashed | Dashed ring with a 2.5 centre dot. | — (nearest: record, square-dashed) | missing | circle-dot-dashed | — (circle_hint_16_regular has no dot) | in progress, draft, focus |
| 9 | 2.5 · c4 | crosshair | Ring with four inward ticks and a 2.5 centre dot. | — | missing | crosshair, locate-fixed | my_location_16_regular | locate, target, pick element |
| 9 | 2.5 · c5 | square-dot | Rounded square with a 2.5 centre dot. | rectangle / stop (square) | variant: + centre dot | square-dot | — | modified (git), point |
| 9 | 4.0 · c1 | bell-dot | Bell with a 4.0 dot at top right; bell outline cut back round it. | bell | variant: + notification dot (top right) | bell-dot | alert_badge_16_regular | unread notifications |
| 9 | 4.0 · c2 | braces-dot | Braces with a 4.0 dot in place of the right brace's lower half. | braces | variant: + notification dot (bottom right) | — | — | code changes pending |
| 9 | 4.0 · c3 | compass-dot | Compass with a 4.0 dot on the ring at bottom right; ring cut open round it. | compass | variant: + notification dot (bottom right) | — | — | new in explore |
| 9 | 4.0 · c4 | chat-dot | Square bubble with a 4.0 dot in place of its top-right corner. | chat | variant: + notification dot (top right) | message-square-dot | comment_badge_16_regular | unread message, new comment |
| 9 | 4.0 · c5 | square-badge | Rounded square with a 4.0 dot in place of its top-right corner. | rectangle / stop (square) | variant: + notification dot (top right) | — | badge_20_regular | app badge, unread item |
| 12 | c1 | brain | Brain outline: lobed hemispheres split by a centre line. | — | missing | brain | brain_16_regular | thinking, reasoning model |
| 12 | c2 | brain-2 | Same brain with small fold curls off the lower centre line. | — | missing | brain | brain_16_regular | thinking, medium effort? |
| 12 | c3 | brain-3 | Same brain with more fold branches along the centre line. | — | missing | brain | brain_16_regular | thinking, high effort? |
| 12 | c4 | brain-hourglass | Brain whose lower-right lobe is replaced by an hourglass. | — | missing | — | — | thinking in progress |
| 12 | c5 | brain-off | Brain with the slash. | — | missing | — (brain + slash) | — | thinking off |
| 12 | c6 | lightbulb | Bulb with a banded base. | lightbulb | exists | lightbulb | lightbulb_16_regular | idea, tip |
| 12 | c7 | head-dot | Head profile facing left with a dot where the brain is. | — | missing | — (speech is a head profile) | — (thinking_20_regular: thought cloud) | mind, memory, persona |
| 12 | c8 | head-ring | Same head with a small ring. | — | missing | — (speech) | — (thinking_20_regular) | mind, thinking level 2? |
| 12 | c9 | head-ring-large | Same head with a larger ring. | — | missing | — (speech) | — (thinking_20_regular) | mind, thinking level 3? |
| 13 | row 1 | agent | Concept 'Agent' → icon `agent`. Flat agent dart. Status Approved. | send | exists | navigation | location_arrow_16_regular | Cursor Agent |
| 13 | row 2 | agents-swarm | Concept 'Agents' → icon `agents-swarm`. 2×2 small darts. Approved. | send | variant: ×4 group | — | — | multiple agents |
| 13 | row 3 | question-circle | Concept 'Ask' → icon `question-circle`. Ring with a ?. Approved. | help | exists | circle-question-mark | question_circle_16_regular | Ask mode |
| 13 | row 4 | flask | Concept 'Beta' → icon `flask`. Erlenmeyer flask with lip and liquid line. Approved. | flask | exists | flask-conical | beaker_16_regular | beta, labs |
| 13 | row 5 | globe | Concept 'Browser' → icon `globe`. Globe with meridian and equator. Approved. (Area labels it Language.) | globe | exists | globe | globe_16_regular | browser, web |
| 13 | row 6 | bug | Concept 'Bug' → icon `bug`. Bug. Approved. | bug | exists | bug | bug_16_regular | bug, debug |
| 13 | row 7 | bugbot | Concept 'Bugbot' → icon `bugbot`. Bug + slash. Approved. | bug | variant: + slash | bug-off | bug_prohibited_20_regular | Bugbot review |
| 13 | row 8 | cloud | Concept 'Cloud Agents' → icon `cloud`. Cloud. Approved. | cloud | exists | cloud | cloud_16_regular | cloud agents |
| 13 | row 9 | chip | Concept 'Compute – Large' → icon `chip`. Chip with pins and an inner # grid. Approved. | chip | exists | cpu | developer_board_16_regular | large compute |
| 13 | row 10 | chip-simple | Concept 'Compute – Small' → icon `chip-simple`. Plain chip with pins, empty centre. Approved. | chip | exists | cpu | developer_board_16_regular | small compute |
| 13 | row 11 | envelope | Concept 'Contact' → icon `envelope`. Envelope with a V flap. Approved. | mail | exists | mail | mail_16_regular | contact, email |
| 13 | row 12 | at | Concept 'Context' → icon `at`. @. Approved. | at | exists | at-sign | mention_16_regular | context, mention |
| 13 | row 13 | cost-high | Concept 'Cost – High' → icon `cost-high`. Three dollar signs, '$$$'. Approved. | — | missing | dollar-sign | currency_dollar_euro_16_regular | pricing tier, expensive model |
| 13 | row 14 (cut off) | cost-low | Concept 'Cost – Low' → icon `cost-low`. Single '$'; row only partly visible. Approved. | — | missing | dollar-sign | currency_dollar_euro_16_regular | pricing tier, cheap model |

## Part 2: Cursor construction notes

- **Grid and line.** The Cursor Icons app offers 16px and 24px sizes and Outline and Filled styles (toolbars in images 12 and 13). In image 9 every labelled dot scales by one factor: 8.45, 9.8, 11.2, 14.05 and 22.5 screenshot px for 1.5, 1.75, 2.0, 2.5 and 4.0, which is 5.62 px per labelled px. The line measures 6.8–7.0 px on that scale, about 1.2–1.25 px, which is the published 1.25px line at 16px. Dot : line ratios are about 1.2, 1.4, 1.6, 2.0 and 3.2.
- **Dot sizes by role (image 9).**
  - **1.5:** tiny features inside a figure (elephant and pug eyes, bullets in a small document).
  - **1.75:** indicator and glyph dots inside a container (window chrome, server lights, the ? in a shield or seal).
  - **2.0:** standard detail and glyph dots (atom nucleus, keypad keys, cookie chips, speaker tweeter, scatter points, the dots of i and ? in a ring or on a bare ?).
  - **2.5:** dots that are the content (ellipsis, list bullets, and the centre dot in a dashed ring, crosshair or square).
  - **4.0:** a notification badge on a corner.
  - Area allows only ⌀1.5 and ⌀2 and has no notification dot.
- **Notification dot (4.0).** It sits at the top right (bell, chat, square) or the bottom right (braces, compass).
  - On a rectangular host, the dot's centre is 1.26 lines in from both centre-lines of the corner, so its outer edges sit almost flush with the host's outer ink (within about 1 screenshot px).
  - On the compass, the dot is centred on the ring at 45°.
  - The host outline always stops 2–2.8 line widths short of the dot (13.8 px along the ring, 19 px on the square). The two never touch.
- **Filled variants (image 4).** Measured against an outline line of 11–12 px:
  - **Solid:** the object's body. Mic capsule, database layers, face, stars, pin head, speaker, board, bug body, plane.
  - **Negative space:** every detail inside a solid, about one line wide (12 px knockouts). Smile's eyes and mouth, kanban's bars, the bug's centre split, database's layer lines, the plane's fold (two facets), the atom's inner orbit arcs (four solid lobes around a solid centre lens). The nucleus becomes a hole the size of the outline dot.
  - **Still lines, at outline weight:** parts outside the body. Mic cradle and stem (10.9 px in both styles), pin needle, sound waves, bug legs and antennae.
  - **Thicker:** line glyphs with no body. Pause and ⌘ grow to about 1.5–1.6× the line (17–18 px) and keep their counters open. Area and Fluent use 4/3.
- **Off icons (image 6 right, image 7).**
  - **Slash:** one slash from the top-left corner to the bottom-right corner, round caps, laid over the base with no clearance cut. The outlines of bell, plug, eye and brain run straight through it; only interior details are trimmed on one side (the eye's pupil becomes a half-disc above the slash). Area's shared slash instead cuts the base on one side with a 2.25 overlap gap.
  - **Bugbot:** the slash replaces the bug's two collinear diagonal legs, the centre split and antennae go, and the lower-left body arc stops short of the slash.
  - **Prohibited badge:** a second off form puts a small ring-and-slash on a corner (search at top right, flask at bottom right) and cuts the base back round it.
  - **Square-slash:** only a short free diagonal inside the square.
- **Shared parts.**
  - **Agent dart:** a navigation arrow with a horizontal top edge and its tip at top right. It is reused alone, with a fold as a paper plane (which fills as two facets), inside a pointy-top hexagon, a ring and a rounded square, stacked (the back copy shows only two edges, like Area's copy), and four times in a 2×2 as agents-swarm.
  - **Bug:** reused small and simplified (an oval with three leg pairs, no split or antennae) as a lower-left badge on play (bug-play) and fast-forward (debug-continue). The play is left open round it.
  - **Hexagon:** one silhouette shared by the cube (Y edges), the wireframe cube (three diameters), the package (tape flap) and the agent-hexagon.
  - **Play:** recurs in a ring and as a corner badge on a monitor whose corner is cut away.
  - **Rings:** target-arrow and radar share the same open concentric rings, opening to the top right.
- **Levels inside one silhouette (image 12).** Brain has three fold-detail levels plus an hourglass and a slash. The head profile carries a dot, a small ring or a large ring. Each reads as a scale, perhaps thinking effort (inferred, not labelled).
- **Two cap styles.** Image 8 draws the same icons (database, gauge, package, target, bug, mic) with flat (butt) caps and mitred corners: gauge ends and needle, legs, stem, the @ tail, dashes and the arrowhead. Images 4–7, 9 and 12 use round caps and joins. The sheet doesn't say which is current.
- **Concept table (image 13).** Each row maps a product concept to one kebab-case icon name and a status; all 14 visible rows are Approved (green). Concept names are Title Case, qualified with "– Large / – Small" and "– High / – Low".
  - **Reused by meaning:** generic objects cover most concepts (Beta → flask, Browser → globe, Cloud Agents → cloud, Contact → envelope, Context → at, Ask → question-circle).
  - **Bespoke names:** only where needed (agent, agents-swarm, bugbot, chip-simple, cost-high and cost-low).
  - **Pairs:** variants of one base (chip / chip-simple, $$$ / $).
  - **App layout:** the sidebar separates Icons, Concepts and File Types, with the docs pages "Adding an Icon" and "Design Philosophy". Several items above (PDF, binary, AB, elephant, pug) look like File Types marks.

## Part 3: Gaps

### Missing concepts (26, deduplicated)

| # | concept | images | what | lucide | fluent |
|---|---|---|---|---|---|
| 1 | atom | 4, 9 | two crossed orbits + nucleus | atom | — |
| 2 | wrench | 5 | open-ended wrench | wrench | wrench_16_regular |
| 3 | bandage | 5 | capsule band-aid with pad | bandage | — |
| 4 | satellite | 6 | Sputnik-style orb trailing three antennas | satellite | — |
| 5 | route | 6 | S-path from a start ring to an × destination | route | flow_dot_16_regular |
| 6 | target-arrow | 6, 8 | open concentric rings with a fletched dart | target, goal | target_arrow_16_regular |
| 7 | radar | 6 | open concentric rings with a sweep line | radar | radar_20_regular |
| 8 | cookie | 6, 9 | bitten cookie with chips | cookie | cookies_16_regular |
| 9 | z-fold-panels | 6 | two offset panels joined by a slanted one; meaning unclear | — | — |
| 10 | pipe | 6 | pipe elbow with end flanges | — | pipeline_20_regular |
| 11 | arrow-right-left | 6 | horizontal swap arrows | arrow-right-left | arrow_swap_16_regular |
| 12 | brain family | 6, 12 | brain in three fold-detail levels (brain, brain-2, brain-3), plus brain-hourglass and brain-off | brain | brain_16_regular |
| 13 | head profile family | 12 | head facing left with a dot, a small ring or a large ring (head-dot, head-ring, head-ring-large) | — (speech) | — (thinking_20_regular) |
| 14 | cube | 7 | plain isometric cube (Area's package is the taped box) | box | cube_16_regular |
| 15 | cube-wireframe | 7 | hexagon cut into six triangles: a transparent cube | — | — |
| 16 | case-upper | 8 | uppercase 'AB' (typography, font file) | case-upper | text_case_uppercase_16_regular |
| 17 | binary | 8 | '01' over '10' | binary | — |
| 18 | circle-dashed | 8 | dashed ring (Area has only the dashed square) | circle-dashed | circle_hint_16_regular |
| 19 | circle-dot-dashed | 9 | dashed ring with a centre dot | circle-dot-dashed | — |
| 20 | crosshair | 9 | ring with four inward ticks and a centre dot | crosshair, locate-fixed | my_location_16_regular |
| 21 | chart-scatter | 9 | axes with scattered points | chart-scatter | data_scatter_20_regular |
| 22 | app-window | 9 | window with three dots at top left | app-window-mac | window_16_regular |
| 23 | badge-question | 9 | scalloped seal with a ? (Area has no seal shape) | badge-question-mark | — (checkmark_starburst_16_regular is the seal) |
| 24 | elephant | 9 | elephant (likely a file-type mark: PHP or Postgres) | — | — |
| 25 | dog-face | 9 | pug face (likely the Pug template file type) | dog | animal_dog_16_regular |
| 26 | dollar-sign (cost tiers) | 13 | '$' and '$$$' for Cost – Low / Cost – High | dollar-sign | currency_dollar_euro_16_regular |

### Variants (24, deduplicated: Area base + Cursor modifier)

| # | Area base | modifier | Cursor icon | images |
|---|---|---|---|---|
| 1 | send | hexagon around | agent-hexagon | 6, 7 |
| 2 | send | circle around | agent-circle | 6 |
| 3 | send | rounded square around | agent-square | 6 |
| 4 | send | stacked back copy (two edges) | agents-stacked | 6 |
| 5 | send | ×4 in a 2×2 group | agents-swarm | 6, 13 |
| 6 | person | speech bubble beside | person-chat | 6 |
| 7 | plug | slash | plug-off | 6 |
| 8 | bug | slash, which doubles as two legs | bugbot | 6, 7, 13 |
| 9 | square (rectangle / stop) | short slash inside | square-slash | 6 |
| 10 | search | prohibited badge, top right | search-off | 6 |
| 11 | flask | prohibited badge, bottom right | flask-off | 6 |
| 12 | play | small bug badge, lower left (play left open) | bug-play | 7 |
| 13 | fast-forward | small bug badge, lower left | debug-continue | 7 |
| 14 | play | circle around | play-circle | 7 |
| 15 | desktop | play badge, top right (screen corner cut) | monitor-play | 7 |
| 16 | document | 'PDF' label | file-pdf | 8 |
| 17 | arrow-down | rounded square around | download-square | 8 |
| 18 | shield | ? inside | shield-question | 9 |
| 19 | square (rectangle / stop) | centre dot | square-dot | 9 |
| 20 | bell | notification dot, top right | bell-dot | 9 |
| 21 | braces | notification dot, bottom right | braces-dot | 9 |
| 22 | compass | notification dot on the ring, bottom right | compass-dot | 9 |
| 23 | chat | notification dot, top right | chat-dot | 9 |
| 24 | square (rectangle / stop) | notification dot, top right | square-badge | 9 |

### Exists, but drawn differently (worth a look)

- **Agent dart:** Cursor's is Area's send dart turned to point up-right, and it means *agent*. Area covers that meaning with bot.
- **Eye-off:** Cursor draws an eye with a slash. Area's closed eye is the owner's choice, and Cursor also has the closed eye (image 5).
- **Sparkle:** Cursor adds a small companion star. The owner dislikes satellites.
- **Blocks:** the square-block version of Area's puzzle (Integrations).
- **Kanban:** a square with three hanging bars. Area's is a board with a header.
- **Bold:** an outline B. Area's is solid by decision.
- **Question mark:** a bare ?. Area has only the ringed help.
- **Flame:** double. Area's is single.
- **Chat:** a square bubble with a centred tail.
- **Database:** three layers. Area's has two.
- **Chip:** Cursor has two detail levels (chip, chip-simple). Area has one.
- **Document:** bullet rows. Area's has text lines.

### Uncertain reads

- The z-fold-panels meaning is unknown.
- Satellite is read as a Sputnik orb.
- Radar could be a target without its arrow.
- Elephant and pug are probably file-type marks (PHP or Postgres, and Pug templates).
- The 3 + 2 dot rectangle is read as a keyboard (it could be a keypad).
- The brain and head 'levels' meaning is inferred.
- The Cost – Low row is cut off at the bottom of image 13.
- Keylines are not inferred from image 9. On the dot-label scale its rings and squares look larger than Cursor's published ⌀14 / 13 keylines, so the sheet's absolute size is unverified.
