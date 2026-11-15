// Forms fixture: every family that takes a `name`, inside a <form>. The query picks the page:
//   ?mode=values    one form, each family with a default value (name and value, reset)
//   ?mode=required  one form per family, required and empty (does required block submit?)
//   ?mode=filled    one form per family, required and holding its default value (it submits)
//   ?mode=disabled  one form, each family disabled with a value (disabled controls submit nothing)
// Each family sits in <div data-family="<slug>">. window.__submits counts submit events per form id.
import { createRoot } from "react-dom/client";
import {
  Input, Textarea, PasswordField, SearchField, NumberField, ColorField, OTPField, Select, Checkbox, Switch, RadioGroup, Radio,
  Slider, SliderRange, Segmented, ToggleGroup, ToggleGroupItem, ColorSwatchPicker, AlignmentPicker, CustomSelect, Combobox,
  TagPicker, DatePicker, DateRangePicker, TimeField, BoxField, Calendar, Button,
} from "@area/react";
import "@area/styles/area.css";

const mode = new URLSearchParams(location.search).get("mode") || "values";
const COLORS = ["Amber", "Blue", "Green"].map(l => ({ value: l.toLowerCase(), label: l }));
const SWATCHES = [{ value: "#e5484d", label: "Red" }, { value: "#3e63dd", label: "Blue" }, { value: "#30a46c", label: "Green" }];
const TAGS = [{ value: "design", label: "Design" }, { value: "code", label: "Code" }, { value: "docs", label: "Docs" }];

// slug → (props) => element. `v` is true when the family carries its default value; `p` the shared props.
const FAMILIES = {
  "input": (v, p) => <Input aria-label="Input" defaultValue={v ? "Draft" : undefined} {...p} />,
  "textarea": (v, p) => <Textarea aria-label="Textarea" defaultValue={v ? "Notes" : undefined} {...p} />,
  "password-field": (v, p) => <PasswordField aria-label="Password" defaultValue={v ? "secret1" : undefined} {...p} />,
  "search-field": (v, p) => <SearchField aria-label="Search" defaultValue={v ? "query" : undefined} {...p} />,
  "number-field": (v, p) => <NumberField aria-label="Number" defaultValue={v ? 4 : null} {...p} />,
  "color-field": (v, p) => <ColorField aria-label="Color" defaultValue={v ? "#3366ff" : undefined} {...p} />,
  "otp-field": (v, p) => <OTPField aria-label="Code" length={4} defaultValue={v ? "1234" : undefined} {...p} />,
  "select": (v, p) => <Select aria-label="Select" defaultValue={v ? "b" : ""} {...p}><option value="">None</option><option value="a">Alpha</option><option value="b">Beta</option><option value="c">Gamma</option></Select>,
  "checkbox": (v, p) => <Checkbox label="Checkbox" defaultChecked={v} {...p} />,
  "switch": (v, p) => <Switch label="Switch" defaultChecked={v} {...p} />,
  "radio-group": (v, p) => <RadioGroup label="Radio" defaultValue={v ? "two" : undefined} {...p}><Radio value="one" label="One" /><Radio value="two" label="Two" /><Radio value="three" label="Three" /></RadioGroup>,
  "slider": (v, p) => <Slider aria-label="Slider" defaultValue={30} {...p} />,
  "slider-range": (v, p) => <SliderRange aria-label="Range" defaultValue={[20, 80]} {...p} />,
  "segmented": (v, p) => <Segmented label="Segmented" items={[{ value: "day", label: "Day" }, { value: "week", label: "Week" }, { value: "month", label: "Month" }]} defaultValue={v ? "week" : undefined} {...p} />,
  "toggle-group": (v, p) => <ToggleGroup aria-label="Toggle group" defaultValue={v ? ["bold"] : []} {...p}><ToggleGroupItem value="bold">Bold</ToggleGroupItem><ToggleGroupItem value="italic">Italic</ToggleGroupItem></ToggleGroup>,
  "color-swatch-picker": (v, p) => <ColorSwatchPicker label="Swatch" items={SWATCHES} defaultValue={v ? "#3e63dd" : undefined} {...p} />,
  "alignment-picker": (v, p) => <AlignmentPicker label="Alignment" defaultValue={v ? "center" : undefined} {...p} />,
  "custom-select": (v, p) => <CustomSelect aria-label="Custom select" items={COLORS} defaultValue={v ? "blue" : null} placeholder="Choose" {...p} />,
  "combobox": (v, p) => <Combobox aria-label="Combobox" items={COLORS} defaultValue={v ? "blue" : null} {...p} />,
  "tag-picker": (v, p) => <TagPicker aria-label="Tags" items={TAGS} defaultValue={v ? ["design"] : []} {...p} />,
  "date-picker": (v, p) => <DatePicker aria-label="Date" today="2026-11-11" defaultValue={v ? "2026-11-11" : null} {...p} />,
  "date-range-picker": (v, p) => <DateRangePicker aria-label="Dates" today="2026-11-11" defaultValue={v ? { start: "2026-11-02", end: "2026-11-06" } : null} {...p} />,
  "time-field": (v, p) => <TimeField aria-label="Time" hourCycle={24} defaultValue={v ? "09:30" : null} {...p} />,
  "box-field": (v, p) => <BoxField label="Padding" defaultValue={v ? [8, 8, 8, 8] : [null, null, null, null]} {...p} />,
  "calendar": (v, p) => <Calendar aria-label="Calendar" today="2026-11-11" defaultValue={v ? "2026-11-11" : null} {...p} />,
};
window.__families = Object.keys(FAMILIES);
window.__submits = {};
const counted = event => { event.preventDefault(); window.__submits[event.currentTarget.id] = (window.__submits[event.currentTarget.id] ?? 0) + 1; };
const cell = (slug, el) => <div key={slug} data-family={slug} style={{ display: "flex", gap: 8, alignItems: "center" }}><code style={{ inlineSize: 140 }}>{slug}</code>{el}</div>;

function App() {
  if (mode === "required" || mode === "filled") return Object.entries(FAMILIES).map(([slug, make]) =>
    <form key={slug} id={`req-${slug}`} onSubmit={counted} style={{ display: "flex", gap: 8 }}>
      {cell(slug, make(mode === "filled", { name: slug, required: true }))}
      <Button type="submit" id={`submit-${slug}`}>Send</Button>
    </form>);
  return <form id="f" onSubmit={counted} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    {Object.entries(FAMILIES).map(([slug, make]) => cell(slug, make(true, { name: slug, ...(mode === "disabled" ? { disabled: true } : {}) })))}
    <div style={{ display: "flex", gap: 8 }}><Button type="submit" id="submit">Send</Button><Button type="reset" id="reset">Reset</Button></div>
  </form>;
}

createRoot(document.getElementById("root")).render(<App />);
requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; }));
