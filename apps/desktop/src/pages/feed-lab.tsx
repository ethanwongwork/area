/**
 * Labs › Feed (owner, 2026-11-01: "i want to see all elements as examples in 1 feed/canvas with proper spacing/gaps/
 * alignment implemented. every section of elements should be labeled above it … show both a tight margin variation (for
 * galleries) and single column feed variation"): everything a feed or a gallery holds, one section each, on the feed's
 * one system (styles/app.css: margin, gap, frame inset, heading, section, text inset; docs/PRODUCT_UI.md, "The Canvas is
 * a feed"). Each section's title names the element and its subtitle the rule it follows, so the page is its own key.
 * It is the kit every page draws from (PRODUCT_UI.md, "Every page draws from one kit"; 2026-11-01): the foundations'
 * scale table and specimen cards, the type cards and the glyph sheet joined it then, from the pages that use them.
 *
 * Three layouts, the Canvas bar's first menu: Canvas (the feed as every page draws it, margin 32), Gallery (the tight
 * margin, the frame inset, for walls of images) and Column (one item a row in the reading column, 768, as Home). The image
 * sections take the gallery modes (Grid, each image whole in one footprint; Waterfall; Fixed ratio; List) and, at Fixed
 * ratio, the ratio. Every picture is real: the saved references (References) and the app's own screens.
 *
 * Location: #labs/feed.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AssetGrid, AssetGridItem, Badge, Button, Card, CardDescription, CardValue, Checkbox, Code, CodeBlock, EmptyState, Input, Meter, PanelSection, Select, Switch, Table, TableCell, TableHeaderCell, Timeline, TimelineItem } from "@area/react";
import { BookmarkIcon, CalendarIcon, FolderIcon, HomeIcon, SearchIcon, SettingsIcon, StarIcon, TagIcon } from "@area/icons";
import { useStudio, Workspace } from "../studio.tsx";
import { CanvasSection, CARD_SCOPE, COLLECTION_CARD, COLLECTION_MIN, COLLECTION_ROW, COLLECTION_STRIP, collectionName, FEED_CODE, FEED_FRAME, FEED_TABLE, GALLERY_LOOK, imageCard, Tile, TileGrid } from "../tile.tsx";
import { GALLERY_MODES, GALLERY_RATIOS, useViewOption, ViewControls, ViewFilter, ViewLead, ViewSwitch, type GalleryMode, type GalleryRatio } from "../view-controls.tsx";
import { Facts } from "../facts.tsx";
import { appScale, feedScale } from "../app-scale.ts";
import { ScreenFigure, SHOWCASE } from "../setup-screen.tsx";
import { SettingsRow } from "./settings.tsx";
import { EasingCurve, ScaleTable, SpecimenCard } from "./foundation.tsx";
import { useTokenValues } from "./tokens.tsx";
import { GlyphCell, GlyphGrid, GlyphSheet } from "../glyph-sheet.tsx";
import { TOKEN_BY_NAME, type Token } from "../token-catalog.ts";
import { ColorCard, Sheet as ColorSheet } from "./color.tsx";
import { Stage } from "../stage.tsx";
import { TYPE_COLUMNS, TYPE_SAMPLE, TypefaceCardOf, TypeTable, TypeTesters, typeValues, WEIGHT_NAMES } from "../type-kit.tsx";
import { DEFAULT_TYPE, SCALES, TYPE_ROLES } from "../tokens.ts";
import { CHANNELS, Chart, DAILY, KPIS, PRIOR } from "../content/examples/analytics.tsx";
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

/** The tokens the foundation sections draw: a stretch of the space ramp, and a corner, a shadow and an easing. */
const SCALE = ["--area-space-4", "--area-space-8", "--area-space-16", "--area-space-32", "--area-space-64"];
const SPECIMENS = ["--area-radius-4", "--area-radius-16", "--area-shadow-float", "--area-ease-out"];
const GLYPHS = [["home", HomeIcon], ["search", SearchIcon], ["bookmark", BookmarkIcon], ["folder", FolderIcon], ["tag", TagIcon], ["calendar", CalendarIcon], ["star", StarIcon], ["settings", SettingsIcon]] as const;

/** The faces the paragraph cards show: Area's own, two serifs and a display serif, all shipped with Area. */
const TYPEFACE_FACES = ["geist", "fraunces", "geist-mono"] as const;
const PARAGRAPH_FACES = ["geist", "newsreader", "cormorant", "fraunces"] as const;
/** A face's weights, as a typeface's Styles list names them (Geist, Area's face, is variable 100 to 900). */
const STYLES = WEIGHT_NAMES;
/** A family's API, as the API tab lists it. */
const PROPS = [
  ["variant", '"solid" | "soft" | "ghost"', "solid", "How strongly the button is drawn."],
  ["size", '"sm" | "md" | "lg"', "md", "Its height and type size."],
  ["icon", "ReactNode", "—", "A glyph before the label."],
] as const;
/** A scale's steps on the sheet: every other step of Blue. */
const scaleSteps = (SCALES.find(scale => scale.id === "blue")?.steps ?? []).filter((_, index) => index % 2 === 0);

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
  const tokens = useMemo(() => [...SCALE, ...SPECIMENS].map(name => TOKEN_BY_NAME.get(name)).filter((token): token is Token => Boolean(token)), []);
  const values = useTokenValues(body, tokens);
  const [glyph, setGlyph] = useState<string | null>(null);
  const [step, setStep] = useState<string | null>(null);

  const column = layout === "column";
  const cardMin = column ? COLUMN_MIN : undefined;
  const images = library?.items.slice(0, IMAGES) ?? [];
  const folders = (library?.folders ?? []).slice(0, column ? 2 : 4);
  const inFolder = (id: string) => (library?.items ?? []).filter(entry => entry.folder === id);
  const modeLabel = { grid: "Grid", waterfall: "Waterfall", fixed: "Fixed ratio", list: "List" }[mode];

  const imageSection = mode === "list" ? (
    <Table wrapperProps={FEED_TABLE} layout="fixed" aria-label="Images">
      <thead><tr><TableHeaderCell>Name</TableHeaderCell><TableHeaderCell numeric fit>Size</TableHeaderCell></tr></thead>
      <tbody>
        {images.map(entry => (
          <tr key={entry.id}><TableCell>{nameOf(entry)}</TableCell><TableCell numeric fit className="studio-muted">{entry.width} × {entry.height}</TableCell></tr>
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
          {/* --- Text: what every page says, in one voice ------------------------------------------------------- */}
          <p className="studio-lede">A page's opening sentence: muted, at the reading measure, 24 over what follows.</p>

          <CanvasSection id="feed-lede" title="Section title and subtitle" lede="Description: one muted sentence of secondary text (12/18) under the title, ending in a full stop, 11 under it.">
            <p className="studio-feed__note" {...feedScale()}>A section's block starts 16 under its title or subtitle; sections are 48 apart; all text starts 4 in from the frames.</p>
          </CanvasSection>

          <CanvasSection id="feed-title-count" title="Section title and count" count={4}>
            <p className="studio-feed__note" {...feedScale()}>A title at the UI size, 13/18 medium; a muted count only when its block is a collection of cards, rows or images.</p>
          </CanvasSection>

          <CanvasSection id="feed-prose" title="Copy" lede="Reading text at 14/22 regular (Cursor's chat and documents), in the reading measure, 4 in from the frames.">
            <div className="studio-feed__prose" {...feedScale()}>
              <p>Body text that explains what a section holds. It reads one step over the interface's 13, on its prose line, and stops at the reading measure so a line never runs the Canvas's width.</p>
              <p>A second paragraph follows the first 16 below it, as prose does in a chat.</p>
            </div>
          </CanvasSection>

          <CanvasSection id="feed-list" title="List" lede="A component's documentation: a list of points, each a line of copy, 4 apart.">
            <ul className="studio-doc__list studio-feed__list" {...feedScale()}>
              <li>Use it for one action on the page.</li>
              <li>Name the action with a verb.</li>
              <li>Keep one primary action per group.</li>
            </ul>
          </CanvasSection>

          {/* --- Type: Typography's faces and roles ------------------------------------------------------------ */}
          <CanvasSection id="feed-tester" title="Type tester" lede="Display apart from body, as Pangram's sampler: one line at display size the feed's width, then a heavy and a regular paragraph side by side. Each card's controls are one Toolbar along its top; every sample is editable.">
            <TypeTesters />
          </CanvasSection>

          <CanvasSection id="feed-type" title="Typeface cards" count={TYPEFACE_FACES.length} lede="A face as the card, 16:9: the type alone in it, Aa from the top-left at the card's inset; under it its name and two badges at most, Variable or Static, then Licensed or Not installed.">
            <TileGrid span="wide" cards min={cardMin}>
              {TYPEFACE_FACES.map(id => <TypefaceCardOf key={id} id={id} />)}
            </TileGrid>
          </CanvasSection>

          <CanvasSection id="feed-type-paragraphs" title="Paragraph cards" count={PARAGRAPH_FACES.length} lede="The same card with a paragraph in the face in place of Aa, as Google Fonts lists faces.">
            <TileGrid span="wide" cards min={cardMin}>
              {PARAGRAPH_FACES.map(id => <TypefaceCardOf key={id} id={id} sample="paragraph" />)}
            </TileGrid>
          </CanvasSection>

          <CanvasSection id="feed-type-ramp" title="Type ramp" count={TYPE_ROLES.length} lede="Typography's roles in the feed's Table: the role, then its size, line height, tracking and weight each in its own column, its sample on one line at its size, largest first.">
            <TypeTable label="Type ramp" columns={TYPE_COLUMNS} rows={TYPE_ROLES.map(role => ({
              key: role.id, name: role.name, values: typeValues(role.metrics[DEFAULT_TYPE]!, role.group === "text" ? 400 : 500),
              sample: <span className="studio-type__sample" style={{ fontSize: `var(--area-${role.group}-${role.step}-size)`, lineHeight: `var(--area-${role.group}-${role.step}-leading)`, letterSpacing: `var(--area-${role.group}-${role.step}-tracking)`, fontWeight: role.group === "text" ? undefined : "var(--area-weight-strong)" }}>{TYPE_SAMPLE}</span>,
            }))} />
          </CanvasSection>

          <CanvasSection id="feed-type-styles" title="Type styles" count={STYLES.length} lede="A face's weights in the same Table, as Google Fonts lists them: the style, its weight in its own column, then a line in it.">
            <TypeTable label="Type styles" columns={["Weight"]} rows={STYLES.map(([name, weight]) => ({
              key: String(weight), name, values: [weight],
              sample: <span className="studio-type__sample" style={{ fontSize: "var(--area-title-lg-size)", lineHeight: "var(--area-title-lg-leading)", fontWeight: weight }}>{TYPE_SAMPLE}</span>,
            }))} />
          </CanvasSection>

          {/* --- Colour: Colors' scales and the roles painted from them ----------------------------------------- */}
          <CanvasSection id="feed-colors" title="Colour cards" count={4} lede="A role's colour as the frame, its name in the colour's own ink.">
            <TileGrid span="unit">
              {([["Page", "var(--area-bg-page)", "var(--area-fg-default)"], ["Subtle", "var(--area-bg-subtle)", "var(--area-fg-default)"],
                ["Neutral", "var(--area-neutral-solid)", "var(--area-fg-on-neutral)"], ["Action", "var(--area-action-solid)", "var(--area-fg-on-action)"]] as const).map(([label, background, color]) => (
                <Tile key={label} span="unit" stage="flow" label={label} inert paint={{ background, color }} />
              ))}
            </TileGrid>
          </CanvasSection>

          <CanvasSection id="feed-scale-steps" title="Colour scale" count={scaleSteps.length} lede="Colors' step cards: the step painted, its level at the head, its hex, RGB and OKLCH in its ink, the galleries' gap apart.">
            <ColorSheet grid value={step} onChoose={setStep}>
              <TileGrid span="unit" className="studio-color-grid">
                {scaleSteps.map(item => <ColorCard key={item.level} scale="blue" item={item} copy="hex" />)}
              </TileGrid>
            </ColorSheet>
          </CanvasSection>

          {/* --- Foundations: Spacing, Shape, Elevation, Motion --------------------------------------------------- */}
          <CanvasSection id="feed-scale" title="Scale table" count={SCALE.length} lede="A ramp down the framed Table: each token, its value, and its drawing at its true size in the last column.">
            <ScaleTable label="Space ramp" figure="Length" rows={SCALE.map(token => ({ token, value: values.get(token) ?? "",
              drawing: <span className="studio-scale__bar" style={{ inlineSize: `var(${token})` } as CSSProperties} /> }))} />
          </CanvasSection>

          <CanvasSection id="feed-specimens-tokens" title="Specimen cards" count={SPECIMENS.length} lede="A token as the square card on the unit grid: its drawing in the middle, its name under the card, its value the badge.">
            <TileGrid span="unit">
              <SpecimenCard token="--area-radius-4" value={values.get("--area-radius-4")}><span className="studio-specimen__box" style={{ borderRadius: "var(--area-radius-4)" }} /></SpecimenCard>
              <SpecimenCard token="--area-radius-16" value={values.get("--area-radius-16")}><span className="studio-specimen__box" style={{ borderRadius: "var(--area-radius-16)" }} /></SpecimenCard>
              <SpecimenCard token="--area-shadow-float"><span className="studio-specimen__box" data-raised="" style={{ boxShadow: "var(--area-shadow-float)" }} /></SpecimenCard>
              <SpecimenCard token="--area-ease-out"><span className="studio-specimen__motion"><EasingCurve value={values.get("--area-ease-out") ?? ""} /></span></SpecimenCard>
            </TileGrid>
          </CanvasSection>

          {/* --- Icons ------------------------------------------------------------------------------------------- */}
          <CanvasSection id="feed-glyphs" title="Glyph sheet" count={GLYPHS.length} lede="Icons and characters straight on the Canvas, no frame round them: a glyph is its own figure. Its name is the hover window's.">
            <GlyphSheet grid label="Glyphs" value={glyph} onChoose={setGlyph} size={20}>
              <GlyphGrid>
                {GLYPHS.map(([name, Icon]) => (
                  <GlyphCell key={name} value={name} label={name} card={() => ({ name, preview: <Icon size={96} aria-hidden="true" /> })}>
                    <span className="studio-glyphs__glyph"><Icon size={20} aria-hidden="true" /></span>
                  </GlyphCell>
                ))}
              </GlyphGrid>
            </GlyphSheet>
          </CanvasSection>

          {/* --- Components -------------------------------------------------------------------------------------- */}
          <CanvasSection id="feed-specimens" title="Component cards" count={4} lede="Components' cards, square: the specimen centred 8 in, the name, its status and controls 4 under the card.">
            <TileGrid span="wide" cards min={cardMin}>
              <Tile container="asset" look={GALLERY_LOOK} span="wide" stage="center" card label="Button" inert actions={<Badge variant="soft" tone="success">Complete</Badge>}><Button>Button</Button></Tile>
              <Tile container="asset" look={GALLERY_LOOK} span="wide" stage="center" card label="Badge" inert><Badge>Badge</Badge></Tile>
              <Tile span="wide" stage="center" card label="Input" value="In review" inert><Input aria-label="Input" placeholder="Placeholder" /></Tile>
              <Tile span="wide" stage="center" card label="Checkbox" inert><Checkbox label="Label" defaultChecked /></Tile>
            </TileGrid>
          </CanvasSection>

          <CanvasSection id="feed-stage" title="Stage" lede="A family's Preview: one specimen at its real size in the large frame, its code under it.">
            <Stage label="default" code={CODE} zoom="1" replays={0}><Button>Button</Button></Stage>
          </CanvasSection>

          <CanvasSection id="feed-props" title="Props table" count={PROPS.length} lede="A family's API: each prop's name as code, its type, its default and what it does, on the label column.">
            <Table wrapperProps={FEED_TABLE} layout="fixed" aria-label="Props">
              <thead><tr><TableHeaderCell>Prop</TableHeaderCell><TableHeaderCell>Type</TableHeaderCell><TableHeaderCell>Default</TableHeaderCell><TableHeaderCell>Description</TableHeaderCell></tr></thead>
              <tbody>
                {PROPS.map(([name, type, initial, description]) => (
                  <tr key={name}><td><Code>{name}</Code></td><td><Code>{type}</Code></td><TableCell className="studio-muted">{initial}</TableCell><TableCell className="studio-muted">{description}</TableCell></tr>
                ))}
              </tbody>
            </Table>
          </CanvasSection>

          {/* --- Designs: screens, themes, versions, a project's pages ------------------------------------------ */}
          <CanvasSection id="feed-screens" title="Design cards" count={2} lede="Anything designed (a screen, a theme, a pattern, a page): 16:9, whole at 1920 × 1080, 8 in, its status as a badge.">
            <TileGrid span="wide" cards min={cardMin ?? COLLECTION_MIN}>
              <Tile span="wide" stage="screen" inert label="Title" status="published" value="Published"><ScreenFigure className="studio-theme-card" hold={SHOWCASE} scope={screen} /></Tile>
              <Tile span="wide" stage="screen" inert label="Title" status="draft" value="Draft"><ScreenFigure className="studio-theme-card" screen="analytics" scope={screen} /></Tile>
            </TileGrid>
          </CanvasSection>

          {/* --- Images: References ------------------------------------------------------------------------------ */}
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

          {/* --- Data: tables, numbers, charts ------------------------------------------------------------------ */}
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

          <CanvasSection id="feed-stats" title="Stat cards" count={KPIS.length} lede="Card with its own parts in the feed's frame: the name a description, the figure Card's value, the change a tone Badge under it.">
            <div className="studio-frames">
              {KPIS.map(kpi => (
                // Card's own parts (owner, 2026-11-02: "use real components"): the name a description, the figure Card's value,
                // the change a tone Badge in a description under it.
                <Card key={kpi.title} {...FEED_FRAME}>
                  <CardDescription>{kpi.title}</CardDescription>
                  <CardValue>{kpi.value}</CardValue>
                  <CardDescription className="studio-stat__note"><Badge variant="soft" tone={kpi.up ? "success" : "danger"}>{kpi.change}</Badge>{kpi.note}</CardDescription>
                </Card>
              ))}
            </div>
          </CanvasSection>

          <CanvasSection id="feed-chart" title="Chart" lede="A series over time in the feed's frame, its legend under it. Area has no chart component yet: this is the Analytics pattern's drawing.">
            <Card {...FEED_FRAME}>
              <Chart series={DAILY} prior={PRIOR} />
              <div className="ex-legend"><span className="ex-legend__now">This period</span><span className="ex-legend__prior">Previous period</span></div>
            </Card>
          </CanvasSection>

          <CanvasSection id="feed-meters" title="Meters" count={CHANNELS.length} lede="Shares of a whole, one Meter a row in the feed's frame: the label, its value at the end, the bar under them.">
            <Card {...FEED_FRAME}>
              <div className="ex-meters">{CHANNELS.map(channel => <Meter key={channel.label} label={channel.label} description={channel.text} value={channel.value} valueText={`${channel.value}%`} />)}</div>
            </Card>
          </CanvasSection>

          {/* --- Code and settings -------------------------------------------------------------------------------- */}
          <CanvasSection id="feed-code" title="Code block" lede="Code block, outlined: the frame inset above, below and at its start, the frame's corner.">
            <CodeBlock code={CODE} language="tsx" lineNumbers={false} {...FEED_CODE} {...appScale()} />
          </CanvasSection>

          <CanvasSection id="feed-rows" title="Settings rows" lede="A group of rows in one frame: a name over its description, the control at the end, rules between the text edges.">
            <div className="studio-settings__rows">
              <SettingsRow label="Label" description="Description of what the setting changes."><Switch aria-label="Label" checked={toggled} onCheckedChange={setToggled} /></SettingsRow>
              <SettingsRow label="Label" description="Description of what the setting changes."><Select size="sm" aria-label="Label" defaultValue="one"><option value="one">Option one</option><option value="two">Option two</option></Select></SettingsRow>
            </div>
          </CanvasSection>

          {/* --- Activity ---------------------------------------------------------------------------------------- */}
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
