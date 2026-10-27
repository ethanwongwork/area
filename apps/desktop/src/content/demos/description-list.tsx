/** Description list gallery specimens: one variant per tile. docs/specs/description-list.md. */
import { Avatar, Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, DescriptionList, DescriptionListItem, Link } from "@area/react";
import { CalendarIcon, CircleDashedIcon, ClockIcon, FolderIcon, MoreHorizontalIcon, PersonIcon, TagIcon } from "@area/icons";

/* A page's properties (Notion's columns) and an account's facts (ChatGPT's settings card). */
const page = { inlineSize: "calc(var(--area-space-96) * 4)", flex: "none" }; /* a fixed width: the tile's flex row would shrink a grid list to its narrowest */

export const GalleryDescriptionList = () => (
  <DescriptionList style={page}>
    <DescriptionListItem term="Label" icon={<CircleDashedIcon />}>Value</DescriptionListItem>
    <DescriptionListItem term="Label" icon={<PersonIcon />}>David Tee</DescriptionListItem>
    <DescriptionListItem term="Label" icon={<CalendarIcon />}>October 14, 2026</DescriptionListItem>
    <DescriptionListItem term="Label" icon={<FolderIcon />}>Value</DescriptionListItem>
  </DescriptionList>
);
export const GalleryDescriptionListNoIcons = () => (
  <DescriptionList style={page}>
    <DescriptionListItem term="Label">Value</DescriptionListItem>
    <DescriptionListItem term="Label">Value</DescriptionListItem>
    <DescriptionListItem term="Label">Value</DescriptionListItem>
  </DescriptionList>
);
/* Values that are components: a Badge, a person and a Link. */
export const GalleryDescriptionListRich = () => (
  <DescriptionList style={page}>
    <DescriptionListItem term="Label" icon={<CircleDashedIcon />}><Badge>Badge</Badge></DescriptionListItem>
    <DescriptionListItem term="Label" icon={<PersonIcon />}><span style={{ display: "inline-flex", alignItems: "center", gap: "var(--area-space-6)" }}><Avatar size="sm" fallback="D" alt="" />David Tee</span></DescriptionListItem>
    <DescriptionListItem term="Label" icon={<FolderIcon />}><Link href="#gallery-description-list-content-rich">Link</Link></DescriptionListItem>
  </DescriptionList>
);
export const GalleryDescriptionListJustified = () => (
  <DescriptionList style={page} layout="justified">
    <DescriptionListItem term="Label">Value</DescriptionListItem>
    <DescriptionListItem term="Label">Value</DescriptionListItem>
    <DescriptionListItem term="Label">March 2024</DescriptionListItem>
  </DescriptionList>
);
export const GalleryDescriptionListDivided = () => (
  <DescriptionList style={page} divided>
    <DescriptionListItem term="Label">Value</DescriptionListItem>
    <DescriptionListItem term="Label">Value</DescriptionListItem>
    <DescriptionListItem term="Label">Value</DescriptionListItem>
  </DescriptionList>
);
/* ChatGPT's account card: justified rows, divided, in a frame. */
export const GalleryDescriptionListFramed = () => (
  <DescriptionList style={page} layout="justified" divided framed>
    <DescriptionListItem term="Label">Value</DescriptionListItem>
    <DescriptionListItem term="Label">Value</DescriptionListItem>
    <DescriptionListItem term="Label">March 2024</DescriptionListItem>
  </DescriptionList>
);
/* The first three properties, then "Show 3 more" (Notion's "N more properties"). */
export const GalleryDescriptionListShowMore = () => (
  <DescriptionList style={page} visibleCount={3}>
    <DescriptionListItem term="Label" icon={<CircleDashedIcon />}>Value</DescriptionListItem>
    <DescriptionListItem term="Label" icon={<PersonIcon />}>David Tee</DescriptionListItem>
    <DescriptionListItem term="Label" icon={<CalendarIcon />}>October 14, 2026</DescriptionListItem>
    <DescriptionListItem term="Label" icon={<FolderIcon />}>Value</DescriptionListItem>
    <DescriptionListItem term="Label" icon={<TagIcon />}>Value</DescriptionListItem>
    <DescriptionListItem term="Label" icon={<ClockIcon />}>2 hours ago</DescriptionListItem>
  </DescriptionList>
);

/* A subject's summary (the job Infobox did until it was removed, owner 2026-10-26): a Card whose header carries the
   subject (a picture, a title, a description, one action) and whose content is its facts. */
export const GalleryDescriptionListSummary = () => (
  <Card style={{ inlineSize: "calc(var(--area-space-96) * 3)", maxInlineSize: "100%" }}>
    {/* Card's text parts sit in its content, the text inset from the edge (16; was straight in the card at its 8 media
        inset, owner 2026-10-26: "the padding on this card is too small"); the list follows the header at the content's
        block gap, its terms on the header's line. */}
    <CardContent>
      <CardHeader action={<Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label="More options" icon={<MoreHorizontalIcon />} />}>
        <span style={{ display: "flex", alignItems: "center", gap: "var(--area-space-12)" }}>
          <Avatar size="lg" src="images/david-tee.jpg" fallback="DT" alt="" />
          <span style={{ display: "grid", gap: "var(--area-space-2)" }}><CardTitle>David Tee</CardTitle><CardDescription>Description</CardDescription></span>
        </span>
      </CardHeader>
      <DescriptionList>
        <DescriptionListItem term="Label">Value</DescriptionListItem>
        <DescriptionListItem term="Label">October 14, 2026</DescriptionListItem>
        <DescriptionListItem term="Label"><Link variant="standalone" href="#gallery-description-list-summary">Link</Link></DescriptionListItem>
      </DescriptionList>
    </CardContent>
  </Card>
);

