/**
 * Typography: the ramp as a table, after Vercel's Geist (owner, 2026-10-11): Headings and Copy, each
 * at the regular and the strong weight as separate ramps, each row's example its own name set in
 * its own style ("Heading 72", "Copy 14 Strong"), then its token, weight and what it is for; or as
 * a grid of "Aa" tiles. Choosing a role in the Sidebar shows it at each
 * weight and density, in a sample line the Inspector edits.
 *
 * The usage notes come from where Area uses each role (packages/styles) and the ramp's own notes
 * (packages/tokens/src/axes/typography.ts).
 */
import { useState } from "react";
import { Button, Field, Nav, NavGroup, NavItem, PanelSection, Segmented, Table, TableLink, Textarea } from "@area/react";
import { PilotCheckIcon, PilotCopyIcon } from "../../../docs/src/pilot-icons.tsx";
import { CanvasSettings } from "../canvas-settings.tsx";
import { SidebarAll, SidebarList, useStudio, Workspace } from "../studio.tsx";
import { CanvasSection, ListFrame, Tile, TileGrid } from "../tile.tsx";
import { useViewOption, ViewControls, ViewFilter, ViewSwitch, type ViewMode } from "../view-controls.tsx";
import { Facts } from "../facts.tsx";
import { matches } from "../search.ts";
import { TYPE_ROLES, type TypeRole } from "../tokens.ts";
import { readStored, writeStored } from "../storage.ts";

const SAMPLE = "Every component, icon and colour in one place.";

const GROUPS = [
  { id: "headings", label: "Headings", lede: "Introduce pages, sections and surfaces. Headings hold their size in compact density.", groups: ["display", "title"] },
  { id: "copy", label: "Copy", lede: "Body text and interface text. Copy steps down a size in compact density.", groups: ["text"] },
] as const;

const USAGE: Record<string, string> = {
  "display-lg": "Hero type, for marketing heroes and empty canvases.",
  "display-sm": "Hero type a step down, for landing sections.",
  "title-lg": "Page titles and large figures, like a Card's value.",
  "title-md": "Section titles in documents and settings.",
  "title-sm": "Sub-section titles and dialog headlines.",
  "title-xs": "Surface titles: Card, Dialog, Drawer.",
  "text-md": "Body text: messages, the composer, accordion content.",
  "text-sm": "The interface size: controls, rows, panels, code.",
  "text-xs": "Captions: hints, counts, keys, field descriptions.",
};

/* The two weights as separate ramps (owner, 2026-10-11), their values from the UI scale (400, 500). */
const WEIGHTS = [
  { id: "regular", suffix: "", value: 400 },
  { id: "strong", suffix: " Strong", value: 500 },
] as const;

const roleStyle = (role: TypeRole, weight: "regular" | "strong") => ({
  fontSize: `var(--area-${role.id}-size)`,
  lineHeight: `var(--area-${role.id}-leading)`,
  letterSpacing: `var(--area-${role.id}-tracking)`,
  fontWeight: `var(--area-weight-${weight})`,
});

const metrics = (role: TypeRole, density: "default" | "compact") => {
  const { size, leading, tracking } = role.metrics[density];
  return `${size} / ${leading}${tracking && tracking !== "0em" ? ` · ${tracking}` : ""}`;
};

/** Copies a token, its check standing in for the copy glyph a moment after. */
function CopyToken({ token }: { token: string }) {
  const [done, setDone] = useState(false);
  return (
    <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={done ? <PilotCheckIcon /> : <PilotCopyIcon />}
      aria-label={`Copy ${token}`} title="Copy"
      onClick={async () => { try { await navigator.clipboard.writeText(`var(${token})`); setDone(true); setTimeout(() => setDone(false), 1600); } catch {} }} />
  );
}

export function TypographyPage() {
  const { query, item, select, canvas } = useStudio();
  const [sample, setSample] = useState(() => readStored("typeSample", SAMPLE));
  const [weight, setWeight] = useState<"regular" | "strong">("regular");
  // The Sidebar's choice (All, or one role) and the Inspector's (the row chosen on the Canvas;
  // with one role on the Canvas, that role).
  const view = TYPE_ROLES.find(entry => entry.id === item);
  const [selected, setSelected] = useState("text-sm");
  const role = view ?? TYPE_ROLES.find(entry => entry.id === selected) ?? TYPE_ROLES[0]!;
  const shown = TYPE_ROLES.filter(entry => matches(query, entry.name, entry.id, USAGE[entry.id]));
  const density = canvas.ui === "compact" ? "compact" : "default";
  const [mode, setMode] = useViewOption<ViewMode>("typography", "list", ["grid", "list"]);
  const [weights, setWeights] = useViewOption<"all" | "regular" | "strong">("typography-weight", "all", ["all", "regular", "strong"]);
  const changeSample = (value: string) => { setSample(value); writeStored("typeSample", value); };

  return (
    <Workspace
      sidebar={<SidebarList>{shown.length ? (
        <Nav aria-label="Type roles">
          <SidebarAll tab="typography" count={shown.length} current={!view} />
          {GROUPS.map(group => {
            const list = shown.filter(entry => (group.groups as readonly string[]).includes(entry.group));
            return list.length ? (
              <NavGroup key={group.id} label={group.label}>
                {list.map(entry => (
                  <NavItem key={entry.id} href={`#typography/${entry.id}`} current={entry.id === view?.id}
                    onClick={event => { event.preventDefault(); select(entry.id); }}>
                    {entry.name}
                  </NavItem>
                ))}
              </NavGroup>
            ) : null;
          })}
        </Nav>
      ) : <p className="studio-empty-note">No type roles match “{query}”.</p>}</SidebarList>}
      canvasActions={
        <ViewControls>
          <ViewFilter label="Weight" value={weights} onChange={setWeights}
            options={[{ value: "all", label: "All weights" }, { value: "regular", label: "Regular" }, { value: "strong", label: "Strong" }]} />
          {view ? null : <ViewSwitch value={mode} onChange={setMode} />}
        </ViewControls>
      }
      canvasTitle={view ? view.name : "All roles"}
      canvasMeta={<span className="studio-muted studio-tabular">{view ? metrics(view, density) : shown.length}</span>}
      canvas={view ? (
        // One role: at the Canvas's density in each weight, then at each density, in the sample line.
        <TileGrid span="row">
          {([
            ["regular", undefined, "Regular"],
            ["strong", undefined, "Strong"],
            [weight, "default", "Default density"],
            [weight, "compact", "Compact density"],
          ] as const).filter(([w, ui]) => ui || weights === "all" || weights === w).map(([w, ui, label]) => (
            <Tile key={label} span="row" stage="flow" label={label}
              value={metrics(view, ui ?? density)} stageScope={ui ? { "data-area-ui": ui } : undefined}>
              <span className="studio-type__sample" style={roleStyle(view, w)}>{sample || SAMPLE}</span>
            </Tile>
          ))}
        </TileGrid>
      ) : (
        <div className="studio-sections">
          {GROUPS.flatMap(group => WEIGHTS.filter(w => weights === "all" || weights === w.id).map(w => {
            const list = shown.filter(entry => (group.groups as readonly string[]).includes(entry.group));
            if (!list.length) return null;
            const styleName = (entry: TypeRole) => `${entry.name}${w.suffix}`;
            return (
              <CanvasSection key={`${group.id}-${w.id}`} id={`type-${group.id}-${w.id}`} title={`${group.label}${w.suffix}`}
                lede={w.id === "regular" ? group.lede : `The same ramp at the strong weight (${w.value}), for emphasis and titles that need it.`}>
                {mode === "grid" ? (
                  // Grid: every style a wide tile, its name and values over an "Aa" set in the style.
                  <TileGrid span="wide">
                    {list.map(entry => (
                      <Tile key={entry.id} span="wide" stage="center" pressable label={styleName(entry)} value={metrics(entry, density)}
                        selected={entry.id === role.id} onSelect={() => setSelected(entry.id)}>
                        <span style={roleStyle(entry, w.id)}>Aa</span>
                      </Tile>
                    ))}
                  </TileGrid>
                ) : (
                  // List: Geist's table, each example its own name set in its own style.
                  <ListFrame>
                    <Table size="lg" interactive aria-label={`${group.label}${w.suffix}`}>
                      {/* One set of column widths for every table, so the columns line up down the Canvas. */}
                      <colgroup><col style={{ inlineSize: "46%" }} /><col style={{ inlineSize: "20%" }} /><col style={{ inlineSize: "10%" }} /><col /></colgroup>
                      <thead>
                        <tr><th scope="col">Example</th><th scope="col">Token</th><th scope="col">Weight</th><th scope="col">Usage</th></tr>
                      </thead>
                      <tbody>
                        {list.map(entry => (
                          <tr key={entry.id} data-selected={entry.id === role.id ? "" : undefined}>
                            <td>
                              <TableLink href={`#typography/${entry.id}`} className="studio-type__example" style={roleStyle(entry, w.id)}
                                onClick={event => { event.preventDefault(); setSelected(entry.id); }}>
                                {styleName(entry)}
                              </TableLink>
                            </td>
                            <td><span className="studio-type__token"><code className="studio-mono">--area-{entry.id}</code><CopyToken token={`--area-${entry.id}-size`} /></span></td>
                            <td><span className="studio-tabular">{w.value}</span></td>
                            <td><span className="studio-muted">{USAGE[entry.id]}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </ListFrame>
                )}
              </CanvasSection>
            );
          }))}
        </div>
      )}
      inspectorTitle={role.name}
      inspector={
        <>
          <CanvasSettings axes={["ui"]} />
          {view ? (
            <PanelSection heading="Sample">
              <Field label="Text" orientation="vertical">
                <Textarea size="sm" rows={3} value={sample} onChange={event => changeSample(event.currentTarget.value)} />
              </Field>
              <Field label="Weight" orientation="horizontal">
                <Segmented size="sm" fullWidth value={weight} onValueChange={value => setWeight(value as "regular" | "strong")}
                  items={[{ value: "regular", label: "Regular" }, { value: "strong", label: "Strong" }]} />
              </Field>
            </PanelSection>
          ) : null}
          <PanelSection heading="Role">
            <Facts label="Role" items={[
              ["Token", <code className="studio-mono">--area-{role.id}</code>],
              ["Default", metrics(role, "default")],
              ["Compact", metrics(role, "compact")],
              ["Ratio", (role.metrics[density].leading / role.metrics[density].size).toFixed(2)],
              ["Usage", USAGE[role.id]],
            ]} />
          </PanelSection>
        </>
      }
    />
  );
}
