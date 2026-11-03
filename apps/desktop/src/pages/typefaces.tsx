/**
 * The typeface library in Typography (owner, 2026-10-31: "a fontbook like experience for all these typefaces ... showing
 * all the glyphs in each typeface in a similar manner to the icons"; "type specimen like documentation for each typeface
 * ... just like google fonts. use tables to document all the information"). docs/research/typefaces-2026-10-31.
 *
 *   Overview  a card per face ("Aa" in the face, the name under it), grouped Text, Display, Code and Licensed, beside
 *             the type roles (src/pages/typography.tsx), or a table
 *   A face    Area's Tabs, as a component family's page (src/family-tabs.tsx):
 *               Specimen  the sample on Area's ramp in the face, its styles, and a display face over a Geist body
 *               Glyphs    every character, the shared glyph sheet (src/glyph-sheet.tsx), by Unicode block
 *               About     tables: overview, licence, metrics, Area tuning, axes, styles, features, coverage
 *               Code      how to load it and the font stack
 *
 * Words come from src/content/typefaces/catalogue.mjs; measurements from generated/faces.json for the faces Area ships
 * (scripts/typefaces.mjs), and from the Electron main process for licensed faces installed on the Mac
 * (electron/main.cjs, "area:fonts-installed"), never their files. Characters' names: generated/unicode.json.
 */
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Badge, CodeBlock, Code, EmptyState, Field, Link, PanelSection, Select, Table, TableCell, TableLink, Tabs, Textarea } from "@area/react";
import { CopyIcon } from "@area/icons";
// @ts-expect-error — the catalogue is authored in JavaScript.
import { TYPEFACES as CATALOGUE } from "../content/typefaces/catalogue.mjs";
import FACES_JSON from "../content/typefaces/generated/faces.json";
import UNICODE_JSON from "../content/typefaces/generated/unicode.json";
import { CanvasSettings } from "../canvas-settings.tsx";
import { TYPE_COLUMNS, TYPE_SAMPLE, TypeTable, TypeTesters, typeValues } from "../type-kit.tsx";
import { CopyButton } from "../copy.tsx";
import { DataTable, FactTable, Section } from "../family-tabs.tsx";
import { Facts } from "../facts.tsx";
import { GlyphCell, GlyphGrid, GlyphSheet } from "../glyph-sheet.tsx";
import { Preview, Selection } from "../inspector.tsx";
import { hrefOf } from "../places.ts";
import { appScale } from "../app-scale.ts";
import { Specimen } from "../specimen-scope.tsx";
import { readStored, writeStored } from "../storage.ts";
import { useStudio, Workspace } from "../studio.tsx";
import { CanvasSection, FEED_CODE, FEED_TABLE } from "../tile.tsx";
import { DEFAULT_TYPE, TYPE_ROLES } from "../tokens.ts";
import { useViewOption, ViewControls, ViewFilter, ViewSwitch, type ViewMode } from "../view-controls.tsx";

/* --- Data --------------------------------------------------------------------- */

export type FaceKind = "text" | "display" | "code";
export type FaceTier = "open" | "libre" | "licensed" | "own-copy" | "system";
export interface Typeface {
  id: string; name: string; kind: FaceKind; tier: FaceTier; foundry: string; designers: string[]; licence: string;
  onGoogleFonts?: string; about: string; englishOnly?: boolean; family?: string[];
  source: { fontsource?: string; geist?: string; files?: string; installed?: string[]; fontshare?: string; system?: boolean };
  links: { googleFonts?: string; source?: string; foundry?: string };
}
/** What a face's files say about it (scripts/typeface-facts.cjs): the same shape from the generator and the main process. */
export interface FaceFacts {
  family: string;
  names: { family?: string; style?: string; version?: string; designer?: string; manufacturer?: string; copyright?: string; licenseURL?: string };
  styles: Array<{ weight: string; style: string; name?: string }>;
  axes: Array<{ tag: string; name: string; min: number; default: number; max: number }>;
  instances: string[];
  features: string[];
  characters: number;
  ranges: Array<[number, number]>;
  blocks?: Record<string, number>;
  metrics: { unitsPerEm: number; xHeight: number; capHeight: number; xToCap: number | null; ascender: number; descender: number; lineHeight: number; averageWidth: number };
  tuning: { xHeightAdjust: number | null; stem?: number; iconStroke?: number; strong?: number | null; emphasis?: number | null; tracking: "optical" | "manual" };
  files: number;
  glyphNames?: Record<string, string>;
}

export const TYPEFACES = CATALOGUE as Typeface[];
const FACES = FACES_JSON as unknown as Record<string, FaceFacts>;
const UNICODE = UNICODE_JSON as unknown as { version: string; blocks: Array<[number, number, string]>; names: Record<string, string> };
const BY_ID = new Map(TYPEFACES.map(face => [face.id, face]));
export const typefaceOf = (id: string | undefined) => (id ? BY_ID.get(id) : undefined);

export const KINDS: ReadonlyArray<{ id: string; label: string; lede: string; test: (face: Typeface) => boolean }> = [
  { id: "text", label: "Text", lede: "Faces for interface text and reading. Each ships with Area.", test: face => face.kind === "text" && isShipped(face) },
  { id: "display", label: "Display", lede: "Faces for titles and display sizes only, over a plain body.", test: face => face.kind === "display" && isShipped(face) },
  { id: "code", label: "Code", lede: "Monospaced faces for code, keys and data.", test: face => face.kind === "code" && isShipped(face) },
  { id: "licensed", label: "Licensed", lede: "Commercial and free-with-terms faces. Area draws them only when installed on this Mac; publishing needs a licence from the foundry.", test: face => !isShipped(face) },
];
function isShipped(face: Typeface) { return face.tier === "open" || face.tier === "libre" || face.tier === "system"; }

/** Faces installed on the Mac, asked for once (electron/main.cjs). Undefined while asking, null outside Electron. */
let installed: Promise<Record<string, FaceFacts> | null> | undefined;
export function useInstalled(): Record<string, FaceFacts> | null | undefined {
  const [value, setValue] = useState<Record<string, FaceFacts> | null | undefined>(undefined);
  useEffect(() => {
    const ask = typeof window !== "undefined" ? window.areaDesktop?.installedFonts : undefined;
    installed ??= ask
      ? ask(TYPEFACES.filter(face => face.source.installed).map(face => ({ id: face.id, names: face.source.installed! })))
        .then(result => (result ?? null) as Record<string, FaceFacts> | null, () => null)
      : Promise.resolve(null);
    let live = true;
    installed.then(result => { if (live) setValue(result); });
    return () => { live = false; };
  }, []);
  return value;
}

/** A face's facts: the generator's for a shipped face, the Mac's for an installed one. */
export const factsOf = (face: Typeface, mac: Record<string, FaceFacts> | null | undefined) => FACES[face.id] ?? mac?.[face.id];

/** The CSS font-family that draws a face: its own family name (shipped or installed), or the system's stack. */
export function stackOf(face: Typeface, facts: FaceFacts | undefined) {
  if (face.source.system) return `system-ui, -apple-system, "Segoe UI", sans-serif`;
  return facts ? `"${facts.family}", var(--area-font-sans)` : "var(--area-font-sans)";
}

/** How Area may use the face, in a word and a sentence (docs/research/typefaces-2026-10-31, the licence table). */
export function useOf(face: Typeface, facts: FaceFacts | undefined): { label: string; tone: "success" | "info" | "caution" | "neutral"; text: string } {
  switch (face.tier) {
    case "open": case "libre": return { label: "Built in", tone: "success", text: "Ships with Area under its open licence, so any system can use it and publish it." };
    case "system": return { label: "System", tone: "neutral", text: "The operating system's own face: nothing to download or license." };
    case "own-copy": return facts
      ? { label: "Installed", tone: "info", text: "Free under Fontshare's licence, which forbids offering it as a built-in choice. Drawn from your own installed copy." }
      : { label: "Not installed", tone: "caution", text: "Free under Fontshare's licence, which forbids offering it as a built-in choice. Download it from Fontshare to see it here." };
    default: return facts
      ? { label: "Installed", tone: "info", text: "Drawn from the copy installed on this Mac. Publishing it needs a web licence from the foundry." }
      : { label: "Not installed", tone: "caution", text: "Install the foundry's fonts (a trial is enough to look) to see it here. Publishing it needs a web licence." };
  }
}

export const KIND_LABEL: Record<FaceKind, string> = { text: "Text", display: "Display", code: "Code" };
const hex = (cp: number) => cp.toString(16).toUpperCase().padStart(4, "0");
const blockOf = (cp: number) => UNICODE.blocks.find(([start, end]) => cp >= start && cp <= end)?.[2] ?? "Unassigned";
const nameOf = (cp: number) => UNICODE.names[cp.toString(16).toUpperCase()] ?? `U+${hex(cp)}`;
/** A character as text: combining marks on a dotted circle, as Font Book shows them, so they have something to sit on. */
const charOf = (cp: number) => (/\p{M}/u.test(String.fromCodePoint(cp)) ? `◌${String.fromCodePoint(cp)}` : String.fromCodePoint(cp));
const codePointsOf = (facts: FaceFacts) => facts.ranges.flatMap(([first, last]) => Array.from({ length: last - first + 1 }, (_, index) => first + index));
/** The accents the research checks for Latin Extended (Polish, Czech, Turkish and the rest), and how many a face has. */
const ACCENTS = "ąćęłńśźżőűşğıčřžěůñçãõåøæœß€№";
const accentsOf = (facts: FaceFacts) => { const set = new Set(codePointsOf(facts)); return [...ACCENTS].filter(char => set.has(char.codePointAt(0)!)).length; };
const numberOf = (value: number | null | undefined, places = 3) => (value == null ? "—" : String(Number(value.toFixed(places))));

/** OpenType feature names for the About tab's table. */
const FEATURES: Record<string, string> = {
  aalt: "Access all alternates", calt: "Contextual alternates", case: "Case-sensitive forms", ccmp: "Glyph composition", clig: "Contextual ligatures",
  cpsp: "Capital spacing", cv01: "Character variant 1", dlig: "Discretionary ligatures", dnom: "Denominators", frac: "Fractions", kern: "Kerning",
  liga: "Standard ligatures", lnum: "Lining figures", locl: "Localized forms", mark: "Mark positioning", mkmk: "Mark to mark positioning",
  numr: "Numerators", onum: "Oldstyle figures", ordn: "Ordinals", pnum: "Proportional figures", salt: "Stylistic alternates", sinf: "Scientific inferiors",
  smcp: "Small capitals", c2sc: "Capitals to small capitals", subs: "Subscript", sups: "Superscript", tnum: "Tabular figures", zero: "Slashed zero",
  rlig: "Required ligatures", rvrn: "Required variation alternates", dist: "Distances", abvm: "Above-base mark positioning", blwm: "Below-base mark positioning",
  init: "Initial forms", medi: "Medial forms", fina: "Terminal forms", isol: "Isolated forms", hist: "Historical forms", titl: "Titling", swsh: "Swash",
  ornm: "Ornaments", pcap: "Petite capitals", unic: "Unicase", size: "Optical size", ital: "Italics", hlig: "Historical ligatures", rand: "Randomize",
};
const featureName = (tag: string) => FEATURES[tag] || (/^ss\d\d$/.test(tag) ? `Stylistic set ${Number(tag.slice(2))}` : /^cv\d\d$/.test(tag) ? `Character variant ${Number(tag.slice(2))}` : "—");

/** A weight's name, as the Styles table says it. */
const WEIGHT_NAMES: Record<number, string> = { 100: "Thin", 200: "Extra Light", 300: "Light", 400: "Regular", 500: "Medium", 600: "Semibold", 700: "Bold", 800: "Extra Bold", 900: "Black" };
/** The styles to show: each named instance, else each hundred in the weight axis, else each file's weight; italics after. */
function stylesOf(facts: FaceFacts): Array<{ name: string; weight: number; italic: boolean }> {
  const italics = facts.styles.some(style => style.style === "italic");
  const wght = facts.axes.find(axis => axis.tag === "wght");
  const weights = wght
    ? Object.keys(WEIGHT_NAMES).map(Number).filter(weight => weight >= wght.min && weight <= wght.max)
    : [...new Set(facts.styles.filter(style => style.style !== "italic").map(style => Number(style.weight.split(" ")[0])))].sort((a, b) => a - b);
  const named = (weight: number) => facts.styles.find(style => !style.weight.includes(" ") && Number(style.weight) === weight && style.name)?.name ?? WEIGHT_NAMES[weight] ?? String(weight);
  const roman = weights.map(weight => ({ name: named(weight), weight, italic: false }));
  const italic = italics ? (wght ? weights : [...new Set(facts.styles.filter(style => style.style === "italic").map(style => Number(style.weight.split(" ")[0])))])
    .map(weight => ({ name: `${WEIGHT_NAMES[weight] ?? weight} Italic`, weight, italic: true })) : [];
  return [...roman, ...italic];
}

/* --- Overview cards ------------------------------------------------------------- */

/** A face's card sample: "Aa" in the face, or in Area's own when it isn't on this Mac. */
export function FaceSample({ face, facts, className, style }: { face: Typeface; facts: FaceFacts | undefined; className?: string; style?: CSSProperties }) {
  const drawn = Boolean(facts) || Boolean(face.source.system);
  return <span className={`${className ?? ""}${drawn ? "" : " studio-muted"}`} style={{ ...style, fontFamily: drawn ? stackOf(face, facts) : undefined }}>Aa</span>;
}

/** The overview's facts for a face chosen there, and its Inspector (src/pages/typography.tsx). */
export function FaceSummary({ face, facts }: { face: Typeface; facts: FaceFacts | undefined }) {
  const use = useOf(face, facts);
  return (
    <>
      <Selection preview={<Preview label={face.name}><FaceSample face={face} facts={facts} style={{ fontSize: "var(--area-display-sm-size)" }} /></Preview>} />
      <PanelSection heading="Typeface">
        <Facts label="Typeface" note={face.about} items={[
          ["Foundry", face.foundry],
          ["Kind", KIND_LABEL[face.kind]],
          ["In Area", <Badge size="sm" variant="soft" tone={use.tone}>{use.label}</Badge>],
          facts ? ["Characters", facts.characters.toLocaleString()] : null,
          facts?.axes.length ? ["Axes", facts.axes.map(axis => axis.tag).join(", ")] : null,
        ]} />
      </PanelSection>
    </>
  );
}

/* --- A face ---------------------------------------------------------------------- */

const TABS = [
  { id: "specimen", label: "Specimen" },
  { id: "glyphs", label: "Glyphs" },
  { id: "about", label: "About" },
  { id: "code", label: "Code" },
] as const;
type Tab = (typeof TABS)[number]["id"];
export const TAB_IDS = TABS.map(tab => tab.id) as readonly string[];

/* Glyph sizes: Font Book's repertoire runs about 32 to 64; the sheet's cells follow the size, as the icons' do. */
const GLYPH_SIZES = [24, 32, 40, 48, 64, 80, 96] as const;
const SAMPLE = TYPE_SAMPLE;

/**
 * A face's own Workspace: the Sidebar passed in from Typography, the face's tabs on the Canvas, the chosen character or
 * the face in the Inspector.
 */
export function TypefaceWorkspace({ face, tab: routeTab, sidebar }: { face: Typeface; tab?: string; sidebar: ReactNode }) {
  const { select } = useStudio();
  const mac = useInstalled();
  const facts = factsOf(face, mac);
  const tab: Tab = (TAB_IDS.includes(routeTab ?? "") ? routeTab : "specimen") as Tab;
  const onTab = (next: Tab) => select(next === "specimen" ? `face/${face.id}` : `face/${face.id}/${next}`);
  const [sample, setSample] = useState(() => readStored("typeSample", SAMPLE));
  const changeSample = (value: string) => { setSample(value); writeStored("typeSample", value); };
  const [size, setSize] = useState<number>(() => { const saved = Number(readStored("glyphSize", 48)); return (GLYPH_SIZES as readonly number[]).includes(saved) ? saved : 48; });
  useEffect(() => writeStored("glyphSize", size), [size]);
  const [mode, setMode] = useViewOption<ViewMode>("glyphs-view", "grid", ["grid", "list"]);
  const [block, setBlock] = useState("all");
  const [glyph, setGlyph] = useState<number>();
  useEffect(() => { setGlyph(undefined); setBlock("all"); }, [face.id]);
  const stack = stackOf(face, facts);
  const drawn = Boolean(facts) || Boolean(face.source.system);
  const blocks = useMemo(() => {
    if (!facts) return [];
    const groups = new Map<string, number[]>();
    for (const cp of codePointsOf(facts)) { const name = blockOf(cp); groups.set(name, [...(groups.get(name) ?? []), cp]); }
    return [...groups].map(([name, cps]) => ({ name, cps }));
  }, [facts]);
  const shownBlocks = block === "all" ? blocks : blocks.filter(entry => entry.name === block);
  const pending = mac === undefined && !FACES[face.id] && face.source.installed;
  const use = useOf(face, facts);

  const missing = (
    <EmptyState title={pending ? "Looking for it on this Mac" : "Not installed"}
      description={pending ? "Reading the fonts installed on this Mac." : `${use.text}`}
      actions={face.links.foundry ? <Link href={face.links.foundry} target="_blank" rel="noreferrer">{face.links.foundry.replace(/^https:\/\/(www\.)?/, "")}</Link> : undefined} />
  );

  const panel = tab === "specimen" ? (drawn ? <SpecimenTab face={face} facts={facts} stack={stack} sample={sample || SAMPLE} /> : missing)
    : tab === "glyphs" ? (facts ? (
      <GlyphSheet grid={mode === "grid"} label={`${face.name} characters`} value={glyph === undefined ? null : hex(glyph)} onChoose={value => setGlyph(parseInt(value, 16))} size={size}>
        {shownBlocks.map(entry => (
          <CanvasSection key={entry.name} role={mode === "grid" ? "group" : undefined} id={`glyphs-${entry.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} title={entry.name} count={entry.cps.length}>
            {mode === "grid" ? (
              <GlyphGrid>
                {entry.cps.map(cp => (
                  <GlyphCell key={cp} value={hex(cp)} label={nameOf(cp)}
                    card={() => ({
                      name: facts.glyphNames?.[cp.toString(16).toUpperCase()] ?? `U+${hex(cp)}`,
                      meta: entry.name,
                      preview: <span className="studio-glyphs__char" style={{ fontFamily: stack }}>{charOf(cp)}</span>,
                      detail: <><span>U+{hex(cp)}</span><span>{nameOf(cp)}</span></>,
                      actions: <CopyButton label="Copy character" icon={<CopyIcon />} fullWidth size="md" value={() => String.fromCodePoint(cp)} />,
                    })}>
                    <span className="studio-glyphs__char" style={{ fontFamily: stack }}>{charOf(cp)}</span>
                  </GlyphCell>
                ))}
              </GlyphGrid>
            ) : (
              <Table wrapperProps={FEED_TABLE} size="md" interactive aria-label={entry.name}>
                <thead><tr><th scope="col">Glyph</th><th scope="col">Unicode</th><th scope="col">Name</th></tr></thead>
                <tbody>
                  {entry.cps.map(cp => (
                    <tr key={cp} data-selected={cp === glyph ? "" : undefined}>
                      <TableCell fit><Specimen as="span" className="studio-glyphs__glyph"><span className="studio-glyphs__char" style={{ fontFamily: stack }}>{charOf(cp)}</span></Specimen></TableCell>
                      <TableCell fit><TableLink href={hrefOf({ page: "typography", item: `face/${face.id}/glyphs` })} onClick={event => { event.preventDefault(); setGlyph(cp); }}><span className="studio-tabular">U+{hex(cp)}</span></TableLink></TableCell>
                      <td><span className="studio-muted">{nameOf(cp)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </CanvasSection>
        ))}
      </GlyphSheet>
    ) : face.source.system ? <EmptyState title="Glyphs vary by system" description="The system face is SF Pro on Mac and Segoe UI on Windows, so its characters depend on where it's shown." /> : missing)
    : tab === "about" ? <AboutTab face={face} facts={facts} />
    : <CodeTab face={face} facts={facts} />;

  const chosen = glyph !== undefined && facts ? glyph : undefined;
  return (
    <Workspace
      sidebar={sidebar}
      canvasTitle={face.name}
      canvasActions={tab === "glyphs" && facts ? (
        <ViewControls>
          <ViewFilter label="Block" value={block} onChange={setBlock} options={[{ value: "all", label: "All blocks" }, ...blocks.map(entry => ({ value: entry.name, label: entry.name }))]} />
          <Select size="sm" variant="soft" aria-label="Size" value={String(size)} onChange={event => setSize(Number(event.currentTarget.value))}
            style={{ "--area-select-inline-size": "calc(var(--area-space-64) + var(--area-space-8))" } as CSSProperties /* pick: 72, "96 px" and the chevron */}>
            {GLYPH_SIZES.map(value => <option key={value} value={value}>{value} px</option>)}
          </Select>
          <ViewSwitch value={mode} onChange={setMode} />
        </ViewControls>
      ) : undefined}
      canvas={
        <>
          {face.about ? <p className="studio-lede" {...appScale()}>{face.about}</p> : null}
          <Tabs className="studio-family-tabs" size="sm" aria-label={`${face.name} views`} value={tab} onValueChange={next => onTab(next as Tab)}
            items={TABS.map(entry => ({ id: entry.id, label: entry.label }))} {...appScale()}>
            {/* The tabs' panel is the app's; the samples inside take the Inspector's settings (specimen-scope.tsx). */}
            <div className="studio-family-tabs__panel">{panel}</div>
          </Tabs>
        </>
      }
      inspector={{
        theme: <CanvasSettings axes={["type", "density"]} />,
        design: chosen !== undefined ? (
          <>
            <Selection preview={<Preview label={nameOf(chosen)}><span className="studio-typeface-preview" style={{ fontFamily: stack }}>{charOf(chosen)}</span></Preview>} />
            <PanelSection heading="Character">
              <Facts label="Character" items={[
                ["Unicode", <span className="studio-tabular">U+{hex(chosen)}</span>],
                ["Name", nameOf(chosen)],
                ["Block", blockOf(chosen)],
                facts?.glyphNames?.[chosen.toString(16).toUpperCase()] ? ["Glyph", <Code>{facts.glyphNames[chosen.toString(16).toUpperCase()]}</Code>] : null,
                ["Decimal", <span className="studio-tabular">{chosen}</span>],
              ]} />
            </PanelSection>
          </>
        ) : (
          <>
            {tab === "specimen" ? (
              <PanelSection heading="Display">
                <Field label="Sample" orientation="vertical">
                  <Textarea size="sm" rows={3} value={sample} onChange={event => changeSample(event.currentTarget.value)} />
                </Field>
              </PanelSection>
            ) : null}
            <FaceSummary face={face} facts={facts} />
          </>
        ),
        code: chosen !== undefined ? (
          <>
            <Selection>
              <CopyButton label="Copy character" icon={<CopyIcon />} fullWidth value={() => String.fromCodePoint(chosen)} />
              <CopyButton label="Copy Unicode" icon={<CopyIcon />} fullWidth value={() => `U+${hex(chosen)}`} />
            </Selection>
            <PanelSection heading="Escapes">
              <Facts label="Escapes" items={[
                ["CSS", <Code>{`\\${hex(chosen)}`}</Code>],
                ["HTML", <Code>{`&#x${hex(chosen)};`}</Code>],
                ["JavaScript", <Code>{`\\u{${hex(chosen)}}`}</Code>],
              ]} />
            </PanelSection>
          </>
        ) : (
          <>
            <Selection>
              <CopyButton label="Copy font stack" icon={<CopyIcon />} fullWidth value={() => cssStack(face)} />
            </Selection>
            <PanelSection heading="Font stack"><Facts label="Font stack" items={[["family", <Code>{cssStack(face)}</Code>]]} /></PanelSection>
          </>
        ),
      }}
    />
  );
}

/* --- Specimen ------------------------------------------------------------------ */

const roleStyle = (id: string): CSSProperties => ({ fontSize: `var(--area-${id}-size)`, lineHeight: `var(--area-${id}-leading)`, letterSpacing: `var(--area-${id}-tracking)` });

function SpecimenTab({ face, facts, stack, sample }: { face: Typeface; facts: FaceFacts | undefined; stack: string; sample: string }) {
  const styles = facts ? stylesOf(facts) : [];
  return (
    <div className="studio-sections">
      <Section id="specimen-tester" title="Tester" lede="The face at display size on one line, then a heavy and a regular paragraph. Every sample is editable.">
        <TypeTesters faces={[face.id]} defaultFace={face.id} stack={stack} />
      </Section>
      <Section id="specimen-ramp" title="On Area's ramp" lede="The sample in this face at every role, at the Canvas's type size. The Inspector edits the sample.">
        <TypeTable label="On Area's ramp" columns={TYPE_COLUMNS.slice(0, 3)} rows={TYPE_ROLES.map(role => ({
          key: role.id, name: role.name, values: typeValues(role.metrics[DEFAULT_TYPE]!, 400).slice(0, 3),
          sample: <Specimen><span className="studio-type__sample" style={{ ...roleStyle(role.id), fontFamily: stack }}>{sample}</span></Specimen>,
        }))} />
      </Section>
      {face.kind === "display" ? (
        <Section id="specimen-pair" title="Over a plain body" lede="A display face sets the titles; the body stays Area's text face.">
          <Specimen>
            <div className="studio-typeface-pair">
              <span className="studio-typeface-pair__title" style={{ ...roleStyle("title-lg"), fontFamily: stack }}>{sample}</span>
              <p className="studio-typeface-pair__body">Body text sets the reading size. A display face carries the page's titles and the largest sizes, and leaves running text, labels and controls to the text face, so its character shows where it reads best.</p>
            </div>
          </Specimen>
        </Section>
      ) : null}
      {styles.length ? (
        <Section id="specimen-styles" title="Styles" count={styles.length} lede="Each weight and italic the face has, written in itself.">
          <Table wrapperProps={FEED_TABLE} size="md" aria-label="Styles">
            <thead><tr><th scope="col">Style</th><th scope="col">Weight</th><th scope="col">Sample</th></tr></thead>
            <tbody>
              {styles.map(entry => (
                <tr key={`${entry.weight}${entry.italic}`}>
                  <TableCell fit><span className="studio-nowrap">{entry.name}</span></TableCell>
                  <TableCell fit><span className="studio-tabular">{entry.weight}</span></TableCell>
                  <td><Specimen as="span"><span className="studio-typeface-style" style={{ fontFamily: stack, fontWeight: entry.weight, fontStyle: entry.italic ? "italic" : "normal" }}>Make it yours</span></Specimen></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>
      ) : null}
    </div>
  );
}

/* --- About ----------------------------------------------------------------------- */

function AboutTab({ face, facts }: { face: Typeface; facts: FaceFacts | undefined }) {
  const { select } = useStudio();
  const use = useOf(face, facts);
  const siblings = (face.family ?? []).map(id => BY_ID.get(id)).filter((entry): entry is Typeface => Boolean(entry));
  const link = (href: string | undefined, label?: string) => href ? <Link href={href} target="_blank" rel="noreferrer">{label ?? href.replace(/^https:\/\/(www\.)?/, "")}</Link> : null;
  const accents = facts ? accentsOf(facts) : undefined;
  const blockRows = facts ? Object.entries(facts.blocks ?? countBlocks(facts)).sort((a, b) => b[1] - a[1]) : [];
  return (
    <div className="studio-sections">
      <Section id="about-overview" title="Overview" lede="Who made it, where it comes from and what it's for.">
        <FactTable label="Overview" rows={[
          ["Foundry", face.foundry],
          face.designers.length ? ["Designers", face.designers.join(", ")] : null,
          ["Kind", KIND_LABEL[face.kind]],
          facts?.names.version ? ["Version", facts.names.version.replace(/;.*$/, "")] : null,
          face.onGoogleFonts ? ["On Google Fonts since", face.onGoogleFonts] : null,
          siblings.length ? ["Same family", <>{siblings.map((entry, index) => (
            <span key={entry.id}>{index ? ", " : null}<TableLink href={hrefOf({ page: "typography", item: `face/${entry.id}/about` })} onClick={event => { event.preventDefault(); select(`face/${entry.id}/about`); }}>{entry.name}</TableLink></span>
          ))}</>] : null,
          face.links.googleFonts ? ["Google Fonts", link(face.links.googleFonts, face.name)] : null,
          face.links.source ? ["Source", link(face.links.source)] : null,
          face.links.foundry ? ["Foundry site", link(face.links.foundry)] : null,
        ]} />
      </Section>
      <Section id="about-licence" title="Licence" lede="What the licence lets Area and a product do with it.">
        <FactTable label="Licence" rows={[
          ["Licence", face.licence],
          ["In Area", <Badge size="sm" variant="soft" tone={use.tone}>{use.label}</Badge>],
          ["Use", use.text],
          face.source.fontsource ? ["Package", <Code>{face.source.fontsource}</Code>] : face.source.geist ? ["Package", <Code>geist</Code>] : null,
          face.source.files ? ["Files", <Code>apps/desktop/assets/fonts/{face.source.files}</Code>] : null,
          face.source.installed && facts ? ["Installed as", facts.family] : null,
        ]} />
      </Section>
      {facts ? (
        <>
          <Section id="about-metrics" title="Metrics" lede="Measured from the regular style's file, per em. Geist's x-height is 0.530 and its cap height 0.710.">
            <FactTable label="Metrics" rows={[
              ["Units per em", facts.metrics.unitsPerEm],
              ["x-height", numberOf(facts.metrics.xHeight)],
              ["Cap height", numberOf(facts.metrics.capHeight)],
              ["x-height to cap", numberOf(facts.metrics.xToCap, 2)],
              ["Ascender", numberOf(facts.metrics.ascender)],
              ["Descender", numberOf(facts.metrics.descender)],
              ["Natural line height", numberOf(facts.metrics.lineHeight, 2)],
              ["Average lowercase width", numberOf(facts.metrics.averageWidth)],
            ]} />
          </Section>
          <Section id="about-tuning" title="Area tuning" lede="What this face needs to stand in for Geist on Area's ramp: matched weights, the size that keeps Geist's x-height, the icon stroke for its stem.">
            <FactTable label="Area tuning" rows={[
              ["Stem, to Geist's", numberOf(facts.tuning.stem, 2)],
              ["Strong weight", facts.tuning.strong ?? "—"],
              ["Bold weight", facts.tuning.emphasis ?? "—"],
              ["Size adjust", facts.tuning.xHeightAdjust == null ? "—" : `${numberOf(facts.tuning.xHeightAdjust, 2)}×`],
              ["Icon stroke at 14", facts.tuning.iconStroke == null ? "—" : `${numberOf(facts.tuning.iconStroke)} px`],
              ["Tracking", facts.tuning.tracking === "optical" ? "Its optical-size axis tracks itself" : "Area's hand-built tracking"],
            ]} />
          </Section>
          {facts.axes.length ? (
            <Section id="about-axes" title="Axes" count={facts.axes.length} lede="The variable font's axes.">
              <DataTable label="Axes" head={["Tag", "Axis", "Minimum", "Default", "Maximum"]} fit={[0, 2, 3, 4]}
                rows={facts.axes.map(axis => [<Code>{axis.tag}</Code>, axis.name, axis.min, axis.default, axis.max])} />
            </Section>
          ) : null}
          <Section id="about-styles" title="Styles" count={facts.styles.length} lede="The files this face loads: a weight range for a variable font, one weight for each static file.">
            <DataTable label="Styles" head={["Weight", "Style", "Name"]} fit={[0, 1]}
              rows={facts.styles.map(style => [style.weight.replace(" ", " to "), style.style === "italic" ? "Italic" : "Roman", style.name ?? "—"])} />
          </Section>
          {facts.features.length ? (
            <Section id="about-features" title="OpenType features" count={facts.features.length}
              lede={face.source.fontsource ? "As served by Google Fonts, which drops stylistic sets and character variants from many families." : "The features in the face's files."}>
              <DataTable label="OpenType features" head={["Tag", "Feature"]} fit={[0]} rows={facts.features.map(tag => [<Code>{tag}</Code>, featureName(tag)])} />
            </Section>
          ) : null}
          <Section id="about-coverage" title="Coverage" lede="Characters by Unicode block, and the Latin Extended accents a product title in Polish, Czech or Turkish needs.">
            <FactTable label="Coverage" rows={[
              ["Characters", facts.characters.toLocaleString()],
              ["Accents", `${accents} of ${ACCENTS.length}${face.englishOnly ? ", English only" : ""}`],
              ["Blocks", blockRows.length],
            ]} />
            <DataTable label="Characters by block" head={["Block", "Characters"]} fit={[1]} rows={blockRows.map(([name, count]) => [name, count])} />
          </Section>
        </>
      ) : null}
    </div>
  );
}

function countBlocks(facts: FaceFacts) {
  const counts: Record<string, number> = {};
  for (const cp of codePointsOf(facts)) { const name = blockOf(cp); counts[name] = (counts[name] ?? 0) + 1; }
  return counts;
}

/* --- Code ------------------------------------------------------------------------ */

/** The family name a product would write: the package's own, or the face's. */
function cssFamily(face: Typeface) {
  if (face.source.fontsource) return face.source.fontsource.startsWith("@fontsource-variable/") ? `${face.name} Variable` : face.name;
  return face.name;
}
const GENERIC: Record<FaceKind, string> = { text: "sans-serif", display: "serif", code: "monospace" };
function cssStack(face: Typeface) {
  if (face.source.system) return `system-ui, -apple-system, "Segoe UI", sans-serif`;
  return `"${cssFamily(face)}", ${face.kind === "code" ? "ui-monospace, " : ""}${GENERIC[face.kind]}`;
}

function CodeTab({ face, facts }: { face: Typeface; facts: FaceFacts | undefined }) {
  const blocks: Array<{ id: string; title: string; lede: string; code: string; language: string }> = [];
  if (face.source.fontsource) {
    blocks.push({ id: "install", title: "Install", lede: "The face as an npm package, with every script subset Google Fonts serves.", code: `npm install ${face.source.fontsource}`, language: "bash" });
    blocks.push({ id: "import", title: "Import", lede: "Load it once, at the app's entry.", code: `import "${face.source.fontsource}";`, language: "javascript" });
  } else if (face.source.geist) {
    blocks.push({ id: "install", title: "Install", lede: "Vercel's own build, with italics and stylistic sets.", code: "npm install geist", language: "bash" });
  } else if (face.source.files) {
    blocks.push({ id: "font-face", title: "Load it", lede: "Copy the face's files from where it is published, with the licence, and declare them.", language: "css",
      code: (facts?.styles ?? [{ weight: "400", style: "normal" }]).map(style => `@font-face {\n  font-family: "${face.name}";\n  font-weight: ${style.weight};\n  font-style: ${style.style};\n  font-display: swap;\n  src: url("./fonts/${face.source.files}/…") format("woff2");\n}`).join("\n\n") });
  } else if (face.source.installed) {
    blocks.push({ id: "font-face", title: "Load it", lede: "With the foundry's web licence: its web font files, from your own server.", language: "css",
      code: `@font-face {\n  font-family: "${face.name}";\n  font-weight: 400;\n  font-style: normal;\n  font-display: swap;\n  src: url("/fonts/your-licensed-file.woff2") format("woff2");\n}` });
  }
  blocks.push({ id: "stack", title: "Font stack", lede: "The family, then the fallback for the kind.", language: "css", code: `font-family: ${cssStack(face)};` });
  return (
    <div className="studio-sections">
      {blocks.map(block => (
        <Section key={block.id} id={`code-${block.id}`} title={block.title} lede={block.lede}>
          <CodeBlock code={block.code} language={block.language} lineNumbers={false} {...FEED_CODE} {...appScale()} />
        </Section>
      ))}
    </div>
  );
}
