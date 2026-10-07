/** Area icon candidates under review, generated from apps/docs/assets/area-icons-pilot/explore
 * by scripts/gen-pilot-icons.mjs. Do not edit by hand. Each carries its lint measurements. */
import type { ReactElement } from "react";
import { sw, type PilotIconProps } from "./pilot-icons.tsx";

export type ExploreCandidate = {
  group: string; label: string; Icon: (props: PilotIconProps) => ReactElement;
  gaps: readonly string[]; counters: readonly number[]; notes: readonly string[];
};

const base = { viewBox: "0 0 16 16", width: 16, height: 16, fill: "none", "aria-hidden": true, focusable: false } as const;

const PilotFingerprintBoldIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 13V8A5.5 5.5 0 0 1 13.5 8V11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 12.5V8A3 3 0 0 1 11 8V13" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 8V14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotFingerprintFluentIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6.5 13V8.5A1.5 1.5 0 0 1 9.5 8.5V11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 12V8.5A4 4 0 0 1 6.965 4.636" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.035 4.636A4 4 0 0 1 12 8.5V9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 12V14" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.892 10.723A6.5 6.5 0 0 1 3.404 3.904" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.565 2.473A6.5 6.5 0 0 1 14.5 8.5V10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotFingerprintLeanIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M7.59 9.013A1.5 1.5 0 1 1 10.5 8.5V9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.723 10.794A4 4 0 1 1 12.864 7.465" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.721 6.818A6.5 6.5 0 0 1 14.324 4.772" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.109 11.247A6.5 6.5 0 0 0 5.272 13.824" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.625 10.19A4 4 0 0 1 10.69 12.125" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotFingerprintLoopsIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M6.5 14V8.5A1.5 1.5 0 0 1 9.5 8.5V12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 13V8.5A4 4 0 0 1 5.429 5.436" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.86 4.502A4 4 0 0 1 12 8.5V12" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.599 9.629A6.5 6.5 0 0 1 5.777 2.392" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.682 2.221A6.5 6.5 0 0 1 14.5 8.5V10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotFingerprintOriginalIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.625 10.5C2.542 9.875 2.5 9.083 2.5 8A5.5 5.5 0 0 1 4.111 4.111" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.857 2.62A5.5 5.5 0 0 1 13.5 8V10M13.25 12L12.875 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 8A3 3 0 0 1 11 8C11 10.333 10.667 12 10 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.25 10.5L4.75 12.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 8C8 10.333 7.667 12 7 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotFingerprintSpiralIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M9 8.75A1.25 1.25 0 0 0 6.5 8.75A2.5 2.5 0 0 0 9.391 11.219" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.378 9.523A2.5 2.5 0 0 0 11.5 8.75A3.75 3.75 0 0 0 4 8.75V12.75" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.841 13.399A5 5 0 0 0 13.455 11.02" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.624 6.614A6.25 6.25 0 0 0 1.876 6.614" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotFingerprintSwirlLegsIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2 11A6.25 6.25 0 0 1 14.123 7.112" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 13V9.25A3.75 3.75 0 0 1 12 9.25V10.25" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 11.5V9.25A1.25 1.25 0 0 1 9.5 9.25A3.75 3.75 0 0 0 12.599 12.943" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotFingerprintSwirlIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.127 7.112A6.25 6.25 0 0 1 13.873 7.112" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.125 12.498A3.75 3.75 0 1 1 11.75 9.25" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.375 10.333A1.25 1.25 0 1 1 9.25 9.25A3.75 3.75 0 0 0 12.349 12.943" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotFingerprintTiltedIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.998 13.407L6.422 8.095A1.5 1.5 0 0 1 9.319 8.871L8.284 12.735" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.842 11.794L4.007 7.448A4 4 0 0 1 6.18 4.858" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.77 4.585A4 4 0 0 1 11.734 9.518L10.828 12.899" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.395 7.917A6.5 6.5 0 0 1 7.304 2.008" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.12 2.853A6.5 6.5 0 0 1 14.149 10.165L13.761 11.614" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotFingerprintTracksIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.661 10.5A19.5 19.5 0 0 1 2.5 8A5.5 5.5 0 0 1 4.111 4.111" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.856 2.62A5.5 5.5 0 0 1 13.5 8A19.5 19.5 0 0 1 13.442 9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.085 12A19.5 19.5 0 0 1 12.708 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.181 6.974A3 3 0 0 1 11 8A17 17 0 0 1 10.086 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.058 9.4A17 17 0 0 0 5.224 10.75" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 8A14 14 0 0 1 6.874 13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const EXPLORE: readonly ExploreCandidate[] = [
  { group: "fingerprint", label: "8 · Two arches and a stem (Tabler)", Icon: PilotFingerprintBoldIcon, gaps: ["1.37 tight","4.37 open","1.87 standard"], counters: [], notes: [] },
  { group: "fingerprint", label: "6 · Broken arches (Fluent)", Icon: PilotFingerprintFluentIcon, gaps: ["1.38 tight","1.38 tight","1.57 tight","3.48 open","3.88 open","0.95 detail","6.88 open","0.98 detail","1.38 tight","1.38 tight","4.55 open","1.38 tight","9.06 open","1.79 standard","1.47 tight"], counters: [], notes: ["shapes 2 and 5 close to 0.68px in the filled variant (1.5px line); keep 0.875: move them 0.19 apart"] },
  { group: "fingerprint", label: "7 · Leaning arcs (Heroicons)", Icon: PilotFingerprintLeanIcon, gaps: ["1.37 tight","3.88 open","3.88 open","1.07 detail","1.37 tight","1.37 tight","1.61 tight","3.32 open","4.55 open","4.55 open"], counters: [], notes: ["shapes 1 and 5 close to 0.79px in the filled variant (1.5px line); keep 0.875: move them 0.08 apart"] },
  { group: "fingerprint", label: "3 · Nested loops (Apple Touch ID)", Icon: PilotFingerprintLoopsIcon, gaps: ["1.37 tight","1.37 tight","3.78 open","3.88 open","1.48 tight","1.28 tight","4.21 open","1.84 standard","1.37 tight","2.78 open"], counters: [], notes: [] },
  { group: "fingerprint", label: "5 · Original (Phosphor, yesterday)", Icon: PilotFingerprintOriginalIcon, gaps: ["2 standard","1.37 tight","1.42 tight","4.01 open","1.38 tight","6.92 open","4.38 open","1.39 tight","1.67 tight","1.34 tight"], counters: [], notes: [] },
  { group: "fingerprint", label: "2 · Spiral (Android)", Icon: PilotFingerprintSpiralIcon, gaps: ["1.37 tight","1.49 tight","3.88 open","1.44 tight","1.38 tight","3.28 open"], counters: [], notes: [] },
  { group: "fingerprint", label: "9 · Swirl with legs (your reference, fuller)", Icon: PilotFingerprintSwirlLegsIcon, gaps: ["1.38 tight","3.88 open","1.02 detail"], counters: [], notes: ["shapes 2 and 3 close to 0.76px in the filled variant (1.5px line); keep 0.875: move them 0.12 apart"] },
  { group: "fingerprint", label: "1 · Swirl (Material, your reference)", Icon: PilotFingerprintSwirlIcon, gaps: ["1.38 tight","3.88 open","1.37 tight"], counters: [], notes: [] },
  { group: "fingerprint", label: "10 · Tilted loops (Apple, turned 15°)", Icon: PilotFingerprintTiltedIcon, gaps: ["1.38 tight","1.37 tight","3.78 open","3.88 open","1.48 tight","1.28 tight","4.21 open","1.84 standard","1.38 tight","2.78 open"], counters: [], notes: ["centreline at 1.4,7.92 leaves the 1.5–14.5 drawing area"] },
  { group: "fingerprint", label: "4 · Arches on curved tracks (first round today)", Icon: PilotFingerprintTracksIcon, gaps: ["2 standard","9.36 open","1.38 tight","1.38 tight","3.86 open","1.4 tight","1.37 tight","5.89 open","4.37 open","1.37 tight","6.82 open","4.37 open","1.3 tight","1.87 standard","1.32 tight"], counters: [], notes: [] },
];
