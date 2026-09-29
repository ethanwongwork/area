<!-- Catalogue of the owner's Cursor screenshots (2026-09-28): Sheet 3, the 4 × 49 overview (rounded-square, ring, hexagon and object quadrants). Positions refer to zoomed tiles of those screenshots, which are not stored in the repository. Summarised in ../icon-inventory.md. -->

# Inventory A — Cursor icon sheet 3 vs Area

Source: `images/3.png` (1920 × 1920), read through the zoomed tiles `tiles/img3-r0c0 … r1c1.png` and
re-cropped per icon at 3–5× (`scratchpad/invA/z-*.png`). Area drawings were rendered from
`apps/docs/assets/area-icons-pilot/*.svg` (`invA/area-*.png`) so "exists" is judged against Area's
actual glyphs, not just names. Fluent candidates were rendered too (`invA/fl-*.png`).

- **tile**: `r0c0` top-left (icons in rounded squares), `r0c1` top-right (circled icons and misc),
  `r1c0` bottom-left, `r1c1` bottom-right. **row.col** is 1-based (`r1.1` = top-left icon of the tile).
- **area**: the Area icon that shows the same thing, or the base a variant modifies; for a missing
  concept the nearest Area icon is given as "(near: …)".
- **status**: `exists` (same object/meaning; drawing differences noted), `variant` (Area has the base,
  Cursor adds the named modifier), `missing`.
- **lucide**: verified against `lucide-tags.json` (this Lucide build renames `smile` →
  `face-slightly-smiling`, `history` → `rotate-ccw-clock`). **fluent**: verified file stem
  (`<stem>_regular.svg`), 16px cut where one exists, else 20px.
- A `?` in the concept marks an icon whose meaning I could not pin down; the description is literal.

Two things recur across the sheet:
1. **Cursor's pointer** — a notched arrow with its tip at the upper right (Lucide `navigation`, Fluent
   `location_arrow`) — appears in a square (r0c0 r1.3), a ring (r0c1 r1.3) and a hexagon (r0c1 r5.5,
   which reads as Cursor's own logo). Area's `pointer` is the same arrow facing up-left, so these are
   treated as pointer variants.
2. Several sharp-cornered or lettered marks look like **brand/file-type logos** rather than generic
   objects: r0c0 r5.1 (npm's "n" block), r0c0 r5.2 (Kotlin's notched square), r0c1 r3.1 (Rust-style
   serif R), r0c1 r5.5 (Cursor), possibly r0c1 r5.4 / r5.6 and r1c1 r3.2. They are listed separately
   below so they can be confirmed before anyone draws them.

**Totals:** 196 icons (4 tiles × 49) — 86 exists, 60 variant, 50 missing (34 generic, 10 uncertain
shapes, 6 possible brand logos). Every lucide name, Fluent stem and Area name in the table was checked
by script against `lucide-tags.json`, the Fluent icons folder and `area-icons.txt`.

## Catalogue

| tile | row.col | concept | what it shows | area | status | lucide | fluent | uses |
|---|---|---|---|---|---|---|---|---|
| r0c0 | r1.1 | square | plain rounded square outline | stop | exists | square | square_16 | stop, empty checkbox, shape |
| r0c0 | r1.2 | square-badge | rounded square whose top-right corner is broken by a filled dot | stop | variant: + dot badge | — | badge_20 | unread, new item, changes |
| r0c0 | r1.3 | pointer-square | Cursor's notched pointer (tip up-right) inside a rounded square | pointer | variant: + square frame (arrow faces up-right) | navigation | location_arrow_16 | Cursor mark, agent, select |
| r0c0 | r1.4 | square-arrow-down | down arrow in rounded square | arrow-down | variant: + square frame | square-arrow-down | arrow_square_down_20 | download, move down |
| r0c0 | r1.5 | square-arrow-left | left arrow in rounded square | arrow-left | variant: + square frame | square-arrow-left | arrow_left_16 | back, move left |
| r0c0 | r1.6 | square-arrow-up | up arrow in rounded square | arrow-up | variant: + square frame | square-arrow-up | arrow_up_16 | upload, move up, submit |
| r0c0 | r1.7 | square-arrow-right | right arrow in rounded square | arrow-right | variant: + square frame | square-arrow-right | arrow_right_16 | next, go to, enter |
| r0c0 | r2.1 | square-arrow-down-left | down-left arrow in rounded square | arrow-down-left | variant: + square frame | square-arrow-down-left | arrow_down_left_16 | dock, minimize, move in |
| r0c0 | r2.2 | square-arrow-up-left | up-left arrow in rounded square | arrow-up-left | variant: + square frame | square-arrow-up-left | arrow_up_left_16 | go to origin, pop in |
| r0c0 | r2.3 | square-arrow-up-right | up-right arrow inside a closed rounded square (Area's `open` is the arrow-leaving-box idiom) | arrow-up-right | variant: + square frame | square-arrow-up-right | arrow_square_up_right_20 | open link, external, pop out |
| r0c0 | r2.4 | square-arrow-down-right | down-right arrow in rounded square | arrow-down-right | variant: + square frame | square-arrow-down-right | arrow_down_right_16 | expand, move out |
| r0c0 | r2.5 | square-slash | rounded square with a long falling diagonal (top-left to bottom-right) inside | stop | variant: + slash | square-slash | — | none/no fill, ignored (git), disabled |
| r0c0 | r2.6 | square-check | check in rounded square | checkbox | exists | square-check | checkbox_checked_16 | done, checked, task |
| r0c0 | r2.7 | square-dot | small dot centred in rounded square | stop | variant: + centre dot | square-dot | — | modified (git), selected, point |
| r0c0 | r3.1 | square-minus | minus in rounded square | minus | variant: + square frame | square-minus | subtract_square_16 | collapse, indeterminate, remove |
| r0c0 | r3.2 | square-plus | plus in rounded square | add | variant: + square frame | square-plus | add_square_16 | add, new, expand tree |
| r0c0 | r3.3 | square-kanban | three bars of different lengths hanging from the top of a rounded square | kanban | exists | square-kanban | board_16 | board, projects, tasks |
| r0c0 | r3.4 | vault | small ring with four diagonal spokes to the corners, in a rounded square (safe dial) | — | missing | vault | vault_16 | secrets, safe, secure storage |
| r0c0 | r3.5 | square-smile | smiley (dash eyes, smile) in a rounded square | smile | variant: square frame instead of ring | sticker | sticker_16 | emoji, reaction, sticker |
| r0c0 | r3.6 | square-text | letter T in a rounded square | text | variant: + square frame | type | text_t_16 | text layer, text field |
| r0c0 | r3.7 | square-double-cross? | rounded square; a vertical stroke hangs from the top edge, crossed by two short bars (‡-like) | — | missing | — | — | unknown (align/marker?) |
| r0c0 | r4.1 | server | square split into two stacked units, two dots at the right of each | server | exists | server | server_16 | servers, hosting, infrastructure |
| r0c0 | r4.2 | banknote-stack | square: top band holds an oval between two bars (a note), two stripes below (stacked notes) | banknote | variant: + stack | banknote | money_16 | cash, payments, billing |
| r0c0 | r4.3 | wallet-cards | rounded square with a top rule and a second line dipping in a U (card holder); could also read as a tray | wallet | variant: + cards | wallet-cards | wallet_credit_card_16 | wallet, cards, payment method |
| r0c0 | r4.4 | layout-panel-left | square: full-height left half, right half split top/bottom (Area's `layout` is header + sidebar) | layout | exists | layout-panel-left | layout_column_two_split_right_16 | layout, split view, panes |
| r0c0 | r4.5 | table | square with header row, narrow left column and rows | table | exists | sheet | table_16 | table, spreadsheet, data |
| r0c0 | r4.6 | film | film strip with sprocket columns on both sides | film | exists | film | filmstrip_16 | video, media |
| r0c0 | r4.7 | square-list-details? | rounded square with two rows of short + long dashes and a bullet + dash row | list | variant: + square frame | logs | text_bullet_list_square_16 | details, properties, logs |
| r0c0 | r5.1 | npm-logo? | sharp-cornered square with a tall notch cut up from the bottom, right of centre (∩, like npm's "n" block) | — | missing | — | — | package registry logo? |
| r0c0 | r5.2 | kotlin-logo? | sharp-cornered square with a V notch cut into its right side (Kotlin-like; or a pennant) | — (near: flag) | missing | — | — | language logo? / label |
| r0c0 | r5.3 | notched-square? | sharp-cornered square with a round notch cut into the middle of the top edge | — | missing | — | — | unknown (logo? shirt?) |
| r0c0 | r5.4 | save | floppy disk: cut top-left corner, label panel at bottom | save | exists | save | save_16 | save, save file |
| r0c0 | r5.5 | image | square image (mountain + sun) | image | exists | image | image_16 | image, photo, media |
| r0c0 | r5.6 | sticky-note | rounded square with folded bottom-right corner | sticky-note | exists | sticky-note | note_16 | note, memo |
| r0c0 | r5.7 | wallet | rounded square (right corners rounder), top rule from the left edge, clasp dot at left (mirrored wallet-minimal) | wallet | exists | wallet-minimal | wallet_16 | wallet, balance, billing |
| r0c0 | r6.1 | grid | 2 × 2 rounded squares | grid | exists | layout-grid | grid_16 | apps, gallery view |
| r0c0 | r6.2 | grid-plus | three squares plus a + in the fourth cell | grid | variant: + plus | grid-2x2-plus | apps_add_in_16 | add app, widgets, integrations |
| r0c0 | r6.3 | grid-sparkle | three squares plus a four-point sparkle in the fourth cell | grid | variant: + sparkle | layout-grid | apps_16 | AI apps, generate, smart blocks |
| r0c0 | r6.4 | square-pen | pencil breaking out of an open rounded square | compose | exists | square-pen | compose_16 | edit, compose, new chat |
| r0c0 | r6.5 | square-search | rounded square open at the bottom right, magnifier over the gap | search | variant: + square frame | scan-search | search_square_16 | find in page, inspect, preview |
| r0c0 | r6.6 | iteration-cw | rounded-square loop running clockwise, ending in a left-pointing head at the bottom | repeat | variant: single-arrow loop | iteration-cw | arrow_repeat_all_16 | loop, iterate, rerun |
| r0c0 | r6.7 | square-mouse-pointer | rounded square open at the bottom right, cursor arrow (tip up-left) over the gap | pointer | variant: + square frame | square-mouse-pointer | cursor_hover_16 | select element, inspect, click |
| r0c0 | r7.1 | layout-dashboard | two tall panes: left with a short top cell, right with a short bottom cell (masonry) | — (near: layout, columns) | missing | layout-dashboard | board_16 | dashboard, masonry, widgets |
| r0c0 | r7.2 | maximize | four arrows pointing out to the corners (Area draws two) | expand | exists | expand | arrow_expand_16 | fullscreen, expand |
| r0c0 | r7.3 | brackets | square brackets [ ] | — (near: braces) | missing | brackets | — | array, code, context |
| r0c0 | r7.4 | scan-frame | four corner brackets (Area's same marks are labelled corner radius) | corners | exists | scan | full_screen_maximize_16 | select area, focus, screenshot |
| r0c0 | r7.5 | scan-check | four corner brackets with a check inside | corners | variant: + check | scan | scan_type_checkmark_20 | verify, approve, done |
| r0c0 | r7.6 | scan-sparkle | four corner brackets with a four-point sparkle inside | corners | variant: + sparkle | scan | square_hint_sparkles_16 | AI select, smart capture |
| r0c0 | r7.7 | menu | three horizontal lines | menu | exists | menu | navigation_16 | menu, navigation |
| r0c1 | r1.1 | circle | plain circle outline | ellipse | exists | circle | circle_16 | shape, radio off, todo |
| r0c1 | r1.2 | circle-dot | ring with a small centre dot (Area's `record` dot is larger) | record | exists | circle-dot | radio_button_16 | radio selected, open issue, in progress |
| r0c1 | r1.3 | pointer-circle | Cursor's pointer (same as r0c0 r1.3) in a ring | pointer | variant: + ring | navigation | location_arrow_16 | Cursor mark, navigate, agent |
| r0c1 | r1.4 | circle-arrow-down | down arrow in a ring | arrow-down | variant: + ring (cf. arrow-up-circle) | circle-arrow-down | arrow_circle_down_16 | download, scroll down |
| r0c1 | r1.5 | clock | ring with hands at 12 and 9 | clock | exists | clock-9 | clock_16 | time, recent, pending |
| r0c1 | r1.6 | circle-plus | plus in a ring | add-circle | exists | circle-plus | add_circle_16 | add, new |
| r0c1 | r1.7 | circle-x | × in a ring | error | exists | circle-x | dismiss_circle_16 | clear, close, failed |
| r0c1 | r2.1 | circle-pause | two pause bars in a ring | pause | variant: + ring | circle-pause | pause_circle_16 | pause media, pause agent |
| r0c1 | r2.2 | circle-play | play triangle in a ring | play | variant: + ring | circle-play | play_circle_16 | play, run, start |
| r0c1 | r2.3 | ban | ring with a falling slash | prohibited | exists | ban | prohibited_16 | blocked, not allowed |
| r0c1 | r2.4 | contrast | ring split down the middle, right half hatched with horizontal lines (Area's half is solid) | contrast | exists | contrast | circle_half_fill_16 | theme, contrast, appearance |
| r0c1 | r2.5 | basketball | ring with a horizontal seam and two side arcs | — | missing | — | sport_basketball_20 | sports, activity, emoji category |
| r0c1 | r2.6 | globe | ring with equator and a meridian ellipse | globe | exists | globe | globe_16 | language, web, public |
| r0c1 | r2.7 | volleyball | ring with curved panel seams | — | missing | volleyball | sport_16 | sports, activity, emoji category |
| r0c1 | r3.1 | rust-logo? | serif R with a sweeping leg inside a ring (Rust-style R, or ®) | — | missing | copyright | — | language logo? / trademark |
| r0c1 | r3.2 | compass | ring with a diamond needle | compass | exists | compass | compass_northwest_16 | explore, discover |
| r0c1 | r3.3 | compass-check | compass whose ring is broken at lower right by a check | compass | variant: + check | compass | compass_northwest_16 | explored, visited |
| r0c1 | r3.4 | compass-dot | compass whose ring is broken at lower right by a filled dot | compass | variant: + dot badge | compass | compass_northwest_16 | new in explore, unread |
| r0c1 | r3.5 | disc-badge? | ring with an inner ring, broken at upper right by a filled dot | token | variant: + dot badge | disc | circle_multiple_concentric_16 | live/active status?, recording |
| r0c1 | r3.6 | smile | smiley in a ring | smile | exists | face-slightly-smiling | emoji_16 | emoji, reaction |
| r0c1 | r3.7 | smile-plus | smiley whose ring is broken at lower right by a plus | smile | variant: + plus | face-slightly-smiling-plus | emoji_add_16 | add reaction |
| r0c1 | r4.1 | film-reel | ring with four holes and a film tail running off along the bottom right | — (near: film) | missing | film | — | video, movie, media |
| r0c1 | r4.2 | target-arrow | two concentric rings (outer open at upper right) with a fletched arrow in the centre | — | missing | target | target_arrow_16 | goals, objectives, focus |
| r0c1 | r4.3 | radar? | two concentric broken rings with a line from the centre to the upper right | — | missing | radar | radar_20 | scan, detect, discover |
| r0c1 | r4.4 | badge | empty eight-point scalloped seal | — (near: award) | missing | badge | checkmark_starburst_16 | badge, verified, label |
| r0c1 | r4.5 | brain | brain: two lobes and a centre line | — | missing | brain | brain_16 | AI, thinking, memory |
| r0c1 | r4.6 | brain-off | brain (r4.5) with the falling slash | — | missing | brain | brain_16 | thinking off, memory off |
| r0c1 | r4.7 | settings | six-tooth gear with hub | settings | exists | settings | settings_16 | settings, preferences |
| r0c1 | r5.1 | database | stacked cylinder, three bands | database | exists | database | database_16 | database, data, storage |
| r0c1 | r5.2 | hexagon | pointy-top hexagon outline (Area's polygon is a triangle) | — (near: polygon) | missing | hexagon | hexagon_16 | shape, node/package, plugin |
| r0c1 | r5.3 | box | isometric cube: hexagon with a Y to the vertices (no tape) | package | exists | box | cube_16 | 3D, package, model |
| r0c1 | r5.4 | hexagon-spokes? | hexagon with spokes from the centre to all six corners | — | missing | hexagon | — | brand/3D mark? |
| r0c1 | r5.5 | cursor-logo? | hexagon with Cursor's pointer inside (reads as Cursor's logo) | pointer | variant: + hexagon frame | navigation | location_arrow_16 | Cursor brand, app, agent |
| r0c1 | r5.6 | hexagon-y? | hexagon with a short three-spoke Y at the centre, not reaching the sides | — (near: package) | missing | box | cube_16 | 3D object?, component? |
| r0c1 | r5.7 | hex-nut? | flat-top hexagon with a smaller pointy-top hexagon inside | — | missing | bolt | — | hardware, config, build |
| r0c1 | r6.1 | rotate-cw | open circular arrow, head at upper right (clockwise) | refresh | exists | rotate-cw | arrow_clockwise_16 | refresh, reload |
| r0c1 | r6.2 | refresh-ccw | two-arrow circle, heads at upper left and lower right | sync | exists | refresh-ccw | arrow_sync_16 | sync, refresh |
| r0c1 | r6.3 | refresh-cw | two-arrow circle, heads at upper right and lower left (mirror of r6.2) | sync | exists | refresh-cw | arrow_sync_16 | sync, update, reload |
| r0c1 | r6.4 | rotate-cw-clock | clock (hands 12 and 9) whose ring ends in a clockwise head at lower right; Area's history turns the other way | history | variant: mirrored (clockwise) | rotate-cw-clock | history_16 | rerun, restore, version history |
| r0c1 | r6.5 | gauge | open arc with a needle | gauge | exists | gauge | gauge_16 | performance, usage |
| r0c1 | r6.6 | at | @ sign | at | exists | at-sign | mention_16 | mention, email |
| r0c1 | r6.7 | asterisk | five-armed asterisk | — | missing | asterisk | — | required, wildcard, footnote |
| r0c1 | r7.1 | sun | circle with eight short rays | sun | exists | sun | weather_sunny_16 | light mode, brightness |
| r0c1 | r7.2 | loader | eight short rays with no circle (Area draws an arc) | loader | exists | loader | spinner_ios_16 | loading, pending |
| r0c1 | r7.3 | circle-dashed | dashed ring | ellipse | variant: dashed (cf. square-dashed) | circle-dashed | circle_hint_16 | backlog, draft, placeholder |
| r0c1 | r7.4 | circle-dot-dashed | dashed ring with a centre dot | ellipse | variant: dashed + centre dot | circle-dot-dashed | circle_hint_16 | pending, in progress |
| r0c1 | r7.5 | circle-dashed-check | ring with its left half dashed and right half solid, check inside | status-available | variant: half-dashed ring | circle-dashed-check | checkmark_circle_hint_16 | review, pending approval |
| r0c1 | r7.6 | cookie | round cookie with a bite and chips | — | missing | cookie | cookies_16 | cookie consent, privacy |
| r0c1 | r7.7 | palette | artist's palette with paint dots | palette | exists | palette | color_16 | colors, theme |
| r1c0 | r1.1 | rectangle | plain landscape rounded rectangle | rectangle | exists | rectangle-horizontal | rectangle_landscape_16 | shape, frame, window |
| r1c0 | r1.2 | app-window | landscape rectangle with three dots at the top left (window controls) | — (near: desktop) | missing | app-window-mac | window_16 | window, app, browser |
| r1c0 | r1.3 | keypad? | landscape rectangle holding five dots, three over two, offset | keyboard | exists | keyboard | keyboard_16 | keyboard, input, keys? |
| r1c0 | r1.4 | picture-in-picture | rectangle with a small rectangle at lower right | picture-in-picture | exists | picture-in-picture-2 | picture_in_picture_16 | pop-out video, mini player |
| r1c0 | r1.5 | inset-frame | rectangle with a centred inset rectangle (Area's padding, landscape) | padding | exists | square-square | slide_layout_20 | inset, padding, centred content |
| r1c0 | r1.6 | split-pane-dashed | solid left pane beside a dashed right pane | columns | variant: dashed right pane | panel-right-dashed | layout_column_one_third_right_hint_16 | split editor, new pane |
| r1c0 | r1.7 | panel-left-close | rectangle with a left divider and a ‹ chevron | panel-left-close | exists | panel-left-close | panel_left_contract_16 | collapse sidebar |
| r1c0 | r2.1 | mail | envelope | mail | exists | mail | mail_16 | mail, email |
| r1c0 | r2.2 | image | landscape image, mountain + sun (same concept as r0c0 r5.5) | image | exists | image | image_16 | image, photo |
| r1c0 | r2.3 | clapperboard | rectangle whose top band holds slanted clapper stripes | — (near: film, video) | missing | clapperboard | movies_and_tv_16 | video, movie, recording |
| r1c0 | r2.4 | piano | rectangle with piano keys (black keys hanging from the top) | — | missing | piano | — | music, MIDI, audio |
| r1c0 | r2.5 | credit-card | card with a stripe and a short line | credit-card | exists | credit-card | payment_16 | payment, billing |
| r1c0 | r2.6 | folder-dashed | folder drawn with a dashed outline | folder | variant: dashed | folder | folder_hint_20 | placeholder, untracked, virtual folder |
| r1c0 | r2.7 | folder | folder | folder | exists | folder | folder_16 | folder, directory |
| r1c0 | r3.1 | folder-check | folder, lower right replaced by a check | folder | variant: + check | folder-check | folder_16 | done, synced folder |
| r1c0 | r3.2 | folder-library | folder, lower right replaced by library marks (three strokes, the last slanted) | folder | variant: + library marks | folder | folder_list_16 | library, docs folder, collection |
| r1c0 | r3.3 | folder-open | open folder | folder-open | exists | folder-open | folder_open_16 | open folder |
| r1c0 | r3.4 | folders | two stacked folders | folder | variant: + stacked copy | folders | folder_multiple_16 | projects, workspaces |
| r1c0 | r3.5 | video | video camera | video | exists | video | video_16 | video, camera, call |
| r1c0 | r3.6 | wallet-cards | same glyph as r0c0 r4.3 | wallet | variant: + cards | wallet-cards | wallet_credit_card_16 | wallet, cards, payment |
| r1c0 | r3.7 | newspaper | page with text lines and a rolled right edge | newspaper | exists | newspaper | news_16 | news, articles, changelog |
| r1c0 | r4.1 | toy-brick | brick with two studs on top | — (near: puzzle) | missing | toy-brick | — | components, blocks, plugins |
| r1c0 | r4.2 | windows | landscape rectangle with a second one stacked behind at upper right | rectangle | variant: + stacked copy (as in copy) | copy | window_multiple_16 | new window, duplicate, windows |
| r1c0 | r4.3 | laptop | laptop | laptop | exists | laptop | laptop_16 | device, computer |
| r1c0 | r4.4 | vr-goggles | goggles/headset with a nose cut-out | — | missing | rectangle-goggles | headset_vr_20 | VR/AR, spatial |
| r1c0 | r4.5 | folding-panels? | two upright panels joined by a slanted panel (3D fold) | — | missing | — | — | 3D/perspective? |
| r1c0 | r4.6 | cylinder-open? | cylinder with an opening cut into its front | — | missing | cylinder | — | 3D shape?, 360 view? |
| r1c0 | r4.7 | volume | speaker with two waves | volume | exists | volume-2 | speaker_2_16 | sound, volume |
| r1c0 | r5.1 | play | outline play triangle | play | exists | play | play_16 | play, run |
| r1c0 | r5.2 | play-forward? | play triangle followed by two chevrons | play | variant: + trailing chevrons | play | — | run all, autoplay, continue |
| r1c0 | r5.3 | fast-forward | two triangles | fast-forward | exists | fast-forward | fast_forward_16 | skip ahead, faster |
| r1c0 | r5.4 | chevrons-block-right | two nested chevrons drawn as one outlined block | chevron-right | variant: doubled, outlined block | chevrons-right | chevron_double_right_16 | next step, skip, pipeline |
| r1c0 | r5.5 | arrow-big-right | outlined block arrow pointing right | arrow-right | variant: block (outlined) style | arrow-big-right | arrow_right_16 | next, forward |
| r1c0 | r5.6 | arrow-big-right-dash | block arrow right with a bar behind it | arrow-right | variant: block style + tail bar | arrow-big-right-dash | keyboard_tab_20 | tab key, move to end |
| r1c0 | r5.7 | gallery-end | two short upright lines left of a tall rounded card | — (near: images) | missing | gallery-horizontal-end | slide_multiple_16 | carousel, versions, stack |
| r1c0 | r6.1 | case-upper | text "AB" | — (near: text-size) | missing | case-upper | text_case_uppercase_16 | uppercase, text transform |
| r1c0 | r6.2 | case-sensitive | text "Aa" | — (near: text-size) | missing | case-sensitive | text_case_title_16 | match case, font |
| r1c0 | r6.3 | markdown | "M↓" mark | — | missing | — | markdown_16 | markdown, formatting |
| r1c0 | r6.4 | infinity | ∞ | — | missing | infinity | — | Agent mode, unlimited, loop |
| r1c0 | r6.5 | key | horizontal key, round bow at the right | key | exists | key-round | key_16 | key, API key, password |
| r1c0 | r6.6 | banknote | landscape note with an oval between two bars | banknote | exists | banknote | money_16 | cash, money |
| r1c0 | r6.7 | price-tier | "$$$" | — | missing | dollar-sign | currency_dollar_euro_16 | pricing, cost, billing |
| r1c0 | r7.1 | eye | eye with a ring pupil | eye | exists | eye | eye_16 | show, view |
| r1c0 | r7.2 | eye-closed | closed eye with three lashes (Area's eye-off is drawn this way) | eye-off | exists | eye-closed | eye_off_16 | hide |
| r1c0 | r7.3 | bow-tie | bow tie: two flared ends and a square knot | — | missing | — | — | formal, event? |
| r1c0 | r7.4 | dumbbell | two tall plates joined by a bar | — | missing | dumbbell | dumbbell_16 | fitness, workout |
| r1c0 | r7.5 | device-unit? | pill with two short upright bars at left and a dot at right | — (near: hard-drive) | missing | hard-drive | storage_16 | drive, device, machine? |
| r1c0 | r7.6 | storage | pill with two dots at right (Fluent's storage glyph) | hard-drive | exists | hard-drive | storage_16 | storage, disk |
| r1c0 | r7.7 | code | < > chevrons | code | exists | code | code_16 | code |
| r1c1 | r1.1 | calculator | tall rectangle: blank display over a key grid | calculator | exists | calculator | calculator_16 | calculate |
| r1c1 | r1.2 | speaker | tall rectangle with a small dot over a larger ring | speaker | exists | speaker | speaker_box_16 | audio device |
| r1c1 | r1.3 | tablet | portrait device with a home bar | tablet | exists | tablet | tablet_16 | device, mobile |
| r1c1 | r1.4 | file | page with folded top-left corner | document | exists | file | document_16 | file, document |
| r1c1 | r1.5 | file-lock | page, lower right replaced by a padlock | document | variant: + lock | file-lock | document_lock_16 | protected file, secrets |
| r1c1 | r1.6 | file-pdf | page top with "PDF" lettering below | document | variant: + PDF label | file-text | document_pdf_16 | PDF, export, attachment |
| r1c1 | r1.7 | book | closed book with a page edge along the bottom (Area's book is open) | book | exists | book | book_16 | docs, reading |
| r1c1 | r2.1 | shield | shield | shield | exists | shield | shield_16 | security, privacy |
| r1c1 | r2.2 | face-mask? | flat-topped U-shaped badge/mask with a smiley | — (near: smile) | missing | drama | emoji_16 | persona?, mood?, theatre |
| r1c1 | r2.3 | trash | trash can with bars | trash | exists | trash | delete_16 | delete |
| r1c1 | r2.4 | building | office building with windows and a door | building | exists | building | building_16 | company, organization |
| r1c1 | r2.5 | clipboard-text | clipboard with three text lines | clipboard | variant: + text lines | clipboard-list | clipboard_text_ltr_16 | notes, plan, paste text |
| r1c1 | r2.6 | chef-hat | chef's toque | — | missing | chef-hat | — | cooking, recipes |
| r1c1 | r2.7 | owl | owl: round head, heart-shaped face, beak, wing curve | — (near: paw) | missing | bird | — | mascot?, night?, wisdom |
| r1c1 | r3.1 | cabinet? | box on two legs under a wider top, with a slot or handle near the top (nightstand/beehive/mailbox?) | — | missing | — | desk_16 | furniture?, storage? |
| r1c1 | r3.2 | r-mark? | outline R-like shape (bowl and diagonal leg) with an inner arc from bottom left to the top | — | missing | — | — | brand/logo mark? |
| r1c1 | r3.3 | bookmark | bookmark | bookmark | exists | bookmark | bookmark_16 | save, bookmark |
| r1c1 | r3.4 | droplet | water drop | color | exists | droplet | drop_16 | color, fill, opacity |
| r1c1 | r3.5 | flag | flag with a swallowtail on a pole | flag | exists | flag | flag_16 | flag, report, milestone |
| r1c1 | r3.6 | chess-rook | chess rook (castle piece) | — | missing | chess-rook | chess_16 | strategy, games |
| r1c1 | r3.7 | dome-flag? | dome with a door slit at the bottom and a pennant on top (igloo/tent) | — | missing | dome | tent_16 | camp/base?, landmark |
| r1c1 | r4.1 | plug | two-prong plug | plug | exists | plug | plug_connected_16 | plug, integrations, power |
| r1c1 | r4.2 | watch | round watch face with straps (Area's face is square) | watch | exists | watch | smartwatch_20 | watch, wearable |
| r1c1 | r4.3 | smartwatch | square-faced watch with straps (same concept as r4.2) | watch | exists | watch | smartwatch_20 | smartwatch |
| r1c1 | r4.4 | bell | bell | bell | exists | bell | alert_16 | notifications |
| r1c1 | r4.5 | bell-dot | bell broken at upper right by a filled dot | bell | variant: + dot badge | bell-dot | alert_badge_16 | unread notifications |
| r1c1 | r4.6 | bell-off | bell with slash | bell-off | exists | bell-off | alert_off_16 | mute notifications |
| r1c1 | r4.7 | lightbulb | light bulb | lightbulb | exists | lightbulb | lightbulb_16 | tip, idea |
| r1c1 | r5.1 | chevrons-block-up | two nested up-chevrons drawn as one outlined rank badge | chevron-up | variant: doubled, outlined block | chevrons-up | chevron_double_up_16 | upgrade, level up, priority |
| r1c1 | r5.2 | arrow-big-up | outlined block arrow up | shift | exists | arrow-big-up | keyboard_shift_16 | shift key, upgrade |
| r1c1 | r5.3 | arrow-big-up-dash | block arrow up over a bar (caps lock) | shift | variant: + base bar | arrow-big-up-dash | keyboard_shift_uppercase_16 | caps lock, boost |
| r1c1 | r5.4 | flame | flame with an inner flame | flame | exists | flame | fire_16 | trending, hot |
| r1c1 | r5.5 | zap | lightning bolt | flash | exists | zap | flash_16 | fast, power, motion |
| r1c1 | r5.6 | paperclip | vertical paperclip | attach | exists | paperclip | attach_16 | attach |
| r1c1 | r5.7 | mic | microphone | mic | exists | mic | mic_16 | dictate, voice |
| r1c1 | r6.1 | broadcast-device? | two arcs above a small upright capsule | — (near: wifi) | missing | radio-tower | live_16 | broadcast, remote, live? |
| r1c1 | r6.2 | split | Y with arrowheads on both upper ends | — (near: git-branch) | missing | split | arrow_split_16 | split, fork, branch |
| r1c1 | r6.3 | git-pull-request-check | PR: node and line at left, hooked line ending in a check at right | git-pull-request | variant: + check | git-pull-request | branch_request_16 | PR approved, ready to merge |
| r1c1 | r6.4 | git-pull-request-draft | PR with a dashed right line ending in a node | git-pull-request | variant: dashed (draft) | git-pull-request-draft | branch_request_16 | draft PR |
| r1c1 | r6.5 | git-pull-request | PR: two nodes and a hooked line | git-pull-request | exists | git-pull-request | branch_request_16 | pull request |
| r1c1 | r6.6 | git-pull-request-closed | PR with a × above the right node | git-pull-request | variant: + × | git-pull-request-closed | branch_request_16 | closed PR |
| r1c1 | r6.7 | binary | digits "01" over "10" | — | missing | binary | — | binary, data, encoding |
| r1c1 | r7.1 | letter-b | letter B at regular weight (Area's bold B is solid) | bold | exists | bold | text_bold_16 | bold |
| r1c1 | r7.2 | letter-t | letter T | text | exists | type | text_t_16 | text |
| r1c1 | r7.3 | letter-s? | letter S, no strike line | — (near: strikethrough) | missing | — | — | unknown (style/size?) |
| r1c1 | r7.4 | text-cursor | I-beam with curled serifs | text-cursor | exists | text-cursor | — | text cursor, insert |
| r1c1 | r7.5 | plus-minus | ± | — (near: add, minus) | missing | diff | add_subtract_circle_16 | diff, changes, tolerance |
| r1c1 | r7.6 | chevrons-down-up | down chevron above an up chevron, pointing inward | chevrons-up-down | variant: turned inward | chevrons-down-up | chevron_down_up_16 | collapse all, fold |
| r1c1 | r7.7 | parallel-lines? | two tall thin upright lines (pause or divider) | pause | exists | pause | pause_16 | pause?, divider? |

## Missing concepts (deduplicated)

Generic concepts:
- vault (safe dial) — r0c0 r3.4
- layout-dashboard (masonry panes) — r0c0 r7.1
- brackets `[ ]` — r0c0 r7.3
- basketball — r0c1 r2.5
- volleyball — r0c1 r2.7
- film-reel — r0c1 r4.1
- target-arrow (goal) — r0c1 r4.2
- radar? — r0c1 r4.3
- badge (scalloped seal) — r0c1 r4.4
- brain, and brain-off — r0c1 r4.5, r4.6
- hexagon — r0c1 r5.2
- hex-nut? (hexagon in hexagon) — r0c1 r5.7
- asterisk — r0c1 r6.7
- cookie — r0c1 r7.6
- app-window (window with three dots) — r1c0 r1.2
- clapperboard — r1c0 r2.3
- piano — r1c0 r2.4
- toy-brick — r1c0 r4.1
- vr-goggles — r1c0 r4.4
- gallery-end (carousel / stack of cards) — r1c0 r5.7
- case-upper "AB" — r1c0 r6.1
- case-sensitive "Aa" — r1c0 r6.2
- markdown "M↓" — r1c0 r6.3
- infinity — r1c0 r6.4
- price-tier "$$$" (dollar sign) — r1c0 r6.7
- bow-tie — r1c0 r7.3
- dumbbell — r1c0 r7.4
- chef-hat — r1c1 r2.6
- owl — r1c1 r2.7
- chess-rook — r1c1 r3.6
- split (Y arrows) — r1c1 r6.2
- binary "01/10" — r1c1 r6.7
- plus-minus "±" — r1c1 r7.5

Uncertain shapes (meaning not confirmed; check before drawing):
- square-double-cross? (‡ hanging in a square) — r0c0 r3.7
- notched-square? (round notch in the top edge) — r0c0 r5.3
- folding-panels? (3D fold) — r1c0 r4.5
- cylinder-open? — r1c0 r4.6
- device-unit? (pill with two bars and a dot) — r1c0 r7.5
- face-mask? (smiley in a U-shaped badge) — r1c1 r2.2
- cabinet? (box on legs: nightstand/beehive/mailbox) — r1c1 r3.1
- dome-flag? (igloo/tent with pennant) — r1c1 r3.7
- broadcast-device? (arcs over a capsule) — r1c1 r6.1
- letter-s? — r1c1 r7.3

Possible brand/file-type logos (probably out of scope for a generic set):
- npm-logo? — r0c0 r5.1
- kotlin-logo? — r0c0 r5.2
- rust-logo? / registered ® — r0c1 r3.1
- hexagon-spokes? and hexagon-y? (logo-like hexagon marks) — r0c1 r5.4, r5.6
- r-mark? — r1c1 r3.2
- (Cursor's own logo, r0c1 r5.5, is counted as a pointer variant below)

## Variants (deduplicated, base + modifier)

- stop (square) + dot badge — r0c0 r1.2
- stop + slash — r0c0 r2.5
- stop + centre dot — r0c0 r2.7
- pointer + square frame — r0c0 r1.3 (Cursor's up-right arrow), r0c0 r6.7 (arrow over the frame's corner)
- pointer + ring — r0c1 r1.3
- pointer + hexagon frame (Cursor logo) — r0c1 r5.5
- arrow-down / arrow-left / arrow-up / arrow-right + square frame — r0c0 r1.4–r1.7
- arrow-down-left / arrow-up-left / arrow-up-right / arrow-down-right + square frame — r0c0 r2.1–r2.4
- arrow-down + ring — r0c1 r1.4
- minus + square frame — r0c0 r3.1
- add + square frame — r0c0 r3.2
- smile + square frame — r0c0 r3.5
- smile + plus — r0c1 r3.7
- text + square frame — r0c0 r3.6
- list + square frame — r0c0 r4.7
- search + square frame — r0c0 r6.5
- banknote + stack — r0c0 r4.2
- wallet + cards — r0c0 r4.3, r1c0 r3.6
- grid + plus — r0c0 r6.2
- grid + sparkle — r0c0 r6.3
- repeat → single-arrow loop — r0c0 r6.6
- corners + check — r0c0 r7.5
- corners + sparkle — r0c0 r7.6
- pause + ring — r0c1 r2.1
- play + ring — r0c1 r2.2
- play + trailing chevrons — r1c0 r5.2
- compass + check — r0c1 r3.3
- compass + dot badge — r0c1 r3.4
- token + dot badge — r0c1 r3.5
- history, mirrored to clockwise — r0c1 r6.4
- ellipse + dashed stroke — r0c1 r7.3
- ellipse + dashed stroke + centre dot — r0c1 r7.4
- status-available + half-dashed ring — r0c1 r7.5
- columns + dashed pane — r1c0 r1.6
- folder + dashed stroke — r1c0 r2.6
- folder + check — r1c0 r3.1
- folder + library marks — r1c0 r3.2
- folder + stacked copy — r1c0 r3.4
- rectangle + stacked copy (windows) — r1c0 r4.2
- chevron-right doubled as an outlined block — r1c0 r5.4
- chevron-up doubled as an outlined block — r1c1 r5.1
- arrow-right in block style — r1c0 r5.5
- arrow-right in block style + tail bar — r1c0 r5.6
- shift + base bar (caps lock) — r1c1 r5.3
- document + lock — r1c1 r1.5
- document + PDF label — r1c1 r1.6
- clipboard + text lines — r1c1 r2.5
- bell + dot badge — r1c1 r4.5
- git-pull-request + check — r1c1 r6.3
- git-pull-request + dashed line (draft) — r1c1 r6.4
- git-pull-request + × (closed) — r1c1 r6.6
- chevrons-up-down turned inward — r1c1 r7.6
