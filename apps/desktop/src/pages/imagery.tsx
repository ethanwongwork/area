/**
 * Imagery: images in organized folders (owner, 2026-10-18: "an organized place in the electron browser called brand,
 * where i can explore things in organized folders"; renamed 2026-10-24: "dont associate them just with brand"), from
 * the Pinterest board oval / brand, downloaded to the app's own data folder (~/Library/Application Support/Area/Brand,
 * the library's own name, kept), never into the repository.
 *
 * Assets and groups (owner, 2026-10-18: "the gallery for brand to just be a bunch of containers ... they are
 * essentially all assets, then you can group assets together in a group ... a 2x2 grid with each asset scaled down",
 * after Figma's file browser): every image is an asset in an Asset card, its name and detail line under the container;
 * a group (the library's folders) is an Asset card holding a 2 x 2 mosaic of its first four. A group's assets show as a
 * grid, a waterfall that hugs each asset (owner, 2026-10-19: "potentially a waterfall view that hugs the size of
 * assets") or a list. Containerless is tried on Components first (owner, 2026-10-19), not here. The groups in the
 * Sidebar; on the Canvas an AssetGrid of groups, a group's assets, or one asset at full size; the chosen one in the
 * Inspector. Folder, File page and File tile stay in the library for file browsers.
 *
 * Images (owner, 2026-10-24: "make the images themselves fill the full width of the card, and also have names/titles appear
 * on hover"): each image is an Asset card, basic with the overlay caption, so the image is the whole card and its name
 * shows on it under the pointer or with focus; a group is the layered (framed) card, its mosaic inside the card's inset
 * and its name below. Both hold the gallery cards' look
 * (tile.tsx, CARD_SCOPE).
 *
 * Electron serves the library as area-brand://library/ (electron/main.cjs); the browser preview as /__brand/
 * (scripts/dev.mjs). Location: #imagery/<folder>, #imagery/<folder>/<image> for the viewer.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AssetGrid, AssetGridItem, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Button, Code, ColorSwatch, EmptyState, PanelSection, Select, Spinner, Table, TableCell } from "@area/react";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, GridIcon, OpenIcon } from "@area/icons";
import { SidebarList, SidebarTree, useStudio, Workspace } from "../studio.tsx";
import { hrefOf } from "../places.ts";
import { CanvasSection, CARD_SCOPE } from "../tile.tsx";
import { useViewOption, ViewControls, ViewSwitch } from "../view-controls.tsx";
import { CanvasSettings } from "../canvas-settings.tsx";
import { Facts } from "../facts.tsx";
import { Preview, Selection } from "../inspector.tsx";
import { matches } from "../search.ts";

export interface BrandFolder { id: string; name: string; description: string }
export interface BrandItem {
  id: string; order: number; folder: string; title: string; alt: string; source: string; link: string; color: string;
  width: number; height: number; file: string; thumb: string; kind: string; pin: string; video?: string;
}
export interface Library { name: string; source: string; fetched: string; folders: BrandFolder[]; items: BrandItem[] }

/** Where the library is served: Electron's protocol, or the dev server's route in a browser. */
const BASE = typeof window !== "undefined" && window.areaDesktop ? "area-brand://library/" : "/__brand/";
export const url = (path: string) => BASE + path;
/* A pin's title, else Pinterest's description of it ("A poster with …"), else where it came from. */
const nameOf = (item: BrandItem) => item.title || (item.alt ? item.alt[0]!.toUpperCase() + item.alt.slice(1) : "") || item.source || "Untitled";
const kindLabel = (item: BrandItem) => item.kind === "jpeg" ? "JPG" : item.kind.toUpperCase();

/* Card sizes: a column's least width (the Asset grid's --area-asset-card-size). Medium is the default, four across a 1440
   window with both panels (owner, 2026-10-24: "smaller tho to fit more columns", then "the min width for the images can
   be slightly larger"; was 160 / 224 / 320, then 120 / 160 / 240). */
const SIZES = { small: 144, medium: 192, large: 288 } as const; /* pick */
type Size = keyof typeof SIZES;
type Mode = "grid" | "waterfall" | "list";

/** The Library's file (library.json), read once; Home shows its groups as boards. */
export function useLibrary() {
  const [state, setState] = useState<{ library?: Library; error?: string }>({});
  useEffect(() => {
    let live = true;
    fetch(url("library.json"))
      .then(response => { if (!response.ok) throw new Error(String(response.status)); return response.json() as Promise<Library>; })
      .then(library => { if (live) setState({ library }); })
      .catch(error => { if (live) setState({ error: String(error) }); });
    return () => { live = false; };
  }, []);
  return state;
}

export function ImageryPage() {
  const { library, error } = useLibrary();
  const { item, select, query } = useStudio();
  const [folderId, openedId] = (item ?? "").split("/");
  const [size, setSize] = useViewOption<Size>("brand:size", "medium", ["small", "medium", "large"]);
  const [mode, setMode] = useViewOption<Mode>("brand:mode", "grid", ["grid", "waterfall", "list"]);
  const [chosen, setChosen] = useState<string | null>(null);
  const canvas = useRef<HTMLDivElement>(null);

  const folders = library?.folders ?? [];
  const byFolder = useMemo(() => {
    const map = new Map<string, BrandItem[]>();
    for (const entry of library?.items ?? []) map.set(entry.folder, [...(map.get(entry.folder) ?? []), entry]);
    return map;
  }, [library]);
  const folder = folders.find(entry => entry.id === folderId);
  const searching = query.trim().length > 0;
  // The images the Canvas lists: the folder's, or every folder's while searching.
  const shown = useMemo(() => {
    const scope = folder ? byFolder.get(folder.id) ?? [] : searching ? library?.items ?? [] : [];
    return searching ? scope.filter(entry => matches(query, [entry.title, entry.alt, entry.source, folders.find(f => f.id === entry.folder)?.name ?? ""].join(" "))) : scope;
  }, [folder, byFolder, searching, query, library, folders]);
  const opened = openedId ? library?.items.find(entry => entry.id === openedId) : undefined;
  const selected = library?.items.find(entry => entry.id === (opened?.id ?? chosen)) ?? null;

  // A new folder starts with nothing chosen, at the top.
  useEffect(() => { setChosen(null); canvas.current?.scrollTo({ top: 0 }); }, [folderId]);

  const openFolder = (id: string) => select(id);
  const openImage = (entry: BrandItem) => { setChosen(entry.id); select(`${entry.folder}/${entry.id}`); };
  const closeViewer = () => select(opened?.folder ?? folderId ?? "");
  // The viewer steps through the list it was opened from (the folder, or the search's results).
  const siblings = opened ? (shown.some(entry => entry.id === opened.id) ? shown : byFolder.get(opened.folder) ?? []) : [];
  const step = (by: number) => {
    if (!opened || !siblings.length) return;
    const index = siblings.findIndex(entry => entry.id === opened.id);
    const next = siblings[(index + by + siblings.length) % siblings.length]!;
    setChosen(next.id);
    select(`${next.folder}/${next.id}`, { replace: true });
  };
  useEffect(() => {
    if (!opened) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest("input, textarea, select, [role=listbox]")) return;
      if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
      else if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
      else if (event.key === "Escape") { event.preventDefault(); closeViewer(); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  });

  const total = library?.items.length ?? 0;
  const trail = (
    <Breadcrumb aria-label="Location" className="studio-imagery__trail">
      <BreadcrumbList>
        <BreadcrumbItem>{folder || opened ? <BreadcrumbLink href={hrefOf({ page: "library" })} onClick={event => { event.preventDefault(); select(""); }}>Library</BreadcrumbLink> : <BreadcrumbPage>Library</BreadcrumbPage>}</BreadcrumbItem>
        {folder ? <>
          <BreadcrumbSeparator />
          <BreadcrumbItem>{opened ? <BreadcrumbLink href={hrefOf({ page: "library", item: folder.id })} onClick={event => { event.preventDefault(); closeViewer(); }}>{folder.name}</BreadcrumbLink> : <BreadcrumbPage>{folder.name}</BreadcrumbPage>}</BreadcrumbItem>
        </> : null}
        {opened ? <><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>{nameOf(opened)}</BreadcrumbPage></BreadcrumbItem></> : null}
      </BreadcrumbList>
    </Breadcrumb>
  );

  const imageGrid = (entries: BrandItem[], label: string) => mode === "list" ? (
    <Table size="md" interactive aria-label={label}>
      <thead><tr><th scope="col">Image</th><th scope="col">Name</th><th scope="col">Source</th><th scope="col">Size</th></tr></thead>
      <tbody>
        {entries.map(entry => (
          <tr key={entry.id} data-selected={entry.id === chosen ? "" : undefined} onClick={() => setChosen(entry.id)} onDoubleClick={() => openImage(entry)}>
            <TableCell fit><img className="studio-imagery__row-thumb" src={url(entry.thumb)} alt="" loading="lazy" decoding="async" /></TableCell>
            <td><a href={hrefOf({ page: "library", item: `${entry.folder}/${entry.id}` })} onClick={event => { event.preventDefault(); openImage(entry); }}>{nameOf(entry)}</a></td>
            <td><span className="studio-muted">{entry.source || "—"}</span></td>
            <td><span className="studio-muted">{entry.width} × {entry.height}</span></td>
          </tr>
        ))}
      </tbody>
    </Table>
  ) : (
    <AssetGrid aria-label={label} value={chosen} onValueChange={setChosen} onOpen={id => { const entry = entries.find(e => e.id === id); if (entry) openImage(entry); }}
      layout={mode === "waterfall" ? "waterfall" : "grid"} {...CARD_SCOPE}
      style={{ "--area-asset-card-size": `${SIZES[size]}px` } as CSSProperties}>
      {entries.map(entry => (
        <AssetGridItem key={entry.id} value={entry.id} name={nameOf(entry)} media={url(entry.thumb)} container="basic" caption="overlay"
          // Its own shape, in the grid too (owner, 2026-10-24: "just their own unique height, and the top of each image row
          // always aligns": the Asset grid tops its rows); packed into columns in the waterfall.
          mediaRatio={entry.width && entry.height ? entry.width / entry.height : undefined} />
      ))}
    </AssetGrid>
  );

  let body;
  if (error) body = <EmptyState title="No image library" description="The library is read from ~/Library/Application Support/Area/Brand/library.json, which is missing or unreadable." />;
  else if (!library) body = <div className="studio-imagery__loading"><Spinner size="md" label="Loading the image library" /></div>;
  else if (opened) body = (
    <figure className="studio-imagery__viewer">
      <img key={opened.id} src={url(opened.file)} alt={opened.alt || nameOf(opened)} style={{ aspectRatio: `${opened.width} / ${opened.height}`, background: opened.color }} />
      <figcaption className="studio-muted">{siblings.findIndex(entry => entry.id === opened.id) + 1} of {siblings.length}</figcaption>
    </figure>
  );
  else if (folder || searching) body = shown.length ? (
    <CanvasSection id="brand-images" title={searching ? <>{folder ? `${folder.name}: ` : ""}{shown.length} results</> : undefined}>{imageGrid(shown, folder?.name ?? "Results")}</CanvasSection>
  ) : <EmptyState title="Nothing found" description={`Nothing matches “${query}”.`} />;
  else body = (
    <CanvasSection id="brand-groups" title="Groups" count={folders.length}>
      <AssetGrid aria-label="Groups" value={chosen} onValueChange={setChosen} onOpen={openFolder} {...CARD_SCOPE}
        style={{ "--area-asset-card-size": `${SIZES[size]}px` } as CSSProperties}>
        {folders.map(entry => (
          // A group keeps the layered card (owner, 2026-10-24: "use the old asset card style with the layered containers for
          // groups"): framed, landscape ("the AR can be landscape"), its four cells lined up with the name and as far apart
          // as from the edge (Asset card's group inset), the name below, in the gallery cards' look.
          <AssetGridItem key={entry.id} value={entry.id} name={entry.name} container="framed" caption="below" aspect="landscape"
            group={(byFolder.get(entry.id) ?? []).slice(0, 4).map(asset => url(asset.thumb))} />
        ))}
      </AssetGrid>
    </CanvasSection>
  );

  const chosenFolder = !opened && !folder ? folders.find(entry => entry.id === chosen) : undefined;
  return (
    <Workspace
      sidebar={<SidebarList>
        <SidebarTree label="Image groups" count={total} current={folder?.id} onSelect={openFolder}
          groups={[{ id: "groups", label: "Groups", items: folders.map(entry => ({ id: entry.id, label: entry.name, icon: <GridIcon />, trailing: <span className="studio-muted studio-imagery__count">{byFolder.get(entry.id)?.length ?? 0}</span> })) }]} />
      </SidebarList>}
      canvasLead={opened ? <>
        <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<ArrowLeftIcon />} aria-label={`Back to ${folder?.name ?? "Library"}`} onClick={closeViewer} />
        {trail}
      </> : trail}
      canvasTitle={opened ? nameOf(opened) : folder?.name ?? "Library"}
      canvasRef={canvas}
      canvasActions={
        <ViewControls>
          {opened ? <>
            <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<ChevronLeftIcon />} aria-label="Previous image" onClick={() => step(-1)} />
            <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<ChevronRightIcon />} aria-label="Next image" onClick={() => step(1)} />
          </> : <>
            <Select size="sm" variant="soft" aria-label="Card size" value={size} onChange={event => setSize(event.currentTarget.value as Size)}>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </Select>
            {folder || searching ? <ViewSwitch waterfall value={mode} onChange={setMode} /> : null}
          </>}
        </ViewControls>
      }
      canvas={<div className="studio-imagery">{body}</div>}
      inspector={{
        theme: <CanvasSettings axes={["type", "density"]} />,
        // An image library: what is chosen, and no code.
        design: <>
          {selected ? (
            <>
              <Selection preview={<Preview label={nameOf(selected)} paint={selected.color}><img className="studio-imagery__preview" src={url(selected.thumb)} alt="" /></Preview>}>
                {!opened ? <Button variant="outline" size="sm" fullWidth onClick={() => openImage(selected)}>Open</Button> : null}
                <Button variant="outline" size="sm" fullWidth icon={<OpenIcon />} onClick={() => window.open(selected.pin, "_blank")}>Pinterest</Button>
                {selected.link ? <Button variant="outline" size="sm" fullWidth icon={<OpenIcon />} onClick={() => window.open(selected.link, "_blank")}>Source</Button> : null}
                {window.areaDesktop?.revealBrand ? <Button variant="outline" size="sm" fullWidth onClick={() => window.areaDesktop?.revealBrand?.(selected.file)}>Show in Finder</Button> : null}
              </Selection>
              <PanelSection heading="Asset">
                <Facts label="Asset" items={[
                  ["Name", nameOf(selected)],
                  ["Group", folders.find(entry => entry.id === selected.folder)?.name],
                  selected.source ? ["Source", selected.source] : null,
                  ["Size", `${selected.width} × ${selected.height}`],
                  ["Format", kindLabel(selected)],
                  ["Colour", <span className="studio-imagery__colour"><ColorSwatch color={selected.color} size="sm" aria-hidden="true" /><Code>{selected.color}</Code></span>],
                  selected.alt && selected.title ? ["Description", selected.alt] : null,
                ]} />
              </PanelSection>
            </>
          ) : library ? (
            <PanelSection heading={chosenFolder ?? folder ? "Group" : "Library"}>
              <Facts label="Library" items={chosenFolder ?? folder ? [
                ["Name", (chosenFolder ?? folder)!.name],
                ["Assets", byFolder.get((chosenFolder ?? folder)!.id)?.length ?? 0],
                ["Holds", (chosenFolder ?? folder)!.description],
              ] : [
                ["Assets", total],
                ["Groups", folders.length],
                ["From", "Pinterest, oval / brand"],
                ["Saved", new Date(library.fetched).toLocaleDateString()],
                ["Stored in", <Code>Application Support/Area/Brand</Code>],
              ]} />
            </PanelSection>
          ) : null}
        </>,
      }}
    />
  );
}
