/** Folder, File page and File tile gallery specimens: one variant per tile, one size per tile. docs/specs/folder.md,
 * file-page.md, file-tile.md. */
import { useState } from "react";
import { Avatar, FileGrid, FileGridItem, FilePage, FileTile, Folder } from "@area/react";
import { DocumentIcon, FilePdfIcon, ImageIcon } from "@area/icons";

/* The default: the outline folder, back and pocket in the subtle grey with a thin light edge, at Finder's 64. */
export const GalleryFolder = () => <Folder size="md" />;
export const GalleryFolderSm = () => <Folder size="sm" />;
export const GalleryFolderMd = () => <Folder size="md" />;
export const GalleryFolderLg = () => <Folder size="lg" />;
/* Holding something: one straight sheet stands in it, above the pocket (the owner's reference). */
export const GalleryFolderContents = () => <Folder size="lg" variant="solid" contents={3} />;
/* Neutral, and the palette's hues at Finder's lightness (Finder's folder colours follow tags). */
export const GalleryFolderNeutral = () => <Folder size="lg" variant="solid" tone="neutral" contents={1} />;
export const GalleryFolderTones = () => (
  <span style={{ display: "flex", flexWrap: "wrap", gap: "var(--area-space-8)", justifyContent: "center", maxInlineSize: 360 }}>
    {(["blue", "neutral", "cyan", "green", "yellow", "orange", "red", "pink", "purple", "brown"] as const).map(tone => <Folder key={tone} size="md" variant="solid" tone={tone} label={`${tone} folder`} />)}
  </span>
);
/* Shared with: small marks at the pocket's foot. Example people are David Tee. */
export const GalleryFolderBadge = () => <Folder size="lg" badge={<Avatar size="sm" fallback="DT" alt="David Tee" />} label="Shared with David Tee" />;
/* Solid: the alternate, Finder's lit blue folder holding one straight sheet. */
export const GalleryFolderSolid = () => <Folder size="lg" variant="solid" contents={1} />;
/* Its item count at the foot's end. */
export const GalleryFolderCount = () => <Folder size="lg" count={5} />;
/* Open: a drag is over it. */
export const GalleryFolderOpen = () => <Folder size="lg" open />;
/* Open, solid: the lit pocket tips forward and its sheet rises. */
export const GalleryFolderOpenSolid = () => <Folder size="lg" variant="solid" contents={1} open />;

/* A file's figure: Finder's document page, folded corner, its type glyph drawn thin and its extension. */
export const GalleryFilePage = () => <FilePage size="md" icon={<FilePdfIcon />} />;
export const GalleryFilePageSm = () => <FilePage size="sm" icon={<DocumentIcon />} label="DOCX" />;
export const GalleryFilePageMd = () => <FilePage size="md" icon={<DocumentIcon />} label="DOCX" />;
export const GalleryFilePageLg = () => <FilePage size="lg" icon={<DocumentIcon />} label="DOCX" />;
export const GalleryFilePageBlank = () => <FilePage size="lg" />;
/* Solid: the alternate, the lit page beside Folder's solid. */
export const GalleryFilePageSolid = () => <FilePage size="lg" variant="solid" icon={<DocumentIcon />} label="DOCX" />;
export const GalleryFilePageSolidPair = () => (
  <span style={{ display: "flex", gap: "var(--area-space-16)", alignItems: "center" }}>
    <Folder size="lg" variant="solid" contents={1} label="Folder" /><FilePage size="lg" variant="solid" icon={<ImageIcon />} label="PNG" name="PNG file" />
  </span>
);
/* Beside a Folder at the same size: the two share a box, a shadow and a corner family. */
export const GalleryFilePageWithFolder = () => (
  <span style={{ display: "flex", gap: "var(--area-space-16)", alignItems: "center" }}>
    <Folder size="lg" count={5} label="Folder" /><FilePage size="lg" icon={<ImageIcon />} label="PNG" name="PNG file" />
  </span>
);

/* A tile: a Folder over its name and item count, as Finder's icon view with item info on. */
export const GalleryFileTile = () => <FileTile size="md" figure={<Folder />} name="Onboarding" meta="15 items" />;
export const GalleryFileTileSm = () => <FileTile size="sm" figure={<Folder />} name="Onboarding" meta="15 items" />;
export const GalleryFileTileMd = () => <FileTile size="md" figure={<Folder />} name="Onboarding" meta="15 items" />;
export const GalleryFileTileLg = () => <FileTile size="lg" figure={<Folder />} name="Onboarding" meta="15 items" />;
/* A file: its File page, as Finder draws a document. */
export const GalleryFileTileFile = () => <FileTile size="md" figure={<FilePage icon={<FilePdfIcon />} />} name="Onboarding-Guide.pdf" meta="PDF · 2.4 MB" />;
/* A long name wraps to two lines, then ends in an ellipsis. */
export const GalleryFileTileLongName = () => <FileTile size="md" figure={<FilePage icon={<DocumentIcon />} label="DOCX" />} name="Product roadmap and quarterly planning notes, final draft.docx" meta="Edited 2h ago" />;

/* The grid: one Tab stop, arrows in two dimensions, Enter or a double click opens. */
export const GalleryFileGrid = () => {
  const [value, setValue] = useState<string | null>("onboarding");
  const [opened, setOpened] = useState<string>();
  return (
    <div style={{ inlineSize: 420, maxInlineSize: "100%" }}>
      <FileGrid aria-label="General knowledge" size="md" value={value} onValueChange={setValue} onOpen={setOpened}>
        <FileGridItem value="onboarding" name="Onboarding" meta={opened === "onboarding" ? "Opened" : "15 items"} figure={<Folder />} />
        <FileGridItem value="integrations" name="Integrations" meta={opened === "integrations" ? "Opened" : "5 items"} figure={<Folder />} />
        <FileGridItem value="documents" name="Documents" meta={opened === "documents" ? "Opened" : "10 items"} figure={<Folder />} />
        <FileGridItem value="guide" name="Onboarding-Guide.pdf" meta="PDF · 2.4 MB" figure={<FilePage icon={<FilePdfIcon />} />} />
        <FileGridItem value="roadmap" name="Product-Roadmap.docx" meta="Word · 88 KB" figure={<FilePage icon={<DocumentIcon />} label="DOCX" />} />
        <FileGridItem value="cover" name="Cover.png" meta="PNG · 1.1 MB" figure={<FilePage icon={<ImageIcon />} label="PNG" />} />
      </FileGrid>
    </div>
  );
};
/* A folder under a drag tips open. */
export const GalleryFileGridDropTarget = () => (
  <div style={{ inlineSize: 300, maxInlineSize: "100%" }}>
    <FileGrid aria-label="Folders" size="md" defaultValue="design">
      <FileGridItem value="design" name="Design" meta="8 items" figure={<Folder />} />
      <FileGridItem value="research" name="Research" meta="3 items" figure={<Folder />} dropTarget />
    </FileGrid>
  </div>
);
