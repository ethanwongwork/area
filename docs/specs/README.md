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
| [Composer](composer.md) | in review | First pass: 16/24 text, faint ring and soft shadow, 8px action gap (ChatGPT); auto-grow width fix |
| [Tree view](tree-view.md) | in review | First pass: secondary ink at rest, 8px start, 16px chevron slot, 20px indent (Nav, Notion) |
| [Breadcrumb](breadcrumb.md) | accepted | First pass: current-page ink bug fixed, 400, separators rgb(131) with 4px gaps, Notion hover plate |
| [Tooltip](tooltip.md) | accepted | First pass: 10px radius and 10px text sides (owner, after ChatGPT), 12px-blur lift; ChatGPT, Notion captured, Figma read |
| [Badge group](badge-group.md) | accepted | First pass: badge-shaped +N overflow at the group size, overlay at content width; Primer is the reference |
| [Badge](badge.md) | accepted | Pass 2: 16 / 20 / 24 scale (md 20 default), neutral ink, 2px dismiss gap, uppercase removed. 22 reference captures, 80 Area captures, validator |
| [Icon set](icons.md) | research | Stroke census across Fluent, ChatGPT, Notion, Figma and Cursor; construction proposal and 12-icon pilot |
| [Type ramp](typography.md) | research | Product type census; proposal for six sizes, a lighter weight policy and two text colors |

Components without a spec keep their earlier decisions in
[prior decisions](PRIOR_DECISIONS.md). Move a component's section into its spec when
the spec starts.
