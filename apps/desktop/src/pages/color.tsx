/**
 * Color: the scales in the Sidebar; on the Canvas every scale's steps as painted tiles, or as a
 * list, filtered by the contrast their text needs; in the Inspector the chosen step (token, hex,
 * OKLCH, its contrast with the text it carries, and the semantic tokens that use it), else the
 * Sidebar's scale (its roles), else the palette.
 * Swatches paint the live custom property, so a neutral tint or theme change shows on the ramp; with Neutral set
 * to Cool or Warm, the neutral ramp's labels and Inspector describe that ramp's steps, the colours it paints.
 */
import { useEffect, useState, type ReactNode } from "react";
import TOKENS from "@area/tokens/tokens.json";
import { ROLE_SCALES } from "../../../../packages/tokens/src/color/presets.ts";
import { RAMP_STEPS, SERIES } from "../../../../packages/tokens/src/color/series.ts";
import { Code, ColorSwatch, CopyButton as AreaCopyButton, ListBox, EmptyState, PanelSection, Table, TableLink, Tooltip } from "@area/react";
import { CheckIcon, CopyIcon } from "@area/icons";
import { CopyButton } from "../copy.tsx";
import { SidebarList, SidebarTree, useStudio, Workspace } from "../studio.tsx";
import { hrefOf } from "../places.ts";
import { CanvasSection, Tile, TileGrid, WhenVisible, FEED_TABLE } from "../tile.tsx";
import { useViewOption, ViewControls, ViewFilter, ViewSwitch, type ViewMode } from "../view-controls.tsx";
import { axesUnder, CanvasSettings } from "../canvas-settings.tsx";
import { readStored, writeStored } from "../storage.ts";
import { Facts } from "../facts.tsx";
import { CodeWell, Preview, Selection } from "../inspector.tsx";
import { matches } from "../search.ts";
import { SCALES, type ScaleStep } from "../tokens.ts";
import { ArrangeMenu, sortBy, useArrangement } from "../organize.tsx";

/* Sort and group (src/organize.tsx). The default is the palette's own order, neutrals then hues. */
const SORTS = [{ value: "palette", label: "Palette order" }, { value: "name", label: "Name" }, { value: "chroma", label: "Colorfulness" }] as const;
const GROUPS = [{ value: "kind", label: "Neutrals and hues" }, { value: "none", label: "None" }] as const;
type Sort = (typeof SORTS)[number]["value"];
type Group = (typeof GROUPS)[number]["value"];
/** A scale's colourfulness: the OKLCH chroma of its 500 step. */
const chroma = (scale: (typeof SCALES)[number]) => Number((scale.steps.find(step => step.level === 500) ?? scale.steps[0]!).oklch.match(/oklch\(\s*[\d.]+%?\s+([\d.]+)/)?.[1] ?? 0);

const NEUTRALS = new Set(["neutral", "cool", "warm"]);

/* Contrast filter: every step, or the steps that carry body text (AA, 4.5:1) on white or black. */
type Contrast = "all" | "white" | "black";
const CONTRASTS = [{ value: "all", label: "All steps" }, { value: "white", label: "Text on white" }, { value: "black", label: "Text on black" }] as const;
/*
 * What a card's Copy button copies (owner, 2026-10-24: "copy added to color? and you can choose which color style to
 * copy?"): one format for every card, chosen in the Canvas's header, so a click copies what the work needs.
 */
type CopyFormat = "hex" | "rgb" | "oklch" | "variable" | "token";
const COPY_FORMATS = [
  { value: "hex", label: "Copy hex" }, { value: "rgb", label: "Copy RGB" }, { value: "oklch", label: "Copy OKLCH" },
  { value: "variable", label: "Copy var()" }, { value: "token", label: "Copy token" },
] as const;
const COPY_NAMES: Record<CopyFormat, string> = { hex: "hex", rgb: "RGB", oklch: "OKLCH", variable: "CSS variable", token: "token" };
function copyValue(format: CopyFormat, scale: string, item: ScaleStep) {
  const [r, g, b] = rgbOf(item.hex);
  return format === "hex" ? item.hex.toUpperCase() : format === "rgb" ? `rgb(${r} ${g} ${b})` : format === "oklch" ? item.oklch
    : format === "variable" ? `var(--area-${scale}-${item.level})` : `--area-${scale}-${item.level}`;
}
/* A card's text: tinted from its own scale (tintedInk), or the black or white it carries. */
type Ink = "tinted" | "mono";
const INKS = [{ value: "tinted", label: "Tinted text" }, { value: "mono", label: "Black and white text" }] as const;

/*
 * The semantic tokens a step is (tokens.json semantics: a role, and the level it takes in light and
 * dark). Only slots name their levels; tonal surfaces and strokes are derived from a role's scale
 * (packages/tokens/src/emit) and are not listed. Roles reach a scale through ROLE_SCALES (danger
 * is red, gray is warm) and the two settings: Neutral picks the neutral scale, Accent the accent's.
 */
type Semantic = { kind: string; role?: string; light?: number | string; dark?: number | string };
const SEMANTICS = Object.entries(TOKENS.semantics as Record<string, Semantic>);
const defaultPreset = (id: string) => (TOKENS.axes as Array<{ id: string; defaultPreset: string }>).find(axis => axis.id === id)!.defaultPreset;
/** The roles that paint with a scale, each with the setting it needs, if any. */
function rolesOf(scale: string): Array<{ role: string; when?: string }> {
  const roles: Array<{ role: string; when?: string }> = [];
  if (NEUTRALS.has(scale)) roles.push({ role: "neutral", when: scale === defaultPreset("neutral") ? undefined : `Neutral is ${title(scale)}` });
  for (const [role, id] of Object.entries(ROLE_SCALES)) {
    if (id !== scale) continue;
    roles.push(role === "accent" ? { role, when: scale === defaultPreset("accent") ? undefined : `Accent is ${title(scale)}` } : { role });
  }
  return roles;
}
function usedBy(scale: string, level: number) {
  const roles = rolesOf(scale);
  return SEMANTICS.flatMap(([name, entry]) => {
    const found = roles.find(item => item.role === entry.role);
    if (!found) return [];
    const modes = [entry.light === level ? "light" : null, entry.dark === level ? "dark" : null].filter(Boolean);
    return modes.length ? [{ name, modes: modes.join(", "), when: found.when }] : [];
  });
}
const roleLabel = (role: string) => role === "neutral" ? "Neutral" : role[0]!.toUpperCase() + role.slice(1);

/* A step's values, as a colour card and the Inspector show them. */
const rgbOf = (hex: string) => [1, 3, 5].map(at => parseInt(hex.slice(at, at + 2), 16)) as [number, number, number];
/** WCAG 2 relative luminance, and the contrast of two colours. */
const luminance = (hex: string) => {
  const [r, g, b] = rgbOf(hex).map(value => { const c = value / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
};
const ratioOf = (a: string, b: string) => { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
/** WCAG 2 contrast of a colour against white or black. */
const contrastWith = (hex: string, against: "#ffffff" | "#000000") => ratioOf(hex, against);
/**
 * A card's tinted ink (owner, 2026-10-24: "explore making the foreground a tinted color of that same palette"; "more
 * subtle overall, optimize for contrast"; then "add some color back into the text"): of its own scale's steps on the side
 * its black or white text is on, the nearest that keeps 7:1 (AAA), so the ink keeps as much of the scale's colour as that
 * contrast allows (Blue 25 takes Blue 650, Blue 700 takes Blue 100); where none does (mid steps), the one with the most
 * contrast, if it keeps 4.5:1 (Area's text floor, CONTRAST.md). Else (10 steps today) the black or white the step carries.
 */
function tintedInk(ramp: ScaleStep[], step: ScaleStep) {
  const darker = step.contrast.fg !== "#ffffff";
  const side = ramp.filter(other => darker ? other.level > step.level : other.level < step.level);
  const near = (a: ScaleStep, b: ScaleStep) => Math.abs(a.level - step.level) - Math.abs(b.level - step.level);
  const strong = side.filter(other => ratioOf(other.hex, step.hex) >= 7).sort(near)[0];
  if (strong) return strong;
  const best = side.sort((a, b) => ratioOf(b.hex, step.hex) - ratioOf(a.hex, step.hex))[0];
  return best && ratioOf(best.hex, step.hex) >= 4.5 ? best : undefined;
}
const grade = (ratio: number) => ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA Large" : "Fails";
/**
 * "oklch(56.86% 0.2205 259.01)" -> "0.569 0.221 259.0": lightness as a 0 to 1 number and three
 * places for it and chroma, one for hue (owner, 2026-10-14: "oklch 0.306 0.011 28.2"). The card's
 * shorthand; the Inspector and the list keep the token's exact value.
 */
function oklchShort(value: string) {
  const [l = "0", c = "0", h = "0"] = value.replace(/^oklch\(|\)$/g, "").trim().split(/\s+/);
  const lightness = l.endsWith("%") ? parseFloat(l) / 100 : parseFloat(l);
  const number = (part: string, places: number) => (Number.isFinite(parseFloat(part)) ? parseFloat(part) : 0).toFixed(places);
  return `${lightness.toFixed(3)} ${number(c, 3)} ${number(h, 1)}`;
}

/**
 * One step as its own card (owner, 2026-10-12, after brand-guide colour sheets): the card is the
 * colour, edged with Color swatch's ring. Its level heads it; hex, RGB and OKLCH follow two lines
 * below, each named and on one line, all in the one ink that reads on it (owner, 2026-10-23, a
 * sketch: the contrast grade left the card for the Inspector and the label). The card hugs its
 * text and the grid's columns are as wide as the longest line (styles/color.css).
 */
/*
 * The Canvas's steps. In the grid every card is an option of one Asset grid (docs/specs/asset-card.md, list-box.md): one Tab stop, the
 * arrows across the scales, selection following focus so the Inspector shows the keys' step. The list is Tables.
 */
function Sheet({ grid, value, onChoose, children }: { grid: boolean; value: string | null; onChoose: (value: string) => void; children: ReactNode }) {
  return grid
    ? <ListBox layout="grid" aria-label="Color steps" value={value} onValueChange={onChoose} selectionFollowsFocus className="studio-sections">{children}</ListBox>
    : <div className="studio-sections">{children}</div>;
}

function ColorCard({ scale, item, ink, copy }: { scale: string; item: ScaleStep; ink?: ScaleStep; copy: CopyFormat }) {
  const [r, g, b] = rgbOf(item.hex);
  const ratio = ink ? ratioOf(ink.hex, item.hex) : item.contrast.ratio;
  const inkName = ink ? `${title(scale)} ${ink.level}` : item.contrast.fg === "#ffffff" ? "white" : "black";
  return (
    <Tile span="unit" stage="flow" option={`${scale}-${item.level}`}
      aria-label={`${title(scale)} ${item.level}, ${item.hex.toUpperCase()}, ${inkName} text ${ratio.toFixed(2)} to 1, ${grade(ratio)}`}
      // The ink paints its live step, as the card does, so a Neutral tint moves both together.
      paint={{ background: `var(--area-${scale}-${item.level})`, color: ink ? `var(--area-${scale}-${ink.level})` : item.contrast.fg }}
      label={<span className="studio-swatch__level">{item.level}</span>}
      // Copy, in the card's corner on the level's line and in the colour's own ink (Button onColor); it shows while the card
      // is under the pointer, focused or selected, and always where nothing hovers (styles/color.css).
      actions={
        <span className="studio-swatch__copy">
          <Tooltip side="bottom" describes={false} trigger={
            <AreaCopyButton variant="ghost" size="sm" iconOnly onColor label={`Copy ${title(scale)} ${item.level} ${COPY_NAMES[copy]}`}
              icon={<CopyIcon />} copiedIcon={<CheckIcon />} value={() => copyValue(copy, scale, item)} />
          }>
            Copy {COPY_NAMES[copy]}
          </Tooltip>
        </span>
      }>
      <span className="studio-swatch__values">
        <span>HEX {item.hex.toUpperCase()}</span>
        <span>RGB {r} {g} {b}</span>
        <span>OKLCH {oklchShort(item.oklch)}</span>
      </span>
    </Tile>
  );
}
const title = (id: string) => id[0]!.toUpperCase() + id.slice(1);

/**
 * The data colours (color/series.ts, 2026-11-01): each series as a card in its fill with its ink, the mark as a line and
 * the ramp under it. Painted from the live tokens, so Series lightness and light / dark show here.
 */
function SeriesSection() {
  return (
    <CanvasSection id="scale-series" title="Series" count={SERIES.length}>
      <TileGrid span="unit" className="studio-color-grid">
        {SERIES.map(({ name }, i) => {
          const n = i + 1;
          return (
            <Tile key={name} span="unit" stage="flow" label={<span className="studio-swatch__level">{n} {title(name)}</span>}
              aria-label={`Series ${n}, ${name}: --area-series-${n}`}
              paint={{ background: `var(--area-series-${n}-fill)`, color: `var(--area-series-${n}-ink)` }}>
              <span className="studio-swatch__values">
                <span>--area-series-{n}</span>
                <span className="studio-series__mark" style={{ background: `var(--area-series-${n})` }} aria-hidden="true" />
                <span className="studio-series__ramp" aria-hidden="true">
                  {Array.from({ length: RAMP_STEPS }, (_, step) => <i key={step} style={{ background: `var(--area-series-${n}-ramp-${step + 1})` }} />)}
                </span>
              </span>
            </Tile>
          );
        })}
      </TileGrid>
    </CanvasSection>
  );
}

/* "<scale>-<level>", e.g. "blue-500"; the default selection is blue 500. */
function parse(item?: string) {
  const [scale, level] = (item ?? "").split("-");
  const found = SCALES.find(entry => entry.id === scale) ?? SCALES.find(entry => entry.id === "blue")!;
  const step = found.steps.find(entry => String(entry.level) === level) ?? found.steps.find(entry => entry.level === 500) ?? found.steps[0]!;
  return { scale: found, step };
}

export function ColorPage() {
  const { query, item, select, shown: { canvas } } = useStudio();
  // The Sidebar's choice (All, or one scale) and the Inspector's (one step, until the Sidebar's
  // choice changes; with none, the scale or the palette).
  const view = SCALES.find(entry => entry.id === item);
  const [selected, setSelected] = useState<string>();
  useEffect(() => setSelected(undefined), [item]);
  const choose = (next: string) => setSelected(next);
  // The Neutral setting maps the neutral ramp onto Cool or Warm step for step, so a neutral step paints, and is
  // described as, that ramp's step at the same level: its hex, OKLCH and contrast all match the swatch.
  const paints = (scale: string, step: ScaleStep) => scale !== "neutral" || canvas.neutral === "neutral" ? step
    : SCALES.find(entry => entry.id === canvas.neutral)?.steps.find(entry => entry.level === step.level) ?? step;
  const chosen = selected ? parse(selected) : undefined;
  const picked = chosen ? { ...chosen, step: paints(chosen.scale.id, chosen.step) } : undefined;
  const [contrast, setContrast] = useViewOption<Contrast>("color-contrast", "all", ["all", "white", "black"]);
  const [ink, setInk] = useViewOption<Ink>("color-ink", "tinted", ["tinted", "mono"]);
  const [copyFormat, setCopyFormat] = useViewOption<CopyFormat>("color-copy", "hex", ["hex", "rgb", "oklch", "variable", "token"]);
  const passes = (item: ScaleStep) => contrast === "all" || contrastWith(item.hex, contrast === "white" ? "#ffffff" : "#000000") >= 4.5;
  const arrangement = useArrangement<Sort, Group>("color", { sort: "palette", descending: false, group: "kind" }, SORTS, GROUPS);
  const filtered = SCALES.filter(entry => matches(query, entry.id, NEUTRALS.has(entry.id) ? "neutral grey gray" : entry.description));
  const sorted = arrangement.sort === "name" ? sortBy(filtered, entry => entry.id, arrangement.descending)
    : arrangement.sort === "chroma" ? sortBy(filtered, chroma, arrangement.descending)
    : arrangement.descending ? [...filtered].reverse() : filtered;
  const groups: Array<[string, typeof SCALES]> = arrangement.group === "kind"
    ? [["Neutrals", sorted.filter(entry => NEUTRALS.has(entry.id))], ["Hues", sorted.filter(entry => !NEUTRALS.has(entry.id))]]
    : [["Scales", sorted]];
  // The Canvas runs in the Sidebar's order.
  const shown = groups.flatMap(([, list]) => list);
  const onCanvas = (view ? [view] : shown).filter(entry => entry.steps.some(step => passes(paints(entry.id, step))));
  const token = picked ? `--area-${picked.scale.id}-${picked.step.level}` : "";
  const [mode, setMode] = useViewOption<ViewMode>("color", "grid", ["grid", "list"]);


  return (
    <Workspace
      sidebar={<SidebarList>
        <SidebarTree label="Scales" count={shown.length} current={view?.id}
          groups={groups.map(([label, list]) => ({ id: label.toLowerCase(), label,
            items: list.map(entry => ({ id: entry.id, label: title(entry.id), icon: <ColorSwatch size="sm" color={`var(--area-${entry.id}-500)`} aria-hidden="true" /> })) }))} />
      </SidebarList>}
      canvasTitle={view ? title(view.id) : "All scales"}
      canvasActions={
        <ViewControls>
          <ViewFilter label="Contrast" value={contrast} onChange={setContrast} options={CONTRASTS} />
          {mode === "list" ? null : <ViewFilter label="Card text" value={ink} onChange={setInk} options={INKS} />}
          {mode === "list" ? null : <ViewFilter label="Copy format" value={copyFormat} onChange={setCopyFormat} options={COPY_FORMATS} />}
          {view ? null : <ArrangeMenu arrangement={arrangement} sorts={SORTS} groups={GROUPS}
            directions={arrangement.sort === "name" ? ["A to Z", "Z to A"] : arrangement.sort === "chroma" ? ["Greyest first", "Most colorful first"] : ["First to last", "Last to first"]} />}
          <ViewSwitch value={mode} onChange={setMode} />
        </ViewControls>
      }
      // The series sit after the scales, a section's gap apart as the scales are (styles/canvas.css .studio-sections).
      canvas={onCanvas.length ? (<div className="studio-sections">
        <Sheet grid={mode !== "list"} value={picked ? `${picked.scale.id}-${picked.step.level}` : null} onChoose={choose}>
          {onCanvas.map(entry => {
            const isSelected = (level: number) => entry.id === picked?.scale.id && level === picked?.step.level;
            const ramp = entry.steps.map(step => paints(entry.id, step));
            const steps = ramp.filter(passes);
            const pick = (level: number) => choose(`${entry.id}-${level}`);
            return (
              // Each scale draws as it nears the view (tile.tsx WhenVisible): all of them at once held the click 2.5 seconds.
              <WhenVisible key={entry.id} estimate={mode === "list" ? 480 : 360}>
              <CanvasSection role={mode === "list" ? undefined : "group"} id={`scale-${entry.id}`} title={view ? undefined : title(entry.id)} count={steps.length}>
                {mode === "list" ? (
                  // List: one row per step, its token and values.
                    <Table wrapperProps={FEED_TABLE} size="md" interactive aria-label={`${title(entry.id)} steps`}>
                      <thead><tr><th scope="col">Step</th><th scope="col">Token</th><th scope="col">Hex</th><th scope="col">OKLCH</th><th scope="col">Text</th></tr></thead>
                      <tbody>
                        {steps.map(item => (
                          <tr key={item.level} data-selected={isSelected(item.level) ? "" : undefined}>
                            <td>
                              <TableLink href={hrefOf({ page: "color", item: entry.id })} className="studio-step" onClick={event => { event.preventDefault(); pick(item.level); }}>
                                <ColorSwatch size="sm" color={`var(--area-${entry.id}-${item.level})`} aria-hidden="true" />
                                {item.level}
                              </TableLink>
                            </td>
                            <td><Code>--area-{entry.id}-{item.level}</Code></td>
                            <td><Code>{item.hex}</Code></td>
                            <td><Code>{item.oklch}</Code></td>
                            <td><span className="studio-muted">{item.contrast.fg === "#ffffff" ? "White" : "Black"}, {item.contrast.ratio.toFixed(2)}:1 {item.contrast.grade}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                ) : (
                  // Grid: every step its own card, painted in its colour, in every view (owner,
                  // 2026-10-12: colours are their own containers; the joined ramp strip is gone).
                  // Columns one card wide, the card as wide as its longest line, so every value stays on one line (owner, 2026-10-23).
                  <TileGrid span="unit" className="studio-color-grid">
                    {steps.map(item => (
                      <ColorCard key={item.level} scale={entry.id} item={item} ink={ink === "tinted" ? tintedInk(ramp, item) : undefined} copy={copyFormat} />
                    ))}
                  </TileGrid>
                )}
              </CanvasSection>
              </WhenVisible>
            );
          })}
        </Sheet>
        {view || contrast !== "all" ? null : <SeriesSection />}
      </div>) : <EmptyState title="No scales" description={`Nothing matches “${query}”.`} />}
      inspector={{
        // The page edits what it shows (owner's pick, 2026-10-31: "each subject page edits its settings"): every colour
        // setting, Page, Accent and Emphasis, the ramps following as they move; Size for the labels. Themes keeps them all.
        theme: <CanvasSettings axes={[...axesUnder("Page", "Accent", "Emphasis"), "type", "density"]} />,
        design: picked ? <StepDesign step={picked.step} token={token} description={picked.scale.description}
            paintedAs={picked.scale.id === "neutral" && canvas.neutral !== "neutral" ? `${title(canvas.neutral)} ${picked.step.level} (Neutral is ${title(canvas.neutral)})` : undefined} />
          : view ? (
            <PanelSection heading="Scale">
              <Facts label="Scale" items={[
                ["Steps", `${view.steps.length}, ${view.steps[0]!.level} to ${view.steps.at(-1)!.level}`],
                ["Roles", rolesOf(view.id).length ? rolesOf(view.id).map(item => `${roleLabel(item.role)}${item.when ? ` (when ${item.when})` : ""}`).join(", ") : "None by default"],
                view.description ? ["About", view.description] : null,
              ]} />
            </PanelSection>
          ) : (
            <PanelSection heading="Palette">
              <Facts label="Palette" items={[
                ["Scales", SCALES.length],
                ["Neutrals", SCALES.filter(entry => NEUTRALS.has(entry.id)).map(entry => title(entry.id)).join(", ")],
                ["Hues", SCALES.filter(entry => !NEUTRALS.has(entry.id)).length],
                ["Steps", `${SCALES[0]!.steps.length} a scale`],
                ["Defaults", `Neutral: ${title(defaultPreset("neutral"))}, Accent: ${title(defaultPreset("accent"))}`],
              ]} />
            </PanelSection>
          ),
        code: picked ? <StepCode scale={picked.scale.id} step={picked.step} token={token} /> : (
          <PanelSection heading="Tokens">
            <Facts label="Tokens" items={[["Tokens", view ? <Code>--area-{view.id}-*</Code> : <Code>--area-&lt;scale&gt;-&lt;step&gt;</Code>]]} />
          </PanelSection>
        ),
      }}
    />
  );
}

/** The Inspector for one step: the colour, its token and hex to copy, then its facts. */
/** Design, for one step: its colour, its values and its contrast. */
function StepDesign({ step, token, description, paintedAs }: { step: ScaleStep; token: string; description?: string; paintedAs?: string }) {
  return (
    <>
      <Selection preview={<Preview shape="wide" paint={`var(${token})`} label={token} />} />
      <PanelSection heading="Step">
        <Facts label="Step" items={[
          paintedAs ? ["Paints", paintedAs] : null,
          ["Hex", <Code>{step.hex}</Code>],
          ["RGB", <Code>{rgbOf(step.hex).join(" ")}</Code>],
          ["OKLCH", <Code>{step.oklch}</Code>],
          ["Text", step.contrast.fg === "#ffffff" ? "White" : "Black"],
          ["On white", <span className="studio-tabular">{contrastWith(step.hex, "#ffffff").toFixed(2)}:1, {grade(contrastWith(step.hex, "#ffffff"))}</span>],
          ["On black", <span className="studio-tabular">{contrastWith(step.hex, "#000000").toFixed(2)}:1, {grade(contrastWith(step.hex, "#000000"))}</span>],
          description ? ["Scale", description] : null,
        ]} />
      </PanelSection>
    </>
  );
}

/** Code, for one step: what to copy, its token in CSS, and the semantic tokens that use it. */
function StepCode({ scale, step, token }: { scale: string; step: ScaleStep; token: string }) {
  const uses = usedBy(scale, step.level);
  const used: ReactNode = uses.length ? (
    <span className="studio-used-by">
      {uses.map(use => <span key={use.name}><Code>{use.name}</Code> <span className="studio-muted">{use.modes}{use.when ? `, when ${use.when}` : ""}</span></span>)}
    </span>
  ) : <span className="studio-muted">No semantic token</span>;
  return (
    <>
      <Selection>
        <CopyButton label="Copy token" icon={<CopyIcon />} fullWidth value={() => `var(${token})`} />
        <CopyButton label="Copy hex" icon={<CopyIcon />} fullWidth value={() => step.hex} />
      </Selection>
      <PanelSection heading="CSS"><CodeWell code={`background-color: var(${token});`} /></PanelSection>
      <PanelSection heading="Token">
        <Facts label="Token" items={[
          ["Token", <Code>{token}</Code>],
          ["Used by", used],
        ]} />
      </PanelSection>
    </>
  );
}
