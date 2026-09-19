# Construction: selection controls

Read from source 2026-09-18; reproducible from `evidence/`. Italic = computed. "n/p" = not
published. Nothing recalled.

## Switch (status: revised and owner-corrected 2026-09-18)

**Approval history:** [plans/switch.md](../plans/switch.md) records the original broad
proposal. Owner visual review on 2026-09-18 superseded its five-tier, multi-variant and
content-slot decisions with the corrected three-tier Area decision below. The benchmark
measurements remain unchanged.

Audited 2026-09-18 using `lookup.py switch --full`, with separate
`--full --sys pri|rdx|flu|mui` reads for ambiguous anatomy. All ten files in the
Switch row of `evidence/INDEX.md` were read. Paths below are relative to
`docs/audit-pack/evidence/`. Values are CSS px; italic values are source-derived
calculations, not browser measurements. Bold indicates an explicitly established
default. Full extraction sometimes still omits selectors or global resets; those
limits are recorded rather than inferred away.

### Measured table

| System / evidence file | Track W × H | Thumb | Inset / border | Track / thumb radius | Label gap; type | Other geometry |
| --- | --- | --- | --- | --- | --- | --- |
| OpenAI `oai/Switch.txt` | **32×19**, one construction | 13×13 | inset 3; border 0 | full / full | 8; 14/20 | labeled track top offset 1; focus 2, offset 2 |
| Primer `pri/ToggleSwitch.txt` | **medium 64×32**; small 48×24 | width 50% of positioning block; top/bottom/left 1 inside border; conditional *31×28 / 23×20* | track and knob border 1; outer inset *2* = border 1 + offset 1 | 6 / *4* = 6−2 | status gap 8; medium font 14, small 12; leading n/p | icon containers each 50%; glyph size n/p; coarse pseudo min-height 44 |
| shadcn `sha/switch.txt` | **default 32×*18.4*** = 1.15rem×16; sm 24×14 | 16 / 12 square | border 1; exact vertical placement n/p | full / full | n/a, external label; type n/a | checked translation 100%−2 of thumb; focus ring 3 |
| Fluent `flu/Switch.txt` | medium indicator 40×20; small 32×16 | font/icon box *18 / 14* = height−2; painted circle bounds n/p | border 1; painted-thumb inset n/p | indicator 10000 / painted thumb n/p | horizontal *12* = indicator margin 8 + facing label padding 4; small 12/16, medium leading 20/font n/p | indicator margins 8; input width *56 / 48* = track width+16; above label padding 4 |
| Material 3 `m3/switch.txt` | 52×32 | off 16; on 24; pressed 28; with-icon 24; generic handle token 20 (square) | outline 2; positional inset n/p | full / full | n/p; n/p | on/off icon 16; state layer 40, not proof of hit target |
| Carbon `car/toggle.txt` | base 48×24; small 32×16 | 18 / 10 square | inset 3; read-only border 1 and inner offset 2 | track 12 (capped for small) / thumb 50% | state gap 8; state type 14/20; upper label 12/16 | small check 6×5 at top 6/end 5 (read-only 5/4); upper-label bottom margin 16 or flag-enabled 8; travel 24/16 |
| MUI `mui/Switch.txt` | medium track 34×14, root *58×38* = (34+24)×(14+24); small root 40×24, conditional track *26×10* = (40−14)×(24−14) | medium 20 square; small 16 square assignment lacks its selector in extraction | root padding 12/7; small base padding 4; exact thumb placement n/p | track *7* = 14/2 / thumb 50% | n/a, external label; type n/a | protruding thumb construction; small slot/reset ownership unresolved |
| Atlassian `atl/toggle.txt` | regular 32×16; large 40×20 | 12 / 16 square | symmetric clearance *2* = (height−thumb)/2; actual thumb offsets and border n/p | track 9999 / thumb n/p | n/p; n/p | track icon boxes 16/20, top 2, left/right 3; not thumb icons |
| Radix `rdx/switch.txt` | sizes 1/2/3: *28×16 / 35×20 / 42×24*, width = height×1.75 | *14 / 18 / 22* square = height−2 | inset 1; surface inset shadow 1 | themed max(radius-tier,radius-thumb); extracted sample track 3/4/4, thumb *2/3/3* = outer−1 | n/a, external label; type n/a | travel *12/15/18* = width−height; root can follow label line-height; default size n/p |
| shadcn Toggle `sha/toggle.txt` | n/a to Switch; toggle-button sm 32, **default 36**, lg 40 high | n/a | button inline pad 6/8/10; outline border 1 | button 8 | button gap 8; 14/20 | icon 16; excluded: pressed-button contract |
| Geist Toggle — no indexed file | n/p | n/p | n/p | n/p | n/p | no rendered measurement |
| Notion — no indexed file | n/p | n/p | n/p | n/p | n/p | no rendered measurement |
| Figma — no indexed file | n/p | n/p | n/p | n/p | n/p | no rendered measurement |
| Apple HIG — no indexed file | n/p | n/p | n/p | n/p | n/p | no rendered measurement |

Primer conditional calculation assumes border-box: positioning block width 64−2=62,
half-width 31; height 32−2 borders−2 offsets=28; small similarly 23×20. Global box-sizing
is absent, so final rendered knob bounds remain n/p. MUI's small track calculation
likewise assumes border-box root sizing; the full extraction still omits the selector
owning its 16px dimensions. Fluent establishes a thumb icon/font box, not painted circle
diameter. These limitations prevent treating the seed's simplified thumb numbers as
fully measured geometry.

### Size class and shape rule

**Size class: glyph ramp with an independent track width.** OpenAI 19px, shadcn
14/18.4px, Fluent 16/20px, Atlassian 16/20px and Radix 16/20/24px tracks prove that
the switching glyph has its own scale. MUI separates its 14px track from its 38px
root; Fluent separates the indicator from a padded input footprint. Track, hit area,
and label row are distinct boxes.

**Shape: identity shape, always pill.**
OpenAI, shadcn and Material give both parts full radii; Carbon gives a circular
thumb and 12px track radius at 24px high. These support Area's pill track/circle thumb,
independent of the radius axis. Primer's 6/4 track/knob radii and Radix's themed radius
are construction outliers; they remain recorded evidence rather than a second Area shape.

### Consensus

The desktop inset-thumb cluster uses tracks around 16–20px high, small tracks at
14–16px, larger tracks at 24px, and approximately 1–3px thumb clearance.
Width is often 1.75–2× height, but OpenAI is 32/19≈1.68, shadcn default
32/18.4≈1.74, and Material 52/32=1.625: the seed's “below every measured system”
claim about Area's 1.6 ratio was incorrect.
OpenAI, Primer and Carbon support 8px external spacing; Fluent's composed 12px is
an outlier, while external-label primitives publish none.
Label/state type includes OpenAI and Carbon 14/20 and Fluent small 12/16; Primer
publishes 12/14px fonts without leading here.
Primer's large rectangular half-width knob, Material's large state-varying handle,
Carbon's roomier 48×24 base, MUI's protruding thumb and Radix's theme-dependent
shape are construction outliers; the files do not establish a touch-first or brand
motive, so the old causal claims are withdrawn.

### Revised Area decision (owner correction, 2026-09-18)

Use three conventional public sizes. The earlier five-name compatibility ramp created
two undersized tiers and made md/lg geometrically identical. The corrected ramp maps
small to the repeated 32×16 cluster, keeps medium at **40×20**, and maps large to the
48×24 cluster. Track geometry stays identical across densities; compact changes label
typography. Track and thumb are always pill shaped and ignore the radius axis.

Token names below omit `--area-`. `space-N` resolves to N px.
Thumb diameter = track height − 2×`space-2`; border is counted within that inset.

| Size | Track width token | Track height token | Thumb token/formula | Inset | Label gap | Default type tokens (px) | Compact type tokens (px) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| sm | `space-32` | `space-16` | `space-12` | `space-2` | `space-8` | `control-sm-text/leading` (13/18) | same tokens (12/16) |
| **md default** | `space-40` | `space-20` | `space-16` | `space-2` | `space-8` | `control-md-text/leading` (14/20) | same tokens (13/18) |
| lg | `space-48` | `space-24` | `space-20` | `space-2` | `space-8` | `control-lg-text/leading` (14/20) | same tokens (14/20) |

| Shared case | Token decision |
| --- | --- |
| Identity shape | track and thumb `radius-full`, independent of radius axis |
| Border | `stroke-width` inside border-box; thumb positioning offset = `space-2`−stroke width |
| Target | at least `space-24` each axis; coarse at least `calc(space-40 + space-4)` (44), independently of painted track |
| Label alignment / description | center the track on the first label line box; description `control-sm-text/leading`, vertical gap `space-2` |
| Loading | shared `Spinner` size sm beside the track; no in-thumb spinner or private animation |
| Active | thumb stretches `space-2` toward travel while remaining within the track |

No new tokens are needed. Upstream n/p measurements remain unknown. See the component
report for the corrected public contract and post-build measurements.

### Differences from pre-build Area CSS (historical baseline)

Read `choice.css`, `inset.css`, `manifest.ts` and
`packages/tokens/src/axes/density.ts`. These are source-resolved current values,
not a fresh rendered measurement. Sequences are xs/sm/md/lg/xl.

| Property | Current CSS | Proposal / difference |
| --- | --- | --- |
| Default track W×H | 24×12 / 28×16 / 32×20 / 40×20 / 48×24 | 24×12 / 28×16 / 40×20 / 40×20 / 48×24; md width +8 |
| Compact track W×H | 20×12 / 24×12 / 28×20 / 32×20 / 36×16 | same geometry as proposed default; width +4/+4/+12/+8/+12; sm height +4, xl +8 |
| Compact thumb diameter | 8/8/16/16/12 | 8/12/16/16/20; sm +4, xl +8; default unchanged |
| Default checked travel | 12/12/12/20/24 | 12/12/20/20/24; md +8 |
| Compact checked travel | 8/12/8/12/20 | 12/12/20/20/24; +4/0/+12/+8/+4 |
| Default label gap | 4/4/8/8/8 | 8 throughout; xs/sm +4 |
| Compact label gap | 4/4/6/6/8 | 8 throughout; xs/sm +4, md/lg +2 |
| Bare base without size modifier | default 28×16, compact 24×16; thumb 12 | 40×20 and thumb 16 at both densities, matching explicit md |
| Token binding | widths use control ramp, xs/sm/xl heights use icon ramp | explicit geometry from space tokens; density affects type, not track |
| Shape | pill only | default unchanged; explicit radius-axis/concentric rounded alternative absent |
| Independent hit target | input equals painted track; label adds area only when present | minimum 24×24 / coarse 44×44 envelope absent |
| Above label | no Switch-specific above layout | `space-4` layout gap absent |
| Thumb content | pseudo-element without content slot | proposed md/lg/xl icon/spinner boxes absent |

Unchanged: default heights/thumb diameters; both densities' label type;
2px outer thumb inset, border accounting, pill default, description type/gap,
first-line optical alignment. Paint, state behaviour and the remaining capability
checklist belong to the later component audit, not this geometry comparison.

### Unmeasurable / not applicable

n/p: Primer global box-sizing/final knob bounds and status leading; Fluent painted
thumb bounds and medium font size; MUI small slot ownership/reset and precise placement;
shadcn exact vertical thumb placement; Atlassian actual thumb offsets/radius/border;
Material handle positioning; absent label data and all four non-indexed product systems.
n/a: external label geometry in primitive-only files, nonexistent parts, and shadcn
Toggle as a Switch benchmark. No benchmark browser measurement, component code,
manifest or demos changed.

## Slider (status: complete construction research; owner approval pending)

Read 2026-09-18 from the pinned extraction in `evidence/` using `lookup.py slider`
and full reads for all eight indexed systems. `lookup.py --find Range` found only
Atlassian; Primer has no matching extracted Slider/Range file. Values below are CSS px,
not browser measurements. Defaults are not inferred where the extraction omits them.

### Measured construction

| System / evidence file | Track thickness | Thumb W × H | Root / hit-area height | Padding / gap / type | Shape / border |
| --- | --- | --- | --- | --- | --- |
| OpenAI `oai/Slider.txt` | 4 | 14×14 | n/p | root bottom 6; label gap 4, bottom margin 8, font 14; label leading n/p | track radius 2; thumb 50%; inset thumb shadow 2 |
| Primer — no file | n/p | n/p | n/p | n/p | n/p |
| shadcn `sha/slider.txt` | 6 | 16×16 | horizontal n/p; vertical min 176 | n/p | track/thumb full; thumb border 1; hover/focus ring 4 |
| Fluent `flu/Slider.txt` | small 2; medium 4 | small 16×16; medium 20×20 | root min 24 / 32; transparent input height 16 / 20 | input padding/margin 0; external label n/p | rail radius 8 (capped); thumb circular; rail outline 1; inner radius variables 5 / 6 |
| Material 3 `m3/slider.txt` | 16 | 4×44 bar; focused/pressed width 2 | n/p; state layer 40 is not proof of a target | handle leading/trailing space 6, padding 6; label 12/16; value label 14/20 | handle/outer track full; inner track corners 2; overlap outline 1 |
| Carbon `car/slider.txt` | 2 | single wrapper 14×14; upper range wrapper 16×24 | root n/p | root block padding 16, inline 0; container gap 16; range label 14/18 | single thumb 50%; upper thumb radius unset; focus inset shadows 2 and 3 |
| MUI `mui/Slider.txt` | medium 4; small 2 | medium 20×20; small 12×12 | medium content+padding *30 = 4+13+13*; alternate padding gives *44 = 4+20+20*; thumb pseudo target 42×42 | block pad 13 or 20, inline 0; small value label font 12, padding 4×8 | root/rail radius 12 (capped); thumb 50%; rail border 1 |
| Atlassian `atl/range.txt` | n/p | n/p | root 40 | n/p | end-marker pseudo 4×4, radius 9999; track/thumb n/p |
| Radix `rdx/slider.txt` | sizes 1/2/3: 6 / 8 / 10 | layout boxes *10 / 12 / 14* = track+4; painted pseudo *13 / 16 / 19* = layout+2×(track/4) | root 6 / 8 / 10; target pseudo *30 / 36 / 42* = layout×3 | external label n/p | theme-dependent root max expression; painted thumb max(radius-1,radius-thumb); sample 3; surface shadow 1 |
| Geist | n/p | n/p | n/p | n/p | n/p |
| Notion | n/p | n/p | n/p | n/p | n/p |
| Figma | n/p | n/p | n/p | n/p | n/p |
| Apple HIG | n/p | n/p | n/p | n/p | n/p |

Carbon length is 200–640; Fluent horizontal minimum is 120. OpenAI's 22px box belongs
to the **Reset button**, not the thumb or hit target. Carbon's 4×2 mark is not a hover
target. Atlassian's extracted 4px value belongs to an end marker, not a verified rail.
Radix painted-thumb bounds exclude shadow ink. MUI content+padding sums do not establish
an exact rendered outer box without checking the reset/box-sizing context.

### Size class and shape

**Control ramp for the row; independent track and thumb geometry.** Fluent explicitly
separates 24/32px root minima from 2/4px rails and 16/20px thumbs. MUI likewise separates
track, padding and thumb target. Applying one control height to all these parts would
misrepresent the evidence.

**Identity shape:** circle thumb, pill rail, independent of the radius axis. OpenAI,
shadcn, Fluent and MUI establish the circular-thumb cluster. Material's bar handle and
Radix's theme-sensitive shape remain alternatives, not an Area shape menu.

### Consensus

OpenAI, Fluent medium and MUI medium use a 4px rail; Carbon and small Fluent/MUI use 2px,
while shadcn uses 6px. Circular desktop thumbs span 12–20px in these sources, with 16px
supported by shadcn and small Fluent. Root height, visible thumb and pointer target must
be specified separately. Material's 16px rail/bar handle and Radix's expanding painted
pseudo are different constructions; the files do not establish a motive for either.
There is no shared label padding or type ramp across the primitive-only sources.

### Proposed Area decision

Preserve the current five-size API and default medium geometry. Token names below omit
`--area-`; paired values are default / compact. This is a proposal, not implemented code.

| Size | Row token / px | Thumb token / px | Track | Gap token / px | Type tokens / px |
| --- | --- | --- | --- | --- | --- |
| xs | `control-xs` 24 / 20 | `icon-xs` 12 / 12 | `space-2` | `gap-xs` 4 / 4 | `control-xs-text/leading` 12/16 / 11/14 |
| sm | `control-sm` 28 / 24 | `icon-sm` 16 / 12 | `space-2` | `gap-sm` 4 / 4 | `control-sm-text/leading` 13/18 / 12/16 |
| **md default** | `control-md` 32 / 28 | `icon-md` 16 / 16 | `space-4` | `gap-md` 8 / 6 | `control-md-text/leading` 14/20 / 13/18 |
| lg | `control-lg` 40 / 32 | `icon-lg` 16 / 16 | `space-4` | `gap-lg` 8 / 6 | `control-lg-text/leading` 14/20 / 14/20 |
| xl | `control-xl` 48 / 36 | `icon-xl` 24 / 16 | `space-6` | `gap-xl` 8 / 8 | `control-xl-text/leading` 16/24 / 14/20 |

Track/thumb use `radius-full`; input padding/margin use `space-0`; required edges use
`stroke-width`, and focus uses the shared focus tokens. Existing xl thumb 24 is an Area
compatibility choice, not the central benchmark cluster. Reserve at least `space-24`
for the input target independently of the visual row, and evaluate coarse input with
`calc(space-40 + space-4)` target clearance so neighboring targets do not overlap.

Propose component roles `slider-inline-size` → `input-inline-size` (existing contained
field width), `slider-min-inline-size` → `calc(space-96 + space-24)` (120), with minimum
clamped to the available width. `fullWidth` explicitly opts into the current 100% layout.
The mark/label and optional value layout must use the same thumb-center travel interval.

### Differences from current Area

- Current rail is `space-4` at every tier. Proposal makes xs/sm 2 and xl 6; md/lg unchanged.
- Row, thumb, text and gap tokens stay unchanged. The old seed's 20px lg “icon ramp”
  claim was false: Area's actual lg icon token is 16px.
- Current width is always 100% with no component width/minimum role. Proposal introduces
  contained width plus explicit full-width behavior; existing inspector must opt in.
- Explicit input box-sizing/padding and independently reserved target clearance need
  verification; current native pseudoelement sizes may differ by browser.
- Current numeric fill comes only from render-time props, is not normalized to the native
  value, and does not synchronize uncontrolled input/reset. Fix this before optional API.
- No component CSS, manifest, React, tokens or Slider demo code changed in this research pass.

Construction research is complete. Implementation and post-build geometry are pending
owner approval; the overall Slider audit remains Researching.

## Segmented control

| System | Sizes: outer height | Outer pad | Gap | Option pad-inline | Type | Radius outer / thumb |
| --- | --- | --- | --- | --- | --- | --- |
| OpenAI `oai/SegmentedControl` | 22, 24, 26, 28, **32**, 36, 40, 44, 48 | 2 | 2 | 8, 8, 8, 10, 12, 12, 14, 16, 16 | 12, 12, 14 ... 14, 16, 16 | 6, 6, 6, 8, 8, 8, 10, 12, 12 / outer - 2 |
| Primer `pri/SegmentedControl` | **32**, small 28 | 0 (selected button is inset by its border) | 0 | 12 | 14 | 6 (12 in the large-radius theme) |
| shadcn toggle-group `sha/toggle`, `sha/toggle-group` | sm 32, **default 36**, lg 40 | 0 | 0 attached, or spaced | 6 / 8 / 10 (12 in a group) | see file | 8; attached items square off inner corners |
| Material 3 `m3/outlined-segmented-button` | 40 | 0 | 0 | n/p | see file | full; icon 18 |
| Carbon content-switcher `car/content-switcher` | sm 32, **md 40**, lg 48 | 0 | 0 | 8 block + density inline | see file | 4 |
| Radix `rdx/segmented-control` | 24, **32**, 40 | 0 (1px inset indicator) | 0 | 12, 16, n/p | 12, 14, n/p | 4 / 3 |

**Consensus.** This one is on the control ramp: default outer height 32 (OpenAI md, Primer,
Radix 2), with 28 and 24 as compact tiers. Two constructions exist: a padded trough with a
floating thumb (OpenAI: 2 pad, 2 gap, thumb radius = outer minus 2) and a flush joined row
(Primer, shadcn, Carbon, Radix). Option padding is 12 at 32 high. Radius follows the
control radius, never pill by default (Material excepted). **Area decision.** Outer height
= control tier (24, 28, 32, 40, 48); trough pad `space-2`, gap `space-2`; option height =
tier - 4; option pad = tier gutter; thumb radius `calc(radius-control - space-2)`
(concentric); type = tier text. Follows the radius axis; `--pill` opt-in.

## Chip (filter, action, input)

Measured in `c03-labels.md` under Tag: Material 32 high, 8 radius, icon 18, avatar 24; MUI
32 / 24, pill, label pad 12 / 8, delete icon 22 / 16; Fluent Tag 32 / 24 / 20, pad 7 / 5 /
5, radius 4 or full; Carbon selectable tag 24 / 32. **Area decision.** Chip is interactive,
so it sits on the control ramp (Area already has xs to xl); default `sm` 28 or `md` 32 to
match Material and MUI; leading media = tier icon (avatar = height - 8); remove button =
inner-height square; follows the radius axis with `--pill`.

## Toggle button

shadcn `sha/toggle`: 32 / 36 / 40 high, min-width = height, pad 6 / 8 / 10, radius 8,
1px border in the outline variant. MUI `mui/ToggleButton`: see file. **Area decision.**
Same box as Button at the same tier; pressed state is a fill change only, never a size
change.
