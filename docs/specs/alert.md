# Alert spec

**Status:** accepted · 2026-09-28 (owner, batch 4; banner layout added)
**Captures:** `docs/research/captures/alert/`
**Peers:** Toast (shared inset rule), Button sm ghost and Dialog close (the dismiss control),
Chip remove (a tinted 12% plate), Card and Panel (container radius)

## Owner decisions

- 2026-09-27 (given as "toast fill colors can be lighter and maybe the foreground a bit more
  vibrant"; Toast has no tinted fill, so it applies to Alert's tones and to both families'
  icons): each tone's fill is its semantic surface mixed 50% toward `bg-surface` in oklab
  (keeps the hue; the 25 rungs of blue and red read grey); icons take a brighter rung (info
  and danger 500, success and warning 550, 3.5:1 or more). Text keeps the tone ink: one rung
  lighter measured 4.33–4.47:1 on the lighter fills, under the 4.5:1 text minimum. Dark keeps
  the semantic roles.

- 2026-09-26: Neutral by default, accent by override. Alert's default tone is `neutral`;
  `accent` is an explicit tone.

No Alert section existed in [prior decisions](PRIOR_DECISIONS.md).
- 2026-09-27: audit Alert again, with a before-and-after at enlarged scale.

## Job and boundaries

Alert shows an in-place message tied to the content around it: an optional icon, a title,
a description, an inline link, actions and an optional dismiss. It is not a transient,
positioned notification (Toast) and not a blocking decision (Dialog). The parent owns
whether a dismissed alert stays rendered.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| tone | neutral (default), info, success, warning, danger | Meaning, not emphasis; one feedback set with Toast in Badge's order (audit S19); accent left with the emphasis-roles decision | Area's semantic tones; Untitled has no alert |
| layout | single-line (default), multiline | A one-row message, or a title over wrapping body with actions below | Gallery tiles `default`, `multiline` |
| layout | banner | A persistent one-line announcement across a page or section, link or status at the end | OpenAI business and Daybreak banners (owner references), Primer Banner, Fluent MessageBar, Polaris Banner, Ant `banner`; see Banner |
| flush | boolean | A banner that meets its container's edges | Primer `flush`, Fluent `shape="square"`, Ant `banner` |
| composition | icon, link, action(s), dismiss | Independent slots | Gallery tiles `link`, `action`, `dismissible` |

Excluded: an emphasis axis (solid banners). No target product capture shows one.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| area | this system | Ten gallery tiles (info and warning added in the second pass) | localhost gallery | — | `area--*` (10) |
| notion | target product | Callout block: radius 10, 12 padding inside a 1px transparent border (content 13 in), fill rgb(249, 248, 247), no visible edge, 24px icon centred on the first line, text 16/24 | notion.notion.site (public page), 2026-09-27 | evidence only | `notion--callout--rest--light` |
| systems | design systems (source) | Primer Banner and Flash, Fluent MessageBar, Polaris Banner, Radix Callout, shadcn Alert, Carbon InlineNotification | Primer @6794582, Material Web @cbd34a8, Fluent @8add8c8, Polaris @3f7954a, Radix Themes @1faff10, shadcn @98a1fe6, Carbon @7e8c8f7, React Spectrum @16eead6, Base UI @45a75a5 | MIT / Apache | source reading |
| uui | design system (source) | No alert component | [Untitled UI reference](../research/untitled-ui-reference.md) ("Not present") | MIT | — |
| chatgpt | target product | Header icon button (the dismiss's peer) | chatgpt.com, logged in, 2026-09-26 | evidence only | `baseline/chatgpt--icon-button-ghost--hover--light` |
| notion | target product | Icon button, hover (dismiss peer); no alert | app.notion.com, logged in, second pass 2026-09-26 | evidence only | `button/notion--icon-button--hover--light` |
| figma | target product | Icon button, hover (dismiss peer); no alert | figma.com, logged in, second pass 2026-09-26 | evidence only | `button/figma--icon-button--hover--light` |

Target products searched without an alert: ChatGPT (sidebar, profile menu, settings);
Notion (sidebar, page menu, Share popover, the "tasks" board, the "returns" table view);
Figma (file browser, editor inspector, layers, main menu). None showed an in-place banner
or callout, so Alert's shell has no product measurement; only its dismiss control does.
Notion's callout block remains unmeasured.

## Anatomy

```
area   div.area-alert[role=status|alert]  grid "icon content actions dismiss"; owns height,
       padding 8, 1px tone border, radius-container, tone fill and ink
  icon     span.area-alert__icon 16px, 4px leading margin (surface.css:161-167)
  content  div flex, baseline, gap 4; title (500, tone ink) + description (fg-muted)
  link     span inline after the description, 4px before it, underlined
  actions  div flex, gap 4
  dismiss  span.area-alert__dismiss > Button sm ghost neutral iconOnly: 28 × 28, radius-control-sm, Area dismiss glyph 16
```

Font and gap come from `inset.css:199-203` (`ui-size`/`ui-leading` 14/20, gap 8); the
dead `text-md` and `space-10` declarations were removed from `surface.css`.

Inset equations (single line, measured in `area--dismissible--rest--light`):
- block: 1 border + 8 padding + (28 − 20) / 2 = 13 to the text; shell 28 + 16 + 2 = 46
  (`surface.css:203`).
- icon start: 1 + 8 + 4 margin = 13. Dismiss end: the 28px ghost sm Button sits 6 from the corner, radius 6, concentric with the 12 corner (2026-09-27; audit S9).
- multiline first line: 1 + 8 + 3 (`--_first-row-offset` = 4 − 1, `surface.css:223`) = 12;
  icon 12 + (20 − 16) / 2 = 14 (`surface.css:239`), measured 14. Without actions the row is
  dropped (`surface.css:243`): content ends 9 from the bottom (8 + 1), shell 65.

## Measurements

`node scripts/capture-compare.mjs --slots shell` (trimmed; gallery tiles are now 578 wide):

| slot · property | area · default | area · dismissible | area · multiline | area · danger | area · info | area · warning |
|---|---|---|---|---|---|---|
| **shell** size | 578 × 46 | 578 × 46 | 578 × 65 | 578 × 46 | 578 × 46 | 578 × 46 |
| **shell** padding | 8 | 8 | 8 | 8 | 8 | 8 |
| **shell** border | 1 solid rgb(243, 243, 243) | 1 solid rgb(243, 243, 243) | 1 solid rgb(243, 243, 243) | 1 solid rgb(242, 219, 225) | 1 solid rgb(214, 226, 242) | 1 solid rgb(238, 222, 207) |
| **shell** radius | 12px | 12px | 12px | 12px | 12px | 12px |
| **shell** font | 14px/20px 400 Geist | 14px/20px 400 Geist | 14px/20px 400 Geist | 14px/20px 400 Geist | 14px/20px 400 Geist | 14px/20px 400 Geist |
| **shell** color | rgb(40, 40, 40) | rgb(40, 40, 40) | rgb(40, 40, 40) | rgb(207, 3, 60) | rgb(1, 96, 217) | rgb(164, 79, 0) |
| **shell** background | rgb(247, 247, 247) | rgb(247, 247, 247) | rgb(247, 247, 247) | rgb(251, 245, 245) | rgb(240, 246, 255) | rgb(255, 245, 238) |

Nodes: dismiss 28 × 28 at 9 / 9 from the top and end edges, radius 6px (`area--dismissible`);
description rgb(102, 102, 102) in neutral and danger alike (`area--dismissible`, `area--danger`).

The dismiss beside the products' icon buttons under the pointer:

| slot · property | area · dismiss | chatgpt · icon-button-ghost · hover | notion · icon-button · hover | figma · icon-button · hover |
|---|---|---|---|---|
| size | 28 × 28 | 36 × 36 | 27.99 × 27.99 | 24 × 24 |
| radius | 6px | 8px | 6px | 5px |
| hover plate | 12% of the alert ink (CSS) | `::before` rgba(0, 0, 0, 0.05) | rgba(33, 27, 23, 0.05) | rgba(0, 0, 0, 0.05) |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| shell · radius | `radius-container` 12 | Peer consistency: Card media, Panel, Code block, Dialog | — |
| shell · padding / height | **10 block, 12 inline (less the border); single line 40** | Toast, its peer (toast.md); Notion callout 13; Primer, Fluent, shadcn, Carbon 12–16 | Was 8 all round, 46 tall |
| icon | 16, 12 in, centred on the first line (8 gap) | Primer, Fluent, Radix, shadcn, Carbon: 16–20 on the first line; Notion 24 on its first line | Was 13 in, centred on the row |
| controls | 28, **6 from the top and the side** (margins −4 / −6, `--_alert-control-*`); a multiline action row ends 6 from the bottom | Toast pass; concentric with the 12 corner (12 − 6) | The dismiss sat 9 in |
| shell · fill / edge | tone surface + tone border; neutral `bg-component` #f7f7f7 + `border-decorative` #f3f3f3 | Semantic roles (`surface.css:284-289`) | The edge is a container seam, which the second pass kept decorative (rules take `border-divider`) |
| text · size | 14/20 (`ui-size`) | Peer: Toast (`inset.css:184-188`), menus and rows use UI body | — |
| title · weight / ink | 500, the tone ink (`surface.css:571`) | Surface title at body size (audit S2, owner 2026-09-30) | Was 400 before the type pass |
| description · ink | **`fg-muted` #666666 in every tone** (`surface.css:177, 293`) | Second pass, decision 5: supporting text takes the muted role | Was the tone ink at 0.85 opacity on tones, an opacity rather than a role |
| dismiss · control | **a ghost small Button** (`size="sm" variant="ghost" tone="neutral" iconOnly`) with the Area `dismiss` glyph, in a `span.area-alert__dismiss` wrapper (`primitives.tsx:197-201`, `surface.css:703-709`) | The close recipe for rectangular surfaces (audit S9, owner): Popover and Toast | Was a hand-built button with a Fluent filled glyph |
| dismiss · size | 28 (`control-sm`) | Button sm; Notion's icon button is 28 (`notion--icon-button--hover`) | Figma 24, ChatGPT 36 |
| dismiss · radius | **`radius-control-sm` 6**, Button's own | Notion 6 on 28; peers Popover and Toast close | — |
| dismiss · ink | neutral: the Button's quiet ghost ink (`button.css:374-377`). Tinted: the alert's tone ink (`surface.css:713-717`) | Shared rule: foreground fixed on hover | Was the alert ink at full opacity on every tone |
| dismiss · hover | neutral: the Button's row plate `bg-component-hover` (`button.css:385-388`). Tinted: `color-mix(_fg 12%, transparent)`, also when pressed (`surface.css:708`, `:713-717`) | Neutral: Popover and Toast close. Tinted: Chip remove (12% of its ink) | A grey plate reads as a hole on blue or red. Was 12% of the ink on every tone, much darker on the neutral grey |
| dismiss · focus | Button's focus ring, `focus-color`, 2px, offset 2 (`button.css:146-149`) | Shared focus role | — |

Settled in the third pass ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)):

1. Dismiss hover strength: kept at 12% of the alert ink on tinted alerts. ChatGPT, Notion and
   Figma hover icon buttons at 5% (`baseline/chatgpt--icon-button-ghost--hover`,
   `button/notion--icon-button--hover`, `button/figma--icon-button--hover`), but an opaque
   neutral plate would grey a tinted ground; the ink mix scales with each tone. Since audit S9
   the neutral alert uses the Button's `bg-component-hover` plate instead.

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| rest | as above | `area--*` captures |
| dismiss hover | neutral: `bg-component-hover`; tinted: plate 12% of the alert ink; ink unchanged | CSS; hover not captured. Products: 5% plate, ink unchanged (Measurements) |
| dismiss focus-visible | 2px `focus-color` outline, 2px offset | CSS; not captured |
| dismiss pressed | neutral: `bg-component-active`; tinted: the same 12% plate | CSS; not captured |

## Behavior and accessibility

`role="status"` for every tone except danger, which uses `role="alert"`
(`packages/react/src/components/primitives.tsx:158-160`; `alert.test.mjs:9`). The dismiss is an Area Button named by
`dismissLabel` ("Dismiss alert"); `onDismiss` shows it and `dismissIcon` replaces the glyph
(`primitives.tsx:158-162`, `:197-201`). The icon is `aria-hidden`. The single-line layout
truncates title and description with an ellipsis; below a 30rem container the actions move
to a second row (`surface.css:276-282`). Forced colours: no Alert-specific rule.

## Peers and consistency

| Peer | Shared role | Peer value | Alert | Match |
|---|---|---|---|---|
| Toast | UI body, gap | 14/20, gap 8 (`inset.css:199-203`) | same rule | match |
| Toast | description ink | `fg-muted`; neutral tone is the default (second pass) | `fg-muted` in every tone | match |
| Button sm ghost | 28px icon action | radius-control-sm 6, fixed ink | the dismiss is this Button | match |
| Popover, Toast close | rectangular-surface close | ghost sm Button, Area glyph | same | match (audit S9) |
| Dialog close | icon action | ghost md Button, 32, radius-control-md 8 | ghost sm, 28, 6 | differs: Dialog is the written exception (audit S9) |
| Chip remove | tinted hover plate | 12% of its ink | 12% of the alert ink on tinted alerts; `bg-component-hover` on neutral | match on tones |
| Card media / Panel / Code block | container radius | 12 at Standard | 12 | match |
| Product icon buttons | hover plate | 5% on 28 / 24 / 36, radius 6 / 5 / 8 (Notion, Figma, ChatGPT) | 12% of ink on 28, radius 6 | size and radius match Notion; strength kept (third pass) |

## Visual pass

2026-09-27, Claude in Chrome, side by side with Notion's callout block (the public Responsible
Disclosure Policy page, `notion--callout`) beside the gallery's Default and Tones tiles, at 2×:

- The neutral Alert is Notion's callout in Area's terms: a quiet fill (#f7 against Notion's warm
  rgb(249, 248, 247)), no visible edge (Area's decorative seam reads as none), the icon on the
  first line. Area sets the text at 14/20 where Notion's block text is 16/24 (a callout is body
  text in Notion; an Alert is UI text), and the corner is 12 against Notion's 10.
- Toned alerts have no product counterpart. After the lighter-fill change the fills read as a
  tint, the icon carries the colour, the title keeps the tone ink and the body is muted.
- Unverified: dismiss hover and focus on screen, dark theme.

The gallery shows Alert in grouped tiles: Default, Tones (accent, info, danger, warning,
success), Layout (multiline), Content (link, dismissible) and Behavior (action).

## Verification

- 10 Area captures (re-taken after the second pass) compared above, plus three product
  icon-button captures for the dismiss.
- Build, token-reference check, typecheck, React (`alert.test.mjs`) and contrast results:
  see [the audit](../research/cohesion-audit.md#verification).
- The empty-row gap found while writing the first spec is fixed: `area--multiline` (no
  actions) is 65 tall, content 12 from the top and 9 from the bottom (was 73 and 17).
- `.area-alert__description { color: fg-muted }` is declared twice (`surface.css:177` and
  `:293`); harmless, but one can go.

## Banner (2026-09-28)

Built from the [survey](../research/split-count-banner-survey.md) (section 3): a banner is an
Alert layout, not a new component and not a Toast. Captures in `docs/research/captures/alert/` (`*banner*`).

| slot · property | area · layout-banner | area · banner-status | area · banner-dismissible | openai · business | openai · daybreak | primer · hidden title, actions, dismiss |
|---|---|---|---|---|---|---|
| shell size | 514.8 × 44 | 514.8 × 44 | 514.8 × 44 | 1376 × 48 | 1376 × 50 | 1408 × 55 |
| shell padding + border | 11 15 + 1 | 11 15 + 1 | 11 15 + 1 | 10 14 | 12 16 | 8 + 1 |
| radius | 6 | 6 | 6 | 6 | 6.08 | 6 |
| type | 14/20 | 14/20 | 14/20 | 17/28 | 14/20, title 600 | 14/21 |
| end slot from the end | link 16 | badge 16 | button 44 (dismiss 8) | pill 14 | link 16 | dismiss 9 |
| end slot from the top | link 12 | badge 12 | button 8 | pill 14 | link 10 | dismiss 11 |

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| inset | 12 block, 16 inline (less the border); one line 44 | OpenAI Daybreak 12 / 16 (owner reference) | Business 10 / 14 sits on a 28 line |
| corner | `radius-control-sm` 6 | OpenAI 6 on both, Primer 6 | Not the container 12 of in-place alerts: a banner is a bar; the end controls (8 in) are not concentric with it |
| arrangement | a flex row: icon, content, link, actions, dismiss | Daybreak flex row | The grid left gaps for absent slots (text 22 in, link 29 from the end) |
| link | ends the row, 16 from the end, 14/20 regular, underlined, alert ink | Daybreak "Learn more" 16 from the end, underlined | Elsewhere the link follows the description |
| status | a Badge in `action` stays on the 16 inset | OpenAI business pill on its 14 inset | — |
| controls | 28, 8 from the top and the end | Alert's hang (−4 over the line) | 8 instead of 6: the banner's inset is 12 / 16 |
| fill, edge, tones, title, description | Alert's | Alert (above) | Daybreak's artwork and sky ring are marketing paint; the business banner's black fill is a bold emphasis Alert excludes |
| flush | radius 0, no side or top edge, inset kept (border added back) | Primer `flush`, Fluent square, Ant `banner` | — |
| placement | consumer's; one at a time; persistent | Survey (Atlassian, Polaris) | — |

Visual pass (2026-09-28, Claude in Chrome, openai.com/daybreak beside the gallery's banner tiles,
both zoomed; headless Edge at 2× too): the same bar: one line, corner 6, text and link on the 16
inset, link at the end. Differences kept on purpose: Daybreak's title is 600 and its only text
(Area: 500 title, muted description, per the type ramp); Daybreak's underline sits lower (a
0.1px rule under a 26px link box; Area keeps Alert's 2px offset); its sky artwork and ring are
marketing paint. Dark theme unchecked. No target product (ChatGPT, Notion, Figma) showed a banner during this
session: ChatGPT reserves an empty root banner slot and a composer banner portal.

## Feedback log

- 2026-09-26 · cohesion audit → dismiss at full ink (was 0.72, 1 on hover), radius
  `radius-control-sm`, focus ring on `focus-color` (was the undefined `--area-focus`) →
  `area--dismissible--rest--light`.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → description
  takes `fg-muted` in every tone (was tone ink at 0.85); info and warning tiles added; empty
  actions row dropped in multiline → `area--*` re-captures; `button/notion--icon-button--hover`,
  `button/figma--icon-button--hover` for the dismiss (no product alert found).
- 2026-09-27 · third pass → open question settled, value kept: dismiss hover stays 12% of the
  alert ink → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-27 · owner: audit → Toast's inset (10 / 12, 40 tall), icon on the first line, controls 6 from the corner, multiline actions 6 from the bottom → `notion--callout`, seven design systems; Pass review in the gallery.
- 2026-09-27 · owner: lighter fills, more vivid ink → fills mixed halfway to the surface,
  brighter icon rungs, text ink unchanged for contrast → headless Edge screenshot of the Tones
  group; contrast computed (text ≥ 5.3:1 on the new fills).
- 2026-09-27 · batch 3 → Claude in Chrome side by side with Notion's callout recorded; Validated.
- 2026-09-28 · owner: build Banner → `layout="banner"` and `flush` on Alert (Banner section);
  Alert returns to In review.
- 2026-09-28 · owner: approved (batch 4); Count keeps the pill shape.
- 2026-09-30 · audit S9 (owner) → the dismiss is a ghost small Button (28, radius 6) with the Area `dismiss` glyph, as Popover and Toast (`primitives.tsx:197-201`); neutral keeps the Button's quiet ink and `bg-component-hover` plate, tinted keeps the tone ink and a 12% ink plate (`surface.css:703-717`). Was a hand-built button: full ink, a Fluent filled glyph, the 12% plate on every tone.
- 2026-09-30 · audit S14 (owner) → no visible change; the row gap and the actions gap no longer read the density gap tokens and are pinned to 8 and 4 (`inset.css:202`, surface.css:593), since those tokens moved to 6.
- 2026-09-30 · audit S19 (owner) → one feedback tone set with Toast in Badge order (neutral, info, success, warning, danger); the neutral icon takes muted ink as Toast's (`--_alert-icon: fg-muted`, surface.css), text stays default ink. Was fg-default.
