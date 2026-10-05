"use client";

import { createContext, forwardRef, useContext, useMemo } from 'react';
import type { HTMLAttributes } from 'react';
import { DEFAULT_AXES, mergeAxes, pillsAttribute, themeAttributes } from '@area/tokens/config';
import type { AxisSelection, PillShape } from '@area/tokens/config';

const ThemeContext = createContext<Readonly<AxisSelection>>(DEFAULT_AXES);
export interface ThemeProps extends HTMLAttributes<HTMLDivElement> {
  /** Omitted axes inherit from the nearest React Theme; a root Theme starts at defaults. */
  value?: Partial<AxisSelection>;
  /**
   * Which components draw a pill in this scope instead of the radius setting's corner; every other
   * pillable component follows the radius. Omitted inherits (defaults: badge, chip, count, switch,
   * avatar). `[]` makes every one follow the radius.
   */
  pills?: readonly PillShape[];
}
/** Complete attribute boundary, including when mounted through a React portal. */
export const Theme = /* @__PURE__ */ forwardRef<HTMLDivElement, ThemeProps>(function Theme(
  {value, pills, children, ...props}, ref,
) {
  const parent=useContext(ThemeContext);
  const selection=useMemo(()=>mergeAxes(parent,value),[parent,value]);
  return <ThemeContext.Provider value={selection}>
    <div {...props} {...themeAttributes(selection)} data-area-pills={pills ? pillsAttribute(pills) : undefined} ref={ref}>{children}</div>
  </ThemeContext.Provider>;
});

/** React scope selection. Raw DOM attributes outside Theme are not React context. */
export function useTheme(): Readonly<AxisSelection> {
  return useContext(ThemeContext);
}
export type { AxisSelection, PillShape } from '@area/tokens/config';
