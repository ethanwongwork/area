/*
 * Area figures, in the style of the screens (round 12 of the choice-illustrations review): Area's real components
 * laid out as real UI, rendered to static markup, every text node wrapped in span.tx so engine/abstract.css can
 * draw it Real, Bars or Shapes. Owner, 2026-10-24: "i like the screens designs ... recreate the other visuals in that
 * same style ... a full gallery of all types of ui, from screens to individual components".
 *   SCREENS     14 desktop screens, 6 iPhone screens and 16 component vignettes (screens.jsx)
 *   COMPOSITIONS grids of 4 to 6 similarly sized components, each showing one thing (compositions.jsx)
 *   GALLERY     every component family's default specimen (the app's own gallery: COMPONENT_PAGES and
 *               componentSpecimens), each in a vignette frame like the screens' vignettes, by kind of UI
 *   SETTINGS    every theme setting on the screen (or phone screen, or vignette) that shows it best, with the
 *               states it needs held still (data-st marks in screens.jsx); a few on a vignette of their own
 * Copy follows the placeholder vocabulary (docs/DESIGN_SYSTEM.md, Example copy); the person is David Tee.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { Board, BoardCard, BoardColumn, Button, Link, Menu, MenuItem, MenuSeparator, Message, MessageActions, Slider } from "@area/react";
import { CopyIcon, DocumentIcon, MoreHorizontalIcon, PencilIcon, RefreshIcon, StarIcon, ThumbsUpIcon, TrashIcon } from "@area/icons";
import { COMPONENT_PAGES } from "../../../../apps/desktop/src/content/pages.mjs";
import { componentSpecimens, demoWrapper } from "../../../../apps/desktop/src/content/specimens.mjs";
import { DEMOS } from "../../../../apps/desktop/src/content/registry.tsx";
import { AXES } from "../../../../apps/desktop/src/tokens.ts";
import { DESKTOP, MOBILE, ISOLATED } from "./screens.jsx";
import { COMPOSITIONS } from "./compositions.jsx";
import { figureMarkup } from "../engine/markup.js";

/* Kinds of UI, for the gallery. A family not listed lands in Other. */
export const KINDS = [
  ["Actions", ["button", "button-group", "split-button", "copy-button", "toggle-group", "toolbar", "zoom-control", "link", "link-groups"]],
  ["Text input", ["input", "input-group", "field", "textarea", "number-field", "password-field", "search-field", "otp-field", "time-field", "editable-text", "box-field"]],
  ["Choice", ["checkbox", "radio", "switch", "segmented", "select", "custom-select", "combobox", "list-box", "chip", "tag", "tag-picker", "model-picker", "slider"]],
  ["Dates and colour", ["calendar", "date-picker", "date-range-picker", "color-field", "color-picker", "color-swatch", "color-swatch-picker", "alignment-picker", "box-model"]],
  ["Navigation", ["nav", "tabs", "breadcrumb", "pagination", "stepper", "step", "table-of-contents", "tree-view", "titlebar", "command-palette", "scroll-to-latest"]],
  ["Overlays", ["menu", "context-menu", "composer-menu", "popover", "hover-card", "tooltip", "toggletip", "dialog", "confirm-dialog", "drawer"]],
  ["Feedback", ["alert", "toast", "progress", "meter", "spinner", "skeleton", "indicator", "empty-state", "turn-notice", "approval"]],
  ["Labels and marks", ["badge", "badge-group", "count", "kbd", "timestamp", "avatar", "abbreviation"]],
  ["Data", ["table", "description-list", "property-list", "token-row", "timeline", "inline-list", "shortcut-list", "reference-list", "citation", "edit-summary", "queue", "plan"]],
  ["Surfaces and layout", ["card", "surface", "panel", "stack", "separator", "section-heading", "scroll-area", "accordion", "board", "infobox", "hatnote", "figure", "preview-frame"]],
  ["Files and media", ["file-image", "file-page", "file-tile", "folder", "file-upload", "asset-card", "asset-row", "attachment", "video-player"]],
  ["Chat and code", ["composer", "message", "prompt-suggestions", "code", "code-block"]],
];

/* The families that show more than one specimen, and how (owner, 2026-10-24: "more clumped together, default to rows or
   columns with adequate gaps"): a row, a column, a tight grid, a pair laid over each other or stacked. `bleed` fills
   the frame edge to edge (the drawer). Every other family shows its first specimen alone. */
export const SHOW = {
  badge: { layout: "column", ids: ["variant-soft-tone-neutral", "variant-soft-tone-info", "variant-soft-tone-success", "variant-soft-tone-danger"] },
  chip: { layout: "row", ids: ["default", "swatch", "icon"] },
  tag: { layout: "grid", cols: 2, ids: ["tone-neutral", "tone-info", "tone-success", "tone-danger"] },
  avatar: { layout: "row", ids: ["default", "content-two-initials", "content-icon", "composition-availability"] },
  indicator: { layout: "row", ids: ["presence-available", "presence-away", "presence-busy", "count-3"] },
  menu: { layout: "overlap", ids: ["icons", "selected"] },
  /* An exchange whose words fill the column, so the bars read as a reply (the app's demos say "Body text" once). */
  message: { node: () => <FigMessage /> },
  /* An icon beside the label: a plain button or group reads as a bar in a box. */
  button: { ids: ["with-icon"] },
  "button-group": { ids: ["icon-labels"] },
  /* A single specimen other than the first, where the first is too faint alone. */
  "copy-button": { ids: ["content-label"] },
  /* A time in it, so its numerals show. */
  "time-field": { ids: ["state-filled"] },
  "editable-text": { ids: ["state-editing"] },
  popover: { ids: ["teaching"] },
  count: { ids: ["variant-soft"] },
  "zoom-control": { ids: ["content-view"] },
  /* A link in running text, the way links are read (the app's demo is the link alone). */
  link: { node: () => <p className="sx-t" style={{ width: 300, margin: 0 }}>Body text that wraps onto a second line, with a <Link href="#link">Link</Link> set inside it the way it reads in running text.</p> },
  /* Two columns whole and centred, four cards in each (the app's demo runs a third column off the tile). */
  board: { node: () => <FigBoard /> },
  /* The drawer fills the right side, top to bottom; the titlebar spans its tile as the top of a window. */
  drawer: { bleed: "right" },
  titlebar: { layout: "width", bleed: "width" },
};

const FigBoard = () => (
  <Board aria-label="Label">
    {[["To do", "neutral"], ["In progress", "purple"]].map(([title, color]) => (
      <BoardColumn key={title} title={title} color={color} count={4}>
        {[0, 1, 2, 3].map((i) => <BoardCard key={i} href="#board" icon={<DocumentIcon />} title={i === 1 ? "Title that wraps onto a second line" : "Title"} />)}
      </BoardColumn>
    ))}
  </Board>
);
const action = (label, icon) => <Button variant="ghost" tone="neutral" iconOnly aria-label={label} icon={icon} />;
const FigMessage = () => (
  <div style={{ display: "grid", gap: 24, inlineSize: 480 }}>
    <Message author="user">Body text that wraps onto a second line</Message>
    <Message author="assistant" authorName="Assistant" actions={<MessageActions>{action("Copy", <CopyIcon />)}{action("Good response", <ThumbsUpIcon />)}{action("Regenerate", <RefreshIcon />)}{action("More actions", <MoreHorizontalIcon />)}</MessageActions>}>
      <p>Body text that wraps onto a second line, long enough to fill the column the way a reply does.</p>
      <p>Body text that wraps onto a second line.</p>
    </Message>
  </div>
);

/* Vignettes of our own, in the screens' vignette frame (screens.jsx, Iso): what no screen holds still. */
const Iso = ({ children, w = 480, h = 360 }) => <div className="sx-iso" style={{ width: w, height: h }}>{children}</div>;
const dangerMenu = (
  <Iso><Menu aria-label="Actions" style={{ inlineSize: 220 }}>
    <MenuItem icon={<CopyIcon />}>Item one</MenuItem><MenuItem icon={<PencilIcon />}>Item two</MenuItem><MenuItem icon={<StarIcon />}>Item three</MenuItem>
    <MenuSeparator /><MenuItem icon={<TrashIcon />} tone="danger" data-highlighted="" data-af-pointer="">Delete</MenuItem>
  </Menu></Iso>
);
/* A slider's thumb at its end, ghost thumbs at equal steps of time (engine/stage.js draws them). */
const travel = (ghosts) => <Iso><Slider aria-label="Value" defaultValue={100} style={{ inlineSize: 300 }} data-af-ghosts={ghosts} /></Iso>;
export const VIGNETTES = {
  "danger-menu": () => dangerMenu,
  motion: (v) => { const n = Math.round(Number(v) / 30); return travel(Array.from({ length: n }, (_, i) => (i / n).toFixed(3)).join(",")); },
  easing: () => travel("ease:7"),
};

const S = (id, group, need, show, shows, at, extra = {}) => ({ id, group, need, show, shows, ...at, ...extra });
/* Where each setting shows best: a desktop screen, an iPhone screen, a vignette (round 12's choices, extended to the
   settings added since), the states it holds, and what an option needs in order to show. */
const ACCENT = { "data-area-action": "accent", "data-area-selection": "accent" };
export const SETTINGS = [
  S("theme", "Color", "none", ["light", "dark"], "The whole screen in each mode.", { desktop: "dashboard", mobile: "team", isolated: "card" }),
  S("neutral", "Color", "reads", ["neutral", "cool", "warm"], "The screen's greys.", { desktop: "doc", mobile: "menu", isolated: "sidebar" }),
  S("tint-hue", "Color", "none", ["auto", "25", "95", "155", "215", "285"], "The greys' hue, at Light tint 8 so it shows.", { desktop: "mail", mobile: "menu", isolated: "sidebar" }, { scope: { "data-area-tint-light": "8", "data-area-tint-dark": "8" } }),
  S("tint-light", "Color", "weak", ["0", "2", "4", "8", "16"], "How far light greys lean to the tint.", { desktop: "mail", mobile: "menu", isolated: "sidebar" }),
  S("tint-dark", "Color", "weak", ["0", "2", "4", "8", "16"], "How far dark greys lean to the tint.", { desktop: "editor", mobile: "menu", isolated: "inspector" }),
  S("ink-tint", "Color", "reads", ["0", "2", "4"], "Text and icons toward the tint.", { desktop: "doc", mobile: "chat", isolated: "card" }, { fidelity: "real", scope: { "data-area-tint-light": "8" } }),
  S("accent", "Color", "none", ["blue", "red", "green", "purple", "orange", "teal"], "Where Area paints the accent: the primary button, selected segments, checks and switches.", { desktop: "detail", mobile: "plan", isolated: "form" }, { scope: ACCENT }),
  S("accent-strength", "Color", "none", ["100", "70", "50", "30"], "The accent's strength on the same parts.", { desktop: "detail", mobile: "plan", isolated: "form" }, { scope: ACCENT }),
  S("solid-light", "Color", "none", ["auto", "400", "600", "850"], "The accent solid on the primary button, light.", { desktop: "chat-home", mobile: "plan", isolated: "form" }, { scope: ACCENT }),
  S("solid-dark", "Color", "none", ["auto", "400", "600", "850"], "The accent solid on the primary button, dark.", { desktop: "chat-home", mobile: "plan", isolated: "form" }, { scope: ACCENT }),
  S("label-tint", "Color", "none", ["0", "2", "4"], "The label on an accent solid.", { desktop: "chat-home", mobile: "plan", isolated: "form" }, { scope: ACCENT, fidelity: "real" }),
  S("status-colours", "Color", "none", ["fixed", "match"], "Status badges, at Accent strength 50.", { desktop: "database", mobile: "finance", isolated: "badges" }, { scope: { "data-area-accent-strength": "50" } }),
  S("ground-light", "Color", "reads", ["100", "97", "94", "90"], "The page's lightness around white surfaces.", { desktop: "booking", mobile: "finance", isolated: "card" }),
  S("ground-dark", "Color", "reads", ["0", "8", "16", "24"], "The page's darkness around raised surfaces.", { desktop: "album", mobile: "finance", isolated: "carousel" }),
  S("layers-light", "Color", "weak", ["0", "2", "4", "6", "8"], "How far page, sidebar, cards and plates step apart.", { desktop: "mail", mobile: "team", isolated: "sidebar" }),
  S("layers-dark", "Color", "weak", ["0", "2", "4", "6", "8"], "How far page, sidebar, cards and plates step apart.", { desktop: "editor", mobile: "team", isolated: "inspector" }),
  S("card-tone-light", "Color", "weak", ["-4", "-2", "0", "2", "4", "auto"], "Cards against the light page.", { desktop: "listing", mobile: "team", isolated: "card" }),
  S("card-tone-dark", "Color", "weak", ["-4", "-2", "0", "2", "4", "auto"], "Cards against the dark page.", { desktop: "listing", mobile: "team", isolated: "card" }),
  S("action", "Color", "none", ["neutral", "accent"], "The primary button.", { desktop: "chat-home", mobile: "plan", isolated: "form" }),
  S("selection", "Color", "none", ["accent", "neutral"], "Selected segments, radios, checks and switches.", { desktop: "settings", mobile: "plan", isolated: "form" }),
  S("contrast", "Color", "weak", ["0", "2", "4", "6", "8"], "Edges and ink.", { desktop: "database", mobile: "menu", isolated: "inspector" }, { attr: "data-area-contrast" }),
  S("type", "Size", "none", ["12", "13", "14", "15", "16"], "Text and every control that grows with it.", { desktop: "chat", mobile: "chat", isolated: "card" }),
  S("density", "Size", "reads", ["28", "32", "36"], "Row and control heights.", { desktop: "issues", mobile: "menu", isolated: "menu" }),
  S("radius", "Shape", "reads", ["0", "4", "8", "14", "pill"], "Card and control corners.", { desktop: "board", mobile: "plan", isolated: "card" }),
  S("pills", "Shape", "weak", ["button", "field", "segmented", "chip", "badge", "switch"], "The one part that goes fully round.", { desktop: "settings", mobile: "detail", isolated: "badges" }),
  S("surface", "Stroke", "weak", ["0", "0.5", "1", "1.5", "2"], "The edge of surfaces: cards and panes.", { desktop: "board", mobile: "team", isolated: "carousel" }),
  S("stroke", "Stroke", "weak", ["0", "2", "4", "6", "8"], "How dark every edge and divider is.", { desktop: "database", mobile: "menu", isolated: "inspector" }),
  S("stroke-hover", "Stroke", "weak", ["0", "1", "2", "3", "4"], "A field under the pointer.", { desktop: "settings", mobile: "finance", isolated: "form" }, { states: ["hover-edge"] }),
  S("selected-stroke", "Stroke", "reads", ["1", "2", "3"], "The selected card's edge.", { desktop: "listing", mobile: "detail", isolated: "menu" }, { states: ["selected"] }),
  S("focus-ring", "Stroke", "reads", ["hug", "gap", "halo", "inset", "bold"], "A focused field.", { desktop: "chat-home", mobile: "chat", isolated: "form" }, { states: ["focus"] }),
  S("shadow-rest", "Stroke", "weak", ["0", "2", "4", "8"], "Cards drawn by their rest shadow.", { desktop: "settings", mobile: "finance", isolated: "card" }),
  S("elevation", "Shadow", "weak", ["0", "2", "3", "5", "8"], "A menu floating over the page.", { desktop: "database", mobile: "chat", isolated: "menu" }, { states: ["menu"] }),
  S("shadow-resting", "Shadow", "weak", ["0", "3", "5", "8"], "Cards resting on the page.", { desktop: "listing", mobile: "team", isolated: "card" }),
  S("shadow-hover", "Shadow", "weak", ["0", "3", "5", "8"], "A card under the pointer.", { desktop: "board", mobile: "team", isolated: "music" }, { states: ["lift"] }),
  S("shadow-field", "Shadow", "weak", ["0", "3", "5", "8"], "Fields on the Field shadow.", { desktop: "booking", mobile: "finance", isolated: "form" }, { states: ["focus"] }),
  S("shadow-size", "Shadow", "weak", ["0", "4", "8"], "A floating menu at Floating 8.", { desktop: "detail", mobile: "team", isolated: "menu" }, { states: ["menu"], scope: { "data-area-elevation": "8" } }),
  S("shadow-softness", "Shadow", "weak", ["0", "2", "8"], "A floating menu at Floating 8.", { desktop: "mail", mobile: "menu", isolated: "menu" }, { states: ["menu"], scope: { "data-area-elevation": "8" } }),
  S("shadow-light", "Shadow", "weak", ["0", "2", "4"], "A floating menu at Floating 8.", { desktop: "dashboard", mobile: "plan", isolated: "toolbar" }, { states: ["menu"], scope: { "data-area-elevation": "8" } }),
  S("shadow-color", "Shadow", "weak", ["black", "warm", "cool"], "A floating menu at Floating 8.", { desktop: "board", mobile: "team", isolated: "toast" }, { states: ["menu"], scope: { "data-area-elevation": "8" } }),
  S("fill-hover", "Fill", "weak", ["1", "2", "3", "4"], "A row or button under the pointer.", { desktop: "issues", mobile: "menu", isolated: "sidebar" }, { states: ["hover"] }),
  S("fill-selected", "Fill", "weak", ["0", "1", "2", "4"], "The selected row.", { desktop: "doc", mobile: "plan", isolated: "sidebar" }),
  S("fill-pressed", "Fill", "weak", ["1", "2", "3", "4"], "A button held down.", { desktop: "chat-home", mobile: "finance", isolated: "toolbar" }, { states: ["press"] }),
  S("selected-tint", "Fill", "weak", ["none", "tint", "neutral"], "The selected card's fill.", { desktop: "listing", mobile: "detail", isolated: "menu" }, { states: ["selected"] }),
  S("danger-hover", "Fill", "none", ["tint", "neutral"], "A menu's delete row under the pointer.", { vignette: "danger-menu" }),
  S("motion", "Effects", "reads", ["0", "90", "210", "300"], "A slider's thumb at its end, a ghost every 30 ms of the duration.", { vignette: "motion" }),
  S("easing", "Effects", "reads", ["standard", "snappy", "gentle", "spring"], "The same thumb at seven equal steps of time, placed by the curve.", { vignette: "easing" }),
];

/* Words as shapes and images as blanks: engine/markup.js, shared with the app's Setup stage. */
const html = (node) => figureMarkup(renderToStaticMarkup(node));
/* "inline-size:100%;min-inline-size:0" → a React style object. */
const styleOf = (css) => css ? Object.fromEntries(css.split(";").filter(Boolean).map((d) => { const [k, ...v] = d.split(":"); return [k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase()), v.join(":").trim()]; })) : undefined;

export function render() {
  const errors = [];
  const safe = (label, f) => { try { return f(); } catch (e) { errors.push(`${label}: ${String(e.message).slice(0, 200)}`); return ""; } };
  const screens = {};
  for (const [set, map] of [["desktop", DESKTOP], ["mobile", MOBILE], ["isolated", ISOLATED]]) {
    screens[set] = {};
    for (const [id, [label, C]] of Object.entries(map)) {
      const h = safe(`${set}/${id}`, () => html(<C />));
      const m = h.match(/width:(\d+)px;height:(\d+)px/);
      screens[set][id] = { label, html: h, ...(set === "isolated" && m ? { w: +m[1], h: +m[2] } : {}) };
    }
  }
  /* Compositions: 4 to 6 similarly sized components showing one thing (compositions.jsx). */
  const compositions = Object.fromEntries(Object.entries(COMPOSITIONS).map(([id, [label, about, C]]) => [id, { label, about, html: safe(`composition/${id}`, () => html(<C />)) }]));
  /* The gallery: each family's first specimen in a vignette frame, wrapped as the app's own gallery wraps it. */
  const kindOf = Object.fromEntries(KINDS.flatMap(([kind, slugs]) => slugs.map((slug) => [slug, kind])));
  /* One specimen per family, the app gallery's first (owner, 2026-10-24: "1 of each component in most cases ... 2 if
     absolutely necessary"); SHOW names the few that show a deliberate pair or a small grid. */
  const gallery = COMPONENT_PAGES.filter((page) => !page.docsOnly).map((page) => {
    const all = componentSpecimens(page, (name) => name in DEMOS).filter((sp) => DEMOS[sp.demo]);
    const pick = SHOW[page.slug];
    const chosen = pick?.ids ? pick.ids.map((id) => all.find((sp) => sp.id === id)).filter(Boolean) : all.slice(0, 1);
    const parts = pick?.node ? [safe(`gallery/${page.slug}`, () => html(<div className="af-tile__demo" style={{ inlineSize: "max-content", maxInlineSize: "none" }}>{pick.node()}</div>))] : chosen.map((sp) => {
      const Demo = DEMOS[sp.demo], style = styleOf(demoWrapper(sp.demo)?.style);
      return safe(`gallery/${page.slug}/${sp.id}`, () => html(<div className="af-tile__demo" style={style}><Demo /></div>));
    }).filter(Boolean);
    return { slug: page.slug, name: page.name, kind: kindOf[page.slug] || "Other", layout: pick?.layout || "single", cols: pick?.cols, bleed: pick?.bleed || null, parts };
  });
  const vignettes = {};
  for (const s of SETTINGS) if (s.vignette) vignettes[s.id] = Object.fromEntries(s.show.map((v) => [v, safe(`${s.id}/${v}`, () => html(VIGNETTES[s.vignette](v)))]));
  /* Each setting's name and option labels, from the registry the Inspector reads. */
  const labels = Object.fromEntries(AXES.map((a) => [a.id, { label: a.label, def: a.defaultPreset, options: Object.fromEntries(a.presets.map((p) => [p.id, p.label])) }]));
  labels.contrast = { label: "Contrast", def: "system", options: { 0: "0 (Standard)", 2: "2", 4: "4", 6: "6", 8: "8 (More)" } };
  labels.pills = { label: "Pills", def: "chip badge count switch avatar", options: { button: "Button", field: "Field", segmented: "Segmented", chip: "Chip", badge: "Badge", switch: "Switch" } };
  return { screens, compositions, gallery, kinds: [...KINDS.map(([k]) => k), "Other"], settings: SETTINGS, vignettes, labels, errors };
}
