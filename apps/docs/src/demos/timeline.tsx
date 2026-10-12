/** Timeline gallery specimens: one variant per tile. docs/specs/timeline.md. */
import { Avatar, Timeline, TimelineItem } from "@area/react";
import { CheckIcon, DocumentIcon, EditIcon, PlusIcon } from "../icons.tsx";

const frame = { inlineSize: 280 };

export const GalleryTimeline = () => (
  <Timeline aria-label="Activity" style={frame}>
    <TimelineItem title="Published" meta="David Tee" time="10m ago" dateTime="2026-10-11T23:40" />
    <TimelineItem title="Edited" meta="David Tee" time="2h ago" dateTime="2026-10-11T22:00" />
    <TimelineItem title="Created" meta="Design team" time="Oct 9" dateTime="2026-10-09" />
  </Timeline>
);

/* The current version in the Selection role, as Figma marks it; earlier versions as dots. */
export const GalleryTimelineAccent = () => (
  <Timeline aria-label="Version history" style={frame}>
    <TimelineItem current icon={<CheckIcon />} title="Current version" />
    <TimelineItem title="Oct 10, 11:40 PM" meta="David Tee" />
    <TimelineItem title="Oct 10, 11:26 AM" meta="David Tee" />
    <TimelineItem title="Oct 9, 2:10 PM" meta="Design team" />
  </Timeline>
);

/* Bare icons on the line, as Linear's issue activity. */
export const GalleryTimelineIcons = () => (
  <Timeline aria-label="Activity" style={frame}>
    <TimelineItem icon={<EditIcon />} title="David Tee edited Launch plan" time="1m ago" />
    <TimelineItem icon={<DocumentIcon />} title="Design team published it" time="1h ago" />
    <TimelineItem icon={<PlusIcon />} title="David Tee created Launch plan" time="Oct 8" />
  </Timeline>
);

/* Notion's page updates: who did it as the mark. */
export const GalleryTimelineAvatars = () => (
  <Timeline aria-label="Updates" style={frame}>
    <TimelineItem media={<Avatar fallback="DT" alt="" />} title="David Tee edited Launch plan" time="Sep 29" />
    <TimelineItem media={<Avatar shape="square" fallback="D" alt="" />} title="Design team commented" time="Sep 21" />
    <TimelineItem media={<Avatar fallback="DT" alt="" />} title="David Tee created Launch plan" time="Sep 20" />
  </Timeline>
);

export const GalleryTimelineBody = () => (
  <Timeline aria-label="Activity" style={frame}>
    <TimelineItem media={<Avatar fallback="DT" alt="" />} title="David Tee commented" time="Oct 10" dateTime="2026-10-10">
      Moved the launch to Thursday so the docs can ship with it.
    </TimelineItem>
    <TimelineItem icon={<CheckIcon />} title="Marked as done" meta="Design team" time="Oct 9" dateTime="2026-10-09" />
  </Timeline>
);
