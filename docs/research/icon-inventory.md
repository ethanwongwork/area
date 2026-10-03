# Icon inventory and build queue

**Updated:** 2026-09-28. **Sources:** the owner's screenshots of Cursor's icon set (twelve
sheets: the 4 × 49 overview, outline/filled pairs, the agent, bug and cube families, the dot
scale, the migration grid, the icon browser, a search for "think", the concept table and the
16/24px filled grid); Lucide's names and tags (lucide-static, ISC; names and search terms
only); Fluent's cuts (`@fluentui/svg-icons`, MIT). Cursor's drawings are proprietary: this
file records concepts and construction rules, never paths.

`npm run icons:find -- <concept>` searches Area's icons and this file's queue. Every queue
row names the plan (a batch, a variant of an existing icon, or why it is not planned), what
the icon shows, the references to read (Lucide name, Fluent stem) and where products use it.

## Summary

The twelve sheets hold about 860 icon cells (many repeat across sheets). Against Area's 376
icons (with turns and mirrors) the three catalogues in `icon-inventory/` count:

| Sheets | Icons | Exists in Area | Variant of an Area icon | Missing |
|---|---|---|---|---|
| overview (sheet 3) | 196 | 86 | 60 | 50 |
| app grids (icon browser, 16/24px sheet, migration grid) | 532 | 258 | 170 | 104 |
| families, dots, think search, concepts | 140 | 74 | 29 | 37 |

After merging repeats and names, the build queue below holds **109 concepts in twelve batches
(44–55)**, with 21 more for later and 6 not planned. About half the queue is variants: an Area
base with a container, a corner badge, a dot, a turn or a stack, which the family rules make
quick to draw. The catalogues (`icon-inventory/cursor-*.md`) keep every cell with its match,
Lucide name, Fluent stem and use; use them to check a concept's evidence.

## What Cursor's set teaches

- **Containers with a mark.** A large share of the set is one container and one small mark:
  a rounded square, a ring, a hexagon or a dashed ring, holding an arrow (four directions
  and four diagonals), a dot, a check, a plus, a minus, a ×, a slash, a smile, a T, a text
  cursor or the agent mark. Area has some of these (add-circle, remove-circle, error,
  arrow-up-circle, stop-circle, record, checkbox) but no rule for the square container. A
  container family needs one container per shape and the mark sizes that sit inside it
  (the ring already has them: the 2 / 4 check, the 5px ×).
- **A dot scale by role.** Cursor's dots come in five sizes at its 24px grid: 1.5 (details:
  eyes, bullets on a page), 1.75 (window and server lights, the dot of a ? in a badge), 2.0
  (a nucleus, dice and keyboard keys, cookie chips, the i and ? dots), 2.5 (the more dots,
  list bullets, a centre dot) and 4.0 (a notification dot on a corner: bell, braces,
  compass, chat, square). The five sizes scale together (dot : line about 1.2, 1.4, 1.6, 2.0
  and 3.2). Area has the middle two at 16px (⌀1.5 details, ⌀2 marks); the notification dot is
  new: about ⌀3 at 16px, its centre about 1.26 lines in from the host's corner so its outer
  edge is flush with the host's ink, the host stopping 2–2.8 line widths short of it; on a
  ring (compass) it sits on the ring at 45°.
- **Two off forms.** The corner-to-corner slash (Cursor lays it over the base with no gap;
  Area cuts the base one-sided, which stays) and a small prohibited ring on a corner with the
  base cut back round it (search-off, flask-off): a second off form for icons a slash would
  split badly.
- **Filled variants** (outline/filled pairs): the object becomes solid and details become
  negative space (smile's face, kanban's bars, the bug's midline), line glyphs thicken
  (pause), solid parts stay parted by gaps (the database's bands), and a small satellite
  sparkle is kept beside the main one (Area's owner has turned satellites down: sparkle stays
  single).
- **Families from one mark.** The agent mark (a cursor-like arrow) is reused alone, doubled,
  as a swarm of four, and inside a hexagon, a ring and a square; the bug appears alone,
  slashed, and small beside a play arrow (run and debug); the cube as a cube, a cube with
  spokes, a package and a cube holding the agent mark. Area's rule already says grouped
  functions reuse their base exactly and change it only by a shared modifier.
- **A concept table.** Cursor maps product concepts to icon names with a status (Agent →
  agent, Ask → question-circle, Beta → flask, Browser → globe, Bug → bug, Bugbot → bugbot,
  Cloud agents → cloud, Compute large → chip, Compute small → chip-simple, Contact →
  envelope, Context → at, Cost high → cost-high). Area's demo labels (`LABELS` in
  `src/demos/icons.tsx`) are the same idea; `icons:find` searches them.
- **Two cuts.** Cursor draws each icon at 16 and 24px, outline and filled. Area keeps one
  16px drawing and a size curve for the line (docs/specs/icons.md, Sizes), with a 12px cut
  only where a dense icon needs one.

## Build queue

Batches in order; each row is one concept. *Plan* is its batch. Draw a batch with the skill's quick path and record it with `npm run icons:batch`; then change its rows' plan to `drawn: batch-NN`.

### Batch 44 · Square containers

Stop's square (11 × 11, r 2) holding one mark at its inside size; directions are turns of one drawing.

| concept | plan | what it shows | references | uses |
|---|---|---|---|---|
| square-dot | drawn: batch-44 | the square with a centre dot | Lucide `square-dot` | a status, diff modified, a set point |
| square-slash | drawn: batch-44 | the square with a short free diagonal inside (not the shared slash) | Lucide `square-slash` | none, no fill, disabled |
| square-plus | drawn: batch-44 | the square with the inside plus | Lucide `square-plus` · Fluent `add_square_16` | add an item, diff added |
| square-minus | drawn: batch-44 | the square with the inside minus | Lucide `square-minus` · Fluent `subtract_square_16` | remove, collapse, diff removed |
| square-arrow-up | drawn: batch-44 | the square with an inside arrow; right, down and left are turns | Lucide `square-arrow-up` · Fluent `arrow_square_down_20` | move, import, export |
| square-arrow-up-right | drawn: batch-44 | the square with a diagonal inside arrow; the other diagonals are turns | Lucide `square-arrow-up-right` · Fluent `arrow_square_up_right_20` | go to, jump to a result |
| square-text | drawn: batch-44 | the square with text's T | Lucide `type` · Fluent `textbox_16` | text block, text layer |
| square-text-cursor | drawn: batch-44 | the square with text-cursor's I-beam | Lucide `text-cursor-input` · Fluent `textbox_16` | input field, form |
| square-list | drawn: batch-44 | the square with three list lines | Lucide `square-menu` · Fluent `text_bullet_list_square_16` | list block, outline |
| square-search | drawn: batch-44 | the square with a small lens | Lucide `scan-search` | find in page, search results |

### Batch 45 · Circle containers and status rings

The r 6 ring holding a mark (add-circle's construction), and the dashed ring for task states.

| concept | plan | what it shows | references | uses |
|---|---|---|---|---|
| arrow-down-circle | drawn: batch-45 | arrow-up-circle turned (left and right too) | Lucide `circle-arrow-down` · Fluent `arrow_circle_down_16` | download, scroll to end |
| chevron-down-circle | drawn: batch-45 | the ring with an inside chevron; the other directions are turns | Lucide `circle-chevron-down` · Fluent `chevron_circle_down_16` | expand a section, step |
| play-circle | drawn: batch-45 | the ring with a small play | Lucide `circle-play` · Fluent `play_circle_16` | play a video, run |
| pause-circle | drawn: batch-45 | the ring with pause's bars | Lucide `circle-pause` · Fluent `pause_circle_16` | pause, hold |
| alert-circle | drawn: batch-45 | the ring with warning's ! (info's construction) | Lucide `circle-alert` · Fluent `error_circle_16` | validation error, attention |
| circle-dashed | drawn: batch-45 | the ring drawn dashed (square-dashed's rhythm) | Lucide `circle-dashed` · Fluent `circle_hint_16` | backlog, draft, not started |
| circle-dot-dashed | drawn: batch-45 | the dashed ring with a centre dot | Lucide `circle-dot-dashed` | in progress, pending |
| circle-check-dashed | drawn: batch-45 | status-available with half its ring dashed | Lucide `circle-check` · Fluent `checkmark_circle_hint_16` | in review, partly done |

### Batch 46 · Notification dot

A new shared part (owner to settle its size): a solid dot about ⌀3 on the host's top-right corner, its outer edge flush with the host's ink, the host cut open a tight gap round it; on a ring it sits on the ring at 45° (Cursor's 4px dot at 24).

| concept | plan | what it shows | references | uses |
|---|---|---|---|---|
| bell-dot | drawn: batch-46 | bell with the dot | Lucide `bell-dot` · Fluent `alert_badge_16` | unread notifications |
| chat-dot | drawn: batch-46 | chat with the dot | Lucide `message-square-dot` | unread message, open comment |
| mail-dot | drawn: batch-46 | mail with the dot | Lucide `mail` · Fluent `mail_unread_16` | unread mail |
| square-badge | drawn: batch-46 | the square with the dot on its corner | Lucide `app-window` | an app or tab with news |
| compass-dot | drawn: batch-46 | compass with the dot on its ring | Lucide `compass` | new places to explore |
| braces-dot | dropped (batch 46 and 65: the dot takes the brace's hook) | braces with the dot at the bottom right | Lucide `braces` · Fluent `braces_16` | code with changes |

### Batch 47 · Corner badges: check, prohibited, play

The corner-mark placement (document-add's) with three more marks: the small check, a small prohibited ring and a small play.

| concept | plan | what it shows | references | uses |
|---|---|---|---|---|
| folder-check | drawn: batch-47 | folder with the small check on its corner | Lucide `folder-check` | synced, verified folder |
| compass-check | removed (owner, 2026-10-02: niche) | compass with the small check | Lucide `compass` | explored, visited |
| scan-check | drawn: batch-47 | corners with the inside check | Lucide `scan-line` | verified, scan complete |
| desktop-check | drawn: batch-47 | desktop with the small check | Lucide `monitor-check` · Fluent `desktop_checkmark_16` | deployed, device verified |
| search-off | drawn: batch-47 | search with a small prohibited ring on its corner (Cursor's second off form) | Lucide `search-slash` | no results, search disabled |
| flask-off | drawn: batch-47 | flask with the prohibited ring | Lucide `flask-conical-off` · Fluent `beaker_off_20` | beta off, experiments disabled |
| desktop-play | drawn: batch-47 | desktop with a small play on its corner, the screen cut back | Lucide `monitor-play` | run a preview, present |
| bug-play | removed (owner, 2026-10-02: niche) | play with a small bug on its corner | Lucide `bug-play` | run and debug |
| bug-off | drawn: batch-57 | bug with the shared slash | Lucide `bug-off` · Fluent `bug_prohibited_20` | code review bot, bugs off |
| plug-off | drawn (batch 65) | plug with the shared slash | Lucide `unplug` · Fluent `plug_disconnected_16` | disconnected, server off |

### Batch 48 · Agents and AI

One agent mark reused in containers (the family rule), the brain for reasoning, and the sparkle placed in other icons.

| concept | plan | what it shows | references | uses |
|---|---|---|---|---|
| agent | drawn: batch-48 | a navigation dart pointing up-right (Lucide's navigation; Cursor's agent mark), send's dart turned 45° | Lucide `navigation` · Fluent `location_arrow_16` | agent mode, locate me |
| agent-circle | drawn: batch-48 | the dart in the ring | Lucide `navigation` · Fluent `location_arrow_16` | agent status |
| agent-square | drawn: batch-48 | the dart in the square | Lucide `navigation` · Fluent `location_arrow_16` | agent app, agent tab |
| agent-hexagon | drawn: batch-48 | the dart in the hexagon (batch 51's) | Lucide `hexagon` · Fluent `hexagon_16` | agent workspace |
| agents | drawn: batch-48 | four small darts in a 2 × 2 | Lucide `navigation` · Fluent `agents_16` | multiple agents, parallel runs |
| brain | drawn: batch-58 | a brain: two lobed halves and a centre line | Lucide `brain` · Fluent `brain_16` | AI, reasoning, memory |
| brain-off | drawn: batch-58 | brain with the shared slash | Lucide `brain` · Fluent `brain_16` | reasoning off |
| brain-thinking | removed (owner, 2026-10-02: niche) | brain with a small hourglass | Lucide `brain-cog` · Fluent `brain_16` | thinking, reasoning in progress |
| chat-sparkle | drawn: batch-48 | chat with the sparkle inside | Lucide `message-square` · Fluent `chat_sparkle_16` | ask AI, AI chat |
| grid-sparkle | drawn: batch-48 | grid with the sparkle as its fourth tile | Lucide `layout-grid` | AI apps, generate a component |
| grid-plus | drawn: batch-48 | grid with the plus as its fourth tile | Lucide `layout-grid` | add an app or widget |
| corners-sparkle | drawn: batch-48 | corners with the sparkle inside | Lucide `scan` | smart select, AI capture |

### Batch 49 · Arrows 2

Turns and mirrors first; new drawings only where the arrow system needs them.

| concept | plan | what it shows | references | uses |
|---|---|---|---|---|
| arrow-left-right | drawn: batch-49 | one stem with a head at each end; arrow-up-down is its turn | Lucide `move-horizontal` · Fluent `arrow_bidirectional_left_right_16` | resize, stretch |
| arrow-right-left | drawn: batch-49 | two opposed arrows (swap) | Lucide `arrow-right-left` · Fluent `arrow_swap_16` | swap, switch, exchange |
| arrow-right-to-line | drawn: batch-49 | an arrow stopping at a bar; the other directions are turns | Lucide `arrow-right-to-line` · Fluent `arrow_export_ltr_16` | move to the end, tab, collapse to a side |
| arrow-big-right | drawn: batch-49 | shift's block arrow turned (down and left too) | Lucide `arrow-big-right` | next, emphasis |
| caps-lock | drawn: batch-49 | shift with a bar below | Lucide `arrow-big-up-dash` | caps lock, uppercase |
| chevrons-right | drawn: batch-49 | two chevrons (open: 60° arms or a 6px shift keep both the lattice and the gap scale) | Lucide `chevrons-right` · Fluent `chevron_double_right_16` | skip ahead, collapse a panel |
| chevrons-down-up | drawn: batch-49 | chevrons-up-down with the chevrons turned in | Lucide `chevrons-down-up` | collapse all |
| chevrons-left-right | drawn: batch-49 | chevrons-up-down transposed | Lucide `chevrons-left-right` | resize width |
| refresh-cw | drawn: batch-49 | refresh mirrored (clockwise) | Lucide `refresh-cw` | reload |

### Batch 50 · Files

Document and folder with shared modifiers: the stack, a corner mark, an arrow out.

| concept | plan | what it shows | references | uses |
|---|---|---|---|---|
| files | drawn: batch-50 | document with a back copy (copy's stack) | Lucide `files` · Fluent `document_multiple_16` | several files, attachments |
| file-lock | drawn: batch-57 | document with a small lock on its corner | Lucide `file-lock` · Fluent `document_lock_16` | private, restricted |
| file-diff | drawn (batch 65) | document with a plus over a minus | Lucide `file-diff` | changes, review, diff |
| file-export | drawn: batch-50 | document with an arrow out of its corner | Lucide `file-output` · Fluent `document_arrow_right_16` | export, open file |
| folders | drawn: batch-57 | folder with a back copy | Lucide `folders` · Fluent `folder_multiple_16` | collections, projects |
| folder-dashed | removed (owner, 2026-10-02: niche) | folder drawn dashed | Lucide `folder-dot` | placeholder, draft folder |
| clipboard-list | drawn: batch-50 | clipboard with list lines | Lucide `clipboard-list` · Fluent `clipboard_task_list_16` | tasks, notes |

### Batch 51 · Code, git and shapes 2

Git's nodes and the type family's line.

| concept | plan | what it shows | references | uses |
|---|---|---|---|---|
| git-pull-request-closed | drawn: batch-51 | pull request with a × at its top right | Lucide `git-pull-request-closed` · Fluent `branch_request_closed_16` | closed pull request |
| git-pull-request-draft | drawn: batch-51 | pull request with its hook dashed | Lucide `git-pull-request-draft` · Fluent `branch_request_draft_16` | draft pull request |
| split | drawn: batch-51 | two arrows forking from one stem | Lucide `split` · Fluent `arrow_split_16` | fork, split a flow |
| brackets | drawn: batch-51 | square brackets | Lucide `brackets` | arrays, selection |
| binary | drawn (batch 65) | 01 over 10 in the icon line | Lucide `binary` | binary data, bits |
| asterisk | drawn: batch-51 | a six-armed asterisk | Lucide `asterisk` · Fluent `text_asterisk_16` | required, wildcard, footnote |
| plus-minus | drawn: batch-51 | ± | Lucide `diff` · Fluent `math_symbols_16` | tolerance, diff |
| hexagon | drawn: batch-51 | a pointy-top hexagon | Lucide `hexagon` · Fluent `hexagon_16` | shape, node |
| cube | drawn: batch-51 | an isometric cube: the hexagon with a Y (package without its tape) | Lucide `box` · Fluent `cube_16` | 3D, object, model |
| atom | drawn: batch-57 | two crossed orbits drawn as cubic paths (the lint measures paths, not rotated ellipses) and a nucleus | Lucide `atom` | science, React |

### Batch 52 · Text

The type family's letters (cap height 2.5–13.5).

| concept | plan | what it shows | references | uses |
|---|---|---|---|---|
| case-upper | drawn: batch-57 | AB | Lucide `case-upper` · Fluent `text_case_uppercase_16` | uppercase, font |
| case-sensitive | drawn: batch-57 | Aa | Lucide `case-sensitive` · Fluent `text_case_title_16` | match case, font |
| markdown | drawn: batch-57 | M with a down arrow | Lucide `file-type` | markdown mode, .md files |

### Batch 53 · Data and money

| concept | plan | what it shows | references | uses |
|---|---|---|---|---|
| chart-scatter | drawn: batch-53 | axes with scattered dots | Lucide `chart-scatter` · Fluent `data_scatter_20` | correlation, analytics |
| network | drawn: batch-53 | one node over three (a sitemap) | Lucide `network` · Fluent `organization_16` | hierarchy, sitemap, org chart |
| waypoints | drawn: batch-58 | three nodes joined at a centre | Lucide `waypoints` | graph, connections |
| dollar | drawn: batch-53 | $ | Lucide `dollar-sign` · Fluent `currency_dollar_euro_16` | price, billing, cost |
| cost-tiers | removed (owner, 2026-10-02: niche) | one, two and three $ (cost-low, cost-medium, cost-high) | Lucide `dollar-sign` | model cost tiers |
| vault | drawn: batch-56 | a safe with a dial | Lucide `vault` · Fluent `vault_16` | secrets, storage |
| layout-dashboard | drawn: batch-53 | four panes of two heights | Lucide `layout-dashboard` · Fluent `board_split_16` | dashboard, overview |

### Batch 54 · Messages and calls

Chat and call with shared modifiers.

| concept | plan | what it shows | references | uses |
|---|---|---|---|---|
| chat-question | drawn (batch 65) | chat with a ? | Lucide `message-circle-question-mark` · Fluent `chat_help_16` | help, FAQ |
| chat-code | drawn: batch-54 | chat with code's chevrons | Lucide `message-square-code` | code review comment |
| chat-more | drawn: batch-54 | chat with more's dots | Lucide `message-square-more` | typing, more replies |
| chat-warning | drawn: batch-57 | chat with an ! | Lucide `message-square-warning` · Fluent `comment_error_16` | flagged, failed message |
| chat-dashed | removed (owner, 2026-10-02: niche) | chat drawn dashed | Lucide `message-square-dashed` | draft comment |
| person-chat | drawn: batch-58 | person beside a small chat bubble | Lucide `user-round` · Fluent `person_chat_16` | contact support |
| check-check | drawn: batch-56 | two checks | Lucide `check-check` | read, all done |
| call-incoming | drawn: batch-57 | call with an arrow in (call-outgoing: out) | Lucide `phone-incoming` · Fluent `call_inbound_16` | call history |
| smile-plus | drawn: batch-58 | smile with a plus beside it | Lucide `face-slightly-smiling-plus` · Fluent `emoji_add_16` | add a reaction |

### Batch 55 · Objects 2

| concept | plan | what it shows | references | uses |
|---|---|---|---|---|
| wrench | drawn: batch-57 | an open-ended wrench on the diagonal | Lucide `wrench` · Fluent `wrench_16` | tools, MCP tools, fix |
| bandage | drawn: batch-57 | a band-aid on the diagonal | Lucide `bandage` | fix, patch |
| target | drawn: batch-55 | two rings and a centre dot | Lucide `target` · Fluent `target_16` | goal, focus |
| goal | drawn (batch 65) | target with a dart in it | Lucide `goal` · Fluent `target_arrow_16` | goals, objectives |
| crosshair | drawn: batch-55 | a ring with four ticks and a dot | Lucide `crosshair` | pick an element, locate |
| radar | drawn (batch 65) | open rings with a sweep | Lucide `radar` · Fluent `radar_20` | scan, monitor |
| route | drawn: batch-56 | a path from a start ring to an end | Lucide `route` | journey, plan |
| binoculars | drawn: batch-58 | binoculars | Lucide `binoculars` | explore, watch |
| broom | drawn (batch 65) | a broom | Lucide `brush-cleaning` · Fluent `broom_16` | clean up, clear all |
| presentation | drawn: batch-56 | an easel with a board | Lucide `presentation` · Fluent `whiteboard_16` | slides, present |
| app-window | drawn: batch-57 | a window with three dots in its bar | Lucide `app-window-mac` · Fluent `window_16` | browser, app preview |
| blocks | drawn: batch-56 | three tiles and a fourth lifted off | Lucide `blocks` · Fluent `apps_add_in_16` | apps, extensions |
| gallery | drawn: batch-57 | a card with others behind at the sides | Lucide `gallery-horizontal-end` | carousel, gallery view |
| badge-check | drawn: batch-56 | a scalloped seal with the inside check (badge: the seal alone) | Lucide `badge-check` · Fluent `checkmark_starburst_16` | verified, certified |
| cookie | drawn: batch-56 | a bitten cookie with chips | Lucide `cookie` · Fluent `cookies_16` | cookie consent, privacy |
| disc | drawn: batch-55 | a disc with a hole | Lucide `disc` · Fluent `cd_16` | media, album |
| infinity | drawn: batch-55 | ∞ | Lucide `infinity` | unlimited, loop |
| clapperboard | drawn: batch-56 | a clapperboard | Lucide `clapperboard` · Fluent `movies_and_tv_16` | video, production |

### Leisure and games (no product surface asks for them yet)

| concept | plan | what it shows | references | uses |
|---|---|---|---|---|
| utensils | drawn: batch-59 | fork and knife | Lucide `utensils` · Fluent `food_16` | food, restaurants |
| chef-hat | drawn: batch-60 | a chef's hat | Lucide `chef-hat` | recipes, templates |
| dumbbell | drawn: batch-59 | a dumbbell | Lucide `dumbbell` · Fluent `dumbbell_16` | fitness |
| basketball | drawn: batch-59 | a ball with seams | Lucide `volleyball` · Fluent `sport_basketball_20` | sports |
| chess-rook | drawn: batch-60 | a rook (chess-king too) | Lucide `chess-rook` · Fluent `chess_16` | games, strategy |
| castle | covered: chess-rook | a castle | Lucide `castle` | security, games |
| deck-chair | removed (owner, 2026-10-02: niche; beach rejected) | a deck chair | Lucide `tree-palm` · Fluent `beach_16` | away, vacation |
| piano | drawn: batch-59 | keys | Lucide `piano` | music |
| vr-goggles | drawn: batch-60 | a headset | Lucide `glasses` · Fluent `headset_vr_20` | VR, immersive |
| crystal-ball | drawn: batch-59 | a ball on a stand | — | predictions |
| satellite | removed (owner, 2026-10-02: niche) | a satellite | Lucide `satellite` | remote, broadcast |
| toy-brick | drawn: batch-59 | a brick with studs | Lucide `toy-brick` | components |
| circuit-board | drawn: batch-60 | a board with traces | Lucide `circuit-board` | hardware |
| cube-wireframe | drawn: batch-60 | the hexagon with three diameters | Lucide `box` · Fluent `cube_16` | 3D wireframe |
| head-thinking | later | a head in profile with a dot, a small or a large ring (Cursor's effort levels) | — | reasoning effort |
| agent-stack | dropped (the pointer agent mark was replaced) | the agent dart with a back copy | Lucide `navigation` | background agents |
| file-pdf | later | a page with a bold label (PDF, CSV, ZIP): the file-type family needs a small bold letter set | Lucide `file-text` | file types |
| square-smile | drawn: batch-59 | the square with smile's face | — | sticker, emoji |

### Cursor's older codicon-style debugger icons

| concept | plan | what it shows | references | uses |
|---|---|---|---|---|
| debug-step | drawn: batch-60 (step over) | step into, over, out and back: an arrow with a dot | — | debugger |
| breakpoint | drawn: batch-60 | breakpoint shapes and states (circle, diamond, hexagon, dashed) | — | debugger |
| stack-frame | drawn: batch-60 | a stack frame and the active frame | — | debugger |

## Not planned

| concept | plan | what it shows | references | uses |
|---|---|---|---|---|
| cursor-logo | not planned: brand mark | Cursor's own mark (four cuts) | — | — |
| copilot | not planned: brand mark | GitHub Copilot's faces | — | — |
| file-type-logos | not planned: brand marks; a file-type family with labels covers files | npm, Kotlin, Rust, R, PHP's elephant, Pug's dog: marks from Cursor's File Types section | — | — |
| crypto | not planned: brand marks | bitcoin, ethereum | — | — |
| owl | not planned: no product use found | an owl | — | — |
| bow-tie | not planned: no product use found | a bow tie | — | — |

## Covered already

Cursor concepts that Area draws under another name or another way, so no new icon is needed:
pop-out → open; arrow-big-up → shift; arrow-down-up → sort; browser → panel-top; beaker →
flask; brush → paintbrush; cardholder → wallet; circle-dot → token or record; color-mode →
contrast; cog → settings; comment → chat; cube with tape → package; cylinder → database;
dashboard gauge → gauge; four-arrow expand and shrink → expand and collapse; spinner rays →
loader; book closed or open → book; eye with a slash → eye-off (a closed eye, the owner's
choice); outline B → bold (solid, the owner's choice); sparkles with a satellite → sparkle
(single, the owner's choice); a three-band database, a double flame, a square chat bubble and
a square kanban → Area's own database, flame, chat and kanban. The full list is in
`icon-inventory/cursor-app-grids.md` ("Exists under another name or drawing").

## To settle with the owner

Settled 2026-09-28 (the owner took the recommendations from the decision sheet):

- **The notification dot:** ⌀3 (Fluent's bell badge, Cursor's ratio), top-right, the host cut
  round it by the overlap cut; on a ring at its 45° point (batch 46).
- **Square containers:** stop's square (11 × 11, r 2) with the ring's marks unchanged, a tight
  1.38 to the sides as checkbox (batch 44).
- **The agent mark:** Fluent's agents shape, a hexagon split by a slash (the flipped pointer
  read as Cursor's cursor; batch 48).
- **Corner badges:** no prohibited ring and no small bug; flask-off takes the shared slash,
  search-off a full slash through the lens, perpendicular to the handle (batch 47).
- **Chevrons-right:** Fluent's 4px spacing; its 1.70 gap is tight under the detail round's
  scale (batch 49).
