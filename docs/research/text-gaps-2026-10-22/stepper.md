# Stepper: indicator size, shape, fill and horizontal gaps (research, 2026-10-22)

Owner's note: "make sure the spacing/gaps for the horizontal version are correct. is there a version where the circles
arent so big? do they have to be circles? can they be standalone? do they have to be outline circles? can it be a
lighter fill and then a darker fill when selected?"

This report is read-only research: no repo files were changed. Reference values come from the pinned source in
`docs/research/compass-components-2026-10-13/stepper.md` (cited "R§n") and from fetches made today. Recalled values
are marked [unverified].

## 1. Area today

Paths: `stepper.css` is `packages/styles/src/components/stepper.css`, `Stepper.tsx` is
`packages/react/src/components/Stepper.tsx`, and the spec is `docs/specs/stepper.md`.

| Property | Value (Default, type 14) | In the app (type 13, Compact) | Source |
|---|---|---|---|
| Marker | 24 circle, `--area-control-xs` | 20 | stepper.css:14, :90-93 (`radius-full`) |
| Marker ring | 1px `--area-stroke-width` | 1 | stepper.css:92 |
| Number | `text-xs`, tabular, 400 | 11 | stepper.css:96-98 |
| Check | 12 Glyph (`icon-xs`) | 12 | stepper.css:101; Stepper.tsx:78 |
| Marker to title | 12 (`space-12`), so the title starts 36 from the marker's start | 12 (32) | stepper.css:15, :52 |
| Title | `text-sm` 14/20, 400; muted while upcoming, default ink otherwise | 13/18 | stepper.css:26-27, :36, :43-45, :110 |
| Description | same size, muted, no gap under the title | 13/18 | stepper.css:111 |
| First-line alignment | `padding-top: (marker − leading)/2` = 2 | 1 | stepper.css:108 |
| Line | 1px `border-divider`, one paint in every state | — | stepper.css:16, :129, :155 |

**Paint for each state.** All of these are outlined circles except the current step. Source: stepper.css:33-46.

| State | Ring | Disc | Content |
|---|---|---|---|
| Upcoming | `edge-control-hover` | transparent | muted number |
| Current | `selection-solid` | `selection-solid` (the only solid mark) | number in `fg-on-selection` |
| Complete | `selection-solid` | transparent | 12 check in Selection ink |
| Invalid | `danger-solid` | transparent | "!" |

**Horizontal layout** (stepper.css:118-130). Each step is a marker, then 12, then the text, then 12, then the line,
then 4, then the next marker. The line is at least 16 long, so the narrowest space from one title to the next marker
is 32. The line sits at the marker's centre (`(marker − 1)/2`).

**Vertical layout** (stepper.css:146-156). The line starts 4 below the marker and ends 4 above the next one. Steps are
16 apart.

### Horizontal gaps do not follow the vertical logic

- **Vertical.** The line is 4 clear of the marker at both ends, so the gaps are symmetric.
- **Horizontal.**
  - **Before the line:** 12 from the preceding title (the content gap, `margin-inline: var(--_gap) var(--_line-gap)`
    at stepper.css:128).
  - **After the line:** 4 from the next marker.
  - **The result:** the line hugs the next step and floats away from the title, a 3:1 asymmetry. The line's visual
    midpoint is off-centre between the steps.
- **Every reference with a beside-the-marker label uses equal gaps on both ends:**

  | System | Gap at each end of the line | Source |
  |---|---|---|
  | MUI | 8 | Stepper gap 8 + Step grid gap 8, R§4 |
  | Chakra | 12 (`marginX: gutter`, 12) | R§5 |
  | Mantine | 16 (`margin-inline: spacing-md`) | R§2 |

  Ant starts the rail 16 after the title and runs it to the next item's edge (R§3).
- **Recommended fix: one horizontal gap of 12.** The sequence becomes marker, 12, text, 12, line, 12, next marker.
  - This is the same as Chakra's 12 and Area's own content gap.
  - It keeps the 16 minimum line.
  - The narrowest title-to-next-marker space becomes 40.
  - The alternative is 8 at both ends (MUI).
  - The 4 gap belongs to a line that meets a marker end-on, which only happens vertically. Horizontally, the line
    approaches a marker side-on, like text.
- **A second, smaller point.** With a description, the horizontal line still centres on the marker, not on the title.
  That is correct (Ant and MUI do the same), and the spec doesn't need to change for it.

## 2. References

| System | Indicator | Shape | Upcoming / current / complete | Connector | Label | Gaps | Source |
|---|---|---|---|---|---|---|---|
| MUI Stepper | 24, number 12 | circle | **filled grey disc** / filled primary / primary + check | 1px grey, one paint | beside, or under (`alternativeLabel`, 16 below) | 8 everywhere | R§4, `mui-material/src/Step*` @ade9a69 |
| MUI MobileStepper | **8 dot** | dot | `action.disabled` / `primary.main` | none (dots 2px margin, so 4 apart) | none: Back/Next buttons and the dots only | 4 | [MobileStepper.js](https://github.com/mui/material-ui/blob/master/packages/mui-material/src/MobileStepper/MobileStepper.js) (fetched today) |
| Material 1 spec | 24dp, number 12sp | circle | **38% black filled disc** / primary filled / primary + check | 1dp Grey 400 | beside; vertical steps 72dp tall | icon padding 8 | [m1.material.io/components/steppers](https://m1.material.io/components/steppers.html) (fetched today). Material 3 has no stepper [unverified] |
| Ant Steps, default / small | 32 / 24, number 14 / 12 | circle | **filled variant (default): wait `colorFillTertiary` light grey; finish `colorPrimaryBg` light tint, primary check; current solid primary.** Outlined variant: 1px rings | 1px, coloured by status | beside (8) or under | rail 16 after the title | R§3, ant-design @5a102fe status.ts:226-327 |
| Ant Steps, `type="dot"` | **8, current 10** | dot | colour by status | 2px rail | under the dot | — | R§3, progress-dot.ts |
| Chakra v3 Steps | xs 24, sm 32, md 40, lg 44 | circle | solid recipe: 2px ring / muted tint + ring / solid + check. **Subtle recipe: `bg.muted` / `colorPalette.muted` / `colorPalette.emphasized`** | 2px | beside, gap 12 | 12 at both ends of the line | R§5, steps.ts @fa9696f |
| Mantine Stepper | xs 34 to xl 52, md 42 | circle | grey-2 filled with grey border / primary ring / primary solid + check | 2px | right or bottom | 16 at both ends; label 12 | R§2 |
| Atlassian Progress tracker | **8 dot**, no number | dot over a bar | neutral-bold / brand / brand | **8px bar** with round ends, width = percentage | under, 20 below, centred | column gap 4 / 16 / 40 (spacing) | R§6, @atlaskit/progress-tracker 11.4.4 |
| Carbon Progress indicator | 16 icon | icon: dashed ring / half-filled / check-outline | icon per state | **2px bar on top of each step**, 128 wide | beside, under the bar | marker to label 8 | R§1 |
| Spectrum v3 StepList | S 8 (a dot, no number), M 16, L 24, XL 32; 2px ring | circle; S is a dot | **ring / filled gray-800 / filled gray-600, still numbered** | horizontal: a chevron, no line; vertical: 2px, dashed until done | beside | step gap 10-24, label gap 10-16 | R§8 |
| Untitled UI Progress steps | 24, number 12 semibold | circle; **dot-icon variant: an 8 dot inside the circle** | ring / ring + brand / success fill + check | 2px, or a dotted line | under (h) | 16 grid, 12 to label | R§7 (SSR preview) |
| GOV.UK step-by-step | 30 (large 35) | circle | 1px ring / black fill / — | 1px vertical | beside | — | R§9 |
| Origin UI (shadcn) | 24 | circle | **`bg-muted` fill** / primary / primary + check | 2px | beside | 2 margin | R§10 |
| Primer, Polaris, Fluent 2, Spectrum 2, shadcn core | none: no stepper, only ProgressBar | — | — | — | — | — | R§10 |
| iOS UIPageControl | dots ~7pt, ~9pt apart [unverified]; HIG gives sizes only in relative terms | dot | translucent / opaque | none | none, indicator only | Baymard (not Apple): 8-10 dot, spacing ≥ the diameter | [HIG page controls](https://developer.apple.com/design/human-interface-guidelines/page-controls), [Baymard](https://baymard.com/learn/page-control-ui) |
| Segmented story / onboarding bars (Instagram stories, Linear and Vercel onboarding) | about 2-4 tall equal segments, 2-4 gap [unverified] | bar segment | track / filling / full | the segments are the indicator | none, or "Step 2 of 4" text [unverified] | — | recalled, not measured |
| Stripe, Shopify, Apple checkout | text breadcrumb ("Cart › Information › Shipping › Payment") or sectioned single page, no markers [unverified] | none | weight and colour of the text | chevron | inline | — | recalled, not measured |

**Patterns in the references**

- **Small markers are common.**
  - 24 is the circle consensus: MUI, Material, Ant small, Chakra xs, Untitled, Origin.
  - 16 (Spectrum M, Carbon) and 8-10 dots (Atlassian, Ant dot, MUI Mobile, Spectrum S, iOS) are both established.
- **Shapes other than a circle are dots and bars.**
  - Dot: Atlassian, Ant dot, MobileStepper, Spectrum S.
  - Bar segments: Atlassian's bar, Carbon's per-step bar, story and onboarding segments.
  - No reference uses square numbered markers.
- **Light fill for upcoming steps is the majority.** MUI, Material, Ant filled (its default), Chakra subtle, Origin and
  Mantine use a grey filled disc. Outline rings for upcoming steps are used by Ant outlined, Chakra solid, Spectrum,
  Untitled and GOV.UK.
- **"Lighter fill, darker when selected" exists as a default.** Ant's default filled variant does exactly this:
  - upcoming: light grey;
  - complete: light accent tint with an accent check;
  - current: solid accent.

  Chakra's subtle recipe is the same idea (muted, then muted accent, then emphasized).

## 3. Answers to the owner

1. **Horizontal gaps.** They are not consistent. The line sits 12 after the title but only 4 before the next marker,
   while the vertical line is 4 at both ends. **Fix:** 12 at both ends (Chakra; Area's content gap) or 8 at both ends
   (MUI). Recommendation: 12.
2. **Smaller circles.**
   - Yes. In the app (Compact) the marker is already 20, the 24 consensus scaled down.
   - Smaller numbered steps exist: Spectrum M is 16 with a 2px ring. Area has `--area-mark-sm` 16 (base.ts:353), and
     an 11 number fits a 16 circle.
   - Below 16 the number has to go, which makes it a dot.
3. **Do they have to be circles?** No. Established alternatives:
   - a **dot**: 6-10, Atlassian, Ant, Spectrum S, iOS;
   - a **bar segment**: Atlassian, Carbon, stories and onboarding.

   Squares are not used by any reference. If ever wanted, they would come from the radius role, never as a variant.
4. **Standalone?** Yes, both ways:
   - **Without labels.** A row of dots or segments with the step names only in hidden text plus "Step 2 of 4", as in
     MUI MobileStepper, iOS page dots and onboarding bars.
   - **Without the plate.** A number or check standing on its own, the way Timeline's marks stand without a circle.
     This is open question 1 in the spec.
5. **Do they have to be outline circles?** No. Filled discs for upcoming steps are the majority (MUI, Material, Ant,
   Origin, Mantine).
6. **Lighter fill, then darker when selected?** Yes. This is Ant's default, mapped to Area's roles:

   | State | Disc | Number or mark | Area role |
   |---|---|---|---|
   | Upcoming | neutral fill | muted number | `bg-component` |
   | Complete | Selection tint | check in Selection ink | `selection-surface`, which Chip already uses for selected (chip.css:128) |
   | Current | `selection-solid` | `fg-on-selection` | the one dark mark |
   | Invalid | danger tint | "!" in danger | — |

   With no rings at all, the 1px edge disappears and the markers read lighter. Run the contrast check: the
   upcoming disc against the surface may need `bg-component-hover` (CONTRAST.md).

## 4. Proposed options for Area (axes kept separate)

| Axis | Values | Values for each option | Basis |
|---|---|---|---|
| `indicator` (what marks a step) | `number` (default) · `dot` · `bar` | **number:** today's circle. **dot:** a 6 dot (Indicator's and Timeline's `--_dot` 6, indicator.css:4, timeline.css:16), with the current step 8 [proposal; Ant 8 to 10]. The dot sits centred in the same marker column, so title alignment and line gaps don't change. **bar:** equal segments, 6 tall (Progress's track `--_progress-size` space-6, display.css:307), 4 between segments, labels under or none. | Ant dot, Atlassian, Spectrum S, Carbon, MobileStepper |
| `fill` (paint of the marker) | `outline` (today) · `tint` | **tint:** the light-to-dark ramp in §3 answer 6. It applies to `number` (and `dot`/`bar` already are fills). | Ant filled / outlined; Chakra solid / subtle |
| `size` | `md` (control-xs: 24, compact 20) · `sm` (`mark-sm` 16, number `text-xs`, check 12 → 10 cut) | — | Spectrum M 16; Ant small 24 vs 32 |
| labels | the existing `title` / `description`, plus a visually-hidden-titles mode (`labels="hidden"` or `aria`-only) for a standalone row of dots or bars; the row can carry "Step 2 of 4" text | — | MobileStepper, WAI tutorial |

**Line paint stays as it is.** The line is Timeline's 1px divider for `number`/`dot`. `bar` has no line, because the
segments are the track (complete and current segments in `selection-solid`, the rest in the Progress track colour).

**Governance.** The spec currently excludes sizes, dots and the Atlassian style (stepper.md:31-33). These changes
reverse owner-approved round-25 decisions, so intake (`area-component-intake`) must record them before any build.
Of these, `fill: tint` and the horizontal gap fix need no new tokens.

**Recommended order**

1. Fix the horizontal gap to 12 at both ends.
2. Offer `fill: tint` for the owner to compare against outline. It could become the default if picked.
3. Add `indicator: dot` at `size` md.
4. Add `bar`, then `sm`.
