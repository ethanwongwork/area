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

const PilotBlocksPyramidJoinedIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2 12L2 10A1.5 1.5 0 0 1 3.5 8.5L5 8.5L5 4A1.5 1.5 0 0 1 6.5 2.5L9.5 2.5A1.5 1.5 0 0 1 11 4L11 8.5L12.5 8.5A1.5 1.5 0 0 1 14 10L14 12A1.5 1.5 0 0 1 12.5 13.5L3.5 13.5A1.5 1.5 0 0 1 2 12Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 8.5H11M8 8.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 8.5H11M8 8.5V16" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotBlocksPyramidIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="2" y="9" width="5" height="5" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="9" y="9" width="5" height="5" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="5.5" y="2" width="5" height="5" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotToyBrickLegoIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.553 7.224L3.5 6.75V5.25A1.5 0.75 0 0 1 6.5 5.25L7.5 4.75V3.75A1.5 0.75 0 0 1 10.5 3.75L13.447 5.224A1 1 0 0 1 14 6.118L14 8.882A1 1 0 0 1 13.447 9.776L6.894 13.053A2 2 0 0 1 5.106 13.053L2.553 11.776A1 1 0 0 1 2 10.882L2 8.118A1 1 0 0 1 2.553 7.224Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.149 7.592L6 9.5L13.851 5.592M6 9.5V13.264" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M-2 5.5L6 9.5L16 4.5M6 9.5V16.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const EXPLORE: readonly ExploreCandidate[] = [
  { group: "agent", label: "current: Fluent’s agents hexagon", Icon: PilotAgentCurrentIcon, gaps: [], counters: [], notes: [] },
  { group: "agent", label: "Cursor’s agent mark: infinity", Icon: PilotAgentInfinityIcon, gaps: [], counters: [3.88,3.88], notes: [] },
  { group: "blocks-redo", label: "pyramid as one outline, shared edges as layer lines", Icon: PilotBlocksPyramidJoinedIcon, gaps: [], counters: [4.93,3.93,3.93], notes: [] },
  { group: "blocks-redo", label: "three separate blocks stacked as a pyramid (Hugeicons)", Icon: PilotBlocksPyramidIcon, gaps: ["0.88 detail","1.1 detail","1.1 detail"], counters: [3.93,3.93,3.93], notes: [] },
  { group: "toy-brick-redo", label: "lego brick in the cube’s 2:1 dimetric, studs as bumps on the back edges", Icon: PilotToyBrickLegoIcon, gaps: [], counters: [3.09,2.57,2.57], notes: [] },
];
