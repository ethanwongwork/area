/** Board gallery specimens: one variant per tile. docs/specs/board.md. */
import { Avatar, Board, BoardCard, BoardColumn, Button, Tag } from "@area/react";
import { DocumentIcon, EditIcon, MoreIcon, PlusIcon } from "../icons.tsx";

const newPage = <Button variant="ghost" tone="neutral" size="sm" icon={<PlusIcon />}>New page</Button>;
const cardActions = <>
  <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<EditIcon />} aria-label="Edit title" />
  <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<MoreIcon />} aria-label="More actions" />
</>;

export const GalleryBoard = () => (
  <Board aria-label="Tasks">
    <BoardColumn title="No status" plainTitle count={2} footer={newPage}>
      <BoardCard href="#board" icon={<DocumentIcon />} title="Launch checklist" />
      <BoardCard href="#board" icon={<DocumentIcon />} title="Hiring plan" />
    </BoardColumn>
    <BoardColumn title="In progress" tone="discovery" count={2} footer={newPage}>
      <BoardCard href="#board" icon={<DocumentIcon />} title="Design review notes" />
      <BoardCard href="#board" title="Quarterly plan: goals, owners and the three outcomes we commit to" />
    </BoardColumn>
    <BoardColumn title="Done" tone="success" count={1} footer={newPage}>
      <BoardCard href="#board" icon={<DocumentIcon />} title="Team offsite" />
    </BoardColumn>
  </Board>
);

/* Properties under the title: a Tag, a date and the assignee. */
export const GalleryBoardCardProperties = () => (
  <BoardColumn title="In progress" tone="discovery" count={1}>
    <BoardCard href="#board" icon={<DocumentIcon />} title="Design review notes">
      <Tag tone="info">Design</Tag>
      <span>Oct 14</span>
      <Avatar size="sm" fallback="DT" aria-label="David Tee" />
    </BoardCard>
  </BoardColumn>
);

/* Notion's edit and more buttons, shown on hover or focus. */
export const GalleryBoardCardActions = () => (
  <BoardColumn title="In progress" tone="discovery" count={1}>
    <BoardCard href="#board" icon={<DocumentIcon />} title="Design review notes" actions={cardActions} />
  </BoardColumn>
);

const toneColumn = (tone: "neutral" | "gray" | "brown" | "info" | "success" | "warning" | "caution" | "danger" | "discovery" | "pink", title: string) => (
  <BoardColumn title={title} tone={tone} count={2}>
    <BoardCard href="#board" icon={<DocumentIcon />} title="Launch checklist" />
    <BoardCard href="#board" icon={<DocumentIcon />} title="Hiring plan" />
  </BoardColumn>
);
export const GalleryBoardColumnNeutral = () => toneColumn("neutral", "Backlog");
export const GalleryBoardColumnGray = () => toneColumn("gray", "Later");
export const GalleryBoardColumnBrown = () => toneColumn("brown", "Research");
export const GalleryBoardColumnInfo = () => toneColumn("info", "Personal");
export const GalleryBoardColumnSuccess = () => toneColumn("success", "Done");
export const GalleryBoardColumnWarning = () => toneColumn("warning", "Blocked");
export const GalleryBoardColumnCaution = () => toneColumn("caution", "Waiting");
export const GalleryBoardColumnDanger = () => toneColumn("danger", "Urgent");
export const GalleryBoardColumnDiscovery = () => toneColumn("discovery", "Work");
export const GalleryBoardColumnPink = () => toneColumn("pink", "Ideas");
