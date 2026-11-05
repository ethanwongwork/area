/** Types for screens.jsx, which the app's Illustrations page draws (apps/desktop/src/pages/illustrations.tsx). */
import type { ComponentType } from "react";
type Set = Record<string, [label: string, Screen: ComponentType]>;
export const DESKTOP: Set;
export const MOBILE: Set;
export const ISOLATED: Set;
