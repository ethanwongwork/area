/** Types for index.jsx: the gallery's kinds of UI and the families shown other than by their first specimen. */
import type { ReactNode } from "react";
export const KINDS: ReadonlyArray<[kind: string, slugs: string[]]>;
export const SHOW: Record<string, { layout?: string; cols?: number; ids?: string[]; node?: () => ReactNode; bleed?: string; open?: boolean }>;
