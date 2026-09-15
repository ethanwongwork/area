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
export { Input, type InputProps } from "./components/Input.tsx";
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
export * from "./components/forms.tsx";
export * from "./variants.ts";

export { Theme, useTheme, type ThemeProps, type AxisSelection } from "./components/Theme.tsx";
