/**
 * Brand: the owner's brand inspiration (owner, 2026-10-18: "an organized place in the electron browser called brand,
 * where i can explore things in organized folders"), from the Pinterest board oval / brand, downloaded to the app's own
 * data folder (~/Library/Application Support/Area/Brand), never into the repository.
 *
 * Assets and groups (owner, 2026-10-18: "the gallery for brand to just be a bunch of containers ... they are
 * essentially all assets, then you can group assets together in a group ... a 2x2 grid with each asset scaled down",
 * after Figma's file browser): every image is an asset in an Asset card, its name and detail line under the container;
 * a group (the library's folders) is an Asset card holding a 2 x 2 mosaic of its first four. The groups in the
 * Sidebar; on the Canvas an AssetGrid of groups, a group's assets, or one asset at full size; the chosen one in the
 * Inspector. Folder, File page and File tile stay in the library for file browsers.
 *
 * Electron serves the library as area-brand://library/ (electron/main.cjs); the browser preview as /__brand/
 * (scripts/dev.mjs). Location: #brand/<folder>, #brand/<folder>/<image> for the viewer.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AssetGrid, AssetGridItem, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Button, Code, ColorSwatch, EmptyState, Nav, NavGroup, NavItem, PanelSection, Select, Spinner, Table, TableCell } from "@area/react";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, GridIcon, OpenIcon } from "@area/icons";
import { SidebarAll, SidebarList, useStudio, Workspace } from "../studio.tsx";
import { CanvasSection } from "../tile.tsx";
import { useViewOption, ViewControls, ViewSwitch } from "../view-controls.tsx";
import { CanvasSettings } from "../canvas-settings.tsx";
import { Facts } from "../facts.tsx";
import { Preview, Selection } from "../inspector.tsx";
import { matches } from "../search.ts";

interface BrandFolder { id: string; name: string; description: string }
interface BrandItem {
  id: string; order: number; folder: string; title: string; alt: string; source: string; link: string; color: string;
  width: number; height: number; file: string; thumb: string; kind: string; pin: string; video?: string;
}
interface Library { name: string; source: string; fetched: string; folders: BrandFolder[]; items: BrandItem[] }

/** Where the library is served: Electron's protocol, or the dev server's route in a browser. */
const BASE = typeof window !== "undefined" && window.areaDesktop ? "area-brand://library/" : "/__brand/";
const url = (path: string) => BASE + path;
/* A pin's title, else Pinterest's description of it ("A poster with …"), else where it came from. */
const nameOf = (item: BrandItem) => item.title || (item.alt ? item.alt[0]!.toUpperCase() + item.alt.slice(1) : "") || item.source || "Untitled";
const kindLabel = (item: BrandItem) => item.kind === "jpeg" ? "JPG" : item.kind.toUpperCase();

/* Card sizes: a column's least width (the Asset grid's --area-asset-card-size). Medium is the default. */
const SIZES = { small: 160, medium: 224, large: 320 } as const; /* pick */
type Size = keyof typeof SIZES;

function useLibrary() {
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

export function BrandPage() {
  const { library, error } = useLibrary();
  const { item, select, query } = useStudio();
  const [folderId, openedId] = (item ?? "").split("/");
  const [size, setSize] = useViewOption<Size>("brand:size", "medium", ["small", "medium", "large"]);
  const [mode, setMode] = useViewOption<"grid" | "list">("brand:mode", "grid", ["grid", "list"]);
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
    <Breadcrumb aria-label="Location" className="studio-brand__trail">
      <BreadcrumbList>
        <BreadcrumbItem>{folder || opened ? <BreadcrumbLink href="#brand" onClick={event => { event.preventDefault(); select(""); }}>Brand</BreadcrumbLink> : <BreadcrumbPage>Brand</BreadcrumbPage>}</BreadcrumbItem>
        {folder ? <>
          <BreadcrumbSeparator />
          <BreadcrumbItem>{opened ? <BreadcrumbLink href={`#brand/${folder.id}`} onClick={event => { event.preventDefault(); closeViewer(); }}>{folder.name}</BreadcrumbLink> : <BreadcrumbPage>{folder.name}</BreadcrumbPage>}</BreadcrumbItem>
        </> : null}
        {opened ? <><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>{nameOf(opened)}</BreadcrumbPage></BreadcrumbItem></> : null}
      </BreadcrumbList>
    </Breadcrumb>
  );

  const imageGrid = (entries: BrandItem[], label: string) => mode === "list" ? (
    <Table size="md" interactive flush aria-label={label}>
      <thead><tr><th scope="col">Image</th><th scope="col">Name</th><th scope="col">Source</th><th scope="col">Size</th></tr></thead>
      <tbody>
        {entries.map(entry => (
          <tr key={entry.id} data-selected={entry.id === chosen ? "" : undefined} onClick={() => setChosen(entry.id)} onDoubleClick={() => openImage(entry)}>
            <TableCell fit><img className="studio-brand__row-thumb" src={url(entry.thumb)} alt="" loading="lazy" decoding="async" /></TableCell>
            <td><a href={`#brand/${entry.folder}/${entry.id}`} onClick={event => { event.preventDefault(); openImage(entry); }}>{nameOf(entry)}</a></td>
            <td><span className="studio-muted">{entry.source || "—"}</span></td>
            <td><span className="studio-muted">{entry.width} × {entry.height}</span></td>
          </tr>
        ))}
      </tbody>
    </Table>
  ) : (
    <AssetGrid aria-label={label} value={chosen} onValueChange={setChosen} onOpen={id => { const entry = entries.find(e => e.id === id); if (entry) openImage(entry); }}
      style={{ "--area-asset-card-size": `${SIZES[size]}px` } as CSSProperties}>
      {entries.map(entry => (
        <AssetGridItem key={entry.id} value={entry.id} name={nameOf(entry)} meta={`${kindLabel(entry)} · ${entry.width} × ${entry.height}`} media={url(entry.thumb)} textValue={nameOf(entry)} />
      ))}
    </AssetGrid>
  );

  let body;
  if (error) body = <EmptyState title="No brand library" description="The library is read from ~/Library/Application Support/Area/Brand/library.json, which is missing or unreadable." />;
  else if (!library) body = <div className="studio-brand__loading"><Spinner size="md" label="Loading the brand library" /></div>;
  else if (opened) body = (
    <figure className="studio-brand__viewer">
      <img key={opened.id} src={url(opened.file)} alt={opened.alt || nameOf(opened)} style={{ aspectRatio: `${opened.width} / ${opened.height}`, background: opened.color }} />
      <figcaption className="studio-muted">{siblings.findIndex(entry => entry.id === opened.id) + 1} of {siblings.length}</figcaption>
    </figure>
  );
  else if (folder || searching) body = shown.length ? (
    <CanvasSection id="brand-images" title={searching ? <>{folder ? `${folder.name}: ` : ""}{shown.length} results</> : undefined}>{imageGrid(shown, folder?.name ?? "Results")}</CanvasSection>
  ) : <EmptyState title="Nothing found" description={`Nothing matches “${query}”.`} />;
  else body = (
    <CanvasSection id="brand-groups" title={<>Groups <span className="studio-muted">{folders.length}</span></>}>
      <AssetGrid aria-label="Groups" value={chosen} onValueChange={setChosen} onOpen={openFolder}
        style={{ "--area-asset-card-size": `${SIZES[size]}px` } as CSSProperties}>
        {folders.map(entry => {
          const inside = byFolder.get(entry.id) ?? [];
          return (
            <AssetGridItem key={entry.id} value={entry.id} name={entry.name} meta={`${inside.length} assets`}
              group={inside.slice(0, 4).map(asset => url(asset.thumb))} />
          );
        })}
      </AssetGrid>
    </CanvasSection>
  );

  const chosenFolder = !opened && !folder ? folders.find(entry => entry.id === chosen) : undefined;
  return (
    <Workspace
      sidebar={<SidebarList>
        <Nav aria-label="Brand groups">
          <SidebarAll tab="brand" count={total} current={!folder} />
          <NavGroup label="Groups">
            {folders.map(entry => (
              <NavItem key={entry.id} href={`#brand/${entry.id}`} current={entry.id === folder?.id} icon={<GridIcon />}
                onClick={event => { event.preventDefault(); openFolder(entry.id); }}
                trailing={<span className="studio-muted studio-brand__count">{byFolder.get(entry.id)?.length ?? 0}</span>}>
                {entry.name}
              </NavItem>
            ))}
          </NavGroup>
        </Nav>
      </SidebarList>}
      canvasLead={opened ? <>
        <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<ArrowLeftIcon />} aria-label={`Back to ${folder?.name ?? "Brand"}`} onClick={closeViewer} />
        {trail}
      </> : trail}
      canvasTitle={opened ? nameOf(opened) : folder?.name ?? "Brand"}
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
            {folder || searching ? <ViewSwitch value={mode} onChange={setMode} /> : null}
          </>}
        </ViewControls>
      }
      canvas={<div className="studio-brand">{body}</div>}
      inspector={
        <>
          <CanvasSettings axes={["type", "density"]} />
          {selected ? (
            <>
              <Selection preview={<Preview label={nameOf(selected)} paint={selected.color}><img className="studio-brand__preview" src={url(selected.thumb)} alt="" /></Preview>}>
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
                  ["Colour", <span className="studio-brand__colour"><ColorSwatch color={selected.color} size="sm" aria-hidden="true" /><Code>{selected.color}</Code></span>],
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
        </>
      }
    />
  );
}
