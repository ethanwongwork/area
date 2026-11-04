/**
 * Typography: the ramp as a table, after Vercel's Geist (owner, 2026-10-11): Headings and Copy, one row per role with
 * its name set in its own style at both weights (owner, 2026-10-23: "combine heading and heading strong, and copy and
 * copy strong"), then what the role is made of, its size, line height, tracking and weights (the same
 * day: "remove the type usage, just focus on showing the size, line height, and weight and leading/tracking"); or as a
 * grid of cards, the default view (owner, 2026-10-24: "can you make typography cards?"): a card per style, the Components
 * tab's Asset card, basic with the name below, the "Aa" at the start and Copy CSS in the opposite corner, landscape and
 * with no measures ("make the card more landscape, remove the size leading tracking details"). Choosing a role
 * in the Sidebar shows it at each weight and at every type size, in a sample line the Inspector's Canvas section edits.
 * The Inspector shows the chosen role (its "Aa", its CSS and token to copy, its facts) or, with none, the type scale.
 *
 * Typefaces (owner, 2026-10-31; src/pages/typefaces.tsx): the library sits in the same Sidebar, Text, Display, Code and
 * Licensed above the roles, and on the overview as a card per face before the roles' cards. A face opens on its own
 * page (`face/<id>`, a tab after it): Specimen, Glyphs, About and Code.
 */
import { useState, type ReactNode } from "react";
import { Code, CopyButton as AreaCopyButton, EmptyState, Field, ListBox, PanelSection, Table, TableCell, TableLink, Textarea, Tooltip } from "@area/react";
import { CheckIcon, CopyIcon } from "@area/icons";
import { CanvasSettings } from "../canvas-settings.tsx";
import { SidebarList, SidebarTree, useStudio, Workspace } from "../studio.tsx";
import { hrefOf } from "../places.ts";
import { feedScale } from "../app-scale.ts";
import { Specimen } from "../specimen-scope.tsx";
import { CanvasSection, GALLERY_LOOK, Tile, TileGrid, FEED_TABLE } from "../tile.tsx";
import { savedSample, TYPE_COLUMNS, TYPE_SAMPLE, TypeTable, TypefaceCard, typeValues } from "../type-kit.tsx";
import { factsOf, FaceSummary, KINDS, TYPEFACES, typefaceOf, TypefaceWorkspace, useInstalled } from "./typefaces.tsx";

/* Type cards are the gallery's one card (tile.tsx GALLERY_LOOK); they had a copy of its look of their own. */
const TYPE_LOOK = GALLERY_LOOK;
import { useViewOption, ViewControls, ViewFilter, ViewSwitch, type ViewMode } from "../view-controls.tsx";
import { Facts } from "../facts.tsx";
import { CodeWell, Preview, Selection } from "../inspector.tsx";
import { ArrangeMenu, sortBy, useArrangement } from "../organize.tsx";
import { CopyButton } from "../copy.tsx";
import { matches } from "../search.ts";
import { DEFAULT_TYPE, TYPE_ROLES, TYPE_SIZES, type TypeRole } from "../tokens.ts";
import { readStored, writeStored } from "../storage.ts";

const SAMPLE = TYPE_SAMPLE;

const GROUPS = [
  { id: "headings", label: "Headings", lede: "Introduce pages, sections and surfaces. Surface titles follow the type size; larger headings hold theirs.", groups: ["display", "title"] },
  { id: "copy", label: "Copy", lede: "Body text and interface text. Copy follows the type size: the base, two under it for small text, two over it for reading.", groups: ["text"] },
] as const;

/* The two weights, shown together on each role's row and card (owner, 2026-10-23; until then two ramps), their values
   from the UI scale (400, 500). */
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
  return `${size} / ${leading}${tracking && tracking !== "0em" ? `, ${tracking}` : ""}`;
};
/** Tracking as read: 0 for none, else the token's em value. */
const trackingOf = (role: TypeRole, type: string) => { const value = role.metrics[type]!.tracking; return !value || value === "0em" ? "0" : value; };
/** What a role is made of at a type size, as label and value pairs (the table's columns, the card's rows). */
const measures = (role: TypeRole, type: string, weights: readonly (typeof WEIGHTS)[number][]) => [
  ["Size", `${role.metrics[type]!.size}`],
  ["Line height", `${role.metrics[type]!.leading}`],
  ["Tracking", trackingOf(role, type)],
  ["Weight", weights.map(entry => entry.value).join(", ")],
] as const;

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
  const [sample, setSample] = useState(() => savedSample(readStored("typeSample", SAMPLE)));
  // The Sidebar's choice (All, or one role) and the Inspector's (the row chosen on the Canvas;
  // with one role on the Canvas, that role; with none, the type scale).
  const view = TYPE_ROLES.find(entry => entry.id === item);
  // A typeface's page: `face/<id>`, then its tab.
  const [faceId, faceTab] = item?.startsWith("face/") ? item.slice(5).split("/") : [];
  const face = typefaceOf(faceId);
  const mac = useInstalled();
  // The chosen style, "<weight>:<role>": one cell, since each role shows in both weights (2026-10-15, List box).
  const [selected, setSelected] = useState<string>();
  const [selectedWeight, selectedId] = (selected?.split(":") ?? []) as ["regular" | "strong" | undefined, string | undefined];
  const role = view ?? TYPE_ROLES.find(entry => entry.id === selectedId);
  // The Canvas's type size (Inspector, Canvas section): roles are measured at it.
  const density = canvas.type;
  // The cards by default (owner, 2026-10-24: "can you make typography cards?"), Geist's table one click away; a new key, so
  // a view saved on the table opens on the cards once.
  const [mode, setMode] = useViewOption<ViewMode>("typography-view", "grid", ["grid", "list"]);
  const [weights, setWeights] = useViewOption<"all" | "regular" | "strong">("typography-weight", "all", ["all", "regular", "strong"]);
  // One role's density rows take the header's weight (strong only when it shows strong alone).
  const weight = weights === "strong" ? "strong" : "regular";
  const arrangement = useArrangement<Sort, Group>("typography", { sort: "size", descending: false, group: "kind" }, SORTS, ARRANGE_GROUPS);
  const matching = TYPE_ROLES.filter(entry => matches(query, entry.name, entry.id));
  // The Sidebar and the Canvas share one order (product UI rule 7).
  const shown = arrangement.sort === "name" ? sortBy(matching, entry => entry.name, arrangement.descending)
    : sortBy(matching, entry => -entry.metrics[DEFAULT_TYPE]!.size, arrangement.descending);
  const sections = arrangement.group === "kind" ? GROUPS : [ALL_ROLES];
  const changeSample = (value: string) => { setSample(value); writeStored("typeSample", value); };
  // The library, filtered by the search (name, foundry, designers), in the catalogue's order.
  const faces = TYPEFACES.filter(entry => matches(query, entry.name, entry.foundry, ...entry.designers));
  const faceGroups = KINDS.map(kind => ({ ...kind, faces: faces.filter(kind.test) })).filter(kind => kind.faces.length);
  const chosenFace = selected?.startsWith("face:") ? typefaceOf(selected.slice(5)) : undefined;

  // The Sidebar: the typefaces by kind, then the roles (product UI rule 7: the Canvas's order).
  const sidebar = (
    <SidebarList>
      <SidebarTree label="Typography" count={faces.length + shown.length} current={face ? `face/${face.id}` : view?.id}
        groups={[
          ...faceGroups.map(kind => ({ id: `faces-${kind.id}`, label: kind.label, items: kind.faces.map(entry => ({ id: `face/${entry.id}`, label: entry.name })) })),
          ...sections.map(group => ({ id: group.id, label: group.label,
            items: shown.filter(entry => (group.groups as readonly string[]).includes(entry.group)).map(entry => ({ id: entry.id, label: entry.name })) })),
        ]} />
    </SidebarList>
  );
  if (face) return <TypefaceWorkspace face={face} tab={faceTab} sidebar={sidebar} />;

  return (
    <Workspace
      sidebar={sidebar}
      canvasActions={
        <ViewControls>
          <ViewFilter label="Weight" value={weights} onChange={setWeights}
            options={[{ value: "all", label: "All weights" }, { value: "regular", label: "Regular" }, { value: "strong", label: "Strong" }]} />
          {view ? null : <ArrangeMenu arrangement={arrangement} sorts={SORTS} groups={ARRANGE_GROUPS}
            directions={arrangement.sort === "name" ? ["A to Z", "Z to A"] : ["Largest first", "Smallest first"]} />}
          {view ? null : <ViewSwitch value={mode} onChange={setMode} />}
        </ViewControls>
      }
      canvasTitle={view ? view.name : "Typography"}
      canvas={view ? (
        // One role: at the Canvas's type size in each weight, then at every type size, in the sample line, as the feed's
        // Table (owner, 2026-11-01: "maybe just using regular table components for type is better"; it was ruled rows on
        // the surface from 2026-10-12): the label column names the row and its metrics, the sample sits on one line.
        <TypeTable label={view.name} sampleHeader="Sample" columns={TYPE_COLUMNS} rows={([
          ["regular", undefined, "Regular"],
          ["strong", undefined, "Strong"],
          ...TYPE_SIZES.map(type => [weight, type, `Type ${type}`] as const),
        ] as ReadonlyArray<readonly ["regular" | "strong", string | undefined, string]>).filter(([w, type]) => type || weights === "all" || weights === w).map(([w, type, label]) => ({
          key: label, name: label, values: typeValues(view.metrics[type ?? density]!, w === "strong" ? 500 : 400),
          sample: <Specimen {...(type ? { "data-area-type": type } : {})}><span className="studio-type__sample" style={roleStyle(view, w)}>{sample || SAMPLE}</span></Specimen>,
        }))} />
      ) : !shown.length && !faces.length ? (
        // No matches: the Sidebar keeps All, and the Canvas says so (product UI rule 10, docs/PRODUCT_UI.md).
        <EmptyState title="Nothing found" description={`No typeface or type role matches “${query}”.`} />
      ) : (
        <Sheet grid={mode === "grid"} value={selected ?? null} onChoose={setSelected}>
          {/* The typeface library first: a card per face, "Aa" in the face and its name below, as the roles' cards; a
              double-click (or the Sidebar) opens its page. The list view: one table per kind. */}
          {faceGroups.map(kind => (
            <CanvasSection key={kind.id} role={mode === "grid" ? "group" : undefined} id={`faces-${kind.id}`} title={`${kind.label} typefaces`} count={kind.faces.length} lede={kind.lede}>
              {mode === "grid" ? (
                <TileGrid span="wide" cards>
                  {kind.faces.map(entry => (
                    <TypefaceCard key={entry.id} face={entry} facts={factsOf(entry, mac)} option={`face:${entry.id}`} onOpen={() => select(`face/${entry.id}`)} />
                  ))}
                </TileGrid>
              ) : (
                <Table wrapperProps={FEED_TABLE} size="md" interactive aria-label={`${kind.label} typefaces`}>
                  <thead><tr><th scope="col">Typeface</th><th scope="col">Foundry</th><th scope="col">Licence</th><th scope="col">Characters</th><th scope="col">Axes</th></tr></thead>
                  <tbody>
                    {kind.faces.map(entry => {
                      const facts = factsOf(entry, mac);
                      return (
                        <tr key={entry.id} data-selected={chosenFace?.id === entry.id ? "" : undefined}>
                          <td><TableLink href={hrefOf({ page: "typography", item: `face/${entry.id}` })} onClick={event => { event.preventDefault(); select(`face/${entry.id}`); }}>{entry.name}</TableLink></td>
                          <td><span className="studio-muted">{entry.foundry}</span></td>
                          <td><span className="studio-muted">{entry.licence}</span></td>
                          <TableCell numeric>{facts ? facts.characters.toLocaleString() : "—"}</TableCell>
                          <td><span className="studio-muted">{facts?.axes.length ? facts.axes.map(axis => axis.tag).join(", ") : "—"}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </CanvasSection>
          ))}
          {sections.map(group => {
            const list = shown.filter(entry => (group.groups as readonly string[]).includes(entry.group));
            if (!list.length) return null;
            // The weights shown: both, or the one the header filters to.
            const shownWeights = WEIGHTS.filter(w => weights === "all" || weights === w.id);
            return (
              <CanvasSection key={group.id} role={mode === "grid" ? "group" : undefined} id={`type-${group.id}`} title={group.label} count={list.length} lede={group.lede}>
                {mode === "grid" ? (
                  // Cards: every style its own card (both weights side by side), basic with the name below and Copy CSS beside
                  // it; the role's size, leading, weight and tracking in the card's header (owner, 2026-11-01: "put the badge
                  // information in the 'header' of the card"; 2026-10-24 they had left the card's foot), the "Aa" in the style.
                  <TileGrid span="wide" cards>
                    {list.flatMap(entry => shownWeights.map(w => ({ entry, w }))).map(({ entry, w }) => (
                      <Tile key={`${w.id}:${entry.id}`} container="asset" look={TYPE_LOOK} aspect="hug" span="wide" stage="flow" option={`${w.id}:${entry.id}`}
                        label={`${entry.name}${w.suffix}`} aria-label={`${entry.name}${w.suffix}, ${metrics(entry, density)}`}
                        // Copy, for what is used (Asset card's rule): the role's CSS at this weight, as the Inspector's Copy CSS.
                        actions={
                          <Tooltip side="bottom" describes={false} trigger={
                            <AreaCopyButton variant="ghost" tone="neutral" size="sm" iconOnly label={`Copy ${entry.name}${w.suffix} CSS`} icon={<CopyIcon />} copiedIcon={<CheckIcon />}
                              value={`${roleCss(entry)}\nfont-weight: var(--area-weight-${w.id});`} />
                          }>
                            Copy CSS
                          </Tooltip>
                        }>
                        <span className="studio-type-card" data-sample="glyphs" aria-hidden="true">
                          {/* Its type facts in the card's one-line header (type-kit.tsx, TypefaceCard): size / leading, then tracking. */}
                          <span className="studio-type-card__head studio-tabular">{entry.metrics[density]!.size} / {entry.metrics[density]!.leading}{trackingOf(entry, density) === "0" ? "" : ` · ${trackingOf(entry, density)}`}</span>
                          <span className="studio-type-card__sample" style={roleStyle(entry, w.id)}>Aa</span>
                        </span>
                      </Tile>
                    ))}
                  </TileGrid>
                ) : (
                  // List: Geist's table, each example its own name set in its own style, at each weight shown. In the
                  // framed Table, every cell on its first baseline, so a 72 example and its 14 values share a line.
                  <Table wrapperProps={FEED_TABLE} size="lg" interactive baseline aria-label={group.label}>
                      {/* One set of column widths for every table, so the columns line up down the Canvas. */}
                      <colgroup><col style={{ inlineSize: "52%" }} /><col style={{ inlineSize: "10%" }} /><col style={{ inlineSize: "13%" }} /><col style={{ inlineSize: "13%" }} /><col /></colgroup>
                      <thead>
                        <tr><th scope="col">Example</th><th scope="col">Size</th><th scope="col">Line height</th><th scope="col">Tracking</th><th scope="col">Weight</th></tr>
                      </thead>
                      <tbody>
                        {list.map(entry => (
                          <tr key={entry.id} data-selected={selectedId === entry.id ? "" : undefined}>
                            {/* Both weights in one cell, regular over strong, so a 72 example keeps one line. */}
                            <td>
                              <span className="studio-type__examples">
                                {shownWeights.map(w => (
                                  <TableLink key={w.id} href={hrefOf({ page: "typography", item: entry.id })} className="studio-type__example" style={roleStyle(entry, w.id)}
                                    onClick={event => { event.preventDefault(); setSelected(`${w.id}:${entry.id}`); }}>
                                    {entry.name}
                                  </TableLink>
                                ))}
                              </span>
                            </td>
                            <td><span className="studio-tabular">{entry.metrics[density]!.size}</span></td>
                            <td><span className="studio-tabular">{entry.metrics[density]!.leading}</span></td>
                            <td><span className="studio-tabular">{trackingOf(entry, density)}</span></td>
                            <td><span className="studio-tabular studio-nowrap">{shownWeights.map(w => w.value).join(", ")}</span></td>
                          </tr>
                        ))}
                      </tbody>
                  </Table>
                )}
              </CanvasSection>
            );
          })}
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
            {chosenFace ? <FaceSummary face={chosenFace} facts={factsOf(chosenFace, mac)} /> : role ? (
              <>
                <Selection preview={<Preview><span style={roleStyle(role, view ? weight : selectedWeight ?? weight)} aria-hidden="true">Aa</span></Preview>} />
                <PanelSection heading="Role">
                  <Facts label="Role" items={[
                    ...measures(role, density, WEIGHTS),
                    ["Type 12 to 16", `${role.metrics["12"]!.size} to ${role.metrics["16"]!.size}`],
                    ["Ratio", (role.metrics[density]!.leading / role.metrics[density]!.size).toFixed(2)],
                    ["Group", role.group === "text" ? "Copy" : "Heading"],
                  ]} />
                </PanelSection>
              </>
            ) : (
              <PanelSection heading="Type scale">
                <Facts label="Type scale" items={[
                  ["Roles", TYPE_ROLES.length],
                  ["Headings", TYPE_ROLES.filter(entry => entry.group !== "text").length],
                  ["Copy", TYPE_ROLES.filter(entry => entry.group === "text").length],
                  ["Weights", WEIGHTS.map(entry => `${entry.id === "regular" ? "Regular" : "Strong"} ${entry.value}`).join(", ")],
                  ["Density", "Copy steps down a size in compact; headings hold."],
                ]} />
              </PanelSection>
            )}
          </>
        ),
        code: role ? (
          <>
            <Selection>
              <CopyButton label="Copy token" icon={<CopyIcon />} fullWidth value={() => `var(--area-${role.id}-size)`} />
            </Selection>
            <PanelSection heading="CSS"><CodeWell code={roleCss(role)} /></PanelSection>
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
