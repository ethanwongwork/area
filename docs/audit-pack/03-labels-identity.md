# 03 Labels and identity

> **v2 note.** This file is the capability checklist (variants, anatomy, behaviour, demos). It is not a source for sizes, padding, radius or shape: those come only from `construction/03-labels-identity.md`. Any px value still written below is illustrative and loses to the construction file.


Badge, Counter badge, Status dot, Tag, Kbd, Avatar, Avatar group, Persona / Entity.

Boundary reminder from the atlas: **Badge** = count or status attached to something.
**Tag** = static classification of an object. **Chip** = interactive value (file 01).
**Token** = technical reference (complete). They can share a paint layer
(`--area-label-*` tokens) but keep separate components, props, and docs pages.

---

## Badge

**Job:** a short, non-interactive status or metadata label attached to a nearby object:
"Beta", "Draft", "Failed", "New", "Pro".
**Aliases:** Badge (OAI, SHA, FLU, GEI, MUI), Label and StateLabel (PRI), Lozenge (ATL),
read-only Tag (CAR), Pill (GEI, link form).

### Anatomy

```
 ┌──────────────────────────┐        anchored form (wrapper)
 │ [dot|icon]  Label  [icon]│        ┌────────┐(3)   <- badge centred on the anchor's corner,
 └──────────────────────────┘        │  icon  │         with a 2px ring in the page surface colour
 parts: root, dot?, leading-icon?, label, trailing-icon?        └────────┘
 anchored: anchor-root (inline-flex, position: relative), badge (absolute)
```

### Build list

| Axis | Value | Looks like / aligns | Sources |
| --- | --- | --- | --- |
| variant | `soft` (default) | Tone-tinted fill, tone text, no stroke | OAI(default soft) FLU(tint) GEI(*-subtle) SHA(secondary) |
| variant | `solid` | Tone fill, on-tone text | OAI FLU(filled) SHA(default, destructive) GEI ATL(bold) |
| variant | `outline` | 1px tone stroke, tone text, transparent fill | OAI FLU SHA PRI(Label is outline-only) |
| variant | `ghost` | Text and icon only, no box, keeps the height and padding metrics | FLU SHA |
| variant | `plain` / link | Underline-on-hover text badge for anchors | SHA(link) |
| variant | `dot` | Leading 6-8px tone dot + neutral text, neutral soft or outline box. For long status lists where full colour is too loud | NOT GEI(Status dot + label) |
| tone | neutral, accent, info, success, warning, danger, discovery + `inverted` (ink on paper reversed) | | OAI(secondary, success, danger, warning, info, discovery) FLU(brand, danger, important, informative, severe, subtle, success, warning) GEI(inverted) PRI(10) |
| tone | brand specials: gradient or branded fills for plan names ("Pro", "Trial", "Turbo"). Implement as a `--custom` tone modifier with `--area-badge-bg/fg` | | GEI(trial, turbo) PRI(sponsors) |
| size | sm / md / lg; plus `xs` dot-only and `xl` | see geometry | OAI(20, 22, 24) FLU(6, 10, 16, 20, 24, 32) PRI(20, 24) GEI(3) |
| shape | pill, always (identity shape; decided from the construction evidence: 6 of 10 systems are pill, the rest use a small fixed radius, none use the control radius). `rounded`, `circular`, `pill` from other systems are aliases; `square` is rejected | see construction | PRI SHA FLU M3 CAR MUI |
| content | text; icon + text; text + icon; icon-only (square or circle, needs `aria-label`); number | icon = font-size of the label, gap 4; icon-side inline padding 1-2px less | FLU(iconPosition) SHA GEI OAI |
| content | state label: fixed icon + text pairs for object lifecycle (Open, Merged, Closed, Draft, Queued), larger pill, solid | | PRI(StateLabel) |
| content | max-width + ellipsis (about 200px) with full text in `title` / tooltip | | ATL |
| typography | sm uses wide tracking and semibold; optional `uppercase` flag (off by default) | | OAI ATL(legacy caps) |
| element | `span` (default); `a` with hover paint (`[a&]:hover` in SHA); never a button (that is Chip) | | SHA GEI(Pill) |
| anchored | wrapper positions a badge on a child: `placement` top-end (default), top-start, bottom-end, bottom-start; `overlap=rectangular|circular` (circular pulls it 14% inward so it sits on an avatar's edge); `offset`; surface-coloured 2px ring; `invisible` toggles with scale transition | | MUI(anchorOrigin, overlap, invisible) M3 HIG SHA(AvatarBadge) |
| group | BadgeGroup: wrap, gap 4; `overflow=inline|overlay` collapse to "+3" with popover; `visibleCount=auto|n` | | PRI(LabelGroup) |
| state | none interactive. Link form: hover, focus-visible | | |

### Geometry

Superseded. The numbers that used to be here were partly recalled. Use the measured table, consensus and Area decision in `construction/03-labels-identity.md`; if the component is marked seed or missing there, run the construction step in `00-START-HERE.md` first.

### Markup

```html
<span class="area-badge area-badge--soft area-badge--success area-badge--md">
  <svg class="area-badge__icon" aria-hidden="true">…</svg>Deployed
</span>

<span class="area-badge-anchor area-badge-anchor--top-end area-badge-anchor--overlap-circular">
  <button class="area-button area-button--icon-only" aria-label="Notifications, 3 unread">…</button>
  <span class="area-badge area-badge--counter area-badge--danger" aria-hidden="true">3</span>
</span>
```

The anchored badge is `aria-hidden`; its meaning goes into the anchor's accessible name.
Status meaning must never be colour-only: text, icon, or visually hidden text.

### Demo list

1 default. 2 variants row. 3 variant x tone matrix, one tile per cell. 4 sizes (one tile each). 5 radius-axis check (Badge stays pill under every preset). 6 icons
leading / trailing / only. 7 dot variant statuses. 8 state labels. 9 truncation. 10 link
badge. 11 anchored on icon button, avatar (circular overlap), and tab. 12 group with +N.
13 custom / brand tone. 14 in-context: table status column, nav item "New", card header
"Beta" next to a title (baseline-aligned, not centre-aligned). 15 both themes side by side.

### Pitfalls

Centre-aligning a badge next to a heading instead of baseline-aligning with an optical
nudge. Soft fills that vanish in dark theme. Anchored badge without the surface ring so it
merges with the avatar. Line-height not set, so height drifts by font.

---

## Counter badge

**Job:** a number attached to a tab, nav item, button, or icon.
**Aliases:** CounterLabel (PRI), CounterBadge (FLU), Badge (ATL, M3, MUI), count in
UnderlineNav / SegmentedControl / ActionList trailing (PRI).

| Axis | Value | Sources |
| --- | --- | --- |
| variant | `soft` neutral (default, for inline counts), `solid` (attention: accent or danger), `ghost` (plain muted number) | PRI(primary, secondary) FLU(filled, ghost) ATL |
| tone | neutral, accent, info, danger (+ `added` / `removed` for diffs: "+12" success, "-4" danger) | FLU ATL(added, removed) |
| shape | pill (default; a single digit renders as a circle because min-width = height), rounded | FLU |
| size | xs 14-16, sm 18, md 20 | FLU |
| function | `max` / `overflowCount` (99 then "99+"), `showZero` (default hidden at 0), `dot` mode (no number), compact notation ("1.2k") via `Intl.NumberFormat` | FLU MUI ATL OAI(avatar overflow uses compact notation) |
| loading | skeleton pill of fixed width | PRI(loadingCounters) |
| layout | inline after a label (gap 6, baseline-aligned); anchored (see Badge) | PRI M3 |

Tabular numerals, `min-inline-size = block-size`, inline padding = height x 0.3, text centred.
A11y: inline counts get visually hidden context ("12 open issues"); updates are not
live-announced unless the consumer opts in.

---

## Status dot

**Job:** the smallest status signal: presence, build state, connection.
**Aliases:** Status Dot (GEI), PresenceBadge (FLU), presence / status indicators (ATL), dot Badge (MUI, M3).

| Axis | Value | Sources |
| --- | --- | --- |
| tone | neutral, info, success, warning, danger, accent; named presets: build states `queued / building / ready / error / canceled`; presence `available / away / busy / do-not-disturb / offline / out-of-office / blocked / unknown` | GEI FLU ATL |
| glyph | plain filled dot; hollow ring (offline / out-of-office); dot with inner glyph at 10px and up (check, minus, x, clock, arrow) so states survive without colour | FLU ATL |
| size | 6, 8, 10, 12, 16 | FLU(tiny through extra-large) |
| label | none (needs `aria-label`); label at inline-end, gap 6-8, text inherits | GEI |
| motion | `pulse` for live / in-progress (expanding ring at 0 to 60% opacity, 1.5-2s), reduced-motion: static | product pattern |
| anchored | on Avatar bottom-end with surface ring (see Avatar) | FLU SHA ATL |

---

## Tag

**Job:** static or link classification of an object: labels, topics, categories, property values.
**Aliases:** Label and IssueLabelToken and TopicTag (PRI), Tag (ATL, CAR, FLU static), Lozenge (ATL),
select-property pill (NOT), Badge colours (GEI).

Shares Badge's anatomy and sizes. What differs is the **categorical palette** and grouping.

| Axis | Value | Sources |
| --- | --- | --- |
| palette | categorical, not semantic: gray, brown, orange, yellow, green, teal, blue, purple, pink, red (10). Each needs soft bg + text, solid, and outline sets in both themes. Add CAR's extra cool-gray / warm-gray / cyan / magenta only if the token ramp has them | NOT(10) CAR(10+) PRI(10) GEI ATL |
| palette | custom `fillColor` (any hex): compute text colour by contrast, and in dark theme render as tinted-outline rather than solid (GitHub's approach) | PRI(IssueLabelToken) |
| variant | soft (default), solid, outline, dot | NOT(soft) PRI(outline) CAR ATL(subtle, bold) |
| shape | rounded (NOT style, radius 3-4), pill (PRI, CAR) | |
| size | xs 16-18, sm 20, md 24, lg 32 | CAR(18, 24, 32) PRI |
| content | text; leading icon / emoji / avatar (`elemBefore`); truncation | ATL CAR |
| element | `span`; `a` (topic link, hover darkens one step) | PRI(TopicTag) ATL |
| group | wrap gap 4-6; single-line clamp with "+N" overflow popover; align start / end; inside table cells use xs / sm and never wrap the row height | PRI(LabelGroup) ATL(TagGroup) NOT |
| skeleton | pill placeholder | CAR |

Removable, selectable, or clickable-with-state belongs to Chip. If a Tag needs an `x`, the
consumer should be using Chip with the same palette (expose the palette tokens to both).

Demos: palette x variant matrix both themes; custom hex row incl. very light and very dark
colours; sizes; shapes; with emoji / icon / avatar; link tags; group wrap and +N; in a table
cell; in a card footer.

---

## Kbd

**Job:** show a key or shortcut. **Aliases:** KeybindingHint (PRI), Kbd + KbdGroup (SHA),
Keyboard Input (GEI).

### Anatomy and forms

```
 keycaps, condensed        keycaps, full                      plain (menus, tooltips)      sequence
 [⌘] [⇧] [K]               [Command] + [Shift] + [K]          ⌘⇧K                           [G] then [I]
 parts: root (kbd), key (nested kbd), separator ("+" or none), sequence-joiner ("then")
```

| Axis | Value | Looks like / aligns | Sources |
| --- | --- | --- | --- |
| variant | `keycap` (default): muted fill or 1px stroke, optional 1px heavier bottom edge for depth; `plain`: no box, muted text, for Menu shortcut column and Tooltip; `onEmphasis` / inverted: for use on solid buttons, dark tooltips | each key min-width = height so single glyphs are square; inline padding 4 | PRI(normal, onEmphasis) SHA GEI NOT FIG |
| format | `condensed` (symbols, no plus) and `full` (words joined with " + ") | | PRI |
| size | sm 16-18, md 20, lg 24 | SHA 20 high, min-w 20, px 4, text xs medium, radius sm, **sans** font not mono | SHA PRI(small, normal) GEI(small) |
| input API | `keys="Mod+Shift+K"` string parsed into keys; `Mod` resolves to ⌘ on Apple platforms and Ctrl elsewhere; explicit boolean modifier props as the alternative (`meta shift alt ctrl`) | | PRI GEI |
| sequence | chords separated by a space in the string ("G I") render with "then" between groups | | PRI |
| symbols | ⌘ ⌃ ⌥ ⇧ ↵ ⌫ ⌦ ⎋ ⇥ ␣ ↑ ↓ ← → with full-word `aria-label` / visually hidden text ("Command") so AT does not read glyph names | | PRI HIG |
| group | KbdGroup: inline-flex gap 2-4 | | SHA |
| composition | inside Tooltip (inverted or plain, after the text, gap 8), Button (trailing, onEmphasis on solid), Input end-slot ("/" or "⌘K" hint that hides on focus), Menu shortcut column, Command menu footer | | SHA GEI |

Use `font-variant-numeric: tabular-nums`, `font-feature-settings` for case-sensitive forms
if the typeface has them, and set `line-height` = height. Do not use monospace unless
Area's code font has the symbol glyphs; mixed fallback fonts make ⌘ and K different sizes.

Demos: single key; combo condensed / full; sequence; variants; sizes; platform switch
(Mod); in tooltip; in button; in input; in menu; symbol glossary grid.

---

## Avatar

**Job:** represent a person, team, workspace, bot, or object with an image, initials, or icon.

### Anatomy

```
        ┌───────┐              ring (active / multiplayer colour), offset 2
        │  img  │
        │  MO   │  <- initials fallback (1-2 chars), then icon fallback
        └─────(●)  <- badge slot bottom-end: presence dot, status icon, provider logo, counter
 parts: root, image, fallback-initials, fallback-icon, ring?, badge?
```

### Build list

| Axis | Value | Looks like / aligns | Sources |
| --- | --- | --- | --- |
| content | image; initials from `name` (first + last initial, locale-safe, 1 char under 20px); icon (person default; custom: bot, team, building); `overflowCount` "+5" | fallback chain image -> initials -> icon, with load-state handling so there is no flash | OAI FLU SHA GEI(placeholder, custom icon) |
| shape | circle (people), rounded-square (workspaces, orgs, bots, apps), square, hexagon (agents / teams) | square radius scales with size: about 20-25% | PRI(square) FLU MUI(circular, rounded, square) ATL(hexagon) NOT |
| size | needs its own ramp, not the control ramp: 16, 20, 24, 28, 32, 40, 48, 64, 96, 128; also free numeric size via `--area-avatar-size` with initials font = size x 0.4-0.5 | | FLU(14 sizes) ATL(6) OAI(number, font scaling 0.5) PRI(number, responsive) SHA(24, 32, 40) |
| colour | neutral soft (default); `colorful`: deterministic hash of name / id onto the categorical palette; explicit tone; variant soft / solid | | FLU(neutral, brand, colorful + named) OAI(color x variant) |
| border | none; 1px inner hairline (`box-shadow: inset 0 0 0 1px` at about 8% ink) so light photos do not bleed into the page | | PRI SHA |
| badge slot | presence dot; status icon (approved / declined / locked); provider logo (GitHub / GitLab / Bitbucket); counter. Size = avatar x 0.3 clamped 6-16, 2px surface ring, circular overlap | | FLU(badge) SHA(AvatarBadge) ATL(presence, status) GEI(git) |
| active | `active` = accent ring offset 2 and / or shadow (speaking / selected); `inactive` = 80% scale + reduced opacity; custom ring colour for multiplayer cursors | | FLU(active, activeAppearance ring, shadow, ring-shadow) FIG |
| interactive | static `span` / `img`; `button` or `a` with hover overlay and focus ring that follows the shape; tooltip with name | | OAI(onClick) ATL |
| loading | skeleton of the same shape and size | | PRI(SkeletonAvatar) ATL |
| responsive | size per breakpoint | | PRI |

### Markup

```html
<span class="area-avatar area-avatar--md area-avatar--circle area-avatar--colorful" style="--_hue: 7">
  <img class="area-avatar__image" src="…" alt="" />
  <span class="area-avatar__fallback" aria-hidden="true">MO</span>
  <span class="area-avatar__badge"><span class="area-status-dot area-status-dot--success"></span></span>
</span>
```

`alt=""` when the name is printed next to it; otherwise `alt="Mira Okafor"` or
`role="img" aria-label` on the root for initials / icon forms. Presence goes into the label:
"Mira Okafor, available".

## Avatar group

| Axis | Value | Looks like / aligns | Sources |
| --- | --- | --- | --- |
| layout | `stack` (overlap about 25-30% of size: -8 at 28-32), `spread` (gap 4-8), `grid` (wrapping), `pie` (2-3 faces clipped into one circle, for group chats) | | OAI(spacing -8) SHA(-space-x-2) FLU(spread, stack, pie) ATL(stack, grid) |
| layout | `cascade`: tight collapsed stack showing about 3 slivers that expands to full stack on hover / focus-within | | PRI(cascade) |
| separation | surface-colour ring 2px (simple) or a true **cutout** mask so it works on any background (OAI: 3px cutout) | | SHA(ring) OAI(cutout) |
| direction | which avatar is on top: `stack=start` (first on top) or `end`; `alignRight` to grow leftward | | OAI PRI |
| overflow | `max` + "+N" avatar (same shape and size, neutral soft, compact number with font scaling by digit count 0.45 / 0.37 / 0.3 of size); +N opens a popover or menu listing the rest; indicator `count` or `icon` | | OAI FLU(AvatarGroupPopover) MUI(max, total, renderSurplus) ATL SHA(AvatarGroupCount) GEI(limit) |
| size / shape | set on the group, inherited | | all |
| interactive | each avatar tooltips its name; stack brings the hovered avatar forward (`z-index`) and nudges neighbours 2px | | ATL FIG |

Cutout CSS (works on any background):

```css
/* first avatar on top; each following avatar gets a circular bite where its neighbour overlaps */
.area-avatar-group--stack { --_overlap: calc(var(--_size) * 0.28); --_cut: 2px; }
.area-avatar-group--stack > * + * {
  margin-inline-start: calc(-1 * var(--_overlap));
  /* neighbour's centre, measured from this avatar's left edge = overlap - size/2 */
  mask: radial-gradient(
    circle calc(var(--_size) / 2 + var(--_cut)) at calc(var(--_overlap) - var(--_size) / 2) 50%,
    transparent calc(100% - 0.5px), #000 100%);
}
:dir(rtl) .area-avatar-group--stack > * + * {
  mask: radial-gradient(
    circle calc(var(--_size) / 2 + var(--_cut)) at calc(100% - (var(--_overlap) - var(--_size) / 2)) 50%,
    transparent calc(100% - 0.5px), #000 100%);
}
/* simpler fallback on a known surface: box-shadow: 0 0 0 2px var(--area-surface); */
```

Rounded-square avatars need a rounded-rect bite (SVG mask) or the ring fallback. Badges on
stacked avatars sit outside the mask: put the mask on the image / fallback layer, not the root.

Demos (Avatar + group): image / initials / icon; shapes; size ramp; colourful hash row of 12
names; hairline border on a white photo; badge slot kinds; active / inactive; interactive
with tooltip; skeleton; group stack / spread / grid / pie / cascade; overflow +N with
popover; group sizes; on a tinted surface to prove the cutout; in-context: card header,
table cell with name, comment thread, multiplayer bar.

Pitfalls: initials font fixed in px. Badge ring colour hard-coded white. +N a different
size from its siblings. Stack order reversed in RTL unintentionally. Missing hairline.

---

## Persona / Entity

**Job:** identity row: avatar plus one to four lines of text, optional trailing actions.
**Aliases:** Persona (FLU), Entity (GEI), AvatarItem (ATL), Item with media (SHA), User cell.

```
 text-position=after                         text-position=below (centred)
 ┌──┐ Mira Okafor            [Follow] […]          ┌────┐
 │av│ Design engineer · Area                       │ av │
 └──┘ Active 2h ago                                └────┘
                                                 Mira Okafor
                                                  Designer
```

| Axis | Value | Sources |
| --- | --- | --- |
| size | xs to huge: sets avatar size **and** how many text lines are allowed (xs / sm: 1 line; md: 2; lg: 3; xl: 4) | FLU(6 sizes, numTextLines) |
| text position | after (default), before, below; alignment start / center (centre the avatar against one line, align to top for multi-line) | FLU |
| lines | primary (strong), secondary, tertiary, quaternary (muted steps); separators "·" inline | FLU |
| media | Avatar, avatar with presence, presence only (`presenceOnly`), thumbnail / icon tile (rounded square 32-40 with icon) | FLU GEI |
| trailing | actions (buttons, menu), meta fields in columns (GEI Entity aligns several labelled fields to a grid), checkbox leading | GEI |
| interactive | static; whole row link / button with hover fill; selectable | ATL SHA(Item asChild) |
| variant | plain; outline card; muted fill | SHA(Item default, outline, muted) |
| list | EntityList with dividers, equal column tracks across rows, skeleton rows | GEI |

Demos: sizes; text positions; 1-4 lines; presence only; thumbnail media; trailing actions;
clickable row; list with dividers and aligned fields; skeleton list; in a popover header
(hover card), in a menu item, in a table cell.
