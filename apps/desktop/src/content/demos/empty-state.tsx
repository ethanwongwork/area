/** Empty state gallery specimens: one variant per tile. docs/specs/empty-state.md. */
import { Button, EmptyState } from "@area/react";
import { DocumentIcon, InboxIcon, SearchIcon, TrashIcon } from "@area/icons";

/* The region the state centres in: a page column for md, a panel's width for sm. */
const page = { inlineSize: "calc(var(--area-space-96) * 5)", maxInlineSize: "100%" };
const panel = { inlineSize: "calc(var(--area-space-96) * 3)", maxInlineSize: "100%" };

export const GalleryEmptyState = () => (
  <EmptyState style={page} icon={<TrashIcon size={24} />} title="Title"
    description="Description" />
);
export const GalleryEmptyStateSm = () => (
  <EmptyState style={panel} size="sm" icon={<SearchIcon size={20} />} title="Title"
    description="Description" />
);
export const GalleryEmptyStateActions = () => (
  <EmptyState style={page} icon={<DocumentIcon size={24} />} title="Title"
    description="Description"
    actions={<><Button variant="solid">Action</Button><Button variant="outline">Secondary</Button></>} />
);
export const GalleryEmptyStateNoIcon = () => (
  <EmptyState style={page} title="Title" description="Description" />
);
export const GalleryEmptyStateTitleOnly = () => (
  <EmptyState style={page} title="Title" />
);
/* sm with its one action: Notion's Library › Skills shape inside a panel. */
export const GalleryEmptyStateSmAction = () => (
  <EmptyState style={panel} size="sm" icon={<InboxIcon size={20} />} title="Title"
    description="Description" actions={<Button variant="ghost" size="sm">Action</Button>} />
);
