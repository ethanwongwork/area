# Surface and Stack in other systems (2026-10-20)

Asked by the owner in layout review round 1 (`layout1`): what Surface is for, and where Surface and Stack appear in
other products and design systems. Examples page: https://claude.ai/artifact/JuR35Vuea3xgFFfK4Rts3S (screenshots
from public docs, captured 2026-10-20, kept out of the repo).

## Equivalents

| System | Surface equivalent | Stack equivalent | What lines up with Area |
|---|---|---|---|
| Radix Themes | Box; Card (`surface`, `classic`, `ghost`; size 1–5); Inset | Flex (gap 1–9) | Card's default variant is named surface; ghost ≈ plain |
| Shopify Polaris (web components) | `s-box` (background subdued / base / strong); `s-section` | `s-stack` (direction block / inline) | Section draws a card at top level and none when nested; BlockStack + InlineStack merged into one stack |
| Atlassian | Box; elevation surfaces (sunken, default, raised) | Stack, Inline (`space`, `spread="space-between"`) | sunken ≈ soft; `spread` is identical; space tokens grouped small / medium / large by relatedness |
| React Spectrum | View; Well | Flex | Well ≈ soft |
| GitHub Primer | Box (deprecated in React) | Stack (gap none / condensed / normal / spacious) | gaps named by feel, the closest to Area's roles |
| Chakra UI | Box; Card (`elevated`, `outline`, `subtle`) | Stack, HStack, VStack (`separator`) | subtle ≈ soft |
| MUI | Paper (elevation 0–24, `outlined`); Card on Paper | Stack (`spacing`, `divider`) | Paper ≈ Surface |
| Mantine | Paper (`shadow`, `withBorder`) | Stack, Group | gap xs–xl |
| IBM Carbon | Tile (flat, one layer step off its background) | Stack | fill steps per nesting level |
| Fluent 2 | Card (filled, filled-alternative, outline, subtle) | none in v9 | size sets corner and padding together |
| Material 3 | elevated / filled / outlined cards; surface container tones | none | tone by depth |
| SwiftUI | GroupBox; grouped Form; ConcentricRectangle | VStack, HStack | ConcentricRectangle computes the nested corner |
| Figma | Frame (fill, stroke, corner, clip) | Auto layout (gap, padding, alignment, wrap, Auto = space between) | |

Product: Linear Preferences (linear.app/docs/account-preferences) is Surface groups in a section Stack with spread
rows; macOS System Settings (SwiftUI grouped form) is the same composition.

## Where Area differs

- Nested corners are computed (only SwiftUI does this among the above).
- Gaps are named by role; others expose a size scale and give relatedness as guidance.
- Elevation is a setting, not a prop.
- No separator option on Stack (MUI, Chakra, Atlassian have one): a candidate, not built.
- soft is one fixed fill step; Carbon and Material 3 step again per nesting level.
