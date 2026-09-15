"use client";

import { createContext, forwardRef, useContext, useMemo } from 'react';
import type { HTMLAttributes } from 'react';
import { DEFAULT_AXES, mergeAxes, themeAttributes } from '@area/tokens/config';
import type { AxisSelection } from '@area/tokens/config';

const ThemeContext = createContext<Readonly<AxisSelection>>(DEFAULT_AXES);
export interface ThemeProps extends HTMLAttributes<HTMLDivElement> {
  /** Omitted axes inherit from the nearest React Theme; a root Theme starts at defaults. */
  value?: Partial<AxisSelection>;
}
/** Complete attribute boundary, including when mounted through a React portal. */
export const Theme = /* @__PURE__ */ forwardRef<HTMLDivElement, ThemeProps>(function Theme(
  {value, children, ...props}, ref,
) {
  const parent=useContext(ThemeContext);
  const selection=useMemo(()=>mergeAxes(parent,value),[parent,value]);
  return <ThemeContext.Provider value={selection}>
    <div {...props} {...themeAttributes(selection)} ref={ref}>{children}</div>
  </ThemeContext.Provider>;
});

/** React scope selection. Raw DOM attributes outside Theme are not React context. */
export function useTheme(): Readonly<AxisSelection> {
  return useContext(ThemeContext);
}
export type { AxisSelection } from '@area/tokens/config';
