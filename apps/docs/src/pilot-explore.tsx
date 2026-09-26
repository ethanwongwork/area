/** Area icon candidates under review, generated from apps/docs/assets/area-icons-pilot/explore
 * by scripts/gen-pilot-icons.mjs. Do not edit by hand. Each carries its lint measurements. */
import type { ReactElement } from "react";
import { sw, type PilotIconProps } from "./pilot-icons.tsx";

export type ExploreCandidate = {
  group: string; label: string; Icon: (props: PilotIconProps) => ReactElement;
  gaps: readonly string[]; counters: readonly number[]; notes: readonly string[];
};

const base = { viewBox: "0 0 16 16", width: 16, height: 16, fill: "none", "aria-hidden": true, focusable: false } as const;

const PilotF4SharpFluentIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5.5 1.5L10.5 1.5L9.25 6L12.5 6L5 14.5L6.5 9L3.5 9Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotF5ClassicIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6 1.5L11 1.5L8.5 6.5L12.5 6.5L5.5 14.5L7 9L3.5 9Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotH0SlashIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M1.5 8C3.25 4.75 5.5 3.5 8 3.5C10.5 3.5 12.75 4.75 14.5 8C12.75 11.25 10.5 12.5 8 12.5C5.5 12.5 3.25 11.25 1.5 8Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 3L13 13" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotH1ClosedIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M1.5 6.5C3.5 10.5 12.5 10.5 14.5 6.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 9.5V12M4.5 8.912L3 10.662M11.5 8.912L13 10.662" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotH2SlashCutIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M1.5 8C3.25 4.75 5.5 3.5 8 3.5C9 3.5 9.9 3.7 10.8 4.1" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.9 5.6C13.5 6.3 14 7.1 14.5 8C12.75 11.25 10.5 12.5 8 12.5C7 12.5 6.1 12.3 5.2 11.9" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.1 10.4C2.5 9.7 2 8.9 1.5 8" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 3L13 13" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotK0BookVIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M8 4.5C6.5 3.4 5 3 3 3A1.5 1.5 0 0 0 1.5 4.5V10A1.5 1.5 0 0 0 3 11.5C5 11.5 6.5 11.9 8 13Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 4.5C9.5 3.4 11 3 13 3A1.5 1.5 0 0 1 14.5 4.5V10A1.5 1.5 0 0 1 13 11.5C11 11.5 9.5 11.9 8 13Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 4.5V13" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotL3FluentCardsIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <rect x="6.5" y="6.5" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 9V5.5A1.5 1.5 0 0 1 5.5 4H9" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.5 6.5V3A1.5 1.5 0 0 1 3 1.5H6.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotR1BigIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M7.293 7.207A1 1 0 0 1 8.707 7.207L11.293 9.793A1 1 0 0 1 11.293 11.207L8.707 13.793A1 1 0 0 1 7.293 13.793L4.707 11.207A1 1 0 0 1 4.707 9.793Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 4.5A6.364 6.364 0 0 1 12.5 4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.5 1.5V4.5H9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotR2StandardIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M7.293 8.057A1 1 0 0 1 8.707 8.057L10.793 10.143A1 1 0 0 1 10.793 11.557L8.707 13.643A1 1 0 0 1 7.293 13.643L5.207 11.557A1 1 0 0 1 5.207 10.143Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 5A6.364 6.364 0 0 1 12.5 5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.5 2V5H9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotR3MidIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M7.293 8.207A1 1 0 0 1 8.707 8.207L10.793 10.293A1 1 0 0 1 10.793 11.707L8.707 13.793A1 1 0 0 1 7.293 13.793L5.207 11.707A1 1 0 0 1 5.207 10.293Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 5A5.657 5.657 0 0 1 12 5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 2V5H9" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotR4TightIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M7.293 8.207A1 1 0 0 1 8.707 8.207L10.793 10.293A1 1 0 0 1 10.793 11.707L8.707 13.793A1 1 0 0 1 7.293 13.793L5.207 11.707A1 1 0 0 1 5.207 10.293Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 5A4.95 4.95 0 0 1 11.5 5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.5 2V5H8.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotR5ShortTailIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M7.293 7.207A1 1 0 0 1 8.707 7.207L11.293 9.793A1 1 0 0 1 11.293 11.207L8.707 13.793A1 1 0 0 1 7.293 13.793L4.707 11.207A1 1 0 0 1 4.707 9.793Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.787 5.35A6.364 6.364 0 0 1 12.5 4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.5 1.5V4.5H9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
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
  { group: "Flash", label: "Sharp: Fluent structure", Icon: PilotF4SharpFluentIcon, gaps: [], counters: [4], notes: [] },
  { group: "Flash", label: "Applied: sharp classic bolt", Icon: PilotF5ClassicIcon, gaps: [], counters: [3.24], notes: [] },
  { group: "Hide", label: "Previous: eye with a slash", Icon: PilotH0SlashIcon, gaps: [], counters: [4.11,4.11], notes: [] },
  { group: "Hide", label: "Applied: closed eye (Figma, Notion)", Icon: PilotH1ClosedIcon, gaps: [], counters: [], notes: [] },
  { group: "Hide", label: "Eye with a slash, lids cut (Lucide)", Icon: PilotH2SlashCutIcon, gaps: ["1.46 tight","1.46 tight","3.47 open"], counters: [], notes: [] },
  { group: "Book", label: "Previous: pages dip to the spine (V)", Icon: PilotK0BookVIcon, gaps: [], counters: [5.43,5.43], notes: [] },
  { group: "Layers", label: "Fluent-style diagonal cards (three sheets)", Icon: PilotL3FluentCardsIcon, gaps: ["1.38 tight","3.88 open","1.38 tight"], counters: [5.93], notes: [] },
  { group: "Rotate", label: "A (too tall, 13.7): big square, wide arc (r 6.36)", Icon: PilotR1BigIcon, gaps: ["3.15 open","1.6 tight"], counters: [4.53], notes: ["ink 10.13×13.71 exceeds the square keyline 13×13"] },
  { group: "Rotate", label: "Applied, B: corner head on the diagonal, standard gaps", Icon: PilotR2StandardIcon, gaps: ["3.5 open","1.93 standard"], counters: [3.86], notes: [] },
  { group: "Rotate", label: "C: arc r 5.66, square 7", Icon: PilotR3MidIcon, gaps: ["3.45 open","1.91 standard"], counters: [3.82], notes: [] },
  { group: "Rotate", label: "D: tighter arc r 4.95", Icon: PilotR4TightIcon, gaps: ["3.13 open","1.82 standard"], counters: [3.82], notes: [] },
  { group: "Rotate", label: "E: big square, shorter tail", Icon: PilotR5ShortTailIcon, gaps: ["3.15 open","1.6 tight"], counters: [4.53], notes: ["ink 10.84×13.71 exceeds the square keyline 13×13"] },
  { group: "Text", label: "Previous: letter A (49° apex)", Icon: PilotT0AIcon, gaps: [], counters: [3.02], notes: ["corner at 8,2.5 is 48.89°; below 60° round it with an arc (r ≥ 1) or open the angle"] },
  { group: "Text", label: "Applied: T with ticks and a foot", Icon: PilotT1TTicksIcon, gaps: [], counters: [], notes: [] },
  { group: "Text", label: "Plain T", Icon: PilotT2TPlainIcon, gaps: [], counters: [], notes: [] },
  { group: "Text", label: "T in a text box", Icon: PilotT3TBoxIcon, gaps: ["1.88 standard"], counters: [5.43], notes: ["ink 14.13×12.13 exceeds the square keyline 13×13"] },
];
