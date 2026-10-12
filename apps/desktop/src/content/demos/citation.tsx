/** Citation gallery specimens: one variant per tile, each in an answer's prose. docs/specs/citation.md. */
import type { CSSProperties, ReactNode } from "react";
import { Citation, HoverCard, Message, PopoverDescription, PopoverTitle } from "@area/react";
import { LinkIcon } from "../../../../docs/src/icons.tsx";
import { PilotBookIcon } from "../../../../docs/src/pilot-icons.tsx";

const column: CSSProperties = { inlineSize: "calc(var(--area-space-96) * 4)", maxInlineSize: "100%" };
/* An assistant answer; the citation follows the sentence it supports. */
const Answer = ({ children }: { children: ReactNode }) => (
  <div style={column}><Message author="assistant" authorName="Assistant">
    <p>Laser projectors keep their brightness for years and need no warm-up.{children}</p>
  </Message></div>
);

export const GalleryCitation = () => <Answer><Citation href="#citation" label="Projector guide" title="How laser projectors work" /></Answer>;
/* ChatGPT's favicon at the start. */
export const GalleryCitationIcon = () => <Answer><Citation href="#citation" icon={<PilotBookIcon />} label="Projector guide" title="How laser projectors work" /></Answer>;
/* More sources behind this one: "+2". */
export const GalleryCitationMore = () => <Answer><Citation href="#citation" icon={<PilotBookIcon />} label="Projector guide" title="How laser projectors work" more={2} /></Answer>;
/* A long name is cut at 15 characters. */
export const GalleryCitationLong = () => <Answer><Citation href="#citation" icon={<PilotBookIcon />} label="The projector buyer's handbook" title="Choosing a home projector" more={1} /></Answer>;
/* Hover or focus previews the source in a Hover card. */
export const GalleryCitationHoverCard = () => (
  <Answer>
    <HoverCard trigger={<Citation href="#citation" icon={<PilotBookIcon />} label="Projector guide" title="How laser projectors work" />}>
      <div><PopoverTitle level={false}>How laser projectors work</PopoverTitle><PopoverDescription>Laser light sources hold their brightness for about 20,000 hours and start instantly.</PopoverDescription></div>
      <div className="area-hover-card__meta"><span><LinkIcon />projector-guide.example</span></div>
    </HoverCard>
  </Answer>
);
