# Area: status, settings validation and work plan (2026-11-18)

An evaluation of where the design system stands, whether its settings hold together in every
combination, how the strongest open source systems handle the same problems, and what work
remains. Nothing in the system was changed. Five audits fed this page: project status, the
settings and their tests, components against the settings, external research, and a rendered
run at corner settings (partial, see "Not verified").

## 1. Where the project stands

- `main` is clean: no open pull requests, CI green, this branch equals `origin/main`.
- **Review is the bottleneck.** 6 families are Complete, 119 are In review, and no review batch
  is open. The Phase 2 review page was never built.
- **The customization study (2026-11-10, 48 recommendations) is entirely unbuilt** and its
  picks were never confirmed.
- **The behaviour layer is half done.** Phase 3 quick wins merged (PR #235). Still absent: the
  menu engine with submenu intent, list navigation and typeahead, roving focus,
  `useFormField`. Phase 4 (family defect rounds) has not started.
- **The safety net does not guard `main`.** CI runs neither `test:behaviour` nor
  `check:rendered`; both are local only.
- **Release readiness is open:** no versions, LICENSE or CHANGELOG, one `area.css` (no
  per-component CSS), no DTCG export, `@area/output` unpublished.
- Housekeeping: `.Codex/HANDOFF.md` still calls Phase 3 uncommitted; 156 worktrees exist, most
  stale, three with real unmerged changes (`kind-bhaskara-bea499`,
  `component-work-continuation-f0bd3d`, `desktop-perf`).

## 2. The settings

There are **62 registered settings**, plus Contrast, Pills and Material outside the registry.
The product of their options is about 10^71 combinations, so "every combination" can only be
shown by rules that hold by construction plus targeted sweeps.

### What the existing tests cover

All 43,742 token tests pass, as do the contract, cohesion, state-paint, output and fidelity
suites. But the coverage has a clear shape:

- Each setting is tested **alone**, in light and dark.
- Accent, neutral, strength and Solid are tested together thoroughly.
- **Page ground and Layers are held at their defaults in the contrast gate, the accent test and
  the tone-floor test.** The Layers tests check neutral inks only.
- Type, density and radius are never tested as a full product.
- The rendered checks and the behaviour suites run at defaults only.

### What fails when settings move (measured by new sweeps)

Two sweeps were written outside the repo (36,450 geometry combinations; 5,400 colour
combinations, 2 million pair measurements). Nothing fails at default Layers. With Layers or
ground moved:

| # | Finding | Numbers |
|---|---|---|
| 1 | Tone and hue outlines vanish on a gray light page; they do not follow the ground | `danger-border` on `bg-surface` 1.02 against a 1.3 floor (ground 90); `*-border-strong` 1.41–1.44 against 1.9 |
| 2 | Warm hue icons drop under 3:1 on a gray light page | brown, orange, yellow, green: 2.64–2.85 |
| 3 | Dark secondary inks slip under their APCA floor at Layers extremes | `fg-subtle` on float Lc 58.2 and 54.2 on float hover; `fg-disabled` Lc 19.3 against 20 |
| 4 | With Selection = accent at low Accent strength, selected is indistinguishable from hover | ΔE 0.004 at strength 30; 612 combinations, including default Layers |
| 5 | At type 12 + Compact, small and medium controls are the same height | ladder 20/24/24/32/40 |
| 6 | Pill is not a true pill where half the height is odd | 14 on 30, 12 on 26, 10 on 22 (documented, but the name promises more) |
| 7 | Density does nothing at type 12, 15 and 16 for one of its steps | 3 of 15 type × density pairs are duplicates (by design) |
| 8 | Several edge groups sit under the 1.2 container tier at the default Edge contrast | regions, buttons, tracks 1.12–1.15; media 1.07–1.10; all invisible at 0.5 |

Findings 1–4 are defects. Findings 5–8 are decisions (section 7).

**Added 2026-11-19, from the sweeps as repo tests** (`packages/tokens/src/sweeps/`, step A):

- Finding 1 is wider than first measured: on the recessed grounds (subtle, tile, well) tone outlines miss their floor
  at the full defaults (worst 1.134 against 1.3; strong 1.65 against 1.9), and in dark they miss on ground 0 and 24.
- Finding 4 in dark fails at strength 30 and 60 (141 cases, ΔE 0.0059), including default Layers.
- New: dark vivid syntax inks on `bg-code` reach Lc 53.5 at ground 24 + Layers 8.
- The first sweep's light-ink failures on gray pages were artefacts; they pass once the page's ink darken is modelled.
- The mark offset behind the open baseline-against-centre question grows at type 12 (0.43–0.48px; Count joins).

### The settings themselves

- **Three controls multiply on one edge:** Edge contrast × each of 12 group amounts × Contrast.
  Edge contrast is the same as moving all 12 groups together.
- **Not independent:** focus colour follows Selection; Status colours "match" follows Accent
  strength; Contrast resets Tone contrast; type clamps density.
- **Finer than the eye:** Layers (101 positions), Card tone (202), Tint hue (362) and Fill hover
  (76) offer far more positions than visibly differ. Stroke widths 0.5, hairline and 1 likely
  render alike on a 1× display (not measured).
- **Names:** `shadow-rest` and `shadow-resting` are two settings; `surface` means stroke width;
  `stroke` means Edge contrast; `tone-contrast` writes `tone-floor-*`; `status-colours` is
  British where the UI uses "color"; the registry comment says forty-four settings.
- **Material sits outside the registry,** so no integrity test sees it.

## 3. Components under the settings

Static audit of 129 style sheets. The shared rules are strong: 103 cohesion tests already
enforce state paint, focus tokens, motion tokens, type tokens, radius roles, density roles for
gaps and logical properties. Ink, stroke, fill, radius, type and focus follow the settings in
nearly every family. The gaps:

1. **Icons drawn as data-URIs with a fixed stroke ignore Stroke width:** Select's chevron,
   Checkbox's check and dash, Plan's tick, Spinner (`select.css:70`, `choice.css:785`,
   `plan.css:83`, `spinner.css:14`). No test covers this.
2. **Size tiers fixed in px ignore type and density:** Spinner 12/16/24, Progress 4/6/8, Slider
   thumb, Presence sm, the five file families (48/64/96), Chart heights, Dialog and Drawer
   widths. Controls follow `control-sm/md/lg`; these do not.
3. **Repeated literals with no role:** media glass `rgb(255 255 255 / .12–.2)` in Attachment and
   Video player; pending opacity 0.6 in Message and Queue.
4. **Shadows outside the depth settings:** Slider grip, Color picker thumb.
5. **Solid Button press ignores Pressed fill** while neutral plates follow it.
6. **Density holdouts already on the lint's waiting list:** Description list, Attachment,
   Color picker, Message, Pagination, Tag picker, Turn notice.
7. **14 z-index literals** with no rule.

Most affected families: Slider, Badge, Video player, Attachment, Chart, Splitter, Color picker.

### API vocabulary

The same idea is spelled differently across manifests, and the vocabulary check does not catch
it:

- No frame: `variant=plain`, a `flush` flag, `containerless` + `borderless`, `bare-bar`.
- Bordered: `surface` on Checkbox and Radio, `outline` on the nine field families.
- Quiet: `quiet`, `subtle`, and `on-color` as both a value and a flag.
- `divided` and `floating` are a variant in some families and a flag in others.
- `size` means height, type step, figure px, width or line thickness depending on the family;
  Tag lacks the `sm` Badge has; Drawer alone defaults to `sm`.

### Documentation

`keyboard` is missing from 32 entries and `states` from 70 of 126. Nine specs have no page
(including a stale `infobox.md`).

## 4. What the strongest open source systems do

| Practice | Who | Area today |
|---|---|---|
| Colour pairs declared as data and checked at build, per mode | Primer, Terrazzo | Has it (`pairings.ts`), at default Layers only |
| Contrast as one signed position with anchors per role, tied to the OS setting | Material 3 | Contrast exists but resets other settings and is outside the registry |
| A minimum tonal distance between non-text pairs (hover vs rest, border vs fill) | Material 3 | Missing: finding 4 is exactly this |
| One multiplier per geometric axis, no per-component knobs | Radix Themes, Tailwind | Has it |
| One kitchen-sink page per family, screenshot tested, animations off | Radix, Polaris | Missing |
| Forced colours and right-to-left as their own test runs | React Spectrum | Styles exist, no runs |
| Screenshot runs only when CSS or tokens change | Primer | n/a |
| Removed and renamed tokens tracked in a file, enforced in CI | Primer, Spectrum | Missing; needed before any rename |
| Weekly API diff, consumer install test, SSR test | React Spectrum, Primer | Missing |
| Lint for raw values in consumer code | Atlassian, Primer | `area check` exists, not in CI |
| Agent-readable output from the token source | Primer, shadcn, Spectrum | Has `mcp`; no generated token spec |
| Fewer tokens over time | Spectrum 2 | 62 settings and growing |
| DTCG 2025.10 token files with modes | the standard since October 2025 | Missing |

No system surveyed exposes as many independent settings as Area. The ones that stay reliable
with many options do it by (a) grouping settings that interact and testing each group
exhaustively as pure token maths, (b) covering across groups with pairwise sampling, and (c) a
small fixed set of screenshot modes. Area's token model already suits this.

## 5. Work plan

Ordered so each step makes the next one safer. Sizes are rough.

### A. Make "every combination works" a test (first; small to medium)

1. Move the two sweeps into the repo as tests, grouped by interaction: colour (mode × neutral ×
   accent × strength × status × tone × ground × Layers × Contrast), geometry (type × density ×
   radius × stroke × focus), depth.
2. Run the contrast gate, accent test and tone-floor test at ground and Layers extremes, with
   APCA in dark.
3. Add the missing invariants: selected differs from hover at every strength; tone borders and
   hue icons hold their floor on every ground; control ladder strictly increases.
4. Give `check:rendered` a `--set` option, tolerances that scale with type and density
   (`MAX_BOX 40` skips every large control at type 16), and a fixed list of corner settings.
5. Put `test:behaviour`, `check:rendered` and `area check` in CI.

### B. Fix what the sweeps found (small)

Findings 1–4: make tone borders and hue icons follow the ground as the inks do; lift dark
secondary inks at Layers extremes; give accent selection a floor against hover.

*Built 2026-11-19 (uncommitted):* tone and hue outlines, light marks and dark vivid inks are held on the ground
(`HOLD`, color/layers.ts: each scaled only as far as its floor needs on the deepest light / lightest dark ground);
dark muted, subtle and disabled keep their APCA floors (`DARK_INK_APCA`); the accent selected plate keeps a state step
from hover (`SELECTED_STEP`). Every defect entry in `sweeps/known-failures.ts` is gone (findings 1–4 and the vivid-code
one); the four decision entries remain. At the defaults only the light tone and hue outlines move (they missed 1.3 / 1.9
on the recessed grounds). docs/CONTRAST.md has the rules.

### C. Make every component follow every setting (medium)

1. Redraw the four data-URI icons through `Glyph` or a stroke that follows icon weight.
2. Put Slider, Spinner, Progress, Presence and Switch travel on mark or icon roles.
3. One file-figure scale and chart height roles.
4. Roles for media glass and pending opacity; Slider and Color picker shadows onto depth roles.
5. Clear the density waiting list.
6. Add seven lints so these cannot return: size tiers, data-URI icons, literal colour and
   shadow, z-index, opacity, manifest values, Documentation completeness.

### D. Simplify the settings (medium; needs your decisions)

1. Confirm the 48 customization picks; start with settings hygiene (a1–a7) and the renames,
   with a `removed.json` so old names keep working.
2. Edge: show Edge contrast as the one control, the 12 groups as fine tuning beneath it.
3. Bring Material and Contrast into the registry; make Contrast follow the OS setting.
4. Add "Auto" grey from the accent hue as the default.
5. Reduce positional settings to the steps that visibly differ (options stay, noise goes).

### E. Finish behaviour and defects (large)

Phase 3 remainder (menu engine, list navigation, roving focus, `useFormField`), then Phase 4
family defects, starting with the accessible-name defects.

### F. Clear the review backlog (your time)

One batched review page for the Phase 2 changes with "Approve every fix", then families in
groups, so the 119 can move to Complete.

### G. One API vocabulary (medium)

Merge the spellings in section 3 with deprecated aliases; extend the vocabulary check to
manifest values.

### H. The customization process (large)

The `ask_design` question tool and chat Setup (c1–c8), built after D so Setup asks about the
simplified set.

### I. Release readiness (medium)

Versions, LICENSE, CHANGELOG, per-component CSS, DTCG export, generated token spec for agents,
accessibility statement, browser support statement, screenshot baseline (one page per family;
light/dark × three densities, forced colours, right-to-left), axe run, SSR and consumer
install tests.

### J. Housekeeping (small)

Refresh the handoff; prune stale worktrees after checking the three with real changes.

## 6. Worth adding, and worth refusing

**Add (low complexity, real value):** Auto grey; Contrast as one curve following the OS;
colour-vision modes as values of Status colours, not a new setting; a nested layer scope that
steps grounds automatically; a short shareable system code written by `area build`; DTCG
output; tonal-distance tests.

**Refuse:** per-component radius or size settings; noise and texture settings; shipped named
themes; tokens per component option; theme-level overrides of component default props.

## 7. Decisions for the owner

1. Order: A → B → C before any new customization work? (recommended)
2. Type 12 + Compact: accept sm = md, or hold a 2px step?
3. Pill on odd heights: accept, or round the height?
4. Density duplicates at type 12, 15, 16: accept, or widen the range?
5. Edge groups under 1.2 at default: raise the defaults, or declare them decorative?
6. Solid press: follow Pressed fill, or stay a fixed darken?
7. The 48 customization picks, and the open questions from Phases 0–2 (mark baseline against
   centre is the largest: the Kbd offset grows from 0.11 to 0.48px at type 12).

## Not verified

- **Rendered checks at corner settings are incomplete.** Eight corner runs covered 4–25 of
  about 125 families each and no overlays. No new failures appeared in what ran. A full pass
  needs the captures run one at a time (about 5 minutes each on a quiet machine).
- The behaviour suites did not produce a valid result (the machine was overloaded).
- Findings 1–3 come from the token resolver plus the built CSS, not from pixels.
- Stroke widths looking alike at 1× is inferred.
- Whether older "built, uncommitted" work (user flows, marks, system gaps) reached `main`.
- Some external details came from secondary sources (shadcn create's option list, Material
  density levels, Carbon's Layer behaviour).

## Where the evidence is

Scratch scripts and logs (session-local, not in the repo): `scratchpad/axes/`
(`sweep-geometry.ts`, `sweep-colour.ts`, `colour.log`), `scratchpad/components/`
(`analyze.mjs`, `matrix.txt`), `scratchpad/rendered/` (`runs/`, `run.sh`). They should move
into the repo as step A1.
