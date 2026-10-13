/**
 * Color: the scales in the Sidebar; on the Canvas every scale as a ramp strip (All) or its steps as
 * painted tiles (one scale), or either as a list; the selected step in the Inspector (token, hex,
 * OKLCH, its contrast with the text it carries).
 * Swatches paint the live custom property, so a neutral tint or theme change shows on the ramp.
 */
import { useEffect, useState } from "react";
import { Code, ColorSwatch, EmptyState, Nav, NavGroup, NavItem, PanelSection, PreviewFrame, Table, TableLink } from "@area/react";
import { CopyIcon } from "@area/icons";
import { CopyButton } from "../../../docs/src/gallery/icon-browser.tsx";
import { SidebarAll, SidebarList, useStudio, Workspace } from "../studio.tsx";
import { CanvasSection, Tile, TileGrid } from "../tile.tsx";
import { useViewOption, ViewControls, ViewSwitch, type ViewMode } from "../view-controls.tsx";
import { CanvasSettings } from "../canvas-settings.tsx";
import { readStored, writeStored } from "../storage.ts";
import { Facts } from "../facts.tsx";
import { matches } from "../search.ts";
import { SCALES, type ScaleStep } from "../tokens.ts";
import { ArrangeMenu, sortBy, useArrangement } from "../organize.tsx";
import { onGridKeys } from "../grid-keys.ts";

/* Sort and group (src/organize.tsx). The default is the palette's own order, neutrals then hues. */
const SORTS = [{ value: "palette", label: "Palette order" }, { value: "name", label: "Name" }, { value: "chroma", label: "Colourfulness" }] as const;
const GROUPS = [{ value: "kind", label: "Neutrals and hues" }, { value: "none", label: "None" }] as const;
type Sort = (typeof SORTS)[number]["value"];
type Group = (typeof GROUPS)[number]["value"];
/** A scale's colourfulness: the OKLCH chroma of its 500 step. */
const chroma = (scale: (typeof SCALES)[number]) => Number((scale.steps.find(step => step.level === 500) ?? scale.steps[0]!).oklch.match(/oklch\(\s*[\d.]+%?\s+([\d.]+)/)?.[1] ?? 0);

const NEUTRALS = new Set(["neutral", "cool", "warm"]);

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
/** "oklch(56.86% 0.2205 259.01)" -> "56.86% 0.2205 259.01": the values without the function. */
const oklchValues = (value: string) => value.replace(/^oklch\(|\)$/g, "");

/**
 * One step as its own card (owner, 2026-10-12, after brand-guide colour sheets): the card is the
 * colour, edged with the swatch picker's 10% hairline. Its level and the contrast of the text it
 * carries head it; hex, RGB and OKLCH sit at its foot, in the ink that reads on it.
 */
function ColorCard({ scale, item, selected, onSelect }: { scale: string; item: ScaleStep; selected: boolean; onSelect: () => void }) {
  const ink = item.contrast.fg;
  const [r, g, b] = rgbOf(item.hex);
  return (
    <Tile span="wide" stage="flow" pressable selected={selected} onSelect={onSelect}
      aria-label={`${title(scale)} ${item.level}, ${item.hex.toUpperCase()}, ${ink === "#ffffff" ? "white" : "black"} text ${item.contrast.ratio.toFixed(2)} to 1, ${item.contrast.grade}`}
      paint={{ background: `var(--area-${scale}-${item.level})`, color: ink }}
      label={<span className="studio-swatch__level">{item.level}</span>}
      value={<span className="studio-swatch__badge">{item.contrast.grade} · {item.contrast.ratio.toFixed(2)}</span>}>
      <span className="studio-swatch__values">
        <span>{item.hex.toUpperCase()}</span>
        <span><span className="studio-swatch__key">RGB</span> {r} {g} {b}</span>
        <span><span className="studio-swatch__key">OKLCH</span> {oklchValues(item.oklch)}</span>
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
  const { query, item, select } = useStudio();
  // The Sidebar's choice (All, or one scale) and the Inspector's (one step, kept across launches).
  const view = SCALES.find(entry => entry.id === item);
  const [selected, setSelected] = useState(() => readStored("colorStep", "blue-500"));
  const choose = (next: string) => { setSelected(next); writeStored("colorStep", next); };
  const { scale, step } = parse(selected);
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
  const onCanvas = view ? [view] : shown;
  const token = `--area-${scale.id}-${step.level}`;
  const [mode, setMode] = useViewOption<ViewMode>("color", "grid", ["grid", "list"]);

  // The value the swatch paints now (the neutral axis tints neutral steps).
  const [live, setLive] = useState("");
  useEffect(() => { setLive(getComputedStyle(document.documentElement).getPropertyValue(token).trim()); }, [token]);

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
                  onClick={event => { event.preventDefault(); select(entry.id); choose(`${entry.id}-${step.level}`); }}>
                  {title(entry.id)}
                </NavItem>
              ))}
            </NavGroup>
          ))}
        </Nav>
      }</SidebarList>}
      canvasTitle={view ? title(view.id) : "All scales"}
      canvasMeta={<span className="studio-muted studio-tabular">{view ? view.steps.length : shown.length}</span>}
      canvasActions={
        <ViewControls>
          {view ? null : <ArrangeMenu arrangement={arrangement} sorts={SORTS} groups={GROUPS}
            directions={arrangement.sort === "name" ? ["A to Z", "Z to A"] : arrangement.sort === "chroma" ? ["Greyest first", "Most colourful first"] : ["First to last", "Last to first"]} />}
          <ViewSwitch value={mode} onChange={setMode} />
        </ViewControls>
      }
      canvas={onCanvas.length ? (
        <div className="studio-sections" onKeyDown={onGridKeys}>
          {onCanvas.map(entry => {
            const isSelected = (level: number) => entry.id === scale.id && level === step.level;
            const pick = (level: number) => choose(`${entry.id}-${level}`);
            return (
              <CanvasSection key={entry.id} id={`scale-${entry.id}`} title={view ? undefined : title(entry.id)}>
                {mode === "list" ? (
                  // List: one row per step, its token and values.
                    <Table size="md" interactive flush aria-label={`${title(entry.id)} steps`}>
                      <thead><tr><th scope="col">Step</th><th scope="col">Token</th><th scope="col">Hex</th><th scope="col">OKLCH</th><th scope="col">Text</th></tr></thead>
                      <tbody>
                        {entry.steps.map(item => (
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
                  <TileGrid span="wide">
                    {entry.steps.map(item => (
                      <ColorCard key={item.level} scale={entry.id} item={item} selected={isSelected(item.level)} onSelect={() => pick(item.level)} />
                    ))}
                  </TileGrid>
                )}
              </CanvasSection>
            );
          })}
        </div>
      ) : <EmptyState title="No scales" description={`Nothing matches “${query}”.`} />}
      inspectorTitle={`${title(scale.id)} ${step.level}`}
      inspector={
        <>
          <CanvasSettings axes={["ui"]} />
          <PanelSection>
            <PreviewFrame className="studio-inspector-preview" aspect="wide" color={`var(${token})`} label={token} />
            <CopyButton label="Copy token" icon={<CopyIcon />} fullWidth copy={() => navigator.clipboard.writeText(`var(${token})`)} />
          </PanelSection>
          <PanelSection heading="Step">
            <Facts label="Step" items={[
              ["Token", <Code>{token}</Code>],
              ["Hex", <Code>{live || step.hex}</Code>],
              ["RGB", <Code>{rgbOf(step.hex).join(" ")}</Code>],
              ["OKLCH", <Code>{step.oklch}</Code>],
              ["Text", step.contrast.fg === "#ffffff" ? "White" : "Black"],
              ["On white", <span className="studio-tabular">{contrastWith(step.hex, "#ffffff").toFixed(2)}:1 · {grade(contrastWith(step.hex, "#ffffff"))}</span>],
              ["On black", <span className="studio-tabular">{contrastWith(step.hex, "#000000").toFixed(2)}:1 · {grade(contrastWith(step.hex, "#000000"))}</span>],
            ]} />
          </PanelSection>
          {scale.description ? (
            <PanelSection heading="Scale">
              <p className="studio-inspector-note">{scale.description}</p>
            </PanelSection>
          ) : null}
        </>
      }
    />
  );
}
