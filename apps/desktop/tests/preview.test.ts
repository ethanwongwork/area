// The Preview's model (docs/research/desktop-app-analysis-2026-11-10, T2): which addresses load (electron/preview.cjs
// `localUrl`, src/preview.ts `localAddress`: the same rule twice, held together here), the address kept with a project,
// its place, a chosen element's name and values, the values a person tries, and what Chat is told.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { addressLabel, elementKind, elementName, localAddress, previewMessage, previewRows, shownValue, STYLE_ROWS, withTweak, type ChosenElement } from "../src/preview.ts";
import { newProject, projectFile, readProject, setPreview } from "../src/projects.ts";
import { hrefOf, parsePlace, setProjects, tabKind } from "../src/places.ts";
import type { Restorers } from "../src/systems.ts";

const require = createRequire(import.meta.url);
const { localUrl, PICKER, STYLES } = require("../electron/preview.cjs");
const RESTORE = { canvas: saved => saved, material: saved => saved, colours: saved => saved, accent: saved => saved } as Restorers;

test("preview: only this Mac's addresses load, typed short or whole; the page and the app decide alike", () => {
  const cases: Array<[string, string | null]> = [
    ["5173", "http://localhost:5173/"], ["localhost:5173", "http://localhost:5173/"], [" http://127.0.0.1:3000/shop ", "http://127.0.0.1:3000/shop"],
    ["https://app.localhost:8443/a?b=1", "https://app.localhost:8443/a?b=1"], ["[::1]:8080", "http://[::1]:8080/"],
    ["example.com", null], ["https://localhost.example.com", null], ["http://user:pass@localhost:3000", null], ["file:///etc/hosts", null],
    ["javascript://localhost/%0Aalert(1)", null], ["192.168.1.20:3000", null], ["", null], ["localhost evil.com", null],
  ];
  for (const [typed, expected] of cases) {
    assert.equal(localAddress(typed), expected, `page: ${typed}`);
    assert.equal(localUrl(typed)?.href ?? null, expected, `app: ${typed}`);
  }
  assert.equal(localAddress(5173), null);
  assert.equal(addressLabel("http://localhost:5173/"), "localhost:5173");
  assert.equal(addressLabel("http://127.0.0.1:3000/shop"), "127.0.0.1:3000/shop");
});

test("preview: a project keeps its address in its file; one that isn't this Mac's is never kept or read", () => {
  const project = newProject("Storefront", "area", "default", []);
  assert.equal("preview" in projectFile(project), false);
  const placed = setPreview(project, "5173");
  assert.equal(placed.preview, "http://localhost:5173/");
  assert.equal(setPreview(project, "example.com"), project, "an outside address changes nothing");
  assert.equal(readProject(JSON.parse(JSON.stringify(projectFile(placed))), RESTORE)!.preview, "http://localhost:5173/");
  assert.equal(readProject({ ...projectFile(placed), preview: "https://example.com/" }, RESTORE)!.preview, undefined, "a file edited by hand can't point it elsewhere");
  assert.equal(setPreview(placed, null).preview, undefined);
});

test("preview: it is a place in the project's tab", () => {
  setProjects([{ id: "launch", name: "Spring launch" }]);
  assert.equal(hrefOf({ page: "preview", project: "launch" }), "#project/launch/preview");
  assert.deepEqual(parsePlace("#project/launch/preview"), { page: "preview", project: "launch" });
  assert.equal(tabKind({ page: "preview", project: "launch" }), "project");
  setProjects([]);
});

const button: ChosenElement = {
  tag: "button", classes: ["buy", "primary"], text: "Add to cart", selector: "main > article.card:nth-of-type(1) > button.buy.primary",
  rect: { x: 49, y: 164, width: 107.5, height: 38 }, page: "/shop?sort=new",
  styles: { "background-color": "rgb(31, 111, 235)", color: "rgb(255, 255, 255)", "font-size": "15px", "font-weight": "600", "line-height": "22px", "border-radius": "8px",
    padding: "8px 14px", gap: "normal", "border-width": "0px", "border-color": "rgba(0, 0, 0, 0)", "box-shadow": "none", opacity: "1" },
};

test("preview: an element's name is its component or what its tag is for, with its words when they are few; values read as a person writes them", () => {
  assert.equal(elementName(button), "Button, Add to cart");
  assert.equal(elementName({ ...button, component: "BuyButton" }), "BuyButton, Add to cart");
  assert.equal(elementName({ tag: "p", text: "A long paragraph that says a great deal more than a name should hold" }), "Text");
  assert.equal(elementKind({ tag: "div", role: "tablist" }), "Tablist");
  assert.equal(elementKind({ tag: "div" }), "Element");
  assert.equal(shownValue("rgb(31, 111, 235)"), "#1F6FEB");
  assert.equal(shownValue("rgba(0, 0, 0, 0)"), "None");
  assert.equal(shownValue("rgba(0, 0, 0, 0.5)"), "rgba(0, 0, 0, 0.5)", "a see-through color keeps its alpha");
  assert.equal(shownValue("8px 14px"), "8px 14px");
  assert.ok(STYLE_ROWS.every(row => STYLES.includes(row.name)), "every style the Inspector lists is one the app reads and may set");
});

test("preview: a style tried twice keeps its first value; back where it started, it is no change", () => {
  let tweaks = withTweak([], { name: "border-radius", label: "Corner", from: "8px", to: "12px" });
  tweaks = withTweak(tweaks, { name: "border-radius", label: "Corner", from: "12px", to: "16px" });
  assert.deepEqual(tweaks, [{ name: "border-radius", label: "Corner", from: "8px", to: "16px" }]);
  tweaks = withTweak(tweaks, { name: "background-color", label: "Fill", from: "rgb(31, 111, 235)", to: "rgb(17, 17, 17)" });
  assert.equal(tweaks.length, 2);
  assert.deepEqual(withTweak(tweaks, { name: "border-radius", label: "Corner", from: "16px", to: "8px" }).map(tweak => tweak.name), ["background-color"]);
});

test("preview: Chat is told where the element is, what it is, how it looks, and what the person wants", () => {
  const tweaks = [{ name: "border-radius", label: "Corner", from: "8px", to: "16px" }, { name: "background-color", label: "Fill", from: "rgb(31, 111, 235)", to: "rgb(17, 17, 17)" }];
  assert.deepEqual(previewRows(button, tweaks, " Make every buy button like this "), [
    { thing: "Button, Add to cart", change: "Corner 8px → 16px" }, { thing: "Button, Add to cart", change: "Fill #1F6FEB → #111111" },
    { thing: "Button, Add to cart", change: "Make every buy button like this" },
  ]);
  const message = previewMessage("http://localhost:5173/", { ...button, component: "BuyButton", source: "/work/shop/src/cart.tsx:12" }, tweaks, "Make every buy button like this");
  assert.match(message, /running app \(localhost:5173, page \/shop\?sort=new\)/);
  assert.match(message, /tag <button>, component BuyButton, source \/work\/shop\/src\/cart\.tsx:12, classes "buy primary", text "Add to cart"/);
  assert.match(message, /Find it by: main > article\.card:nth-of-type\(1\) > button\.buy\.primary\. Its box is 108 by 38/);
  assert.match(message, /- Corner \(border-radius\): 8px → 16px\n- Fill \(background-color\): #1F6FEB → #111111/);
  assert.doesNotMatch(message.split("\n")[2]!, /corner|fill /, "a tried style is not also listed as it is now");
  assert.match(message, /Their note: Make every buy button like this/);
  const plain = previewMessage("http://localhost:5173/", { ...button, page: "/" }, [], "Too loud");
  assert.doesNotMatch(plain, /tried these values/);
  assert.match(plain, /running app \(localhost:5173\)/);
});

test("preview: what runs in the person's page is one function, and asks for nothing of Area's", () => {
  assert.match(PICKER, /^function install\(STYLES\)/);
  assert.doesNotMatch(PICKER, /require\(|areaDesktop|ipcRenderer|fetch\(|XMLHttpRequest|localStorage|document\.cookie/);
  assert.doesNotThrow(() => new Function(`return (${PICKER})`));
});
