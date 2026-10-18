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
import { Badge, Code, ColorSwatch, EmptyState, ListBox, Nav, NavGroup, NavItem, PanelSection, Table, TableLink } from "@area/react";
import { CopyIcon } from "@area/icons";
import { CopyButton } from "../copy.tsx";
import { SidebarAll, SidebarList, useStudio, Workspace } from "../studio.tsx";
import { CanvasSection, Tile, TileGrid } from "../tile.tsx";
import { useViewOption, ViewControls, ViewFilter, ViewSwitch, type ViewMode } from "../view-controls.tsx";
import { CanvasSettings } from "../canvas-settings.tsx";
import { readStored, writeStored } from "../storage.ts";
import { Facts } from "../facts.tsx";
import { Preview, Selection } from "../inspector.tsx";
import { matches } from "../search.ts";
import { SCALES, type ScaleStep } from "../tokens.ts";
import { ArrangeMenu, sortBy, useArrangement } from "../organize.tsx";

/* Sort and group (src/organize.tsx). The default is the palette's own order, neutrals then hues. */
const SORTS = [{ value: "palette", label: "Palette order" }, { value: "name", label: "Name" }, { value: "chroma", label: "Colourfulness" }] as const;
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
/** WCAG 2 contrast of a colour against white or black. */
function contrastWith(hex: string, against: "#ffffff" | "#000000") {
  const lum = (rgb: number[]) => {
    const [r, g, b] = rgb.map(value => { const c = value / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
  };
  const a = lum(rgbOf(hex)), b = against === "#ffffff" ? 1 : 0;
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
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
 * colour, edged with the swatch picker's 10% hairline. Its level and the contrast of the text it
 * carries head it; hex, RGB and OKLCH follow a line below, all in the one ink that reads on it.
 * A unit tile that hugs its text (owner, 2026-10-14), so a long value wraps rather than clips.
 */
/*
 * The Canvas's steps. In the grid every card is an option of one ListBox (docs/specs/list-box.md): one Tab stop, the
 * arrows across the scales, selection following focus so the Inspector shows the keys' step. The list is Tables.
 */
function Sheet({ grid, value, onChoose, children }: { grid: boolean; value: string | null; onChoose: (value: string) => void; children: ReactNode }) {
  return grid
    ? <ListBox layout="grid" aria-label="Colour steps" value={value} onValueChange={onChoose} selectionFollowsFocus className="studio-sections">{children}</ListBox>
    : <div className="studio-sections">{children}</div>;
}

function ColorCard({ scale, item }: { scale: string; item: ScaleStep }) {
  const ink = item.contrast.fg;
  const [r, g, b] = rgbOf(item.hex);
  return (
    <Tile span="unit" stage="flow" option={`${scale}-${item.level}`}
      aria-label={`${title(scale)} ${item.level}, ${item.hex.toUpperCase()}, ${ink === "#ffffff" ? "white" : "black"} text ${item.contrast.ratio.toFixed(2)} to 1, ${item.contrast.grade}`}
      paint={{ background: `var(--area-${scale}-${item.level})`, color: ink }}
      label={<span className="studio-swatch__level">{item.level}</span>}
      // The contrast grade on the step's own colour: Badge onColor (docs/specs/badge.md, 2026-10-16), its ink and a line of
      // it with no plate, so the text has the contrast it prints (4.61:1 or more); a 12% ink wash left 34 steps under 4.5:1.
      value={<Badge size="sm" onColor>{item.contrast.grade} · {item.contrast.ratio.toFixed(2)}</Badge>}>
      <span className="studio-swatch__values">
        <span>{item.hex.toUpperCase()}</span>
        <span>RGB {r} {g} {b}</span>
        <span>OKLCH {oklchShort(item.oklch)}</span>
      </span>
    </Tile>
  );
}
const title = (id: string) => id[0]!.toUpperCase() + id.slice(1);

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
      sidebar={<SidebarList>{
        <Nav aria-label="Scales">
          <SidebarAll tab="color" count={shown.length} current={!view} />
          {groups.filter(([, list]) => list.length).map(([label, list]) => (
            <NavGroup key={label} label={label}>
              {list.map(entry => (
                <NavItem key={entry.id} href={`#color/${entry.id}`} current={entry.id === view?.id}
                  icon={<ColorSwatch size="sm" color={`var(--area-${entry.id}-500)`} aria-hidden="true" />}
                  onClick={event => { event.preventDefault(); select(entry.id); }}>
                  {title(entry.id)}
                </NavItem>
              ))}
            </NavGroup>
          ))}
        </Nav>
      }</SidebarList>}
      canvasTitle={view ? title(view.id) : "All scales"}
      canvasActions={
        <ViewControls>
          <ViewFilter label="Contrast" value={contrast} onChange={setContrast} options={CONTRASTS} />
          {view ? null : <ArrangeMenu arrangement={arrangement} sorts={SORTS} groups={GROUPS}
            directions={arrangement.sort === "name" ? ["A to Z", "Z to A"] : arrangement.sort === "chroma" ? ["Greyest first", "Most colourful first"] : ["First to last", "Last to first"]} />}
          <ViewSwitch value={mode} onChange={setMode} />
        </ViewControls>
      }
      canvas={onCanvas.length ? (
        <Sheet grid={mode !== "list"} value={picked ? `${picked.scale.id}-${picked.step.level}` : null} onChoose={choose}>
          {onCanvas.map(entry => {
            const isSelected = (level: number) => entry.id === picked?.scale.id && level === picked?.step.level;
            const steps = entry.steps.map(step => paints(entry.id, step)).filter(passes);
            const pick = (level: number) => choose(`${entry.id}-${level}`);
            return (
              <CanvasSection key={entry.id} role={mode === "list" ? undefined : "group"} id={`scale-${entry.id}`} title={view ? undefined : title(entry.id)}>
                {mode === "list" ? (
                  // List: one row per step, its token and values.
                    <Table size="md" interactive flush aria-label={`${title(entry.id)} steps`}>
                      <thead><tr><th scope="col">Step</th><th scope="col">Token</th><th scope="col">Hex</th><th scope="col">OKLCH</th><th scope="col">Text</th></tr></thead>
                      <tbody>
                        {steps.map(item => (
                          <tr key={item.level} data-selected={isSelected(item.level) ? "" : undefined}>
                            <td>
                              <TableLink href={`#color/${entry.id}`} className="studio-step" onClick={event => { event.preventDefault(); pick(item.level); }}>
                                <ColorSwatch size="sm" color={`var(--area-${entry.id}-${item.level})`} aria-hidden="true" />
                                {item.level}
                              </TableLink>
                            </td>
                            <td><Code>--area-{entry.id}-{item.level}</Code></td>
                            <td><Code>{item.hex}</Code></td>
                            <td><Code>{item.oklch}</Code></td>
                            <td><span className="studio-muted">{item.contrast.fg === "#ffffff" ? "White" : "Black"} · {item.contrast.ratio.toFixed(2)}:1 {item.contrast.grade}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                ) : (
                  // Grid: every step its own card, painted in its colour, in every view (owner,
                  // 2026-10-12: colours are their own containers; the joined ramp strip is gone).
                  // On the components' grid (owner, 2026-10-12): wide tiles, 280 at the least, 5:4.
                  <TileGrid span="unit" hug>
                    {steps.map(item => (
                      <ColorCard key={item.level} scale={entry.id} item={item} />
                    ))}
                  </TileGrid>
                )}
              </CanvasSection>
            );
          })}
        </Sheet>
      ) : <EmptyState title="No scales" description={`Nothing matches “${query}”.`} />}
      inspector={
        <>
          {/* Neutral tints the neutral ramp (PRODUCT_UI rule 14: the settings that change this tab's specimens). */}
          <CanvasSettings axes={["neutral", "type", "density"]} />
          {picked ? <StepInspector scale={picked.scale.id} step={picked.step} token={token} description={picked.scale.description}
              paintedAs={picked.scale.id === "neutral" && canvas.neutral !== "neutral" ? `${title(canvas.neutral)} ${picked.step.level} (Neutral is ${title(canvas.neutral)})` : undefined} />
            : view ? (
              <PanelSection heading="Scale">
                <Facts label="Scale" items={[
                  ["Tokens", <Code>--area-{view.id}-*</Code>],
                  ["Steps", `${view.steps.length}, ${view.steps[0]!.level} to ${view.steps.at(-1)!.level}`],
                  ["Roles", rolesOf(view.id).length ? rolesOf(view.id).map(item => `${roleLabel(item.role)}${item.when ? ` (when ${item.when})` : ""}`).join(", ") : "None by default"],
                  view.description ? ["About", view.description] : null,
                ]} />
              </PanelSection>
            ) : (
              <PanelSection heading="Palette">
                <Facts label="Palette" items={[
                  ["Tokens", <Code>--area-&lt;scale&gt;-&lt;step&gt;</Code>],
                  ["Scales", SCALES.length],
                  ["Neutrals", SCALES.filter(entry => NEUTRALS.has(entry.id)).map(entry => title(entry.id)).join(", ")],
                  ["Hues", SCALES.filter(entry => !NEUTRALS.has(entry.id)).length],
                  ["Steps", `${SCALES[0]!.steps.length} a scale`],
                  ["Defaults", `Neutral: ${title(defaultPreset("neutral"))} · Accent: ${title(defaultPreset("accent"))}`],
                ]} />
              </PanelSection>
            )}
        </>
      }
    />
  );
}

/** The Inspector for one step: the colour, its token and hex to copy, then its facts. */
function StepInspector({ scale, step, token, description, paintedAs }: { scale: string; step: ScaleStep; token: string; description?: string; paintedAs?: string }) {
  const uses = usedBy(scale, step.level);
  const used: ReactNode = uses.length ? (
    <span className="studio-used-by">
      {uses.map(use => <span key={use.name}><Code>{use.name}</Code> <span className="studio-muted">{use.modes}{use.when ? ` · when ${use.when}` : ""}</span></span>)}
    </span>
  ) : <span className="studio-muted">No semantic token</span>;
  return (
    <>
      <Selection preview={<Preview shape="wide" paint={`var(${token})`} label={token} />}>
        <CopyButton label="Copy token" icon={<CopyIcon />} fullWidth value={() => `var(${token})`} />
        <CopyButton label="Copy hex" icon={<CopyIcon />} fullWidth value={() => step.hex} />
      </Selection>
      <PanelSection heading="Step">
        <Facts label="Step" items={[
          ["Token", <Code>{token}</Code>],
          paintedAs ? ["Paints", paintedAs] : null,
          ["Hex", <Code>{step.hex}</Code>],
          ["RGB", <Code>{rgbOf(step.hex).join(" ")}</Code>],
          ["OKLCH", <Code>{step.oklch}</Code>],
          ["Text", step.contrast.fg === "#ffffff" ? "White" : "Black"],
          ["On white", <span className="studio-tabular">{contrastWith(step.hex, "#ffffff").toFixed(2)}:1 · {grade(contrastWith(step.hex, "#ffffff"))}</span>],
          ["On black", <span className="studio-tabular">{contrastWith(step.hex, "#000000").toFixed(2)}:1 · {grade(contrastWith(step.hex, "#000000"))}</span>],
          ["Used by", used],
          description ? ["Scale", description] : null,
        ]} />
      </PanelSection>
    </>
  );
}
