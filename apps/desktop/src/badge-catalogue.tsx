/**
 * Every badge that can label something in Area (owner, 2026-11-02: "create a table for all the potential badges that can
 * show up to label a design, image, typeface, color, etc. be thorough"; then "trim down the copy on all the badges", "i
 * prefer just the icon in the nav by itself with no backplate, but prefer backplates on badges everywhere else", "keep icon
 * use intentional and limited to necessary instances, and be very intentional about color usage. i prefer the orange
 * colored badges over the yellow/gold"). One list, by what a badge says, each on its plate, a status's bare mark as the
 * Sidebar draws it, what it labels and what it means. Labs › Feed draws it as tables (BadgeTables); pages take their words
 * and tones from it.
 *
 * The rules:
 *   words   the shortest name for it, one or two words ("Draft", not "Not published"; "3 changes", not "3 unpublished
 *           changes"); a badge never says what its card's name or the page already says.
 *   plate   every badge on its tone's soft plate; only the Sidebar draws a status bare, its mark alone.
 *   icon    a status's mark and nothing else: the mark is the Sidebar's whole badge, so the card's badge carries it to teach
 *           it. Every other badge is words alone (a video, a lock or a star beside its word said it twice).
 *   colour  one meaning per hue, and grey unless the badge asks something of you:
 *             green   done or passing           Published, Complete, AA, +12%
 *             blue    active or new to you      Active, New, Edited, Licensed
 *             purple  not final                 In review, Beta, Lab
 *             orange  needs you                 Draft, Changes, Not installed, Outdated, AA Large
 *             red     stopped or failing        Blocked, Failed, Missing, Fails, −6%
 *             grey    a fact, a default, put away   Variable, PNG, Default, To do, Archived
 *           Gold (caution) is not used: orange carries "needs you" alone.
 */
import { Badge, Count, Table, TableCell, TableHeaderCell } from "@area/react";
import { CanvasSection, FEED_TABLE, StatusBadge, type Status } from "./tile.tsx";

type Tone = "neutral" | "info" | "success" | "warning" | "danger" | "discovery";
export interface BadgeEntry {
  label: string;
  /** A status: StatusBadge, its tone and mark from `STATUS`. */
  status?: Status;
  tone?: Tone;
  /** A count, drawn by Count. */
  count?: number;
  /** What it labels. */
  on: readonly string[];
  means: string;
}
export interface BadgeGroup { id: string; title: string; lede: string; badges: readonly BadgeEntry[] }

export const BADGE_GROUPS: readonly BadgeGroup[] = [
  {
    id: "status", title: "Status badges",
    lede: "Where a thing is in its work: its mark and the state's word on the tone's plate; in the Sidebar, the mark alone.",
    badges: [
      { label: "Published", status: "published", on: ["Project", "Design", "Version"], means: "Done and out." },
      { label: "Live", status: "published", on: ["System", "Theme"], means: "The version in use." },
      { label: "Complete", status: "published", on: ["Component"], means: "Confirmed by the owner." },
      { label: "Approved", status: "published", on: ["Icon", "Design"], means: "Reviewed and kept." },
      { label: "Active", status: "progress", on: ["Project", "Design", "Component"], means: "Being worked on." },
      { label: "In review", status: "review", on: ["Component", "Icon", "Design"], means: "Waiting for a yes." },
      { label: "Changes", status: "changes", on: ["Component", "Icon", "Design"], means: "Reviewed; something to fix." },
      { label: "Draft", status: "draft", on: ["Project", "Design", "Page"], means: "Not yet published." },
      { label: "3 changes", status: "draft", on: ["System", "Theme"], means: "Unpublished changes to the live version." },
      { label: "To do", status: "none", on: ["Component", "Icon", "Design"], means: "Listed, not started (Unrefined, Not reviewed)." },
      { label: "Blocked", status: "blocked", on: ["Project", "Design", "Component"], means: "Waiting on something else." },
      { label: "Failed", status: "blocked", on: ["Export", "Import"], means: "A run that did not finish." },
      { label: "Archived", status: "archived", on: ["Project", "Design", "System"], means: "Put away; read-only." },
      { label: "Deprecated", status: "archived", on: ["Component", "Icon", "Token"], means: "Replaced; still drawn." },
    ],
  },
  {
    id: "kind", title: "Kind and format badges",
    lede: "Facts about the thing itself: grey, no mark, so they never compete with a status.",
    badges: [
      { label: "Screen", tone: "neutral", on: ["Design"], means: "A whole window." },
      { label: "Pattern", tone: "neutral", on: ["Design", "Component"], means: "Several components composed." },
      { label: "Theme", tone: "neutral", on: ["Design", "System"], means: "A system's look on a screen." },
      { label: "16:9", tone: "neutral", on: ["Design", "Image"], means: "Its ratio, where the gallery's differs." },
      { label: "1080p", tone: "neutral", on: ["Image", "Design"], means: "Its size." },
      { label: "PNG", tone: "neutral", on: ["Image"], means: "Its format: PNG, JPG, WebP, SVG, GIF." },
      { label: "Video", tone: "neutral", on: ["Image"], means: "Moving: a video or an animation." },
      { label: "Variable", tone: "neutral", on: ["Typeface"], means: "Every weight in one file; else Static." },
      { label: "Serif", tone: "neutral", on: ["Typeface"], means: "Its class: Sans, Serif, Mono, Display." },
      { label: "18 styles", tone: "neutral", on: ["Typeface"], means: "How many styles it draws." },
      { label: "Filled", tone: "neutral", on: ["Icon"], means: "Its drawing; Outline is the default and says nothing." },
      { label: "12px", tone: "neutral", on: ["Icon"], means: "Drawn again for the 12 slot." },
      { label: "Mirrors", tone: "neutral", on: ["Icon"], means: "Flips in right-to-left text." },
      { label: "Alias", tone: "neutral", on: ["Icon", "Token"], means: "Another name for one that exists." },
      { label: "Role", tone: "neutral", on: ["Color"], means: "A semantic color, not a scale's step." },
      { label: "P3", tone: "neutral", on: ["Color"], means: "Brighter on wide-gamut screens." },
    ],
  },
  {
    id: "source", title: "Source and availability badges",
    lede: "Where it comes from: grey when using it asks nothing, blue to note a condition, orange when it needs you, red when it is gone.",
    badges: [
      { label: "Built in", tone: "neutral", on: ["Typeface", "Icon"], means: "Ships with Area." },
      { label: "System", tone: "neutral", on: ["Typeface"], means: "The operating system's own." },
      { label: "Installed", tone: "neutral", on: ["Typeface"], means: "Drawn from this Mac's copy." },
      { label: "Licensed", tone: "info", on: ["Typeface", "Image"], means: "Publishing needs a licence." },
      { label: "Not installed", tone: "warning", on: ["Typeface"], means: "Install it to see it." },
      { label: "Saved", tone: "neutral", on: ["Image"], means: "In your References." },
      { label: "Starred", tone: "neutral", on: ["Image", "Design", "Icon"], means: "Marked by you." },
      { label: "Duplicate", tone: "neutral", on: ["Image"], means: "Saved twice." },
      { label: "Outdated", tone: "warning", on: ["Project", "Design"], means: "Its system has a newer version." },
      { label: "Missing", tone: "danger", on: ["Image", "Typeface"], means: "Its file is gone." },
    ],
  },
  {
    id: "lifecycle", title: "Lifecycle badges",
    lede: "What changed and how settled it is: blue for news, purple for not final, grey for the default.",
    badges: [
      { label: "New", tone: "info", on: ["Component", "Icon", "Typeface", "Design"], means: "Added since your last look." },
      { label: "Updated", tone: "info", on: ["Component", "Icon", "Design"], means: "Changed since your last look." },
      { label: "Edited", tone: "info", on: ["Color", "Setting", "Theme"], means: "Moved from the system's value." },
      { label: "Beta", tone: "discovery", on: ["Component", "Setting"], means: "Usable; its API may change." },
      { label: "Lab", tone: "discovery", on: ["Page", "Setting"], means: "An experiment." },
      { label: "Default", tone: "neutral", on: ["Color", "Setting", "Theme"], means: "The system's own value." },
      { label: "v3", tone: "neutral", on: ["System", "Design"], means: "A version." },
    ],
  },
  {
    id: "quality", title: "Quality badges",
    lede: "A measure against a bar: green clears it, orange clears it only for large text, red misses it.",
    badges: [
      { label: "AAA", tone: "success", on: ["Color"], means: "7:1 or more with its text." },
      { label: "AA", tone: "success", on: ["Color"], means: "4.5:1, body text's floor." },
      { label: "AA Large", tone: "warning", on: ["Color"], means: "3:1: large text and marks only." },
      { label: "Fails", tone: "danger", on: ["Color"], means: "Under 3:1." },
    ],
  },
  {
    id: "change", title: "Change and count badges",
    lede: "A number's movement in its direction's color; how many a collection holds, as Count.",
    badges: [
      { label: "+12%", tone: "success", on: ["Data"], means: "Up, where up is good." },
      { label: "−6%", tone: "danger", on: ["Data"], means: "Down, where down is bad." },
      { label: "0%", tone: "neutral", on: ["Data"], means: "No change." },
      { label: "Count", count: 23, on: ["Collection", "Section", "Scale"], means: "How many it holds." },
    ],
  },
];

/** A badge on its plate. */
function Plated({ badge }: { badge: BadgeEntry }) {
  if (badge.count !== undefined) return <Count variant="soft" size="sm" count={badge.count} />;
  if (badge.status) return <StatusBadge status={badge.status}>{badge.label}</StatusBadge>;
  return <Badge variant="soft" tone={badge.tone}>{badge.label}</Badge>;
}

/** Each group a section: the badge on its plate, a status's Sidebar mark, what it labels and what it means. */
export function BadgeTables() {
  return (
    <>
      {BADGE_GROUPS.map(group => {
        const marks = group.badges.some(badge => badge.status);
        return (
          <CanvasSection key={group.id} id={`feed-badges-${group.id}`} title={group.title} count={group.badges.length} lede={group.lede}>
            <Table wrapperProps={FEED_TABLE} baseline aria-label={group.title}>
              <thead><tr>
                <TableHeaderCell fit>Badge</TableHeaderCell>
                {marks ? <TableHeaderCell fit>Sidebar</TableHeaderCell> : null}
                <TableHeaderCell fit>Labels</TableHeaderCell>
                <TableHeaderCell>Means</TableHeaderCell>
              </tr></thead>
              <tbody>
                {group.badges.map(badge => (
                  <tr key={badge.label}>
                    <TableCell fit><Plated badge={badge} /></TableCell>
                    {marks ? <TableCell fit>{badge.status ? <StatusBadge status={badge.status} iconOnly>{badge.label}</StatusBadge> : null}</TableCell> : null}
                    <TableCell fit className="studio-muted">{badge.on.join(", ")}</TableCell>
                    <TableCell className="studio-muted">{badge.means}</TableCell>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CanvasSection>
        );
      })}
    </>
  );
}
