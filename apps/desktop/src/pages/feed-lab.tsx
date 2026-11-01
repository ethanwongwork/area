/**
 * Labs › Feed (owner, 2026-11-01: "i want to see all elements as examples in 1 feed/canvas with proper spacing/gaps/
 * alignment implemented. every section of elements should be labeled above it … show both a tight margin variation (for
 * galleries) and single column feed variation"): everything a feed or a gallery holds, one section each, on the feed's
 * one system (styles/app.css: margin, gap, frame inset, heading, section, text inset; docs/PRODUCT_UI.md, "The Canvas is
 * a feed"). Each section's title names the element and its subtitle the rule it follows, so the page is its own key.
 *
 * Three layouts, the Canvas bar's first menu: Canvas (the feed as every page draws it, margin 32), Gallery (the tight
 * margin, the frame inset, for walls of images) and Column (one item a row in the reading column, 768, as Home). The image
 * sections take the gallery modes (Grid, each image whole in one footprint; Waterfall; Fixed ratio; List) and, at Fixed
 * ratio, the ratio. Every picture is real: the saved references (References) and the app's own screens.
 *
 * Location: #labs/feed.
 */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AssetGrid, AssetGridItem, Badge, Button, Checkbox, CodeBlock, EmptyState, Input, PanelSection, Select, Switch, Table, TableCell, TableHeaderCell, Timeline, TimelineItem } from "@area/react";
import { BookmarkIcon, FolderIcon, TagIcon } from "@area/icons";
import { useStudio, Workspace } from "../studio.tsx";
import { CanvasSection, CARD_SCOPE, COLLECTION_CARD, COLLECTION_MIN, COLLECTION_ROW, COLLECTION_STRIP, collectionName, FEED_CODE, FEED_TABLE, GALLERY_LOOK, imageCard, Tile, TileGrid } from "../tile.tsx";
import { GALLERY_MODES, GALLERY_RATIOS, useViewOption, ViewControls, ViewFilter, ViewLead, ViewSwitch, type GalleryMode, type GalleryRatio } from "../view-controls.tsx";
import { Facts } from "../facts.tsx";
import { appScale, feedScale } from "../app-scale.ts";
import { ScreenFigure, SHOWCASE } from "../setup-screen.tsx";
import { SettingsRow } from "./settings.tsx";
import { nameOf, url, useLibrary } from "./imagery.tsx";

type Layout = "canvas" | "gallery" | "column";
const LAYOUTS: ReadonlyArray<{ value: Layout; label: string }> = [
  { value: "canvas", label: "Canvas" }, { value: "gallery", label: "Gallery" }, { value: "column", label: "Column" },
];
/** A card in the column: one a row (a 768 column holds no two at this least width), as Home's pictures. */
const COLUMN_MIN = 480; /* pick: Home's FEED_CARD_MIN */
/** An image card's least width in the gallery layouts: References' Medium. */
const IMAGE_MIN = 192; /* pick: imagery.tsx SIZES.medium */
/** How many saved images the gallery sections show. */
const IMAGES = 12; /* pick */

const CODE = `import { Button } from "@area/react";

export function Example() {
  return <Button>Action</Button>;
}`;

/** The feed's spacings as drawn now (styles/app.css), read off the Canvas so the Inspector states what the page shows. */
const SPACINGS: ReadonlyArray<[string, string]> = [
  ["Margin", "--_canvas-margin"], ["Section", "--_canvas-section"], ["Heading", "--_canvas-heading"],
  ["Gap", "--_canvas-gap"], ["Frame inset", "--_frame-inset"], ["Text inset", "--_text-inset"], ["Corner", "--_tile-radius"],
];
function useSpacings(body: React.RefObject<HTMLDivElement | null>, deps: unknown[]) {
  const [values, setValues] = useState<Array<[string, string]>>([]);
  useEffect(() => {
    const element = body.current;
    if (!element) return;
    // A probe inside the body resolves each calc() to its length at the body's own settings.
    const probe = document.createElement("div");
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    element.append(probe);
    setValues(SPACINGS.map(([name, property]) => {
      probe.style.inlineSize = `var(${property})`;
      return [name, `${Math.round(probe.getBoundingClientRect().width)}`];
    }));
    probe.remove();
  }, deps);
  return values;
}

export function FeedLabPage() {
  const { library } = useLibrary();
  const { theme } = useStudio();
  // The screens draw in the app's mode, as Home's.
  const screen = { "data-area-theme": theme };
  const [layout, setLayout] = useViewOption<Layout>("feed-lab:layout", "canvas", LAYOUTS.map(entry => entry.value));
  const [mode, setMode] = useViewOption<GalleryMode>("feed-lab:mode", "grid", GALLERY_MODES);
  const [ratio, setRatio] = useViewOption<GalleryRatio>("feed-lab:ratio", "landscape", GALLERY_RATIOS.map(entry => entry.value));
  const [chosen, setChosen] = useState<string | null>(null);
  const [toggled, setToggled] = useState(true);
  const body = useRef<HTMLDivElement>(null);
  const spacings = useSpacings(body, [layout]);

  const column = layout === "column";
  const cardMin = column ? COLUMN_MIN : undefined;
  const images = library?.items.slice(0, IMAGES) ?? [];
  const folders = (library?.folders ?? []).slice(0, column ? 2 : 4);
  const inFolder = (id: string) => (library?.items ?? []).filter(entry => entry.folder === id);
  const modeLabel = { grid: "Grid", waterfall: "Waterfall", fixed: "Fixed ratio", list: "List" }[mode];

  const imageSection = mode === "list" ? (
    <Table wrapperProps={FEED_TABLE} layout="fixed" aria-label="Images">
      <thead><tr><TableHeaderCell>Name</TableHeaderCell><TableHeaderCell>Size</TableHeaderCell></tr></thead>
      <tbody>
        {images.map(entry => (
          <tr key={entry.id}><TableCell>{nameOf(entry)}</TableCell><TableCell className="studio-muted studio-tabular">{entry.width} × {entry.height}</TableCell></tr>
        ))}
      </tbody>
    </Table>
  ) : (
    <AssetGrid aria-label="Images" value={chosen} onValueChange={setChosen} layout={mode === "waterfall" ? "waterfall" : "grid"} className="studio-images" {...CARD_SCOPE}
      style={{ "--area-asset-card-size": `${column ? COLUMN_MIN : IMAGE_MIN}px` } as CSSProperties}>
      {images.map(entry => (
        <AssetGridItem key={entry.id} value={entry.id} name={nameOf(entry)} media={url(entry.thumb)} container="basic" caption="outside"
          {...imageCard(mode, ratio, entry.width, entry.height)} />
      ))}
    </AssetGrid>
  );

  return (
    <Workspace
      canvasTitle="Feed"
      canvasRef={body}
      canvasScope={{ "data-feed": layout }}
      canvasLead={<ViewLead><ViewFilter label="Layout" align="start" value={layout} onChange={setLayout} options={LAYOUTS} /></ViewLead>}
      canvasActions={
        <ViewControls>
          {mode === "fixed" ? <ViewFilter label="Ratio" value={ratio} onChange={setRatio} options={GALLERY_RATIOS} /> : null}
          <ViewSwitch waterfall fixed value={mode} onChange={setMode} />
        </ViewControls>
      }
      canvas={
        <div className="studio-sections studio-feed" data-layout={layout}>
          <CanvasSection id="feed-lede" title="Section title and subtitle" lede="Description: one muted sentence under the title, ending in a full stop, 8 under it.">
            <p className="studio-feed__note" {...feedScale()}>A section's block starts 16 under its title or subtitle; sections are 48 apart; all text starts 4 in from the frames.</p>
          </CanvasSection>

          <CanvasSection id="feed-title-count" title="Section title and count" count={4}>
            <p className="studio-feed__note" {...feedScale()}>A title at 13/18 medium; a muted count only when its block is a collection of cards, rows or images.</p>
          </CanvasSection>

          <CanvasSection id="feed-prose" title="Copy" lede="Body text at 13/20 regular, in the reading measure, 4 in from the frames.">
            <div className="studio-feed__prose" {...feedScale()}>
              <p>Body text that explains what a section holds. It reads at the app's type size on the prose line, and stops at the reading measure so a line never runs the Canvas's width.</p>
              <p>A second paragraph follows the first 16 below it, as prose does in a chat.</p>
            </div>
          </CanvasSection>

          <CanvasSection id="feed-table" title="Table" count={3} lede="The default framed Table: the frame inset at its sides, one label column (27%), rows 39.">
            <Table wrapperProps={FEED_TABLE} layout="fixed" aria-label="Items">
              <thead><tr><TableHeaderCell>Name</TableHeaderCell><TableHeaderCell>Value</TableHeaderCell><TableHeaderCell fit>Changed</TableHeaderCell></tr></thead>
              <tbody>
                {["Item one", "Item two", "Item three"].map((name, index) => (
                  <tr key={name}><TableCell>{name}</TableCell><TableCell className="studio-muted">Value</TableCell><TableCell fit className="studio-muted">{index + 1} days ago</TableCell></tr>
                ))}
              </tbody>
            </Table>
          </CanvasSection>

          <CanvasSection id="feed-code" title="Code block" lede="Code block, outlined: the frame inset above, below and at its start, the frame's corner.">
            <CodeBlock code={CODE} language="tsx" lineNumbers={false} {...FEED_CODE} {...appScale()} />
          </CanvasSection>

          <CanvasSection id="feed-rows" title="Settings rows" lede="A group of rows in one frame: a name over its description, the control at the end, rules between the text edges.">
            <div className="studio-settings__rows">
              <SettingsRow label="Label" description="Description of what the setting changes."><Switch aria-label="Label" checked={toggled} onCheckedChange={setToggled} /></SettingsRow>
              <SettingsRow label="Label" description="Description of what the setting changes."><Select size="sm" aria-label="Label" defaultValue="one"><option value="one">Option one</option><option value="two">Option two</option></Select></SettingsRow>
            </div>
          </CanvasSection>

          <CanvasSection id="feed-specimens" title="Cards, square" count={4} lede="One card in two shapes. Square for components, images and collections, the specimen centred 8 in. Every card's name, badges and controls sit 4 under it.">
            <TileGrid span="wide" cards min={cardMin}>
              <Tile container="asset" look={GALLERY_LOOK} span="wide" stage="center" card label="Button" inert actions={<Badge variant="soft" tone="success">Complete</Badge>}><Button>Button</Button></Tile>
              <Tile container="asset" look={GALLERY_LOOK} span="wide" stage="center" card label="Badge" inert><Badge>Badge</Badge></Tile>
              <Tile span="wide" stage="center" card label="Input" value="In review" inert><Input aria-label="Input" placeholder="Placeholder" /></Tile>
              <Tile span="wide" stage="center" card label="Checkbox" inert><Checkbox label="Label" defaultChecked /></Tile>
            </TileGrid>
          </CanvasSection>

          <CanvasSection id="feed-screens" title="Cards, 16:9" count={2} lede="Anything designed: a screen or a cover, whole at 1920 × 1080, 8 in. The name, its badges and controls sit under the card.">
            <TileGrid span="wide" cards min={cardMin ?? COLLECTION_MIN}>
              <Tile span="wide" stage="screen" inert label="Title" status="published" value="Published"><ScreenFigure className="studio-theme-card" hold={SHOWCASE} scope={screen} /></Tile>
              <Tile span="wide" stage="screen" inert label="Title" status="draft" value="Draft"><ScreenFigure className="studio-theme-card" screen="analytics" scope={screen} /></Tile>
            </TileGrid>
          </CanvasSection>

          <CanvasSection id="feed-collections" title="Collection cards, full width" count={folders.length} lede="The collection card across the feed: every image at its own ratio in one row that scrolls sideways, starting on the card's inset.">
            {folders.length ? (
              <AssetGrid aria-label="Collections" className="studio-images" {...CARD_SCOPE} style={{ "--area-asset-card-size": "100%", "--area-asset-card-strip-height": `${COLLECTION_ROW}px` } as CSSProperties}>
                {folders.slice(0, 2).map(entry => (
                  <AssetGridItem key={entry.id} value={entry.id} textValue={entry.name} name={collectionName(entry.name, inFolder(entry.id).length)} {...COLLECTION_STRIP}
                    group={inFolder(entry.id).slice(0, 8).map(asset => url(asset.thumb))} />
                ))}
              </AssetGrid>
            ) : <EmptyState size="sm" title="No saved references" description="Collections appear here once References has a library." />}
          </CanvasSection>

          <CanvasSection id="feed-groups" title="Collection cards, in a grid" count={folders.length} lede="The square card: a collection's first four, each square, 2 × 2, as far apart as from the card's edge.">
            {folders.length ? (
              <AssetGrid aria-label="Groups" className="studio-images" {...CARD_SCOPE} style={{ "--area-asset-card-size": `${cardMin ?? COLLECTION_MIN}px` } as CSSProperties}>
                {folders.map(entry => (
                  <AssetGridItem key={entry.id} value={entry.id} textValue={entry.name} name={collectionName(entry.name, inFolder(entry.id).length)} {...COLLECTION_CARD}
                    group={inFolder(entry.id).slice(0, 4).map(asset => url(asset.thumb))} />
                ))}
              </AssetGrid>
            ) : <EmptyState size="sm" title="No saved references" description="Groups appear here once References has a library." />}
          </CanvasSection>

          <CanvasSection id="feed-images" title={`Image gallery: ${modeLabel}`} count={images.length}
            lede={mode === "grid" ? "Every card one square footprint; each image whole inside it at its own ratio (Are.na)."
              : mode === "waterfall" ? "Columns of cards at their images' own heights, each dropped into the shortest column."
              : mode === "fixed" ? `Every image cropped to ${GALLERY_RATIOS.find(entry => entry.value === ratio)?.label}.`
              : "A table: the same frame inset and label column as every feed table."}>
            {images.length ? imageSection : <EmptyState size="sm" title="No saved references" description="Images appear here once References has a library." />}
          </CanvasSection>

          <CanvasSection id="feed-colors" title="Colour cards" count={4} lede="The frame painted in its colour, its name in the colour's own ink.">
            <TileGrid span="unit">
              {([["Page", "var(--area-bg-page)", "var(--area-fg-default)"], ["Subtle", "var(--area-bg-subtle)", "var(--area-fg-default)"],
                ["Neutral", "var(--area-neutral-solid)", "var(--area-fg-on-neutral)"], ["Action", "var(--area-action-solid)", "var(--area-fg-on-action)"]] as const).map(([label, background, color]) => (
                <Tile key={label} span="unit" stage="flow" label={label} inert paint={{ background, color }} />
              ))}
            </TileGrid>
          </CanvasSection>

          <CanvasSection id="feed-timeline" title="Timeline" lede="Home's events in the reading column: a mark, a title that opens what it names, its meta and time, a picture under it.">
            <div className="studio-feed__column"><Timeline aria-label="Events">
              <TimelineItem icon={<TagIcon />} title="Title published" meta="Description" time="Just now" />
              <TimelineItem icon={<FolderIcon />} title="Title started" meta="Description" time="Yesterday">
                <TileGrid span="wide" cards min={COLUMN_MIN}>
                  <Tile span="wide" stage="screen" inert label="Title" value="Description"><ScreenFigure className="studio-theme-card" hold={SHOWCASE} scope={screen} /></Tile>
                </TileGrid>
              </TimelineItem>
              <TimelineItem icon={<BookmarkIcon />} title="12 references saved" meta="Description" time="3 days ago" />
            </Timeline></div>
          </CanvasSection>

          <CanvasSection id="feed-empty" title="Empty state" lede="Inside a section, Empty state sm: never louder than the section's title.">
            <EmptyState size="sm" title="Nothing yet" description="Description of what will appear here."
              actions={<Button size="sm" variant="soft" tone="neutral">Action</Button>} />
          </CanvasSection>
        </div>
      }
      inspector={
        <PanelSection heading="Feed">
          <Facts label="Feed" items={[["Layout", LAYOUTS.find(entry => entry.value === layout)!.label], ["Images", modeLabel], ...spacings]} />
        </PanelSection>
      }
    />
  );
}
