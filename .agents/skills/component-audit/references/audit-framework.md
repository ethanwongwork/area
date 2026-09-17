# Area component-audit framework

This reference defines the minimum evidence and output for one component audit. It is a
completion contract, not a menu of optional prompts.

## Evidence levels

Use the strongest available level and label every non-Area claim:

| Level | Meaning | Allowed use |
| --- | --- | --- |
| A | Current official design-system specification, component docs, source, or Storybook | API, behavior, and documented dimensions may be stated as published facts. |
| B | Current official product help, accessibility guidance, or platform documentation | Product capabilities and intended workflows may be stated as published facts. |
| C | Direct observation or measurement of a current official product UI | State exactly what was observed, platform, viewport, and date. Do not generalize it into a system rule. |
| D | Inference from screenshots, secondary commentary, or incomplete evidence | Use only to form a question or hypothesis. Never use it alone to add Area API. |

Prefer primary sources. A library wrapper, blog post, copied screenshot, or community
Figma file does not establish another system's contract. When a page has changed since a
prior audit, use the current page and record the date.

## Required repository inventory

Before research, record:

- public name, user job, and boundary with neighboring components;
- manifest variants, booleans, states, elements, defaults, and native/ARIA adapters;
- React props, defaults, ref target, event behavior, native prop forwarding, and exports;
- CSS block, modifiers, elements, local slots, semantic tokens, and literal exceptions;
- docs examples, API table, practices, gallery specimen, and maturity claims;
- related tests, browser fixtures, audit findings, roadmap work, and package limitations.

This baseline prevents the report from recommending something Area already supports or
from deleting a capability that only appears in CSS or React.

## Required comparison matrix

Create one row for Area and one row for every required benchmark. At minimum include:

- public name and whether the source is a reusable system or an observed product;
- component boundary and related components;
- emphasis variants and semantic tones;
- sizes and default size;
- inline, block, full-width, responsive, and alternate layouts;
- optional icon, affix, badge, description, actions, swatch, media, or slot content;
- disabled, read-only, loading, invalid, warning, success, selected, open, empty, and
  indeterminate states where relevant;
- keyboard, focus, pointer, touch, screen-reader, high-contrast, reduced-motion, and
  portal/overlay behavior where relevant;
- documented dimensions and direct observations, with units and evidence level;
- URL and access date.

Use `Unavailable` when evidence cannot be verified. Blank cells hide uncertainty.

Build a source-to-decision union ledger after the comparison. Every distinct documented
capability from any one of the seven benchmarks gets a row, even if no other system offers
it. Cite its source, name the Area job, and classify it Core, Optional, Separate, Defer,
or Reject. This prevents a useful Primer-only or Geist-only capability from disappearing
in a review of only common patterns.

## Geometry protocol

Measure the painted component rather than relying only on CSS declarations. Use a stable
browser viewport and record device-pixel ratio. For every supported size at both density
presets, capture:

- outer width and height; intrinsic, min, max, and full-width behavior;
- text font size, computed line height, weight, and overflow behavior;
- icon slot size and leading/trailing optical insets;
- horizontal and vertical padding, inter-item gaps, and border width;
- declared radius and painted/capped result;
- focus-ring width and offset;
- multiline, long-label, empty, and optional-content effects.

For flexible-width controls, do not invent a canonical width. State the intrinsic or
author-set behavior, recommended content range, min/max constraints, and when full width
is appropriate. For popup components, measure trigger and popup independently and record
their width relationship.

For contained controls, define one explicit width token and use it in every standalone and
Field-wrapped specimen. A compound layout can make the whole row wider for its label, but
must not shrink its child control because a grid happens to use fractional columns.
Full-width is an explicit documented layout, never a preview-side effect.

## Inset and nested-backplate protocol

Treat every contained item as one of three layers: the component backplate, a named content
slot, and, when interactive, a nested action backplate. A decorative icon uses a square icon
slot directly. Text uses its trimmed text slot. A focusable icon action must instead have a
separate square action box, with the icon centered inside it; never size the button to the
glyph. Measure and record all three relationships:

- outer backplate to direct icon/text slot;
- outer backplate to nested action box; and
- nested action box to icon slot.

Use shared tier tokens for every box. The outer container reserves the action-box dimension,
while the action owns its internal icon padding. This lets Input, Button, Menu, Nav, Card
actions, and future controls share a structural policy without forcing every component to
use identical absolute padding. Document the named slots and their tier relationships in the
component audit; do not leave padding to arbitrary child margins.

Test at minimum:

- default and compact density;
- smallest, default, and largest supported size;
- radius presets `0`, the current default, the largest numeric preset, and `pill` when
  the component accepts it;
- default and a larger type preset;
- light and dark; neutral and a chromatic accent; standard and increased contrast;
- 200% browser zoom or equivalent text enlargement;
- narrow container, long localized label, and RTL when the layout is directional.

## Radius decision rules

Record a component's radius contract as a range, not as one favorite value:

- **lower bound:** the smallest radius that preserves the component's intended identity;
- **upper bound:** the largest radius before corners collide with content, become an
  unintended pill/circle, or violate the concentric inner/outer relationship;
- **shape invariants:** circles and pill tracks that must ignore the radius axis;
- **nested relationship:** outer radius equals the inner radius plus the actual inset,
  subject to the system cap and zero floor;
- **collision notes:** presets that paint identically because the box is too small.

Flag, then resolve, any preset that clips focus, icons, text, selection indicators, or
nested surfaces. Do not compensate by changing individual glyph geometry.

## Variant decision scorecard

Write prose decisions, but check each candidate against all of these:

- Does it solve a distinct user or product job?
- Is its name common and unambiguous?
- Is it visually orthogonal to tone, size, state, and layout?
- Can plain CSS represent it without hidden behavior?
- Can React support it with native semantics or a complete interaction model?
- Does it compose with existing optional content and every supported size?
- Does it remain legible in dark, compact, increased-contrast, zoomed, long-content,
  localized, and RTL contexts?
- Does it need an independent theme token?
- Is the maintenance and testing cost proportional to its value?
- Would a separate component or documented composition be clearer?

Do not add `soft` and `ghost` merely to make every component mirror Button. For an input
or native Select, removing the boundary can weaken discoverability and invalid/focus
communication. Such a treatment needs a clear surface context, persistent affordance,
and contrast/focus evidence.

## Naming rules

Choose names from semantics and behavior, then visual treatment:

- Prefer the platform and cross-system term when it describes the same job.
- Preserve distinctions such as Tooltip vs Popover, Select vs Combobox, Badge vs Chip,
  Dialog vs Alert dialog, and Progress vs Spinner.
- Avoid renaming solely to match one benchmark.
- If Area's name differs, document whether the issue is public API, docs terminology, or
  an intentionally broader/narrower boundary.
- Include migration impact and compatibility handling for any accepted rename.

## Token audit

Inventory every component color, dimension, type, motion, and elevation role. Recommend a
new semantic token when all are true:

1. the role has stable meaning;
2. a consumer may reasonably customize it independently;
3. its fallback relationship is clear;
4. it has at least one real consumer;
5. its contrast, state sequence, and axis ownership can be tested.

Component aliases may fall back to global semantic tokens. Keep the component's base rule
as the consumer and let variants repoint local slots. Never let two axes own the same
emitted property.

## Accessibility and interaction audit

Cover what applies to the component:

- semantic element and accessible name/description/error relationships;
- keyboard entry, exit, traversal, selection, dismissal, and typeahead;
- visible focus, focus restoration, and focus trapping for modal UI;
- disabled vs read-only semantics and event suppression;
- loading announcement and prevention of duplicate activation;
- pointer target and touch target behavior without visually inflating compact UI;
- screen-reader name, role, value, state, and change announcements;
- forced colors/increased contrast and non-color state indicators;
- zoom, reflow, text enlargement, truncation, localization, and RTL;
- reduced motion and interruption limits;
- popup DOM order, portal theme propagation, collision handling, and viewport escape.

If Area supplies only presentation for a behavioral pattern, say so plainly in the docs
and do not score it as complete.

## Required report file

Write `docs/component-audits/<slug>.md` with this structure:

1. `# <Name> audit — YYYY-MM-DD`
2. **Decision summary** — accepted changes and the final component boundary.
3. **Current Area contract** — manifest, React, CSS, docs, behavior, and maturity.
4. **User jobs and non-goals** — what belongs here and what belongs elsewhere.
5. **Evidence ledger** — source, URL, date, evidence level, and claim.
6. **Benchmark comparison** — all seven benchmarks plus Area.
7. **Geometry** — rendered measurements by size/density and radius limits.
8. **Accessibility and interaction** — supported, missing, and explicitly out of scope.
9. **Candidate decisions** — Core, Optional, Separate, Reject, each with rationale.
10. **Final contract** — names, props/classes/states/elements/defaults and compositions.
11. **Token decisions** — additions, fallback graph, contrast pairs, and rejected aliases.
12. **Implementation** — files changed and migration notes.
13. **Verification** — commands, browser matrix, visual checks, and results.
14. **Remaining limits** — unresolved evidence, browser/AT gaps, and follow-up work.

Keep conclusions traceable. Link each accepted or rejected decision to evidence or an
Area-specific constraint. Do not use “industry standard” without naming the systems and
the behavior they actually share.

## Completion gate

An audit is complete only when:

- all seven benchmarks are represented or explicitly marked unavailable;
- the Area baseline and rendered geometry are recorded;
- variants, states, layout, composition, and behavior are separated;
- radius lower/upper bounds and collisions are documented;
- every proposed token has ownership, fallback, consumer, and contrast coverage;
- accepted changes are implemented across CSS, manifest, React, docs, and tests;
- rejected and separated candidates remain in the decision record;
- relevant automated checks pass and the live docs were inspected;
- remaining accessibility or browser limits are explicit;
- `docs/COMPONENT_AUDIT.md` has the final status and report link.
