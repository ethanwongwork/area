/**
 * A sheet of glyphs: Icons' wall (src/pages/icons.tsx) and a typeface's Glyphs tab (src/pages/typography.tsx), one
 * component for both (owner, 2026-10-31: "showing all the glyphs in each typeface in a similar manner to the icons ...
 * infrastructure and ui ... that supports both"). Styles: styles/glyphs.css.
 *
 * In the grid the cells are one ListBox (docs/specs/list-box.md): a single Tab stop, the arrows move across the sheets in
 * reading order and to the nearest cell above or below, typing jumps to a name, and selection follows focus so the
 * Inspector shows what the keys are on. Sections (CanvasSection, role "group") are its groups. The list view is a Table,
 * so `grid` false gives a plain wrapper that still sets the size.
 *
 * Resting on a cell opens an Area Hover card under it (owner, 2026-10-12, after Cursor's icon gallery; Font Book's
 * popover for a character): the name and its meta, the glyph large, then the actions. Pointer only: the arrows sweep the
 * sheet, and the Inspector already shows the name and actions for the cell the keys are on. The card's rows are built
 * only while it is open, so a sheet of thousands of cells carries one empty surface each.
 */
import { useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { HoverCard, ListBox, ListBoxItem } from "@area/react";
import { Specimen } from "./specimen-scope.tsx";

export function GlyphSheet({ grid, label, value, onChoose, onOpen, size, children }: {
  grid: boolean; label: string; value: string | null; onChoose: (value: string) => void;
  /** Enter, or a double-click on a cell, opens the cell chosen (Finder's and Figma's open); with ⌘, in a tab of its own. */
  onOpen?: (value: string, newTab: boolean) => void;
  size: number; children: ReactNode;
}) {
  const style = { "--_size": `${size}px` } as CSSProperties;
  const opening = onOpen ? {
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => { if (event.key === "Enter" && value) { event.preventDefault(); onOpen(value, event.metaKey || event.ctrlKey); } },
    onDoubleClick: (event: MouseEvent<HTMLDivElement>) => { const cell = (event.target as Element).closest<HTMLElement>("[data-key]"); if (cell?.dataset.key) onOpen(cell.dataset.key, event.metaKey || event.ctrlKey); },
  } : {};
  return grid
    ? <ListBox layout="grid" aria-label={label} value={value} onValueChange={onChoose} selectionFollowsFocus className="studio-glyphs studio-sections" style={style} {...opening}>{children}</ListBox>
    : <div className="studio-glyphs studio-sections" style={style}>{children}</div>;
}

/** A section's cells, laid out as the sheet's grid. */
export function GlyphGrid({ children }: { children: ReactNode }) {
  return <div className="studio-glyphs__sheet">{children}</div>;
}

/** What the hover window shows, built only while it is open. */
export interface GlyphCard {
  name: ReactNode;
  meta?: ReactNode;
  /** The glyph large: an icon at 96, a character at 96px in its face. */
  preview: ReactNode;
  /** A line under the preview (a character's code point and Unicode name). */
  detail?: ReactNode;
  actions?: ReactNode;
}

export function GlyphCell({ value, label, children, card, data, design }: {
  /** The ListBox option's value. */
  value: string;
  /** The accessible name, also what typing finds. */
  label: string;
  /** The glyph as the cell draws it. */
  children: ReactNode;
  card: () => GlyphCard;
  /** data-* hooks for the page (scrolling to the chosen cell). */
  data?: Record<string, string>;
  /** What the design viewer opens from this cell (src/morph.ts `data-design`), when the page opens its glyphs. */
  design?: string;
}) {
  const [open, setOpen] = useState(false);
  const content = open ? card() : null;
  return (
    <HoverCard side="bottom" align="center" delay={500} openOnFocus={false} open={open} onOpenChange={setOpen} className="studio-glyph-card" aria-label={label}
      trigger={
        <ListBoxItem value={value} textValue={label} className="studio-glyphs__cell" data-key={value} data-name={label} aria-label={label} {...data}>
          {/* The glyph is the specimen: it takes the Inspector's settings, its cell stays the app's (specimen-scope.tsx). */}
          <Specimen as="span" className="studio-glyphs__specimen" data-design={design}>{children}</Specimen>
        </ListBoxItem>
      }>
      {content ? <>
        <div className="studio-glyph-card__head">
          <span className="studio-glyph-card__name">{content.name}</span>
          {content.meta ? <span className="studio-glyph-card__meta">{content.meta}</span> : null}
        </div>
        <div className="studio-glyph-card__preview">{content.preview}</div>
        {content.detail ? <div className="studio-glyph-card__unicode">{content.detail}</div> : null}
        {content.actions ? <div className="studio-glyph-card__actions">{content.actions}</div> : null}
      </> : null}
    </HoverCard>
  );
}
