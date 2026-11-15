---
name: area-component-intake
description: Decides what kind of change a request for something new in Area really is (nothing new, a setting, a composition, a slot, a value on an existing axis, a new axis, a new component, or app-only code) and writes the proposal before anything is built. Use when the user asks for a new component, variant, prop, option, size, tone or setting, names a component from another design system or product, or asks whether Area should have something, so the library grows without duplicates, aliases or inconsistent APIs.
---

# Area component intake

Every addition costs review, states, keyboard behaviour, documentation and every future
system-wide pass. This skill finds the smallest change that meets the need and writes it
down so the owner can decide. The rules are in `docs/GOVERNANCE.md`; this is the working
procedure.

Do not build during intake. The output is a proposal. Building starts only when the owner
asks for it (then follow `area-component-build`).

## 1. Restate the need

Write one sentence for the job: what a person is trying to do, and where it appears. Use
the need, not the catalogue name. "Show that a row has unread items" is a need; "a
NotificationBadge" is a name. If the request came as a screenshot or a product name,
describe what that UI does.

## 2. Search what exists

Run these searches before proposing anything:

```sh
grep -n "description:" packages/styles/src/manifest.ts | grep -i "<word>"
grep -rn "<Word>" packages/react/src/index.ts
grep -n "<word>" docs/COMPONENTS.md
```

- **Check the boundaries.** `docs/COMPONENTS.md` › Boundaries and the Candidates table.
  The thing may already be a candidate with recorded missing evidence.
- **Check the nearest family's usage.** Read its Documentation entry
  (`apps/desktop/src/content/documentation/*.mjs`) and its `instead` rows. Read its spec's
  Job and boundaries and Variants: an excluded variant has a recorded reason.
- **Check the settings.** `docs/THEMING.md`: is it something every component already
  changes with?

## 3. Walk the ladder

Stop at the first rung that meets the need, and write why each rung above it failed:

1. **Nothing new.** An existing component or option does it. Answer with the usage.
2. **A setting.** It would apply to every component (size, colour, shape, stroke, depth,
   motion). Hand over to `area-foundation-change`.
3. **A composition.** Existing components arranged together solve it, with no new API. It
   becomes a demo or template tile.
4. **A slot or children.** The component needs to hold new content. Never a `show*` flag.
5. **A value on an existing axis.** A new treatment, tone, size or layout that the axis
   already names.
6. **A new axis or boolean.** An independent dimension that combines with every other axis.
7. **A new component.** A distinct job, anatomy or behaviour.
8. **App-only.** Layout the app alone needs, written with app classes, never an `.area-*`
   override.

When the evidence is too thin to choose, the answer is **gather more evidence**: say which
captures or uses are missing.

## 4. Check the gates

**For a new component**, all five gates go in the proposal:

- **Useful:** named real uses in ChatGPT, Notion, Figma or Cursor, or two or more design
  systems shipping it for the same job.
- **Unique:** the nearest component, and why it cannot do the job (jobs and behaviour,
  not silhouette).
- **Composable:** which existing parts it reuses (Button for actions, Menu for lists,
  Popover for floating, Input's shell for fields).
- **Consistent:** the shared roles it paints, and its peers.
- **Worth maintaining:** its states, keyboard contract and what it will not do.

**For a variant, prop or option:**

- Name its axis from the vocabulary table in `docs/GOVERNANCE.md` § 4, and check that
  every combination with the other axes is valid. A part, slot or state takes its job's name from
  `packages/styles/scripts/vocabulary.mjs` (header, footer, title, actions, trailing, media, open …).
- Give a real use, in a sentence.
- Confirm it is not a setting in disguise.
- Name the gallery tile it adds.
- Reuse existing words: `variant`, `tone`, `size: sm | md | lg`, `orientation`, `layout`,
  `kind`, `side`, `status`, adjective booleans; `value` / `onValueChange`, `open` /
  `onOpenChange`, `onDismiss`, `items`. Never copy a known deviation listed in
  Governance § 4.

## 5. Write the proposal

Give the owner this, in plain words, and keep it short:

```
Need: <one sentence>
Answer: <rung> — <what exactly: the component, axis value, slot, composition or setting>
Why not the smaller answers: <one line each for the rungs above>
Evidence: <products and systems where it appears; captures to take>
Shape: <axes and values / parts / states / keyboard, in the shared vocabulary>
Peers: <families it must line up with>
Cost: <tiles, states, behaviour, docs; anything it makes harder later>
Open: <what the owner must decide>
```

If the owner defers or declines, record it as a row in `docs/COMPONENTS.md` › Candidates
with the missing evidence. A declined idea that is not written down is proposed again by
the next session.

## Examples from Area's history

- **"Banner"** became Alert `layout="banner"` (rung 5): the same job and anatomy at section
  width.
- **"Count"** became its own component (rung 7): it quantifies its owner, with no tone, dot
  or icon. Six systems separate it from Badge.
- **"Icon button"** needed nothing new (rung 1): Button with `iconOnly`.
- **"Compact Button"** is a setting (rung 2): Density changes every control at once.
- **"Action tile"** needed more evidence: one product sighting, so it waits for two more.
- **Inspector rows** are a composition (rung 3): Panel, PanelRow and Number field.
