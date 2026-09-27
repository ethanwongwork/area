# Component specs

One spec sheet per component built or refined under
[Building a component](../COMPONENT_ADAPTATION.md). A spec records the evidence behind
each value, the decisions and their reasons, and the owner's feedback. Start a new spec
from [the template](TEMPLATE.md). Raw measurements live in
[`docs/research/captures/`](../research/captures/), and the shared cross-product baseline is
[research/BASELINE.md](../research/BASELINE.md).

Completion is recorded only in `apps/docs/src/component-status.mjs`; a spec status of
"accepted" mirrors it.

| Component | Spec status | Notes |
|---|---|---|
| [Indicator](indicator.md) (count, activity, presence status) | accepted | Pilot. 24 captures; dot, count, cutout and placement rebuilt from them and owner feedback |
| [Model picker](model-picker.md) | in review | Ghost trigger in the composer, Menu of radio rows with notes (48), 4 below, flips above |
| [Scroll to latest](scroll-to-latest.md) | in review | Round outline icon Button, 24 above the composer and centred (ChatGPT), shown 200 from the end |
| [Message](message.md) | in review | ChatGPT turns: bubble 10/16 at 70% (composer corner 16), prose 16/24, muted 32 icon actions on the text edge, streaming dot |
| [Prompt suggestions](prompt-suggestions.md) | in review | ChatGPT home rows: composer width, 24 below, 48 rows, icons under the composer's "+" |
| [Hover card](hover-card.md) | in review | Popover surface after 700 ms rest (Radix; GitHub ≈ 750), 300 ms close, start-aligned, identity row, never on touch |
| [Context menu](context-menu.md) | in review | Menu at the pointer (Notion: corner at the pointer), flips on screen, Shift+F10 / Menu key |
| [Command palette](command-palette.md) | in review | Notion "Search or ask": 600 wide, 77 from the top, search row 48, grouped Menu rows, key hints; modal or inline |
| [Combobox](combobox.md) | in review | Input + Menu-styled listbox in the top layer; filter, create, groups, custom value; WAI list autocomplete |
| [Resizable panel](resizable-panel.md) | in review | Panel `resizable`: window-splitter separator on one edge, Figma geometry and focus pill, keyboard steps |
| [Box field](box-field.md) | accepted | Padding and corner radius, linked or one field per side/corner, on the inspector grid |
| [Property list](property-list.md) | accepted | Reorderable fills/strokes/effects: handle in the inset, drop line, keyboard moves with announcement |
| [Inspector](inspector.md) | accepted | PanelRow grid (two columns + trailing square), section actions, Figma Design panel recipe |
| [NumberField](number-field.md) | accepted | Figma: the letter or icon is the scrub handle; unit follows the number; soft inspector recipe |
| [Toast](toast.md) | accepted | Popover's 12 inset and corner, 40 tall with or without controls, shared lift, muted description |
| [Dialog](dialog.md) | accepted | Close 8/8 as a 32px ghost Button, title centred on it, 15 title-to-description, shared lift, 13% scrim, modal `trigger` |
| [Popover](popover.md) | accepted | Menu's lift, 320 wide, 16 gaps, anchored `trigger`; pass 3: close in an even corner, strong title, arrow tiles |
| [Menu](menu.md) | accepted | Label at 36, shared hover/focus wash, neutral danger hover, floating lift, arrow keys and typeahead |
| [Split button](split-button.md) | accepted | New: standalone (survey of 15 systems), Notion proportions, full-height divider, native popover menu |
| [Button group](button-group.md) | accepted | Full-height divider in the control line |
| [Button](button.md) | accepted | First pass: labels 400 (solid 500), 6px icon gap, no shadow; ChatGPT, Notion, Figma, Untitled captured |
| [Composer](composer.md) | accepted | First pass: 16/24 text, faint ring and soft shadow, 8px action gap (ChatGPT); auto-grow width fix |
| [Tree view](tree-view.md) | accepted | First pass: secondary ink at rest, 8px start, 16px chevron slot, 20px indent (Nav, Notion) |
| [Breadcrumb](breadcrumb.md) | accepted | First pass: current-page ink bug fixed, 400, separators rgb(131) with 4px gaps, Notion hover plate |
| [Tooltip](tooltip.md) | accepted | First pass: 10px radius and 10px text sides (owner, after ChatGPT), 12px-blur lift; ChatGPT, Notion captured, Figma read |
| [Badge group](badge-group.md) | accepted | First pass: badge-shaped +N overflow at the group size, overlay at content width; Primer is the reference |
| [Badge](badge.md) | accepted | Pass 2: 16 / 20 / 24 scale (md 20 default), neutral ink, 2px dismiss gap, uppercase removed. 22 reference captures, 80 Area captures, validator |
| [Icon set](icons.md) | research | Stroke census across Fluent, ChatGPT, Notion, Figma and Cursor; construction proposal and 12-icon pilot |
| [Type ramp](typography.md) | research | Product type census; proposal for six sizes, a lighter weight policy and two text colors |

Components without a spec keep their earlier decisions in
[prior decisions](PRIOR_DECISIONS.md). Move a component's section into its spec when
the spec starts.
