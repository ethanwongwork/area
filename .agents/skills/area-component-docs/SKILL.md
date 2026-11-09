---
name: area-component-docs
description: Writes and updates an Area component family's usage documentation, the entry in apps/desktop/src/content/documentation/*.mjs that the app shows on the family's Documentation tab (when to use something else, do and don't, parts, states, keyboard, ARIA), from its spec, manifest and source. Use when a component is built or changed, when a family's Documentation tab is empty or wrong, or when asked to document how or when to use a component.
---

# Area component docs

A family's Documentation tab tells someone building a product **when to use the component,
when not to, and how it behaves**. It is not the spec. The spec records evidence and
history; this entry restates the current behaviour in a reader's words.

The tab derives some rows itself. Never restate them:

- purpose (the manifest `description`);
- job (the first paragraph of the spec's Job and boundaries);
- import, status and related families (the spec's Peers line);
- class names and state attributes.

## Where things go

- **Entry:** `apps/desktop/src/content/documentation/<group>.mjs`. Each group file exports
  `{ <slug>: entry }`. The slug is the family's slug in `pages.mjs`. Format reference:
  the header of `apps/desktop/src/content/documentation.mjs`.
- **Model entry:** `button` in `documentation/actions.mjs`.

## Read first, for each family

1. `docs/specs/<slug>.md`: Job and boundaries, Variants (the justification column), States,
   Behavior and accessibility, Owner decisions. If a current-state section contradicts a
   later Feedback log or Review note, the later entry and the code win.
2. The manifest entry (`packages/styles/src/manifest.ts`; its key is the family's
   `manifest` in `pages.mjs`): its `elements` and `states` are the only valid keys for
   `parts` and `states`.
3. The React source (`packages/react/src/components/`), especially prop JSDoc and key
   handlers: they are the truth for keyboard and ARIA.
4. The family's `pages.mjs` entry (`api` and example `note`s) and demos, for real usage.

## Writing the entry

Every sentence follows `docs/WRITING.md` (sentence case, verbs, the shared status words, US spelling); a Do row about a
component's own words (a button's label, an error, a destructive confirm) points at its rule there.

```js
slug: {
  instead:   [["<situation>", ["<family-slug>", …], "<why that one>"], …],
  practices: [["Do", "<guidance>"], …, ["Don't", "<guidance>"], …],
  parts:     { root: "<what it is, what it owns>", <element>: "…" },
  states:    { <state>: "<what changes>" },
  keyboard:  [["<keys>", "<what happens>"], …],
  aria:      [["<attribute>[, <attribute>]", "<when it is set>"], …],
},
```

- **`instead`** comes from Job and boundaries ("not X; that is Y"). Name the situation the
  reader is in, then the family that fits. Use 2–4 rows, and only families that exist.
- **`practices`** are 3–6 Do rows, then 2–4 Don't rows. Each is one sentence a product
  builder can act on: which variant for which job, what must be named, what to pair it
  with, the mistake its spec warns about. Write about usage, not values.
- **`parts`** describe each manifest element plus `root`: what the part is and what it
  owns (height, inset, truncation). Skip internal parts a builder never meets only if the
  manifest's list is long. Never invent a part.
- **`states`** cover each manifest state: what changes visibly and behaviourally. Never
  invent a state.
- **`keyboard`** covers only keys the component handles, read from its handlers or native
  element. Use the key names Kbd draws: `Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`,
  `Up`, `Down`, `Left`, `Right`, `Home`, `End`, `Cmd+K`, and join alternatives with " or ".
  A non-interactive component has no keyboard rows.
- **`aria`** lists the attributes the component sets or requires, and when. Leave it empty
  for a purely presentational family.

**Voice.**

- Plain present tense, in the second person where an instruction helps.
- One or two sentences per cell, under 240 characters.
- Use family names as the app shows them (Segmented, Tree view).
- No dates, owner quotes, audit IDs, round numbers, product comparisons or pixel values,
  unless the value is what the reader must choose ("sm is 16 tall, for dense rows").

**Leave out what you cannot confirm.** A missing row is better than a wrong one. Note the
gap in your report.

## Check, then look

1. `npm run check:docs -w @area/desktop -- <slug>`. It reports unknown parts and states,
   bad slugs, key names Kbd cannot draw, missing Do or Don't rows, and long cells, then the
   family's remaining gaps. Fix and re-run until it shows 0 errors. It reads the manifest
   from `packages/styles/dist`, so run `npm run build -w @area/styles` first if the manifest
   changed.
2. `npm run check:docs -w @area/desktop` for the whole set before you finish.
3. Open the family in the app (Components → the family → Documentation) and read it as a
   builder would. Check that each table reads as one voice and nothing repeats the
   Overview rows.

## When a component changes

Update its entry in the same change as the code and the spec. A new part, state, key or
boundary is a documentation change too. `check:docs` catches parts and states that no
longer exist, but not behaviour that changed silently.
