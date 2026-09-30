/** Area icon candidates under review, generated from apps/docs/assets/area-icons-pilot/explore
 * by scripts/gen-pilot-icons.mjs. Do not edit by hand. Each carries its lint measurements. */
import type { ReactElement } from "react";
import { sw, type PilotIconProps } from "./pilot-icons.tsx";

export type ExploreCandidate = {
  group: string; label: string; Icon: (props: PilotIconProps) => ReactElement;
  gaps: readonly string[]; counters: readonly number[]; notes: readonly string[];
};

const base = { viewBox: "0 0 16 16", width: 16, height: 16, fill: "none", "aria-hidden": true, focusable: false } as const;

const PilotAgentCastAgentNomouthIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.85 6.622A2.5 2.5 0 0 0 2 8.5V11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V8.5A2.5 2.5 0 0 0 13.15 6.622" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0 6.86Q8 9.89 16 6.86" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 6.771L4.105 3.327A1 1 0 0 1 5.09 2.5L7 2.5A0.5 0.5 0 0 1 7.4 2.7L7.6 2.967A0.5 0.5 0 0 0 8.4 2.967L8.6 2.7A0.5 0.5 0 0 1 9 2.5L10.91 2.5A1 1 0 0 1 11.895 3.327L12.5 6.771Q8 7.729 3.5 6.771Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.5 6.25Q8 8.25 14.5 6.25" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.85 4.842Q8 5.658 12.15 4.842" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.25 8.75L6.5 8.75A0.25 0.25 0 0 1 6.75 9L6.75 9.5A1.5 1.5 0 0 1 5.25 11L4 11A1 1 0 0 1 3 10L3 9A0.25 0.25 0 0 1 3.25 8.75Z" fill="currentColor" />
    <path d="M9.5 8.75L12.75 8.75A0.25 0.25 0 0 1 13 9L13 10A1 1 0 0 1 12 11L10.75 11A1.5 1.5 0 0 1 9.25 9.5L9.25 9A0.25 0.25 0 0 1 9.5 8.75Z" fill="currentColor" />
    <path d="M6.75 10A1.25 1.25 0 0 1 9.25 10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotAgentCastAgentSunAviatorIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.85 6.622A2.5 2.5 0 0 0 2 8.5V11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V8.5A2.5 2.5 0 0 0 13.15 6.622" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0 6.86Q8 9.89 16 6.86" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 6.771L4.105 3.327A1 1 0 0 1 5.09 2.5L7 2.5A0.5 0.5 0 0 1 7.4 2.7L7.6 2.967A0.5 0.5 0 0 0 8.4 2.967L8.6 2.7A0.5 0.5 0 0 1 9 2.5L10.91 2.5A1 1 0 0 1 11.895 3.327L12.5 6.771Q8 7.729 3.5 6.771Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.5 6.25Q8 8.25 14.5 6.25" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.85 4.842Q8 5.658 12.15 4.842" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 8.75L6.36 8.75A0.5 0.5 0 0 1 6.845 9.371L6.627 10.241A1 1 0 0 1 6.008 10.934L5.181 11.245A1.25 1.25 0 0 1 3.942 11.035L3.27 10.475A0.75 0.75 0 0 1 3 9.899L3 9.25A0.5 0.5 0 0 1 3.5 8.75Z" fill="currentColor" />
    <path d="M12.5 8.75L9.64 8.75A0.5 0.5 0 0 0 9.155 9.371L9.373 10.241A1 1 0 0 0 9.992 10.934L10.819 11.245A1.25 1.25 0 0 0 12.058 11.035L12.73 10.475A0.75 0.75 0 0 0 13 9.899L13 9.25A0.5 0.5 0 0 0 12.5 8.75Z" fill="currentColor" />
    <path d="M7 9.25A1.25 1.25 0 0 1 9 9.25" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotAgentCastAgentSunRoundIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.85 6.622A2.5 2.5 0 0 0 2 8.5V11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V8.5A2.5 2.5 0 0 0 13.15 6.622" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0 6.86Q8 9.89 16 6.86" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 6.771L4.105 3.327A1 1 0 0 1 5.09 2.5L7 2.5A0.5 0.5 0 0 1 7.4 2.7L7.6 2.967A0.5 0.5 0 0 0 8.4 2.967L8.6 2.7A0.5 0.5 0 0 1 9 2.5L10.91 2.5A1 1 0 0 1 11.895 3.327L12.5 6.771Q8 7.729 3.5 6.771Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.5 6.25Q8 8.25 14.5 6.25" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.85 4.842Q8 5.658 12.15 4.842" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="5" cy="10" r="1.9" fill="currentColor" />
    <circle cx="11" cy="10" r="1.9" fill="currentColor" />
    <path d="M6.75 9.5A1.5 1.5 0 0 1 9.25 9.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotAgentCastAgentSunShieldIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.85 6.622A2.5 2.5 0 0 0 2 8.5V11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V8.5A2.5 2.5 0 0 0 13.15 6.622" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0 6.86Q8 9.89 16 6.86" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 6.771L4.105 3.327A1 1 0 0 1 5.09 2.5L7 2.5A0.5 0.5 0 0 1 7.4 2.7L7.6 2.967A0.5 0.5 0 0 0 8.4 2.967L8.6 2.7A0.5 0.5 0 0 1 9 2.5L10.91 2.5A1 1 0 0 1 11.895 3.327L12.5 6.771Q8 7.729 3.5 6.771Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.5 6.25Q8 8.25 14.5 6.25" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.85 4.842Q8 5.658 12.15 4.842" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.36 8.5L12.64 8.5A0.5 0.5 0 0 1 13.13 9.098L12.911 10.196A1 1 0 0 1 11.93 11L9.425 11A0.5 0.5 0 0 1 9.113 10.89L8.469 10.375A0.75 0.75 0 0 0 7.531 10.375L6.887 10.89A0.5 0.5 0 0 1 6.575 11L4.07 11A1 1 0 0 1 3.089 10.196L2.87 9.098A0.5 0.5 0 0 1 3.36 8.5Z" fill="currentColor" />
  </svg>
);

const PilotAgentCastAgentSunSlimIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.85 6.622A2.5 2.5 0 0 0 2 8.5V11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V8.5A2.5 2.5 0 0 0 13.15 6.622" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0 6.86Q8 9.89 16 6.86" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 6.771L4.105 3.327A1 1 0 0 1 5.09 2.5L7 2.5A0.5 0.5 0 0 1 7.4 2.7L7.6 2.967A0.5 0.5 0 0 0 8.4 2.967L8.6 2.7A0.5 0.5 0 0 1 9 2.5L10.91 2.5A1 1 0 0 1 11.895 3.327L12.5 6.771Q8 7.729 3.5 6.771Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.5 6.25Q8 8.25 14.5 6.25" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.85 4.842Q8 5.658 12.15 4.842" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 9.25L6.5 9.25A0.5 0.5 0 0 1 7 9.75L7 10.25A0.5 0.5 0 0 1 6.5 10.75L3.5 10.75A0.5 0.5 0 0 1 3 10.25L3 9.75A0.5 0.5 0 0 1 3.5 9.25Z" fill="currentColor" />
    <path d="M12.5 9.25L9.5 9.25A0.5 0.5 0 0 0 9 9.75L9 10.25A0.5 0.5 0 0 0 9.5 10.75L12.5 10.75A0.5 0.5 0 0 0 13 10.25L13 9.75A0.5 0.5 0 0 0 12.5 9.25Z" fill="currentColor" />
    <path d="M7 9.75H9" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotAgentCastAgentSunSportIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.85 6.622A2.5 2.5 0 0 0 2 8.5V11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V8.5A2.5 2.5 0 0 0 13.15 6.622" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0 6.86Q8 9.89 16 6.86" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 6.771L4.105 3.327A1 1 0 0 1 5.09 2.5L7 2.5A0.5 0.5 0 0 1 7.4 2.7L7.6 2.967A0.5 0.5 0 0 0 8.4 2.967L8.6 2.7A0.5 0.5 0 0 1 9 2.5L10.91 2.5A1 1 0 0 1 11.895 3.327L12.5 6.771Q8 7.729 3.5 6.771Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.5 6.25Q8 8.25 14.5 6.25" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.85 4.842Q8 5.658 12.15 4.842" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.446 8.373L6.523 8.916A0.5 0.5 0 0 1 6.932 9.479L6.862 9.967A1 1 0 0 1 5.962 10.822L4.536 10.951A1 1 0 0 1 3.664 10.58L3.081 9.852A0.5 0.5 0 0 1 2.979 9.622L2.866 8.947A0.5 0.5 0 0 1 3.446 8.373Z" fill="currentColor" />
    <path d="M12.554 8.373L9.477 8.916A0.5 0.5 0 0 0 9.068 9.479L9.138 9.967A1 1 0 0 0 10.038 10.822L11.464 10.951A1 1 0 0 0 12.336 10.58L12.919 9.852A0.5 0.5 0 0 0 13.021 9.622L13.134 8.947A0.5 0.5 0 0 0 12.554 8.373Z" fill="currentColor" />
    <path d="M7 9.5H9" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotAgentCastAgentSunWayfarerIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.85 6.622A2.5 2.5 0 0 0 2 8.5V11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V8.5A2.5 2.5 0 0 0 13.15 6.622" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0 6.86Q8 9.89 16 6.86" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 6.771L4.105 3.327A1 1 0 0 1 5.09 2.5L7 2.5A0.5 0.5 0 0 1 7.4 2.7L7.6 2.967A0.5 0.5 0 0 0 8.4 2.967L8.6 2.7A0.5 0.5 0 0 1 9 2.5L10.91 2.5A1 1 0 0 1 11.895 3.327L12.5 6.771Q8 7.729 3.5 6.771Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.5 6.25Q8 8.25 14.5 6.25" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.85 4.842Q8 5.658 12.15 4.842" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.422 8.5L6.39 8.5A0.5 0.5 0 0 1 6.88 9.098L6.661 10.196A1 1 0 0 1 5.68 11L4.244 11A1 1 0 0 1 3.286 10.287L2.943 9.144A0.5 0.5 0 0 1 3.422 8.5Z" fill="currentColor" />
    <path d="M12.578 8.5L9.61 8.5A0.5 0.5 0 0 0 9.12 9.098L9.339 10.196A1 1 0 0 0 10.32 11L11.756 11A1 1 0 0 0 12.714 10.287L13.057 9.144A0.5 0.5 0 0 0 12.578 8.5Z" fill="currentColor" />
    <path d="M6.75 8.75H9.25" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotAgentCastAgentIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.85 6.622A2.5 2.5 0 0 0 2 8.5V11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V8.5A2.5 2.5 0 0 0 13.15 6.622" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0 6.86Q8 9.89 16 6.86" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 6.771L4.105 3.327A1 1 0 0 1 5.09 2.5L7 2.5A0.5 0.5 0 0 1 7.4 2.7L7.6 2.967A0.5 0.5 0 0 0 8.4 2.967L8.6 2.7A0.5 0.5 0 0 1 9 2.5L10.91 2.5A1 1 0 0 1 11.895 3.327L12.5 6.771Q8 7.729 3.5 6.771Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.5 6.25Q8 8.25 14.5 6.25" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.85 4.842Q8 5.658 12.15 4.842" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.25 8.75L6.5 8.75A0.25 0.25 0 0 1 6.75 9L6.75 9.5A1.5 1.5 0 0 1 5.25 11L4 11A1 1 0 0 1 3 10L3 9A0.25 0.25 0 0 1 3.25 8.75Z" fill="currentColor" />
    <path d="M9.5 8.75L12.75 8.75A0.25 0.25 0 0 1 13 9L13 10A1 1 0 0 1 12 11L10.75 11A1.5 1.5 0 0 1 9.25 9.5L9.25 9A0.25 0.25 0 0 1 9.5 8.75Z" fill="currentColor" />
    <path d="M6.75 10A1.25 1.25 0 0 1 9.25 10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="11.25" r="0.75" fill="currentColor" />
  </svg>
);

const PilotAgentCastAutomatorIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M5.375 6H4.5A2.5 2.5 0 0 0 2 8.5V11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V8.5A2.5 2.5 0 0 0 11.5 6H10.625" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 6H11.5A2.5 2.5 0 0 1 14 8.5V11A2.5 2.5 0 0 1 11.5 13.5H4.5A2.5 2.5 0 0 1 2 11V8.5A2.5 2.5 0 0 1 4.5 6Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0.5 8.375H15.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.375 5.25V4.31A1.875 1.175 0 1 1 6.5 2.195A1.875 1.175 0 0 1 9.5 2.195A1.875 1.175 0 1 1 10.625 4.31V5.25Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.375 5.25V7.087Q8 7.413 10.625 7.087V5.25" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 5.25H13" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.375 7.087Q8 7.413 10.625 7.087" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 9V10.5M11 9V10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="11.25" r="0.75" fill="currentColor" />
  </svg>
);

const PilotAgentCastBuilderIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.85 6.622A2.5 2.5 0 0 0 2 8.5V11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V8.5A2.5 2.5 0 0 0 13.15 6.622" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0 6.86Q8 9.89 16 6.86" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 6.534A5.5 5 0 0 1 13.5 6.534" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.5 6.25Q8 8.25 14.5 6.25" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 2.5V4.5M9.5 2.5V4.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 9V10.5M11 9V10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="11.25" r="0.75" fill="currentColor" />
  </svg>
);

const PilotAgentCastDesignerIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3.836 6.09A2.5 2.5 0 0 0 2 8.5V11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V8.5A2.5 2.5 0 0 0 12.164 6.09" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0 6.11Q8 9.14 16 6.11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 5.908V5A2.5 2.5 0 0 1 5.5 2.5H10.5A2.5 2.5 0 0 1 13 5V5.908Q8 7.092 3 5.908Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.25 1.5H8.75" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 2.5V6.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 5.784Q8 7.216 13.5 5.784Q8 10.216 2.5 5.784Z" fill="currentColor" />
    <path d="M5 9V10.5M11 9V10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="11.25" r="0.75" fill="currentColor" />
  </svg>
);

const PilotAgentCastGeneratorIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.85 6.622A2.5 2.5 0 0 0 2 8.5V11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V8.5A2.5 2.5 0 0 0 13.15 6.622" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0 6.86Q8 9.89 16 6.86" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 6.871 C5 4.25 6.25 1.5 9.25 1.5C10.5 1.5 11.75 2 12.5 2.75A0.5 0.5 0 0 1 11.85 3.45C11.2 3.05 10.4 3.2 10.65 4.15L12 6.871Q8 7.629 4 6.871Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.5 6.25Q8 8.25 14.5 6.25" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.784 5.005Q7.934 5.485 11.083 5.025" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 9V10.5M11 9V10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="11.25" r="0.75" fill="currentColor" />
  </svg>
);

const PilotAgentCastGuardStarIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3.836 6.09A2.5 2.5 0 0 0 2 8.5V11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V8.5A2.5 2.5 0 0 0 12.164 6.09" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0 6.11Q8 9.14 16 6.11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 6.021L1.802 3.456A0.75 0.75 0 0 1 1.841 2.573L2.275 2.031A0.75 0.75 0 0 1 2.86 1.75L13.14 1.75A0.75 0.75 0 0 1 13.725 2.031L14.159 2.573A0.75 0.75 0 0 1 14.198 3.456L12.5 6.021Q8 6.979 3.5 6.021Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.836 6.09Q8 6.91 12.164 6.09" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 5.908Q8 7.092 13 5.908Q8 10.592 3 5.908Z" fill="currentColor" />
    <path d="M8.202 2.581L8.622 3.433A0.075 0.075 0 0 0 8.678 3.474L9.617 3.61A0.225 0.225 0 0 1 9.742 3.994L9.063 4.656A0.075 0.075 0 0 0 9.041 4.723L9.201 5.658A0.225 0.225 0 0 1 8.875 5.895L8.035 5.453A0.075 0.075 0 0 0 7.965 5.453L7.125 5.895A0.225 0.225 0 0 1 6.798 5.658L6.959 4.723A0.075 0.075 0 0 0 6.937 4.656L6.258 3.994A0.225 0.225 0 0 1 6.383 3.61L7.322 3.474A0.075 0.075 0 0 0 7.378 3.433L7.798 2.581A0.225 0.225 0 0 1 8.202 2.581Z" fill="currentColor" />
    <path d="M5 9V10.5M11 9V10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="11.25" r="0.75" fill="currentColor" />
  </svg>
);

const PilotAgentCastGuardStripeIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M3.836 6.09A2.5 2.5 0 0 0 2 8.5V11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V8.5A2.5 2.5 0 0 0 12.164 6.09" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0 6.11Q8 9.14 16 6.11" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 6.021L1.802 3.456A0.75 0.75 0 0 1 1.841 2.573L2.275 2.031A0.75 0.75 0 0 1 2.86 1.75L13.14 1.75A0.75 0.75 0 0 1 13.725 2.031L14.159 2.573A0.75 0.75 0 0 1 14.198 3.456L12.5 6.021Q8 6.979 3.5 6.021Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.836 6.09Q8 6.91 12.164 6.09" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 5.908Q8 7.092 13 5.908Q8 10.592 3 5.908Z" fill="currentColor" />
    <path d="M2.2 3.704Q8 5.296 13.8 3.704" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 9V10.5M11 9V10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="11.25" r="0.75" fill="currentColor" />
  </svg>
);

const PilotAgentCastLeadIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.5 7A2.5 2.5 0 0 0 2 8.5V11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V8.5A2.5 2.5 0 0 0 13.5 7" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 6H11.5A2.5 2.5 0 0 1 14 8.5V11A2.5 2.5 0 0 1 11.5 13.5H4.5A2.5 2.5 0 0 1 2 11V8.5A2.5 2.5 0 0 1 4.5 6Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0.5 8.375H15.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 6.425L2.5 4.556A0.75 0.413 0 0 1 3.73 4.239L4.84 4.747A0.75 0.413 0 0 0 5.956 4.649L7.364 3.41A0.75 0.413 0 0 1 8.636 3.41L10.044 4.649A0.75 0.413 0 0 0 11.16 4.747L12.27 4.239A0.75 0.413 0 0 1 13.5 4.556L13.5 6.425A1.5 0.825 0 0 1 12 7.25L4 7.25A1.5 0.825 0 0 1 2.5 6.425Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 5.875H13.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="2.5" cy="2.712" r="0.6" fill="currentColor" />
    <circle cx="8" cy="1.4" r="0.6" fill="currentColor" />
    <circle cx="13.5" cy="2.712" r="0.6" fill="currentColor" />
    <path d="M5 9V10.5M11 9V10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="11.25" r="0.75" fill="currentColor" />
  </svg>
);

const PilotAgentCastResearcherGogDarkIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.148 7.654A2.5 2.5 0 0 1 4.5 6L11.5 6A2.5 2.5 0 0 1 13.852 7.654M14 10L14 11A2.5 2.5 0 0 1 11.5 13.5L4.5 13.5A2.5 2.5 0 0 1 2 11L2 10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 6H11.5A2.5 2.5 0 0 1 14 8.5V11A2.5 2.5 0 0 1 11.5 13.5H4.5A2.5 2.5 0 0 1 2 11V8.5A2.5 2.5 0 0 1 4.5 6Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6V4.5M6.5 3.25A1.5 1.25 0 1 1 9.5 3.25A1.5 1.25 0 1 1 6.5 3.25Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.75 7.5L13.25 7.5A1.25 1.25 0 0 1 14.5 8.75L14.5 9A1.25 1.25 0 0 1 13.25 10.25L9.457 10.25A0.5 0.5 0 0 1 9.104 10.104L8.53 9.53A0.75 0.75 0 0 0 7.47 9.53L6.896 10.104A0.5 0.5 0 0 1 6.543 10.25L2.75 10.25A1.25 1.25 0 0 1 1.5 9L1.5 8.75A1.25 1.25 0 0 1 2.75 7.5Z" fill="currentColor" />
  </svg>
);

const PilotAgentCastResearcherGogForeheadIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M13.341 6.809A2.5 2.5 0 0 1 14 8.5L14 11A2.5 2.5 0 0 1 11.5 13.5L4.5 13.5A2.5 2.5 0 0 1 2 11L2 8.5A2.5 2.5 0 0 1 2.659 6.809" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 6H11.5A2.5 2.5 0 0 1 14 8.5V11A2.5 2.5 0 0 1 11.5 13.5H4.5A2.5 2.5 0 0 1 2 11V8.5A2.5 2.5 0 0 1 4.5 6Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6V4.5M6.5 3.25A1.5 1.25 0 1 1 9.5 3.25A1.5 1.25 0 1 1 6.5 3.25Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 4.75L12.5 4.75A1 1 0 0 1 13.5 5.75L13.5 6.25A1 1 0 0 1 12.5 7.25L3.5 7.25A1 1 0 0 1 2.5 6.25L2.5 5.75A1 1 0 0 1 3.5 4.75Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 9V10.5M11 9V10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotAgentCastResearcherGogSplitIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.148 7.654A2.5 2.5 0 0 1 4.5 6L11.5 6A2.5 2.5 0 0 1 13.852 7.654M14 10L14 11A2.5 2.5 0 0 1 11.5 13.5L4.5 13.5A2.5 2.5 0 0 1 2 11L2 10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 6H11.5A2.5 2.5 0 0 1 14 8.5V11A2.5 2.5 0 0 1 11.5 13.5H4.5A2.5 2.5 0 0 1 2 11V8.5A2.5 2.5 0 0 1 4.5 6Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6V4.5M6.5 3.25A1.5 1.25 0 1 1 9.5 3.25A1.5 1.25 0 1 1 6.5 3.25Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.75 7.5L13.25 7.5A1.25 1.25 0 0 1 14.5 8.75L14.5 9A1.25 1.25 0 0 1 13.25 10.25L9.457 10.25A0.5 0.5 0 0 1 9.104 10.104L8.53 9.53A0.75 0.75 0 0 0 7.47 9.53L6.896 10.104A0.5 0.5 0 0 1 6.543 10.25L2.75 10.25A1.25 1.25 0 0 1 1.5 9L1.5 8.75A1.25 1.25 0 0 1 2.75 7.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 7.5V9" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotAgentCastResearcherGogStrapIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M4.5 6L11.5 6A2.5 2.5 0 0 1 14 8.5L14 11A2.5 2.5 0 0 1 11.5 13.5L4.5 13.5A2.5 2.5 0 0 1 2 11L2 8.5A2.5 2.5 0 0 1 4.5 6" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 6H11.5A2.5 2.5 0 0 1 14 8.5V11A2.5 2.5 0 0 1 11.5 13.5H4.5A2.5 2.5 0 0 1 2 11V8.5A2.5 2.5 0 0 1 4.5 6Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6V4.5M6.5 3.25A1.5 1.25 0 1 1 9.5 3.25A1.5 1.25 0 1 1 6.5 3.25Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 7.75L12 7.75A1 1 0 0 1 13 8.75L13 9.25A1 1 0 0 1 12 10.25L4 10.25A1 1 0 0 1 3 9.25L3 8.75A1 1 0 0 1 4 7.75Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.5 8.75H3M13 8.75H14.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotAgentCastResearcherGogSwimIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2 9.24L2 8.5A2.5 2.5 0 0 1 4.5 6L11.5 6A2.5 2.5 0 0 1 14 8.5L14 9.24M14 9.26L14 11A2.5 2.5 0 0 1 11.5 13.5L4.5 13.5A2.5 2.5 0 0 1 2 11L2 9.26" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 6H11.5A2.5 2.5 0 0 1 14 8.5V11A2.5 2.5 0 0 1 11.5 13.5H4.5A2.5 2.5 0 0 1 2 11V8.5A2.5 2.5 0 0 1 4.5 6Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6V4.5M6.5 3.25A1.5 1.25 0 1 1 9.5 3.25A1.5 1.25 0 1 1 6.5 3.25Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 9.25A2 2 0 1 1 7 9.25A2 2 0 1 1 3 9.25ZM9 9.25A2 2 0 1 1 13 9.25A2 2 0 1 1 9 9.25Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.5 9.25H3M7 9.25H9M13 9.25H14.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotAgentCastResearcherGogWideIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.148 7.654A2.5 2.5 0 0 1 4.5 6L11.5 6A2.5 2.5 0 0 1 13.852 7.654M14 10L14 11A2.5 2.5 0 0 1 11.5 13.5L4.5 13.5A2.5 2.5 0 0 1 2 11L2 10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 6H11.5A2.5 2.5 0 0 1 14 8.5V11A2.5 2.5 0 0 1 11.5 13.5H4.5A2.5 2.5 0 0 1 2 11V8.5A2.5 2.5 0 0 1 4.5 6Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6V4.5M6.5 3.25A1.5 1.25 0 1 1 9.5 3.25A1.5 1.25 0 1 1 6.5 3.25Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.75 7.5L13.25 7.5A1.25 1.25 0 0 1 14.5 8.75L14.5 9A1.25 1.25 0 0 1 13.25 10.25L9.457 10.25A0.5 0.5 0 0 1 9.104 10.104L8.53 9.53A0.75 0.75 0 0 0 7.47 9.53L6.896 10.104A0.5 0.5 0 0 1 6.543 10.25L2.75 10.25A1.25 1.25 0 0 1 1.5 9L1.5 8.75A1.25 1.25 0 0 1 2.75 7.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PilotAgentCastResearcherIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.148 7.654A2.5 2.5 0 0 1 4.5 6L11.5 6A2.5 2.5 0 0 1 13.852 7.654M14 10L14 11A2.5 2.5 0 0 1 11.5 13.5L4.5 13.5A2.5 2.5 0 0 1 2 11L2 10" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 6H11.5A2.5 2.5 0 0 1 14 8.5V11A2.5 2.5 0 0 1 11.5 13.5H4.5A2.5 2.5 0 0 1 2 11V8.5A2.5 2.5 0 0 1 4.5 6Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6V4.5M6.5 3.25A1.5 1.25 0 1 1 9.5 3.25A1.5 1.25 0 1 1 6.5 3.25Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.75 7.5L13.25 7.5A1.25 1.25 0 0 1 14.5 8.75L14.5 9A1.25 1.25 0 0 1 13.25 10.25L9.457 10.25A0.5 0.5 0 0 1 9.104 10.104L8.53 9.53A0.75 0.75 0 0 0 7.47 9.53L6.896 10.104A0.5 0.5 0 0 1 6.543 10.25L2.75 10.25A1.25 1.25 0 0 1 1.5 9L1.5 8.75A1.25 1.25 0 0 1 2.75 7.5Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="11.25" r="0.75" fill="currentColor" />
  </svg>
);

const PilotAgentCastScholarIcon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    <path d="M2.85 6.622A2.5 2.5 0 0 0 2 8.5V11A2.5 2.5 0 0 0 4.5 13.5H11.5A2.5 2.5 0 0 0 14 11V8.5A2.5 2.5 0 0 0 13.15 6.622" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0 6.86Q8 9.89 16 6.86" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.13 1.535L12.707 2.767A0.5 0.5 0 0 1 12.707 3.733L8.13 4.965A0.5 0.5 0 0 1 7.87 4.965L3.293 3.733A0.5 0.5 0 0 1 3.293 2.767L7.87 1.535A0.5 0.5 0 0 1 8.13 1.535Z" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 3.923V6.871M12 3.923V6.871" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.85 6.622Q8 7.878 13.15 6.622" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 9V10.5M11 9V10.5" fill="none" stroke="currentColor" style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="11.25" r="0.75" fill="currentColor" />
  </svg>
);

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
  { group: "agent", label: "Agent without a mouth", Icon: PilotAgentCastAgentNomouthIcon, gaps: ["0.92 detail","0.44","0.44","2.38","0.99 detail","0.99 detail","0.38","0.84","0.99 detail","0.99 detail","0.38","2.98 open","2.98 open","2.38","2.5 open"], counters: [1.68,1.04,2.93], notes: ["horizontal stroke at y 8.75 is off the 0.5px grid","vertical stroke at x 6.75 is off the 0.5px grid","horizontal stroke at y 8.75 is off the 0.5px grid","vertical stroke at x 9.25 is off the 0.5px grid","shapes 1 and 5 leave a 0.44px gap; move them 0.44 apart for detail, or 0.69 apart for tight (or join them)","shapes 1 and 6 leave a 0.44px gap; move them 0.44 apart for detail, or 0.69 apart for tight (or join them)","shapes 1 and 7 leave a 2.38px gap; move them 0.13 apart for open, or 0.38 closer for standard (or join them)","shapes 2 and 7 leave a 0.38px gap; move them 0.5 apart for detail, or 0.75 apart for tight (or join them)","shapes 3 and 4 leave a 0.84px gap; move them 0.04 apart for detail, or 0.29 apart for tight (or join them)","shapes 3 and 7 leave a 0.38px gap; move them 0.5 apart for detail, or 0.75 apart for tight (or join them)","shapes 4 and 7 leave a 2.38px gap; move them 0.13 apart for open, or 0.38 closer for standard (or join them)","ink 14.13×12.13 exceeds the square keyline 13×13"] },
  { group: "agent", label: "Agent sunglasses: aviators: teardrop lenses, an arched bridge", Icon: PilotAgentCastAgentSunAviatorIcon, gaps: ["0.92 detail","0.44","0.44","3.13 open","1 detail","1 detail","0.38","0.84","1 detail","1 detail","0.38","2.99 open","2.99 open","2.38","2.28"], counters: [1.68,1.04,3.43], notes: ["horizontal stroke at y 8.75 is off the 0.5px grid","horizontal stroke at y 8.75 is off the 0.5px grid","shapes 1 and 5 leave a 0.44px gap; move them 0.44 apart for detail, or 0.69 apart for tight (or join them)","shapes 1 and 6 leave a 0.44px gap; move them 0.44 apart for detail, or 0.69 apart for tight (or join them)","shapes 2 and 7 leave a 0.38px gap; move them 0.5 apart for detail, or 0.75 apart for tight (or join them)","shapes 3 and 4 leave a 0.84px gap; move them 0.04 apart for detail, or 0.29 apart for tight (or join them)","shapes 3 and 7 leave a 0.38px gap; move them 0.5 apart for detail, or 0.75 apart for tight (or join them)","shapes 4 and 7 leave a 2.38px gap; move them 0.13 apart for open, or 0.38 closer for standard (or join them)","shapes 5 and 6 leave a 2.28px gap; move them 0.22 apart for open, or 0.28 closer for standard (or join them)","ink 14.13×12.13 exceeds the square keyline 13×13"] },
  { group: "agent", label: "Agent sunglasses: round lenses, an arched bridge", Icon: PilotAgentCastAgentSunRoundIcon, gaps: ["0.92 detail","0.54","0.54","2.88 open","0.48","0.48","0.45","0.84","0.48","0.48","0.45","2.46","2.46","2.45","2.2"], counters: [1.68,1.04,2.93], notes: ["shapes 1 and 5 leave a 0.54px gap; move them 0.34 apart for detail, or 0.59 apart for tight (or join them)","shapes 1 and 6 leave a 0.54px gap; move them 0.34 apart for detail, or 0.59 apart for tight (or join them)","shapes 2 and 5 leave a 0.48px gap; move them 0.4 apart for detail, or 0.65 apart for tight (or join them)","shapes 2 and 6 leave a 0.48px gap; move them 0.4 apart for detail, or 0.65 apart for tight (or join them)","shapes 2 and 7 leave a 0.45px gap; move them 0.42 apart for detail, or 0.67 apart for tight (or join them)","shapes 3 and 4 leave a 0.84px gap; move them 0.04 apart for detail, or 0.29 apart for tight (or join them)","shapes 3 and 5 leave a 0.48px gap; move them 0.39 apart for detail, or 0.64 apart for tight (or join them)","shapes 3 and 6 leave a 0.48px gap; move them 0.39 apart for detail, or 0.64 apart for tight (or join them)","shapes 3 and 7 leave a 0.45px gap; move them 0.42 apart for detail, or 0.67 apart for tight (or join them)","shapes 4 and 5 leave a 2.46px gap; move them 0.04 apart for open, or 0.46 closer for standard (or join them)","shapes 4 and 6 leave a 2.46px gap; move them 0.04 apart for open, or 0.46 closer for standard (or join them)","shapes 4 and 7 leave a 2.45px gap; move them 0.05 apart for open, or 0.45 closer for standard (or join them)","shapes 5 and 6 leave a 2.2px gap; move them 0.2 closer for standard, or 0.3 apart for open (or join them)","ink 14.13×12.13 exceeds the square keyline 13×13"] },
  { group: "agent", label: "Agent sunglasses: one wrap-around shield lens with a nose dip", Icon: PilotAgentCastAgentSunShieldIcon, gaps: ["0.92 detail","0.3","0.69","0.84","0.69","2.69 open"], counters: [1.68,1.04,2.68], notes: ["shapes 1 and 5 leave a 0.3px gap; move them 0.58 apart for detail, or 0.83 apart for tight (or join them)","shapes 2 and 5 leave a 0.69px gap; move them 0.19 apart for detail, or 0.44 apart for tight (or join them)","shapes 3 and 4 leave a 0.84px gap; move them 0.04 apart for detail, or 0.29 apart for tight (or join them)","shapes 3 and 5 leave a 0.69px gap; move them 0.19 apart for detail, or 0.44 apart for tight (or join them)","ink 14.13×12.13 exceeds the square keyline 13×13"] },
  { group: "agent", label: "Agent sunglasses: slim rectangles, a straight bridge", Icon: PilotAgentCastAgentSunSlimIcon, gaps: ["0.92 detail","0.44","0.44","2.63 open","1.49 tight","1.49 tight","1.38 tight","0.84","1.49 tight","1.49 tight","1.38 tight","3.48 open","3.48 open","3.38 open","2 standard"], counters: [1.68,1.04,2.68], notes: ["horizontal stroke at y 9.25 is off the 0.5px grid","horizontal stroke at y 10.75 is off the 0.5px grid","horizontal stroke at y 9.25 is off the 0.5px grid","horizontal stroke at y 10.75 is off the 0.5px grid","horizontal stroke at y 9.75 is off the 0.5px grid","shapes 1 and 5 leave a 0.44px gap; move them 0.44 apart for detail, or 0.69 apart for tight (or join them)","shapes 1 and 6 leave a 0.44px gap; move them 0.44 apart for detail, or 0.69 apart for tight (or join them)","shapes 3 and 4 leave a 0.84px gap; move them 0.04 apart for detail, or 0.29 apart for tight (or join them)","ink 14.13×12.13 exceeds the square keyline 13×13"] },
  { group: "agent", label: "Agent sunglasses: upswept sport lenses", Icon: PilotAgentCastAgentSunSportIcon, gaps: ["0.92 detail","0.3","0.3","2.88 open","1.01 detail","1.01 detail","1.13 detail","0.84","1.01 detail","1.01 detail","1.13 detail","2.98 open","2.98 open","3.13 open","2.13"], counters: [1.68,1.04,2.93], notes: ["shapes 1 and 5 leave a 0.3px gap; move them 0.58 apart for detail, or 0.83 apart for tight (or join them)","shapes 1 and 6 leave a 0.3px gap; move them 0.58 apart for detail, or 0.83 apart for tight (or join them)","shapes 3 and 4 leave a 0.84px gap; move them 0.04 apart for detail, or 0.29 apart for tight (or join them)","shapes 5 and 6 leave a 2.13px gap; move them 0.13 closer for standard, or 0.37 apart for open (or join them)","ink 14.13×12.13 exceeds the square keyline 13×13"] },
  { group: "agent", label: "Agent sunglasses: wayfarers: tapered lenses under one top bar", Icon: PilotAgentCastAgentSunWayfarerIcon, gaps: ["0.92 detail","0.36","0.36","3.32 open","0.75","0.75","0.38","0.84","0.75","0.75","0.38","2.74 open","2.74 open","2.38","2.22"], counters: [1.68,1.04,3.4], notes: ["horizontal stroke at y 8.75 is off the 0.5px grid","shapes 1 and 5 leave a 0.36px gap; move them 0.52 apart for detail, or 0.77 apart for tight (or join them)","shapes 1 and 6 leave a 0.36px gap; move them 0.52 apart for detail, or 0.77 apart for tight (or join them)","shapes 2 and 5 leave a 0.75px gap; move them 0.13 apart for detail, or 0.38 apart for tight (or join them)","shapes 2 and 6 leave a 0.75px gap; move them 0.13 apart for detail, or 0.38 apart for tight (or join them)","shapes 2 and 7 leave a 0.38px gap; move them 0.5 apart for detail, or 0.75 apart for tight (or join them)","shapes 3 and 4 leave a 0.84px gap; move them 0.04 apart for detail, or 0.29 apart for tight (or join them)","shapes 3 and 5 leave a 0.75px gap; move them 0.12 apart for detail, or 0.37 apart for tight (or join them)","shapes 3 and 6 leave a 0.75px gap; move them 0.12 apart for detail, or 0.37 apart for tight (or join them)","shapes 3 and 7 leave a 0.38px gap; move them 0.5 apart for detail, or 0.75 apart for tight (or join them)","shapes 4 and 7 leave a 2.38px gap; move them 0.13 apart for open, or 0.38 closer for standard (or join them)","shapes 5 and 6 leave a 2.22px gap; move them 0.22 closer for standard, or 0.28 apart for open (or join them)","ink 14.13×12.13 exceeds the square keyline 13×13"] },
  { group: "agent", label: "Agent (fedora with a band, sunglasses)", Icon: PilotAgentCastAgentIcon, gaps: ["0.92 detail","0.44","0.44","2.38","0.94 detail","0.99 detail","0.99 detail","0.38","2.69 open","0.84","0.99 detail","0.99 detail","0.38","2.69 open","2.98 open","2.98 open","2.38","4.69 open","2.5 open","1.01 detail","1.01 detail","0.46"], counters: [1.68,1.04,2.23], notes: ["horizontal stroke at y 8.75 is off the 0.5px grid","vertical stroke at x 6.75 is off the 0.5px grid","horizontal stroke at y 8.75 is off the 0.5px grid","vertical stroke at x 9.25 is off the 0.5px grid","shapes 1 and 5 leave a 0.44px gap; move them 0.44 apart for detail, or 0.69 apart for tight (or join them)","shapes 1 and 6 leave a 0.44px gap; move them 0.44 apart for detail, or 0.69 apart for tight (or join them)","shapes 1 and 7 leave a 2.38px gap; move them 0.13 apart for open, or 0.38 closer for standard (or join them)","shapes 2 and 7 leave a 0.38px gap; move them 0.5 apart for detail, or 0.75 apart for tight (or join them)","shapes 3 and 4 leave a 0.84px gap; move them 0.04 apart for detail, or 0.29 apart for tight (or join them)","shapes 3 and 7 leave a 0.38px gap; move them 0.5 apart for detail, or 0.75 apart for tight (or join them)","shapes 4 and 7 leave a 2.38px gap; move them 0.13 apart for open, or 0.38 closer for standard (or join them)","shapes 7 and 8 leave a 0.46px gap; move them 0.42 apart for detail, or 0.67 apart for tight (or join them)","ink 14.13×12.13 exceeds the square keyline 13×13"] },
  { group: "agent", label: "Automator (the chef hat icon, larger, band on the hat line)", Icon: PilotAgentCastAutomatorIcon, gaps: ["1.88 standard","0.94 detail","0.71","2.64 open","4.69 open","0.82","2.69 open","0.82","2.69 open","1.78 standard"], counters: [2.47,0.93,2.98], notes: ["vertical stroke at x 5.375 is off the 0.5px grid","vertical stroke at x 10.625 is off the 0.5px grid","horizontal stroke at y 5.25 is off the 0.5px grid","vertical stroke at x 5.375 is off the 0.5px grid","vertical stroke at x 10.625 is off the 0.5px grid","shapes 2 and 4 close to 0.71px in the filled variant (1.5px line); keep 0.875: move them 0.16 apart","shapes 2 and 4 leave a 0.71px gap; move them 0.16 apart for detail, or 0.41 apart for tight (or join them)","shapes 3 and 5 leave a 0.82px gap; move them 0.05 apart for detail, or 0.3 apart for tight (or join them)","shapes 4 and 5 leave a 0.82px gap; move them 0.05 apart for detail, or 0.3 apart for tight (or join them)"] },
  { group: "agent", label: "Builder (hard hat)", Icon: PilotAgentCastBuilderIcon, gaps: ["3.1 open","1.88 standard","0.94 detail","2.39","5.93 open","1.57 tight","0.82","2.69 open","3.62 open","5.6 open","1.78 standard"], counters: [2.67,2.98], notes: ["shapes 2 and 5 leave a 2.39px gap; move them 0.11 apart for open, or 0.39 closer for standard (or join them)","shapes 3 and 5 leave a 0.82px gap; move them 0.05 apart for detail, or 0.3 apart for tight (or join them)","ink 14.13×13.09 exceeds the square keyline 13×13"] },
  { group: "agent", label: "Designer (baseball cap: rounded corners, flat top, button)", Icon: PilotAgentCastDesignerIcon, gaps: ["4.6 open","3.04 open","1.88 standard","0.94 detail","1.57 tight","3.44 open","4.42 open","6.71 open","8.44 open","2.78 open","3.44 open","0.98 detail","2.5 open","1.78 standard"], counters: [2.93,2.93,2.93], notes: [] },
  { group: "agent", label: "Generator (wizard hat, band, bent tip)", Icon: PilotAgentCastGeneratorIcon, gaps: ["0.05","1.4 tight","1.88 standard","0.94 detail","0.82","2.69 open","0.85","0.82","2.69 open","2.8 open","4.69 open","1.78 standard"], counters: [2.66,0.2,1.04,2.98], notes: ["shapes 1 and 2 close to 0.05px in the filled variant (1.5px line); keep 0.875: move them 0.82 apart","shapes 1 and 2 leave a 0.05px gap; move them 0.82 apart for detail, or 1.07 apart for tight (or join them)","shapes 2 and 5 leave a 0.82px gap; move them 0.05 apart for detail, or 0.3 apart for tight (or join them)","shapes 3 and 4 leave a 0.85px gap; move them 0.02 apart for detail, or 0.27 apart for tight (or join them)","shapes 3 and 5 leave a 0.82px gap; move them 0.05 apart for detail, or 0.3 apart for tight (or join them)","ink 14.13×13.13 exceeds the square keyline 13×13"] },
  { group: "agent", label: "Guard, A: military cap, a larger star set lower", Icon: PilotAgentCastGuardStarIcon, gaps: ["2.42","1.88 standard","0.94 detail","1.57 tight","3.44 open","1.56 tight","3.44 open","0.56","0.86","2.25","3.08 open","4.66 open","1.78 standard"], counters: [3.19,0.57,2.73], notes: ["horizontal stroke at y 1.75 is off the 0.5px grid","shapes 1 and 5 leave a 2.42px gap; move them 0.08 apart for open, or 0.42 closer for standard (or join them)","shapes 4 and 5 leave a 0.56px gap; move them 0.32 apart for detail, or 0.57 apart for tight (or join them)","shapes 4 and 6 leave a 0.86px gap; move them 0.01 apart for detail, or 0.26 apart for tight (or join them)","shapes 4 and 7 leave a 2.25px gap; move them 0.25 closer for standard, or 0.25 apart for open (or join them)","ink 13.77×12.88 exceeds the square keyline 13×13"] },
  { group: "agent", label: "Guard, B: military cap with a stripe", Icon: PilotAgentCastGuardStripeIcon, gaps: ["0.85","1.88 standard","0.94 detail","1.57 tight","3.44 open","0.85","1.56 tight","3.44 open","1.39 tight","0.86","2.25","3.55 open","5.44 open","1.78 standard"], counters: [1.69,1.04,2.73], notes: ["horizontal stroke at y 1.75 is off the 0.5px grid","shapes 1 and 5 leave a 0.85px gap; move them 0.03 apart for detail, or 0.28 apart for tight (or join them)","shapes 3 and 5 leave a 0.85px gap; move them 0.03 apart for detail, or 0.28 apart for tight (or join them)","shapes 4 and 6 leave a 0.86px gap; move them 0.01 apart for detail, or 0.26 apart for tight (or join them)","shapes 4 and 7 leave a 2.25px gap; move them 0.25 closer for standard, or 0.25 apart for open (or join them)","ink 13.77×12.88 exceeds the square keyline 13×13"] },
  { group: "agent", label: "Lead (crown from the crown icon, full width)", Icon: PilotAgentCastLeadIcon, gaps: ["3.13 open","6.69 open","3.13 open","1.88 standard","0.94 detail","0.37","0.65","0.37","0.63","2.69 open","2","3.31 open","2","2 standard","4.06 open","4.45 open","9.8 open","5.6 open","8.81 open","4.45 open","7.01 open","8.5 open","5.6 open","8.81 open","1.78 standard"], counters: [1.54,0.68,0.68,0.43,2.98], notes: ["horizontal stroke at y 7.25 is off the 0.5px grid","horizontal stroke at y 5.875 is off the 0.5px grid","fill at 7.4,0.8 leaves the 1–15 drawing area","shapes 2 and 4 close to 0.37px in the filled variant (1.5px line); keep 0.875: move them 0.51 apart","shapes 2 and 4 leave a 0.37px gap; move them 0.51 apart for detail, or 0.76 apart for tight (or join them)","shapes 2 and 5 close to 0.65px in the filled variant (1.5px line); keep 0.875: move them 0.22 apart","shapes 2 and 5 leave a 0.65px gap; move them 0.22 apart for detail, or 0.47 apart for tight (or join them)","shapes 2 and 6 close to 0.37px in the filled variant (1.5px line); keep 0.875: move them 0.51 apart","shapes 2 and 6 leave a 0.37px gap; move them 0.51 apart for detail, or 0.76 apart for tight (or join them)","shapes 2 and 7 leave a 0.63px gap; move them 0.25 apart for detail, or 0.5 apart for tight (or join them)","shapes 3 and 4 leave a 2px gap; move them 0 closer for standard, or 0.25 closer for tight (or join them)","shapes 3 and 6 leave a 2px gap; move them 0 closer for standard, or 0.25 closer for tight (or join them)","ink 13.13×13.26 exceeds the square keyline 13×13"] },
  { group: "agent", label: "Researcher goggles, no mouth: solid lenses in a wide frame", Icon: PilotAgentCastResearcherGogDarkIcon, gaps: ["0.94 detail"], counters: [1.42,1.05,3.37], notes: ["horizontal stroke at y 10.25 is off the 0.5px grid","horizontal stroke at y 10.25 is off the 0.5px grid"] },
  { group: "agent", label: "Researcher goggles, no mouth: pushed up on the forehead, eyes showing", Icon: PilotAgentCastResearcherGogForeheadIcon, gaps: ["3.87 open","1.88 standard","3.12 open","0.63"], counters: [1.42,1.43,4.93], notes: ["horizontal stroke at y 4.75 is off the 0.5px grid","horizontal stroke at y 7.25 is off the 0.5px grid","shapes 3 and 4 leave a 0.63px gap; move them 0.25 apart for detail, or 0.5 apart for tight (or join them)"] },
  { group: "agent", label: "Researcher goggles, no mouth: a wide frame split into two lenses", Icon: PilotAgentCastResearcherGogSplitIcon, gaps: ["0.38","0.38","0.38"], counters: [1.42,0.43,1.68,1.68,2.68], notes: ["horizontal stroke at y 10.25 is off the 0.5px grid","horizontal stroke at y 10.25 is off the 0.5px grid","shapes 1 and 4 leave a 0.38px gap; move them 0.5 apart for detail, or 0.75 apart for tight (or join them)","shapes 2 and 3 close to 0.38px in the filled variant (1.5px line); keep 0.875: move them 0.5 apart","shapes 2 and 3 leave a 0.38px gap; move them 0.5 apart for detail, or 0.75 apart for tight (or join them)","shapes 2 and 4 close to 0.38px in the filled variant (1.5px line); keep 0.875: move them 0.5 apart","shapes 2 and 4 leave a 0.38px gap; move them 0.5 apart for detail, or 0.75 apart for tight (or join them)","ink 14.13×12.63 exceeds the square keyline 13×13"] },
  { group: "agent", label: "Researcher goggles, no mouth: a frame inside the head, a strap across it", Icon: PilotAgentCastResearcherGogStrapIcon, gaps: ["0.63","4.58 open"], counters: [1.42,0.68,1.43,2.18], notes: ["horizontal stroke at y 7.75 is off the 0.5px grid","horizontal stroke at y 10.25 is off the 0.5px grid","horizontal stroke at y 8.75 is off the 0.5px grid","horizontal stroke at y 8.75 is off the 0.5px grid","shapes 2 and 3 close to 0.63px in the filled variant (1.5px line); keep 0.875: move them 0.25 apart","shapes 2 and 3 leave a 0.63px gap; move them 0.25 apart for detail, or 0.5 apart for tight (or join them)","ink 14.13×12.63 exceeds the square keyline 13×13"] },
  { group: "agent", label: "Researcher goggles, no mouth: two round lenses, straps past the head", Icon: PilotAgentCastResearcherGogSwimIcon, gaps: ["1.3 tight","2.13"], counters: [1.42,1.93,0.26,2.88,2.88,0.26,2.68], notes: ["horizontal stroke at y 9.25 is off the 0.5px grid","horizontal stroke at y 9.25 is off the 0.5px grid","horizontal stroke at y 9.25 is off the 0.5px grid","shapes 2 and 4 leave a 2.13px gap; move them 0.13 closer for standard, or 0.38 closer for tight (or join them)","ink 14.13×12.63 exceeds the square keyline 13×13"] },
  { group: "agent", label: "Researcher goggles, no mouth: one wide frame over the head, a nose notch", Icon: PilotAgentCastResearcherGogWideIcon, gaps: ["0.38"], counters: [1.42,0.43,1.68,2.68], notes: ["horizontal stroke at y 10.25 is off the 0.5px grid","horizontal stroke at y 10.25 is off the 0.5px grid","shapes 2 and 3 close to 0.38px in the filled variant (1.5px line); keep 0.875: move them 0.5 apart","shapes 2 and 3 leave a 0.38px gap; move them 0.5 apart for detail, or 0.75 apart for tight (or join them)","ink 14.13×12.63 exceeds the square keyline 13×13"] },
  { group: "agent", label: "Researcher (bot in lab goggles wider than its head)", Icon: PilotAgentCastResearcherIcon, gaps: ["0.94 detail","0.38","3.94 open","0.28"], counters: [1.42,0.43,1.68,2.18], notes: ["horizontal stroke at y 10.25 is off the 0.5px grid","horizontal stroke at y 10.25 is off the 0.5px grid","shapes 2 and 3 close to 0.38px in the filled variant (1.5px line); keep 0.875: move them 0.5 apart","shapes 2 and 3 leave a 0.38px gap; move them 0.5 apart for detail, or 0.75 apart for tight (or join them)","shapes 3 and 4 leave a 0.28px gap; move them 0.6 apart for detail, or 0.85 apart for tight (or join them)","ink 14.13×12.63 exceeds the square keyline 13×13"] },
  { group: "agent", label: "Scholar (mortarboard)", Icon: PilotAgentCastScholarIcon, gaps: ["1.78 standard","0.03","1.88 standard","0.94 detail","1.14 tight","3.52 open","4.96 open","1.23 tight","4.62 open","0.83","2.69 open","1.78 standard"], counters: [2.28,1.71,2.98], notes: ["shapes 1 and 3 close to 0.03px in the filled variant (1.5px line); keep 0.875: move them 0.85 apart","shapes 1 and 3 leave a 0.03px gap; move them 0.85 apart for detail, or 1.1 apart for tight (or join them)","shapes 4 and 5 leave a 0.83px gap; move them 0.05 apart for detail, or 0.3 apart for tight (or join them)"] },
  { group: "agent", label: "current: Fluent’s agents hexagon", Icon: PilotAgentCurrentIcon, gaps: [], counters: [], notes: [] },
  { group: "agent", label: "Cursor’s agent mark: infinity", Icon: PilotAgentInfinityIcon, gaps: [], counters: [3.88,3.88], notes: [] },
];
