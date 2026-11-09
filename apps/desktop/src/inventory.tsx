/**
 * A system's inventory and structure, edited where the library is seen (docs/research/system-inventory-2026-11-08, Q2):
 * the Components pages and the Inspector's Design view. The data is the open system's working copy's `library`
 * (src/systems.ts), its rules src/library.ts.
 *
 *   InventorySection  Design, for a family: In <system> (a switch), then each axis's values (a checkbox each) and its
 *                     default, then the states a family may do without. Reset sets the family back to Area's.
 *   StructureSection  Design, for a family with a structure question (library.ts STRUCTURES): its alternatives drawn on
 *                     the real component (Radio's thumbnail cards), the default chosen there, and which others stay on
 *                     offer. A question reaching several families (Field shell) sets them all.
 *   LibrarySpecimens  the library's defaults for a specimen (@area/react SystemDefaults), so a Default tile and every use
 *                     without the prop draw the system's choice. Tiles and the Stage hold their specimens in it.
 *
 * A project's tab shows its system as published and edits nothing here; a system shown Live switches to its working copy
 * on the first edit, as a theme's settings do.
 */
import type { ReactNode } from "react";
import { Button, Checkbox, Field, Input, PanelSection, Radio, RadioGroup, Select, Stack, Switch, SystemDefaults, Tabs, type SystemDefaultsValue } from "@area/react";
import { ResetIcon } from "@area/icons";
import { MANIFESTS } from "@area/styles/manifest";
// @ts-expect-error — the gallery's page content is authored in JavaScript.
import { COMPONENT_PAGES } from "./content/pages.mjs";
import { canvasAttributes, useStudio } from "./studio.tsx";
import { tabKind } from "./places.ts";
import { STATE_AXIS, type SystemLibrary } from "./systems.ts";
import {
  axisLabel, chooseStructure, offerStructure, resetFamily, resolveFamily, setDefault, setFamilyIncluded, setValueIncluded,
  STRUCTURES, systemDefaults, valueLabel, type ManifestShape, type ResolvedFamily, type Structure,
} from "./library.ts";

interface PageFamily { slug: string; name: string; manifest?: string; docsOnly?: boolean; exportName?: string; imports?: string }
const PAGES = (COMPONENT_PAGES as PageFamily[]).filter(family => !family.docsOnly);
const MANIFEST_NAME = new Map(PAGES.flatMap(family => family.manifest ? [[family.slug, family.manifest] as const] : []));
const NAME = new Map(PAGES.map(family => [family.slug, family.name] as const));

/** A family's manifest by its slug, as the library reads it. */
export function manifestFor(slug: string): ManifestShape | undefined {
  const key = MANIFEST_NAME.get(slug);
  return key ? (MANIFESTS as unknown as Record<string, ManifestShape>)[key] : undefined;
}
/** A family's React component by its slug ("input-group" → "InputGroup"): its recorded export, else its name in Pascal case. */
export function componentName(slug: string): string | undefined {
  const family = PAGES.find(entry => entry.slug === slug);
  if (!family) return undefined;
  return family.exportName ?? family.imports?.split(",")[0]?.trim() ?? slug.split("-").map(word => word[0]!.toUpperCase() + word.slice(1)).join("");
}
/** A family's name by its slug ("input-group" → "Input group"). */
export const familyName = (slug: string) => NAME.get(slug) ?? slug;

/** The open system's library, a family resolved in it, and whether this tab may edit it. */
export function useLibrary() {
  const { openSystem, updateLibrary, place } = useStudio();
  const library = openSystem.library;
  const editable = tabKind(place) === "system";
  const resolve = (slug: string): ResolvedFamily | null => {
    const manifest = manifestFor(slug);
    if (manifest) return resolveFamily(slug, library.families[slug], manifest);
    return { included: library.families[slug]?.included !== false, axes: [], states: [] };
  };
  const update = (change: (library: SystemLibrary) => SystemLibrary) => { if (editable) updateLibrary(change); };
  return { library, system: openSystem, resolve, update, editable };
}

/** A library's defaults for @area/react's SystemDefaults, per manifest name. */
export const defaultsOf = (library: SystemLibrary): SystemDefaultsValue => systemDefaults(library, slug => MANIFEST_NAME.get(slug));
/** The open system's defaults. */
export function useSystemDefaultsValue(): SystemDefaultsValue {
  return defaultsOf(useStudio().openSystem.library);
}
/** Specimens drawn with the open system's defaults (a use's own prop still wins). */
export function LibrarySpecimens({ children }: { children?: ReactNode }) {
  return <SystemDefaults value={useSystemDefaultsValue()}>{children}</SystemDefaults>;
}

/** Design: what the open system includes of a family. */
export function InventorySection({ slug }: { slug: string }) {
  const { library, system, resolve, update, editable } = useLibrary();
  const manifest = manifestFor(slug);
  const resolved = resolve(slug)!;
  const changed = Boolean(library.families[slug]);
  const name = familyName(slug);
  const optionalStates = resolved.states.filter(state => !state.kept);
  // Structure axes are answered in Structure, on the real component.
  const axes = resolved.axes.filter(axis => !axis.structure && axis.values.length);
  return (
    <PanelSection heading={`In ${system.name}`} revealActions={!changed} actions={changed && editable ? (
      <Button size="sm" variant="ghost" tone="neutral" iconOnly icon={<ResetIcon />} aria-label={`Reset ${name} to Area's`} title={`Reset ${name} to Area's`}
        onClick={() => update(current => resetFamily(current, slug))} />
    ) : undefined}>
      <Field label="Included" description={resolved.included ? undefined : `Left out: ${system.name}'s products and code don't have ${name}.`} orientation="horizontal">
        <Switch size="sm" aria-label={`Include ${name} in ${system.name}`} checked={resolved.included} disabled={!editable || !manifest}
          onChange={event => { const on = event.currentTarget.checked; update(current => manifest ? setFamilyIncluded(current, slug, manifest, on) : current); }} />
      </Field>
      {resolved.included && manifest ? axes.map(axis => (
        <AxisRows key={axis.axis} slug={slug} manifest={manifest} axis={axis.axis} editable={editable}
          values={axis.values} chosen={axis.default} update={update} />
      )) : null}
      {resolved.included && manifest && optionalStates.length ? (
        <Field label="States" orientation="horizontal">
          <Stack gap="related">
            {optionalStates.map(state => (
              <Checkbox key={state.value} label={valueLabel(slug, STATE_AXIS, state.value)} checked={state.included} disabled={!editable}
                onChange={event => { const on = event.currentTarget.checked; update(current => setValueIncluded(current, slug, manifest, STATE_AXIS, state.value, on)); }} />
            ))}
          </Stack>
        </Field>
      ) : null}
    </PanelSection>
  );
}

/** One axis: its values, each a checkbox, then its default among those still in. */
function AxisRows({ slug, manifest, axis, values, chosen, editable, update }: {
  slug: string; manifest: ManifestShape; axis: string; values: ResolvedFamily["axes"][number]["values"]; chosen?: string; editable: boolean;
  update: (change: (library: SystemLibrary) => SystemLibrary) => void;
}) {
  const included = values.filter(value => value.included);
  return (
    <>
      <Field label={axisLabel(axis)} orientation="horizontal">
        <Stack gap="related">
          {values.map(value => (
            <Checkbox key={value.value} label={valueLabel(slug, axis, value.value)} checked={value.included}
              // The last value of an axis with a default stays: a family always has one.
              disabled={!editable || (value.included && chosen !== undefined && included.length === 1)}
              onChange={event => { const on = event.currentTarget.checked; update(current => setValueIncluded(current, slug, manifest, axis, value.value, on)); }} />
          ))}
        </Stack>
      </Field>
      {chosen !== undefined && included.length > 1 ? (
        <Field label="Default" orientation="horizontal">
          <Select size="sm" fullWidth value={chosen} disabled={!editable} aria-label={`Default ${axisLabel(axis).toLowerCase()}`}
            onChange={event => { const next = event.currentTarget.value; update(current => setDefault(current, slug, manifest, axis, next)); }}>
            {included.map(value => <option key={value.value} value={value.value}>{valueLabel(slug, axis, value.value)}</option>)}
          </Select>
        </Field>
      ) : null}
    </>
  );
}

/** Design: a family's structure questions, each answered on the real component. */
export function StructureSection({ slug }: { slug: string }) {
  const { resolve } = useLibrary();
  const questions = STRUCTURES.filter(entry => entry.reaches.includes(slug));
  if (!questions.length || !resolve(slug)?.included) return null;
  return <>{questions.map(structure => <StructureQuestion key={structure.id} slug={slug} structure={structure} />)}</>;
}

function StructureQuestion({ slug, structure }: { slug: string; structure: Structure }) {
  const { resolve, update, editable } = useLibrary();
  const { openTheme } = useStudio();
  const axis = resolve(slug)!.axes.find(entry => entry.axis === structure.axis);
  if (!axis) return null;
  const scope = canvasAttributes(openTheme.canvas, openTheme.material);
  const others = structure.alternatives.filter(entry => entry.value !== axis.default);
  // The question's other families, named, so a pick that reaches them says so.
  const alsoReaches = structure.reaches.filter(entry => entry !== slug && manifestFor(entry));
  return (
    <PanelSection heading={structure.label}>
      <RadioGroup label={structure.question} orientation="horizontal" value={axis.default} disabled={!editable}
        description={alsoReaches.length ? `Also sets ${list(alsoReaches.map(familyName))}.` : undefined}
        onValueChange={value => update(current => chooseStructure(current, structure, value, manifestFor))}
        className="studio-inventory__pictures">
        {structure.alternatives.map(entry => (
          <Radio key={entry.value} variant="soft" layout="thumbnail" value={entry.value} label={entry.label}
            leadingVisual={<div className="studio-inventory__picture" inert {...scope}><LibrarySpecimens><StructurePicture structure={structure} value={entry.value} /></LibrarySpecimens></div>} />
        ))}
      </RadioGroup>
      <Field label="Also offer" orientation="horizontal">
        <Stack gap="related">
          {others.map(entry => {
            const offered = axis.values.find(value => value.value === entry.value)?.included ?? true;
            return (
              <Checkbox key={entry.value} label={entry.label} checked={offered} disabled={!editable}
                onChange={event => { const on = event.currentTarget.checked; update(current => offerStructure(current, structure, entry.value, on, manifestFor)); }} />
            );
          })}
        </Stack>
      </Field>
    </PanelSection>
  );
}

/** An alternative on the real component, at its small size, in the placeholder vocabulary. */
function StructurePicture({ structure, value }: { structure: Structure; value: string }) {
  if (structure.id === "tabs-selection") {
    return <Tabs size="sm" selection={value as "marker" | "plate"} aria-label={`${value} tabs`} value="one" items={[{ id: "one", label: "One" }, { id: "two", label: "Two" }]} />;
  }
  if (structure.id === "field-shell") return <Input size="sm" variant={value as "outline" | "soft"} placeholder="Placeholder" aria-label="Placeholder" />;
  return <Field label="Label" orientation={value as "vertical" | "horizontal" | "auto"}><Input size="sm" placeholder="Placeholder" /></Field>;
}

const list = (words: string[]) => words.length < 3 ? words.join(" and ") : `${words.slice(0, -1).join(", ")} and ${words.at(-1)}`;
