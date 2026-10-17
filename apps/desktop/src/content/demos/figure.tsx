/** Figure gallery specimens: one variant per tile. docs/specs/figure.md. */
import { Card, Figure } from "@area/react";

const photo = <img src="images/david-tee.jpg" alt="David Tee at the studio" width={220} height={220} style={{ objectFit: "cover" }} />;

export const GalleryFigure = () => <Figure caption="David Tee at the studio, 2025.">{photo}</Figure>;
/* Wikipedia's thumbnail frame. */
export const GalleryFigureFramed = () => <Figure frame="framed" caption="David Tee at the studio, 2025.">{photo}</Figure>;
/* A caption long enough to wrap keeps to the image's width. */
export const GalleryFigureLongCaption = () => <Figure caption="David Tee presenting the studio's type specimens at a design systems conference in 2025.">{photo}</Figure>;
/* Beside running text, floated to the end: an article in a Card. */
export const GalleryFigureAlignEnd = () => (
  <Card style={{ inlineSize: "calc(var(--area-space-96) * 6)", display: "block" }}>
    <Figure align="end" frame="framed" caption="David Tee, 2025."><img src="images/david-tee.jpg" alt="David Tee" width={120} height={120} style={{ objectFit: "cover" }} /></Figure>
    <p style={{ margin: 0 }}>David Tee studied industrial design before moving to interface work. The studio's projects ran from type to hardware, and each one began with a measured study of what people already used.</p>
  </Card>
);
