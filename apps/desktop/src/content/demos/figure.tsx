/** Figure gallery specimens: one variant per tile. docs/specs/figure.md. */
import { Figure } from "@area/react";

const image = <img src="images/david-tee.jpg" alt="Placeholder image" width={220} height={220} style={{ objectFit: "cover" }} />;

export const GalleryFigure = () => <Figure caption="Caption">{image}</Figure>;
/* The media alone. */
export const GalleryFigureNoCaption = () => <Figure>{image}</Figure>;
/* A long caption wraps to the media's width. */
export const GalleryFigureLongCaption = () => <Figure caption="Caption that wraps onto a second line">{image}</Figure>;
