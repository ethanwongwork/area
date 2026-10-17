/** Citation gallery specimens: one variant per tile, each in an answer's prose. docs/specs/citation.md. */
import type { CSSProperties, ReactNode } from "react";
import { Citation, HoverCard, Link, Message, PopoverDescription, PopoverTitle } from "@area/react";
import { BookIcon, LinkIcon } from "@area/icons";

const column: CSSProperties = { inlineSize: "calc(var(--area-space-96) * 4)", maxInlineSize: "100%" };
/* An assistant answer; the citation follows the sentence it supports. A hover card holds block
   content, so its answer is flow content (a div), never a <p> (hover-card.md, "Server rendering"). */
const Answer = ({ children, flow }: { children: ReactNode; flow?: boolean }) => {
  const Text = flow ? "div" : "p";
  return (
    <div style={column}><Message author="assistant" authorName="Assistant">
      <Text>Laser projectors keep their brightness for years and need no warm-up.{children}</Text>
    </Message></div>
  );
};

export const GalleryCitation = () => <Answer><Citation href="#citation" label="Projector guide" title="How laser projectors work" /></Answer>;
/* ChatGPT's favicon at the start. */
export const GalleryCitationIcon = () => <Answer><Citation href="#citation" icon={<BookIcon />} label="Projector guide" title="How laser projectors work" /></Answer>;
/* More sources behind this one: "+2". */
export const GalleryCitationMore = () => <Answer><Citation href="#citation" icon={<BookIcon />} label="Projector guide" title="How laser projectors work" more={2} /></Answer>;
/* A long name is cut at 15 characters. */
export const GalleryCitationLong = () => <Answer><Citation href="#citation" icon={<BookIcon />} label="The projector buyer's handbook" title="Choosing a home projector" more={1} /></Answer>;
/* Hover or focus previews the source in a Hover card. */
export const GalleryCitationHoverCard = () => (
  <Answer flow>
    <HoverCard trigger={<Citation href="#citation" icon={<BookIcon />} label="Projector guide" title="How laser projectors work" />}>
      <div><PopoverTitle level={false}>How laser projectors work</PopoverTitle><PopoverDescription>Laser light sources hold their brightness for about 20,000 hours and start instantly.</PopoverDescription></div>
      <div className="area-hover-card__meta"><span><LinkIcon />projector-guide.example</span></div>
    </HoverCard>
  </Answer>
);

/* Footnote: Wikipedia's numbered reference, raised after the word it supports, in an article's prose. */
const article: CSSProperties = { margin: 0, inlineSize: "calc(var(--area-space-96) * 4)", maxInlineSize: "100%" };
export const GalleryCitationFootnote = () => (
  <p style={article}>Laser projectors keep their brightness for years and need no warm-up.<Citation variant="footnote" href="#cite-note-13" label="13" title="How laser projectors work" /></p>
);
/* Beside an underlined link in the same blue, as Wikipedia's "Systems[13]". */
export const GalleryCitationFootnoteLink = () => (
  <p style={article}>The lamp was replaced by <Link ink="blue" href="#gallery-citation-footnote-link">laser light sources</Link><Citation variant="footnote" href="#cite-note-4" label="4" /> in most home models.<Citation variant="footnote" href="#cite-note-5" label="5" /></p>
);
/* In the text's own ink. */
export const GalleryCitationFootnoteInherit = () => (
  <p style={article}>Laser projectors keep their brightness for years and need no warm-up.<Citation variant="footnote" ink="inherit" href="#cite-note-13" label="13" /></p>
);
/* Hover or focus previews the source, as Wikipedia's reference previews. */
export const GalleryCitationFootnoteHoverCard = () => (
  <div style={article}>Laser projectors keep their brightness for years and need no warm-up.
    <HoverCard trigger={<Citation variant="footnote" href="#cite-note-13" label="13" title="How laser projectors work" />}>
      <div><PopoverTitle level={false}>How laser projectors work</PopoverTitle><PopoverDescription>Laser light sources hold their brightness for about 20,000 hours and start instantly.</PopoverDescription></div>
      <div className="area-hover-card__meta"><span><LinkIcon />projector-guide.example</span></div>
    </HoverCard>
  </div>
);
