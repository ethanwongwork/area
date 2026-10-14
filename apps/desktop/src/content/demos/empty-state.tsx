/** Empty state gallery specimens: one variant per tile. docs/specs/empty-state.md. */
import { Button, EmptyState } from "@area/react";
import { DocumentIcon, InboxIcon, SearchIcon, TrashIcon } from "@area/icons";

/* The region the state centres in: a page column for md, a panel's width for sm. */
const page = { inlineSize: "calc(var(--area-space-96) * 5)", maxInlineSize: "100%" };
const panel = { inlineSize: "calc(var(--area-space-96) * 3)", maxInlineSize: "100%" };

export const GalleryEmptyState = () => (
  <EmptyState style={page} icon={<TrashIcon size={24} />} title="Trash is empty"
    description="Pages you delete stay here for 30 days before they are removed for good." />
);
export const GalleryEmptyStateSm = () => (
  <EmptyState style={panel} size="sm" icon={<SearchIcon size={20} />} title="No results"
    description="Try another word, or clear the filters to see every page." />
);
export const GalleryEmptyStateActions = () => (
  <EmptyState style={page} icon={<DocumentIcon size={24} />} title="No pages yet"
    description="Start a page from scratch, or pick a template to share with David Tee's studio."
    actions={<><Button variant="solid">New page</Button><Button variant="outline">Browse templates</Button></>} />
);
export const GalleryEmptyStateNoIcon = () => (
  <EmptyState style={page} title="Nothing scheduled" description="Tasks you schedule for later show up here." />
);
export const GalleryEmptyStateTitleOnly = () => (
  <EmptyState style={page} title="No favorites yet" />
);
/* sm with its one action: Notion's Library › Skills shape inside a panel. */
export const GalleryEmptyStateSmAction = () => (
  <EmptyState style={panel} size="sm" icon={<InboxIcon size={20} />} title="You're all caught up"
    description="New mentions and replies land here." actions={<Button variant="ghost" size="sm">View archive</Button>} />
);
