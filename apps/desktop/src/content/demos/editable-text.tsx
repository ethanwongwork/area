/** EditableText gallery specimens: one variant per tile. docs/specs/editable-text.md. */
import { EditableText } from "@area/react";

const frame = { inlineSize: 240 };
/* A layer name is UI text (14/20); the component takes the font of where it sits. */
const ui = { fontSize: "var(--area-text-sm-size)", lineHeight: "var(--area-text-sm-leading)" };
const title = { margin: 0, fontSize: "var(--area-title-md-size)", lineHeight: "var(--area-title-md-leading)", fontWeight: "var(--area-weight-strong)" };

/* Figma's layer name: double-click to rename. */
export const GalleryEditableText = () => <EditableText style={ui} label="Layer name" defaultValue="Header" />;

export const GalleryEditableTextEditing = () => <EditableText style={ui} label="Layer name" defaultValue="Header" defaultEditing />;

/* Notion's title: a click places the caret. */
export const GalleryEditableTextClick = () => (
  <h2 style={title}><EditableText label="Page title" activation="click" defaultValue="Launch plan" /></h2>
);

export const GalleryEditableTextFill = () => (
  <div style={frame}><EditableText style={ui} label="Layer name" fill defaultValue="Navigation bar" /></div>
);

export const GalleryEditableTextPlaceholder = () => (
  <h2 style={title}><EditableText label="Page title" activation="click" placeholder="Untitled" /></h2>
);

export const GalleryEditableTextLong = () => (
  <div style={frame}><EditableText style={ui} label="Layer name" fill defaultValue="Onboarding checklist, step three: invite your team" /></div>
);

export const GalleryEditableTextDisabled = () => <EditableText style={ui} label="Layer name" defaultValue="Header" disabled />;
