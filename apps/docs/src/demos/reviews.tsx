/*
 * Pass reviews for this round of fixes (2026-09-27). Each GalleryReview<Name> renders above its
 * family's tiles: every change in its own row with its basis, before and after, at 1x and 3x.
 * "Before" restores the previous values through private properties or the previous markup.
 * Remove a review once the owner has seen it.
 */
import type { CSSProperties } from "react";
import { Alert, Badge, Button, Card, CardContent, CardDescription, CardMedia, CardTitle, Slider, Table } from "@area/react";
import { InfoIcon } from "../icons.tsx";
import { ReviewPair } from "./review.tsx";

const stack = { display: "grid", gap: "var(--area-space-32)" } as CSSProperties;

/* --- Table ------------------------------------------------------------------ */
const rows = ["Item one", "Item two"];
const sample = <><thead><tr><th scope="col">Name</th><th scope="col">Status</th></tr></thead>
  <tbody>{rows.map(row => <tr key={row}><td>{row}</td><td><Badge dot tone="success">Status</Badge></td></tr>)}</tbody></>;
export const GalleryReviewTable = () => (
  <div style={stack}>
    <ReviewPair title="Large and interactive tables: one edge, not two"
      basis="The two gallery tiles wrapped a Table, which already draws its own framed wrapper, in a second wrapper, so the edge drew twice (2px, two rounded rings). Measured: every other table tile has one 1px #e2 edge."
      before={<div className="area-table-wrapper" style={{ inlineSize: 240 }}><Table size="lg" aria-label="Before">{sample}</Table></div>}
      after={<div style={{ inlineSize: 240 }}><Table size="lg" aria-label="After">{sample}</Table></div>} />
  </div>
);

/* --- Card ------------------------------------------------------------------- */
const previousCard = { "--_card-edge": "var(--area-border-divider)", "--_card-shadow": "var(--area-shadow-1)" } as CSSProperties;
const card = (style?: CSSProperties, art?: string, weight?: number) => (
  <Card style={{ inlineSize: 200, ...style }}>
    <CardMedia aria-hidden="true" style={{ aspectRatio: "16 / 9", ...(art ? { background: art } : {}) }} />
    <CardContent><CardTitle style={weight ? { fontWeight: weight } : undefined}>Title</CardTitle><CardDescription>Description</CardDescription></CardContent>
  </Card>
);
export const GalleryReviewCard = () => (
  <div style={stack}>
    <ReviewPair title="Neutral 25 media, a lighter edge and a faint shadow"
      basis="Owner: every image fill is neutral 25 (#fa); a lighter stroke with a very soft drop shadow (reference: Figma 0 0 8 0 at 2%). Edge #e2 → #ee; shadow-1 → 0 1px 2px −1px and 0 2px 8px, both 3% black; gradient placeholders removed."
      before={card(previousCard, "linear-gradient(180deg, var(--area-blue-400), var(--area-neutral-25))", 400)}
      after={card()} scale={2} />
    <ReviewPair title="Titles take the strong weight and their role's tracking"
      basis="Type pass: every surface title is strong (500); size says which surface. Card titles also take their role's letter-spacing (lg: −0.01em), which they had skipped."
      before={card(undefined, undefined, 400)} after={card()} scale={2} />
  </div>
);

/* --- Chip ------------------------------------------------------------------- */
/* Static markup so the remove button can show its hover plate (the [data-hover] hook). */
const dismiss = <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" focusable="false" aria-hidden="true"><path d="m2.59 2.72.06-.07a.5.5 0 0 1 .63-.06l.07.06L8 7.29l4.65-4.64a.5.5 0 0 1 .7.7L8.71 8l4.64 4.65c.18.17.2.44.06.63l-.06.07a.5.5 0 0 1-.63.06l-.07-.06L8 8.71l-4.65 4.64a.5.5 0 0 1-.7-.7L7.29 8 2.65 3.35a.5.5 0 0 1-.06-.63l.06-.07z" /></svg>;
const chip = (size: "sm" | "md" | "lg", hover: boolean, style?: CSSProperties, invalid = false) => (
  <span className={`area-chip area-chip--filter area-chip--${size} area-chip--neutral`} data-invalid={invalid ? "" : undefined} style={style}>
    <span className="area-chip__action"><span className="area-chip__label">Chip</span></span>
    <button type="button" className="area-chip__remove" aria-label="Remove" tabIndex={-1} data-hover={hover ? "" : undefined}>{dismiss}</button>
  </span>
);
const previousRemove = { "--_remove": "var(--_dot)" } as CSSProperties;
const chips = (style?: CSSProperties) => <>{(["sm", "md", "lg"] as const).map(size => <span key={size} style={{ display: "contents" }}>{chip(size, true, style)}</span>)}{chip("md", true, style, true)}</>;
export const GalleryReviewChip = () => (
  <div style={stack}>
    <ReviewPair title="Remove: a circle concentric with the pill, holding the glyph (hovered)"
      basis="The 16px × filled its own 16px plate, so the hover circle hugged the glyph and sat 7 from a 16 radius end. Now the target is a circle 4 inside the pill (20 / 24 / 32 at sm / md / lg), concentric with its end, with the 16px glyph inside: Material puts a 24 circle in a 32 chip; Primer, Carbon and Spectrum 2 make the circle the chip's height; the glyph is half to three quarters of it (Primer 16 in 24). ChatGPT's tool pill washes the whole pill at 5% and swaps its icon for the × (chatgpt--composer-tool-pill, hover). The plate stays 12% of the chip's ink, as Alert's dismiss."
      before={chips(previousRemove)} after={chips()} />
  </div>
);

/* --- Alert ------------------------------------------------------------------ */
const previousAlert = { "--_alert-pad-block": "var(--area-space-8)", "--_alert-pad-inline": "var(--area-space-8)", "--_alert-control-block": "initial", "--_alert-control-end": "initial", "--_alert-icon-start": "var(--area-space-4)", minBlockSize: "calc(var(--area-control-sm) + var(--area-space-16) + 2 * var(--area-border-width))" } as CSSProperties;
const alerts = (style?: CSSProperties) => (
  <div style={{ display: "grid", gap: "var(--area-space-12)", inlineSize: 320 }}>
    <Alert icon={<InfoIcon />} title="Title" onDismiss={() => {}} style={style}>Body text</Alert>
    <Alert tone="info" icon={<InfoIcon />} title="Title" action={<Button size="sm">Action</Button>} style={style}>Body text</Alert>
    <Alert layout="multiline" icon={<InfoIcon />} title="Title" onDismiss={() => {}} action={<Button size="sm" variant="outline">Action</Button>} style={style}>Body text that wraps onto a second line</Alert>
  </div>
);
export const GalleryReviewAlert = () => (
  <div style={stack}>
    <ReviewPair title="Toast's inset: 40 tall, text 12 in, controls 6 from the corner"
      basis="Alert and Toast are peers; Toast's pass set 10 / 12 padding, a 40px line and 28px controls 6 from the top and side (concentric: 12 − 6 = 6). Alert padded 8 all round (46 tall), with its dismiss 9 in. Sources: Notion's callout pads 13 with its icon on the first line (notion--callout); Primer, Fluent, shadcn and Carbon pad 12–16 and centre a 16–20 icon on the first line; titles one weight up, bodies neutral."
      before={alerts(previousAlert)} after={alerts()} scale={2} />
  </div>
);

/* --- Slider ----------------------------------------------------------------- */
/* The hovered paint, set through the private properties hover uses. */
const hovered = { "--_fill": "var(--_fill-hover)" } as CSSProperties;
const previousHover = { ...hovered, "--_track-fill": "color-mix(in srgb, var(--area-fill-toggle-hover), var(--area-bg-surface) 20%)" } as CSSProperties;
export const GalleryReviewSlider = () => (
  <div style={stack}>
    <ReviewPair title="Hover darkens the fill and the thumb, not the rail (hovered)"
      basis="Hover darkened the whole rail as well. Fluent changes only the thumb and fill colour; Radix and Base UI change nothing on hover; none darkens the rail. Kept after checking against Radix, Fluent, Material, Base UI, shadcn and Carbon: the 16 / 16 / 20 round thumb on a 4px rail (sources: 16–20 on 4–6), the fill in the neutral or accent role, and the focus ring set off by a gap."
      before={<div style={{ inlineSize: 200 }}><Slider aria-label="Before" defaultValue={60} style={previousHover} /></div>}
      after={<div style={{ inlineSize: 200 }}><Slider aria-label="After" defaultValue={60} style={hovered} /></div>} />
  </div>
);
