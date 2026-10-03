/** Area icon candidates under review, generated from apps/docs/assets/area-icons-pilot/explore
 * by scripts/gen-pilot-icons.mjs. Do not edit by hand. Each carries its lint measurements. */
import type { ReactElement } from "react";
import { sw, type PilotIconProps } from "./pilot-icons.tsx";

export type ExploreCandidate = {
  group: string; label: string; Icon: (props: PilotIconProps) => ReactElement;
  gaps: readonly string[]; counters: readonly number[]; notes: readonly string[];
};

const base = { viewBox: "0 0 16 16", width: 16, height: 16, fill: "none", "aria-hidden": true, focusable: false } as const;

const PilotAgentCurrentIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M7.5 2.5H4.5L2 8L4.5 13.5H5.5L10.5 2.5H11.5L14 8L11.5 13.5H8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotAgentInfinityIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 8L9.715 6.251A2.5 2.5 0 1 1 9.715 9.749L6.285 6.251A2.5 2.5 0 1 0 6.285 9.749Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const EXPLORE: readonly ExploreCandidate[] = [
  { group: "agent", label: "current: Fluent’s agents hexagon", Icon: PilotAgentCurrentIcon, gaps: [], counters: [], notes: [] },
  { group: "agent", label: "Cursor’s agent mark: infinity", Icon: PilotAgentInfinityIcon, gaps: [], counters: [3.88,3.88], notes: [] },
];
