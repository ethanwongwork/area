/**
 * @area/react
 *
 * Contains no CSS, by construction. Import the stylesheet separately:
 *
 *   import "@area/styles/area.css";
 *
 * Keeping the two packages physically separate is what stops the React API and the
 * stylesheet drifting: React cannot add a style, so it cannot add one the CSS does not
 * know about.
 */
export { Button, type ButtonProps } from "./components/Button.tsx";
export { ButtonGroup, type ButtonGroupProps } from "./components/ButtonGroup.tsx";
export { Input, InputAction, type InputProps, type InputActionProps } from "./components/Input.tsx";
export { NumberField, type NumberFieldProps } from "./components/NumberField.tsx";
export { InputGroup, InputGroupText, type InputGroupProps, type InputGroupTextProps } from "./components/InputGroup.tsx";
export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis, type BreadcrumbSeparatorProps } from "./components/Breadcrumb.tsx";
export { Toolbar, ToolbarItem, ToolbarGroup, ToolbarSeparator, ToolbarOverflow, type ToolbarProps, type ToolbarItemProps, type ToolbarOverflowProps } from "./components/Toolbar.tsx";
export { AlignmentPicker, ALIGNMENT_POSITIONS, type AlignmentPickerProps, type AlignmentPosition } from "./components/AlignmentPicker.tsx";
export { ColorSwatch, type ColorSwatchProps } from "./components/ColorSwatch.tsx";
export { ColorSwatchPicker, type ColorSwatchPickerProps, type ColorSwatchOption } from "./components/ColorSwatchPicker.tsx";
export { ColorField, normalizeHexColor, type ColorFieldProps } from "./components/ColorField.tsx";
export { TreeView, type TreeViewProps, type TreeViewNode } from "./components/TreeView.tsx";
export { Composer, type ComposerProps } from "./components/Composer.tsx";
export { Field, Label, type FieldProps, type LabelProps } from "./components/Field.tsx";
export {
  Nav,
  NavGroup,
  NavItem,
  NavSeparator,
  type NavProps,
  type NavGroupProps,
  type NavItemProps,
} from "./components/Nav.tsx";
export * from "./components/primitives.tsx";
export { computePosition } from "./components/overlay.ts";
export type { OverlayAlign, OverlaySide, Position, PositionOptions } from "./components/overlay.ts";
export * from "./components/forms.tsx";
export * from "./variants.ts";

export { Theme, useTheme, type ThemeProps, type AxisSelection } from "./components/Theme.tsx";

export { Badge, type BadgeProps } from "./components/Badge.tsx";
export { BadgeGroup, type BadgeGroupProps } from "./components/BadgeGroup.tsx";
export { Indicator, IndicatorAnchor, type IndicatorProps, type IndicatorAnchorProps } from "./components/Indicator.tsx";

export { ColorPicker, hexToHsv, hsvToHex, type ColorPickerProps, type ColorModel, type ColorView } from "./components/ColorPicker.tsx";
export { AREA_COLOR_GRID } from "./components/color-grid.ts";
export { Calendar, type CalendarProps, type CalendarRange } from "./components/Calendar.tsx";

export { Presence, type PresenceProps } from "./components/Presence.tsx";
