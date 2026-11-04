# Visual questions: asking with pictures, in a chat or a feed (2026-11-03)

Owner: "add a new ui type for both feed and chat, which is essentially a main frame and a vertical list of answers to
select from or horizontal list or grid of answers, or even a slider, chip selections, or any kind of control (that might
be used to 'theme' from the onboarding experience that was built) … templates usable mostly in chat to have users answer
and select their choice visually, consistently … a full chat width ui preview frame (based on asset card) and then the
controls, answers, etc below in some kind of consistent visual layout pattern … consider all possible variables of
change where feedback is needed for design: color, spacing, typography, etc." Six reference pictures: a numbered list
under a frame with ↑↓ / Dismiss Esc / Submit ⏎; a frame over an "Intensity" bar with Low and High; a 2 × 2 grid of keyed
answers with "1 / 5" and Skip; a frame over a grid of pictured choices ("Select Interface"); a frame over per-corner
radius fields; a brand board over a fill and stroke row.

Built: `apps/desktop/src/question-kit.tsx` (the frame, the layout and eleven templates), Labs › Feed § Visual questions,
Labs › Chat § Visual questions; Approval `layout="grid"` and a choice's `visual` (docs/specs/approval.md).

## Intake

- **Need.** Let a person answer a design question by looking and pointing (a picture to judge, then a choice, an
  amount, a colour or a few words) instead of describing what they want in prose, in the same shape whatever is asked.
- **Answer.** A composition (rung 3) of Asset card (the frame), Zoom control, Segmented and Button (the frame's bar) and
  Approval (the question), plus one layout value and one slot on Approval (rungs 4 and 5):
  - `layout="grid"`: the choices in as many columns as fit, for short words and for pictures (reference 3, 4);
  - `items[].visual`: a picture per choice, over its key and label in a grid, before them in a list.
- **Why not smaller.** Nothing new: Approval stacks words only, and a RadioGroup of preview cards inside its detail
  would bring a second selection model (choose, then confirm) and lose the keys. A setting: not a look. Composition alone:
  the grid and the pictures need the question card's own keys, hover preview and chosen mark, so they belong in it.
- **Why not a new component.** The question card already is the job (asks, keys every answer, previews on hover, marks
  the answer given, Skip, N of M); the frame is Asset card's job (an asset in a frame under a head of controls). A
  "Visual question" component would only stack the two. Kept as a template until a third product composes it the same way.

## Anatomy (one pattern for every kind)

```
┌ frame ─ Asset card, framed, 16:9 ───────────────────────────────┐
│ name (what it shows)          Before · ☀/☾ · 100% ▾ · ⤢        │  the bar: compare, mode, zoom, full screen
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ the visual: a product screen, a type page, two designs A|B │ │  real UI in the answer's settings
│ └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
  8
┌ question ─ Approval ─────────────────────────────────────────────┐
│ Question?                                  ‹ 2 of 6 ›   ×       │  title, place, close
│ What it changes, in a line                                      │
│ [answer area: list | grid | grid of pictures | bar | chips |    │  one of the kinds below
│  swatches | fields]                                             │
│ ✎ Something else                                       Skip     │  always
│                                          Use default  Continue  │  only when the answer isn't one press
└──────────────────────────────────────────────────────────────────┘
```

- **Frame then question, 8 apart**, as one unit (the Asset grid's gap); the next block in the turn is the prose gap away.
  Proximity binds the picture to the question it asks.
- **Chat: stacked, full column** at 268, 456 and 768. **Feed: beside** from 880 of the unit's own width (container
  query): the frame three fifths, the question two fifths, as Claude's question card sets its preview beside its list from
  480 (`chat-kit-2026-11-02/questions.md` § 3, Previews). Narrower, it stacks.
- **The frame shows the answer under the pointer.** Hover or focus on a choice draws it in the frame before it is
  picked (Approval `onActiveChange`, Setup's stage preview). A bar or a swatch draws as it moves. "Before" holds the
  frame on what it was, to compare.
- **Bar**, end of the head: Before (pressed while held), Light / Dark, the Zoom control (fit, steps, presets) and Full
  screen. The name says what the frame shows. At 268 the name gives way first (ellipsis), never a control.

## Choosing the answer kind: from the variable's nature

| The variable | Kind | Template | Why |
|---|---|---|---|
| A decision between a few named actions or ideas | **List** (keys 1–9, a line each) | Next step | Words are the thing chosen; a line says what each comes to |
| A few short named options (≤ 4 words) | **Grid** of keyed words, 2 across | Where it's used | Short labels in one row read at a glance; the keys stay |
| A look that words describe badly (layout, card style, corner, page) | **Grid of pictures**, each the option drawn alone | Screen kind, Corners | Recognition over recall: the person compares pictures, not imagined ones |
| An amount on an ordered scale (spacing, size, depth, contrast, speed) | **Bar** with named ends and named stops | Room, Type size | One gesture over a continuum; the frame answers as it moves |
| A colour | **Swatches**, then an exact value | Accent | A palette first (few, harmonised), any colour behind it |
| A typeface | **Grid of specimens** ("Aa" in the face) | Typeface | A face is judged by its letters |
| Several at once (what to change, which parts) | **Chips**, several pressed, then Continue | What's off | A set, not one choice; Continue says how many |
| Which of two directions | **Compare**: two frames A and B, then A / B / Both / Neither | A or B | Two side by side is the easiest judgement |
| How close it is | **Scale** of five named points in one row | How close | Discrete, every point named, keyed |
| A precise value, after the broad one | **Fields** (bars in a column), under Fine-tune | Fine-tune | Exact numbers only once the direction is set |
| Anything else | **Something else** row, on every kind | all | The way out when no answer fits |

Every design variable falls into one of these. Color: accent and status (swatches), greys' tint (swatches + hue bar),
page and layers (pictures), contrast (bar). Type: face (specimens), size and leading (bar), weight (grid). Space:
density and gaps (bar). Shape: corners (pictures, then a bar), pills (chips). Lines and depth: edge, shadow, lift
(pictures or bar). Motion: speed (bar, the frame moving), curve (pictures). Layout and content: screen kind and
navigation (pictures), tone of copy (list). Feedback on a result: how close (scale), what's off (chips), which (compare).

## Rules, from the research on choosing

1. **Few options, the likely one first.** Time to choose grows with the number of options (Hick, 1952; Hyman, 1953),
   and too many options can stop a choice altogether (Iyengar and Lepper, 2000: a table of 24 jams drew more
   people, but 30% of those at the table of 6 bought, against 3%). Overload depends on how hard the options are to compare and how unsure the person is
   (Chernev, Böckenholt and Goodman, 2015 meta-analysis), which is every design question. So: 2 to 5 answers a
   question, 8 at most for pictures or swatches; more goes behind "Something else" or Fine-tune.
2. **A default, marked, and pre-chosen when the question is asked again.** Defaults are kept far more than any other
   choice (Johnson and Goldstein, 2003); mark the recommended one (a Default badge) rather than hide that one exists.
3. **Show, don't describe.** Recognising is easier than recalling (Nielsen's heuristic 6). Each picture holds every
   other setting still and changes only the one asked, drawn in the person's settings so far.
4. **Preview before commit.** The pointer over an answer draws it in the frame; a pick is then a confirmation of what
   was seen. Undo is the answer row in the transcript, which asks the question again.
5. **One decision per card, one variable per question.** Several variables in one card hide which one moved the
   picture. A run of questions says where it is (N of M) and can be skipped one at a time.
6. **Compare in pairs when the person can't say what's wrong.** Choosing between two is more consistent than rating
   one alone (Thurstone, 1927, comparative judgement); a preference between two answers is how chat products ask for
   feedback on a reply.
7. **Bars for magnitudes that show, keyed points for opinions.** Bars over a visible change answer the eye at once, but
   for an opinion a slider is slower and more often left unanswered than buttons (Couper, Tourangeau, Conrad and
   Singer, 2006). So "How close" is five named points, not a bar; every point is named, which rates more reliably than
   labels at the ends only (Krosnick and Fabrigar, 1997).
8. **Coarse first, exact last** (progressive disclosure). Named stops on the bar, Fine-tune for numbers.
9. **Every answer one press, from the keyboard too.** 1–9 pick, ↑↓ (and ←→ in a grid) move, Enter continues where
   there is a Continue, Esc skips. Picking a keyed answer answers at once; a bar, swatches or chips need Continue.

## Open (for the owner)

- **Q1. Pin on the frame.** Click a place in the frame to say what's wrong there (a numbered pin and a line of text):
  the most direct feedback, and a new behaviour (point, pin, list). Proposed, not built.
- **Q2. Generate four, vary one.** Image tools answer a prompt with four candidates and "vary" or "use" each. The
  Compare template takes two; a four-up of designs is the Screen kind grid with generated pictures. Proposed.
- **Q3. Feed beside rule.** 880 of the unit's width puts frame and question side by side in a wide feed. A chat never
  goes beside (its column is the reading column).

## Checked (2026-11-03)

In the Electron window from this worktree (Labs › Chat at Column 768 and Panel 268; Labs › Feed at 1440), light and
dark: every template renders; the pointer over an answer draws it in the frame (Corners: the frame's
`data-area-radius` follows 0 → pill); Shadows and Fine-tune open zoomed on the part they change (the menu, the form);
the wide feed puts frame and question side by side. The Approval gallery's Grid and Pictures tiles render. Under a
system theme with Lines 0 and Layers 0 a picture's frame keeps neither edge nor fill, as Radio preview cards and Asset
card do: the settings' own effect.

Not checked: keyboard walk through a grid with a screen reader; Full screen (the Fullscreen API) clicked by hand.

## Detail pass (2026-11-04)

Owner: "add these to the area chat kit and feed kit in their own section at the top. i want to see each variation next
to each other. do another refinement on visual detail pass." Both kits open on **Visual questions** (12): the feed a grid
of every variation (each at least 456), then one beside; the chat kit every variation as a chat at the chosen width,
side by side, then the run. Each variation's name and kind sit 4 under it, as a feed card's caption. Changes, measured in
the Electron window (`../kit-type-2026-11-04/README.md`, findings 1–6):

- one corner for the unit: the frame and the question take the feed's 16 (Approval's new `--area-approval-corner`; the
  question had the Composer's 22), the frame's picture 11 inside (concentric);
- one text column: the frame's name 13 in, as the question's title, keys and words row (it was 16);
- one trailing offset: the last control of either card 5 from its end;
- one foot: every kind ends on "Something else … Skip"; a kind that isn't one press adds Use default / Continue under it;
- pictures in the system's shapes (screens and type 16:9, corners 4:3; 3:2 is gone), two by two under 600, a picture's
  name one line with an ellipsis; an answer's words never cut (a Default badge goes under them where a cell is short);
- Before only where an answer changes a setting; Screen kind's frame names the screen it shows; Room's steps Tighter /
  Balanced / Roomier.

## Round 3 (2026-11-04)

- **The frame** is Asset card's overlay: the name on a plate at the bottom start, Before, Light / Dark, Zoom and Full
  screen on a plate at the top end, shown on hover or focus (always on touch); the picture 8 in on every side. The
  galleries' cards keep their names outside.
- **Controls and answers share one box**: bars, swatches and chips are plates on the answer rows' edge (4 in from the
  card), 4 apart, the row's height; the words under a bar stay on the text column; the foot's buttons end on that edge.
- **Answer treatments** (owner: "explore the actual answer cards have visible backplates or strokes … on the page surface
  without a container … try to not use dividers"): [treatments.mjs](treatments.mjs) builds
  https://claude.ai/artifact/B9tSn3TNB6AVNvQ718Azjm from a Labs › Chat snapshot: quiet, filled, outlined, filled and
  outlined, raised; in a card, on the page, in a well. Nothing in the component changed for it; the pick decides.
