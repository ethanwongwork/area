/**
 * Typography: the ramp as a table, after Vercel's Geist (owner, 2026-10-11): Headings and Copy, each
 * at the regular and the strong weight as separate ramps, each row's example its own name set in
 * its own style ("Heading 72", "Copy 14 Strong"), then its token, weight and what it is for; or as
 * a grid of "Aa" tiles. Choosing a role in the Sidebar shows it at each
 * weight and at every type size, in a sample line the Inspector's Canvas section edits. The Inspector shows
 * the chosen role (its "Aa", its CSS and token to copy, its facts) or, with none, the type scale.
 *
 * The usage notes come from where Area uses each role (packages/styles) and the ramp's own notes
 * (packages/tokens/src/axes/typography.ts).
 */
import { useState, type ReactNode } from "react";
import { Code, CopyButton as AreaCopyButton, EmptyState, Field, ListBox, ListBoxItem, Nav, NavGroup, NavItem, PanelSection, Table, TableLink, Textarea, Tooltip } from "@area/react";
import { CheckIcon, CopyIcon } from "@area/icons";
import { CanvasSettings } from "../canvas-settings.tsx";
import { APP_SCALE, SidebarAll, SidebarList, useStudio, Workspace } from "../studio.tsx";
import { CanvasSection } from "../tile.tsx";
import { useViewOption, ViewControls, ViewFilter, ViewSwitch, type ViewMode } from "../view-controls.tsx";
import { Facts } from "../facts.tsx";
import { CodeWell, Preview, Selection } from "../inspector.tsx";
import { ArrangeMenu, sortBy, useArrangement } from "../organize.tsx";
import { CopyButton } from "../copy.tsx";
import { matches } from "../search.ts";
import { DEFAULT_TYPE, TYPE_ROLES, TYPE_SIZES, type TypeRole } from "../tokens.ts";
import { readStored, writeStored } from "../storage.ts";

const SAMPLE = "Every component, icon and colour in one place.";

const GROUPS = [
  { id: "headings", label: "Headings", lede: "Introduce pages, sections and surfaces. Surface titles follow the type size; larger headings hold theirs.", groups: ["display", "title"] },
  { id: "copy", label: "Copy", lede: "Body text and interface text. Copy follows the type size: the base, two under it for small text, two over it for reading.", groups: ["text"] },
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

/* Sort and group (src/organize.tsx). The default is the ramp as it was: largest first, headings
   then copy. */
const SORTS = [{ value: "size", label: "Size" }, { value: "name", label: "Name" }] as const;
const ARRANGE_GROUPS = [{ value: "kind", label: "Headings and copy" }, { value: "none", label: "None" }] as const;
type Sort = (typeof SORTS)[number]["value"];
type Group = (typeof ARRANGE_GROUPS)[number]["value"];
const ALL_ROLES = { id: "all", label: "All roles", lede: "Every role, headings and copy together.", groups: ["display", "title", "text"] } as const;

/** A role's CSS, as the Copy CSS action writes it. */
const roleCss = (role: TypeRole) => [`font-size: var(--area-${role.id}-size);`, `line-height: var(--area-${role.id}-leading);`, `letter-spacing: var(--area-${role.id}-tracking);`].join("\n");

const roleStyle = (role: TypeRole, weight: "regular" | "strong") => ({
  fontSize: `var(--area-${role.id}-size)`,
  lineHeight: `var(--area-${role.id}-leading)`,
  letterSpacing: `var(--area-${role.id}-tracking)`,
  fontWeight: `var(--area-weight-${weight})`,
});

const metrics = (role: TypeRole, type: string) => {
  const { size, leading, tracking } = role.metrics[type]!;
  return `${size} / ${leading}${tracking && tracking !== "0em" ? ` · ${tracking}` : ""}`;
};

/**
 * Copies a token: Area's icon-only CopyButton (docs/specs/copy-button.md), its check standing in for the copy glyph for
 * two seconds and the result said once to assistive tech, with ChromeButton's tooltip and bar class.
 */
function CopyToken({ token }: { token: string }) {
  return (
    <Tooltip side="bottom" describes={false} trigger={
      <AreaCopyButton className="studio-bar-icon" label={`Copy ${token}`} icon={<CopyIcon />} copiedIcon={<CheckIcon />} value={`var(${token})`} />
    }>
      Copy {token}
    </Tooltip>
  );
}

/*
 * The Canvas's roles. In the grid every cell is an option of one ListBox (docs/specs/list-box.md): one Tab stop, the
 * arrows across the sheets, typing to a name, selection following focus so the Inspector shows the keys' style.
 */
function Sheet({ grid, value, onChoose, children }: { grid: boolean; value: string | null; onChoose: (value: string) => void; children: ReactNode }) {
  return grid
    ? <ListBox layout="grid" aria-label="Type styles" value={value} onValueChange={onChoose} selectionFollowsFocus className="studio-sections">{children}</ListBox>
    : <div className="studio-sections">{children}</div>;
}

export function TypographyPage() {
  const { query, item, select, shown: { canvas } } = useStudio();
  const [sample, setSample] = useState(() => readStored("typeSample", SAMPLE));
  // The Sidebar's choice (All, or one role) and the Inspector's (the row chosen on the Canvas;
  // with one role on the Canvas, that role; with none, the type scale).
  const view = TYPE_ROLES.find(entry => entry.id === item);
  // The chosen style, "<weight>:<role>": one cell, since each role shows in both weights (2026-10-15, List box).
  const [selected, setSelected] = useState<string>();
  const [selectedWeight, selectedId] = (selected?.split(":") ?? []) as ["regular" | "strong" | undefined, string | undefined];
  const role = view ?? TYPE_ROLES.find(entry => entry.id === selectedId);
  // The Canvas's type size (Inspector, Canvas section): roles are measured at it.
  const density = canvas.type;
  const [mode, setMode] = useViewOption<ViewMode>("typography", "list", ["grid", "list"]);
  const [weights, setWeights] = useViewOption<"all" | "regular" | "strong">("typography-weight", "all", ["all", "regular", "strong"]);
  // One role's density rows take the header's weight (strong only when it shows strong alone).
  const weight = weights === "strong" ? "strong" : "regular";
  const arrangement = useArrangement<Sort, Group>("typography", { sort: "size", descending: false, group: "kind" }, SORTS, ARRANGE_GROUPS);
  const matching = TYPE_ROLES.filter(entry => matches(query, entry.name, entry.id, USAGE[entry.id]));
  // The Sidebar and the Canvas share one order (product UI rule 7).
  const shown = arrangement.sort === "name" ? sortBy(matching, entry => entry.name, arrangement.descending)
    : sortBy(matching, entry => -entry.metrics[DEFAULT_TYPE]!.size, arrangement.descending);
  const sections = arrangement.group === "kind" ? GROUPS : [ALL_ROLES];
  const changeSample = (value: string) => { setSample(value); writeStored("typeSample", value); };

  return (
    <Workspace
      sidebar={<SidebarList>{
        <Nav aria-label="Type roles">
          <SidebarAll tab="typography" count={shown.length} current={!view} />
          {sections.map(group => {
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
      }</SidebarList>}
      canvasActions={
        <ViewControls>
          <ViewFilter label="Weight" value={weights} onChange={setWeights}
            options={[{ value: "all", label: "All weights" }, { value: "regular", label: "Regular" }, { value: "strong", label: "Strong" }]} />
          {view ? null : <ArrangeMenu arrangement={arrangement} sorts={SORTS} groups={ARRANGE_GROUPS}
            directions={arrangement.sort === "name" ? ["A to Z", "Z to A"] : ["Largest first", "Smallest first"]} />}
          {view ? null : <ViewSwitch value={mode} onChange={setMode} />}
        </ViewControls>
      }
      canvasTitle={view ? view.name : "All roles"}
      canvas={view ? (
        // One role: at the Canvas's type size in each weight, then at every type size, in the sample
        // line, as ruled rows on the Canvas's surface (owner, 2026-10-12: type sits on the surface; a
        // specimen is text, which needs no container).
        <div className="studio-type-rows">
          {([
            ["regular", undefined, "Regular"],
            ["strong", undefined, "Strong"],
            ...TYPE_SIZES.map(type => [weight, type, `Type ${type}`] as const),
          ] as ReadonlyArray<readonly ["regular" | "strong", string | undefined, string]>).filter(([w, type]) => type || weights === "all" || weights === w).map(([w, type, label]) => (
            <section key={label} className="studio-type-row" aria-label={label}>
              <div className="studio-type-row__head" {...APP_SCALE}>
                <span>{label}</span>
                <span className="studio-tabular">{metrics(view, type ?? density)}</span>
              </div>
              <div {...(type ? { "data-area-type": type } : {})}>
                <span className="studio-type__sample" style={roleStyle(view, w)}>{sample || SAMPLE}</span>
              </div>
            </section>
          ))}
        </div>
      ) : !shown.length ? (
        // No matches: the Sidebar keeps All, and the Canvas says so (product UI rule 10, docs/PRODUCT_UI.md).
        <EmptyState title="No type roles" description={`Nothing matches “${query}”.`} />
      ) : (
        <Sheet grid={mode === "grid"} value={selected ?? null} onChoose={setSelected}>
          {sections.flatMap(group => WEIGHTS.filter(w => weights === "all" || weights === w.id).map(w => {
            const list = shown.filter(entry => (group.groups as readonly string[]).includes(entry.group));
            if (!list.length) return null;
            const styleName = (entry: TypeRole) => `${entry.name}${w.suffix}`;
            return (
              <CanvasSection key={`${group.id}-${w.id}`} role={mode === "grid" ? "group" : undefined} id={`type-${group.id}-${w.id}`} title={`${group.label}${w.suffix}`} count={list.length}
                lede={w.id === "regular" ? group.lede : `The same ramp at the strong weight (${w.value}), for emphasis and titles that need it.`}>
                {mode === "grid" ? (
                  // Grid: every style a cell on the surface, its "Aa" set in the style over its name and
                  // values, with the icon cells' plates (Cursor's sheet; no containers for type).
                  <div className="studio-type-sheet">
                    {list.map(entry => (
                      <ListBoxItem key={entry.id} value={`${w.id}:${entry.id}`} textValue={styleName(entry)} className="studio-type-cell"
                        aria-label={`${styleName(entry)}, ${metrics(entry, density)}`}>
                        <span className="studio-type-cell__sample" style={roleStyle(entry, w.id)} aria-hidden="true">Aa</span>
                        <span className="studio-type-cell__label" {...APP_SCALE} aria-hidden="true">
                          <span>{styleName(entry)}</span>
                          <span className="studio-muted studio-tabular">{metrics(entry, density)}</span>
                        </span>
                      </ListBoxItem>
                    ))}
                  </div>
                ) : (
                  // List: Geist's table, each example its own name set in its own style.
                  // On the surface (a flush Table), every cell on its first baseline, so a 72 example
                  // and its 14 token share a line.
                  <Table size="lg" interactive flush baseline aria-label={`${group.label}${w.suffix}`}>
                      {/* One set of column widths for every table, so the columns line up down the Canvas. */}
                      <colgroup><col style={{ inlineSize: "40%" }} /><col style={{ inlineSize: "26%" }} /><col style={{ inlineSize: "10%" }} /><col /></colgroup>
                      <thead>
                        <tr><th scope="col">Example</th><th scope="col">Token</th><th scope="col">Weight</th><th scope="col">Usage</th></tr>
                      </thead>
                      <tbody>
                        {list.map(entry => (
                          <tr key={entry.id} data-selected={selected === `${w.id}:${entry.id}` ? "" : undefined}>
                            <td>
                              <TableLink href={`#typography/${entry.id}`} className="studio-type__example" style={roleStyle(entry, w.id)}
                                onClick={event => { event.preventDefault(); setSelected(`${w.id}:${entry.id}`); }}>
                                {styleName(entry)}
                              </TableLink>
                            </td>
                            <td><span className="studio-type__token"><Code>--area-{entry.id}</Code><CopyToken token={`--area-${entry.id}-size`} /></span></td>
                            <td><span className="studio-tabular">{w.value}</span></td>
                            <td><span className="studio-muted">{USAGE[entry.id]}</span></td>
                          </tr>
                        ))}
                      </tbody>
                  </Table>
                )}
              </CanvasSection>
            );
          }))}
        </Sheet>
      )}
      inspector={{
        theme: <CanvasSettings axes={["type", "density"]} />,
        design: (
          <>
            {view ? (
              <PanelSection heading="Display">
                <Field label="Sample" orientation="vertical">
                  <Textarea size="sm" rows={3} value={sample} onChange={event => changeSample(event.currentTarget.value)} />
                </Field>
              </PanelSection>
            ) : null}
            {role ? (
              <>
                <Selection preview={<Preview><span style={roleStyle(role, view ? weight : selectedWeight ?? weight)} aria-hidden="true">Aa</span></Preview>} />
                <PanelSection heading="Role">
                  <Facts label="Role" items={[
                    ["At type " + density, metrics(role, density)],
                    ["Type 12 to 16", `${role.metrics["12"]!.size} to ${role.metrics["16"]!.size}`],
                    ["Ratio", (role.metrics[density]!.leading / role.metrics[density]!.size).toFixed(2)],
                    ["Weights", WEIGHTS.map(entry => entry.value).join(" · ")],
                    ["Group", role.group === "text" ? "Copy" : "Heading"],
                    ["Usage", USAGE[role.id]],
                  ]} />
                </PanelSection>
              </>
            ) : (
              <PanelSection heading="Type scale">
                <Facts label="Type scale" items={[
                  ["Roles", TYPE_ROLES.length],
                  ["Headings", TYPE_ROLES.filter(entry => entry.group !== "text").length],
                  ["Copy", TYPE_ROLES.filter(entry => entry.group === "text").length],
                  ["Weights", WEIGHTS.map(entry => `${entry.id === "regular" ? "Regular" : "Strong"} ${entry.value}`).join(" · ")],
                  ["Density", "Copy steps down a size in compact; headings hold."],
                ]} />
              </PanelSection>
            )}
          </>
        ),
        code: role ? (
          <>
            <Selection>
              <CopyButton label="Copy CSS" icon={<CopyIcon />} fullWidth value={() => roleCss(role)} />
              <CopyButton label="Copy token" icon={<CopyIcon />} fullWidth value={() => `var(--area-${role.id}-size)`} />
            </Selection>
            <PanelSection heading="CSS"><CodeWell code={roleCss(role)} language="css" /></PanelSection>
            <PanelSection heading="Tokens">
              <Facts label="Tokens" items={[
                ["Size", <Code>--area-{role.id}-size</Code>],
                ["Leading", <Code>--area-{role.id}-leading</Code>],
                ["Tracking", <Code>--area-{role.id}-tracking</Code>],
              ]} />
            </PanelSection>
          </>
        ) : (
          <PanelSection heading="Tokens">
            <Facts label="Tokens" items={[
              ["Font", <Code>--area-font-sans</Code>],
              ["Role", <Code>--area-&lt;role&gt;-size</Code>],
            ]} />
          </PanelSection>
        ),
      }}
    />
  );
}
