import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { createElement as h, type ReactNode } from "react";
import { Switch, Theme } from "@area/react";
import type { SwitchProps } from "@area/react";

const host = document.getElementById("cases")!;
const result = document.getElementById("results")!;
const fixture = document.getElementById("behavior")!;
const root = createRoot(host);
const behavior = createRoot(fixture);
const sizes = ["sm", "md", "lg"] as const;
const radii = ["sharp", "subtle", "soft", "standard", "round", "rotund", "pill"] as const;
const expected = { sm: [32, 16, 13, 18], md: [40, 20, 14, 20], lg: [48, 24, 14, 20] } as const;
const compactType = { sm: [12, 16], md: [13, 18], lg: [14, 20] } as const;
const rows: Array<Record<string, unknown>> = [];
const failures: string[] = [];
let assertions = 0;
const assert = (ok: boolean, message: string) => { assertions++; if (!ok) failures.push(message); };
const near = (actual: number, wanted: number, message: string) => assert(Math.abs(actual - wanted) < .12, `${message}: ${actual} != ${wanted}`);
const tick = () => new Promise(resolve => setTimeout(resolve, 20));
const mount = async (props: SwitchProps = {}, form = false) => {
  flushSync(() => behavior.render(form ? h("form", null, h(Switch, { label: "Test", ...props })) : h(Switch, { label: "Test", ...props })));
  await tick();
  return fixture.querySelector("input")!;
};
const clean = async () => { flushSync(() => behavior.render(null)); await tick(); };

async function run() {
  rows.length = failures.length = 0;
  assertions = 0;
  result.textContent = "Running…";
  const cases: ReactNode[] = [];
  for (const ui of ["default", "compact"] as const) for (const radius of radii) for (const size of sizes) for (const checked of [false, true]) {
    const key = [ui, radius, size, checked].join("/");
    cases.push(h(Theme, { key, value: { ui, radius, motion: "none" }, ...{ "data-case": key } }, h(Switch, { size, checked, readOnly: true, label: "Setting" })));
  }
  flushSync(() => root.render(cases));
  await document.fonts.ready;
  for (const el of host.querySelectorAll<HTMLElement>("[data-case]")) {
    const key = el.dataset.case!;
    const [ui, radius, size, checked] = key.split("/") as ["default" | "compact", string, typeof sizes[number], string];
    const track = el.querySelector<HTMLElement>(".area-switch__track")!;
    const thumb = el.querySelector<HTMLElement>(".area-switch__thumb")!;
    const label = el.querySelector<HTMLElement>(".area-switch__label")!;
    const input = el.querySelector("input")!;
    const t = track.getBoundingClientRect(), b = thumb.getBoundingClientRect(), l = label.getBoundingClientRect(), hit = input.getBoundingClientRect();
    const [width, height, defaultText, defaultLeading] = expected[size];
    const [text, leading] = ui === "default" ? [defaultText, defaultLeading] : compactType[size];
    near(t.width, width, `${key} width`);
    near(t.height, height, `${key} height`);
    near(b.width, height - 4, `${key} thumb width`);
    near(b.height, height - 4, `${key} thumb height`);
    near(b.top - t.top, 2, `${key} vertical inset`);
    near(checked === "true" ? t.right - b.right : b.left - t.left, 2, `${key} endpoint inset`);
    near(Math.abs(l.left - t.right), 8, `${key} label gap`);
    near(parseFloat(getComputedStyle(label).fontSize), text, `${key} type`);
    near(parseFloat(getComputedStyle(label).lineHeight), leading, `${key} leading`);
    assert(parseFloat(getComputedStyle(track).borderRadius) >= height / 2, `${key} pill track`);
    assert(parseFloat(getComputedStyle(thumb).borderRadius) >= (height - 4) / 2, `${key} pill thumb`);
    assert(hit.height >= 24 && hit.width >= 24, `${key} hit target`);
    rows.push({ key, track: [t.width, t.height], thumb: [b.width, b.height], type: [text, leading], radius });
  }

  let calls = 0;
  let input = await mount({ name: "setting", value: "yes", required: true, onCheckedChange: () => { calls++; } }, true);
  assert(!input.checkValidity(), "required invalid while unchecked");
  input.click(); await tick();
  assert(input.checked && calls === 1, "native click toggles once");
  assert(new FormData(input.form!).get("setting") === "yes", "native successful control");
  input.form!.reset(); await tick();
  assert(!input.checked, "native reset restores default");
  await clean();
  for (const props of [{ readOnly: true }, { loading: true }, { disabled: true }]) {
    calls = 0;
    input = await mount({ ...props, defaultChecked: true, onCheckedChange: () => { calls++; } });
    input.click(); await tick();
    assert(input.checked && calls === 0, `blocked activation ${JSON.stringify(props)}`);
    await clean();
  }
  input = await mount({ checked: false, onCheckedChange: () => { calls++; } });
  input.click(); await tick();
  assert(!input.checked, "controlled parent retains ownership");
  await clean();
  input = await mount({ description: "Helper" });
  assert(!!document.getElementById(input.getAttribute("aria-describedby")!), "description association resolves");
  assert(!!document.getElementById(input.getAttribute("aria-labelledby")!), "label association resolves");
  await clean();
  flushSync(() => behavior.render(h("div", { style: { width: "calc(var(--area-space-48) * 5)" } }, h(Switch, { label: "Automatically synchronize notification preferences across all devices" }))));
  await tick();
  assert(fixture.querySelector(".area-switch")!.getBoundingClientRect().width <= fixture.querySelector("div")!.getBoundingClientRect().width, "long label stays inside narrow container");
  await clean();
  input = await mount({ dir: "rtl", defaultChecked: true, label: "تحديث الإعدادات تلقائياً" });
  const rtlTrack = fixture.querySelector(".area-switch__track")!.getBoundingClientRect();
  const rtlThumb = fixture.querySelector(".area-switch__thumb")!.getBoundingClientRect();
  near(rtlThumb.left - rtlTrack.left, 2, "checked RTL endpoint inset");
  await clean();

  result.textContent = JSON.stringify({ assertions, cases: rows.length, failures, rows: rows.filter(row => String(row.key).startsWith("default/standard")) }, null, 2);
  flushSync(() => root.render(null));
  document.getElementById("summary")!.textContent = `${assertions} assertions; ${rows.length} geometry cases; ${failures.length} failures`;
}

document.getElementById("run")!.addEventListener("click", () => { void run().catch(error => { result.textContent = String(error); }); });
