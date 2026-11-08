/** Folder, File page, File image and File tile gallery specimens: one variant per tile, one size per tile. docs/specs/folder.md,
 * file-page.md, file-image.md, file-tile.md. */
import { useState } from "react";
import { Avatar, FileGrid, FileGridItem, FileImage, FilePage, FileTile, Folder } from "@area/react";
import { TableIcon } from "@area/icons";

/* The default: the outline folder, back and pocket in the subtle grey with a thin light edge, at Finder's 64. */
export const GalleryFolder = () => <Folder size="md" />;
export const GalleryFolderSm = () => <Folder size="sm" />;
export const GalleryFolderMd = () => <Folder size="md" />;
export const GalleryFolderLg = () => <Folder size="lg" />;
/* Shared with: small marks at the pocket's foot. Example people are David Tee. */
export const GalleryFolderBadge = () => <Folder size="lg" badge={<Avatar size="sm" fallback="DT" alt="David Tee" />} aria-label="Shared with David Tee" />;
/* Its item count at the foot's end. */
export const GalleryFolderCount = () => <Folder size="lg" count={5} />;
/* Open: a drag is over it. */
export const GalleryFolderOpen = () => <Folder size="lg" open />;

/* A file's figure: a document page with a folded corner, blank (round 56: "i dont want any icons on the doc if its not
   necessary"); a content mark only where the page alone would not say what the file is (a spreadsheet, slides, audio,
   code, an archive), centred in the page below the fold. */
export const GalleryFilePage = () => <FilePage size="md" />;
export const GalleryFilePageSm = () => <FilePage size="sm" />;
export const GalleryFilePageMd = () => <FilePage size="md" />;
export const GalleryFilePageLg = () => <FilePage size="lg" />;
export const GalleryFilePageGlyph = () => <FilePage size="lg" icon={<TableIcon />} />;
/* The family at one size: a Folder, a File page and a File image share a box, a shadow and a corner family. */
export const GalleryFilePageWithFolder = () => (
  <span style={{ display: "flex", gap: "var(--area-space-16)", alignItems: "center" }}>
    <Folder size="lg" count={5} aria-label="Folder" /><FilePage size="lg" aria-label="Document" /><FileImage size="lg" aria-label="Image" />
  </span>
);

/* An image's figure: a landscape frame, drawn, or the picture itself covering it. */
export const GalleryFileImage = () => <FileImage size="md" />;
export const GalleryFileImageSm = () => <FileImage size="sm" />;
export const GalleryFileImageMd = () => <FileImage size="md" />;
export const GalleryFileImageLg = () => <FileImage size="lg" />;
export const GalleryFileImagePicture = () => <FileImage size="lg" src="images/david-tee.jpg" />;

/* A tile: a Folder over its name and item count, as Finder's icon view with item info on. */
export const GalleryFileTile = () => <FileTile size="md" figure={<Folder />} name="Item one" meta="Description" />;
export const GalleryFileTileSm = () => <FileTile size="sm" figure={<Folder />} name="Item one" meta="Description" />;
export const GalleryFileTileMd = () => <FileTile size="md" figure={<Folder />} name="Item one" meta="Description" />;
export const GalleryFileTileLg = () => <FileTile size="lg" figure={<Folder />} name="Item one" meta="Description" />;
/* A file: its File page, as Finder draws a document. */
export const GalleryFileTileFile = () => <FileTile size="md" figure={<FilePage />} name="Item four.pdf" meta="Description" />;
/* A long name wraps to two lines, then ends in an ellipsis. */
export const GalleryFileTileLongName = () => <FileTile size="md" figure={<FilePage />} name="Item one with a long name that wraps onto a second line and then ends.docx" meta="Description" />;

/* The grid: one Tab stop, arrows in two dimensions, Enter or a double click opens. */
export const GalleryFileGrid = () => {
  const [value, setValue] = useState<string | null>("one");
  const [opened, setOpened] = useState<string>();
  const meta = (item: string) => opened === item ? "Opened" : "Description";
  return (
    <div style={{ inlineSize: 420, maxInlineSize: "100%" }}>
      <FileGrid aria-label="Label" size="md" value={value} onValueChange={setValue} onOpen={setOpened}>
        <FileGridItem value="one" name="Item one" meta={meta("one")} figure={<Folder />} />
        <FileGridItem value="two" name="Item two" meta={meta("two")} figure={<Folder />} />
        <FileGridItem value="three" name="Item three" meta={meta("three")} figure={<Folder />} />
        <FileGridItem value="four" name="Item four.pdf" meta={meta("four")} figure={<FilePage />} />
        <FileGridItem value="five" name="Item five.csv" meta={meta("five")} figure={<FilePage icon={<TableIcon />} />} />
        <FileGridItem value="six" name="Item six.png" meta={meta("six")} figure={<FileImage src="images/david-tee.jpg" />} />
      </FileGrid>
    </div>
  );
};
/* Several (components audit V7): `multiple` on the grid, as a file browser chooses: a click chooses one, Cmd or Ctrl+click
   adds or removes one, Shift+click adds the run, Space toggles, Ctrl or Cmd+A chooses all. */
export const GalleryFileGridMultiple = () => (
  <div style={{ inlineSize: 420, maxInlineSize: "100%" }}>
    <FileGrid aria-label="Label" size="md" multiple defaultValues={["one", "three"]}>
      <FileGridItem value="one" name="Item one" meta="Description" figure={<Folder />} />
      <FileGridItem value="two" name="Item two" meta="Description" figure={<Folder />} />
      <FileGridItem value="three" name="Item three.pdf" meta="Description" figure={<FilePage />} />
      <FileGridItem value="four" name="Item four.pdf" meta="Description" figure={<FilePage />} />
    </FileGrid>
  </div>
);
/* A folder under a drag tips open. */
export const GalleryFileGridDropTarget = () => (
  <div style={{ inlineSize: 300, maxInlineSize: "100%" }}>
    <FileGrid aria-label="Label" size="md" defaultValue="one">
      <FileGridItem value="one" name="Item one" meta="Description" figure={<Folder />} />
      <FileGridItem value="two" name="Item two" meta="Description" figure={<Folder />} dropTarget />
    </FileGrid>
  </div>
);
