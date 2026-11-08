# Writing

How Area's words read: in components (their default labels and messages), in the app, and in what a consumer writes
into Area's slots. One file, read by every skill that writes or checks copy (owner, 2026-11-07, system gaps D3; the
rules were split across `area-ui-compose`'s copy reference, `area-ui-review` and PRODUCT_UI.md). Demo and specimen
text is the placeholder vocabulary instead (DESIGN_SYSTEM.md, "Example copy"); type sizes, inks and spacing are
`area-type-usage`.

## Voice

- **Plain and short.** Say what a thing is or what it does, in the reader's words, once. No marketing, no jokes, no
  exclamation marks, no "please" and no "simply".
- **The reader acts; the product reports.** "Save changes", "Changes saved", never "We've saved your changes!".
- **Design words, never git's** (PRODUCT_UI.md rule 24): draft, publish, version, restore, exploration; never commit,
  branch, merge, push, working copy.
- **No product names** in settings, docs rules or review pages: references are examples, not the vocabulary (owner,
  2026-11-02).
- **US spelling** in everything a person reads: color, gray, center, canceled (owner, 2026-10-30). The public API
  says `color` too (GOVERNANCE.md § 6).

## Capitalisation and punctuation

- **Sentence case everywhere:** titles, buttons, menu items, tabs, labels, column headers, settings. Only proper nouns
  keep their capitals.
- **No full stop** on a button, label, title, menu item, tab, tooltip of a few words or a single-sentence toast title.
  **A full stop** on a description, a subtitle, a helper line, an error with more than one clause, and any text of two
  sentences or more.
- **Two facts on one line join with a comma**, never a middle dot (PRODUCT_UI.md rule 20): "2 themes, Default in use".
- **An ellipsis (…) on a command that asks for more before it acts** ("Rename…", "Export…"), never on one that acts
  at once. Use the single character, not three dots.
- **Quotes are curly** (“ ” ‘ ’) and name what a control acts on: Remove “Label”.

## Buttons and commands

- **A verb, or a verb and its object:** "Save", "Add view", "Delete page". Never "OK" or "Yes" for an action whose
  result has a name; never a noun alone ("Settings" is a nav row, not a button).
- **The same verb all the way through.** The command that opened a dialog names its primary action ("Delete page" →
  a dialog whose primary button is "Delete"), and the toast after it uses the verb's past tense ("Page deleted").
- **Cancel** dismisses without acting; **Close** dismisses something that has already acted or only shows. Never both.
- **One primary action** per surface, last in the reading order of its footer (Dialog, Confirm dialog, Drawer).
- **Icon-only buttons** take the same words as their accessible name and tooltip ("Close dialog", "Remove “Label”"):
  `aria-label`, `dismissLabel`, `clearLabel` and the other `*Label` props.

### Disabled or inactive

A control that can't act now is one of three things (components audit V2, 2026-11-07; the degraded-experiences pattern),
decided in this order:

1. **Leave it out** when its absence wouldn't disorient: a command that never applies here isn't drawn.
2. **Inactive** (`inactive`, with `inactiveText`) when people would look for it and it can act once something passes or
   changes: a plan, a permission, a save in progress, a selection to make. It looks disabled, but it keeps focus and
   the pointer, so it says why. Never disable a control for a reason the person can fix or wait out.
3. **Disabled** when it truly can't act here and there is nothing to say: a Next on the last step, a field a form
   doesn't use in this mode.

**The reason says what is missing or what to do**, in a few words, sentence case, no full stop: "Upgrade to export",
"Saving…", "Select a page first", "Only owners can delete". Never "Disabled", "Unavailable" or "Not allowed" alone:
they repeat what the look already says.

## Labels, placeholders and help

- **A label names the value**, as a noun phrase: "Name", "Corner radius". Never a question, never a colon.
- **A placeholder is an example, never the label**: it disappears as the reader types. A field with no visible label
  still has a name (`aria-label`).
- **Help text says what is accepted or why it is asked**, in one sentence under the field, before it is needed.

## Errors and validation

- **Say what happened and what to do**, in that order: "That name is taken. Try another." Never only "Invalid", never
  blame ("You entered…"), never an error code alone.
- **Next to the cause:** a field's error under the field (`errorMessage`), a form's summary above the form, a page's
  failure in an Alert, a background failure in a Toast with a way to retry.
- **Validate on leave or on submit**, not on every keystroke; clear the error as soon as the value is valid.
- **Status words are the shared four** (GOVERNANCE.md, "Status words"): pending, current, complete, error. In copy,
  say what the state means: "Not started", "In progress", "Done", "Failed", as Plan and Step speak them.
- **Change words are git's five** (GOVERNANCE.md, "Change words"): Added, Modified, Deleted, Untracked, Renamed, with
  their letters A, M, D, U, R where a row has no room. "Deleted", never "Removed", for a file or a line that is gone
  ("3 deleted" beside "+5"). "Unseen" is said for an item changed since it was last looked at, apart from its change.
- **Announcements name their subject** (DESIGN_SYSTEM.md, "Announcements"): "Brand guidelines.pdf: Complete", "Fills
  moved to position 2 of 3", "3 results". Past participles and noun phrases, no "successfully", no full stop on a
  fragment.

## Destructive actions

- **Name the object and the consequence:** title "Delete “Page one”?", text "This can't be undone." (only when it
  can't), primary "Delete" in the danger tone, then Cancel.
- **Prefer undo to a confirm** where the action can be reversed: act, then a Toast with Undo. Confirm only what can't
  come back, or what affects other people.
- **Never** make the safe choice the danger-toned one, or phrase the question so that "Cancel" means "go ahead".

## Empty states, loading and notices

- **An empty state names the missing thing and how to fill it**, once per region (PRODUCT_UI.md rule 10): "No pages
  yet" and an "Add page" action; a search's empty state names the query: "No results for “Label”".
- **Loading shows by how long it takes** (Primer's loading pattern): under a second, nothing; one to three seconds, a
  Spinner or Skeleton; three to ten, Progress with the share; longer, a background task the person can leave, with a
  Toast when it ends. Words say what is loading ("Loading pages…") only once it lasts long enough to read. Spinner's
  and Skeleton's `delay` keep the first rung: `"long"` (1000 ms) where the wait is usually quick, `"short"` (300 ms)
  where a blank would read as broken (a menu's loading row waits `short`); the mark keeps its place while it waits.
- **An empty list names what's missing** (`emptyText`: "No teams yet", "No results"), never "Empty" or "No data".
- **A toast is one past-tense line** ("Theme published"), with at most one action (Undo, View). It never carries the
  only copy of information the reader needs later.

## Truncation, numbers and dates

- **Chrome truncates, content wraps:** nav rows, tabs, bar titles and table cells end in an ellipsis or a fade;
  paragraphs wrap; card titles clamp to two lines and meta to one. A truncated name shows whole in a tooltip.
- **A choice of several** names its picks while there are one or two ("Option one, Option two") and counts them from
  three ("3 selected"), so the trigger never truncates a list of names (Custom select's `multiple`; components audit V7).
  Its Select all row is "Select all"; its footer's actions are "Save" and "Cancel".
- **Numbers:** tabular figures in tables, counts and prices; a thousands separator from four digits up ("5,842");
  units after a space ("24 px" in copy, "24" in a field whose unit is its label).
- **Dates:** relative while recent ("2 min ago", "Yesterday"), then absolute ("Nov 7", "Nov 7, 2025" outside this
  year); a full timestamp in the tooltip (Timestamp).
- **Counts only on collections** (cards, rows, swatches, icons), never on facts, code or prose.

## Translation

Every default string in a component is a prop (`*Label`, `labels`, `statusLabels`), so a product can translate it.
Write copy that survives translation: whole sentences rather than fragments joined in code, no text in images, room
for 30% more length in chrome. Area's own defaults are US English (GOVERNANCE.md, release readiness T3, is where an
i18n policy will go).

## Checking copy

Read every string a change adds or touches against this file: verb, case, full stop, the shared status words, the
accessible names of icon-only controls, the destructive pattern, and whether an empty, loading or error state says
what to do next. `area-ui-review` runs this on a screen; `area-component-docs` on a family's usage entry.
