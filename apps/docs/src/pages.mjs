/**
 * Page content.
 *
 * Each example names a demo from the registry. Nothing here contains markup or code
 * strings -- both come from the demo itself -- so a page can only ever describe examples
 * that actually exist, and a renamed demo fails the build rather than rendering a gap.
 */

export const COMPONENT_PAGES = [
  {
    slug: "code", name: "Code", manifest: "code",
    api: [["children", "ReactNode", "—"], ["…props", "HTMLAttributes<HTMLElement>", "—"]],
    examples: [
      { id: "default", title: "Default", demo: "GalleryCode" },
      { id: "prose", title: "In prose", demo: "CodeInProse" },
    ],
  },
  {
    slug: "code-block", name: "Code block", exportName: "CodeBlock", manifest: "codeBlock",
    api: [["code", "string", "—"], ["html", "string (trusted, pre-highlighted HTML)", "—"], ["actions", "ReactNode", "—"], ["layout", '"flush"', "—"], ["…props", "HTMLAttributes<HTMLDivElement>", "—"]],
    examples: [
      { id: "default", title: "Plain text", demo: "CodeBlockPlain" },
      { id: "flush", title: "Flush", note: "Use flush when the block is already framed by a parent example container.", demo: "CodeBlockFlush" },
    ],
  },
  {
    slug: "segmented", name: "Segmented", manifest: "segmented",
    api: [["options", "{ value: string; label: ReactNode; icon?: ReactNode; disabled?: boolean }[]", "—"], ["value", "string", "—"], ["label", "string (accessible group name)", "—"], ["onSelect", "(value: string) => void", "—"], ["size", '"xs" | "sm" | "md" | "lg" | "xl"', '"md"'], ["fullWidth", "boolean", "false"]],
    examples: [
      { id: "default", title: "Default", note: "A controlled presentation. In an application, update value from onSelect. Complete radio-group arrow-key navigation is still pending.", demo: "GallerySegmented" },
      { id: "sizes", title: "Sizes", demo: "SegmentedSizes" },
      { id: "full-width", title: "Full width and disabled option", demo: "SegmentedFullWidth" },
    ],
  },
  {
    slug: "button",
    name: "Button",
    manifest: "button",
    api: [
      ["variant", '"solid" | "soft" | "outline" | "ghost"', '"solid"'],
      ["tone", "ButtonTone (8 values)", '"neutral"'],
      ["size", '"xs" | "sm" | "md" | "lg" | "xl"', '"md"'],
      ["icon", "ReactNode", "—"],
      ["trailingIcon", "ReactNode", "—"],
      ["pill", "boolean", "false"],
      ["align", '"start" | "end"', "—"],
      ["selected", "boolean", "false"],
      ["loading", "boolean", "false"],
      ["iconOnly", "boolean", "false"],
      ["fullWidth", "boolean", "false"],
      ["disabled", "boolean", "false"],
    ],
    examples: [
      { id: "default", title: "Default", demo: "ButtonDefault" },
      {
        id: "variants",
        title: "Variants",
        note: "Use the variant prop to change the fill treatment.",
        demo: "ButtonVariants",
      },
      {
        id: "tones",
        title: "Tones",
        note: "Eight tones. Neutral carries no hue and is the default \u2014 a near-black button is the strongest call to action a neutral palette can make, and it stays strongest whatever the accent axis is set to. Accent is reserved for moments that are genuinely about identity.",
        demo: "ButtonTones",
      },
      {
        id: "matrix",
        title: "Tones and variants",
        note: "Every tone works with every variant, because a tone repoints slots and a variant decides which it reads.",
        demo: "ButtonToneMatrix",
      },
      {
        id: "pill",
        title: "Pill",
        note: "Set pill for a fully round button.",
        demo: "ButtonPill",
      },
      {
        id: "selected",
        title: "Selected",
        note: "Set selected for a toggle that is currently on. It sets aria-pressed.",
        demo: "ButtonSelected",
      },
      { id: "sizes", title: "Sizes", note: "Use the size prop to change the size of the button.", demo: "ButtonSizes" },
      {
        id: "icon",
        title: "With icon",
        note: "Pass an icon to place a glyph before or after the label.",
        demo: "ButtonWithIcon",
      },
      {
        id: "icon-only",
        title: "Icon only",
        note: "Set iconOnly for a square button. It requires an aria-label.",
        demo: "ButtonIconOnly",
      },
      {
        id: "loading",
        title: "Loading",
        note: "Set loading to replace the leading icon with a spinner and disable the button.",
        demo: "ButtonLoading",
      },
      { id: "disabled", title: "Disabled", demo: "ButtonDisabled" },
    ],
  },
  {
    slug: "input",
    name: "Input",
    manifest: "input",
    api: [
      ["size", '"xs" | "sm" | "md" | "lg" | "xl"', '"md"'],
      ["icon", "ReactNode", "—"],
      ["prefix", "ReactNode", "—"],
      ["suffix", "ReactNode", "—"],
      ["invalid", "boolean", "false"],
      ["disabled", "boolean", "false"],
    ],
    examples: [
      { id: "default", title: "Default", demo: "InputDefault" },
      { id: "icon", title: "With icon", note: "Pass an icon to categorise the field.", demo: "InputWithIcon" },
      {
        id: "affix",
        title: "With affix",
        note: "Use prefix and suffix for units and symbols that are not editable.",
        demo: "InputWithAffix",
      },
      { id: "sizes", title: "Sizes", demo: "InputSizes" },
      { id: "invalid", title: "Invalid", note: "Set invalid to show the error treatment.", demo: "InputInvalid" },
    ],
  },
  {
    slug: "field",
    name: "Field",
    manifest: "field",
    api: [
      ["label", "ReactNode", "—"],
      ["description", "ReactNode", "—"],
      ["error", "ReactNode", "—"],
      ["required", "boolean", "false"],
      ["htmlFor", "string", "—"],
      ["inline", "boolean", "false"],
    ],
    examples: [
      { id: "default", title: "Default", demo: "FieldDefault" },
      { id: "inline", title: "Inline", demo: "FieldInline" },
      {
        id: "error",
        title: "Error",
        note: "Passing error replaces the description, so the two never compete.",
        demo: "FieldError",
      },
    ],
  },
  {
    slug: "textarea",
    name: "Textarea",
    manifest: "textarea",
    api: [
      ["size", '"sm" | "md" | "lg"', '"md"'],
      ["invalid", "boolean", "false"],
      ["rows", "number", "—"],
    ],
    examples: [{ id: "default", title: "Default", demo: "TextareaDefault" }],
  },
  {
    slug: "select",
    name: "Select",
    manifest: "select",
    api: [["size", '"xs" | "sm" | "md" | "lg" | "xl"', '"md"']],
    examples: [{ id: "default", title: "Default", demo: "SelectDefault" }],
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    manifest: "checkbox",
    api: [
      ["size", '"sm" | "md" | "lg"', '"md"'],
      ["label", "ReactNode", "—"],
      ["description", "ReactNode", "—"],
      ["defaultChecked", "boolean", "false"],
    ],
    examples: [
      { id: "default", title: "Default", demo: "CheckboxDefault" },
      { id: "description", title: "With description", demo: "CheckboxDescription" },
    ],
  },
  {
    slug: "radio",
    name: "Radio",
    manifest: "radio",
    api: [
      ["size", '"sm" | "md" | "lg"', '"md"'],
      ["label", "ReactNode", "—"],
      ["name", "string", "—"],
    ],
    examples: [{ id: "default", title: "Default", demo: "RadioDefault" }],
  },
  {
    slug: "switch",
    name: "Switch",
    manifest: "switch",
    api: [
      ["size", '"xs" | "sm" | "md" | "lg"', '"md"'],
      ["label", "ReactNode", "—"],
      ["defaultChecked", "boolean", "false"],
    ],
    examples: [{ id: "default", title: "Default", demo: "SwitchDefault" }],
  },

  {
    slug: "slider",
    name: "Slider",
    manifest: "slider",
    api: [
      ["size", '"xs" | "sm" | "md" | "lg" | "xl"', '"md"'],
      ["min", "number", "0"],
      ["max", "number", "100"],
      ["readout", "ReactNode", "—"],
      ["disabled", "boolean", "false"],
    ],
    examples: [
      { id: "default", title: "Default", demo: "SliderDefault" },
      { id: "sizes", title: "Sizes", demo: "SliderSizes" },
      { id: "bare", title: "Without a readout", demo: "SliderBare" },
    ],
  },
  {
    slug: "chip",
    name: "Chip",
    manifest: "chip",
    api: [
      ["size", '"xs" | "sm" | "md" | "lg" | "xl"', '"sm"'],
      ["selected", "boolean", "false"],
      ["swatch", "string", "—"],
      ["swatchOnly", "boolean", "false"],
      ["pill", "boolean", "false"],
      ["icon", "ReactNode", "—"],
    ],
    examples: [
      { id: "default", title: "Default", demo: "ChipDefault" },
      { id: "swatches", title: "With swatches", demo: "ChipSwatches" },
      { id: "sizes", title: "Sizes", demo: "ChipSizes" },
    ],
  },
  {
    slug: "badge",
    name: "Badge",
    manifest: "badge",
    api: [
      ["tone", '"neutral" | "accent" | "danger" | "warning" | "success"', '"neutral"'],
      ["variant", '"solid" | "outline"', "—"],
      ["dot", "boolean", "false"],
    ],
    examples: [
      { id: "default", title: "Default", demo: "BadgeDefault" },
      { id: "tones", title: "Tones", demo: "BadgeTones" },
      { id: "variants", title: "Variants", demo: "BadgeVariants" },
    ],
  },
  {
    slug: "avatar",
    name: "Avatar",
    manifest: "avatar",
    api: [
      ["size", '"xs" | "sm" | "md" | "lg" | "xl"', '"md"'],
      ["shape", '"square"', "—"],
      ["src", "string", "—"],
      ["fallback", "ReactNode", "—"],
    ],
    examples: [
      { id: "default", title: "Default", demo: "AvatarDefault" },
      { id: "sizes", title: "Sizes", demo: "AvatarSizes" },
    ],
  },
  {
    slug: "panel",
    name: "Panel",
    manifest: "panel",
    api: [
      ["size", '"xs" | "sm" | "md" | "lg"', '"md"'],
      ["title", "ReactNode", "—"],
      ["action", "ReactNode", "—"],
      ["footer", "ReactNode", "—"],
      ["flush", "boolean", "false"],
    ],
    examples: [
      {
        id: "default",
        title: "Every control",
        note: "One panel, one tier. Select, segmented, chip, slider and input all sit on sm, so any one of them rendering at a different height shows up as a ragged edge rather than as a number in a table.",
        demo: "PanelEverything",
      },
    ],
  },
  {
    slug: "card",
    name: "Card",
    manifest: "card",
    api: [["className", "string", "—"]],
    examples: [{ id: "default", title: "Default", demo: "CardDefault" }],
  },
  {
    slug: "alert",
    name: "Alert",
    manifest: "alert",
    api: [
      ["tone", '"info" | "danger" | "warning" | "success"', '"info"'],
      ["icon", "ReactNode", "—"],
      ["title", "ReactNode", "—"],
    ],
    examples: [
      { id: "default", title: "Default", demo: "AlertDefault" },
      {
        id: "tones",
        title: "Tones",
        note: "Only the danger tone uses role=alert; the rest use role=status.",
        demo: "AlertTones",
      },
    ],
  },
  {
    slug: "separator",
    name: "Separator",
    manifest: "separator",
    api: [["orientation", '"horizontal" | "vertical"', '"horizontal"']],
    examples: [{ id: "default", title: "Default", demo: "SeparatorDefault" }],
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    manifest: "skeleton",
    api: [["shape", '"text" | "circle"', "—"]],
    examples: [{ id: "default", title: "Default", demo: "SkeletonDefault" }],
  },
  {
    slug: "spinner",
    name: "Spinner",
    manifest: "spinner",
    api: [
      ["size", '"sm" | "md" | "lg"', '"md"'],
      ["label", "string", "—"],
    ],
    examples: [{ id: "default", title: "Default", demo: "SpinnerDefault" }],
  },
  {
    slug: "progress",
    name: "Progress",
    manifest: "progress",
    api: [
      ["value", "number", "—"],
      ["max", "number", "100"],
      ["label", "string", "—"],
    ],
    examples: [
      { id: "default", title: "Default", demo: "ProgressDefault" },
      {
        id: "indeterminate",
        title: "Indeterminate",
        note: "Omit value when the duration is unknown.",
        demo: "ProgressIndeterminate",
      },
    ],
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    manifest: "tooltip",
    api: [["className", "string", "—"]],
    examples: [{ id: "default", title: "Default", demo: "TooltipDefault" }],
  },
  {
    slug: "menu",
    name: "Menu",
    manifest: "menu",
    api: [
      ["layout", '"inline"', "—"],
      ["selection", '"marker"', "—"],
      ["MenuItem.tone", '"danger"', "—"],
      ["MenuItem.shortcut", "ReactNode", "—"],
      ["MenuItem.disabled", "boolean", "false"],
    ],
    examples: [
      { id: "default", title: "Default", demo: "MenuDefault" },
      { id: "shortcuts", title: "With shortcuts", demo: "MenuWithShortcuts" },
    ],
  },
  {
    slug: "popover",
    name: "Popover",
    manifest: "popover",
    api: [["className", "string", "—"]],
    examples: [{ id: "default", title: "Default", demo: "PopoverDefault" }],
  },
  {
    slug: "toast",
    name: "Toast",
    manifest: "toast",
    api: [
      ["tone", '"info" | "danger" | "warning" | "success"', '"info"'],
      ["icon", "ReactNode", "—"],
    ],
    examples: [{ id: "default", title: "Default", demo: "ToastDefault" }],
  },
  {
    slug: "tabs",
    name: "Tabs",
    manifest: "tabs",
    api: [
      ["tabs", "{ id, label, disabled? }[]", "—"],
      ["value", "string", "—"],
    ],
    examples: [
      {
        id: "default",
        title: "Default",
        note: "The active indicator is the foreground colour, not the accent, so tabs never read as buttons.",
        demo: "TabsDefault",
      },
    ],
  },
  {
    slug: "dialog",
    name: "Dialog",
    manifest: "dialog",
    api: [
      ["title", "ReactNode", "—"],
      ["description", "ReactNode", "—"],
      ["footer", "ReactNode", "—"],
    ],
    examples: [
      {
        id: "default",
        title: "Default",
        note: "In an application, render this inside a native dialog and open it with showModal().",
        demo: "DialogDefault",
      },
    ],
  },
  {
    slug: "token",
    name: "Token",
    manifest: "tokenChip",
    api: [
      ["swatch", "string", "\u2014"],
      ["subtle", "boolean", "false"],
      ["onColor", "boolean", "false"],
    ],
    practices: [
      "One size, everywhere. The badge carries the caption size rather than the UI size so it sits inside 14px table chrome and 16px running prose without having been set for either \u2014 which is why there is no size prop.",
      "Inline code shares the badge's ground, stroke and size. A tone name written in a paragraph and the same name written in a table are the same kind of reference, and styling them differently implies a distinction that is not there.",
      "Pass <code class='area-code'>swatch</code> a <code class='area-code'>var()</code>, never a hex. A literal shows what the token meant when the page was written; the variable tracks the axes like everything else.",
      "The swatch is a rounded square, never a circle. A circle reads as a status dot \u2014 something with a state \u2014 where this is a sample of a colour. Its radius is concentric with the badge's: the badge's corner less the padding it is inset by.",
      "Reach for <code class='area-code'>subtle</code> when the token names something derived rather than primitive, so a semantic alias and the rung it resolves to are told apart at a glance.",
    ],
    examples: [
      { id: "default", title: "Default", demo: "TokenDefault" },
      {
        id: "swatch",
        title: "With a swatch",
        note: "Use the swatch prop where the token resolves to a colour.",
        demo: "TokenSwatch",
      },
      {
        id: "prose",
        title: "In prose",
        note: "The badge is sized to read the same inside running copy as it does inside a table.",
        demo: "TokenInProse",
      },
      {
        id: "subtle",
        title: "Subtle",
        note: "Use the subtle prop for a token that names something derived rather than primitive.",
        demo: "TokenSubtle",
      },
    ],
  },
  {
    slug: "kbd",
    name: "Kbd",
    manifest: "kbd",
    api: [
      ["keys", "string[]", "—"],
      ["quiet", "boolean", "false"],
    ],
    practices: [
      "Pass <code class='area-code'>keys</code> as names, not glyphs. <code class='area-code'>cmd</code>, <code class='area-code'>shift</code>, <code class='area-code'>alt</code>, <code class='area-code'>ctrl</code> and the arrows render as symbols automatically.",
      "One element per key, never one element reading <code class='area-code'>⌘K</code>. A shortcut is a sequence of physical keys, and a screen reader reads a bare glyph as nothing at all — the component supplies a spoken label for the whole group.",
      "Use <code class='area-code'>quiet</code> inside a menu item, where the key is chrome rather than content. The filled form is for running text and empty states.",
      "A key is a rounded rectangle, never a pill. The shape is most of what makes it read as a key.",
    ],
    examples: [
      { id: "default", title: "Default", demo: "KbdDefault" },
      { id: "sequence", title: "Sequences", note: "Modifier names become glyphs; everything else is uppercased.", demo: "KbdSequence" },
      { id: "in-menu", title: "In a menu", note: "Use the quiet form where the key labels an action rather than standing alone.", demo: "MenuWithShortcuts" },
    ],
  },
  {
    slug: "nav",
    name: "Nav",
    manifest: "nav",
    api: [
      ["orientation", '"vertical" | "horizontal"', '"vertical"'],
      ["tone", '"neutral" | "accent"', '"neutral"'],
      ["current", "boolean", "false"],
      ["icon", "ReactNode", "\u2014"],
      ["trailing", "ReactNode", "\u2014"],
      ["disabled", "boolean", "false"],
    ],
    practices: [
      "Mark the current page with <code class='area-code'>current</code>, not with a class. It renders <code class='area-code'>aria-current=\"page\"</code>, which is both what the CSS selects on and what a screen reader announces \u2014 so an item cannot look current without being current.",
      "Label every nav. Two or three <code class='area-code'>&lt;nav&gt;</code> landmarks on one page are indistinguishable without <code class='area-code'>aria-label</code>, and a sidebar plus a top bar is the common case.",
      "Group vertically, never horizontally. A group label needs a line of its own, which a horizontal nav does not have.",
      "Let long labels truncate. The row reserves space for the icon and anything trailing and gives the rest to the label, so a long document title shortens instead of wrapping the row to two lines.",
      "Reach for <code class='area-code'>tone=\"accent\"</code> only where the nav is the page's primary structure. On a sidebar beside accent-coloured content it competes.",
    ],
    examples: [
      { id: "default", title: "Default", demo: "NavDefault" },
      {
        id: "vertical",
        title: "Vertical",
        note: "The sidebar case: labelled groups, leading icons, and a trailing slot for a count or a shortcut.",
        demo: "NavVertical",
      },
      {
        id: "horizontal",
        title: "Horizontal",
        note: "Use the orientation prop to lay the same markup along the inline axis. It scrolls rather than wraps, so the chrome cannot change height.",
        demo: "NavHorizontal",
      },
      {
        id: "accent",
        title: "Accent",
        note: "Use the tone prop to carry the accent hue on the current item instead of the neutral.",
        demo: "NavAccent",
      },
      { id: "disabled", title: "Disabled", demo: "NavDisabled" },
    ],
  },
  {
    slug: "table",
    name: "Table",
    manifest: "table",
    api: [["interactive", "boolean", "false"]],
    examples: [{ id: "default", title: "Default", demo: "TableDefault" }],
  },
].sort((a, b) => a.name.localeCompare(b.name, "en"));
