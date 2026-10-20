/**
 * Abstract board (owner, 2026-10-19): the 26 interface pieces in the owner's Pinterest board oval / abstract, each
 * rebuilt as an image ("treat these images as images, using area components and reconstructing the exact visual that
 * is being referenced with area design principles ... not everything has to be a component or variant"). Each piece
 * is a scene (abstract/scene.tsx): the reference's frame at the zoom where its controls land on Area's sizes, built
 * from Area's components under scoped Area settings, with drawings where the reference shows a picture. GAPS name what
 * Area itself lacks, not variants to add; the Testing tab lists them and the review page shows them beside the
 * reference.
 */
import type { ReactNode } from "react";
import { S01, S02, S03, S04, S05, S06, S07, S08, S09 } from "./abstract/scenes-a.tsx";
import { S10, S11, S12, S13, S14, S15, S16, S17, S18 } from "./abstract/scenes-b.tsx";
import { S19, S20, S21, S23, S24, S25, S26, S27 } from "./abstract/scenes-c.tsx";

export interface BoardPiece { id: string; title: string; Piece: () => ReactNode; gaps: string[]; wide?: boolean }
export const ABSTRACT_BOARD: BoardPiece[] = [
  { id: "01", title: "Typography panel", Piece: S01, gaps: ["The case choice (AA · Aa · aa) is a field shell: a Segmented would add the track and thumb the shot does not have.", "The colour well is a swatch bar in a field shell; ColorField always shows its hex."] },
  { id: "02", title: "Chat sidebar", Piece: S02, gaps: [] },
  { id: "03", title: "Auto layout", Piece: S03, gaps: ["Fill and Hug are static suffixes: a size field has no resizing menu.", "The padding diagram is drawn (badges on a box); Box model is a read-out, not an editor."] },
  { id: "04", title: "Delivery card", Piece: S04, gaps: ["The parcel and conveyor are drawn for the scene: Area has no illustration set.", "The clock action is placed on the media by the scene; Card has no media-action slot."] },
  { id: "05", title: "Event chips", Piece: S05, gaps: [] },
  { id: "06", title: "Document cards", Piece: S06, gaps: ["\"89+\" is text: Count shows a cap as one below it (\"88+\")."] },
  { id: "07", title: "Small form", Piece: S07, gaps: ["The − 0 + counter is two ghost buttons in a field shell; Number field's steppers stack at its end."] },
  { id: "08", title: "Table footer", Piece: S08, gaps: ["\"Show 30\" is a button with a chevron: Pagination has no page-size slot."] },
  { id: "09", title: "Pagination set", Piece: S09, gaps: ["The pill tracks are composed from pill buttons: Pagination draws no track of its own."] },
  { id: "10", title: "Box model", Piece: S10, gaps: ["Drawn from Area's tokens and badges: Box model's own read-out labels its rings and uses one measuring tone.", "Pink for the vertical margins comes from Area's pink ramp; Area's measuring tone is the info blue alone."] },
  { id: "11", title: "Corner radius", Piece: S11, gaps: ["The corner preview (the shape with each radius as a disc) is drawn: Area has no corner editor.", "Mixed, with its icon on the selection tint, is a field shell rather than a Select."] },
  { id: "12", title: "Appearance dialog", Piece: S12, gaps: ["The gold restates Area's surface roles inside the dialog: Area has no hue-tinted ground or material colour.", "Theme previews are drawn windows: there is no theme-preview radio card."] },
  { id: "13", title: "Location card", Piece: S13, gaps: ["The map is drawn from the shot's traced coastline: Area has no map.", "The frosted caption band is a scene effect (a backdrop blur), not a Card part."] },
  { id: "14", title: "Note menu", Piece: S14, gaps: ["The glass bar and menu are painted by the scene: Material's glass reaches Area's own surfaces, not a free panel over a photo.", "Rows with a trailing icon are composed: MenuItem puts its icon first and its shortcut slot holds text."] },
  { id: "15", title: "Week and events", Piece: S15, gaps: ["No week strip: weekday letters, date buttons and event dots are composed.", "No agenda list: the events are drawn rows."] },
  { id: "16", title: "Window controls", Piece: S16, gaps: ["No window controls: solid tone buttons on a Jelly pill stand in (Titlebar leaves room for the system's).", "The glyphs' darker ink and each light's glow are scene styling."] },
  { id: "17", title: "To-do list", Piece: S17, wide: true, gaps: ["No won't-do (crossed) checkbox state: the box is drawn.", "No task row with dates and actions: rows are composed.", "The shot's text is about 9px; Area stops at 12, so labels run longer than the shot's."] },
  { id: "18", title: "Add to calendar", Piece: S18, gaps: ["The large embossed action is drawn at the shot's scale as one hero element (a larger button size would not earn a variant).", "The glassy calendar is drawn: Area's icons are line drawings."] },
  { id: "19", title: "Comment composer", Piece: S19, gaps: ["The composer's well and resize grip are drawn: Composer lays its actions out in its own footer row."] },
  { id: "20", title: "Dock", Piece: S20, gaps: ["No dock and no magnification motion: the tiles are drawn."] },
  { id: "21", title: "Page style", Piece: S21, gaps: ["No picture radio cards (cover choices, background tiles): drawn with Area's tokens.", "The small-caps section labels are a scene style: Area has no eyebrow text role."] },
  { id: "23", title: "Layout picker", Piece: S23, gaps: ["No layout-thumbnail radio card: the wireframes are drawn."] },
  { id: "24", title: "Product sidebar", Piece: S24, gaps: [] },
  { id: "25", title: "Spreadsheet", Piece: S25, gaps: ["No spreadsheet: a small Table with row numbers stands in (no cell selection or column resizing).", "No formula bar: the cell reference and fx are drawn."] },
  { id: "26", title: "Create menu", Piece: S26, gaps: [] },
  { id: "27", title: "Copy and Build", Piece: S27, gaps: [] },
];

/** The board on one Canvas: each piece alone in its own frame, isolated, as the review page shows it. */
export function AbstractBoard() {
  return (
    <div className="ab-board">
      {ABSTRACT_BOARD.map(({ id, Piece, wide }) => (
        <section key={id} className={wide ? "ab-frame ab-frame--wide" : "ab-frame"} data-piece={id} aria-label={`Piece ${id}`}><Piece /></section>
      ))}
    </div>
  );
}
