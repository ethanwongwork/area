/**
 * The activity log (owner, 2026-11-02, with a reference: "a notification style activity tracker that tracks what changes
 * have been made or things that have been done for a project", for the Feed kit and the Chat kit): a project's events by
 * day, newest first, on Area's Timeline. Each day is a group label (the rows' size, 500, muted; no rule); each event its
 * kind's 16 icon, bare, on the line (Timeline's icon mark; owner, 2026-11-03: "are these icons necessary to be inside a
 * circle, maybe make them standalone and bigger"), in a tone's ink only where the event has an outcome or asks for
 * something, the tones meaning what they mean on a status badge (EVENTS below); who
 * did it (David Tee, or a team, an avatar as tall as the line), what, and when; the events with more carry a card under
 * them, the chat's frame (12 in, the cards' stroke): checks that ran, a comment, a file; token and component changes are
 * the feed's framed Table at its default rows (the small rows left a code chip no room, 2026-11-03). A palette mark is
 * for color only; tokens take braces.
 *
 * Copy is a design system project's real, generic activity (owner, 2026-11-02: "use real generic chat/code/design specific
 * copy"), never an em dash, never a product; people are David Tee, the rest teams.
 */
import type { ReactNode } from "react";
import { Avatar, Button, Card, Code, Table, TableCell, TableHeaderCell, Timeline, TimelineItem } from "@area/react";
import { AlertCircleIcon, BracesIcon, PeopleIcon, AttachIcon, ChatIcon, CheckIcon, DocumentIcon, DownloadIcon, EyeIcon, LayersIcon, RocketIcon, StarIcon, StatusAvailableFilledIcon, TagIcon } from "@area/icons";
import { CARD_SCOPE, FEED_TABLE } from "./tile.tsx";

type Ink = "success" | "discovery" | "info" | "warning" | "danger" | "muted";
type Kind = keyof typeof EVENTS;
/**
 * Every kind of event and its mark. Color is meaning, the same meaning it has on a status badge (tile.tsx STATUS): an
 * outcome (success: it went live or passed), a request on someone (discovery: review it; warning: change it), something
 * urgent (danger), or something to read (info). Routine work with nothing to flag (changes, files, stars) keeps the
 * mark's own quiet ink, so a colored mark is always worth a look.
 */
export const EVENTS = {
  published: { icon: <RocketIcon />, ink: "success", event: "Published", why: "It went live: the green of a Published status" },
  approved: { icon: <CheckIcon />, ink: "success", event: "Approved", why: "A positive outcome, the same green" },
  review: { icon: <EyeIcon />, ink: "discovery", event: "Review requested", why: "Waiting on someone's review: In review's purple" },
  changes: { icon: <AlertCircleIcon />, ink: "warning", event: "Changes requested", why: "Someone needs to act: Changes requested's orange" },
  priority: { icon: <TagIcon />, ink: "danger", event: "Marked priority", why: "Urgent: Blocked's red" },
  commented: { icon: <ChatIcon />, ink: "info", event: "Commented", why: "Something to read: information's blue" },
  tokens: { icon: <BracesIcon />, ink: "muted", event: "Changed tokens", why: "Routine work, nothing to flag: the quiet mark" },
  components: { icon: <LayersIcon />, ink: "muted", event: "Updated components", why: "Routine work: the quiet mark" },
  attached: { icon: <AttachIcon />, ink: "muted", event: "Attached a file", why: "Routine work: the quiet mark" },
  starred: { icon: <StarIcon />, ink: "muted", event: "Starred", why: "A bookmark, not an outcome: the quiet mark" },
} as const satisfies Record<string, { icon: ReactNode; ink: Ink; event: string; why: string }>;

/** An event's mark: its kind's icon in its ink, bare, for the Timeline's icon slot (the slot draws it 16, muted unless a
 *  tone's ink is set on it). */
const mark = (kind: Kind) => {
  const { icon, ink } = EVENTS[kind];
  return ink === "muted" ? icon : <span className="studio-activity__ink" style={{ color: `var(--area-fg-${ink})` }}>{icon}</span>;
};
/** Who: David Tee with his picture, or a team on a square (people circle, teams square: Avatar's shape rule). */
const David = () => <span className="studio-activity__who"><span className="studio-activity__face"><Avatar size="xs" src="images/david-tee.jpg" fallback="DT" alt="" /></span><strong>David Tee</strong></span>;
/* A team is a square (Avatar's rule: people circle, teams square) holding the team glyph, not an initial: at 18 a lone
   letter read as a missing photo (owner, 2026-11-03: "Team icon in square"). */
const Team = ({ name }: { name: string }) => <span className="studio-activity__who"><span className="studio-activity__face"><Avatar size="xs" shape="square" icon={<PeopleIcon />} alt="" /></span><strong>{name} team</strong></span>;
const Muted = ({ children }: { children: ReactNode }) => <span className="studio-muted">{children}</span>;
const Day = ({ label, children }: { label: string; children: ReactNode }) => (
  <section className="studio-activity__day" aria-label={label}>
    <p className="studio-activity__label">{label}</p>
    <Timeline aria-label={label}>{children}</Timeline>
  </section>
);
/** A card under an event: the chat's frame in the cards' stroke (on the card alone, so the rail keeps the app's stroke). */
const Frame = ({ children }: { children: ReactNode }) => <Card className="studio-chat__card studio-activity__card" data-area-stroke={CARD_SCOPE["data-area-stroke"]}>{children}</Card>;

export function ActivityLog() {
  return (
    <div className="studio-activity">
      <Day label="Today">
        <TimelineItem icon={mark("published")} title={<><David /> <Muted>published</Muted> <strong>Version 4</strong> <Muted>of</Muted> <strong>Checkout</strong></>} time="9:48 AM">
          <Frame><div className="studio-activity__row"><span className="studio-activity__glyph" style={{ color: "var(--area-fg-success)" }} aria-hidden="true"><StatusAvailableFilledIcon /></span><span>Checks passed</span><span className="studio-activity__meta">6 screens, 18 components</span></div></Frame>
        </TimelineItem>
        <TimelineItem icon={mark("tokens")} title={<><Team name="Design" /> <Muted>changed 3 tokens in</Muted> <strong>Area</strong></>} time="9:21 AM">
          <Table wrapperProps={FEED_TABLE} layout="fixed" aria-label="Token changes">
            <thead><tr><TableHeaderCell>Token</TableHeaderCell><TableHeaderCell>Before</TableHeaderCell><TableHeaderCell>After</TableHeaderCell></tr></thead>
            <tbody>
              <tr><TableCell><Code>radius-md</Code></TableCell><TableCell className="studio-muted">8</TableCell><TableCell>10</TableCell></tr>
              <tr><TableCell><Code>space-section</Code></TableCell><TableCell className="studio-muted">24</TableCell><TableCell>32</TableCell></tr>
              <tr><TableCell><Code>accent</Code></TableCell><TableCell className="studio-muted">Blue 500</TableCell><TableCell>Blue 600</TableCell></tr>
            </tbody>
          </Table>
        </TimelineItem>
        <TimelineItem icon={mark("commented")} title={<><David /> <Muted>commented on</Muted> <strong>Checkout</strong></>} time="8:57 AM">
          <Frame><p className="studio-chat__note">The total moves when the coupon field opens. Can it hold its place? Otherwise this is ready.</p></Frame>
        </TimelineItem>
      </Day>
      <Day label="Yesterday">
        <TimelineItem icon={mark("approved")} title={<><Team name="Platform" /> <Muted>approved</Muted> <strong>Navigation</strong></>} time="6:12 PM" />
        <TimelineItem icon={mark("review")} title={<><David /> <Muted>asked</Muted> <strong>Platform team</strong> <Muted>to review</Muted> <strong>Checkout</strong></>} time="5:40 PM" />
        <TimelineItem icon={mark("components")} title={<><David /> <Muted>updated 2 components in</Muted> <strong>Area</strong></>} time="4:40 PM">
          <Table wrapperProps={FEED_TABLE} layout="fixed" aria-label="Component changes">
            <thead><tr><TableHeaderCell>Component</TableHeaderCell><TableHeaderCell>Change</TableHeaderCell></tr></thead>
            <tbody>
              <tr><TableCell><Code>Button</Code></TableCell><TableCell>Corners follow the Radius setting</TableCell></tr>
              <tr><TableCell><Code>Badge</Code></TableCell><TableCell>New plain variant</TableCell></tr>
            </tbody>
          </Table>
        </TimelineItem>
        <TimelineItem icon={mark("attached")} title={<><David /> <Muted>attached a file to</Muted> <strong>Brand</strong></>} time="2:05 PM">
          <Frame>
            <div className="studio-activity__row">
              <span className="studio-activity__file" aria-hidden="true"><DocumentIcon /></span>
              <span className="studio-activity__lines"><span>brand-guidelines.pdf</span><Muted>PDF, 4.2 MB</Muted></span>
              <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Download brand-guidelines.pdf" icon={<DownloadIcon />} />
            </div>
          </Frame>
        </TimelineItem>
      </Day>
      <Day label="Mon, Nov 2">
        <TimelineItem icon={mark("changes")} title={<><Team name="Platform" /> <Muted>asked for changes on</Muted> <strong>Onboarding</strong></>} time="6:05 PM" />
        <TimelineItem icon={mark("priority")} title={<><Team name="Design" /> <Muted>tagged</Muted> <strong>Checkout</strong> <Muted>as</Muted> <strong>Priority</strong></>} time="5:30 PM" />
        <TimelineItem icon={mark("starred")} title={<><David /> <Muted>starred</Muted> <strong>Area</strong></>} time="11:02 AM" />
      </Day>
    </div>
  );
}

/** Every event mark, with its ink and why: the key to the log's colors. */
export function EventMarks() {
  return (
    <Table wrapperProps={FEED_TABLE} aria-label="Event marks">
      <thead><tr><TableHeaderCell fit>Mark</TableHeaderCell><TableHeaderCell>Event</TableHeaderCell><TableHeaderCell>Ink</TableHeaderCell><TableHeaderCell>Why</TableHeaderCell></tr></thead>
      <tbody>
        {(Object.keys(EVENTS) as Kind[]).map(kind => (
          <tr key={kind}>
            <TableCell fit><span className="studio-activity__glyph" aria-hidden="true">{mark(kind)}</span></TableCell>
            <TableCell>{EVENTS[kind].event}</TableCell>
            <TableCell className="studio-muted">{({ success: "Success", discovery: "Discovery", info: "Info", warning: "Warning", danger: "Danger", muted: "Muted" } as const)[EVENTS[kind].ink]}</TableCell>
            <TableCell className="studio-muted">{EVENTS[kind].why}</TableCell>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
