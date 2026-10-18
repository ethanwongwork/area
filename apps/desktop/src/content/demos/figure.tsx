/** Figure gallery specimens: one variant per tile. docs/specs/figure.md. */
import { Card, Figure } from "@area/react";

const photo = <img src="images/david-tee.jpg" alt="David Tee" width={220} height={220} style={{ objectFit: "cover" }} />;

export const GalleryFigure = () => <Figure caption="Caption">{photo}</Figure>;
/* Wikipedia's thumbnail frame. */
export const GalleryFigureFramed = () => <Figure frame="framed" caption="Caption">{photo}</Figure>;
/* A caption long enough to wrap keeps to the image's width. */
export const GalleryFigureLongCaption = () => <Figure caption="Caption that wraps onto a second line">{photo}</Figure>;
/* Beside running text, floated to the end: an article in a Card. */
export const GalleryFigureAlignEnd = () => (
  <Card style={{ inlineSize: "calc(var(--area-space-96) * 6)", display: "block" }}>
    <Figure align="end" frame="framed" caption="Caption"><img src="images/david-tee.jpg" alt="David Tee" width={120} height={120} style={{ objectFit: "cover" }} /></Figure>
    <p style={{ margin: 0 }}>Body text that wraps around the figure. Body text that continues the paragraph. Body text that continues the paragraph. Body text that continues the paragraph.</p>
  </Card>
);
