# Token row spec

**Status:** complete · 2026-10-12 (approved, review round 15)
**Captures:** `docs/research/captures/inspector-rows/`
**Peers:** Code with a swatch (the inline token), ColorSwatch (the swatch), Property list (Figma's editable fill rows),
Box model and Code block sm (the inspector's other read-only parts), Panel (the container)

## Owner decisions

- 2026-10-11: shared a Figma Dev Mode inspector ("can any of these from figma dev mode be componentized? ... into
  tables, containers, diagrams") → the plan named a Token row for Dev Mode's Colors.
- 2026-10-12: "brought the figma window forward, keep working" → Token row, measured from Dev Mode's Colors rows.
- 2026-10-12, review round 13 (rethink): "looks long, how does this fit in to the existing token component?" → the row is
  now the existing token (Code with its swatch) hugging the name, with the value muted at the end; no outlined box of its
  own, no separate swatch or icon slot (a non-colour token is the plain token).
- 2026-10-12, review round 14 (rethink): "the token row can still be 1 cohesive backplate, just styled like the existing
  token component? changing the colors to outline only as a style is acceptable." → the row is one plate drawn by the
  token's own classes (`area-code area-code--swatch`): its ground, edge, corner, 22 height (at 12px) and mono type,
  widened to the row with the value at its end; `outline` keeps the edge (stepped up to `border-divider`) and drops the
  fill.

## Job and boundaries

Token row names one design token a layer uses: the existing token (Code, with its swatch for a colour) and optionally
the token's resolved value at the end. It is read-only; with `copyable` the whole row is a button
that copies the value (or the name). Not Code (an inline reference in running text), not Property list (editable fills
with reorder), not a Description list row (a labelled value).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| swatch | a CSS colour, or none | Code's own swatch; other tokens are the plain token | Dev Mode Colors |
| value | shown at the end, or omitted | The resolved value is what a developer copies | Dev Mode (name only behind the paywall; values on hover in the real product, not captured) |
| copyable | boolean | Dev Mode copies a row's value on click | Dev Mode |

Excluded: a detach or "go to variable" action (Figma's editing UI), alias chains (a token pointing at a token).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| figma-dev | target product | Dev Mode inspector with a component instance selected: the Colors section's rows | figma.com, the owner's "Foundation Doc Assets (Copy)", 2026-10-12, light. Dev Mode renders behind its "Get Dev Mode" dialog with placeholder bars for names; nothing was upgraded, the file was returned to Design Mode | evidence only | `figma-dev--token-row`, `figma-dev--colors-group` |

ChatGPT and Notion have no design-token rows.

## Anatomy

```
figma-dev (11/16 Inter 450)
row      div.regularRowWithButton   287 × 32 in a 319 panel, 16 from its start; 8 left at the end
  pill     div.variable_pill_base     263 × 24, centred in the row (4 above and below), 1px rgb(230,230,230)
                                       border, radius 5, white, padding 0 4
    swatch   div.colorThumbnail        16 × 16, 9 from the pill's edge (1 border + 4 padding + 4), radius 20%
    name     text                      4 after the swatch (placeholder bar: 97 × 12)
group    Colors heading 32, rows every 36 (32 + 4)
```

Area (round 14):

```
div|button  .area-token-row[--copyable]   a 32 row (control-md, compact 28), no box; 12/16
  code        .area-code[--swatch]           the existing token: hugs its name, swatch and edge from token.css
  span        __value                        12/16 tabular, muted, at the end
```

The token sizes itself from the row's 12px: max(12, 0.875em) = 12, its box 12 + 10 = 22, centred in the 32 row.
Round 13 (replaced): a full-width 24 ringed box with a ColorSwatch sm and an icon slot.

## Measurements

Generated with `node scripts/capture-compare.mjs docs/research/captures/inspector-rows/figma-dev--token-row--rest--light.json`
(node table; the slot table covers only the row and pill).

| layer | box (from the row) | padding | border | radius | paint |
|---|---|---|---|---|---|
| row | 0 0 287 × 32 | 0 | — | — | 11/16 450, 90% black |
| pill | 16 4 263 × 24 | 0 4 | 1 rgb(230,230,230) | 5 | white |
| swatch | 25 8 16 × 16 | — | — | 20% | the colour (placeholder rgb(117)) |
| name | 45 10 97 × 12 | — | — | 2 | placeholder bar |

## Decisions

| Slot · property | Reference | Area | Basis | Reason when it differs |
|---|---|---|---|---|
| row | 32 tall, the pill fills it less 8 | `control-md` (32, compact 28), full width, no box | Figma's row | — |
| token | a 24 ringed pill filling the row, 16 swatch | the existing Code token, hugging its name (22 tall at 12px, its swatch, edge and ground) | owner, round 13 ("how does this fit in to the existing token component?") | Dev Mode's pill stretches; Area's token is one component wherever a token is named |
| value | not shown (paywalled) | 12/16 tabular, `fg-muted`, at the end, at least 8 from the token | Dev Mode's hex values (owner's reference image) | — |
| group spacing | rows every 36 | rows every 32 (stacked rows) | Figma's 32 rows | Dev Mode's extra 4 sits between its sections |
| copyable | click copies | a `button`: hover `bg-component-hover`, ink fixed; focus ring; "Copied" said once | Shared state paint; Code block's copy | — |

## States

| State | Change | Evidence |
|---|---|---|
| hover (copyable) | plate `bg-component-hover` | shared rule; Dev Mode hover not captured (paywalled) |
| focus-visible (copyable) | 2px focus ring | shared rule |
| copied | `data-copy-state="copied"`, polite "Copied" | Code block's copy pattern |

## Behavior and accessibility

A plain row is a `div` whose text is read as is (the swatch is decorative; the name carries the token). With `copyable`
it is a `button` named "Copy <name>" whose result is announced once through a polite live region; `copyText` overrides
what is copied (default: the value, else the name). Native props and the ref reach the root.

## Peers and consistency

| Peer | Shared role | Peer value | Token row | Match |
|---|---|---|---|---|
| Code `swatch` | token reference | inline, 1em swatch, text-sized box | the same component | match (round 14) |

## Visual pass

Not yet compared side by side with Dev Mode's real values (paywalled).

## Verification

- 6 product captures in `inspector-rows/` (redacted; checksums verified).

## Review note, 2026-10-12

- **What changed:** New component. Token row shows a design token a layer uses, as in Figma Dev Mode's Colors: a swatch
  (or an icon for other kinds of token), the token's name and its value, optionally copied with a click.
- **Why:** it's the next of the inspector parts you asked for from Dev Mode; its size, outline and spacing were measured
  from Dev Mode itself.

## Review note, 2026-10-12 (round 15)

- **What changed:** Token row is one plate again, but it is the existing token's plate: the same fill, edge, corner,
  height and type, stretched across the row with the value at the end. A new outline style keeps only the edge.
- **Why:** you asked for one cohesive backplate styled like the existing token, with outline-only as an acceptable style.

## Review note, 2026-10-12 (round 14)

- **What changed:** Token row is now built on the existing token: the token hugs its name (with its swatch), and the
  value sits at the end of the row. The long outlined box and the separate icon are gone.
- **Why:** you said the row looked long and asked how it fits with the existing token component.

## Interaction polish, 2026-10-16

The copyable row presses at `bg-component-pressed`, one step past selected (Notion presses at 10%, ChatGPT 12%; it shared selected's fill, 1.5% below hover). See [interaction polish](../research/interaction-polish-2026-10-16.md).

## Feedback log

- 2026-10-12 · owner: "brought the figma window forward, keep working" → Token row from Dev Mode's Colors rows
  (6 captures), in review.
- 2026-10-12 · owner, review round 13 (rethink): "looks long, how does this fit in to the existing token component?" →
  rebuilt on Code's token; 32 rows; demos use Area's palette tokens. Round 14.
- 2026-10-12 · owner, review round 14 (rethink): one backplate styled like the existing token; outline-only acceptable →
  the row carries Code's token classes, widened; `outline` boolean; 6 tiles. Round 15.
- 2026-10-12 · owner (chat): "why does the stroke around the swatch only show lightly on the corners, not continuously
  around the whole swatch?" → the swatch edge is `bg-component` (#f7 light), a near-ground colour: along straight edges it
  merges with the token's #fa ground, and at the rounded corners the edge and the fill each antialias on the same curve,
  leaving grey fringe pixels that read as a stroke only there. Reproduced at 2× (Code swatch and ColorSwatch). Fix
  proposed to the owner (a translucent ring over the colour, as Figma's); not applied, since it changes the approved
  Code swatch and ColorSwatch edge (owner decision 2026-09-28).
- 2026-10-12 · owner, review round 15: approved.
- 2026-10-14 · owner: "merge it, then continue working" → all-axis sweep of Surface 0 at Elevation 0 (90 families, light and dark): the outline style (no fill) draws its edge at `stroke-width` through Code's `--_code-border`, so it keeps it at Surface 0; the row's inset counts it.
- 2026-10-14 · owner: "fix token row so it can narrow too" → the component already fills its container (`inline-size:
  100%`); the gallery demos' column was a fixed 288, so the desktop gallery could not lay the row out at its content's
  width. The demos' column is now up to 288 (`max-inline-size`), so the row narrows with its container.
- 2026-10-15 · Copy button built → a copyable row uses its `useCopy` and `CopyStatus`: the copied state holds 2000 ms (was 1600). docs/specs/copy-button.md.
