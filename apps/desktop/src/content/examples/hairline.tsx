/**
 * Hairline (trial, owner 2026-10-24): Lucas Marques's isometric line figures (@lucasmarkes/hairline 0.5.1, MIT), above
 * Area's Empty state, to see whether a figure that answers the pointer belongs in Area's empty states. Each figure is one
 * the package draws as an object holding nothing: a drawer, a basket, a chart of flat tabs, a loupe on a blank sheet,
 * bare sieves, bare hangers. Empty state has no figure slot (its icon slot is a 16 glyph), so the figure sits above it.
 *
 * Hairline reads six custom properties (README, "Theme"); here they are Area's tokens, so a figure follows the Canvas's
 * Neutral, Tint, Ground and light / dark like any component. The greys are the body ink mixed toward the page at
 * Hairline's own steps (light #a4 / #c3 / #e0, dark #5b / #3e / #29 on its grounds); the plate is the ground the figure
 * sits on; the stroke is the icon weight. The lit stroke is the ink, or the Selected stroke's accent.
 */
import { useState, type CSSProperties } from "react";
import { Button, EmptyState, Segmented } from "@area/react";
import { Basket, Drawer, Loupe, Plot, Rail, Sieve } from "@lucasmarkes/hairline/react";

const FIGURES: Array<{ id: string; Figure: typeof Drawer }> = [
  { id: "drawer", Figure: Drawer },
  { id: "basket", Figure: Basket },
  { id: "plot", Figure: Plot },
  { id: "loupe", Figure: Loupe },
  { id: "sieve", Figure: Sieve },
  { id: "rail", Figure: Rail },
];

export function HairlineScreen() {
  const [lit, setLit] = useState<"ink" | "accent">("ink");
  return (
    <div className="ex-hl" style={{ "--_hl-hi": lit === "accent" ? "var(--area-stroke-selected)" : "var(--area-fg-default)" } as CSSProperties}>
      <div className="ex-hl__head">
        <Segmented size="sm" aria-label="Lit stroke" value={lit} onValueChange={next => setLit(next as "ink" | "accent")}
          items={[{ value: "ink", label: "Ink" }, { value: "accent", label: "Accent" }]} />
      </div>
      <div className="ex-hl__grid">
        {FIGURES.map(({ id, Figure }) => (
          <section key={id} className="ex-hl__card">
            <Figure aria-hidden className="ex-hl__figure" />
            <EmptyState title="Title" description="Description" actions={<Button variant="outline" tone="neutral" size="sm">Action</Button>} titleAs="h3" />
          </section>
        ))}
      </div>
    </div>
  );
}
