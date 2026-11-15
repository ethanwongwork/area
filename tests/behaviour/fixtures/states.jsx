// States fixture: disabled, read-only and inactive (plan B7.8, B7.9, B7.10, B7.12). The query picks the page:
//   ?mode=read-only  every family with a read-only form, holding a value, between two buttons, inside one <form>
//   ?mode=disabled   the same families disabled, between two buttons
//   ?mode=paint&…    the paint grid: each ground (page, raised, recessed, float, card, well, toned, solid) holding the
//                    disabled, read-only and editable fields, disabled Buttons in every tone and variant, and an
//                    inactive Menu row; the other keys are theme attributes set on <html> (theme, layers-light,
//                    layers-dark, stroke, stroke-fields, radius, tone-contrast, tone-tint, accent, action, contrast).
// Each family sits in <div data-family="<slug>">; each paint cell in [data-ground] [data-cell].
import { createRoot } from "react-dom/client";
import {
  Input, Textarea, NumberField, OTPField, TagPicker, CustomSelect, DatePicker, TimeField, Switch, Checkbox, RadioGroup, Radio,
  Button, MenuItem, SettingRow,
} from "@area/react";
import "@area/styles/area.css";

const query = new URLSearchParams(location.search);
const mode = query.get("mode") || "read-only";
for (const [key, value] of query) if (key !== "mode") document.documentElement.setAttribute(`data-area-${key}`, value);

const COLORS = ["Amber", "Blue", "Green"].map(l => ({ value: l.toLowerCase(), label: l }));
const TAGS = [{ value: "design", label: "Design" }, { value: "code", label: "Code" }];

// slug → (props) => element, each holding a value.
const FAMILIES = {
  "input": p => <Input aria-label="Input" defaultValue="Draft" {...p} />,
  "textarea": p => <Textarea aria-label="Textarea" defaultValue="Notes" rows={2} {...p} />,
  "number-field": p => <NumberField aria-label="Number" defaultValue={4} {...p} />,
  "otp-field": p => <OTPField aria-label="Code" length={4} defaultValue="1234" {...p} />,
  "tag-picker": p => <TagPicker aria-label="Tags" items={TAGS} defaultValue={["design"]} {...p} />,
  "custom-select": p => <CustomSelect aria-label="Custom select" items={COLORS} defaultValue="blue" {...p} />,
  "date-picker": p => <DatePicker aria-label="Date" today="2026-11-11" defaultValue="2026-11-11" {...p} />,
  "time-field": p => <TimeField aria-label="Time" hourCycle={24} defaultValue="09:30" {...p} />,
  "switch": p => <Switch label="Switch" defaultChecked {...p} />,
  "checkbox": p => <Checkbox label="Checkbox" defaultChecked {...p} />,
  "checkbox-card": p => <Checkbox variant="surface" label="Card" defaultChecked {...p} />,
  "radio-group": p => <RadioGroup label="Radio" defaultValue="two" {...p}><Radio value="one" label="One" /><Radio value="two" label="Two" /></RadioGroup>,
};
window.__families = Object.keys(FAMILIES);

const TONES = ["neutral", "info", "success", "warning", "caution", "danger", "discovery"];
const VARIANTS = ["solid", "soft", "outline", "ghost"];
// Each ground: what paints it and the ground hook its controls read (layers.css).
const GROUNDS = {
  page: { ground: "page", style: { background: "var(--area-bg-page)" } },
  raised: { ground: "raised", style: { background: "var(--area-bg-surface)" } },
  recessed: { ground: "recessed", style: { background: "var(--area-bg-subtle)" } },
  float: { ground: "float", style: { background: "var(--area-bg-float)" } },
  card: { ground: "card", style: { background: "var(--area-bg-card, var(--area-bg-surface))" } },
  well: { ground: "well", style: { background: "var(--area-bg-well, var(--area-bg-subtle))" } },
  plate: { ground: null, style: { background: "var(--area-bg-plate)" } },
  toned: { ground: null, style: { background: "var(--area-danger-surface)" } },
  solid: { ground: null, style: { background: "var(--area-action-solid)", color: "var(--area-fg-on-action)" } },
};

function Paint() {
  return Object.entries(GROUNDS).map(([name, g]) =>
    <section key={name} data-ground={name} {...(g.ground ? { "data-area-ground": g.ground } : {})} style={{ ...g.style, padding: 12, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
      {["outline", "soft"].map(variant => <span key={variant} style={{ display: "contents" }}>
        <span data-cell={`field-${variant}-edit`}><Input aria-label="Edit" variant={variant} defaultValue="Value" /></span>
        <span data-cell={`field-${variant}-read-only`}><Input aria-label="Read" variant={variant} defaultValue="Value" readOnly /></span>
        <span data-cell={`field-${variant}-disabled`}><Input aria-label="Off" variant={variant} defaultValue="Value" disabled /></span>
      </span>)}
      <span data-cell="picker-ghost-edit"><CustomSelect aria-label="Edit" variant="ghost" items={COLORS} defaultValue="blue" /></span>
      <span data-cell="picker-ghost-read-only"><CustomSelect aria-label="Read" variant="ghost" items={COLORS} defaultValue="blue" readOnly /></span>
      {TONES.flatMap(tone => VARIANTS.map(variant =>
        <span key={tone + variant} data-cell={`button-${tone}-${variant}`}><Button tone={tone} variant={variant} disabled>Send</Button></span>))}
      <span data-cell="menu-inactive" className="area-menu" role="menu" style={{ position: "static", display: "block" }}>
        <MenuItem inactive inactiveText="Upgrade to export">Export</MenuItem>
      </span>
      <span data-cell="setting-disabled" style={{ inlineSize: 480 }}>
        <SettingRow label="Sync" description="Only on the team plan" disabled><Switch aria-label="Sync" disabled /></SettingRow>
      </span>
      <span data-cell="checkbox-card-read-only"><Checkbox variant="surface" label="Card" defaultChecked readOnly /></span>
    </section>);
}

function App() {
  if (mode === "paint") return <Paint />;
  const props = mode === "disabled" ? { disabled: true } : { readOnly: true };
  return <form id="f" onSubmit={e => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16 }}>
    {Object.entries(FAMILIES).map(([slug, make]) =>
      <div key={slug} style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Button type="button" id={`before-${slug}`}>Before</Button>
        <div data-family={slug}>{make({ name: slug, ...props })}</div>
        <Button type="button" id={`after-${slug}`}>After</Button>
      </div>)}
  </form>;
}

createRoot(document.getElementById("root")).render(<App />);
requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; }));
