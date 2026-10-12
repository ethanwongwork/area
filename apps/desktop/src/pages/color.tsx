/**
 * Color: the scales in the Sidebar; on the Canvas every scale as a ramp strip (All) or its steps as
 * painted tiles (one scale), or either as a list; the selected step in the Inspector (token, hex,
 * OKLCH, its contrast with the text it carries).
 * Swatches paint the live custom property, so a neutral tint or theme change shows on the ramp.
 */
import { useEffect, useState, type CSSProperties } from "react";
import { EmptyState, Nav, NavGroup, NavItem, PanelSection, Table, TableLink } from "@area/react";
import { PilotCopyIcon } from "../../../docs/src/pilot-icons.tsx";
import { CopyButton } from "../../../docs/src/gallery/icon-browser.tsx";
import { SidebarAll, SidebarList, useStudio, Workspace } from "../studio.tsx";
import { CanvasSection, ListFrame, Tile, TileGrid } from "../tile.tsx";
import { useViewOption, ViewControls, ViewFilter, ViewSwitch, type ViewMode } from "../view-controls.tsx";
import { CanvasSettings } from "../canvas-settings.tsx";
import { readStored, writeStored } from "../storage.ts";
import { Facts } from "../facts.tsx";
import { matches } from "../search.ts";
import { SCALES, type ScaleStep } from "../tokens.ts";

const NEUTRALS = new Set(["neutral", "cool", "warm"]);
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
  const shown = SCALES.filter(entry => matches(query, entry.id, NEUTRALS.has(entry.id) ? "neutral grey gray" : entry.description));
  const onCanvas = view ? [view] : shown;
  const token = `--area-${scale.id}-${step.level}`;
  const [mode, setMode] = useViewOption<ViewMode>("color", "grid", ["grid", "list"]);
  const [format, setFormat] = useViewOption<"hex" | "oklch">("color-value", "hex", ["hex", "oklch"]);
  const valueOf = (item: ScaleStep) => format === "hex" ? item.hex.toUpperCase() : item.oklch.replace(/^oklch\((.*)\)$/, "$1");

  // The value the swatch paints now (the neutral axis tints neutral steps).
  const [live, setLive] = useState("");
  useEffect(() => { setLive(getComputedStyle(document.documentElement).getPropertyValue(token).trim()); }, [token]);

  const groups: Array<[string, typeof SCALES]> = [["Neutrals", shown.filter(entry => NEUTRALS.has(entry.id))], ["Hues", shown.filter(entry => !NEUTRALS.has(entry.id))]];
  return (
    <Workspace
      sidebar={<SidebarList>{
        <Nav aria-label="Scales">
          <SidebarAll tab="color" count={shown.length} current={!view} />
          {groups.filter(([, list]) => list.length).map(([label, list]) => (
            <NavGroup key={label} label={label}>
              {list.map(entry => (
                <NavItem key={entry.id} href={`#color/${entry.id}`} current={entry.id === view?.id}
                  icon={<span className="studio-color-dot" style={{ background: `var(--area-${entry.id}-500)` }} />}
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
          <ViewFilter label="Value" value={format} onChange={setFormat} options={[{ value: "hex", label: "Hex" }, { value: "oklch", label: "OKLCH" }]} />
          <ViewSwitch value={mode} onChange={setMode} />
        </ViewControls>
      }
      canvas={onCanvas.length ? (
        <div className="studio-sections">
          {onCanvas.map(entry => {
            const isSelected = (level: number) => entry.id === scale.id && level === step.level;
            const pick = (level: number) => choose(`${entry.id}-${level}`);
            const paint = (level: number, fg: string) => ({ background: `var(--area-${entry.id}-${level})`, color: fg });
            return (
              <CanvasSection key={entry.id} id={`scale-${entry.id}`} title={view ? undefined : title(entry.id)}>
                {mode === "list" ? (
                  // List: one row per step, its token and values.
                  <ListFrame>
                    <Table size="md" interactive aria-label={`${title(entry.id)} steps`}>
                      <thead><tr><th scope="col">Step</th><th scope="col">Token</th><th scope="col">Hex</th><th scope="col">OKLCH</th><th scope="col">Text</th></tr></thead>
                      <tbody>
                        {entry.steps.map(item => (
                          <tr key={item.level} data-selected={isSelected(item.level) ? "" : undefined}>
                            <td>
                              <TableLink href={`#color/${entry.id}`} className="studio-step" onClick={event => { event.preventDefault(); pick(item.level); }}>
                                <span className="studio-step__chip" style={{ background: `var(--area-${entry.id}-${item.level})` }} aria-hidden="true" />
                                {item.level}
                              </TableLink>
                            </td>
                            <td><code className="studio-mono">--area-{entry.id}-{item.level}</code></td>
                            <td><code className="studio-mono">{item.hex}</code></td>
                            <td><code className="studio-mono">{item.oklch}</code></td>
                            <td><span className="studio-muted">{item.contrast.fg === "#ffffff" ? "White" : "Black"} · {item.contrast.ratio.toFixed(2)}:1 {item.contrast.grade}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </ListFrame>
                ) : view ? (
                  // One scale, grid: every step a unit tile painted in its colour.
                  <TileGrid span="unit">
                    {entry.steps.map(item => (
                      <Tile key={item.level} span="unit" stage="none" pressable label={item.level} value={valueOf(item)}
                        aria-label={`${title(entry.id)} ${item.level}, ${item.hex}`} paint={paint(item.level, item.contrast.fg)}
                        selected={isSelected(item.level)} onSelect={() => pick(item.level)} />
                    ))}
                  </TileGrid>
                ) : (
                  // All, grid: the scale's ramp is the container, its steps joined.
                  <div className="studio-ramp" role="group" aria-label={`${title(entry.id)} steps`}>
                    {entry.steps.map(item => (
                      <button key={item.level} type="button" className="studio-ramp__step" aria-pressed={isSelected(item.level)}
                        aria-label={`${title(entry.id)} ${item.level}`} title={`--area-${entry.id}-${item.level} · ${valueOf(item)}`}
                        style={{ "--_paint": `var(--area-${entry.id}-${item.level})`, "--_ink": item.contrast.fg } as CSSProperties}
                        onClick={() => pick(item.level)}>
                        <span className="studio-ramp__level">{item.level}</span>
                      </button>
                    ))}
                  </div>
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
            <div className="studio-color-preview" style={{ background: `var(${token})` }} />
            <CopyButton label="Copy token" icon={<PilotCopyIcon />} fullWidth copy={() => navigator.clipboard.writeText(`var(${token})`)} />
          </PanelSection>
          <PanelSection heading="Step">
            <Facts label="Step" items={[
              ["Token", <code className="studio-mono">{token}</code>],
              ["Hex", <code className="studio-mono">{live || step.hex}</code>],
              ["OKLCH", <code className="studio-mono">{step.oklch}</code>],
              ["Text", <>{step.contrast.fg === "#ffffff" ? "White" : "Black"} · {step.contrast.ratio.toFixed(2)}:1 {step.contrast.grade}</>],
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
