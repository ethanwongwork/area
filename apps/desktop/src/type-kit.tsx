/**
 * Type in the feed (owner, 2026-11-01; docs/research/type-presentation-2026-11-01, Google Fonts and Pangram Pangram's
 * Altera Sans page). Each kind of type fact has one place:
 *
 *   TypeTable      a list of type (a ramp's roles, a face's weights) as the feed's framed Table: the name and its size or
 *                  weight in the label column, the sample on one line at its size, clipped at the cell, as Google Fonts'
 *                  Styles list.
 *   TypeTesters    a face to try, display apart from body (owner: "separate display from body, for the type tester, just
 *                  put 1 line of text"), as Pangram's sampler: one full-width card with a single editable line at display
 *                  size, then two half-width cards with a paragraph each, a heavy one at a large size and a regular one at
 *                  the reading size. Every card's controls are one header row along its top (owner: "make sure all the
 *                  controls are just in one 'header' at the top"): the typeface and its style on the start, the bars on
 *                  the end. The controls set custom properties on the sample (--tt-*), so the sample is CSS alone and the
 *                  Feed Kit artifact wires the same controls without React.
 *   TypefaceCard   a face as a card (Pangram's family cards): the type alone in it ("Aa" at the foot, or a paragraph);
 *                  under the card its name and two badges at most, Variable or Static, and Licensed or Not installed
 *                  (owner: "dont put too much type data in the card name footer, use that for status badges or
 *                  indicators or controls"; "the text is just the design and the only thing in the card").
 */
import { useState, type CSSProperties, type ReactNode } from "react";
import { Badge, Card, Select, Table, TableCell, TableHeaderCell, Toolbar, ToolbarGroup, ToolbarItem } from "@area/react";
import { feedScale } from "./app-scale.ts";
import { BarRow } from "./inspector-rows.tsx";
/** The Inspector's one field width (inspector-rows.tsx FIELD_CH): "72px", "1.00", "120%" all fit. */
const FIELD_CH = 5;
import { FEED_FRAME, FEED_TABLE, GALLERY_LOOK, Tile } from "./tile.tsx";
import { factsOf, stackOf, typefaceOf, type FaceFacts, type Typeface } from "./pages/typefaces.tsx";

export interface TypeRow { key: string; name: ReactNode; values?: readonly ReactNode[]; sample: ReactNode }

/** A role's metrics as a ramp's columns (TYPE_COLUMNS): size, line height, tracking and weight, each its own. */
export const TYPE_COLUMNS = ["Size", "Line height", "Tracking", "Weight"] as const;
export function typeValues(metrics: { size: number; leading: number; tracking: string }, weight: number) {
  return [metrics.size, metrics.leading, !metrics.tracking || metrics.tracking === "0em" ? "0" : metrics.tracking, weight];
}

/**
 * One column per metric (owner, 2026-11-02: "style, size, line height, weight all have their own columns"; "be more
 * intentional about column widths and alignment in tables"), each sized by what it holds, with Table's own cell options:
 * the style as narrow as its longest name (`fit`), each metric as narrow as its heading and values and set to the end in
 * tabular figures so its digits line up down the column (`numeric`), the sample in the rest of the width; every cell on
 * the row's first baseline (`baseline`), so a 67 sample and its 13 figures read as one line.
 */
export function TypeTable({ label, rows, columns = [], sampleHeader = "Sample" }: { label: string; rows: readonly TypeRow[]; columns?: readonly string[]; sampleHeader?: string }) {
  return (
    <Table wrapperProps={FEED_TABLE} size="md" baseline aria-label={label}>
      <thead><tr><TableHeaderCell fit>Style</TableHeaderCell>{columns.map(column => <TableHeaderCell key={column} numeric fit>{column}</TableHeaderCell>)}<TableHeaderCell>{sampleHeader}</TableHeaderCell></tr></thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.key}>
            <TableCell fit>{row.name}</TableCell>
            {columns.map((column, index) => <TableCell key={column} numeric fit>{row.values?.[index]}</TableCell>)}
            <td><span className="studio-type-cell">{row.sample}</span></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

/** The weights' names, as a face's styles are named (Pangram's and Google Fonts' lists). */
export const WEIGHT_NAMES = [["Thin", 100], ["Extra light", 200], ["Light", 300], ["Regular", 400], ["Medium", 500], ["Semibold", 600], ["Bold", 700], ["Extra bold", 800], ["Black", 900]] as const;

interface FaceStyle { value: string; label: string; weight: number; italic: boolean }
/** A face's styles: each named weight it draws (every one in a variable range, the static ones it has), upright then italic. */
export function stylesOf(facts: FaceFacts | undefined): FaceStyle[] {
  const draws = (italic: boolean) => {
    const own = (facts?.styles ?? [{ weight: "400", style: "normal" }]).filter(style => (style.style === "italic") === italic);
    return WEIGHT_NAMES.filter(([, weight]) => own.some(style => {
      const [low, high = low] = style.weight.split(" ").map(Number);
      return weight >= low! && weight <= high!;
    }));
  };
  return [false, true].flatMap(italic => draws(italic).map(([name, weight]) => ({
    value: `${weight}${italic ? "i" : ""}`, label: italic ? `${name} italic` : name, weight, italic,
  })));
}

/**
 * A face's badges, two at most (owner, 2026-11-02: "what other badges besides variable can typefaces have"): what its files
 * are, Variable or Static, in the neutral tone, as a fact; and how Area may use it only where that asks something of you,
 * in a tone: Licensed (info: publishing needs the foundry's licence) and Not installed (warning, orange: Area cannot draw it
 * until it is). An open face says nothing (most are; Built in was every card's), nor does a file format (Area serves
 * woff2 and reads whatever the Mac has, so it never changes what you can do).
 */
export function badgesOf(face: Typeface, facts: FaceFacts | undefined): Array<{ label: string; tone: "neutral" | "info" | "warning" }> {
  const kind = facts ? [{ label: facts.axes.some(axis => axis.tag === "wght") ? "Variable" : "Static", tone: "neutral" as const }] : [];
  const missing = !facts && !face.source.system ? [{ label: "Not installed", tone: "warning" as const }] : [];
  const licensed = face.tier === "licensed" || face.tier === "own-copy" ? [{ label: "Licensed", tone: "info" as const }] : [];
  return [...kind, ...missing, ...licensed].slice(0, 2);
}

/** The faces a tester offers: Area's own, then serifs and a display face from the library, each shipped with Area. */
export const TESTER_FACES = ["geist", "inter", "fraunces", "newsreader", "cormorant", "playfair", "space-grotesk", "geist-mono"] as const;

/* One sample line, a pangram, everywhere a line of type is shown (owner, 2026-11-02: "i like The five boxing wizards jumped
   quickly"): the display line, a heading, the ramp and style tables, a role's card. Every letter, a capital and a full stop.
   Paragraphs are prose, not stacked pangrams ("use some other placeholder copy for paragraphs"), and abstract, a quiet
   scene with no subject of its own, so a reader looks at the type, not the argument ("more generic and/or abstract or niche
   literature, no m dashes"): commas, a colon, a question, quotes and a figure, never an em dash. They were "Quick zephyrs
   blow, vexing daft Jim!", "Sphinx of black quartz, judge my vow." and four pangrams run together, for a day;
   "Hamburgefonstiv" before. */
export const TYPE_SAMPLE = "The five boxing wizards jumped quickly.";
export const TYPE_PARAGRAPH = "A quiet room at the edge of the morning, where the light comes in sideways and settles on the table. Nothing much happens here, and that is the point: the pages turn, the tea goes cold, and at 6:40 a clock somewhere agrees with itself. Who keeps the hours when no one is “counting” them?";
/** A paragraph card's excerpt: the paragraph's first clause, short enough that it fits whole in a 16:9 card at its 18 at the
 *  cards' least width (owner, 2026-11-02: "make sure the paragraph isnt too long so it actually fits in the card without the
 *  text being cutoff"); the card clipped the full paragraph after its sixth line. */
export const TYPE_EXCERPT = "A quiet room at the edge of the morning, where the light comes in sideways.";
/** The samples the pages used before, so a saved sample that is still one of them takes today's. */
const RETIRED_SAMPLES = new Set(["Sphinx of black quartz, judge my vow.", "Quick zephyrs blow, vexing daft Jim!", "Hamburgefonstiv"]);
/** A page's saved sample line, today's when the saved one was a retired default. */
export const savedSample = (stored: string) => (RETIRED_SAMPLES.has(stored) ? TYPE_SAMPLE : stored);
const TESTER_TEXT = {
  display: TYPE_SAMPLE,
  heading: TYPE_SAMPLE,
  body: TYPE_PARAGRAPH,
};

/** One bar in a tester's toolbar: its name, then the Inspector's bar and value field (inspector-rows.tsx
 *  BarRow; owner, 2026-11-02: "make these sliders use the same sliders + input on the side that the inspector in area uses"):
 *  the label-inside bar without its text and a 5-character field that takes a typed value. They were Slider's own label and
 *  readout either side of the rail (Pangram's pill ranges). The bar keeps its own arrow keys, so it is not one of the
 *  toolbar's roving items. */
function Control({ name, label, min, max, step, value, unit = "", places = 0, hidden, onChange }: {
  name: string; label: string; min: number; max: number; step: number; value: number; unit?: string; places?: number; hidden?: boolean; onChange: (value: number) => void;
}) {
  const show = (at: number) => `${at.toFixed(places)}${unit}`;
  // No divider before it (owner, 2026-11-02: "remove the dividers here, just use gaps, the dividers are barely visible
  // anyway"): a group's room before it parts it from the last (typography.css).
  return (
    <span className="studio-tester__control studio-tester__control--bar" data-tt={name} data-unit={unit} data-places={places} hidden={hidden}>
      <span className="studio-tester__label" aria-hidden="true">{label}</span>
      <BarRow bar={{ size: "sm", min, max, step, value, stepMarks: false, onValueChange: onChange, "aria-label": label }} shown={value}
        readout={show} text={show} ch={FIELD_CH} name={label} onSet={onChange} />
    </span>
  );
}

/** The bars a tester offers: the display line all of them, a paragraph its size alone (Pangram's half cards). */
type Bar = "size" | "leading" | "tracking" | "width";
interface TesterProps {
  /** The typefaces to offer: one draws no picker (a typeface's own page). */
  faces: readonly string[];
  defaultFace: string;
  /** Draws a single face whose files are the Mac's own (a licensed face), whose family the catalogue doesn't hold. */
  stack?: string;
  kind: "display" | "heading" | "body";
  size: number;
  weight: number;
  leading: number;
  bars: readonly Bar[];
  text: string;
  max: number;
}

function Tester({ faces, defaultFace, stack, kind, size: startSize, weight: startWeight, leading: startLeading, bars, text, max }: TesterProps) {
  const list = faces.map(id => typefaceOf(id)).filter((face): face is Typeface => Boolean(face));
  const [faceId, setFaceId] = useState(defaultFace);
  const face = list.find(entry => entry.id === faceId) ?? list[0]!;
  const facts = factsOf(face, undefined);
  const styles = stylesOf(facts);
  const [styleValue, setStyle] = useState(String(startWeight));
  const style = styles.find(entry => entry.value === styleValue) ?? styles.find(entry => !entry.italic && entry.weight >= startWeight) ?? styles[0];
  const [size, setSize] = useState(startSize);
  const [leading, setLeading] = useState(startLeading);
  const [tracking, setTracking] = useState(0);
  const [width, setWidth] = useState(100);
  const single = list.length === 1;
  const wdth = facts?.axes.find(axis => axis.tag === "wdth");
  const sample = {
    fontFamily: single && stack ? stack : stackOf(face, facts),
    "--tt-size": `${size}px`, "--tt-weight": style?.weight ?? startWeight, "--tt-style": style?.italic ? "italic" : "normal",
    "--tt-leading": leading, "--tt-tracking": `${tracking / 100}em`, "--tt-width": `${width}%`,
  } as CSSProperties;
  return (
    <Card {...FEED_FRAME} className="studio-frame studio-tester" data-tester={kind}>
      {/* Area's Toolbar (owner, 2026-11-02: "make sure area components are used throughout"): the face and style a group of
          its roving items, 8 apart (the cluster gap) and each as wide as its longest option (Toolbar's select rule); then
          each bar after the toolbar's divider, 8 either side of it (Figma's tool groups), the bars sharing the rest. */}
      <div className="studio-tester__head">
      <Toolbar size="sm" variant="plain" fullWidth aria-label={`${kind === "display" ? "Display" : kind === "heading" ? "Heading" : "Body"} tester`} className="studio-tester__bar" {...feedScale()}>
        <ToolbarGroup>
          {single ? null : (
            <span className="studio-tester__control" data-tt="face">
              <ToolbarItem>
                <Select size="sm" variant="soft" aria-label="Typeface" value={face.id} onChange={event => setFaceId(event.target.value)}>
                  {list.map(entry => {
                    const entryFacts = factsOf(entry, undefined);
                    return <option key={entry.id} value={entry.id} data-family={stackOf(entry, entryFacts)} data-wdth={entryFacts?.axes.some(axis => axis.tag === "wdth") ? "" : undefined}>{entry.name}</option>;
                  })}
                </Select>
              </ToolbarItem>
            </span>
          )}
          <span className="studio-tester__control" data-tt="style">
            <ToolbarItem>
              <Select size="sm" variant="soft" aria-label="Style" value={style?.value} onChange={event => setStyle(event.target.value)}>
                {styles.map(entry => <option key={entry.value} value={entry.value} data-weight={entry.weight} data-italic={entry.italic ? "" : undefined}>{entry.label}</option>)}
              </Select>
            </ToolbarItem>
          </span>
        </ToolbarGroup>
        <span className="studio-tester__bars">
          {bars.includes("size") ? <Control name="size" label="Size" min={8} max={max} step={1} value={size} unit="px" onChange={setSize} /> : null}
          {bars.includes("leading") ? <Control name="leading" label="Leading" min={0.8} max={2} step={0.05} value={leading} places={2} onChange={setLeading} /> : null}
          {bars.includes("tracking") ? <Control name="tracking" label="Spacing" min={-5} max={10} step={0.5} value={tracking} places={1} onChange={setTracking} /> : null}
          {/* Only a face with a width axis draws a width (Playfair among these); the bar is there, hidden, for the rest. */}
          {bars.includes("width") ? <Control name="width" label="Width" min={wdth?.min ?? 75} max={wdth?.max ?? 125} step={1} value={width} unit="%" hidden={!wdth} onChange={setWidth} /> : null}
        </span>
      </Toolbar>
      </div>
      <p className={`studio-tester__sample studio-tester__sample--${kind}`} style={sample} contentEditable suppressContentEditableWarning spellCheck={false}>{text}</p>
    </Card>
  );
}

/** A face to try: the display line the feed's width, then a heavy and a regular paragraph side by side. */
export function TypeTesters({ faces = TESTER_FACES, defaultFace = "geist", stack }: { faces?: readonly string[]; defaultFace?: string; stack?: string }) {
  const shared = { faces, defaultFace, stack };
  return (
    <div className="studio-testers">
      <Tester {...shared} kind="display" size={72} weight={500} leading={1} bars={["size", "leading", "tracking", "width"]} text={TESTER_TEXT.display} max={240} />
      <div className="studio-testers__pair">
        <Tester {...shared} kind="heading" size={28} weight={600} leading={1.15} bars={["size"]} text={TESTER_TEXT.heading} max={72} />
        <Tester {...shared} kind="body" size={15} weight={400} leading={1.5} bars={["size"]} text={TESTER_TEXT.body} max={32} />
      </div>
    </div>
  );
}

/**
 * A face as a card: the type alone in it ("Aa" at its foot, or a paragraph from its top), the card inset in (owner,
 * 2026-11-02: "these typeface and paragraph cards can be treated as the text is just the design and the only thing in the
 * card"; a line naming the foundry sat over it a day), and under the card its name and badges (badgesOf).
 */
export function TypefaceCard({ face, facts, sample = "glyphs", option, onOpen }: {
  face: Typeface; facts: FaceFacts | undefined; sample?: "glyphs" | "paragraph"; option?: string; onOpen?: () => void;
}) {
  const badges = badgesOf(face, facts);
  const drawn = Boolean(facts) || Boolean(face.source.system);
  return (
    <Tile container="asset" look={GALLERY_LOOK} aspect="hug" span="wide" stage="flow" inert={option === undefined} option={option}
      label={face.name} aria-label={[face.name, face.foundry, ...badges.map(badge => badge.label)].join(", ")} onOpen={onOpen}
      actions={badges.length ? <>{badges.map(badge => <Badge key={badge.label} variant="soft" tone={badge.tone} className="gallery-tile__badge">{badge.label}</Badge>)}</> : undefined}>
      <span className="studio-type-card" data-sample={sample} aria-hidden="true">
        <span className={`studio-type-card__sample${drawn ? "" : " studio-muted"}`} style={{ fontFamily: drawn ? stackOf(face, facts) : undefined }}>
          {sample === "glyphs" ? "Aa" : TYPE_EXCERPT}
        </span>
      </span>
    </Tile>
  );
}

/** A face from the catalogue as a card, by id (the feed's samples). */
export function TypefaceCardOf({ id, sample }: { id: string; sample?: "glyphs" | "paragraph" }) {
  const face = typefaceOf(id);
  return face ? <TypefaceCard face={face} facts={factsOf(face, undefined)} sample={sample} /> : null;
}
