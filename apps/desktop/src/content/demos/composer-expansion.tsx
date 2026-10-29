/**
 * The composer expansion (docs/research/composer-expansion-2026-10-29): the header and footer rows around the shell,
 * dictation, picking and dropping files, and a model's effort. One variant per tile, then compositions in the shapes of
 * Cursor's Agents window and the Claude app's reply composer, and one combining parts of each, in placeholder copy.
 * Spec: docs/specs/composer.md.
 */
import { useState } from "react";
import { Composer, ComposerAttach, ComposerMic, ComposerNote, ModelPicker, PromptSuggestions, Tag } from "@area/react";
import { LaptopIcon, ShieldIcon, SparkleIcon } from "@area/icons";

const column = { inlineSize: "100%" };
const models = [{ value: "one", label: "Option one" }, { value: "two", label: "Option two" }];
const efforts = [{ value: "light", label: "Light" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }];
const Model = () => <ModelPicker label="Model" items={models} efforts={efforts} defaultEffort="medium" />;

// ---- One part per tile ----

/** A row above the shell: where the message runs. */
export const GalleryComposerHeader = () => (
  <div style={column}>
    <Composer layout="stacked" placeholder="Placeholder"
      header={<><ModelPicker size="sm" label="Label" items={[{ value: "one", label: "Option one" }, { value: "two", label: "Option two" }]} />
        <ModelPicker size="sm" label="Label" triggerProps={{ icon: <LaptopIcon /> }} items={[{ value: "three", label: "Option three" }, { value: "four", label: "Option four" }]} /></>}
      leadingActions={<ComposerAttach />} />
  </div>
);

/** A row under the shell: tools, a quiet note and the model. */
export const GalleryComposerFooter = () => (
  <div style={column}>
    <Composer placeholder="Placeholder"
      footer={<><ComposerAttach size="sm" /><ComposerMic size="sm" /><ComposerNote>Body text</ComposerNote><ModelPicker size="sm" label="Model" items={models} efforts={efforts} defaultEffort="medium" /></>} />
  </div>
);

/** Dictation: the mic before send, the waveform while it listens. */
export const GalleryComposerMic = () => <div style={column}><Composer placeholder="Placeholder" leadingActions={<ComposerAttach />} trailingActions={<ComposerMic />} /></div>;
export const GalleryComposerMicOn = () => <div style={column}><Composer placeholder="Placeholder" leadingActions={<ComposerAttach />} trailingActions={<ComposerMic defaultSelected />} /></div>;

/** Files dragged over the composer: File upload's drop paint. Drop or paste files, or pick them with the +. */
export const GalleryComposerDrop = () => {
  const [names, setNames] = useState<string[]>([]);
  return <div style={column}>
    <Composer layout="stacked" placeholder="Placeholder" data-dragging="" onFiles={files => setNames(files.map(file => file.name))}
      leadingActions={<ComposerAttach onFiles={files => setNames(files.map(file => file.name))} />} />
    <span className="area-sr-only" role="status">{names.length ? `Added ${names.join(", ")}` : ""}</span>
  </div>;
};

/** A model and how hard it works: the effort muted after the name, its own group in the menu. */
export const GalleryComposerEffort = () => <div style={column}><Composer layout="stacked" placeholder="Placeholder" leadingActions={<ComposerAttach />} mode={<Model />} /></div>;

// ---- Compositions ----

/** Cursor's shape, in Area's corner: selectors above, a mode tag and the model inside, a suggestion with its shortcut below. */
export const GalleryComposerAgent = () => {
  const [mode, setMode] = useState(true);
  return <div style={{ ...column, display: "grid", gap: "var(--area-space-8)" }}>
    <Composer layout="stacked" placeholder="Placeholder"
      header={<><ModelPicker size="sm" label="Label" items={[{ value: "one", label: "Option one" }, { value: "two", label: "Option two" }]} />
        <ModelPicker size="sm" label="Label" triggerProps={{ icon: <LaptopIcon /> }} items={[{ value: "three", label: "Option three" }]} /></>}
      leadingActions={<><ComposerAttach />{mode ? <Tag tone="discovery" icon={<SparkleIcon size={12} />} onRemove={() => setMode(false)}>Label</Tag> : null}</>}
      mode={<Model />} trailingActions={<ComposerMic />} />
    <PromptSuggestions layout="chips" items={[{ id: "one", label: "Item one", shortcut: ["Shift", "Tab"] }]} />
  </div>;
};

/** The Claude app's shape: a one-line field, its tools, a note and the model in a row under it. */
export const GalleryComposerReply = () => (
  <div style={column}>
    <Composer placeholder="Placeholder"
      footer={<><ComposerAttach size="sm" /><ComposerMic size="sm" /><ComposerNote>Body text</ComposerNote>
        <ModelPicker size="sm" label="Model" items={models} efforts={efforts} defaultEffort="medium" />
        <ModelPicker size="sm" label="Label" items={[{ value: "one", label: "Label" }, { value: "two", label: "Option two" }]} /></>} />
  </div>
);

/**
 * Parts of each, combined in Area's own shape: Cursor's selectors above and its mode Tag; Codex's and the Claude app's
 * permission menu; the model with its effort and the mic from all three; the Claude app's quiet note in the footer.
 */
export const GalleryComposerCombined = () => {
  const [mode, setMode] = useState(true);
  return <div style={column}>
    <Composer layout="stacked" placeholder="Placeholder"
      header={<><ModelPicker size="sm" label="Label" items={[{ value: "one", label: "Option one" }, { value: "two", label: "Option two" }]} />
        <ModelPicker size="sm" label="Label" triggerProps={{ icon: <LaptopIcon /> }} items={[{ value: "three", label: "Option three" }]} /></>}
      leadingActions={<><ComposerAttach />{mode ? <Tag tone="discovery" icon={<SparkleIcon size={12} />} onRemove={() => setMode(false)}>Label</Tag> : null}
        <ModelPicker label="Label" triggerProps={{ icon: <ShieldIcon /> }} items={[{ value: "one", label: "Label" }, { value: "two", label: "Option two" }]} /></>}
      mode={<Model />} trailingActions={<ComposerMic />}
      footer={<ComposerNote>Body text</ComposerNote>} />
  </div>;
};

// ---- Model picker ----

/** A model and its effort on one trigger: "Option one Medium", the effort muted. */
export const GalleryModelPickerEffort = () => <Model />;

// ---- Prompt suggestions ----

/** A suggestion with the keys that choose it (Cursor's "Plan New Idea ⇧Tab"). */
export const GalleryPromptSuggestionsShortcut = () => <PromptSuggestions layout="chips" items={[{ id: "one", label: "Item one", shortcut: ["Shift", "Tab"] }]} />;
