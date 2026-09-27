import { specimenName } from "./specimen-names.mjs";
import { buildInsetFixture } from "./inset-fixture.mjs";
import { docsOutput } from "./output.mjs";
import { baseTokens } from "../../../packages/tokens/src/emit/base.ts";
import { buildLab } from "./lab.mjs";
/**
 * Builds the documentation site.
 *
 * Static HTML. Previews are the real React components rendered with react-dom/server, and
 * each snippet is the source of the very demo beside it -- so the two cannot disagree.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderDemos } from "./render.mjs";
import {
  DOCS_CSS,
  DOCS_SCRIPT,
  codeBlock,
  customizeButton,
  escapeHtml,
  highlight,
  table,
  tokenCard,
  tokenChip,
  tokenSection,
  customizer,
  viewToggle,
} from "./layout.mjs";
import { ICONS } from "./icons.generated.mjs";
import { CATALOG } from "./icons.catalog.mjs";
import { COMPONENT_PAGES } from "../src/pages.mjs";
import { COMPLETE_COMPONENTS, RECENT_COMPONENTS, componentStatus, statusLabel } from "../src/component-status.mjs";
import { PRACTICES } from "../src/practices.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repo = resolve(root, "..", "..");
const out = docsOutput(root);
const AREA_COUNT = CATALOG.filter((i) => i.source === "area").length;

const tokens = JSON.parse(readFileSync(join(repo, "packages/tokens/dist/tokens.json"), "utf8"));
const { MANIFESTS } = await import(join(repo, "packages/styles/src/manifest.ts"));
const demos = await renderDemos();

const FOUNDATION_PAGES = [
  { slug: "color", name: "Color" },
  { slug: "ui-scale", name: "UI scale" },
  { slug: "iconography", name: "Iconography" },
  { slug: "radius", name: "Radius" },
  { slug: "surface", name: "Surface" },
  { slug: "motion", name: "Motion" },
];

// Only owner-confirmed families receive completion styling.
for (const slug of COMPLETE_COMPONENTS) {
  if (!COMPONENT_PAGES.some(page => page.slug === slug)) throw new Error(`Unknown completed component: ${slug}`);
}
const orderedComponents = [...COMPONENT_PAGES].sort((a, b) =>
  Number(COMPLETE_COMPONENTS.has(b.slug)) - Number(COMPLETE_COMPONENTS.has(a.slug)) ||
  (RECENT_COMPONENTS.includes(a.slug) ? RECENT_COMPONENTS.indexOf(a.slug) : 999) -
  (RECENT_COMPONENTS.includes(b.slug) ? RECENT_COMPONENTS.indexOf(b.slug) : 999) || a.name.localeCompare(b.name));

/* --- Chrome ---------------------------------------------------------------- */

/**
 * The inspector.
 *
 * Every axis is a real control from the system, and which control an axis gets is decided
 * by the shape of its values rather than by uniformity:
 *
 *   two states, one of them the "on" one   -> Switch     (theme)
 *   a short unordered set, all labels tiny -> Segmented  (neutral, density)
 *   a long unordered set                   -> Chip       (accent: eleven hues)
 *   a set whose labels do not fit a track  -> Select     (typography, surface, motion)
 *   an ordered ramp with a direction       -> Slider     (radius: 0 to pill)
 *
 * A panel of eight identical segmented controls -- which is what this was -- says every
 * axis is the same kind of choice. They are not: radius is a ramp you scrub, accent is a
 * palette you pick from, and dark mode is a thing you turn on.
 *
 * Every control carries `data-axis`, and every option `data-value`, so one delegated
 * listener drives all of them and a control can be swapped for another without touching
 * the script.
 */
function axisRow(label, control) {
  return `<div class="area-field area-field--horizontal">
      <span class="area-field__label">${escapeHtml(label)}</span>
      ${control}
    </div>`;
}

function axisSelect(axis) {
  const options = axis.presets
    .map(
      (p) =>
        `<option value="${p.id}"${p.id === axis.defaultPreset ? " selected" : ""}>${escapeHtml(p.label)}</option>`,
    )
    .join("");
  return `<select class="area-select area-select--md" aria-label="${escapeHtml(axis.label)}" data-axis="${axis.id}" data-default="${axis.defaultPreset}">${options}</select>`;
}

const AXIS_SECTIONS = [
  { title: "Appearance", axes: ["theme", "neutral", "accent"] },
  { title: "Scale", axes: ["ui"] },
  { title: "Layout", axes: ["radius", "surface"] },
  { title: "Accessibility", axes: ["contrast"] },
  { title: "Motion", axes: ["motion"] },
];

/** Every inspector axis uses the native medium Select: one equal-height control per row. */
function axisControl(axis) {
  return { label: axis.label, control: axisSelect(axis) };
}

function inspectorBody() {
  const byId = Object.fromEntries(tokens.axes.map((axis) => [axis.id, axis]));
  byId.contrast = {
    id: "contrast",
    label: "Contrast",
    defaultPreset: "standard",
    presets: [
      { id: "standard", label: "Standard" },
      { id: "more", label: "More" },
    ],
  };

  return AXIS_SECTIONS.map((section) => {
    const rows = section.axes
      .map((id) => {
        const { label, control } = axisControl(byId[id]);
        return axisRow(label, control);
      })
      .join("\n      ");

    return `<section class="area-panel__section">
      <h2 class="area-panel__heading">${escapeHtml(section.title)}</h2>
      ${rows}
    </section>`;
  }).join("\n    ");
}

/**
 * The panel itself: a persistent right rail, the way Figma and Framer both put an
 * inspector beside the thing it acts on rather than in a drawer over it.
 *
 * It is `position: sticky` with its own scroll, so a long page scrolls under a panel that
 * stays put -- the controls are for the whole document, not for the part of it currently
 * on screen.
 */
function inspector() {
  return `<aside class="docs-inspector area-panel area-panel--md area-panel--flush" id="docs-inspector" aria-label="Customize">
  <div class="area-panel__bar">
    <span class="area-panel__title">Customize</span>
    <span class="docs-inspector__actions">
      <button type="button" class="area-button area-button--ghost area-button--neutral area-button--sm" data-reset-axes>
        <span class="area-button__label">Reset</span>
      </button>
      ${railToggle("panel", "Hide customize panel")}
    </span>
  </div>
  <div class="area-panel__body">
    ${inspectorBody()}
  </div>
  <button type="button" class="docs-rail-resizer" data-resize-rail="panel" aria-label="Resize customize panel" aria-orientation="vertical" aria-valuemin="220" aria-valuemax="360" aria-valuenow="248"></button>
</aside>`;
}

/*
 * A rail toggle. One markup, two homes: it rides in its rail's own bar while the rail is
 * open, and a second copy waits in the page corner for when the rail is closed -- which is
 * where every editor puts it, because a control that disappears with the thing it reopens
 * is not a toggle.
 *
 * Both copies carry `data-rail`, so one handler drives them and neither needs to know the
 * other exists. Which copy is visible is decided by the shell's state attribute in CSS,
 * never by the script, so the server-rendered page is already correct.
 */
function railToggle(rail, label, { corner = false } = {}) {
  const icon = rail === "nav" ? ICONS.panelLeft : ICONS.panelRight;
  return `<button type="button" class="area-button area-button--ghost area-button--neutral area-button--md area-button--icon-only${corner ? " docs-rail-toggle" : ""}" data-rail="${rail}" aria-label="${escapeHtml(label)}" aria-expanded="true">
      <span class="area-button__icon" aria-hidden="true">${icon}</span>
    </button>`;
}

function sidebar(activeSlug) {
  // An icon where the slug has one. Components have none deliberately: there are
  // twenty-odd of them and a column of near-identical glyphs is noise, where nine
  // foundations each have a distinct thing to depict.
  const item = (href, label, slug, { complete = false } = {}) =>
    `<a class="area-nav__item" href="${href}"${slug === activeSlug ? ' aria-current="page"' : ""}>${
      complete
        ? '<span class="area-nav__icon" aria-hidden="true"><span class="docs-sidebar__complete-marker"></span></span>'
        : ICONS[slug]
          ? `<span class="area-nav__icon" aria-hidden="true">${ICONS[slug]}</span>`
          : ""
    }<span class="area-nav__text"><span${COMPONENT_PAGES.some(p => p.slug === slug) ? ` class="docs-audit-label" data-audit="${componentStatus(slug)}"` : ""}>${escapeHtml(label)}</span></span></a>`;

  const group = (id, title, links) =>
    `<div class="docs-sidebar__group area-nav__group" role="group" aria-labelledby="${id}">
      <div class="area-nav__label" id="${id}"><span>${escapeHtml(title)}</span></div>
      ${links}
    </div>`;

  return `<aside class="docs-sidebar area-panel area-panel--xs area-panel--flush area-panel--bare-bar">
  <div class="area-panel__bar">
    <a class="docs-wordmark" href="./index.html">area</a>
    ${railToggle("nav", "Hide navigation")}
  </div>
  <div class="area-panel__body docs-sidebar__body">
  <nav class="area-nav docs-sidebar__nav" aria-label="Documentation">
  ${group("docs-nav-getting-started", "Getting started", [item("./index.html", "Introduction", "index"), item("./axes.html", "Axes", "axes"), item("./gallery.html", "Component gallery", "gallery"), item("./lab.html", "System lab", "lab")].join("\n      "))}
  ${group("docs-nav-foundations", "Foundations", FOUNDATION_PAGES.map((p) => item(`./${p.slug}.html`, p.name, p.slug)).join("\n      "))}
  ${group("docs-nav-components", "Components", orderedComponents.map((p) => item(`./${p.slug}.html`, p.name, p.slug)).join("\n      "))}
  </nav>
  </div>
  <button type="button" class="docs-rail-resizer" data-resize-rail="nav" aria-label="Resize navigation" aria-orientation="vertical" aria-valuemin="192" aria-valuemax="320" aria-valuenow="208"></button>
</aside>`;
}

/** While set, page() returns only its body so gallery pages can reuse foundation content. */
const PAGE_MODE = { bodyOnly: false };
function bodyOf(render) {
  PAGE_MODE.bodyOnly = true;
  try { return render(); } finally { PAGE_MODE.bodyOnly = false; }
}

function page({ slug, title, lede, body, toc = [], wide = false }) {
  if (PAGE_MODE.bodyOnly) return body;
  /*
   * On this page keeps the right rail as its home. The inspector shares that column, and
   * the two never show at once -- when the panel is open the outline is hidden rather than
   * relocated, because an outline moved to the top of the document stops being a rail you
   * glance at and becomes a block you read past.
   */
  const tocHtml = toc.length
    ? `<nav class="docs-toc area-menu area-menu--inline area-menu--marker" aria-label="On this page">
      <div class="area-menu__label"><span>On this page</span></div>
      ${toc.map((t) => `<a class="area-menu__item" href="#${t.id}"${t.nested ? ' data-nested' : ""}>${escapeHtml(t.title)}</a>`).join("")}
    </nav>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} — area</title>
<meta name="description" content="${escapeHtml(lede)}">
<link rel="stylesheet" href="./area.css">
<style>${DOCS_CSS}</style>
</head>
<body>
${customizer(inspectorBody())}
<div class="docs-shell" data-nav="open" data-panel="open"${toc.length ? "" : ' data-toc="none"'}>
  ${sidebar(slug)}
  <main class="docs-main">
    <div class="docs-content${wide ? " docs-content--wide" : ""}">
      <h1 class="docs-title">${escapeHtml(title)}</h1>
      <p class="docs-lede">${escapeHtml(lede)}</p>
      ${body}
    </div>
  </main>
  ${tocHtml}
  ${inspector()}
</div>
${railToggle("nav", "Show navigation", { corner: true })}
${railToggle("panel", "Show customize panel", { corner: true })}
<script>${DOCS_SCRIPT}</script>
${slug === "switch" ? '<script type="module" src="./switch-demos.js"></script>' : ""}
${slug === "tree-view" || slug === "composer" || slug === "toolbar" || slug === "alignment-picker" || slug === "color-field" || slug === "color-picker" || slug === "color-swatch-picker" ? '<script type="module" src="./switch-demos.js"></script>' : ""}
${["badge", "badge-group", "indicator", "presence"].includes(slug) ? '<script type="module" src="./badge-demos.js"></script>' : ""}
${slug === "slider" ? '<script type="module" src="./slider-demos.js"></script>' : ""}
${slug === "number-field" || slug === "input-group" ? '<script type="module" src="./number-field-demos.js"></script>' : ""}
${slug === "chip" ? '<script type="module" src="./chip-demos.js"></script>' : ""}
${slug === "alert" ? '<script type="module" src="./alert-demos.js"></script>' : ""}
${slug === "avatar" ? '<script type="module" src="./avatar-demos.js"></script>' : ""}
${slug === "code-block" ? '<script type="module" src="./code-block-demos.js"></script>' : ""}
</body>
</html>`;
}

/** The three tile sizes the gallery grid places: whole cells of one square unit. */
const GALLERY_SPANS = new Set(["1x1", "2x1", "2x2", "2x3", "2x4", "2x5"]);

/* One tile per public component family. Compound pieces appear inside their parent. */
function galleryPage({ families = null } = {}) {
  // Every component receives its own compact section. The section supplies the component
  // name; a tile therefore names only its single specimen (default, soft-success,
  // size-md) and never repeats the family name just to fill space.
  const badgeTones = ["neutral", "accent", "info", "success", "warning", "caution", "danger", "discovery", "inverted"];
  const badgeVariants = ["soft", "solid", "outline", "color", "modern"];
  const titleCase = (value) => value[0].toUpperCase() + value.slice(1);
  const gallerySpecimens = {
    "color-picker": [{id: "default", title: "Solid color", demo: "GalleryColorPicker", span: "2x2"}],
    "tree-view": [
      { id: "files", title: "Project files", demo: "GalleryTreeViewFiles", span: "2x2" },
      { id: "filters", title: "Checkbox filters", demo: "GalleryTreeViewFilters", span: "2x2" },
      { id: "collapsed", title: "Collapsed", demo: "GalleryTreeViewCollapsed", span: "2x1" },
    ],
    "color-swatch-picker": [
      { id: "default", title: "Palette", demo: "GalleryColorSwatchPicker" },
      { id: "row", title: "Transparency", demo: "GalleryColorSwatchPickerRow" },
    ],
    "color-field": [
      { id: "default", title: "Fill", demo: "GalleryColorField" },
      { id: "split", title: "Split opacity", demo: "GalleryColorFieldSplit" },
      { id: "alpha", title: "Alpha", demo: "GalleryColorFieldAlpha" },
      { id: "disabled", title: "Disabled", demo: "GalleryColorFieldDisabled" },
    ],
    "color-swatch": [
      { id: "default", title: "Transparency", demo: "GalleryColorSwatch" },
      { id: "sizes", title: "Sizes", demo: "GalleryColorSwatchSizes" },
    ],
    "alignment-picker": [
      { id: "default", title: "Alignment", demo: "GalleryAlignmentPickerDefault" },
      { id: "landscape", title: "Landscape", demo: "GalleryAlignmentPickerLandscape" },
      { id: "portrait", title: "Portrait", demo: "GalleryAlignmentPickerPortrait" },
      { id: "plain", title: "Plain", demo: "GalleryAlignmentPickerPlain" },
      { id: "disabled", title: "Disabled", demo: "GalleryAlignmentPickerDisabled" },
    ],
    toolbar: [
      { id: "default", title: "Commands", demo: "GalleryToolbar" },
      { id: "plain", title: "Plain", demo: "GalleryToolbarPlain" },
      { id: "vertical", title: "Vertical", demo: "GalleryToolbarVertical" },
    ],
    composer: [
      { id: "inline", title: "Inline", demo: "GalleryComposerInline", span: "2x1" },
      { id: "stacked", title: "Stacked", demo: "GalleryComposerStacked", span: "2x2" },
      { id: "prefilled", title: "Controlled draft", demo: "GalleryComposerPrefilled", span: "2x2" },
      { id: "disabled", title: "Disabled", demo: "GalleryComposerDisabled", span: "2x1" },
    ],
    "code-block": [
      { id: "default", title: "Default", demo: "CodeBlockDefault", span: "2x2" },
      { id: "no-filename", title: "No filename", demo: "CodeBlockPlain", span: "2x2" },
      { id: "highlighted", title: "Highlighted lines", demo: "CodeBlockHighlighted", span: "2x2" },
      { id: "diff", title: "Added and removed", demo: "CodeBlockDiff", span: "2x2" },
      { id: "linked", title: "Referenced lines", demo: "CodeBlockLinked", span: "2x2" },
      { id: "languages", title: "Language switcher", demo: "CodeBlockLanguages", span: "2x2" },
      { id: "language-tabs", title: "Language tabs", demo: "CodeBlockLanguageTabs", span: "2x2" },
      { id: "unnumbered", title: "Hidden line numbers", demo: "CodeBlockUnnumbered", span: "2x2" },
      { id: "wrap", title: "Wrapped", demo: "CodeBlockWrap", span: "2x2" },
      { id: "collapsed", title: "Collapsed", demo: "CodeBlockCollapsed", span: "2x2" },
    ],
    dialog: [
      { id: "default", title: "Default", demo: "GalleryDialog", span: "2x2" },
      { id: "no-close", title: "Without close button", demo: "GalleryDialogNoClose", span: "2x2" },
      { id: "form", title: "With field", demo: "GalleryDialogForm", span: "2x2" },
      { id: "scrollable", title: "Scrollable body", demo: "GalleryDialogScrollable", span: "2x2" },
      { id: "modal", title: "Interactive modal", demo: "GalleryDialogModal", span: "2x2" },
    ],
    code: COMPONENT_PAGES.find(page => page.slug === "code").examples,
    nav: [
      { id: "default", title: "Default", demo: "GalleryNav", span: "2x2" },
      { id: "grouped", title: "Grouped", demo: "GalleryNavGrouped", span: "2x2" },
      { id: "icons", title: "Icons", demo: "GalleryNavIcons", span: "2x2" },
      { id: "counts", title: "Counts", demo: "GalleryNavCounts", span: "2x2" },
      { id: "marker", title: "Selection marker", demo: "GalleryNavMarker", span: "2x2" },
      { id: "horizontal", title: "Horizontal", demo: "GalleryNavHorizontal", span: "2x2" },
      { id: "actions", title: "Actions", demo: "GalleryNavActions", span: "2x2" },
      { id: "expandable", title: "Expandable", demo: "GalleryNavExpandable", span: "2x2" },
    ],
    panel: [
      { id: "default", title: "Default", demo: "GalleryPanel", span: "2x2" },
      { id: "sections", title: "Sections", demo: "GalleryPanelSections", span: "2x2" },
      { id: "footer", title: "Footer", demo: "GalleryPanelFooter", span: "2x2" },
    ],
    popover: [
      { id: "teaching", title: "Teaching step", demo: "GalleryPopover" },
      { id: "field", title: "With field", demo: "GalleryPopoverField" },
      { id: "image", title: "Composition / image", demo: "GalleryPopoverImage" },
    ],

    indicator: [
      ...["available", "away", "busy", "do-not-disturb", "blocked", "offline", "out-of-office", "unknown"].map(status => ({id: `presence-${status}`, title: `Presence / ${status}`, demo: `GalleryBadgePresence${titleCase(status).replaceAll("-", "")}`})),
      ...["xs", "sm", "md", "lg"].map(size => ({id: `presence-size-${size}`, title: `Presence size / ${size}`, demo: `GalleryBadgePresenceSize${titleCase(size)}`})),
      ...["available", "away", "busy", "do-not-disturb", "offline"].map(status => ({id: `outside-${status}`, title: `Out of office / ${status}`, demo: `GalleryBadgePresenceOutside${titleCase(status).replaceAll("-", "")}`})),
      ...[0, 3, 24, 125].map(count => ({id: `count-${count}`, title: `Count / ${count}`, demo: `GalleryBadgeCount${count}`})),
      {id: "activity", title: "Activity dot", demo: "GalleryBadgeActivity"},
      {id: "processing", title: "Processing", demo: "GalleryBadgeProcessing"},
      {id: "border", title: "Surface border", demo: "GalleryBadgeBorder"},
      {id: "neutral", title: "Neutral count", demo: "GalleryBadgeCountNeutral"},
      {id: "zero", title: "Zero visibility", demo: "BadgeIndicatorZero"},
      { id: "anchor-button", title: "Anchor Button", demo: "BadgeAnchorButton" },
      { id: "anchor-icon-button", title: "Anchor Icon button", demo: "BadgeAnchorIconButton" },
      { id: "anchor-avatar", title: "Anchor Avatar", demo: "BadgeAnchorAvatar" },
      { id: "anchor-tab", title: "Anchor Tab", demo: "BadgeAnchorTab" },
      ...["top-end", "top-start", "bottom-end", "bottom-start"].map((placement) => ({
        id: `anchor-${placement}`,
        title: `Anchor / ${placement}`,
        demo: `GalleryBadgeAnchor${titleCase(placement).replace("-", "")}`,
      })),
      { id: "anchor-visibility", title: "Anchor Visibility", demo: "BadgeAnchorVisibility" },
    ],
    "badge-group": [
      { id: "group-wrap", title: "Group Wrap", demo: "BadgeGroupWrap" },
      { id: "group-inline", title: "Group Inline", demo: "BadgeGroupInline" },
      { id: "group-overlay", title: "Group Overlay", demo: "BadgeGroupOverlay" },
      { id: "group-auto", title: "Group Auto", demo: "BadgeGroupAuto" },
    ],
    badge: [
      { id: "default", title: "Default", demo: "BadgeDefault" },
      ...[["sm", "small"], ["md", "medium"], ["lg", "large"]].map(([size, label]) => ({ id: `size-${size}`, title: `Size / ${label}`, demo: `GalleryBadgeSize${titleCase(size)}` })),
      ...badgeVariants.flatMap((variant) => badgeTones.map((tone) => ({
        id: `variant-${variant}-tone-${tone}`,
        title: `${titleCase(variant)} / ${titleCase(tone)}`,
        demo: `GalleryBadge${titleCase(variant)}${titleCase(tone)}`,
      }))),
      { id: "leading-icon", title: "Leading Icon", demo: "BadgeLeadingIcon" },
      { id: "trailing-icon", title: "Trailing Icon", demo: "BadgeTrailingIcon" },
      { id: "icon-only", title: "Icon Only", demo: "BadgeIconOnly" },
      ...["soft", "outline"].flatMap((variant) => badgeTones.map((tone) => ({
        id: `dot-${variant}-${tone}`,
        title: `Dot ${titleCase(variant)} / ${titleCase(tone)}`,
        demo: `GalleryBadgeDot${titleCase(variant)}${titleCase(tone)}`,
      }))),
      ...["Open", "Done", "Closed", "Draft", "Queued"].map((state) => ({ id: `state-${state.toLowerCase()}`, title: `State / ${state}`, demo: `GalleryBadgeState${state}` })),
      { id: "avatar", title: "With avatar", demo: "BadgeAvatar" },
      { id: "flag", title: "With flag", demo: "BadgeFlag" },
      { id: "dismissible", title: "Dismissible", demo: "BadgeDismissible" },
      { id: "behavior-truncation", title: "Behavior / truncation", demo: "BadgeTruncation" },
      { id: "link", title: "Link", demo: "BadgeLink" },
    ],
    avatar: [
      { id: "default", title: "Default", demo: "GalleryAvatar" },
      { id: "content-image", title: "Content / image", demo: "GalleryAvatarImage" },
      { id: "behavior-image-fallback", title: "Behavior / image fallback", demo: "GalleryAvatarImageFallback" },
      { id: "content-two-initials", title: "Content / two initials", demo: "GalleryAvatarTwoInitials" },
      { id: "content-icon", title: "Content / generic icon", demo: "GalleryAvatarIcon" },
      { id: "composition-group", title: "Composition / group", demo: "GalleryAvatarGroup" },
      { id: "state-active", title: "State / active", demo: "GalleryAvatarActive" },
      { id: "composition-availability", title: "Composition / availability", demo: "GalleryAvatarAvailability" },
      { id: "composition-notification", title: "Composition / notification", demo: "GalleryAvatarNotification" },
      { id: "tone-accent", title: "Tone / accent", demo: "GalleryAvatarAccent" },
      { id: "tone-inverse", title: "Tone / inverse", demo: "GalleryAvatarInverse" },
      { id: "shape-square", title: "Shape / square", demo: "GalleryAvatarSquare" },
      { id: "size-small", title: "Size / small", demo: "GalleryAvatarSmall" },
      { id: "size-medium", title: "Size / medium", demo: "GalleryAvatarMedium" },
      { id: "size-large", title: "Size / large", demo: "GalleryAvatarLarge" },
    ],
    button: [
      { id: "default", title: "Default", demo: "GalleryButton" },
      { id: "size-small", title: "Size / small", demo: "GalleryButtonSmall" },
      { id: "size-medium", title: "Size / medium", demo: "GalleryButtonMedium" },
      { id: "size-large", title: "Size / large", demo: "GalleryButtonLarge" },
      ...["Neutral", "Accent", "Info", "Success", "Warning", "Caution", "Danger", "Discovery"].flatMap((tone) =>
        ["Solid", "Soft", "Outline", "Ghost"].map((variant) => ({
          id: `tone-${tone.toLowerCase()}-variant-${variant.toLowerCase()}`,
          title: `${tone} / ${variant}`,
          demo: `GalleryButton${tone}${variant}`,
        })),
      ),
      { id: "pill", title: "Pill", demo: "GalleryButtonPill" },
      { id: "selected", title: "Selected", demo: "GalleryButtonSelected" },
      { id: "with-icon", title: "With icon", demo: "GalleryButtonWithIcon" },
      { id: "with-shortcut", title: "With shortcut", demo: "GalleryButtonShortcut" },
      { id: "loading", title: "Loading", demo: "GalleryButtonLoading" },
      { id: "disabled", title: "Disabled", demo: "GalleryButtonDisabled" },
      { id: "icon-only", title: "Icon only", demo: "GalleryButtonIconOnly" },
    ],
    "button-group": [
      { id: "commands", title: "Independent icon commands", demo: "GalleryButtonGroupCommands" },
      { id: "text", title: "Text and toggle", demo: "GalleryButtonGroupText" },
    ],
    checkbox: [
      { id: "default", title: "Default", demo: "GalleryCheckbox" },
      { id: "size-small", title: "Size / small", demo: "GalleryCheckboxSmall" },
      { id: "size-medium", title: "Size / medium", demo: "GalleryCheckboxMedium" },
      { id: "size-large", title: "Size / large", demo: "GalleryCheckboxLarge" },
      { id: "selected", title: "Selected", demo: "GalleryCheckboxSelected" },
      { id: "partial", title: "Partial selection", demo: "GalleryCheckboxIndeterminate" },
      { id: "caption", title: "With caption", demo: "GalleryCheckboxCaption" },
      { id: "leading-visual", title: "With leading visual", demo: "GalleryCheckboxLeadingVisual" },
      { id: "card", title: "Variant / card", demo: "GalleryCheckboxCard" },
      { id: "invalid", title: "Invalid", demo: "GalleryCheckboxInvalid" },
      { id: "invalid-selected", title: "Invalid / selected", demo: "GalleryCheckboxInvalidChecked" },
      { id: "disabled", title: "Disabled", demo: "GalleryCheckboxDisabled" },
      { id: "disabled-selected", title: "Disabled / selected", demo: "GalleryCheckboxDisabledChecked" },
      { id: "disabled-indeterminate", title: "Disabled / partial selection", demo: "GalleryCheckboxDisabledIndeterminate" },
      { id: "group", title: "Checkbox group", demo: "GalleryCheckboxGroup" },
      { id: "group-invalid", title: "Checkbox group / invalid", demo: "GalleryCheckboxGroupInvalid" },
      { id: "group-success", title: "Checkbox group / success", demo: "GalleryCheckboxGroupSuccess" },
    ],
    radio: [
      { id: "default", title: "Default", demo: "GalleryRadio" },
      { id: "size-small", title: "Size / small", demo: "GalleryRadioSmall" },
      { id: "size-medium", title: "Size / medium", demo: "GalleryRadioMedium" },
      { id: "size-large", title: "Size / large", demo: "GalleryRadioLarge" },
      { id: "selected", title: "Selected", demo: "GalleryRadioSelected" },
      { id: "disabled", title: "Disabled", demo: "GalleryRadioDisabled" },
    ],
    field: [
      { id: "default", title: "Default", demo: "FieldDefault" },
      { id: "horizontal", title: "Horizontal", demo: "FieldHorizontal" },
      { id: "size-small", title: "Control size / small", demo: "GalleryFieldSmall" },
      { id: "size-medium", title: "Control size / medium", demo: "GalleryFieldMedium" },
      { id: "size-large", title: "Control size / large", demo: "GalleryFieldLarge" },
      { id: "required", title: "Required", demo: "FieldRequired" },
      { id: "description", title: "Description", demo: "FieldCaption" },
      { id: "error", title: "Validation / error", demo: "FieldValidation" },
      { id: "description-error", title: "Description and error", demo: "FieldError" },
      { id: "success", title: "Validation / success", demo: "FieldSuccess" },
      { id: "warning", title: "Validation / warning", demo: "FieldWarning" },
      { id: "disabled", title: "Disabled", demo: "FieldDisabled" },
      { id: "hidden-label", title: "Visually hidden label", demo: "FieldHiddenLabel" },
    ],
    "number-field": [
      { id: "default", title: "Default", demo: "NumberFieldDefault" },
      { id: "unitless", title: "Plain number", demo: "GalleryNumberFieldPlain" },
      { id: "steppers", title: "Steppers", demo: "NumberFieldSteppers" },
      { id: "scrub", title: "Scrub handle", demo: "NumberFieldScrub" },
      { id: "calculation", title: "Calculation", demo: "NumberFieldExpression" },
      { id: "decimal", title: "Decimal", demo: "NumberFieldDecimal" },
      { id: "mixed", title: "Mixed values", demo: "NumberFieldMixed" },
      { id: "soft", title: "Soft", demo: "NumberFieldSoft" },
      { id: "inspector", title: "Inspector composition", demo: "NumberFieldInspector", span: "2x2" },
      { id: "read-only", title: "Read only", demo: "NumberFieldReadOnly" },
      { id: "disabled", title: "Disabled", demo: "NumberFieldDisabled" },
    ],
    "input-group": [
      { id: "affixes", title: "Affixes", demo: "GalleryInputGroupAffixes" },
      { id: "paired", title: "Independent paired fields", demo: "GalleryInputGroupPair", span: "2x1" },
      { id: "icon", title: "Icon visual", demo: "GalleryInputGroupIcon" },
      { id: "opacity", title: "Opacity icon", demo: "GalleryInputGroupOpacity" },
      { id: "rotation", title: "Rotation icon", demo: "GalleryInputGroupRotation" },
      { id: "letter", title: "Letter visual", demo: "GalleryInputGroupLetter" },
      { id: "mode", title: "Mode picker", demo: "GalleryInputGroupMode" },
      { id: "phone", title: "Phone country code", demo: "GalleryInputGroupPhone" },
      { id: "action", title: "Independent action", demo: "GalleryInputGroupAction" },
    ],
    input: [
      { id: "default", title: "Default", demo: "InputDefault" },
      { id: "text", title: "Text", demo: "GalleryInputText" },
      { id: "search", title: "Search", demo: "GalleryInputSearch" },
      { id: "date", title: "Date", demo: "GalleryInputDate" },
      { id: "phone", title: "Phone", demo: "GalleryInputPhone" },
      { id: "password", title: "Password", demo: "GalleryInputPassword" },
      { id: "outline", title: "Variant / outline", demo: "InputOutline" },
      { id: "soft", title: "Variant / soft", demo: "InputSoft" },
      { id: "size-sm", title: "Size / small", demo: "GalleryInputSmall" },
      { id: "size-md", title: "Size / medium", demo: "GalleryInputMedium" },
      { id: "size-lg", title: "Size / large", demo: "GalleryInputLarge" },
      { id: "leading", title: "Leading icon", demo: "InputLeadingVisual" },
      { id: "trailing", title: "Trailing icon", demo: "InputTrailingVisual" },
      { id: "affix", title: "With affix", demo: "InputWithAffix" },
      { id: "action", title: "Trailing action", demo: "InputTrailingAction" },
      { id: "full-width", title: "Layout / full width", demo: "InputFullWidth" },
      { id: "readonly", title: "Read-only", demo: "InputReadOnly" },
      { id: "disabled", title: "Disabled", demo: "InputDisabled" },
      { id: "invalid", title: "Validation / error", demo: "InputInvalid" },
      { id: "success", title: "Validation / success", demo: "InputSuccess" },
      { id: "warning", title: "Validation / warning", demo: "InputWarning" },
      { id: "loading", title: "Loading", demo: "InputLoading" },
      { id: "loading-leading", title: "Loading / leading", demo: "InputLoadingLeading" },
      { id: "monospace", title: "Monospace", demo: "InputMonospace" },
      { id: "file", title: "File", demo: "InputFile" },
      { id: "rtl", title: "Right-to-left", demo: "InputRtl" },
    ],
    select: [
      { id: "default", title: "Default", demo: "SelectDefault" },
      { id: "size-sm", title: "Size / small", demo: "GallerySelectSmall" },
      { id: "size-md", title: "Size / medium", demo: "GallerySelectMedium" },
      { id: "size-lg", title: "Size / large", demo: "GallerySelectLarge" },
      { id: "field", title: "With field", demo: "SelectField" },
      { id: "error", title: "Validation / error", demo: "SelectInvalid" },
      { id: "success", title: "Validation / success", demo: "GallerySelectSuccess" },
      { id: "warning", title: "Validation / warning", demo: "GallerySelectWarning" },
      { id: "disabled", title: "Disabled", demo: "SelectDisabled" },
      { id: "groups", title: "Option groups", demo: "SelectGroups" },
    ],
    slider: [
      { id: "default", title: "Default", demo: "GallerySlider" },
      { id: "tone-neutral", title: "Tone / neutral", demo: "GallerySliderNeutral" },
      { id: "tone-accent", title: "Tone / accent", demo: "GallerySliderAccent" },
      { id: "with-label", title: "Composition / top label + value", demo: "GallerySliderWithLabel" },
      { id: "label-only", title: "Composition / top label", demo: "GallerySliderLabelOnly" },
      { id: "steps", title: "Steps / fractional", demo: "GallerySliderSteps" },
      { id: "step-marks", title: "Steps / markers", demo: "GallerySliderStepMarks" },
      { id: "range-inputs", title: "Composition / range with inputs", demo: "GallerySliderRangeWithInputs" },
      { id: "vertical", title: "Layout / vertical", demo: "GallerySliderVertical" },
      { id: "controlled", title: "Behavior / controlled", demo: "GallerySliderControlled" },
      { id: "disabled", title: "State / disabled", demo: "GallerySliderDisabled" },
      { id: "bare", title: "Composition / without readout", demo: "GallerySliderBare" },
    ],
    spinner: [
      { id: "default", title: "Default", demo: "GallerySpinner" },
      { id: "size-small", title: "Size / small", demo: "GallerySpinnerSmall" },
      { id: "size-medium", title: "Size / medium", demo: "GallerySpinnerMedium" },
      { id: "size-large", title: "Size / large", demo: "GallerySpinnerLarge" },
      { id: "tone-accent", title: "Tone / accent", demo: "GallerySpinnerAccent" },
      { id: "button", title: "In button", demo: "GallerySpinnerButton" },
      { id: "badge", title: "In badge", demo: "GallerySpinnerBadge" },
      { id: "input", title: "In input", demo: "GallerySpinnerInput" },
      { id: "empty", title: "Loading content", demo: "GallerySpinnerEmpty" },
    ],
    chip: [
      { id: "default", title: "Default", demo: "GalleryChip" },
      { id: "size-sm", title: "Size / small", demo: "GalleryChipSmall" },
      { id: "size-md", title: "Size / medium", demo: "GalleryChipMedium" },
      { id: "size-lg", title: "Size / large", demo: "GalleryChipLarge" },
      { id: "swatch", title: "Composition / swatch", demo: "GalleryChipSwatch" },
      { id: "icon", title: "Composition / icon", demo: "GalleryChipIcon" },
      { id: "group", title: "Composition / filter group", demo: "GalleryChipGroup" },
      { id: "assist", title: "Variant / assist", demo: "GalleryChipAssist" },
      { id: "filter", title: "Variant / filter", demo: "GalleryChipFilter" },
      { id: "input", title: "Variant / input", demo: "GalleryChipInput" },
      { id: "suggestion", title: "Variant / suggestion", demo: "GalleryChipSuggestion" },
      { id: "delete", title: "Action / delete", demo: "GalleryChipDelete" },
      { id: "click-delete", title: "Action / click + delete", demo: "GalleryChipClickableDelete" },
      { id: "custom-delete", title: "Action / custom delete", demo: "GalleryChipCustomDelete" },
      { id: "link-underline", title: "Action / link underline", demo: "GalleryChipLinkUnderline" },
      { id: "link-icon", title: "Action / link-out icon", demo: "GalleryChipLinkIcon" },
      { id: "avatar-initials", title: "Composition / avatar initials", demo: "GalleryChipAvatarInitials" },
      { id: "avatar-photo", title: "Composition / avatar photo", demo: "GalleryChipAvatarPhoto" },
      { id: "image-filter", title: "Composition / image filter", demo: "GalleryChipImageFilter" },
      { id: "invalid", title: "State / invalid input", demo: "GalleryChipInvalid" },
      { id: "disabled", title: "State / disabled", demo: "GalleryChipDisabled" },
    ],
    alert: [
      { id: "default", title: "Default / single line", demo: "GalleryAlert", span: "2x1" },
      { id: "accent", title: "Tone / accent", demo: "GalleryAlertAccent", span: "2x1" },
      { id: "link", title: "Composition / text link", demo: "GalleryAlertLink", span: "2x1" },
      { id: "success", title: "Tone / success", demo: "GalleryAlertSuccess", span: "2x1" },
      { id: "danger", title: "Tone / danger", demo: "GalleryAlertDanger", span: "2x1" },
      { id: "action", title: "Composition / actions single line", demo: "GalleryAlertAction", span: "2x1" },
      { id: "multiline", title: "Layout / multiline", demo: "GalleryAlertMultiline", span: "2x1" },
      { id: "dismissible", title: "Behavior / dismissible", demo: "GalleryAlertDismissible", span: "2x1" },
    ],
    card: [
      { id: "vertical", title: "Vertical", demo: "CardVertical", span: "2x2" },
      { id: "horizontal", title: "Horizontal", demo: "CardHorizontal", span: "2x2" },
      { id: "immersive", title: "Immersive", demo: "CardImmersive", span: "2x2" },
      { id: "compact", title: "Compact", demo: "CardCompact", span: "2x2" },
      { id: "carousel", title: "Carousel", demo: "CardCarousel", span: "2x2" },
    ],
    kbd: [
      { id: "default", title: "Default", demo: "GalleryKbd" },
      { id: "small", title: "Size / small", demo: "GalleryKbdSmall" },
      { id: "quiet", title: "Appearance / quiet", demo: "GalleryKbdQuiet" },
      { id: "on-color", title: "Appearance / on color", demo: "GalleryKbdOnColor" },
      { id: "chord", title: "Chord", demo: "GalleryKbdChord" },
      { id: "sequence", title: "Sequence", demo: "GalleryKbdSequence" },
      { id: "on-emphasis", title: "Appearance / on emphasis", demo: "GalleryKbdOnEmphasis" },
    ],
    breadcrumb: [
      { id: "default", title: "Default", demo: "GalleryBreadcrumb" },
      { id: "composition-collapsed", title: "Composition / collapsed", demo: "GalleryBreadcrumbCollapsed" },
      { id: "composition-icons", title: "Composition / icons", demo: "GalleryBreadcrumbIcons" },
    ],
    tooltip: [
      { id: "open", title: "Default", demo: "GalleryTooltip" },
      { id: "arrow", title: "With indicator", demo: "GalleryTooltipArrow" },
      { id: "kbd", title: "With Kbd", demo: "GalleryTooltipKbd" },
      { id: "side", title: "Right", demo: "GalleryTooltipSide" },
      { id: "bottom", title: "Bottom", demo: "GalleryTooltipBottom" },
      { id: "left", title: "Left", demo: "GalleryTooltipLeft" },
    ],
    menu: [
      { id: "default", title: "Default", demo: "GalleryMenu", span: "2x2" },
      { id: "shortcuts", title: "Shortcuts", demo: "GalleryMenuShortcuts", span: "2x2" },
      { id: "selected", title: "State / selected", demo: "GalleryMenuSelected", span: "2x2" },
      { id: "search", title: "Composition / search", demo: "GalleryMenuSearch", span: "2x2" },
      { id: "submenu", title: "Composition / nested submenu", demo: "GalleryMenuSubmenu", span: "2x2" },
      { id: "disabled", title: "Disabled", demo: "GalleryMenuDisabled", span: "2x2" },
      { id: "danger", title: "Danger", demo: "GalleryMenuDanger", span: "2x2" },
      { id: "controls", title: "Composition / controls", demo: "GalleryMenuControls", span: "2x2" },
    ],
    separator: [
      { id: "full-width", title: "Horizontal / full width", demo: "GallerySeparatorFullWidth" },
      { id: "inset", title: "Horizontal / inset", demo: "GallerySeparatorInset" },
      { id: "vertical-full", title: "Vertical / full width", demo: "GallerySeparatorVerticalFull" },
      { id: "vertical-inset", title: "Vertical / inset", demo: "GallerySeparatorVerticalInset" },
    ],
    skeleton: [
      { id: "text", title: "Text", demo: "GallerySkeleton" },
      { id: "circle", title: "Circle", demo: "GallerySkeletonCircle" },
      { id: "rectangle", title: "Rectangle", demo: "GallerySkeletonMedia" },
      { id: "rounded", title: "Rounded", demo: "GallerySkeletonRounded" },
      { id: "type-height", title: "Type height", demo: "GallerySkeletonType", span: "2x2" },
      { id: "card", title: "Card composition", demo: "GallerySkeletonCard", span: "2x2" },
    ],
    progress: [
      { id: "default", title: "Default", demo: "GalleryProgress" },
      { id: "labeled", title: "Composition / label and value", demo: "GalleryProgressLabeled" },
      { id: "indeterminate", title: "State / indeterminate", demo: "GalleryProgressIndeterminate" },
      { id: "accent", title: "Tone / accent", demo: "GalleryProgressAccent" },
      { id: "size-small", title: "Size / small", demo: "GalleryProgressSmall" },
      { id: "size-medium", title: "Size / medium", demo: "GalleryProgressMedium" },
      { id: "size-large", title: "Size / large", demo: "GalleryProgressLarge" },
    ],
    segmented: [
      { id: "default", title: "Default", demo: "GallerySegmented" },
      { id: "icons", title: "With icons", demo: "GallerySegmentedIcons" },
      { id: "icon-only", title: "Icon only", demo: "GallerySegmentedIconOnly" },
      { id: "full-width", title: "Full width", demo: "GallerySegmentedFullWidth" },
      { id: "disabled", title: "Disabled", demo: "GallerySegmentedDisabled" },
      { id: "size-small", title: "Size / small", demo: "GallerySegmentedSmall" },
      { id: "size-medium", title: "Size / medium", demo: "GallerySegmentedMedium" },
      { id: "size-large", title: "Size / large", demo: "GallerySegmentedLarge" },
    ],
    table: [
      { id: "default", title: "Default", demo: "GalleryTable", span: "2x2" },
      { id: "selection", title: "Selection", demo: "GalleryTableSelectable", span: "2x2" },
      { id: "sorting", title: "Sorting", demo: "GalleryTableSorting", span: "2x2" },
      { id: "compact", title: "Compact rows", demo: "GalleryTableCompact", span: "2x2" },
      { id: "striped", title: "Striped", demo: "GalleryTableStriped", span: "2x2" },
      { id: "column-dividers", title: "Column dividers", demo: "GalleryTableDividers", span: "2x2" },
      { id: "empty", title: "Empty", demo: "GalleryTableEmpty", span: "2x2" },
      { id: "loading", title: "Loading", demo: "GalleryTableLoading", span: "2x2" },
    ],
    tabs: [
      { id: "default", title: "Default", demo: "GalleryTabs", span: "2x1" },
      { id: "disabled", title: "Disabled", demo: "GalleryTabsDisabled", span: "2x1" },
      { id: "vertical", title: "Vertical", demo: "GalleryTabsVertical", span: "2x1" },
      { id: "small", title: "Small", demo: "GalleryTabsSmall", span: "2x1" },
      { id: "track", title: "With track", demo: "GalleryTabsTrack", span: "2x1" },
      { id: "icons", title: "Icons", demo: "GalleryTabsIcons", span: "2x1" },
      { id: "counts", title: "Counts", demo: "GalleryTabsCounts", span: "2x1" },
    ],
    toast: [
      { id: "default", title: "Success", demo: "GalleryToast", span: "2x1" },
      { id: "info", title: "Info", demo: "GalleryToastInfo", span: "2x1" },
      { id: "warning", title: "Warning", demo: "GalleryToastWarning", span: "2x1" },
      { id: "danger", title: "Danger", demo: "GalleryToastDanger", span: "2x1" },
      { id: "title", title: "With title", demo: "GalleryToastTitle", span: "2x1" },
      { id: "multiline", title: "Multiline", demo: "GalleryToastMultiline", span: "2x1" },
      { id: "action", title: "Action", demo: "GalleryToastAction", span: "2x1" },
      { id: "dismissible", title: "Dismissible", demo: "GalleryToastDismissible", span: "2x1" },
    ],
    textarea: [
      { id: "count", title: "Label / character count", demo: "GalleryTextareaCount" },
      { id: "default", title: "Default", demo: "TextareaDefault" },
      { id: "outline", title: "Variant / outline", demo: "TextareaOutline" },
      { id: "soft", title: "Variant / soft", demo: "TextareaSoft" },
      { id: "size-sm", title: "Size / small", demo: "GalleryTextareaSmall" },
      { id: "size-md", title: "Size / medium", demo: "GalleryTextareaMedium" },
      { id: "size-lg", title: "Size / large", demo: "GalleryTextareaLarge" },
      { id: "error", title: "Validation / error", demo: "TextareaInvalid" },
      { id: "success", title: "Validation / success", demo: "TextareaSuccess" },
      { id: "warning", title: "Validation / warning", demo: "TextareaWarning" },
      { id: "readonly", title: "Read-only", demo: "TextareaReadOnly" },
      { id: "disabled", title: "Disabled", demo: "TextareaDisabled" },
      { id: "rows", title: "Visible rows", demo: "TextareaRows" },
      { id: "resize-none", title: "Resize / none", demo: "TextareaResizeNone" },
    ],
    switch: ["SwitchDefault", "SwitchSizeSm", "SwitchSizeMd", "SwitchSizeLg", "SwitchChecked", "SwitchAccent", "SwitchCustom", "SwitchLong", "SwitchHover", "SwitchActive", "SwitchFocus", "SwitchDisabled", "SwitchDisabledChecked", "SwitchReadOnly", "SwitchLoading", "SwitchLabelEnd", "SwitchLabelStart", "SwitchDescription", "SwitchHiddenLabel", "SwitchSettingsRow", "SwitchList"].map(name => ({
      id: name.slice(6).toLowerCase(),
      title: name.slice(6).replace(/([a-z])([A-Z])/g, "$1 $2"),
      demo: name,
    })),
  };
  const sections = orderedComponents.filter((component) => families ? families.includes(component.slug) : !component.docsOnly).map((component) => {
    const status = componentStatus(component.slug);
    const fallbackName = `Gallery${component.exportName ?? component.name.replaceAll(" ", "")}`;
    const specimens = (gallerySpecimens[component.slug] ??
      [{ id: "default", title: "Default", demo: demos[fallbackName] ? fallbackName : component.examples[0].demo }])
      .filter(example => !example.verification && !/^(theme-|stress-|rtl$)/.test(example.id));
    const tiles = specimens.map((example) => {
      const demo = demos[example.demo];
      if (!demo) throw new Error(`Gallery specimen missing: ${example.demo}`);
      const id = `${component.slug}-${example.id}`;
      const span = example.span ?? "1x1";
      if (!GALLERY_SPANS.has(span)) throw new Error(`Gallery specimen "${example.demo}" spans ${span}; tiles are 1x1, 2x1, 2x2, 2x3, 2x4 or 2x5.`);
      return `<article class="docs-visual-gallery__tile" data-span="${span}" data-audit="${status}" id="gallery-${id}" aria-labelledby="gallery-title-${id}">
        <h3 class="docs-visual-gallery__tile-title" id="gallery-title-${id}">${escapeHtml(specimenName(example, component.slug))}</h3>
        <div class="docs-visual-gallery__tile-preview">${demoMarkup(example.demo, demo.html)}</div>
      </article>`;
    }).join("\n");
    // A family's current design pass (before / after, at 1x and at scale) sits above its
    // variants when demos export GalleryReview<PascalSlug>, e.g. GalleryReviewBadgeGroup.
    const reviewDemo = demos[`GalleryReview${component.slug.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase())}`];
    const review = reviewDemo ? `<section class="docs-gallery-review" aria-labelledby="gallery-review-${component.slug}">
        <h3 class="docs-visual-gallery__tile-title" id="gallery-review-${component.slug}">Pass review</h3>
        <div class="docs-gallery-review__body">${reviewDemo.html}</div>
      </section>` : "";
    return `<details open class="docs-visual-gallery__section" id="gallery-section-${component.slug}">
      <summary class="docs-visual-gallery__section-title">${escapeHtml(component.name)} <span class="docs-audit-label" data-audit="${status}">${statusLabel(status)}</span></summary>
      ${review}
      <div class="docs-visual-gallery__grid">${tiles}</div>
    </details>`;
  }).join("\n");

  if (families) return sections;
  const indexNav = `    <nav class="docs-gallery-index" aria-label="Components by audit status">
      ${["complete", "review", "unrefined"].map(status => `<div><h2 class="docs-visual-gallery__section-title">${statusLabel(status)}</h2><div class="docs-gallery-index__links">${orderedComponents.filter(component => componentStatus(component.slug) === status).map(component => `<a class="docs-audit-label" data-audit="${status}" href="#gallery-section-${component.slug}">${escapeHtml(component.name)}</a>`).join("")}</div></div>`).join("")}
    </nav>`;
  return galleryShell({ current: "gallery-components.html", title: "Components", body: indexNav + sections });
}

function redirectPage(target) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=./${target}"><title>area</title></head><body><a href="./${target}">Gallery</a></body></html>`;
}

/** Icon sheets (Iconography, Exploration): one full-width tile per sheet that grows with
 *  its content. The set outgrew fixed grid cells, and a sheet in one spilled over the next. */
function iconSheet(id, title, tileTitle, demoName, { open = true, note = "" } = {}) {
  const demo = demos[demoName];
  if (!demo) throw new Error(`Gallery specimen missing: ${demoName}`);
  return `<details${open ? " open" : ""} class="docs-visual-gallery__section" id="gallery-section-${id}">
      <summary class="docs-visual-gallery__section-title">${title}</summary>
      ${note ? `<p class="docs-gallery-note">${note}</p>` : ""}
      <article class="docs-visual-gallery__tile docs-visual-gallery__set" id="gallery-${id}" aria-labelledby="gallery-title-${id}">
        <h3 class="docs-visual-gallery__tile-title" id="gallery-title-${id}">${tileTitle}</h3>
        <div class="docs-visual-gallery__tile-preview docs-visual-gallery__sheet">${demo.html}</div>
      </article>
    </details>`;
}
/** Exploration: icon candidates under review (assets/area-icons-pilot/explore), shown only
 *  while candidates exist. */
function iconExploreSection() {
  const dir = join(root, "assets/area-icons-pilot/explore");
  if (!existsSync(dir) || !readdirSync(dir).some(file => file.endsWith(".svg"))) return "";
  return iconSheet("icon-explore", "Exploration", "candidates", "GalleryIconPilotExplore");
}
const iconReviewSections = () => [
  iconSheet("icon-compare", "Side by side", "fluent-area-keylines", "GalleryIconPilotCompare", { open: false }),
  iconSheet("icon-balance", "Optical balance", "set-16-32", "GalleryIconPilotBalance"),
  iconSheet("icon-weights", "Weights", "1-1125-125", "GalleryIconPilotWeights", { open: false }),
  iconSheet("icon-filled", "Filled", "outline-filled-fluent", "GalleryIconPilotFilled", { open: false }),
  iconSheet("icon-sizes", "Sizes", "size-curve", "GalleryIconPilotSizes", { open: false }),
  iconSheet("icon-sizes-raster", "Sizes, raster", "raster-12-20", "GalleryIconPilotSizesRaster", { open: false }),
  iconSheet("icon-pixels", "Pixel check", "raster-1x-2x", "GalleryIconPilotPixels", { open: false }),
].join("");

/** Icon review page (gallery-icons.html), from assets/area-icons-pilot/batches.json:
 *  - In review: a card per icon the owner hasn't approved yet, newest batch first;
 *  - All icons: the whole set, outline and filled, one group per batch, newest first;
 *  - Approved: the approved icons' cards, one closed section per batch, newest first.
 *  Rotations and mirrors follow their base icon. */
const DERIVED_FROM = Object.fromEntries([...readFileSync(join(root, "src/pilot-icons.tsx"), "utf8")
  .matchAll(/name: "([a-z0-9-]+)", keyline: "[a-z]+", derivedFrom: "([a-z0-9-]+)"/g)]
  .map(([, name, base]) => [`GalleryIconReview${name.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase())}`, base]));
function iconReviewPage() {
  const { batches } = JSON.parse(readFileSync(join(root, "assets/area-icons-pilot/batches.json"), "utf8"));
  const newest = [...batches].reverse();
  const pascal = name => name.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
  const derived = Object.keys(demos).filter(name => name.startsWith("GalleryIconReview"));
  // Owner status in the component gallery's colours: approved = Complete, review = In
  // review, revising = Unrefined. Approved cards carry no label; only open work is marked.
  const AUDIT = { approved: "complete", review: "review", revising: "unrefined" };
  const LABEL = { approved: "Approved", review: "In review", revising: "Revising" };
  const card = (name, status) => {
    const demo = demos[name];
    if (!demo) throw new Error(`Gallery specimen missing: ${name}`);
    const slug = name.replace("GalleryIconReview", "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
    return `
        <article class="docs-icon-card" data-audit="${AUDIT[status]}" id="gallery-icon-review-${slug}" aria-labelledby="gallery-title-icon-review-${slug}">
          <h3 class="docs-icon-card__title" id="gallery-title-icon-review-${slug}">${slug}${status === "approved" ? "" : ` <span class="docs-audit-label" data-audit="${AUDIT[status]}">${LABEL[status]}</span>`}</h3>
          ${demo.html}
        </article>`;
  };
  const cards = (batch, keep) => Object.entries(batch.icons).filter(([, status]) => keep(status)).map(([icon, status]) => {
    const base = `GalleryIconReview${pascal(icon)}`;
    const variants = derived.filter(name => name !== base && DERIVED_FROM[name] === icon);
    return card(base, status) + variants.map(name => card(name, status)).join("");
  }).join("");
  const open = status => status !== "approved";
  const total = derived.length;  // every icon, rotations and mirrors included
  const reviewing = newest.filter(batch => Object.values(batch.icons).some(open));
  const inReview = reviewing.length ? `<details open class="docs-visual-gallery__section" id="gallery-section-icon-review">
      <summary class="docs-visual-gallery__section-title">In review <span class="docs-audit-label" data-audit="review">${reviewing.reduce((n, batch) => n + Object.values(batch.icons).filter(open).length, 0)}</span></summary>
      ${reviewing.map(batch => `<p class="docs-gallery-note">${batch.title}: ${batch.note}</p>
      <div class="docs-icon-cards">${cards(batch, open)}</div>`).join("")}
    </details>` : "";
  const catalog = iconSheet("icon-catalog", "All icons", `${total} icons · outline and filled · newest first`, "GalleryIconCatalog");
  const approved = newest.filter(batch => Object.values(batch.icons).some(status => !open(status))).map(batch => `<details class="docs-visual-gallery__section" id="gallery-section-icon-${batch.id}">
      <summary class="docs-visual-gallery__section-title">${batch.title} <span class="docs-gallery-count">${Object.values(batch.icons).filter(status => !open(status)).length}</span></summary>
      <div class="docs-icon-cards">${cards(batch, status => !open(status))}</div>
    </details>`).join("");
  return inReview + catalog + `<h2 class="docs-visual-gallery__group-title">Approved</h2>` + approved;
}

/** Gallery pages, in nav order. The documentation site stays hidden until it is rebuilt. */
const GALLERY_PAGES = [
  ["gallery-components.html", "Components"],
  ["gallery-typeRamp.html", "Type ramp"],
  ["gallery-iconography.html", "Iconography"],
  ["gallery-icons.html", "Icons"],
  ["gallery-color.html", "Color"],
  ["gallery-scale.html", "UI scale"],
  ["gallery-radius.html", "Radius"],
  ["gallery-surface.html", "Surface"],
  ["gallery-motion.html", "Motion"],
];

function galleryShell({ current, title, body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} — area gallery</title>
<meta name="description" content="Area visual inspection gallery.">
<link rel="stylesheet" href="./area.css">
<style>${DOCS_CSS}</style>
</head>
<body>
<main class="docs-visual-gallery" data-gallery-panel="closed">
  <div class="docs-visual-gallery__content">
    <header class="docs-visual-gallery__header">
      <nav class="docs-gallery-pages" aria-label="Gallery pages">${GALLERY_PAGES.map(([file, label]) => `<a href="./${file}"${file === current ? ' aria-current="page"' : ""}>${label}</a>`).join("")}</nav>
      <h1 class="docs-visual-gallery__title">${escapeHtml(title)}</h1>
    </header>
    ${body}
  </div>
  <aside class="docs-visual-gallery__inspector area-panel area-panel--md" aria-label="Customize gallery">
    <div class="area-panel__bar docs-visual-gallery__inspector-bar">
      <span class="area-panel__title docs-visual-gallery__inspector-title">Customize</span>
      <span class="docs-visual-gallery__inspector-actions">
        <button type="button" class="area-button area-button--ghost area-button--neutral area-button--sm" data-reset-axes>
          <span class="area-button__label">Reset</span>
        </button>
        <button type="button" class="area-button area-button--ghost area-button--neutral area-button--md area-button--icon-only docs-visual-gallery__rail-toggle" data-gallery-rail="panel" aria-expanded="true" aria-controls="gallery-customizer-body" aria-label="Collapse customize panel">
          <span class="area-button__icon" aria-hidden="true">${ICONS.panelRight}</span>
        </button>
      </span>
    </div>
    <div class="area-panel__body docs-visual-gallery__inspector-body" id="gallery-customizer-body">
      ${inspectorBody()}
    </div>
  </aside>
</main>
<script>${DOCS_SCRIPT}</script>
<script src="./area-capture.js"></script>
<script type="module" src="./pixel-preview.js"></script>
<script type="module" src="./badge-demos.js"></script>
<script type="module" src="./switch-demos.js"></script>
<script type="module" src="./slider-demos.js"></script>
<script type="module" src="./number-field-demos.js"></script>
<script type="module" src="./chip-demos.js"></script>
<script type="module" src="./alert-demos.js"></script>
<script type="module" src="./avatar-demos.js"></script>
<script type="module" src="./code-block-demos.js"></script>
</body>
</html>`;
}

/* --- Component pages -------------------------------------------------------- */

function demoMarkup(name, html) {
  if (["GallerySegmented", "GallerySegmentedIcons", "GallerySegmentedFullWidth", "GallerySegmentedSmall", "GallerySegmentedMedium", "GallerySegmentedLarge", "SegmentedSizes"].includes(name)) return `<div data-switch-demo="${name}" style="display:flex;justify-content:center;inline-size:100%;max-inline-size:100%;min-inline-size:0">${html}</div>`;
  if (name === "GalleryDialogModal") return `<div data-switch-demo="${name}" style="inline-size:100%;min-inline-size:0;text-align:center">${html}</div>`;
  if (["GalleryInputPassword", "GalleryButtonGroupCommands", "GalleryButtonGroupText"].includes(name) || name.startsWith("GalleryToolbar") || name.startsWith("GalleryAlignmentPicker") || name.startsWith("GalleryColorPicker") || name.startsWith("GalleryColorField") || name.startsWith("GalleryColorSwatchPicker")) return `<div data-switch-demo="${name}" style="max-inline-size:100%;min-inline-size:0">${html}</div>`;
  // Every code block is hydrated: copy, the language picker and show/hide are behaviour.
  if (name.startsWith("CodeBlock")) return `<div data-code-block-demo="${name}" style="inline-size:100%;max-inline-size:100%;min-inline-size:0">${html}</div>`;
  if (name === "GallerySegmentedIconOnly") return `<div data-switch-demo="${name}">${html}</div>`;
  if (["GalleryTableSelectable", "GalleryTextareaCount"].includes(name)) return `<div data-switch-demo="${name}" style="inline-size:100%;max-inline-size:100%;min-inline-size:0">${html}</div>`;
  if (["GalleryPanel", "GalleryPanelSections", "GalleryPanelFooter", "GalleryNavActions", "GalleryNavExpandable", "GalleryTabs", "GalleryTabsDisabled", "GalleryTabsVertical", "GalleryTabsSmall", "GalleryTabsTrack", "GalleryTabsIcons", "GalleryTabsCounts", "GalleryToastAction"].includes(name)) return `<div data-switch-demo="${name}" style="display:flex;justify-content:center;max-inline-size:100%;min-inline-size:0">${html}</div>`;
  if (name === "GalleryMenuControls") return `<div data-switch-demo="${name}" style="inline-size:100%;max-inline-size:100%;min-inline-size:0">${html}</div>`;
  if (name.startsWith("Switch")) return `<div data-switch-demo="${name}" style="${["SwitchList", "SwitchSettingsRow"].includes(name) ? "inline-size:100%;" : ""}max-inline-size:100%;min-inline-size:0">${html}</div>`;
  if (name.startsWith("Slider") || name.startsWith("GallerySlider")) return `<div data-slider-demo="${name}" style="inline-size:100%;max-inline-size:100%;min-inline-size:0">${html}</div>`;
  if (name.startsWith("NumberField") || name === "GalleryNumberFieldPlain" || name.startsWith("GalleryInputGroup")) return `<div data-number-field-demo="${name}" style="max-inline-size:100%;min-inline-size:0">${html}</div>`;
  if (name.startsWith("GalleryTreeView") || name.startsWith("GalleryComposer")) return `<div data-structure-demo="${name}" style="inline-size:100%;max-inline-size:100%;min-inline-size:0">${html}</div>`;
  if (name.startsWith("Chip") || name.startsWith("GalleryChip")) return `<div data-chip-demo="${name}" style="max-inline-size:100%;min-inline-size:0">${html}</div>`;
  if (name.startsWith("Alert") || name.startsWith("GalleryAlert")) return `<div data-alert-demo="${name}" style="inline-size:100%;max-inline-size:100%;min-inline-size:0">${html}</div>`;
  if (name.startsWith("Avatar") || name.startsWith("GalleryAvatar")) return `<div data-avatar-demo="${name}" style="max-inline-size:100%;min-inline-size:0">${html}</div>`;
  return name.startsWith("Badge") ? `<div data-badge-demo="${name}" style="max-inline-size:100%;min-inline-size:0">${html}</div>` : html;
}

function exampleBlock(example) {
  const demo = demos[example.demo];
  if (!demo) throw new Error(`Page references demo "${example.demo}", which does not exist.`);

  const column = COLUMN_DEMOS.has(example.demo);

  return `<h3 class="docs-h3" id="${example.id}">${escapeHtml(example.title)}</h3>
${example.note ? `<p class="docs-note">${escapeHtml(example.note)}</p>` : ""}
<div class="docs-example">
  <div class="docs-example__preview${column ? " docs-example__preview--column" : ""}">
    <span class="docs-example__actions">${customizeButton()}</span>
    ${demoMarkup(example.demo, demo.html)}
  </div>
  ${codeBlock(demo.code, { flush: true })}
</div>`;
}

/** Demos whose instances stack rather than sit in a row. */
const COLUMN_DEMOS = new Set([
  "InputSizes",
  "FieldSizes",
  "FieldDefault",
  "FieldHorizontal",
  "FieldHiddenLabel",
  "SliderSizes",
  "SliderDefault",
  "SliderBare",
  "RadioDefault",
  "AlertTones",
  "InputDefault",
  "InputWithAffix",
  "InputInvalid",
  "TextareaDefault",
  "TextareaSizes",
  "TextareaField",
  "SelectDefault",
  "CheckboxDescription",
  "ButtonToneMatrix",
]);

function componentPage(spec) {
  spec = { ...spec, examples: spec.examples.map(example => ({ ...example, title: specimenName(example, spec.slug) })) };
  const manifest = MANIFESTS[spec.manifest];
  const lede = manifest?.description ?? "";

  const install = `<h2 class="docs-h2" id="installation">Installation</h2>
${codeBlock("npm install @area/react @area/styles")}
<h2 class="docs-h2" id="usage">Usage</h2>
<div class="docs-stack">
${codeBlock(`import { ${spec.imports ?? spec.exportName ?? spec.name} } from "@area/react";\nimport "@area/styles/area.css";`)}
${codeBlock(demos[spec.examples[0].demo].code)}
</div>`;

  const examples = `<h2 class="docs-h2" id="examples">Examples</h2>${spec.examples.filter(example => !example.verification).map(exampleBlock).join("\n")}${spec.examples.some(example => example.verification) ? `<details><summary>Verification fixtures</summary>${spec.examples.filter(example => example.verification).map(exampleBlock).join("\n")}</details>` : ""}`;

  const aliasNote = manifest?.aliases ? `<p class="docs-note">Source aliases: ${Object.entries(manifest.aliases).map(([alias, canonical]) => `${escapeHtml(alias)} → ${escapeHtml(canonical)}`).join("; ")}</p>` : "";
  const api = `<h2 class="docs-h2" id="api">API reference</h2>
${aliasNote}
${table(
  ["Prop", "Type", "Default"],
  (spec.api ?? []).map(([name, type, dflt]) => [
    `<span class="docs-mono">${escapeHtml(name)}</span>`,
    `<span class="docs-mono" style="color:var(--area-fg-accent)">${escapeHtml(type)}</span>`,
    `<span class="docs-mono" style="color:var(--area-fg-muted)">${escapeHtml(dflt)}</span>`,
  ]),
)}`;

  const guidance = PRACTICES[spec.slug] ?? [];
  const practices = guidance.length
    ? `<h2 class="docs-h2" id="practices">Best practices</h2>
<ul class="docs-list">${guidance.map((item) => `<li>${item}</li>`).join("")}</ul>`
    : "";

  const cssNote = `<h2 class="docs-h2" id="css">Without React</h2>
<p class="docs-note">Every component is plain CSS. Use the classes directly when you are not using React.</p>
${codeBlock(demos[spec.examples[0].demo].html)}`;

  const toc = [
    { id: "installation", title: "Installation" },
    { id: "usage", title: "Usage" },
    { id: "examples", title: "Examples" },
    ...spec.examples.filter(e => !e.verification).map((e) => ({ id: e.id, title: e.title, nested: true })),
    ...(guidance.length ? [{ id: "practices", title: "Best practices" }] : []),
    { id: "api", title: "API reference" },
    { id: "css", title: "Without React" },
  ];

  // Docs-only families (for example the icon pilot) are not package exports: no install,
  // import, API or plain-CSS sections.
  if (spec.docsOnly) {
    const docsToc = toc.filter(entry => !["installation", "usage", "api", "css"].includes(entry.id));
    return page({ slug: spec.slug, title: spec.name, lede: spec.lede ?? lede, body: examples + practices, toc: docsToc });
  }
  return page({ slug: spec.slug, title: spec.name, lede, body: install + examples + practices + api + cssNote, toc });
}

/* --- Foundation pages ------------------------------------------------------- */

/** One colour scale, as a table of stops and a grid of cards printed on the colour itself. */
function scaleSection(name) {
  const scale = tokens.scales[name];

  const rows = scale.steps.map((step) => ({
    level: step.level,
    name: `${name}/${step.level}`,
    hex: step.hex,
    oklch: step.oklch,
    // Retained: it decides whether the card's own label is legible on the swatch.
    onColor: step.contrast.fg,
  }));

  // Role and contrast are deliberately absent. This is the global ramp -- raw colour,
  // nothing else. A level's role is a decision the semantic layer makes per theme and is
  // shown once, in the inversion table; contrast is a property of a *pairing*, so quoting
  // a number against an assumed foreground would describe something this table does not
  // show.
  const columns = [
    { header: "Token", cell: (r) => tokenChip(r.name, { swatch: `var(--area-${name}-${r.level})` }) },
    { header: "Hex", cell: (r) => `<span class="docs-mono">${r.hex}</span>` },
    { header: "OKLCH", cell: (r) => `<span class="docs-mono">${escapeHtml(r.oklch)}</span>` },
    {
      header: "Preview",
      cell: (r) =>
        `<div class="docs-preview-cell"><span class="docs-token-chip" style="background:var(--area-${name}-${r.level})"></span></div>`,
    },
  ];

  return tokenSection({
    id: `scale-${name}`,
    title: name,
    description: tokens.scaleDescriptions[name],
    rows,
    columns,
    card: (r) =>
      tokenCard({
        name: r.name,
        onColor: true,
        style: `background:var(--area-${name}-${r.level});color:var(--area-${r.onColor === "#ffffff" ? "white" : "black"})`,
        meta: [r.hex, escapeHtml(r.oklch)],
      }),
  });
}

/** The slot -> level map, which is the whole of what a theme change does. */
function inversionSection() {
  const rows = Object.entries(tokens.inversion).map(([slot, pair]) => ({
    slot,
    light: pair.light,
    dark: pair.dark,
  }));

  const swatch = (level) =>
    `<span class="docs-token-chip" style="background:var(--area-neutral-${level})"></span>`;

  return tokenSection({
    id: "inversion",
    title: "The inversion",
    description:
      "Each slot reads one level in light and another in dark. This table is the only difference between the two themes.",
    rows,
    columns: [
      { header: "Slot", cell: (r) => `<span class="docs-mono">${escapeHtml(r.slot)}</span>` },
      { header: "Light", cell: (r) => tokenChip(String(r.light), { swatch: `var(--area-neutral-${r.light})` }) },
      { header: "Dark", cell: (r) => tokenChip(String(r.dark), { swatch: `var(--area-neutral-${r.dark})` }) },
      {
        header: "Preview",
        cell: (r) => `<div class="docs-preview-cell">${swatch(r.light)}${swatch(r.dark)}</div>`,
      },
    ],
    card: (r) =>
      tokenCard({
        name: r.slot,
        meta: [`light ${r.light}`, `dark ${r.dark}`],
        figure: `<div style="display:flex;inline-size:100%">${swatch(r.light)}${swatch(r.dark)}</div>`,
      }),
  });
}

function colorPage() {
  const semanticRows = Object.entries(tokens.semantics).map(([name, meta]) => ({
    name,
    resolves:
      meta.light !== undefined
        ? `${meta.role} ${meta.light} / ${meta.dark}`
        : (meta.role ? `${meta.role} ${meta.kind}` : meta.kind),
  }));

  const levels = tokens.levels.join(", ");

  const body = `<div class="docs-prose">
<p>The colours start from the <strong>Area palette</strong>, vendored verbatim — ${Object.keys(tokens.scales).length} families of ${tokens.levels.length} rungs. Area preserves that source and applies explicit, bounded refinements when it builds the global tokens: a light-end chroma trim, and a chromatic dark-end lightness/chroma curve. The palette was wall-anchored rather than formula-generated, with per-hue splines and hue held in IPT.</p>
<p>A rung is an ordinal position, not a measurement: <strong>higher is darker</strong>, the direction Tailwind, Material and Radix all read. The ladder is ${levels} — finer at the ends than through the middle, because that is where an interface spends its steps. 25/50/75 are three distinguishable page grounds and 925/950/975 three distinguishable dark ones, while the middle, where text and fills live, runs in 50s.</p>
<p>Each family's <code class="area-code">500</code> is pinned to a contrast wall rather than to a lightness, which is why the hues do not share a lightness at a shared rung — yellow's 500 sits lighter than indigo's because yellow has to. There are two walls: a <em>label</em> ladder that clears AA with white at 500, and a <em>glyph</em> ladder pinned at 3:1 whose white-label families reach AA at 600 or the next measured rung. Area finds each family's solid fill by measuring, so nothing here hardcodes which family is on which wall.</p>
<p>The three neutrals are one grey at every rung; <code class="area-code">neutral</code> is chroma 0, <code class="area-code">cool</code> carries hue 248, and <code class="area-code">warm</code> is cool mirrored exactly — 180° away in OKLCh — so neither can drift from the other. Only chroma differs, so contrast is near-invariant across all three: measured, lightness deviates by at most 0.0055 and a white-contrast ratio by at most 0.23:1.</p>
<p>Dark mode is the same ramp read from the other end. There is one set of colours, not two.</p>
</div>
${inversionSection()}
${Object.keys(tokens.scales).map(scaleSection).join("\n")}
${tokenSection({
  id: "semantic",
  title: "Semantic tokens",
  description:
    "The only colour vocabulary a component may use. Each one points at a role and a level per theme, never at a literal.",
  rows: semanticRows,
  columns: [
    { header: "Token", cell: (r) => tokenChip(`--area-${r.name}`, { swatch: `var(--area-${r.name})` }) },
    { header: "Resolves to", cell: (r) => `<span class="docs-mono">${escapeHtml(r.resolves)}</span>` },
    {
      header: "Preview",
      cell: (r) => `<div class="docs-preview-cell"><span class="docs-token-chip" style="background:var(--area-${r.name})"></span></div>`,
    },
  ],
  card: (r) =>
    tokenCard({
      name: `--area-${r.name}`,
      swatch: `var(--area-${r.name})`,
      meta: [escapeHtml(r.resolves)],
      figure: `<div style="inline-size:100%;block-size:var(--area-space-32);border-radius:var(--area-radius-small);background:var(--area-${r.name});box-shadow:inset 0 0 0 var(--area-border-width) var(--area-border-subtle)"></div>`,
    }),
})}
<h2 class="docs-h2" id="contrast">Contrast</h2>
<div class="docs-prose">
<p>Colour pairings are a build gate, not a review-time opinion. Every pairing a component can render is asserted under WCAG 2.2 and APCA across all 66 shipped theme combinations, and a failing colour cannot be published.</p>
<p>APCA is enforced as a hard gate in dark themes specifically, because the WCAG 2.x formula overstates contrast near black — a dark theme can clear 4.5:1 and still be unreadable.</p>
</div>`;

  return page({
    slug: "color",
    title: "Color",
    lede: "The Area palette, vendored: fourteen families of twenty-three rungs, anchored to contrast.",
    body,
    toc: [
      { id: "inversion", title: "The inversion" },
      ...Object.keys(tokens.scales).map((n) => ({ id: `scale-${n}`, title: n, nested: true })),
      { id: "semantic", title: "Semantic tokens" },
      { id: "contrast", title: "Contrast" },
    ],
  });
}

/** A specimen rendered at the value being documented. */
const AG = "Ag";

/**
 * Iconography.
 *
 * Reads the generated icon module rather than a hand-kept list, so the page cannot drift
 * from what the system actually ships -- the same rule every other foundation page follows.
 */
/**
 * The icon browser.
 *
 * A grid of every mark with the controls above it, the shape Phosphor's browser settled on
 * and the one a reader actually uses -- you arrive knowing roughly what you want and need to
 * see the field to find it, which a table of names cannot give you.
 *
 * Geometry comes from two sprites rather than inlined paths: 1,739 marks is 711 KB of path
 * data in one style, which is unservable per page and is cached once as a file. A cell is
 * therefore a `<use>` reference, and switching style swaps the href prefix rather than
 * loading both sets.
 *
 * Every cell is server-rendered. Filtering hides rather than builds, so the grid is complete
 * before the script runs and a reader with no JavaScript still gets the whole set.
 */
function iconBrowser() {
  const cell = (icon) =>
    `<button type="button" class="docs-icon" data-icon="${icon.name}" data-terms="${escapeHtml(icon.terms)}" data-source="${icon.source}" title="${escapeHtml(icon.name)}">
      <span class="docs-icon__mark" aria-hidden="true"><svg><use href="./icons.svg#${icon.id}"></use></svg></span>
      <span class="docs-icon__name">${escapeHtml(icon.name)}</span>
    </button>`;

  const styleItem = (value, label, selected) =>
    `<button type="button" role="radio" class="area-segmented__item" data-icon-style="${value}" aria-checked="${selected}"${selected ? " data-selected" : ""}><span class="area-segmented__label">${label}</span></button>`;

  const sourceChip = (value, label, selected) =>
    `<button type="button" class="area-chip area-chip--sm" data-icon-source="${value}" aria-pressed="${selected}"${selected ? " data-selected" : ""}><span class="area-chip__label">${label}</span></button>`;

  return `<div class="docs-iconbrowser" id="icon-browser" data-style="regular" data-source="all">
  <div class="docs-iconbrowser__bar">
    <div class="area-input area-input--sm docs-iconbrowser__search">
      <span class="area-input__icon" aria-hidden="true">${ICONS.search ?? ""}</span>
      <input class="area-input__control" type="search" placeholder="Search ${CATALOG.length.toLocaleString("en-US")} icons" aria-label="Search icons" data-icon-search>
    </div>
    <div class="area-segmented area-segmented--sm" role="radiogroup" aria-label="Style">
      ${styleItem("regular", "Regular", true)}${styleItem("filled", "Filled", false)}
    </div>
    <div class="area-chip-group" role="group" aria-label="Source">
      ${sourceChip("all", "All", true)}${sourceChip("area", "Area", false)}${sourceChip("fluent", "Fluent", false)}
    </div>
    <label class="docs-iconbrowser__size">
      <span class="area-field__label">Size</span>
      <span class="area-slider area-slider--sm" data-icon-size>
        <input type="range" class="area-slider__control" min="16" max="48" step="4" value="24" aria-label="Icon size">
        <span class="area-slider__value" data-icon-size-value>24</span>
      </span>
    </label>
    <span class="docs-iconbrowser__count" data-icon-count aria-live="polite"></span>
  </div>
  <div class="docs-iconbrowser__grid" data-icon-grid>${CATALOG.map(cell).join("")}</div>
  <p class="docs-iconbrowser__empty" data-icon-empty hidden>No icon matches that name.</p>
</div>`;
}

function iconographyPage() {
  const source = readFileSync(new URL("../src/icons.tsx", import.meta.url), "utf8");
  const rows = [...source.matchAll(/\/\*\* Fluent `([a-z0-9_]+)`\. \*\/\s*export const (\w+)/g)].map(
    ([, fluent, name]) => ({ name, fluent, svg: extractIcon(source, name) }),
  );

  // Read from the density axis rather than typed out. Hand-listing them named
  // `--area-icon-sm` as 12px when it is 16, which is the failure mode the whole
  // generate-the-docs rule exists to prevent.
  const USE = {
    "12px": "Dense chrome: a table row affordance, a chip dismiss.",
    "16px": "The default. Every inline icon beside a label.",
    "24px": "Standalone, where the icon is the whole affordance.",
  };
  const density = tokens.axes.find((a) => a.id === "ui").presets.find((p) => p.id === "default");
  const seen = new Map();
  for (const [token, value] of Object.entries(density.tokens)) {
    if (!/^--area-icon-/.test(token)) continue;
    if (!seen.has(value)) seen.set(value, token);
  }
  const sizes = [...seen.entries()]
    .map(([px, token]) => ({ token, px, use: USE[px] ?? "" }))
    .sort((a, b) => parseInt(a.px) - parseInt(b.px));

  const body = `<div class="docs-prose">
<p>Icons are <strong>Fluent System Icons</strong>, Microsoft's set, used at the 16px Regular cut, with twenty-nine marks drawn by <strong>Area</strong> for the panel vocabulary Fluent has no glyph for. Neither is drawn by hand here: <code class="area-code">gen-icons.mjs</code> generates the path data from <code class="area-code">@fluentui/svg-icons</code> and vendors Area's files verbatim, so an icon is the glyph its source ships rather than an approximation of it.</p>
<p>Fluent's marks are <em>filled</em> paths; Area's are <em>stroked</em>. That sounds like a contradiction and is not, because the rule the distinction stands in for is about <em>optical weight</em>, not about which SVG attribute carries the colour. An icon that has not been fitted to the set will not match it at any size. Area's were fitted by measurement — a 1-unit rule at 16, round terminals, and an ink box of 12 units for a rectilinear mark or 14 for a round one, which is exactly where Fluent's own square and round marks land. Draw a new stroked mark without that fitting and it will read a size wrong beside everything around it.</p>
<p>Both sets are optically corrected per size, which is why the 16px cut is used at 16px rather than scaling the 20 or 24 down to fit. And an icon never sets its own size: it fills the slot it sits in, and the slot takes its size from the density axis, so every icon in the system moves when density does.</p>
</div>
${tokenSection({
  id: "sizes",
  title: "Sizes",
  description:
    "Three, and nothing between them. VS Code's own token linter permits exactly 16 and 12 and notes that a codicon at 13, 14 or 15px is always a mistake for one of them; Octicons adds 24 for the standalone tier.",
  rows: sizes,
  columns: [
    { header: "Token", cell: (r) => tokenChip(r.token) },
    { header: "Size", cell: (r) => `<span class="docs-mono">${r.px}</span>` },
    { header: "Use", cell: (r) => escapeHtml(r.use) },
    {
      header: "Preview",
      cell: (r) =>
        `<div class="docs-preview-cell"><span style="display:inline-flex;inline-size:var(${r.token});block-size:var(${r.token})">${rows[0].svg}</span></div>`,
    },
  ],
  card: (r) =>
    tokenCard({
      name: r.token,
      meta: [r.px],
      figure: `<span style="display:inline-flex;inline-size:var(${r.token});block-size:var(${r.token})">${rows[0].svg}</span>`,
    }),
})}
<h2 class="docs-h2" id="set">The set</h2>
<div class="docs-prose">
<p>Every mark in the system, ${CATALOG.length.toLocaleString("en-US")} of them: Fluent's whole 16px cut, plus ${AREA_COUNT} Area marks for the panel vocabulary Fluent has no glyph for. Search by name, and switch style, source or size without leaving the grid.</p>
</div>
${iconBrowser()}
<h2 class="docs-h2" id="adding">Adding one</h2>
<div class="docs-prose">
<p>A Fluent mark needs an export name and its Fluent identifier in the map in <code class="area-code">gen-icons.mjs</code>, then a run of it. An Area mark needs its file dropped into <code class="area-code">assets/area-icons</code> and the same run — the generator reads the directory, so there is no list to keep in step. Nothing else is edited by hand: <code class="area-code">icons.tsx</code>, <code class="area-code">icons.catalog.mjs</code> and the two sprites are all generated output, and editing one directly is how the set drifts from its source.</p>
</div>
${codeBlock(`const MAP = {\n  PlusIcon: "add_16_regular",\n  // ...\n};`)}`;

  return page({
    slug: "iconography",
    title: "Iconography",
    lede: "Fluent System Icons at 16px with Area's panel marks beside them, generated rather than drawn, sized by the density axis.",
    body,
    toc: [
      { id: "sizes", title: "Sizes" },
      { id: "set", title: "The set" },
      { id: "adding", title: "Adding one" },
    ],
  });
}

/** Pull one icon's inline SVG out of the generated module, for rendering in the docs. */
function extractIcon(source, name) {
  const block = source.slice(source.indexOf(`export const ${name}`));
  const paths = [...block.slice(0, block.indexOf("</svg>")).matchAll(/<path d="([^"]+)"/g)];
  return `<svg viewBox="0 0 16 16" width="100%" height="100%" fill="currentColor" aria-hidden="true">${paths
    .map(([, d]) => `<path d="${d}"/>`)
    .join("")}</svg>`;
}

function typographyPage() {
  const preset = tokens.axes.find((a) => a.id === "ui").presets.find((p) => p.id === "default");
  const px = (token) => (preset.tokens[token] ?? "").replace(/var\(--area-(size|leading)-|\)/g, "");

  const groups = { text: [], title: [], display: [] };
  for (const name of Object.keys(preset.tokens)) {
    const m = name.match(/^--area-(text|title|display)-(\w+)-size$/);
    if (!m) continue;
    const [, group, step] = m;
    groups[group].push({
      group,
      step,
      size: px(`--area-${group}-${step}-size`),
      leading: px(`--area-${group}-${step}-leading`),
      tracking: preset.tokens[`--area-${group}-${step}-tracking`],
    });
  }
  for (const key of Object.keys(groups)) groups[key].sort((a, b) => a.size - b.size);

  const composite = (group, title, description) =>
    tokenSection({
      id: group,
      title,
      description,
      rows: groups[group],
      columns: [
        { header: "Token", cell: (r) => tokenChip(`${r.group}/${r.step}`) },
        { header: "Size", cell: (r) => `<span class="docs-mono">${r.size}px</span>` },
        { header: "Leading", cell: (r) => `<span class="docs-mono">${r.leading}px</span>` },
        { header: "Ratio", cell: (r) => `<span class="docs-mono">${(r.leading / r.size).toFixed(2)}</span>` },
        { header: "Tracking", cell: (r) => `<span class="docs-mono">${r.tracking}</span>` },
        {
          header: "Regular",
          cell: (r) => `<div style="font:var(--area-weight-regular) var(--area-${r.group}-${r.step}-size)/var(--area-${r.group}-${r.step}-leading) var(--area-font-sans);letter-spacing:var(--area-${r.group}-${r.step}-tracking)">${AG}</div>`,
        },
        {
          header: "Strong",
          cell: (r) => `<div style="font:var(--area-weight-strong) var(--area-${r.group}-${r.step}-size)/var(--area-${r.group}-${r.step}-leading) var(--area-font-sans);letter-spacing:var(--area-${r.group}-${r.step}-tracking)">${AG}</div>`,
        },
      ],
      card: (r) =>
        tokenCard({
          name: `${r.group}/${r.step}`,
          meta: [`${r.size}px / ${r.leading}px / ${r.tracking}`],
          figure: `<div style="font:var(--area-weight-regular) var(--area-${r.group}-${r.step}-size)/var(--area-${r.group}-${r.step}-leading) var(--area-font-sans);letter-spacing:var(--area-${r.group}-${r.step}-tracking)">${AG}</div>`,
        }),
    });

  const primitive = (id, title, description, ramp, unit, style) =>
    tokenSection({
      id,
      title,
      description,
      rows: ramp.map((value) => ({ value })),
      columns: [
        { header: "Token", cell: (r) => tokenChip(`${id}/${r.value}`) },
        { header: "Value", cell: (r) => `<span class="docs-mono">${r.value}${unit}</span>` },
        { header: "Preview", cell: (r) => `<div class="docs-preview-cell"><div style="${style(r.value)}">${AG}</div></div>` },
      ],
      card: (r) =>
        tokenCard({
          name: `${id}/${r.value}`,
          meta: [`Value: ${r.value}${unit}`],
          figure: `<div style="${style(r.value)}">${AG}</div>`,
        }),
    });

  const body = `<div class="docs-prose">
<p><strong>Weight is orthogonal to role.</strong> A role sets size, leading and tracking — it does not set weight. That is what makes large text at a regular weight possible: a 20px paragraph rather than a 20px heading. A ramp with weight baked into the role cannot express that at all.</p>
<p><strong>Two weights, not three.</strong> Regular at 400 and strong at 500, in every preset. Every composite below exists in both, which is why each row shows both.</p>
<p>Composites point at the primitive ramps rather than at literals, so the scale presets move by whole steps rather than multiplying — which is what keeps every preset on the ramp instead of landing on 12.25px.</p>
</div>
${composite("text", "Text", "Anything read as prose or rendered inside a control. Leading runs 1.33 to 1.5, rising with size. The 16px step is the size this ramp is meant to be read at; controls take 14px, the split Notion uses between content and chrome.")}
${composite("title", "Title", "Headings, from a card's to a page's. The same sizes as the upper half of the text ramp, but with tighter leading and real negative tracking, because a title is one or two lines and a paragraph is not.")}
${composite("display", "Display", "Hero type, at a leading ratio of 1.0. Tracking stops at -0.03em: Inter's published metrics curve asymptotes at -0.0223em, so anything beyond roughly -0.03em is a stylistic choice rather than an optical correction.")}
${primitive(
  "size",
  "Size",
  `${tokens.sizeRamp.length} pixel stops from ${tokens.sizeRamp[0]} to ${tokens.sizeRamp.at(-1)}, referenced by every composite.`,
  tokens.sizeRamp,
  "px",
  (v) => `font-size:var(--area-size-${v});line-height:1.1`,
)}
${primitive(
  "leading",
  "Line height",
  `${tokens.leadingRamp.length} pixel stops from ${tokens.leadingRamp[0]} to ${tokens.leadingRamp.at(-1)}, which composites pair with a size by ratio.`,
  tokens.leadingRamp,
  "px",
  (v) => `line-height:var(--area-leading-${v});background:var(--area-accent-surface);display:inline-block`,
)}
${primitive(
  "wght",
  "Weight",
  `${tokens.wghtRamp.length} stops named by their OpenType wght value. The half-steps exist because Geist is variable; a platform font cannot reach them.`,
  tokens.wghtRamp,
  "",
  (v) => `font-weight:var(--area-wght-${v});font-size:var(--area-size-24)`,
)}
${tokenSection({
  id: "weights",
  title: "Semantic weights",
  description:
    "Two, and only two. Material ships a parallel emphasized scale that is a uniform one-step increase on the variable weight axis; this is the same idea with one token instead of a second ramp.",
  rows: [
    { name: "weight/regular", geist: 400, system: 400, use: "Body copy, and any text being read rather than scanned." },
    { name: "weight/strong", geist: 500, system: 500, use: "Titles, control labels, and emphasis within text. Not long-form copy." },
  ],
  columns: [
    { header: "Token", cell: (r) => tokenChip(r.name) },
    { header: "Geist", cell: (r) => `<span class="docs-mono">${r.geist}</span>` },
    { header: "System", cell: (r) => `<span class="docs-mono">${r.system}</span>` },
    { header: "Use", cell: (r) => escapeHtml(r.use) },
    {
      header: "Preview",
      cell: (r) => `<div class="docs-preview-cell"><div style="font-weight:${r.geist};font-size:var(--area-size-20)">${AG}</div></div>`,
    },
  ],
  card: (r) =>
    tokenCard({
      name: r.name,
      meta: [`Geist: ${r.geist}`, `System: ${r.system}`],
      figure: `<div style="font-weight:${r.geist};font-size:var(--area-size-32)">${AG}</div>`,
    }),
})}`;

  return page({
    slug: "typography",
    title: "Typography",
    lede: "Three roles, two weights, and every size available in both.",
    body,
    toc: [
      { id: "text", title: "Text" },
      { id: "title", title: "Title" },
      { id: "display", title: "Display" },
      { id: "size", title: "Size" },
      { id: "leading", title: "Line height" },
      { id: "wght", title: "Weight" },
      { id: "weights", title: "Semantic weights" },
    ],
  });
}

function axisPresetTable(axisId) {
  const axis = tokens.axes.find((a) => a.id === axisId);
  return table(
    ["Preset", "Attribute", "Description"],
    axis.presets.map((p) => [
      escapeHtml(p.label) + (p.id === axis.defaultPreset ? " (default)" : ""),
      `<span class="docs-mono" style="color:var(--area-fg-accent)">${axis.attribute}="${p.id}"</span>`,
      escapeHtml(p.description),
    ]),
  );
}

function specimen(name, figure, meta) {
  return `<div class="docs-specimen">
  <span class="docs-specimen__name">${escapeHtml(name)}</span>
  <div class="docs-specimen__figure">${figure}</div>
  ${meta ? `<span class="docs-specimen__name">${escapeHtml(meta)}</span>` : ""}
</div>`;
}

function specimenGrid(items) {
  return `<div class="docs-specimen-grid">${items.join("")}</div>`;
}

/** Tier values for the current density preset, read from the token data. */
function densityRows(presetId) {
  const axis = tokens.axes.find((a) => a.id === "ui");
  const preset = axis.presets.find((p) => p.id === presetId);
  return ["xs", "sm", "md", "lg", "xl"].map((tier) => ({
    tier,
    height: preset.tokens[`--area-control-${tier}`],
    gutter: preset.tokens[`--area-gutter-${tier}`],
    icon: preset.tokens[`--area-icon-${tier}`],
    gap: preset.tokens[`--area-gap-${tier}`],
    text: (preset.tokens[`--area-control-${tier}-text`] ?? "").replace(/var\(--area-size-|\)/g, "") + "px",
  }));
}

function uiScalePage() {
  const rows = densityRows("default");
  const compact = densityRows("compact");

  const body = `<div class="docs-prose">
<p>UI scale is one deliberate product choice, not separate type and density switches. It changes reading type, UI type, control heights, icons, internal padding, and gaps together.</p>
<p><strong>Default</strong> uses 16px reading text, 14px UI text, and 32px medium controls: the common Primer and Geist baseline. <strong>Compact</strong> uses 14px reading text, 13px UI text, and 28px medium controls, matching dense tool interfaces such as Notion.</p>
<p>There is intentionally no spacious preset. Primer documents a spacious spacing mode, but it is not a different product-scale baseline; browser zoom and text-resize support remain the accessible way to enlarge an interface.</p>
</div>
${tokenSection({
  id: "tiers",
  title: "Control tiers",
  description: "Every dimension a control needs across the shared internal ramp, in both presets.",
  rows,
  columns: [
    { header: "Token", cell: (r) => tokenChip(`control/${r.tier}`) },
    { header: "Compact", cell: (r) => `<span class="docs-mono">${compact.find((c) => c.tier === r.tier).height}</span>` },
    { header: "Default", cell: (r) => `<span class="docs-mono">${r.height}</span>` },
    { header: "Type", cell: (r) => `<span class="docs-mono">${compact.find((c) => c.tier === r.tier).text} / ${r.text}</span>` },
    { header: "Padding", cell: (r) => `<span class="docs-mono">${r.gutter}</span>` },
    { header: "Icon", cell: (r) => `<span class="docs-mono">${r.icon}</span>` },
    { header: "Gap", cell: (r) => `<span class="docs-mono">${r.gap}</span>` },
    {
      header: "Preview",
      cell: (r) =>
        `<div class="docs-preview-cell"><div class="docs-specimen__box" style="inline-size:var(--area-space-64);block-size:var(--area-control-${r.tier});border-radius:var(--area-radius-control)"></div></div>`,
    },
  ],
  card: (r) =>
    tokenCard({
      name: `control/${r.tier}`,
      meta: [`${r.height} tall · ${r.text} type`, `${r.gutter} padding · ${r.icon} icon · ${r.gap} gap`],
      figure: `<div class="docs-specimen__box" style="inline-size:100%;block-size:var(--area-control-${r.tier});border-radius:var(--area-radius-control)"></div>`,
    }),
})}
${tokenSection({
  id: "spacing",
  title: "Spacing",
  description:
    "Fixed primitives, named by their pixel value. UI scale chooses which steps components use; it never silently rescales the ramp.",
  rows: tokens.spaceRamp.map((value) => ({ value })),
  columns: [
    { header: "Token", cell: (r) => tokenChip(`spacing/${r.value}`) },
    { header: "Value", cell: (r) => `<span class="docs-mono">${r.value}px</span>` },
    {
      header: "Preview",
      cell: (r) =>
        `<div class="docs-preview-cell"><div class="docs-specimen__box" style="inline-size:var(--area-space-${r.value});block-size:var(--area-space-16);border-radius:var(--area-radius-2)"></div></div>`,
    },
  ],
  card: (r) =>
    tokenCard({
      name: `spacing/${r.value}`,
      meta: [`Value: ${r.value}px`],
      figure: `<div class="docs-specimen__box" style="inline-size:var(--area-space-${r.value});block-size:var(--area-space-24);border-radius:var(--area-radius-2)"></div>`,
    }),
})}
${tokenSection({
  id: "icon",
  title: "Icon sizes",
  description: "One per control tier. 16px holds through the middle of the range, which is the near-universal inline icon size.",
  rows,
  columns: [
    { header: "Token", cell: (r) => tokenChip(`icon/${r.tier}`) },
    { header: "Value", cell: (r) => `<span class="docs-mono">${r.icon}</span>` },
    {
      header: "Preview",
      cell: (r) =>
        `<div class="docs-preview-cell"><div class="docs-specimen__box" style="inline-size:var(--area-icon-${r.tier});block-size:var(--area-icon-${r.tier});border-radius:var(--area-radius-2)"></div></div>`,
    },
  ],
  card: (r) =>
    tokenCard({
      name: `icon/${r.tier}`,
      meta: [`Value: ${r.icon}`],
      figure: `<div class="docs-specimen__box" style="inline-size:var(--area-icon-${r.tier});block-size:var(--area-icon-${r.tier});border-radius:var(--area-radius-2)"></div>`,
    }),
})}
<h2 class="docs-h2" id="presets">Presets</h2>
${axisPresetTable("ui")}`;

  return page({
    slug: "ui-scale",
    title: "UI scale",
    lede: "Curated type and control geometry for compact or default products.",
    body,
    toc: [
      { id: "tiers", title: "Control tiers" },
      { id: "spacing", title: "Spacing" },
      { id: "icon", title: "Icon sizes" },
      { id: "presets", title: "Presets" },
    ],
  });
}

function radiusPage() {
  const axis = tokens.axes.find((a) => a.id === "radius");

  const body = `<div class="docs-prose">
<p>Radius is a named visual family, not a component-size alias. The default <code class='area-code'>standard</code> family is 6px on a small Button, 8px on a medium Button, and 10px on a large Button. Same-size icon-only and text Buttons always share that exact corner.</p>
<p>Compact UI keeps the same family but applies a tighter safe cap to the smaller 20–36px ladder. Containers and small nested shapes retain their own semantic steps, so a 12px dialog corner does not force a 12px button corner.</p>
</div>
${tokenSection({
  id: "presets",
  title: "Presets",
  description: "Each preset sets three radii: controls, containers, and small nested shapes.",
  rows: axis.presets.map((p) => ({
    id: p.id,
    label: p.label,
    control: p.tokens["--area-radius-control"],
    container: p.tokens["--area-radius-container"],
    small: p.tokens["--area-radius-small"],
    isDefault: p.id === axis.defaultPreset,
  })),
  columns: [
    { header: "Preset", cell: (r) => tokenChip(`radius/${r.id}`) },
    { header: "Control", cell: (r) => `<span class="docs-mono">${r.control}</span>` },
    { header: "Container", cell: (r) => `<span class="docs-mono">${r.container}</span>` },
    { header: "Small", cell: (r) => `<span class="docs-mono">${r.small}</span>` },
    {
      header: "Preview",
      cell: (r) =>
        `<div class="docs-preview-cell"><div class="docs-specimen__box" data-area-radius="${r.id}" style="inline-size:var(--area-space-24);block-size:var(--area-space-24);border-radius:var(--area-radius-control)"></div></div>`,
    },
  ],
  card: (r) =>
    tokenCard({
      name: `radius/${r.id}${r.isDefault ? " (default)" : ""}`,
      meta: [`Control: ${r.control}`, `Container: ${r.container}`],
      figure: `<div class="docs-specimen__box" data-area-radius="${r.id}" style="inline-size:var(--area-control-xl);block-size:var(--area-control-xl);border-radius:var(--area-radius-control)"></div>`,
    }),
})}
${tokenSection({
  id: "ramp",
  title: "Radius ramp",
  description: "Fixed primitives, named by their pixel value, from which the presets draw.",
  rows: tokens.radiusRamp.map((value) => ({ value })),
  columns: [
    { header: "Token", cell: (r) => tokenChip(`radius/${r.value}`) },
    { header: "Value", cell: (r) => `<span class="docs-mono">${r.value}px</span>` },
    {
      header: "Preview",
      cell: (r) =>
        `<div class="docs-preview-cell"><div class="docs-specimen__box" style="inline-size:var(--area-space-24);block-size:var(--area-space-24);border-radius:var(--area-radius-${r.value})"></div></div>`,
    },
  ],
  card: (r) =>
    tokenCard({
      name: `radius/${r.value}`,
      meta: [`Value: ${r.value}px`],
      figure: `<div class="docs-specimen__box" style="inline-size:var(--area-space-48);block-size:var(--area-space-48);border-radius:var(--area-radius-${r.value})"></div>`,
    }),
})}`;

  return page({
    slug: "radius",
    title: "Radius",
    lede: "How rounded controls and containers are.",
    body,
    toc: [
      { id: "presets", title: "Presets" },
      { id: "ramp", title: "Radius ramp" },
    ],
  });
}

function surfacePage() {
  const axis = tokens.axes.find((a) => a.id === "surface");
  const current = axis.presets.find((p) => p.id === axis.defaultPreset);
  const ELEVATION = ["resting", "raised", "floating", "modal"];

  const body = `<div class="docs-prose">
<p>Elevation uses negative spread so a shadow reads as lift rather than as a grey halo. Shadow colour is its own token, so a dark theme can deepen it — a shadow authored as flat black disappears on a dark surface.</p>
</div>
${tokenSection({
  id: "elevation",
  title: "Elevation",
  description: "Four levels, each named for what sits at it.",
  rows: [1, 2, 3, 4].map((level) => ({
    level,
    use: ELEVATION[level - 1],
    value: current.tokens[`--area-shadow-${level}`],
  })),
  columns: [
    { header: "Token", cell: (r) => tokenChip(`shadow/${r.level}`) },
    { header: "Use", cell: (r) => escapeHtml(r.use) },
    { header: "Value", cell: (r) => `<span class="docs-mono">${escapeHtml(r.value)}</span>` },
    {
      header: "Preview",
      cell: (r) =>
        `<div class="docs-preview-cell"><div style="inline-size:var(--area-space-32);block-size:var(--area-space-32);border-radius:var(--area-radius-small);background:var(--area-bg-surface);box-shadow:var(--area-shadow-${r.level})"></div></div>`,
    },
  ],
  card: (r) =>
    tokenCard({
      name: `shadow/${r.level}`,
      meta: [escapeHtml(r.use)],
      figure: `<div style="inline-size:var(--area-control-xl);block-size:var(--area-control-xl);border-radius:var(--area-radius-container);background:var(--area-bg-surface);box-shadow:var(--area-shadow-${r.level})"></div>`,
    }),
})}
${tokenSection({
  id: "stroke",
  title: "Stroke and ring",
  description: "Border weight, and the geometry of the focus ring every component shares.",
  rows: [
    { name: "border/width", token: "--area-border-width", value: current.tokens["--area-border-width"] },
    { name: "focus/width", token: "--area-focus-width", value: baseTokens()["--area-focus-width"] },
    { name: "focus/offset", token: "--area-focus-offset", value: baseTokens()["--area-focus-offset"] },
  ].filter((r) => r.value),
  columns: [
    { header: "Token", cell: (r) => tokenChip(r.name) },
    { header: "Value", cell: (r) => `<span class="docs-mono">${r.value}</span>` },
    {
      header: "Preview",
      cell: (r) =>
        `<div class="docs-preview-cell"><div style="inline-size:var(--area-space-32);block-size:var(--area-space-20);border-radius:var(--area-radius-small);border:var(${r.token}) solid var(--area-border)"></div></div>`,
    },
  ],
  card: (r) =>
    tokenCard({
      name: r.name,
      meta: [`Value: ${r.value}`],
      figure: `<div style="inline-size:100%;block-size:var(--area-space-32);border-radius:var(--area-radius-small);border:var(${r.token}) solid var(--area-border)"></div>`,
    }),
})}
<h2 class="docs-h2" id="presets">Presets</h2>
${axisPresetTable("surface")}`;

  return page({
    slug: "surface",
    title: "Surface",
    lede: "Stroke weight and elevation.",
    body,
    toc: [
      { id: "elevation", title: "Elevation" },
      { id: "stroke", title: "Stroke and ring" },
      { id: "presets", title: "Presets" },
    ],
  });
}

function motionPage() {
  const axis = tokens.axes.find((a) => a.id === "motion");
  const current = axis.presets.find((p) => p.id === axis.defaultPreset);
  const durations = Object.keys(current.tokens).filter((k) => k.includes("-duration-"));
  const easings = Object.keys(current.tokens).filter((k) => k.includes("-ease-"));

  const body = `<div class="docs-prose">
<p>Every preset keeps the same token names, so no component ever branches on motion. The <code class='area-code'>none</code> preset sets durations to zero rather than removing transitions, which lets it double as the target for <code class='area-code'>prefers-reduced-motion</code>.</p>
</div>
${tokenSection({
  id: "durations",
  title: "Durations",
  description: "Four steps, shown across every preset so the presets can be compared directly.",
  rows: durations.map((token) => ({ token, name: token.replace("--area-duration-", "duration/") })),
  columns: [
    { header: "Token", cell: (r) => tokenChip(r.name) },
    ...axis.presets.map((p) => ({
      header: p.label,
      cell: (r) => `<span class="docs-mono">${p.tokens[r.token]}</span>`,
    })),
    {
      header: "Preview",
      cell: (r) =>
        `<div class="docs-preview-cell"><div class="docs-specimen__box" style="inline-size:var(--area-space-48);block-size:var(--area-space-8);border-radius:var(--area-radius-full);transition:inline-size var(${r.token}) var(--area-ease-out)"></div></div>`,
    },
  ],
  card: (r) =>
    tokenCard({
      name: r.name,
      meta: axis.presets.map((p) => `${p.label}: ${p.tokens[r.token]}`),
    }),
})}
${tokenSection({
  id: "easings",
  title: "Easings",
  description: "Five curves. Spring overshoots, so it is for elements that enter, never for colour.",
  rows: easings.map((token) => ({ token, name: token.replace("--area-ease-", "easing/"), value: current.tokens[token] })),
  columns: [
    { header: "Token", cell: (r) => tokenChip(r.name) },
    { header: "Value", cell: (r) => `<span class="docs-mono">${escapeHtml(r.value)}</span>` },
  ],
  card: (r) => tokenCard({ name: r.name, meta: [escapeHtml(r.value)] }),
})}
<h2 class="docs-h2" id="presets">Presets</h2>
${axisPresetTable("motion")}`;

  return page({
    slug: "motion",
    title: "Motion",
    lede: "How long transitions take.",
    body,
    toc: [
      { id: "durations", title: "Durations" },
      { id: "easings", title: "Easings" },
      { id: "presets", title: "Presets" },
    ],
  });
}

function axesPage() {
  const body = `<div class="docs-prose">
<p>Area is built around seven axes. Each one is a dimension you can retune, each ships a small set of presets, and choosing one is a single data attribute on the root element.</p>
<p>The rule that makes seven axes composable rather than a matrix of thousands of combinations is that no two axes write the same custom property. That is checked mechanically on every build — if two axes ever collide, the build stops.</p>
<p>Because custom properties inherit, a subtree can carry its own axis values. A sidebar marked <code class='area-code'>data-area-ui="compact"</code> gets the complete compact package without any component knowing it happened.</p>
</div>
<h2 class="docs-h2" id="usage">Usage</h2>
${codeBlock(`<html data-area-theme="dark" data-area-accent="purple" data-area-ui="compact">`)}
<h2 class="docs-h2" id="scopes">Nested themes</h2>
<p class="docs-note">CSS attributes inherit independently. A light boundary keeps its inherited neutral and accent; changing either role inside dark keeps the dark scheme. Color pairs require CSS light-dark() support. <a href="./scopes.html">Inspect the browser scope checks.</a></p>
<p class="docs-note">React Theme inherits from the nearest React Theme and emits all seven axis attributes, including inside a portal. Its root starts at Area defaults. Pass the host selection explicitly when integrating with a surrounding CSS-only theme.</p>
${exampleBlock({demo:"ThemeNested",id:"react-theme",title:"A light preview inside a dark workspace"})}
${tokens.axes
  .map(
    (a) => `<h2 class="docs-h2" id="${a.id}">${escapeHtml(a.label)}</h2>
<p class="docs-note">${escapeHtml(a.description)} Owns ${a.namespaces.length} namespace${a.namespaces.length === 1 ? "" : "s"}, ${a.presets.length} preset${a.presets.length === 1 ? "" : "s"}.</p>
${axisPresetTable(a.id)}`,
  )
  .join("")}`;

  return page({
    slug: "axes",
    title: "Axes",
    lede: "Seven independent dimensions, each one data attribute away.",
    body,
    toc: [{ id: "usage", title: "Usage" }, { id: "scopes", title: "Nested themes" }, ...tokens.axes.map((a) => ({ id: a.id, title: a.label }))],
  });
}

function indexPage() {
  const body = `<div class="docs-prose">
<p>Area is a component library built on shared tokens, with seven customization axes: theme, neutral, accent, UI scale, radius, surface and motion. Components consume only semantic tokens, so changing an axis reflows the whole system without touching a single component.</p>
<p>The default medium control is 32px with 14/20 text. Radius uses named visual families: <code class='area-code'>standard</code> gives an 8px medium control and 12px container, while <code class='area-code'>rotund</code> reaches 12px at medium. Each family has a tier curve; compact UI applies a tighter cap so smaller controls do not become lozenges.</p>
</div>
<h2 class="docs-h2" id="install">Installation</h2>
${codeBlock("npm install @area/react @area/styles")}
<h2 class="docs-h2" id="start">Getting started</h2>
${codeBlock(`import { Button } from "@area/react";\nimport "@area/styles/area.css";\n\nexport default function App() {\n  return <Button>Get started</Button>;\n}`)}
<h2 class="docs-h2" id="defaults">Defaults</h2>
<p class="docs-note">Use the shared axis controls to change every component together. UI scale combines typography and density; theme handles light and dark mode. Component variants describe treatment, meaning, size, state and composition.</p>
<p class="docs-note">All ${[...COMPLETE_COMPONENTS].map(slug => COMPONENT_PAGES.find(page => page.slug === slug).name).join(", ")} are owner-confirmed complete. Refining a family reopens it as in review; see the <a href="./gallery.html">component gallery</a>.</p>
<h2 class="docs-h2" id="principles">Principles</h2>
<div class="docs-prose">
<p><strong>Every number traces to a token.</strong> A control's corner radius comes from the radius preset and is capped against its height; a menu item's radius is its panel's radius less the panel's padding, floored at zero and capped against the row. These relationships stay true under every combination of axes.</p>
<p><strong>Contrast is a test gate.</strong> The test suite checks colour pairings under WCAG 2.2 across all 66 shipped themes, with APCA also enforced in dark themes. Documented exceptions are tracked separately. Run the tests as well as the build before releasing.</p>
<p><strong>One shared variant contract.</strong> CSS and typed React helpers share a manifest. The build checks selector parity; component behavior and wrapper markup still need verification.</p>
<p><strong>Documentation cannot lie.</strong> Every preview on this site is the real component rendered, and every snippet is that same demo's source.</p>
</div>`;

  return page({
    slug: "index",
    title: "Area",
    lede: "A customizable component library built on shared tokens.",
    body,
    toc: [
      { id: "install", title: "Installation" },
      { id: "start", title: "Getting started" },
      { id: "defaults", title: "Defaults" },
      { id: "principles", title: "Principles" },
    ],
  });
}

/* --- Emit ------------------------------------------------------------------- */

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(repo, "packages/styles/dist/area.css"), join(out, "area.css"));
// The two sprites the icon browser references. Assets rather than inlined markup; see
// iconBrowser() for why.
cpSync(join(root, "assets/icons.svg"), join(out, "icons.svg"));
cpSync(join(root, "assets/icons-filled.svg"), join(out, "icons-filled.svg"));
cpSync(join(root, "public"), out, { recursive: true });

const pages = [
  ["axes.html", axesPage()],
  // The documentation site is hidden for now: its entry points redirect to the gallery.
  ["index.html", redirectPage("gallery-components.html")],
  ["gallery.html", redirectPage("gallery-components.html")],
  ["gallery-components.html", galleryPage()],
  ["gallery-typeRamp.html", galleryShell({ current: "gallery-typeRamp.html", title: "Type ramp", body: `<div class="docs-gallery-foundation">${bodyOf(typographyPage)}</div>` })],
  ["gallery-icons.html", galleryShell({ current: "gallery-icons.html", title: "Icons", body: iconExploreSection() + iconReviewPage() })],
  ["gallery-iconography.html", galleryShell({ current: "gallery-iconography.html", title: "Iconography", body: iconReviewSections() + `<div class="docs-gallery-foundation">${bodyOf(iconographyPage)}</div>` })],
  ["gallery-color.html", galleryShell({ current: "gallery-color.html", title: "Color", body: `<div class="docs-gallery-foundation">${bodyOf(colorPage)}</div>` })],
  ["gallery-scale.html", galleryShell({ current: "gallery-scale.html", title: "UI scale", body: `<div class="docs-gallery-foundation">${bodyOf(uiScalePage)}</div>` })],
  ["gallery-radius.html", galleryShell({ current: "gallery-radius.html", title: "Radius", body: `<div class="docs-gallery-foundation">${bodyOf(radiusPage)}</div>` })],
  ["gallery-surface.html", galleryShell({ current: "gallery-surface.html", title: "Surface", body: `<div class="docs-gallery-foundation">${bodyOf(surfacePage)}</div>` })],
  ["gallery-motion.html", galleryShell({ current: "gallery-motion.html", title: "Motion", body: `<div class="docs-gallery-foundation">${bodyOf(motionPage)}</div>` })],
  ["color.html", colorPage()],
  ["ui-scale.html", uiScalePage()],
  ["iconography.html", iconographyPage()],
  ["radius.html", radiusPage()],
  ["surface.html", surfacePage()],
  ["motion.html", motionPage()],
  ...COMPONENT_PAGES.map((spec) => [`${spec.slug}.html`, componentPage(spec)]),
];

for (const [name, html] of pages) writeFileSync(join(out, name), html, "utf8");

const labPageCount = await buildLab(root, out, DOCS_CSS);
buildInsetFixture(out, repo);

console.log(`\n  @area/docs\n`);
console.log(`  ${pages.length + labPageCount + 2} pages, ${Object.keys(demos).length} demos`);
console.log(`  dist/ -> ${out}\n`);

await (await import("esbuild")).build({ entryPoints: [join(root, "src/badge-client.tsx")], outfile: join(out, "badge-demos.js"), bundle: true, platform: "browser", format: "esm", jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' } });

await (await import("esbuild")).build({ entryPoints: [join(root, "src/switch-client.tsx")], outfile: join(out, "switch-demos.js"), bundle: true, platform: "browser", format: "esm", jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' } });
await (await import("esbuild")).build({ entryPoints: [join(root, "src/slider-client.tsx")], outfile: join(out, "slider-demos.js"), bundle: true, platform: "browser", format: "esm", jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' } });
await (await import("esbuild")).build({ entryPoints: [join(root, "src/number-field-client.tsx")], outfile: join(out, "number-field-demos.js"), bundle: true, platform: "browser", format: "esm", jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' } });
await (await import("esbuild")).build({ entryPoints: [join(root, "src/chip-client.tsx")], outfile: join(out, "chip-demos.js"), bundle: true, platform: "browser", format: "esm", jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' } });
await (await import("esbuild")).build({ entryPoints: [join(root, "src/alert-client.tsx")], outfile: join(out, "alert-demos.js"), bundle: true, platform: "browser", format: "esm", jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' } });
await (await import("esbuild")).build({ entryPoints: [join(root, "src/avatar-client.tsx")], outfile: join(out, "avatar-demos.js"), bundle: true, platform: "browser", format: "esm", jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' } });
await (await import("esbuild")).build({ entryPoints: [join(root, "src/code-block-client.tsx")], outfile: join(out, "code-block-demos.js"), bundle: true, platform: "browser", format: "esm", jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' } });
await (await import("./build-switch-fixture.mjs")).buildSwitchFixture(root, out);
