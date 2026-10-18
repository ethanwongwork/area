/** Search field gallery specimens: one variant per tile. docs/specs/search-field.md. */
import { useState } from "react";
import { SearchField } from "@area/react";

export const GallerySearchField = () => <SearchField aria-label="Search" />;
/* With a query: the clear action ends the field. */
export const GallerySearchFieldFilled = () => <SearchField aria-label="Search" defaultValue="Value" />;
export const GallerySearchFieldSoft = () => <SearchField variant="soft" aria-label="Search" />;
export const GallerySearchFieldSm = () => <SearchField size="sm" aria-label="Search" defaultValue="Value" />;
export const GallerySearchFieldMd = () => <SearchField size="md" aria-label="Search" defaultValue="Value" />;
export const GallerySearchFieldLg = () => <SearchField size="lg" aria-label="Search" defaultValue="Value" />;
/* Notion's sidebar search: the shortcut that focuses the field, while it is empty. */
export const GallerySearchFieldShortcut = () => <SearchField aria-label="Search" placeholder="Search" shortcut={["cmd", "K"]} />;
export const GallerySearchFieldLoading = () => <SearchField aria-label="Search" defaultValue="Value" loading loadingText="Searching" />;
export const GallerySearchFieldDisabled = () => <SearchField aria-label="Search" disabled />;

const PAGES = ["Item one", "Item two", "Item three", "Item four", "Item five", "Item six"];

/* Filters a list as you type; Escape or the clear action brings every row back. */
export const GallerySearchFieldFilter = () => {
  const [query, setQuery] = useState("");
  const matches = PAGES.filter(page => page.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  return (
    <div style={{ display: "grid", gap: "var(--area-space-8)", inlineSize: "var(--area-input-inline-size)", maxInlineSize: "100%" }}>
      <SearchField aria-label="Search" placeholder="Search" value={query} onValueChange={setQuery} aria-controls="search-field-demo-results" />
      <ul id="search-field-demo-results" aria-live="polite" style={{ margin: 0, padding: 0, listStyle: "none", color: "var(--area-fg-default)", fontSize: "var(--area-ui-size)", lineHeight: "var(--area-ui-leading)" }}>
        {matches.length ? matches.map(page => <li key={page} style={{ paddingInline: "var(--area-space-8)" }}>{page}</li>)
          : <li style={{ paddingInline: "var(--area-space-8)", color: "var(--area-fg-muted)" }}>No results</li>}
      </ul>
    </div>
  );
};
