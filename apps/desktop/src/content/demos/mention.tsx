/** Mention gallery specimens: one variant per tile, each inside a line of body text, as a mention is read.
 *  docs/specs/mention.md (components audit N3, 2026-11-07). The Composer's @ list is in composer-additions.tsx. */
import { Mention, Message, withMentions } from "@area/react";
import { PeopleIcon } from "@area/icons";

/* A mention keeps the type and the ink of the text around it, so every tile is a sentence of body text. */
const line = { margin: 0, maxInlineSize: "calc(var(--area-space-96) * 3)" };

export const GalleryMention = () => <p style={line}>Body text <Mention>David Tee</Mention> body text.</p>;
export const GalleryMentionPlain = () => <p style={line}>Body text <Mention variant="plain">David Tee</Mention> body text.</p>;
export const GalleryMentionUnderline = () => <p style={line}>Body text <Mention variant="underline" kind="page" href="#gallery-mention-underline">Item one</Mention> body text.</p>;
export const GalleryMentionTeam = () => <p style={line}>Body text <Mention icon={<PeopleIcon size={12} />}>Design team</Mention> body text.</p>;
export const GalleryMentionPicture = () => <p style={line}>Body text <Mention icon={<img src="images/david-tee.jpg" alt="" />}>David Tee</Mention> body text.</p>;
export const GalleryMentionFile = () => <p style={line}>Body text <Mention kind="file">Item one.pdf</Mention> body text.</p>;
export const GalleryMentionPage = () => <p style={line}>Body text <Mention kind="page" href="#gallery-mention-page">Item one</Mention> body text.</p>;
export const GalleryMentionDate = () => <p style={line}>Body text <Mention kind="date" dateTime="2026-11-09">Monday</Mention> body text.</p>;
/* A date that has come or passed: the danger ink, and "Due" said after it. */
export const GalleryMentionDue = () => <p style={line}>Body text <Mention kind="date" dateTime="2026-11-07" due>Today</Mention> body text.</p>;
/* With onClick it is a button (a person's card, a date's picker); with href a link. */
export const GalleryMentionButton = () => <p style={line}>Body text <Mention onClick={() => {}}>David Tee</Mention> body text.</p>;
/* A long mention wraps with its sentence; the plate is drawn on each line. */
export const GalleryMentionWrap = () => (
  <p style={{ ...line, maxInlineSize: "calc(var(--area-space-96) * 2)" }}>Body text body text <Mention kind="page" href="#gallery-mention-wrap">Item one, a title long enough to wrap</Mention> body text.</p>
);
/* A sent message: the draft held the mention's words ("@David Tee"); withMentions draws them again. */
export const GalleryMentionMessage = () => (
  <div style={{ inlineSize: 280 }}>
    <Message author="user">{withMentions("Body text @David Tee and @Design team, body text @Item one.pdf.", [
      { label: "David Tee" }, { label: "Design team", icon: <PeopleIcon size={12} /> }, { label: "Item one.pdf", kind: "file" },
    ])}</Message>
  </div>
);
