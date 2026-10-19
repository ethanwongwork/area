# Edge and Depth: strokes and shadows as levers (2026-10-18)

Owner: "for elevation, i want to add an axis for elevation/shadow on rest, not just on hover … spread, blur, position,
exact color, opacity … see how just stroke, or just drop shadow, or a combination of stroke + drop shadow work together
… explore stroke width … how this relates to contrast … do research and audit".

- Review page (live levers on Area's components, presets, proposal): https://claude.ai/artifact/5CoJiyCuttgfg4UDGV4twS,
  source `lab.html` here (published with `packages/styles/dist/area.css` beside it).
- Every external value with its pinned source: `sources.md` (20 systems, read from source or live CSS on 2026-10-18).
- Earlier: `docs/research/elevation-2026-10-13.md`, `elevation-2026-10-14.md`, `surface-2026-10-14.md`,
  `card-hover-2026-10-18.md`.

## The owner's references, read from the pixels

Sampled across edges at 2× (device pixels), no source CSS (`images/6.png`–`8.png` of this session, not kept: they are
third-party screenshots).

| Reference | Stroke | Shadow | Inside |
|---|---|---|---|
| Bless, "Get Started" card | #e3–#ed sides, #e7 top, #d3 bottom | fade #ee → #f9 over about 5 CSS px below | white line inside the top; unchecked circles recessed, checked raised |
| Simple Poll, fields and segment | #e4 top, #c5 bottom (segment #b8) | fade #e3 → #fb over about 2 CSS px | dialog: #b9 stroke, soft spread outside, white line inside |
| AccessGrid, menu panel | #e0–#e8 sides, #f5 top | hard #a0 bottom, then #c3 → #e9 over 15+ CSS px, slightly cool | white card in a #f8f8fa tray with its own stroke |

Common recipe: a hairline near 10% black, light from the top (a lip or small y offset darkens the bottom edge), a
white highlight inside the top, small resting shadows on fields and cards, a long soft float.

## Findings (detail in `sources.md`)

1. Shadows are slot lists: inner highlight or shade, ring, lip, one to five soft layers (Radix, Geist, Primer,
   Tailwind). Primer keeps a 0% ring slot so themes switch it without changing the layer count.
2. Geometry, colour and alpha are separate (Tailwind `--tw-shadow-color` / `--tw-shadow-alpha`; Comeau and Stripe tint
   toward the background hue).
3. Generators share one model: a final layer (distance, blur, alpha) eased over N layers (smoothshadows
   `t = ((i+1)/n)²`; Brumm bezier), negative spread growing with distance, light angle setting x. M3 and Fluent are
   two-layer cases.
4. Resting shadows are small and common (shadcn `0 1 2 5%` on fields and outline buttons; Primer's `0 1 0 4%` button
   lip; Radix's five-layer resting stack on cards and the segmented thumb).
5. Hover grows the shadow (M3 one level, Fluent shadow4 → 8, Radix bigger offsets at the same alpha); no system moves
   the element.
6. Contrast never strengthens shadows: strokes darken or turn opaque (Primer, Polaris, M3 outline targets), or a 50%
   inset ring replaces the shadow (Atlassian). Forced colours remove shadows. No system thickens 1px to 2px for contrast.
7. Widths: hairlines (Apple 1 device px, Polaris 0.66, Radix 0.5 ring); scales stop at 1 / 2. Light strokes are
   translucent black (Apple 10%, Geist 8%) or opaque grey (shadcn, Polaris); dark strokes are translucent white 7–17%.

## Audit: Area today

- Elevation is one number: the alpha of a fixed two-layer Fluent shadow per role (control, resting, tooltip, float,
  modal; `axes/elevation.ts`). Surface is the frame width, 1 or 0 with a soft `0 0 1px` 62% edge (`axes/surface.ts`).
- At rest: Card, Panel, Composer, Board card, Infobox (resting); Segmented, Switch and Slider thumbs, soft Toggle group,
  Badge modern (control); floating Titlebar, Toolbar, Calendar, Color picker, Video player, Scroll to latest (float).
  Fields and buttons carry none. Menus, popovers, dialogs show theirs only while open.
- Contrast touches no shadow. At Surface 0 + Medium / More a surface draws its frame and the soft edge (double edge).
- Material overlaps: its Stroke lever (ring, lit edge, double rim) and contact and emboss shadows; `material.css`
  replaces the whole `box-shadow`, so Drawer and Command palette lose the modal lift, a selected Card loses its inset
  ring, a linked Card's hover drops the material layers, the Video player loses its 12% ring, and disabled parts lose
  `shadow-control`.
- Gaps: no lip (`0 1px 0`) anywhere; framed Infobox has no edge at Surface 0; `elevation.ts` still lists Board card
  actions as float; hard-coded rings in Video player, Color picker, Tooltip; the Composer focus halo reads the legacy
  `--area-shadow-color`.

## Proposal (not built; owner to pick on the review page)

Keep every option. Surface and Elevation become two lever groups, each a number with named ends; every role keeps one
fixed slot list `highlight, lip, soft layers × Layers` so steps and hover crossfade.

| Lever | Steps (today) | Moves |
|---|---|---|
| Stroke width | 0 · 0.5 Hairline · 1 · 2 (1) | decorative frames; required edges stay 1 |
| Stroke strength | 0–8 (4) | every stroke's offset from its ground (EDGE_OFFSET × n/4); Contrast moves on from it |
| Stroke ink | Opaque · Translucent (Opaque) | grey vs black/white at an alpha |
| Rest lift | 0–8 (3) | resting and control roles |
| Field lift (new) | 0–8 (0) | fields, select triggers, outline and soft buttons |
| Float lift | 0–8 (3) | float; modal ×2 (today's Elevation) |
| Distance | 0–8 (4) | every role's offset and blur |
| Layers | 1 · 2 · 4 · 6 (2) | layer count; 2 is today's Fluent pair |
| Tightness | 0–8 (0) | negative spread, `−n/16 × y` |
| Lip | 0–4 (0) | `0 1px 0` at 3 / 5 / 8 / 14% |
| Highlight | 0–4 (0) | `inset 0 1px 0` white 40–100% (dark 3–12%) |
| Light angle | 0° · 15° · 30° · 45° | x = y × tan; shared with Material's angle |
| Shadow tint | Black · Ink · Cool | colour only |
| Dark strength | ×2 · ×3 · ×4 (×2) | dark alpha |
| Hover lift | 0–8 (3) | the float shape at this strength on linked cards and tiles |

Contrast: strokes keep moving to the 3:1 stroke from wherever Stroke strength puts them; shadows unchanged; Hairline
becomes 1px at Medium / More; the soft edge switches off whenever the frame returns. Material: Edge and Depth own every
outer shadow and the frame; Material keeps fills and inner light; its contact lever and ring / lit-edge styles become
Lip, Highlight and Stroke (bundles set them, as they set the Layers); components list Material's layers beside the role
instead of replacing the `box-shadow`.

### Packaged controls (owner, 2026-10-18: "simplify and package some of these controls together so that there are still granular choices but its much easier and simpler to choose combinations that work")

Three steps, as Material's bundle and levers: a **Look** sets five **choices**; each choice packages levers that work
together, so any combination of the five holds up; **Fine-tune** (folded) keeps every lever, names the choice that set
it, and offers Reset once moved; changing that choice takes the lever back. Contrast stays its own setting.

| Choice | Options | Packages |
|---|---|---|
| Edge | Stroke · Stroke + shadow (Default) · Stroke + shadow, fields too · Hairline + shadow · Shadow · Bold stroke | stroke width / strength / ink, and the share of Depth that rest and field lift take (0, 1, 1 + fields, 1.34 + 0.67) |
| Depth | 0 (Flat)–8, 3 | float and hover lift; rest and field = Depth × the Edge's share |
| Softness | Crisp · Balanced (Default) · Soft · Smooth · Long | layers 1 / 2 / 4 / 6 / 4, distance 3 / 4 / 5 / 6 / 8, tightness 0 / 0 / 3 / 4 / 2 |
| Light | Flat (Default) · Top-lit · Bright · Angled | lip 0 / 1 / 2 / 1, highlight 0 / 2 / 4 / 2, angle 0 / 0 / 0 / 30° |
| Colour | Neutral (Default) · Warm ink · Cool · Deep dark | tint black / ink / cool / black, dark ×2 / ×2 / ×2 / ×4 |

Looks: Area today (the defaults), Notion, shadcn, Primer, Geist, Radix, Linear, Borderless and the three references, each
the five choices plus at most two fine-tuned levers.

Open for the owner: which presets read right; which levers to keep, merge or drop; Field lift on by default; whether
Stroke width reaches 2.
