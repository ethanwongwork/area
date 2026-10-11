/** Board gallery specimens: one variant per tile. docs/specs/board.md. */
import { Avatar, Board, BoardCard, BoardColumn, Button, Tag } from "@area/react";
import { DocumentIcon, EditIcon, MoreIcon, PlusIcon } from "../icons.tsx";

const headerActions = (name: string) => <>
  <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<PlusIcon />} aria-label={`Add to ${name}`} />
  <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<MoreIcon />} aria-label={`${name} options`} />
</>;
const cardActions = <>
  <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<EditIcon />} aria-label="Edit title" />
  <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<MoreIcon />} aria-label="More actions" />
</>;
const add = () => {};

export const GalleryBoard = () => (
  <Board aria-label="Tasks">
    <BoardColumn title="To do" count={2} actions={headerActions("To do")} onAdd={add}>
      <BoardCard href="#board" icon={<DocumentIcon />} title="Launch checklist" />
      <BoardCard href="#board" icon={<DocumentIcon />} title="Hiring plan" />
    </BoardColumn>
    <BoardColumn title="In progress" color="purple" count={2} actions={headerActions("In progress")} onAdd={add}>
      <BoardCard href="#board" icon={<DocumentIcon />} title="Design review notes" />
      <BoardCard href="#board" title="Quarterly plan: goals, owners and the three outcomes we commit to" />
    </BoardColumn>
    <BoardColumn title="Done" color="green" count={1} actions={headerActions("Done")} onAdd={add}>
      <BoardCard href="#board" icon={<DocumentIcon />} title="Team offsite" />
    </BoardColumn>
  </Board>
);

/* Properties under the title: a Tag, a date and the assignee. */
export const GalleryBoardCardProperties = () => (
  <BoardColumn title="In progress" color="purple" count={1} onAdd={add}>
    <BoardCard href="#board" icon={<DocumentIcon />} title="Design review notes">
      <Tag tone="info">Design</Tag>
      <span>Oct 14</span>
      <Avatar size="sm" fallback="DT" aria-label="David Tee" />
    </BoardCard>
  </BoardColumn>
);

/* Edit and more buttons on a card, shown on hover or focus. */
export const GalleryBoardCardActions = () => (
  <BoardColumn title="In progress" color="purple" count={1} onAdd={add}>
    <BoardCard href="#board" icon={<DocumentIcon />} title="Design review notes" actions={cardActions} />
  </BoardColumn>
);

const colorColumn = (color: "neutral" | "gray" | "brown" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "red", title: string) => (
  <BoardColumn title={title} color={color} count={2} actions={headerActions(title)} onAdd={add}>
    <BoardCard href="#board" icon={<DocumentIcon />} title="Launch checklist" />
    <BoardCard href="#board" icon={<DocumentIcon />} title="Hiring plan" />
  </BoardColumn>
);
export const GalleryBoardColumnNeutral = () => colorColumn("neutral", "Backlog");
export const GalleryBoardColumnGray = () => colorColumn("gray", "Later");
export const GalleryBoardColumnBrown = () => colorColumn("brown", "Research");
export const GalleryBoardColumnOrange = () => colorColumn("orange", "Blocked");
export const GalleryBoardColumnYellow = () => colorColumn("yellow", "Waiting");
export const GalleryBoardColumnGreen = () => colorColumn("green", "Done");
export const GalleryBoardColumnBlue = () => colorColumn("blue", "Personal");
export const GalleryBoardColumnPurple = () => colorColumn("purple", "Work");
export const GalleryBoardColumnPink = () => colorColumn("pink", "Ideas");
export const GalleryBoardColumnRed = () => colorColumn("red", "Urgent");
