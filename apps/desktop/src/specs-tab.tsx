/**
 * A family's Specs tab (plan F7, owner-approved 2026-11-11; RD5): the family's measurements at the current settings and
 * at Area's shipped defaults, read off the family's own specimens, never written per family.
 *
 *   Measurements   height, each side as border + shell + slot (with and without a leading icon), the icon box and its
 *                  gap to the label, corner and stroke, with the tokens each value equals; then the same for each part
 *                  that draws a box of its own (a Menu's rows, a Dialog's header)
 *   Type           each text part's size / line, weight and ink
 *   State tokens   the tokens rest, hover, pressed, selected, focus and disabled paint with, per variant
 *
 * The specimens are the family's gallery tiles (its Default, its Sizes, its Variants and the tiles that lead with an
 * icon), drawn by their own demos on a bench out of sight: one copy in the specimens' scope (the Inspector's settings,
 * src/specimen-scope.tsx), one in Area's defaults (every setting written out, so the app's chosen look can't reach it).
 * The bench has no zoom, so every length is the component's own CSS px. src/specs-measure.ts reads them; a value it
 * can't read (no icon in any specimen, a state no rule paints) is a row left out. Settings, the mode and the tiles'
 * demos re-measure on change.
 */
import { Component, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Code, EmptyState, Segmented } from "@area/react";
import SOURCES from "virtual:component-sources";
import { DataTable, Section, stylesheetOf, type FamilyInfo } from "./family-tabs.tsx";
import { specimenScope } from "./specimen-scope.tsx";
import { LibrarySpecimens } from "./inventory.tsx";
import { CANVAS_DEFAULTS, canvasAttributes } from "./studio.tsx";
import { MATERIAL_DEFAULT } from "./material.ts";
import { appScale } from "./app-scale.ts";
import { TOKEN_LIST, readValues } from "./token-catalog.ts";
import {
  candidates, fmt, hasStatePaint, PAINT_PARTS, readBox, readStates, readType, sideText, stateHooks, STATES, TokenIndex,
  type BoxReading, type Side, type StateId, type StatePaint, type TypeReading,
} from "./specs-measure.ts";

/** A tile the bench draws: its gallery id, label, group and demo. */
export interface SpecimenTile { id: string; label: string; group: string; demo: string }

type ScopeId = "current" | "defaults";
const SCOPES: ScopeId[] = ["current", "defaults"];

/** Area's shipped defaults, every setting written, so the specimen ignores the app's chosen look and the Inspector. Made
 * on first use: studio.tsx and this module import each other, so its defaults aren't there while this one loads. */
let defaultScope: Record<string, string> | undefined;
const DEFAULT_SCOPE = () => defaultScope ??= Object.fromEntries(Object.entries(canvasAttributes(CANVAS_DEFAULTS, MATERIAL_DEFAULT)).filter(([, value]) => value !== undefined)) as Record<string, string>;

/** One demo failing to render leaves its specimen out rather than the tab. */
class Quiet extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  override render() { return this.state.failed ? null : this.props.children; }
}

interface PartReading { part: string; box: BoxReading }
interface ScopeReading {
  /** The root's box per size value ("" where the family has no size axis). */
  sizes: Record<string, { box: BoxReading; type: TypeReading[]; parts: PartReading[] }>;
  /** A specimen at the default size that leads with an icon. */
  icon?: BoxReading;
}
interface Reading {
  scopes: Partial<Record<ScopeId, ScopeReading>>;
  /** The element that carries the family's interaction: the root, or the part whose rules paint its hover. */
  stateTarget: string;
  /** State paint per variant ("" where the family has no variant axis), at the current settings. */
  states: Array<{ variant: string; paint: Partial<Record<StateId, StatePaint>> }>;
  /** The tiles measured, by label. */
  measured: string[];
}

const words = (name: string) => name[0]!.toUpperCase() + name.slice(1).replaceAll("-", " ");
const SIZE_WORDS: Record<string, string> = { xs: "Extra small", sm: "Small", md: "Medium", lg: "Large", xl: "Extra large" };

/** The value of `axis` a specimen's root carries, from its modifier class or its data attribute. */
function valueOf(root: Element, block: string, values: readonly string[], axis: string): string | undefined {
  return values.find(value => root.classList.contains(`${block}--${value}`)) ?? (root.getAttribute(`data-${axis}`) ?? undefined);
}

function measure(bench: HTMLElement, family: FamilyInfo, tiles: SpecimenTile[]): Reading | null {
  const manifest = family.manifest;
  if (!manifest) return null;
  const block = manifest.block;
  const sheet = stylesheetOf(family.slug, block);
  const read = new Set<string>(sheet ? [...(SOURCES.css[sheet] ?? "").matchAll(/var\((--area-[\w-]+)/g)].map(match => match[1]!) : []);
  const tokenList = [...candidates(TOKEN_LIST, read, "color"), ...candidates(TOKEN_LIST, read, "length")];
  const sizes = manifest.variants.size ?? [];
  const variants = manifest.variants.variant ?? [];
  const tones = manifest.variants.tone ?? [];
  const reading: Reading = { scopes: {}, stateTarget: "root", states: [], measured: [] };
  const measured = new Set<string>();
  for (const scope of SCOPES) {
    const holder = bench.querySelector<HTMLElement>(`[data-specs-scope="${scope}"]`);
    if (!holder) continue;
    const roots = tiles.map(tile => ({ tile, root: holder.querySelector<HTMLElement>(`[data-specs-tile="${CSS.escape(tile.id)}"] .${CSS.escape(block)}`) }))
      .filter((entry): entry is { tile: SpecimenTile; root: HTMLElement } => Boolean(entry.root));
    if (!roots.length) continue;
    const first = roots[0]!;
    const tokens = new TokenIndex(first.root, tokenList, read, readValues);
    const own: ScopeReading = { sizes: {} };
    const defaultSize = manifest.defaults.size ?? "";
    const sizeOf = (root: Element) => sizes.length ? valueOf(root, block, sizes, "size") ?? defaultSize : undefined;
    const atDefaults = (root: Element) => (!variants.length || (valueOf(root, block, variants, "variant") ?? manifest.defaults.variant) === manifest.defaults.variant)
      && (!tones.length || (valueOf(root, block, tones, "tone") ?? manifest.defaults.tone) === manifest.defaults.tone);
    const parts = (root: HTMLElement): PartReading[] => (manifest.elements ?? []).flatMap(part => {
      const el = root.querySelector<HTMLElement>(`.${CSS.escape(`${block}__${part}`)}`);
      if (!el || el.getBoundingClientRect().height <= 0) return [];
      const cs = getComputedStyle(el);
      // A part with a box of its own: it paints, has a corner, or sets its own sides (a row's plate, a header's room).
      const draws = !/^(transparent|rgba\(0, 0, 0, 0\))$/.test(cs.backgroundColor) || Number.parseFloat(cs.borderTopWidth) > 0
        || Number.parseFloat(cs.paddingLeft) > 0 || Number.parseFloat(cs.borderTopLeftRadius) > 0;
      return draws ? [{ part, box: readBox(el, tokens, sizeOf(root)) }] : [];
    });
    const add = (key: string, root: HTMLElement, label: string) => {
      if (own.sizes[key]) return;
      own.sizes[key] = { box: readBox(root, tokens, sizeOf(root)), type: readType(root, block, tokens), parts: parts(root) };
      measured.add(label.split(" / ").at(-1)!);
    };
    // The Default tile first, then one specimen per size at the default variant and tone.
    add(sizes.length ? (valueOf(first.root, block, sizes, "size") ?? defaultSize) : "", first.root, first.tile.label);
    for (const { tile, root } of roots) {
      if (!sizes.length || !atDefaults(root)) continue;
      const size = valueOf(root, block, sizes, "size");
      if (size && (tile.group === "Sizes" || tile.group === "Default")) add(size, root, tile.label);
    }
    // A specimen at the default size that leads with an icon.
    for (const { tile, root } of roots) {
      if (sizes.length && (valueOf(root, block, sizes, "size") ?? defaultSize) !== defaultSize) continue;
      const box = readBox(root, tokens, sizeOf(root));
      if (box.leadsWithIcon && box.start) { own.icon = box; measured.add(tile.label.split(" / ").at(-1)!); break; }
    }
    reading.scopes[scope] = own;
    if (scope === "current") {
      // State paint: on the root when its rules paint its hover, else on the first part that does (a Menu's row).
      const hover = stateHooks("hover", manifest.stateAttributes);
      const targetOf = (root: HTMLElement) => {
        if (hasStatePaint(root, hover)) return { el: root, part: "root" };
        for (const part of manifest.elements ?? []) {
          const el = root.querySelector<HTMLElement>(`.${CSS.escape(`${block}__${part}`)}`);
          if (el && hasStatePaint(el, hover)) return { el, part };
        }
        return { el: root, part: "root" };
      };
      const target = targetOf(first.root);
      reading.stateTarget = target.part;
      const seen = new Set<string>();
      const candidatesByVariant = variants.length
        ? roots.filter(({ root }) => (!tones.length || (valueOf(root, block, tones, "tone") ?? manifest.defaults.tone) === manifest.defaults.tone)
          && (!sizes.length || (valueOf(root, block, sizes, "size") ?? defaultSize) === defaultSize))
        : [first];
      for (const { root } of candidatesByVariant) {
        const variant = variants.length ? valueOf(root, block, variants, "variant") ?? manifest.defaults.variant ?? "" : "";
        if (seen.has(variant)) continue;
        seen.add(variant);
        const el = target.part === "root" ? root : root.querySelector<HTMLElement>(`.${CSS.escape(`${block}__${target.part}`)}`) ?? root;
        reading.states.push({ variant, paint: readStates(el, manifest.stateAttributes ?? {}, new TokenIndex(el, tokenList, read, readValues)) });
      }
      reading.states.sort((a, b) => variants.indexOf(a.variant) - variants.indexOf(b.variant));
    }
  }
  reading.measured = [...measured];
  return reading.scopes.current || reading.scopes.defaults ? reading : null;
}

/* --- Cells -------------------------------------------------------------------------------------------------------- */

/** A measured value: its number with its unit, and the tokens it equals. Data attributes carry the raw number. */
function Value({ spec, scope, part, value, text, tokens = [], side }: { spec: string; scope: ScopeId; part: string; value?: number | string; text: string; tokens?: string[]; side?: Side }) {
  return (
    <span className="studio-specs__value" data-spec={spec} data-spec-scope={scope} data-spec-part={part} data-value={value}
      data-border={side?.border} data-shell={side?.shell} data-slot={side?.slot}>
      <span className="studio-tabular">{text}</span>
      {tokens.map(name => <Code key={name}>{name}</Code>)}
    </span>
  );
}
const Missing = () => <span className="studio-muted">—</span>;

type Row = { key: string; label: string; cell: (scope: ScopeId) => ReactNode };

function boxRows(part: string, name: string, pick: (scope: ScopeId) => BoxReading | undefined): Row[] {
  const prefix = part === "root" ? "" : `${name} `;
  const label = (text: string) => part === "root" ? text : `${prefix}${text.toLowerCase()}`;
  const rows: Row[] = [];
  const has = (test: (box: BoxReading) => unknown) => SCOPES.some(scope => { const box = pick(scope); return box && test(box); });
  const cell = (scope: ScopeId, make: (box: BoxReading) => ReactNode) => { const box = pick(scope); return box ? make(box) ?? <Missing /> : <Missing />; };
  rows.push({ key: `${part}-height`, label: label("Height"), cell: scope => cell(scope, box => <Value spec="height" scope={scope} part={part} value={box.height} text={`${fmt(box.height)} px`} tokens={box.heightTokens} />) });
  if (has(box => box.start && (part !== "root" || !box.leadsWithIcon))) rows.push({ key: `${part}-start`, label: label(SCOPES.some(scope => pick(scope)?.start?.slot === undefined) ? "Start side, border + shell" : "Start side, border + shell + slot"), cell: scope => cell(scope, box => box.start && (part !== "root" || !box.leadsWithIcon) ? <Value spec="start" scope={scope} part={part} value={box.start.total} text={sideText(box.start)} side={box.start} /> : null) });
  if (has(box => box.end)) rows.push({ key: `${part}-end`, label: label(SCOPES.some(scope => pick(scope)?.end?.slot === undefined) ? "End side, border + shell" : "End side, border + shell + slot"), cell: scope => cell(scope, box => box.end ? <Value spec="end" scope={scope} part={part} value={box.end.total} text={sideText(box.end)} side={box.end} /> : null) });
  if (has(box => box.radius > 0)) rows.push({ key: `${part}-corner`, label: label("Corner"), cell: scope => cell(scope, box => <Value spec="corner" scope={scope} part={part} value={box.radius} text={box.radius * 2 >= Math.min(box.height, box.width) ? "Fully round" : `${fmt(box.radius)} px`} tokens={box.radiusTokens} />) });
  if (has(box => box.stroke)) rows.push({ key: `${part}-stroke`, label: label("Stroke"), cell: scope => cell(scope, box => box.stroke ? <Value spec="stroke" scope={scope} part={part} value={box.stroke.width} text={`${fmt(box.stroke.width)} px ${box.stroke.style}`} tokens={box.strokeTokens} /> : null) });
  return rows;
}

function iconRows(pick: (scope: ScopeId) => BoxReading | undefined): Row[] {
  const rows: Row[] = [];
  const has = (test: (box: BoxReading) => unknown) => SCOPES.some(scope => { const box = pick(scope); return box && test(box); });
  const cell = (scope: ScopeId, make: (box: BoxReading) => ReactNode) => { const box = pick(scope); return box ? make(box) ?? <Missing /> : <Missing />; };
  if (has(box => box.start?.slot !== undefined && box.leadsWithIcon)) rows.push({ key: "icon-start", label: "Start side with an icon, border + shell + slot", cell: scope => cell(scope, box => box.start ? <Value spec="start-icon" scope={scope} part="root" value={box.start.total} text={sideText(box.start)} side={box.start} /> : null) });
  if (has(box => box.icon)) rows.push({ key: "icon-box", label: "Icon box", cell: scope => cell(scope, box => box.icon ? <Value spec="icon" scope={scope} part="root" value={box.icon.width} text={`${fmt(box.icon.width)} × ${fmt(box.icon.height)} px`} tokens={box.iconTokens} /> : null) });
  if (has(box => box.icon?.gap !== undefined)) rows.push({ key: "icon-gap", label: "Icon to label", cell: scope => cell(scope, box => box.icon?.gap !== undefined ? <Value spec="gap" scope={scope} part="root" value={box.icon.gap} text={`${fmt(box.icon.gap)} px`} tokens={box.gapTokens} /> : null) });
  return rows;
}

/* --- The tab ------------------------------------------------------------------------------------------------------ */

export function SpecsTab({ family, tiles, renderDemo }: { family: FamilyInfo; tiles: SpecimenTile[]; renderDemo: (demo: string) => ReactNode }) {
  const manifest = family.manifest;
  const bench = useRef<HTMLDivElement>(null);
  const scope = specimenScope();
  const [reading, setReading] = useState<Reading | null>(null);
  const [measuredOnce, setMeasuredOnce] = useState(false);
  const sizes = manifest?.variants.size ?? [];
  const [size, setSize] = useState<string>(manifest?.defaults.size ?? sizes[0] ?? "");
  // The tiles the bench draws: the Default first, its Sizes, its Variants, and those whose name says they hold an icon.
  const benchTiles = useMemo(() => {
    const picked = tiles.filter((tile, index) => index === 0 || tile.group === "Sizes" || tile.group === "Variants" || tile.group === "Variant × tone"
      || (tile.group === "Content" && /icon/i.test(tile.label)));
    return picked.slice(0, 48);
  }, [tiles]);
  const signature = JSON.stringify(scope);

  useLayoutEffect(() => {
    const host = bench.current;
    if (!host || !manifest) return;
    let timer = 0;
    let cancelled = false;
    const update = () => {
      clearTimeout(timer);
      // A task, not a frame: a window in the background runs no frames (src/specimen-box.tsx).
      timer = window.setTimeout(() => {
        void document.fonts.ready.then(() => {
          if (cancelled) return;
          setReading(measure(host, family, benchTiles));
          setMeasuredOnce(true);
        });
      }, 60);
    };
    update();
    // The mode and the app's look sit on <html>; the Inspector's settings on the Canvas body and the bench's scope.
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true });
    const body = document.querySelector(".studio-canvas__body");
    if (body) observer.observe(body, { attributes: true });
    observer.observe(host, { attributes: true, subtree: true, childList: true, attributeFilter: ["class", "data-area-type", "data-area-density", "data-area-radius"] });
    return () => { cancelled = true; clearTimeout(timer); observer.disconnect(); };
  }, [family.slug, benchTiles, signature]);

  if (!manifest) return <EmptyState title="No specs" description="This family has no manifest entry, so it has nothing to measure." />;

  const sizeKey = sizes.length ? size : "";
  const pick = (scopeId: ScopeId) => reading?.scopes[scopeId]?.sizes[sizeKey];
  const foundSizes = sizes.filter(value => reading?.scopes.current?.sizes[value] || reading?.scopes.defaults?.sizes[value]);
  const atDefaultSize = !sizes.length || size === manifest.defaults.size;
  const partNames = [...new Set(SCOPES.flatMap(scopeId => pick(scopeId)?.parts.map(entry => entry.part) ?? []))];
  const rows: Row[] = reading ? [
    ...boxRows("root", family.name, scopeId => pick(scopeId)?.box),
    ...(atDefaultSize ? iconRows(scopeId => reading.scopes[scopeId]?.icon ?? undefined) : iconRows(scopeId => pick(scopeId)?.box)),
    ...partNames.flatMap(part => boxRows(part, words(part), scopeId => pick(scopeId)?.parts.find(entry => entry.part === part)?.box)),
  ] : [];
  const typeParts = [...new Set(SCOPES.flatMap(scopeId => pick(scopeId)?.type.map(entry => entry.part) ?? []))];
  const typeCell = (scopeId: ScopeId, part: string) => {
    const type = pick(scopeId)?.type.find(entry => entry.part === part);
    if (!type) return <Missing />;
    return (
      <span className="studio-specs__value" data-spec="type" data-spec-scope={scopeId} data-spec-part={part}>
        <span className="studio-tabular">{`${fmt(type.size)} / ${fmt(type.line)} px, ${type.weight}`}</span>
        {type.inkTokens.length ? type.inkTokens.map(name => <Code key={name}>{name}</Code>) : type.ink ? <Code>{type.ink}</Code> : null}
      </span>
    );
  };
  const states = reading?.states ?? [];
  const stateRows = STATES.filter(state => states.some(entry => entry.paint[state.id]));
  const paintCell = (paint: StatePaint | undefined) => {
    if (!paint) return <Missing />;
    const parts = PAINT_PARTS.filter(part => paint[part.id]);
    if (!parts.length) return <Missing />;
    return (
      <span className="studio-specs__paint">
        {parts.map(part => {
          const entry = paint[part.id]!;
          return (
            <span key={part.id} className="studio-specs__value">
              <span className="studio-muted">{part.label}</span>
              {entry.tokens.length ? entry.tokens.map(name => <Code key={name}>{name}</Code>)
                : entry.value === "none" ? <span>None</span>
                : entry.color ? <Code>{entry.color}</Code>
                : entry.value ? <Code>{entry.value}</Code> : <Missing />}
            </span>
          );
        })}
      </span>
    );
  };
  const stateHead = states.length > 1 || states[0]?.variant ? states.map(entry => words(entry.variant || "default")) : ["Tokens"];

  return (
    <>
      {/* The bench: the family's tiles, drawn twice out of sight, measured at scale 1. */}
      <div ref={bench} className="studio-specs__bench" aria-hidden="true" inert>
        <div data-specs-scope="current" {...scope}>
          <LibrarySpecimens>{benchTiles.map(tile => <div key={tile.id} className="studio-specs__specimen" data-specs-tile={tile.id}><Quiet>{renderDemo(tile.demo)}</Quiet></div>)}</LibrarySpecimens>
        </div>
        <div data-specs-scope="defaults" {...DEFAULT_SCOPE()}>
          {benchTiles.map(tile => <div key={tile.id} className="studio-specs__specimen" data-specs-tile={tile.id}><Quiet>{renderDemo(tile.demo)}</Quiet></div>)}
        </div>
      </div>
    <div className="studio-sections">
      {measuredOnce && !reading ? (
        <EmptyState title="No specs" description={`No specimen draws .${manifest.block}, so there is nothing to measure.`} />
      ) : null}
      {reading ? (
        <>
          <Section id="specs-measurements" title="Measurements"
            lede={`Measured on the ${reading.measured.slice(0, 4).join(", ")} ${reading.measured.length === 1 ? "tile" : "tiles"}, at the current settings and at Area's defaults.`}>
            {foundSizes.length > 1 ? (
              <div className="studio-specs__controls" {...appScale()}>
                <Segmented size="sm" aria-label="Size" value={size} onValueChange={setSize}
                  items={foundSizes.map(value => ({ value, label: SIZE_WORDS[value] ?? words(value) }))} />
              </div>
            ) : null}
            <DataTable label="Measurements" head={["Measurement", "Current settings", "Defaults"]}
              rows={rows.map(row => [row.label, row.cell("current"), row.cell("defaults")])} />
          </Section>
          {typeParts.length ? (
            <Section id="specs-type" title="Type" lede="Each text part's size and line, weight and ink.">
              <DataTable label="Type" head={["Part", "Current settings", "Defaults"]}
                rows={typeParts.map(part => [part === "root" ? family.name : words(part), typeCell("current", part), typeCell("defaults", part)])} />
            </Section>
          ) : null}
          {stateRows.length ? (
            <Section id="specs-states" title="State tokens"
              lede={`The tokens ${reading.stateTarget === "root" ? family.name : `each ${words(reading.stateTarget).toLowerCase()}`} paints with in each state, at the current settings.`}>
              <DataTable label="State tokens" head={["State", ...stateHead]}
                rows={stateRows.map(state => [state.label, ...states.map(entry => paintCell(entry.paint[state.id]))])} />
            </Section>
          ) : null}
        </>
      ) : null}
    </div>
    </>
  );
}
