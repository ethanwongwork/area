/**
 * Labs › Feed (owner, 2026-11-01: "i want to see all elements as examples in 1 feed/canvas with proper spacing/gaps/
 * alignment implemented. every section of elements should be labeled above it … show both a tight margin variation (for
 * galleries) and single column feed variation"): everything a feed or a gallery holds, one section each, on the feed's
 * one system (styles/app.css: margin, gap, frame inset, heading, section, text inset; docs/PRODUCT_UI.md, "The Canvas is
 * a feed"). Each section's title names the element and its subtitle the rule it follows, so the page is its own key.
 * It is the kit every page draws from (PRODUCT_UI.md, "Every page draws from one kit"; 2026-11-01): the foundations'
 * scale table and specimen cards, the type cards and the glyph sheet joined it then, from the pages that use them. On
 * 2026-11-02 (owner: "make sure everything is up to date … all badges are correct and consistent, and there is a visual for
 * both a typeface glyph gallery and icon gallery"): Claude's reading step, the Well ground and the series colours, every
 * status as one badge, and the two glyph galleries in cards.
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
import { AddIcon, BellIcon, BookmarkIcon, CalendarIcon, CameraIcon, ChatIcon, ClockIcon, CodeIcon, CopyIcon, DownloadIcon, FilterIcon, FolderIcon, GlobeIcon, GridIcon, HeartIcon, HomeIcon, ImageIcon, LayersIcon, LinkIcon, LockIcon, MailIcon, PersonIcon, PlayIcon, SearchIcon, SendIcon, SettingsIcon, ShareIcon, SparkleIcon, StarIcon, TagIcon, TrashIcon, UploadIcon } from "@area/icons";
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
import { ColorCard, Sheet as ColorSheet, SwatchCard } from "./color.tsx";
import { CharacterCell, factsOf, stackOf, typefaceOf } from "./typefaces.tsx";
import { Composers, Conversation, Response, Trackers } from "../chat-kit.tsx";
import { BadgeTables } from "../badge-catalogue.tsx";
import { ActivityLog, EventMarks } from "../activity-kit.tsx";
import { AreaOverTime, Bars, Calendar, Columns, Diffstat, DotGrid, Funnel, HeatMatrix, Histogram, LanguageBar, Lifecycle, Pace, PunchCard, Retention, ShareRing, StatTiles, StatusHistory, Tracker, Waterfall, WeeklyStrip } from "../data-views.tsx";
import { Stage } from "../stage.tsx";
import { TYPE_COLUMNS, TYPE_EXCERPT, TYPE_PARAGRAPH, TYPE_SAMPLE, TypefaceCardOf, TypeTable, TypeTesters, typeValues, WEIGHT_NAMES } from "../type-kit.tsx";
import { DEFAULT_TYPE, SCALES, TYPE_ROLES } from "../tokens.ts";
import { CHANNELS, Chart, DAILY, KPIS, PRIOR } from "../content/examples/analytics.tsx";
import { nameOf, url, useLibrary } from "./imagery.tsx";

type Layout = "canvas" | "gallery" | "column";
const LAYOUTS: ReadonlyArray<{ value: Layout; label: string }> = [
  { value: "canvas", label: "Canvas" }, { value: "gallery", label: "Gallery" }, { value: "column", label: "Column" },
];
/** A card in the column: one a row (a 768 column holds no two at this least width), as Home's pictures. */
const COLUMN_MIN = 480; /* pick: Home's FEED_CARD_MIN */
/** A timeline picture: one a row at any Canvas width (wider than any Canvas, so the cards grid clamps to one column). */
const TIMELINE_MIN = 4096; /* pick */
/** An image card's least width in the gallery layouts: References' Medium. */
const IMAGE_MIN = 192; /* pick: imagery.tsx SIZES.medium */
/** How many saved images the gallery sections show. */
const IMAGES = 12; /* pick */

/** The tokens the foundation sections draw: a stretch of the space ramp, and a corner, a shadow and an easing. */
const SCALE = ["--area-space-4", "--area-space-8", "--area-space-16", "--area-space-32", "--area-space-64"];
const SPECIMENS = ["--area-radius-4", "--area-radius-16", "--area-shadow-float", "--area-ease-out"];
/** The icon gallery's icons: three rows of the set's everyday concepts, at the Icons page's default 20. */
const GLYPHS = [["home", HomeIcon], ["search", SearchIcon], ["add", AddIcon], ["bookmark", BookmarkIcon], ["folder", FolderIcon], ["image", ImageIcon],
  ["layers", LayersIcon], ["grid", GridIcon], ["filter", FilterIcon], ["tag", TagIcon], ["calendar", CalendarIcon], ["clock", ClockIcon],
  ["chat", ChatIcon], ["mail", MailIcon], ["send", SendIcon], ["bell", BellIcon], ["person", PersonIcon], ["lock", LockIcon],
  ["link", LinkIcon], ["share", ShareIcon], ["copy", CopyIcon], ["download", DownloadIcon], ["upload", UploadIcon], ["trash", TrashIcon],
  ["code", CodeIcon], ["globe", GlobeIcon], ["camera", CameraIcon], ["play", PlayIcon], ["heart", HeartIcon], ["star", StarIcon],
  ["sparkle", SparkleIcon], ["settings", SettingsIcon]] as const;
const ICON_SIZE = 20; /* pick: the Icons page's default size */
/** The type glyph gallery: Area's face, its capitals, lower case and figures, as the owner's picture of a glyph grid. */
const GLYPH_FACE = "geist";
const CHARACTERS = [...Array.from({ length: 26 }, (_, i) => 0x41 + i), ...Array.from({ length: 26 }, (_, i) => 0x61 + i), ...Array.from({ length: 10 }, (_, i) => 0x30 + i)];
const CHARACTER_SIZE = 32; /* pick: a typeface's Glyphs tab's second size */
/** Both galleries' cards, one size (owner, 2026-11-02: "can the type glyph gallery and icon gallery size be the same size?"):
 *  the characters' own, twice 32, so a 20 icon sits in the same 64 card. */
const GLYPH_CELL = 64;

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
/** The role colours the swatch cards show: name, colour, the ink it carries, and its token. */
const COLOUR_ROLES = [
  ["Page", "var(--area-bg-page)", "var(--area-fg-default)", "bg-page"], ["Well", "var(--area-bg-well)", "var(--area-fg-default)", "bg-well"],
  ["Neutral", "var(--area-neutral-solid)", "var(--area-fg-on-neutral)", "neutral-solid"], ["Action", "var(--area-action-solid)", "var(--area-fg-on-action)", "action-solid"],
  ["Success", "var(--area-success-solid)", "var(--area-fg-on-success)", "success-solid"], ["Warning", "var(--area-warning-solid)", "var(--area-fg-on-warning)", "warning-solid"],
  ["Danger", "var(--area-danger-solid)", "var(--area-fg-on-danger)", "danger-solid"],
] as const;
/** A scale's steps on the sheet: Blue, every step. */
const scaleSteps = SCALES.find(scale => scale.id === "blue")?.steps ?? [];

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
  const [character, setCharacter] = useState<string | null>(null);
  const [step, setStep] = useState<string | null>(null);
  const face = typefaceOf(GLYPH_FACE);
  const faceFacts = face ? factsOf(face, undefined) : undefined;

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
          {/* --- Chat: a conversation, a response on the whole ramp, an agent's trackers (src/chat-kit.tsx) ------------- */}
          <CanvasSection id="feed-chat" title="Conversation">
            <Conversation />
          </CanvasSection>

          <CanvasSection id="feed-composers" title="Composer">
            <Composers />
          </CanvasSection>

          <CanvasSection id="feed-response" title="Response">
            <Response />
          </CanvasSection>

          <CanvasSection id="feed-trackers" title="Trackers">
            <Trackers />
          </CanvasSection>

          <CanvasSection id="feed-prose" title="Copy">
            <div className="studio-feed__prose" {...feedScale()}>
              <p>{TYPE_PARAGRAPH}</p>
              <p>{TYPE_EXCERPT}</p>
            </div>
          </CanvasSection>

          <CanvasSection id="feed-list" title="List">
            <ul className="studio-doc__list studio-feed__list" {...feedScale()}>
              <li>Use it for one action on the page.</li>
              <li>Name the action with a verb.</li>
              <li>Keep one primary action per group.</li>
            </ul>
          </CanvasSection>

          {/* --- Type: Typography's faces and roles ------------------------------------------------------------ */}
          <CanvasSection id="feed-tester" title="Type tester">
            <TypeTesters />
          </CanvasSection>

          <CanvasSection id="feed-type" title="Typeface cards" count={TYPEFACE_FACES.length}>
            <TileGrid span="wide" cards min={cardMin}>
              {TYPEFACE_FACES.map(id => <TypefaceCardOf key={id} id={id} />)}
            </TileGrid>
          </CanvasSection>

          <CanvasSection id="feed-type-paragraphs" title="Paragraph cards" count={PARAGRAPH_FACES.length}>
            <TileGrid span="wide" cards min={cardMin}>
              {PARAGRAPH_FACES.map(id => <TypefaceCardOf key={id} id={id} sample="paragraph" />)}
            </TileGrid>
          </CanvasSection>

          <CanvasSection id="feed-type-ramp" title="Type ramp" count={TYPE_ROLES.length}>
            <TypeTable label="Type ramp" columns={TYPE_COLUMNS} rows={TYPE_ROLES.map(role => ({
              key: role.id, name: role.name, values: typeValues(role.metrics[DEFAULT_TYPE]!, role.group === "text" ? 400 : 500),
              sample: <span className="studio-type__sample" style={{ fontSize: `var(--area-${role.group}-${role.step}-size)`, lineHeight: `var(--area-${role.group}-${role.step}-leading)`, letterSpacing: `var(--area-${role.group}-${role.step}-tracking)`, fontWeight: role.group === "text" ? undefined : "var(--area-weight-strong)" }}>{TYPE_SAMPLE}</span>,
            }))} />
          </CanvasSection>

          <CanvasSection id="feed-type-styles" title="Type styles" count={STYLES.length}>
            <TypeTable label="Type styles" columns={["Weight"]} rows={STYLES.map(([name, weight]) => ({
              key: String(weight), name, values: [weight],
              sample: <span className="studio-type__sample" style={{ fontSize: "var(--area-title-lg-size)", lineHeight: "var(--area-title-lg-leading)", fontWeight: weight }}>{TYPE_SAMPLE}</span>,
            }))} />
          </CanvasSection>

          {/* --- Colour: Colors' scales and the roles painted from them ----------------------------------------- */}
          <CanvasSection id="feed-colors" title="Color cards" count={COLOUR_ROLES.length}>
            <TileGrid span="unit" className="studio-color-grid">
              {COLOUR_ROLES.map(([name, color, ink, token]) => <SwatchCard key={name} name={name} color={color} ink={ink} values={[token]} />)}
            </TileGrid>
          </CanvasSection>

          <CanvasSection id="feed-scale-steps" title="Color scale" count={scaleSteps.length}>
            <ColorSheet grid value={step} onChoose={setStep}>
              <TileGrid span="unit" className="studio-color-grid">
                {scaleSteps.map(item => <ColorCard key={item.level} scale="blue" item={item} copy="hex" />)}
              </TileGrid>
            </ColorSheet>
          </CanvasSection>

          {/* --- Foundations: Spacing, Shape, Elevation, Motion --------------------------------------------------- */}
          <CanvasSection id="feed-scale" title="Scale table" count={SCALE.length}>
            <ScaleTable label="Space ramp" figure="Length" rows={SCALE.map(token => ({ token, value: values.get(token) ?? "",
              drawing: <span className="studio-scale__bar" style={{ inlineSize: `var(${token})` } as CSSProperties} /> }))} />
          </CanvasSection>

          <CanvasSection id="feed-specimens-tokens" title="Specimen cards" count={SPECIMENS.length}>
            <TileGrid span="unit">
              <SpecimenCard token="--area-radius-4" value={values.get("--area-radius-4")}><span className="studio-specimen__box" style={{ borderRadius: "var(--area-radius-4)" }} /></SpecimenCard>
              <SpecimenCard token="--area-radius-16" value={values.get("--area-radius-16")}><span className="studio-specimen__box" style={{ borderRadius: "var(--area-radius-16)" }} /></SpecimenCard>
              <SpecimenCard token="--area-shadow-float"><span className="studio-specimen__box" data-raised="" style={{ boxShadow: "var(--area-shadow-float)" }} /></SpecimenCard>
              <SpecimenCard token="--area-ease-out"><span className="studio-specimen__motion"><EasingCurve value={values.get("--area-ease-out") ?? ""} /></span></SpecimenCard>
            </TileGrid>
          </CanvasSection>

          {/* --- Icons ------------------------------------------------------------------------------------------- */}
          <CanvasSection id="feed-glyphs" title="Icon gallery" count={GLYPHS.length}>
            <GlyphSheet grid label="Icons" value={glyph} onChoose={setGlyph} size={ICON_SIZE} cell={GLYPH_CELL}>
              <GlyphGrid>
                {GLYPHS.map(([name, Icon]) => (
                  <GlyphCell key={name} value={name} label={name} card={() => ({ name, preview: <Icon size={96} aria-hidden="true" /> })}>
                    <span className="studio-glyphs__glyph"><Icon size={ICON_SIZE} aria-hidden="true" /></span>
                  </GlyphCell>
                ))}
              </GlyphGrid>
            </GlyphSheet>
          </CanvasSection>

          <CanvasSection id="feed-characters" title="Type glyph gallery" count={CHARACTERS.length}>
            {face && faceFacts ? (
              <GlyphSheet grid label={`${face.name} characters`} value={character} onChoose={setCharacter} size={CHARACTER_SIZE} cell={GLYPH_CELL}>
                <GlyphGrid>
                  {CHARACTERS.map(cp => <CharacterCell key={cp} cp={cp} facts={faceFacts} stack={stackOf(face, faceFacts)} block={cp < 0x41 ? "Digits" : "Basic Latin"} />)}
                </GlyphGrid>
              </GlyphSheet>
            ) : null}
          </CanvasSection>

          {/* --- Components -------------------------------------------------------------------------------------- */}
          <CanvasSection id="feed-specimens" title="Component cards" count={4}>
            <TileGrid span="wide" cards min={cardMin}>
              <Tile container="asset" look={GALLERY_LOOK} span="wide" stage="center" card label="Button" inert status="published" value="Complete"><Button>Button</Button></Tile>
              <Tile container="asset" look={GALLERY_LOOK} span="wide" stage="center" card label="Badge" inert status="review" value="In review"><Badge>Badge</Badge></Tile>
              <Tile container="asset" look={GALLERY_LOOK} span="wide" stage="center" card label="Input" inert status="none" value="Unrefined"><Input aria-label="Input" placeholder="Placeholder" /></Tile>
              <Tile container="asset" look={GALLERY_LOOK} span="wide" stage="center" card label="Checkbox" inert status="published" value="Complete"><Checkbox label="Label" defaultChecked /></Tile>
            </TileGrid>
          </CanvasSection>

          {/* Every badge that can label something, plain and on its plate (src/badge-catalogue.tsx). */}
          <BadgeTables />

          <CanvasSection id="feed-stage" title="Stage">
            <Stage label="default" code={CODE} zoom="1" replays={0}><Button>Button</Button></Stage>
          </CanvasSection>

          <CanvasSection id="feed-props" title="Props table" count={PROPS.length}>
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
          <CanvasSection id="feed-screens" title="Design cards" count={2}>
            <TileGrid span="wide" cards min={cardMin ?? COLLECTION_MIN}>
              <Tile span="wide" stage="screen" inert label="Title" status="published" value="Published"><ScreenFigure className="studio-theme-card" hold={SHOWCASE} scope={screen} /></Tile>
              <Tile span="wide" stage="screen" inert label="Title" status="draft" value="Draft"><ScreenFigure className="studio-theme-card" screen="analytics" scope={screen} /></Tile>
            </TileGrid>
          </CanvasSection>

          {/* --- Images: References ------------------------------------------------------------------------------ */}
          <CanvasSection id="feed-collections" title="Collection cards, full width" count={folders.length}>
            {folders.length ? (
              <AssetGrid aria-label="Collections" className="studio-images" {...CARD_SCOPE} style={{ "--area-asset-card-size": "100%", "--area-asset-card-strip-height": `${COLLECTION_ROW}px` } as CSSProperties}>
                {folders.slice(0, 2).map(entry => (
                  <AssetGridItem key={entry.id} value={entry.id} textValue={entry.name} name={collectionName(entry.name, inFolder(entry.id).length)} {...COLLECTION_STRIP}
                    group={inFolder(entry.id).slice(0, 8).map(asset => url(asset.thumb))} />
                ))}
              </AssetGrid>
            ) : <EmptyState size="sm" title="No saved references" description="Collections appear here once References has a library." />}
          </CanvasSection>

          <CanvasSection id="feed-groups" title="Collection cards, in a grid" count={folders.length}>
            {folders.length ? (
              <AssetGrid aria-label="Groups" className="studio-images" {...CARD_SCOPE} style={{ "--area-asset-card-size": `${cardMin ?? COLLECTION_MIN}px` } as CSSProperties}>
                {folders.map(entry => (
                  <AssetGridItem key={entry.id} value={entry.id} textValue={entry.name} name={collectionName(entry.name, inFolder(entry.id).length)} {...COLLECTION_CARD}
                    group={inFolder(entry.id).slice(0, 4).map(asset => url(asset.thumb))} />
                ))}
              </AssetGrid>
            ) : <EmptyState size="sm" title="No saved references" description="Groups appear here once References has a library." />}
          </CanvasSection>

          <CanvasSection id="feed-images" title={`Image gallery: ${modeLabel}`} count={images.length}>
            {images.length ? imageSection : <EmptyState size="sm" title="No saved references" description="Images appear here once References has a library." />}
          </CanvasSection>

          {/* --- Data: tables, numbers, charts ------------------------------------------------------------------ */}
          <CanvasSection id="feed-table" title="Table" count={3}>
            <Table wrapperProps={FEED_TABLE} layout="fixed" aria-label="Items">
              <thead><tr><TableHeaderCell>Name</TableHeaderCell><TableHeaderCell>Value</TableHeaderCell><TableHeaderCell fit>Changed</TableHeaderCell></tr></thead>
              <tbody>
                {["Item one", "Item two", "Item three"].map((name, index) => (
                  <tr key={name}><TableCell>{name}</TableCell><TableCell className="studio-muted">Value</TableCell><TableCell fit className="studio-muted">{index + 1} days ago</TableCell></tr>
                ))}
              </tbody>
            </Table>
          </CanvasSection>

          <CanvasSection id="feed-stats" title="Stat cards" count={KPIS.length}>
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

          <CanvasSection id="feed-chart" title="Chart">
            <Card {...FEED_FRAME}>
              <Chart series={DAILY} prior={PRIOR} />
              <div className="ex-legend"><span className="ex-legend__now">This period</span><span className="ex-legend__prior">Previous period</span></div>
            </Card>
          </CanvasSection>

          <CanvasSection id="feed-heat" title="Heat matrix">
            <HeatMatrix />
          </CanvasSection>

          <CanvasSection id="feed-calendar" title="Calendar">
            <Calendar />
          </CanvasSection>

          <CanvasSection id="feed-tracker" title="Tracker">
            <Tracker />
          </CanvasSection>

          <CanvasSection id="feed-parts" title="Parts of a whole" count={2}>
            <div className="studio-data-pair">
              <ShareRing />
              <DotGrid />
            </div>
          </CanvasSection>

          <CanvasSection id="feed-stat-tiles" title="Stat tiles" count={4}>
            <StatTiles />
          </CanvasSection>

          <CanvasSection id="feed-area-bars" title="Area over time and bars" count={2}>
            <div className="studio-data-pair">
              <AreaOverTime />
              <Bars />
            </div>
          </CanvasSection>

          <CanvasSection id="feed-pace-columns" title="Pace and columns" count={2}>
            <div className="studio-data-pair">
              <Pace />
              <Columns />
            </div>
          </CanvasSection>

          <CanvasSection id="feed-weekly-strip" title="Weekly strip">
            <WeeklyStrip />
          </CanvasSection>

          <CanvasSection id="feed-languages-diffstat" title="Language bar and diffstat" count={2}>
            <div className="studio-data-pair">
              <LanguageBar />
              <Diffstat />
            </div>
          </CanvasSection>

          <CanvasSection id="feed-waterfall" title="Waterfall">
            <Waterfall />
          </CanvasSection>

          <CanvasSection id="feed-histogram-funnel" title="Histogram and funnel" count={2}>
            <div className="studio-data-pair">
              <Histogram />
              <Funnel />
            </div>
          </CanvasSection>

          <CanvasSection id="feed-punch-card" title="Punch card">
            <PunchCard />
          </CanvasSection>

          <CanvasSection id="feed-retention-lifecycle" title="Retention and lifecycle" count={2}>
            <div className="studio-data-pair">
              <Retention />
              <Lifecycle />
            </div>
          </CanvasSection>

          <CanvasSection id="feed-status-history" title="Status history">
            <StatusHistory />
          </CanvasSection>

          <CanvasSection id="feed-meters" title="Meters" count={CHANNELS.length}>
            <Card {...FEED_FRAME}>
              <div className="ex-meters">{CHANNELS.map(channel => <Meter key={channel.label} tone="data" label={channel.label} description={channel.text} value={channel.value} valueText={`${channel.value}%`} />)}</div>
            </Card>
          </CanvasSection>

          {/* --- Code and settings -------------------------------------------------------------------------------- */}
          <CanvasSection id="feed-code" title="Code block">
            <CodeBlock code={CODE} language="tsx" lineNumbers={false} {...FEED_CODE} {...appScale()} />
          </CanvasSection>

          <CanvasSection id="feed-rows" title="Settings rows">
            <div className="studio-settings__rows">
              <SettingsRow label="Label" description="Description of what the setting changes."><Switch aria-label="Label" checked={toggled} onCheckedChange={setToggled} /></SettingsRow>
              <SettingsRow label="Label" description="Description of what the setting changes."><Select size="sm" aria-label="Label" defaultValue="one"><option value="one">Option one</option><option value="two">Option two</option></Select></SettingsRow>
            </div>
          </CanvasSection>

          {/* --- Activity ---------------------------------------------------------------------------------------- */}
          <CanvasSection id="feed-timeline" title="Timeline">
            <Timeline aria-label="Events">
              <TimelineItem icon={<TagIcon />} title="Title published" meta="Description" time="Just now" />
              <TimelineItem icon={<FolderIcon />} title="Title started" meta="Description" time="Yesterday">
                {/* One card the item's full width (owner, 2026-11-02: "make sure this is full width"): a least width no Canvas
                    reaches, so the grid holds one column. */}
                <TileGrid span="wide" cards min={TIMELINE_MIN}>
                  <Tile span="wide" stage="screen" inert label="Title" status="published" value="Published"><ScreenFigure className="studio-theme-card" hold={SHOWCASE} scope={screen} /></Tile>
                </TileGrid>
              </TimelineItem>
              <TimelineItem icon={<BookmarkIcon />} title="12 references saved" meta="Description" time="3 days ago" />
            </Timeline>
          </CanvasSection>

          <CanvasSection id="feed-activity" title="Activity log">
            <div className="studio-feed__column"><ActivityLog /></div>
          </CanvasSection>

          <CanvasSection id="feed-event-marks" title="Event marks" count={10}>
            <EventMarks />
          </CanvasSection>

          <CanvasSection id="feed-empty" title="Empty state">
            <EmptyState size="sm" icon={<FolderIcon />} title="Nothing yet" description="Description of what will appear here."
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
