/** Link gallery specimens: one variant per tile. docs/specs/link.md. */
import { Link } from "@area/react";

const prose = { margin: 0 };
/* A caption, as ChatGPT's composer note: the link takes the caption's size and muted ink. */
const caption = { margin: 0, color: "var(--area-fg-muted)", fontSize: "var(--area-text-xs-size)", lineHeight: "var(--area-text-xs-leading)" };

export const GalleryLink = () => <p style={prose}>Body text with a <Link href="#gallery-link-default">link</Link>.</p>;
export const GalleryLinkStandalone = () => <Link variant="standalone" href="#gallery-link-variant-standalone">Link</Link>;
export const GalleryLinkMuted = () => <Link ink="muted" variant="standalone" href="#gallery-link-ink-muted">Link</Link>;
/* A UI link in blue, as ChatGPT's settings and Figma's file browser draw theirs; in a sentence it stays underlined. */
export const GalleryLinkBlue = () => <p style={caption}>Caption text. <Link ink="blue" href="#gallery-link-ink-blue">Link</Link></p>;
/* A link in a hue: the readable ink of the colour, always underlined in a sentence. */
export const GalleryLinkPurple = () => <p style={prose}>Body text with a <Link ink="purple" href="#gallery-link-ink-purple">link</Link>.</p>;
export const GalleryLinkPink = () => <p style={prose}>Body text with a <Link ink="pink" href="#gallery-link-ink-pink">link</Link>.</p>;
export const GalleryLinkGreen = () => <p style={prose}>Body text with a <Link ink="green" href="#gallery-link-ink-green">link</Link>.</p>;
export const GalleryLinkRed = () => <p style={prose}>Body text with a <Link ink="red" href="#gallery-link-ink-red">link</Link>.</p>;
export const GalleryLinkOrange = () => <p style={prose}>Body text with a <Link ink="orange" href="#gallery-link-ink-orange">link</Link>.</p>;
export const GalleryLinkBrown = () => <p style={prose}>Body text with a <Link ink="brown" href="#gallery-link-ink-brown">link</Link>.</p>;
export const GalleryLinkAction = () => <p style={prose}>Body text. <Link ink="action" href="#gallery-link-ink-action">Link</Link></p>;
export const GalleryLinkCaption = () => <p style={caption}>Caption with a <Link href="#gallery-link-content-caption">link</Link>.</p>;
/* A place with no address (the rest of a list): the same text as a native button, pressed with Space or Enter. */
export const GalleryLinkButton = () => <Link as="button" variant="standalone" ink="muted">Show all 12</Link>;
export const GalleryLinkExternal = () => <p style={prose}>Body text with a <Link external href="https://help.figma.com/">link</Link>.</p>;
export const GalleryLinkWrapped = () => <p style={{ ...prose, maxInlineSize: "calc(var(--area-space-96) * 2)" }}>Body text with a <Link href="#gallery-link-content-wrap">link that wraps onto a second line of the paragraph</Link>.</p>;
