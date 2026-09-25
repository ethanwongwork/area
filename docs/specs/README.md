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
| Indicator (count, activity, presence status) | in review | Pilot. 24 captures; dot, count, cutout and placement rebuilt from them and owner feedback |
| [Icon set](icons.md) | research | Stroke census across Fluent, ChatGPT, Notion, Figma and Cursor; construction proposal and 12-icon pilot |
| [Type ramp](typography.md) | research | Product type census; proposal for six sizes, a lighter weight policy and two text colors |

Components without a spec keep their earlier decisions in
[prior decisions](PRIOR_DECISIONS.md). Move a component's section into its spec when
the spec starts.
