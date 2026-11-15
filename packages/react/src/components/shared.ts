/**
 * Shared by the presentational components split from one module (Avatar.tsx … Kbd.tsx).
 *
 * Thin by design: each one places elements and forwards props, and contributes no styling
 * of its own. Every appearance decision lives in `@area/styles`, which is what lets a
 * consumer use the CSS without React and get an identical result.
 */
import type { HTMLAttributes } from "react";
/** The empty collection, one reference so effects keyed on it stay still. */
export const NO_ITEMS: never[] = [];

export type Div = HTMLAttributes<HTMLDivElement>;
