/** Area icon candidates under review, generated from apps/docs/assets/area-icons-pilot/explore
 * by scripts/gen-pilot-icons.mjs. Do not edit by hand. Each carries its lint measurements. */
import type { ReactElement } from "react";
import { sw, type PilotIconProps } from "./pilot-icons.tsx";

export type ExploreCandidate = {
  group: string; label: string; Icon: (props: PilotIconProps) => ReactElement;
  gaps: readonly string[]; counters: readonly number[]; notes: readonly string[];
};

const base = { viewBox: "0 0 16 16", width: 16, height: 16, fill: "none", "aria-hidden": true, focusable: false } as const;

const PilotF0PreviousIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M 6.757 2.649 A 1 1 0 0 1 7.693 2 L 10.523 2 A 1 1 0 0 1 11.451 3.371 L 10.411 5.971 A 0.75 0.75 0 0 0 11.108 7 L 10.899 7 A 1 1 0 0 1 11.675 8.631 L 8.03 13.117 A 1 1 0 0 1 6.259 12.586 L 6.068 10.675 A 0.75 0.75 0 0 0 5.321 10 L 5.443 10 A 1 1 0 0 1 4.507 8.649 Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotF1FluentIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5.983 3.021A0.75 0.75 0 0 1 6.697 2.5L10.035 2.5A0.75 0.75 0 0 1 10.771 3.397L10.27 5.902A0.5 0.5 0 0 0 10.76 6.5L11.094 6.5A0.75 0.75 0 0 1 11.657 7.745L6.636 13.466A0.75 0.75 0 0 1 5.334 12.837L5.743 10.589A0.5 0.5 0 0 0 5.251 10L4.777 10A0.75 0.75 0 0 1 4.063 9.021Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotL0CurrentIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M7.553 3.474A1 1 0 0 1 8.447 3.474L12.211 5.356A1 1 0 0 1 12.211 7.144L8.447 9.026A1 1 0 0 1 7.553 9.026L3.789 7.144A1 1 0 0 1 3.789 5.356Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 9.604L8 12.604L14 9.604" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotL1ThreeIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M7.553 2.724A1 1 0 0 1 8.447 2.724L11.211 4.106A1 1 0 0 1 11.211 5.894L8.447 7.276A1 1 0 0 1 7.553 7.276L4.789 5.894A1 1 0 0 1 4.789 4.106Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 7.963L8 10.463L13 7.963" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 10.926L8 13.426L13 10.926" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotL2StackIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="5" y="2.5" width="8.5" height="7" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 6V11.5A2 2 0 0 0 4.5 13.5H10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotT0AIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3 13.5L8 2.5L13 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.818 9.5H11.182" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotT1TTicksIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3 4.5V2.5H13V4.5M8 2.5V13.5M6 13.5H10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotT2TPlainIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3 2.5H13M8 2.5V13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotT3TBoxIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5 5.5H11M8 5.5V10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="1.5" y="2.5" width="13" height="11" rx="2" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const EXPLORE: readonly ExploreCandidate[] = [
  { group: "Flash", label: "Previous: flat top, filleted", Icon: PilotF0PreviousIcon, gaps: [], counters: [4.89], notes: [] },
  { group: "Flash", label: "Applied: Fluent proportions", Icon: PilotF1FluentIcon, gaps: [], counters: [5.06], notes: [] },
  { group: "Layers", label: "Current: diamond over one layer", Icon: PilotL0CurrentIcon, gaps: ["1.88 standard"], counters: [4.25], notes: [] },
  { group: "Layers", label: "Three layers (Lucide, Material)", Icon: PilotL1ThreeIcon, gaps: ["1.53 tight","4.18 open","1.53 tight"], counters: [3.36], notes: [] },
  { group: "Layers", label: "Stacked cards (Figma-like panels)", Icon: PilotL2StackIcon, gaps: ["1.38 tight"], counters: [5.93], notes: [] },
  { group: "Text", label: "Previous: letter A (49° apex)", Icon: PilotT0AIcon, gaps: [], counters: [3.02], notes: ["corner at 8,2.5 is 48.89°; below 60° round it with an arc (r ≥ 1) or open the angle"] },
  { group: "Text", label: "Applied: T with ticks and a foot", Icon: PilotT1TTicksIcon, gaps: [], counters: [], notes: [] },
  { group: "Text", label: "Plain T", Icon: PilotT2TPlainIcon, gaps: [], counters: [], notes: [] },
  { group: "Text", label: "T in a text box", Icon: PilotT3TBoxIcon, gaps: ["1.88 standard"], counters: [5.43], notes: ["ink 14.13×12.13 exceeds the square keyline 13×13"] },
];
