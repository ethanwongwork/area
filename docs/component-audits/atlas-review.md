# Completed-audit atlas review — 2026-09-17

This retroactive review applies the component capability atlas to every completed Area audit.
It does not change a completed component's public contract by implication. Each gap is a
candidate for a focused future audit or a documented composition, with its own behaviour and
verification.

| Completed family | Atlas alignment | Follow-up candidates |
| --- | --- | --- |
| Field | Correctly separates labelling/description/validation from the child control. | Fieldset/legend and grouped-control composition; label action; responsive group layout. |
| Input | Correctly owns single-line entry, affixes and validation painting. | Purpose-built password reveal, search, numeric input and input-group recipes; no generic catch-all Input. |
| Textarea | Correctly remains native multiline input. | Auto-grow, character-count and rich composer are separate behaviour contracts. |
| Select | Correctly remains native, one-value selection. | Combobox/Autocomplete and Multi-select are separate atlas rows, not Select variants. |
| Checkbox | Correctly owns independent/mixed choice. | Checkbox group, select-all parent/child synchronisation, and card-choice composition. |
| Radio | Correctly owns exclusive selection, native grouping and option-level descriptions. | Choice cards, segmented controls, Select and Combobox remain separate family candidates. |
| Button | Correctly distinguishes emphasis/tone from state. | Button group, IconButton, SplitButton, Link and FAB are distinct family candidates. |
| Code and legacy Token | Correctly consolidates static literal source and optional swatch under Code. | Tag/TokenInput for selected/removable values; Code block remains separate. Docs must use public `.area-code` for every inline code plate. |
| Nav | Correctly owns site/application location and orientation. | Collapsed rail, drawer shell, breadcrumbs, pagination, command menu and tree are separate navigation families. |

## Documentation result

The reviewed docs now use the public Code component for all inline code plates. Plain
`.docs-mono` remains allowed only for unbadged tabular values such as a pixel count or a
type signature; it is not a component presentation. The docs dogfood audit rejects the
retired `docs-code-inline` class, and Code explicitly paints no shadow.

Use inline Code generously for literal API names, props, native elements, tokens, commands,
values, attributes, filenames, and short snippets in explanatory prose. Do not turn general
product nouns or whole sentences into code merely to imitate another documentation site;
literalness, rather than visual density, is the threshold.

## Program result

Future component work begins with the atlas to establish breadth, names, aliases, and
separate behavioural contracts. Implementation still ships one public family at a time so
that accessibility and the manifest/React/CSS/docs agreement never become deferred debt.
Visual refinement follows broad contract coverage, while contrast, semantics, keyboard
behaviour, and regression checks remain release gates for every family.
