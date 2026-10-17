# Stepper spec

**Status:** accepted · 2026-10-13 (owner, review round 25)
**Captures:** `docs/research/captures/stepper/`
**Research:** [design-system sources](../research/compass-components-2026-10-13/stepper.md) (pinned commits, cited lines)
**Peers:** Timeline (the vertical column, marker and line), Progress (how far, without steps), Tabs (switching views,
not progress), Pagination (Cursor's "1 of 3" pager), Button

## Owner decisions

- 2026-10-13: the Compass review → the backlog's "Stepper" ("Navigation and commands"), with Password field, OTP field,
  Time field and Progress circle.

## Job and boundaries

A stepper shows where a person is in a flow of steps (set up a workspace, publish a library, import a file): what is
done, where they are, what is left. Done steps can be revisited. Not Tabs (views, not progress), not a pager ("1 of 3"
with arrows, which is Cursor's "stepper"), not Timeline (events that happened), not a checklist of independent tasks
(GOV.UK's task list; VS Code's walkthrough).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| orientation | horizontal (default), vertical | near-universal (Atlassian horizontal only, GOV.UK vertical only) | — |
| status (per step) | complete, current, upcoming, invalid | complete / current / upcoming everywhere; error in Carbon, Ant, MUI | — |
| content | title; optional description | all; MUI optional, Ant description | — |
| behavior | static; done steps as buttons (`onStepSelect`); every step (`nonLinear`) | WAI, Atlassian, Spectrum, MUI linear; MUI `nonLinear`, Mantine, Ant | — |

Excluded: sizes (none in Carbon, MUI, Atlassian, Untitled UI; Area keeps Timeline's one marker), labels under the
marker (MUI `alternativeLabel`, Mantine `bottom`, Atlassian), dots instead of numbers (Atlassian), loading steps
(Mantine), icons in markers.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| wai | guidance | `ol`, `aria-current="step"`, hidden "Completed:" text | WAI tutorials, multi-page forms; ARIA 1.2 `aria-current` | W3C | — |
| mui | design system (source) | Stepper, StepIcon 24, StepConnector 1px, `alternativeLabel`, `nonLinear` | `packages/mui-material/src/Step*` at `ade9a69` | MIT | — |
| carbon, mantine, ant, atlassian, untitled, zag/ark, spectrum, gov-uk | design systems (source) | markers 24-42, connectors 1-2px, label gaps 8-12, states and ARIA | pinned in the research file | MIT / Apache-2.0 | — |
| timeline | Area | the vertical geometry: 24 marker (compact 20), 1px line, 4 gaps, 16 between events, first-line alignment | `docs/specs/timeline.md` | — | — |
| area | this system | Every gallery tile at 1:1, light and dark | the app, headless Edge | — | `area--*` (14) |

Target products searched without a step indicator: ChatGPT (settings, GPT builder), Notion (import, settings), Figma
(publish library, file browser). Cursor's "stepper" is a pager (`1 of 3` with arrows) and its walkthrough a checklist.

## Anatomy

```
area  ol.area-stepper.area-stepper--horizontal|vertical[aria-label]       flex; owns marker size, gap, line
        li.area-stepper-step.area-stepper-step--<status>[aria-current=step]  status sets ring, disc, ink; ::after the line
          span.area-stepper-step__body | button.area-stepper-step__button  marker + text, gap 12; the button's row plate is a ::before 4 outside
            span.area-stepper-step__marker[aria-hidden]   24 circle (compact 20), 1px ring: number, the 12 check, or "!"
            span.area-stepper-step__text                  first line centred on the marker
              span.area-stepper-step__title (+ span.area-sr-only ", completed")
              span.area-stepper-step__description         muted
```

## Measurements

From the Area captures (light, Default, round 25): marker 24 with a 1px ring, 12 tabular numerals; title 14/20 400
starting 36 from the marker's start (24 + 12, Timeline's); the line 1px divider, 12 after the title and 4 before the
next marker; vertical: Timeline's column, 16 between steps, the line 4 clear of each marker.

| property | MUI | Mantine md | Ant default / small | Untitled UI | Carbon | Area |
|---|---|---|---|---|---|---|
| marker | 24 | 42 | 32 / 24 | 24 (sm) | 16 icon | 24 (compact 20), Timeline's |
| number | 12 | 14 | 14 / 12 | 14 | — | 12, 400 |
| connector | 1px | 2px | 1px | 2px | 2px | 1px (Area's stroke) |
| label gap | 8 | 12 | 8 | 12 | 8 | 12 (Timeline) |
| current | solid primary | primary ring | solid primary | ring + halo | icon | Selection fill, its ink for the number |
| complete | solid + check | solid + check | ring + check | solid + check | check icon | 1px Selection ring + check |
| upcoming | grey disc | grey ring | grey ring | grey ring | ring icon | 1px `edge-control-hover` ring, muted number |

## Decisions

Rethought in round 25 (owner: "should these be the same as timeline? there seems to be some line overlaps and
inconsistencies with other components"): Stepper is Timeline's geometry with numbered markers, and its markers use the
choice controls' paint.

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| markup | `ol` of `li`, `aria-label` on the list, `aria-current="step"` on the current one, a hidden status word after each title | WAI, Atlassian, Spectrum, GOV.UK | — |
| marker | 24 (compact 20) circle | Timeline's marker; MUI, Untitled UI, Ant small, Chakra xs | Timeline's marks have no plate; a step's number needs a container |
| text gap | 12: the title 36 from the column's start | Timeline (owner, round 25) | Round 24 had 8 (MUI, Ant) |
| title | 14/20, 400; default ink for done and current, muted for upcoming | Timeline's 400 | Round 24 had 500 (MUI, Chakra) |
| number | 12, tabular, 400 | MUI 12; Count's tabular numerals | — |
| upcoming | 1px ring in `edge-control-hover`, the muted number | Checkbox and Radio's rest edge (the firmer edge for small marks) | Round 24 used `edge-control`, lighter than any choice control |
| current | the Selection fill, its ink for the number: the one solid mark | Checkbox / Radio checked; Timeline's current event in Selection ink; MUI, Ant fill the current step | Round 24 ringed it (Mantine, Untitled UI) and filled the done steps, so every done step outweighed the current one |
| complete | a 1px Selection ring with the 12 check in Selection ink | MUI, Mantine (a check marks done) | Kept quieter than current |
| invalid | a 1px danger ring, "!" in danger | Carbon, Ant, MUI error | — |
| line | Timeline's: 1px `border-divider`, one paint in every state | peer Timeline (owner, round 25) | Round 24 painted it Selection after done steps (Carbon, Mantine, Ant), a black line no other Area line draws |
| horizontal | steps take their content's width and share what is left; the line runs 12 after the text and stops 4 before the next marker, level with the marker's centre; a step never shrinks below its content, so the line can't run into a title | Timeline's gaps | Round 24 let steps shrink, and the line overlapped titles |
| vertical | Timeline's column: the line through the marker's centre, 4 clear of each marker, 16 between steps | peer Timeline | — |
| going back | done steps are buttons; the row plate (hover, pressed) and the focus ring lie 4 outside, behind, taking no room | WAI, Atlassian, Spectrum, MUI linear; PRODUCT_UI rules 2-3 | Round 24's −4 margin made the button narrower than it drew, one cause of the overlap |

## States

| State | Changes | Evidence |
|---|---|---|
| upcoming / current / complete / invalid | as Decisions | as Decisions |
| step button hover / pressed / focus-visible | `bg-component-hover` / `-active` plate 4 outside; the focus ring on it | PRODUCT_UI rules 2-3 |
| disabled step | `opacity-disabled`, not a button | Mantine, MUI |

## Behavior and accessibility

- Status reaches assistive tech as words ("Members, current step"); markers are hidden. `statusLabels` changes the
  words.
- Done steps are real buttons (Enter and Space). The current step isn't one.
- Not verified: very long titles in horizontal steps (they wrap within the step's share), right-to-left.

## Visual pass

In the app at 1× and 2×, light and dark, Default and Compact. Changed during the pass: the current step's ring used a
colour token as a width and drew nothing; it is now two line widths. The done check went from a 16 box to 12 in the 24
disc. Pressing "Details" in the going-back demo makes it current and the later steps upcoming. Round 25: headless Edge
3× shots beside Timeline after the rethink; the going-back demo (four steps in 480) shows every line clear of the
titles.

## Review note, 2026-10-13 (round 25)

- **What changed:** Stepper now uses Timeline's spacing, type and line: text further from the marker, regular weight,
  one grey line that stops short of each marker. Only the current step is a solid circle; done steps are a ring with a
  check. The line no longer runs into titles.
- **Why:** you asked whether it should match Timeline and pointed out the line overlaps; the markers now read like
  Checkbox and Radio.

## Open questions

1. Done steps: a Selection ring with a check (now) or a muted check with no ring, as Timeline's marks stand without a
   plate? Recommendation: the ring, so every step keeps one 24 circle and the line's gaps stay even.

## Interaction polish, 2026-10-16

Step buttons press at `bg-component-pressed`, one step past selected (Notion presses at 10%, ChatGPT 12%; it shared selected's fill, 1.5% below hover). Not selectable. See [interaction polish](../research/interaction-polish-2026-10-16.md).

## Feedback log

- 2026-10-13 · owner, review round 24 (rethink): "should these be the same as timeline? there seems to be some line
  overlaps and inconsistencies with other components" → headless Edge 3× shots against Timeline: the clickable steps'
  −4 margin and shrinking steps put the line through "Members" and against "Details"; text 8 from the marker (Timeline
  12); 500 titles (Timeline 400); a black done line (Timeline's is always the divider); an upcoming ring lighter than
  Checkbox's → Timeline's gap, weight and line; Checkbox's edge; current the Selection fill, done a Selection ring; the
  plate drawn outside the button; steps never shrink below their content → stepper.css, Stepper.tsx (no
  `line-complete`); re-shot at 3×.
- 2026-10-13 · owner, review round 25: approved (no notes). Open question 1 stays on the recommendation (done steps keep
  the ring).
