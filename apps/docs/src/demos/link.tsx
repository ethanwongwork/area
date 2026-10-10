/** Link gallery specimens: one variant per tile. docs/specs/link.md. */
import { Link } from "@area/react";

const prose = { margin: 0 };
/* A caption, as ChatGPT's composer note: the link takes the caption's size and muted ink. */
const caption = { margin: 0, color: "var(--area-fg-muted)", fontSize: "var(--area-text-xs-size)", lineHeight: "var(--area-text-xs-leading)" };

export const GalleryLink = () => <p style={prose}>Read the <Link href="#gallery-link-default">usage guide</Link> before you start.</p>;
export const GalleryLinkStandalone = () => <Link variant="standalone" href="#gallery-link-variant-standalone">View all</Link>;
export const GalleryLinkMuted = () => <Link ink="muted" variant="standalone" href="#gallery-link-ink-muted">Learn more</Link>;
/* A UI link in blue, as ChatGPT's settings and Figma's file browser draw theirs; in a sentence it stays underlined. */
export const GalleryLinkBlue = () => <p style={caption}>Buy credits to keep working when you reach your limit. <Link ink="blue" href="#gallery-link-ink-blue">Learn more</Link></p>;
export const GalleryLinkAction = () => <p style={prose}>Your export is ready. <Link ink="action" href="#gallery-link-ink-action">Open it</Link></p>;
export const GalleryLinkCaption = () => <p style={caption}>Answers can be wrong. Check the <Link href="#gallery-link-content-caption">sources</Link>.</p>;
export const GalleryLinkExternal = () => <p style={prose}>See <Link external href="https://help.figma.com/">Figma's help center</Link> for shortcuts.</p>;
export const GalleryLinkWrapped = () => <p style={{ ...prose, maxInlineSize: "calc(var(--area-space-96) * 2)" }}>Shared with the <Link href="#gallery-link-content-wrap">design systems team and everyone at David Tee's studio</Link> this week.</p>;
