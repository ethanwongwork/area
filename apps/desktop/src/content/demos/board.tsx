/** Board gallery specimens: one variant per tile. docs/specs/board.md. */
import { Avatar, Board, BoardCard, BoardColumn, Button, Tag } from "@area/react";
import { AddIcon, DocumentIcon, MoreHorizontalIcon, PencilIcon } from "@area/icons";

const headerActions = (name: string) => <>
  <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<AddIcon />} aria-label={`Add to ${name}`} />
  <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<MoreHorizontalIcon />} aria-label={`${name} options`} />
</>;
const cardActions = <>
  <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<PencilIcon />} aria-label="Edit title" />
  <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<MoreHorizontalIcon />} aria-label="More actions" />
</>;
const add = () => {};

export const GalleryBoard = () => (
  <Board aria-label="Label">
    <BoardColumn title="To do" count={2} actions={headerActions("To do")} onAdd={add}>
      <BoardCard href="#board" icon={<DocumentIcon />} title="Title" />
      <BoardCard href="#board" icon={<DocumentIcon />} title="Title" />
    </BoardColumn>
    <BoardColumn title="In progress" color="purple" count={2} actions={headerActions("In progress")} onAdd={add}>
      <BoardCard href="#board" icon={<DocumentIcon />} title="Title" />
      <BoardCard href="#board" title="Title that wraps onto a second line" />
    </BoardColumn>
    <BoardColumn title="Done" color="green" count={1} actions={headerActions("Done")} onAdd={add}>
      <BoardCard href="#board" icon={<DocumentIcon />} title="Title" />
    </BoardColumn>
  </Board>
);

/* Properties under the title: a Tag, a date and the assignee. */
export const GalleryBoardCardProperties = () => (
  <BoardColumn title="In progress" color="purple" count={1} onAdd={add}>
    <BoardCard href="#board" icon={<DocumentIcon />} title="Title">
      <Tag tone="info">Tag</Tag>
      <span>Oct 14</span>
      <Avatar size="sm" fallback="DT" aria-label="David Tee" />
    </BoardCard>
  </BoardColumn>
);

/* Edit and more buttons on a card, shown on hover or focus. */
export const GalleryBoardCardActions = () => (
  <BoardColumn title="In progress" color="purple" count={1} onAdd={add}>
    <BoardCard href="#board" icon={<DocumentIcon />} title="Title" actions={cardActions} />
  </BoardColumn>
);

const colorColumn = (color: "neutral" | "gray" | "brown" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "red", title: string) => (
  <BoardColumn title={title} color={color} count={2} actions={headerActions(title)} onAdd={add}>
    <BoardCard href="#board" icon={<DocumentIcon />} title="Title" />
    <BoardCard href="#board" icon={<DocumentIcon />} title="Title" />
  </BoardColumn>
);
export const GalleryBoardColumnNeutral = () => colorColumn("neutral", "Neutral");
export const GalleryBoardColumnGray = () => colorColumn("gray", "Gray");
export const GalleryBoardColumnBrown = () => colorColumn("brown", "Brown");
export const GalleryBoardColumnOrange = () => colorColumn("orange", "Orange");
export const GalleryBoardColumnYellow = () => colorColumn("yellow", "Yellow");
export const GalleryBoardColumnGreen = () => colorColumn("green", "Green");
export const GalleryBoardColumnBlue = () => colorColumn("blue", "Blue");
export const GalleryBoardColumnPurple = () => colorColumn("purple", "Purple");
export const GalleryBoardColumnPink = () => colorColumn("pink", "Pink");
export const GalleryBoardColumnRed = () => colorColumn("red", "Red");
