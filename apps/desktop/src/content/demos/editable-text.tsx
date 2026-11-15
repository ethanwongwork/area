/** EditableText gallery specimens: one variant per tile. docs/specs/editable-text.md. */
import { EditableText } from "@area/react";

const frame = { inlineSize: 240 };
/* A layer name is UI text (14/20); the component takes the font of where it sits. */
const ui = { fontSize: "var(--area-text-base-size)", lineHeight: "var(--area-text-base-leading)" };
const title = { margin: 0, fontSize: "var(--area-title-md-size)", lineHeight: "var(--area-title-md-leading)", fontWeight: "var(--area-weight-strong)" };

/* Figma's layer name: double-click to rename. */
export const GalleryEditableText = () => <EditableText style={ui} label="Label" defaultValue="Title" />;

export const GalleryEditableTextEditing = () => <EditableText style={ui} label="Label" defaultValue="Title" defaultEditing />;

/* Notion's title: a click places the caret. */
export const GalleryEditableTextClick = () => (
  <h2 style={title}><EditableText label="Label" activation="click" defaultValue="Title" /></h2>
);

export const GalleryEditableTextFill = () => (
  <div style={frame}><EditableText style={ui} label="Label" fill defaultValue="Title" /></div>
);

export const GalleryEditableTextPlaceholder = () => (
  <h2 style={title}><EditableText label="Label" activation="click" placeholder="Placeholder" /></h2>
);

/* A long title keeps one line and is cut at its end (editable-text.css); it said it wrapped and never did (F3.3). */
export const GalleryEditableTextLong = () => (
  <div style={frame}><EditableText style={ui} label="Label" fill defaultValue="Title long enough to be cut at the end of its line" /></div>
);

export const GalleryEditableTextDisabled = () => <EditableText style={ui} label="Label" defaultValue="Title" disabled />;
