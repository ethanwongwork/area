/**
 * Page content.
 *
 * Each example names a demo from the registry. Nothing here contains markup or code
 * strings -- both come from the demo itself -- so a page can only ever describe examples
 * that actually exist, and a renamed demo fails the build rather than rendering a gap.
 */

export const COMPONENT_PAGES = [
  {
    slug: "button",
    name: "Button",
    manifest: "button",
    api: [
      ["variant", '"solid" | "soft" | "outline" | "ghost"', '"solid"'],
      ["tone", '"neutral" | "accent" | "danger"', '"accent"'],
      ["size", '"xs" | "sm" | "md" | "lg" | "xl"', '"md"'],
      ["icon", "ReactNode", "—"],
      ["trailingIcon", "ReactNode", "—"],
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
        note: "Use the tone prop to change which semantic scale the button draws from.",
        demo: "ButtonTones",
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
    ],
    examples: [
      { id: "default", title: "Default", demo: "FieldDefault" },
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
    api: [["size", '"sm" | "md" | "lg"', '"md"']],
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
      ["size", '"sm" | "md" | "lg"', '"md"'],
      ["label", "ReactNode", "—"],
      ["defaultChecked", "boolean", "false"],
    ],
    examples: [{ id: "default", title: "Default", demo: "SwitchDefault" }],
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
      ["tone", '"danger"', "—"],
      ["shortcut", "string", "—"],
      ["disabled", "boolean", "false"],
    ],
    examples: [{ id: "default", title: "Default", demo: "MenuDefault" }],
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
    slug: "table",
    name: "Table",
    manifest: "table",
    api: [["interactive", "boolean", "false"]],
    examples: [{ id: "default", title: "Default", demo: "TableDefault" }],
  },
];
