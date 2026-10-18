/** Timeline gallery specimens: one variant per tile. docs/specs/timeline.md. */
import { Avatar, Timeline, TimelineItem } from "@area/react";
import { AddIcon, CheckIcon, DocumentIcon, PencilIcon } from "@area/icons";

const frame = { inlineSize: 280 };

export const GalleryTimeline = () => (
  <Timeline aria-label="Label" style={frame}>
    <TimelineItem title="Title" meta="David Tee" time="10m ago" dateTime="2026-10-11T23:40" />
    <TimelineItem title="Title" meta="David Tee" time="2h ago" dateTime="2026-10-11T22:00" />
    <TimelineItem title="Title" meta="Design team" time="Oct 9" dateTime="2026-10-09" />
  </Timeline>
);

/* The current version in the Selection role, as Figma marks it; earlier versions as dots. */
export const GalleryTimelineAccent = () => (
  <Timeline aria-label="Label" style={frame}>
    <TimelineItem current icon={<CheckIcon />} title="Title" />
    <TimelineItem title="Oct 10, 11:40 PM" meta="David Tee" />
    <TimelineItem title="Oct 10, 11:26 AM" meta="David Tee" />
    <TimelineItem title="Oct 9, 2:10 PM" meta="Design team" />
  </Timeline>
);

/* Bare icons on the line, as Linear's issue activity. */
export const GalleryTimelineIcons = () => (
  <Timeline aria-label="Label" style={frame}>
    <TimelineItem icon={<PencilIcon />} title="David Tee edited Title" time="1m ago" />
    <TimelineItem icon={<DocumentIcon />} title="Design team published Title" time="1h ago" />
    <TimelineItem icon={<AddIcon />} title="David Tee created Title" time="Oct 8" />
  </Timeline>
);

/* Notion's page updates: who did it as the mark. */
export const GalleryTimelineAvatars = () => (
  <Timeline aria-label="Label" style={frame}>
    <TimelineItem media={<Avatar fallback="DT" alt="" />} title="David Tee edited Title" time="Sep 29" />
    <TimelineItem media={<Avatar shape="square" fallback="D" alt="" />} title="Design team commented" time="Sep 21" />
    <TimelineItem media={<Avatar fallback="DT" alt="" />} title="David Tee created Title" time="Sep 20" />
  </Timeline>
);

export const GalleryTimelineBody = () => (
  <Timeline aria-label="Label" style={frame}>
    <TimelineItem media={<Avatar fallback="DT" alt="" />} title="David Tee commented" time="Oct 10" dateTime="2026-10-10">
      Body text
    </TimelineItem>
    <TimelineItem icon={<CheckIcon />} title="Title" meta="Design team" time="Oct 9" dateTime="2026-10-09" />
  </Timeline>
);
