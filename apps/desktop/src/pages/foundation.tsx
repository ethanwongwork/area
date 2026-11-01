/**
 * Spacing, Shape, Elevation and Motion: the Foundations a system had as settings only, under Themes, until 2026-10-31
 * (owner: "build it", after the design systems' sites and Figma's variables and styles: each foundation its own page
 * beside Colors, Typography and Icons). One page each: the foundation drawn (the space ramp as bars, corners as boxes,
 * shadows as cards, durations and easings as a moving dot), then its tokens in their tiers (pages/tokens.tsx), every value
 * as the Canvas's theme and settings resolve it. Its settings are the Inspector's Theme view, edited where their effect is
 * seen (product UI rule 22). A row chosen shows its facts.
 *
 * Location: #system/<system>/spacing, …/shape, …/elevation, …/motion.
 */
import { useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Button, PanelSection } from "@area/react";
import { PlayIcon } from "@area/icons";
import { useStudio, Workspace } from "../studio.tsx";
import { CanvasSection } from "../tile.tsx";
import { CanvasSettings } from "../canvas-settings.tsx";
import { Facts } from "../facts.tsx";
import { TIERS, TOKEN_BY_NAME, TOKEN_LIST, type Token } from "../token-catalog.ts";
import { shortName, shownValue, TokenFacts, TokenTable, useTokenValues } from "./tokens.tsx";

export type FoundationId = "spacing" | "shape" | "elevation" | "motion";
type Axis = Parameters<typeof CanvasSettings>[0]["axes"] extends readonly (infer A)[] | undefined ? A : never;

const pick = (pattern: RegExp) => TOKEN_LIST.filter(token => pattern.test(token.name));
const byValue = (tokens: Token[]) => tokens.sort((a, b) => (parseFloat(a.name.split("-").pop()!) || 0) - (parseFloat(b.name.split("-").pop()!) || 0));

export const FOUNDATIONS: Record<FoundationId, { title: string; lede: string; axes: Axis[] }> = {
  spacing: { title: "Spacing", lede: "The space ramp, the gaps and paddings made from it, and the heights of controls. Density sets the roles.", axes: ["density"] },
  shape: { title: "Shape", lede: "Corners and strokes. Corner and Stroke width set the roles; the ramps stay fixed.", axes: ["radius", "surface", "stroke"] },
  elevation: { title: "Elevation", lede: "Shadows from resting to floating, and the order layers stack in.", axes: ["shadow-rest", "elevation", "shadow-resting", "shadow-hover", "shadow-field", "shadow-size", "shadow-softness", "shadow-light", "shadow-color"] },
  motion: { title: "Motion", lede: "How long things take, how they ease, and how controls answer a press.", axes: ["motion", "easing", "feedback"] },
};

/** A labelled specimen: the drawing, then its token's name and value under it. */
function Specimen({ token, value, chosen, onChoose, children }: { token: string; value?: string; chosen: boolean; onChoose: (name: string) => void; children: ReactNode }) {
  return (
    <button type="button" className="studio-foundation__specimen" data-selected={chosen ? "" : undefined} onClick={() => onChoose(token)}>
      <span className="studio-foundation__figure">{children}</span>
      <span className="studio-foundation__name">{shortName(token)}</span>
      {value ? <span className="studio-foundation__value studio-muted">{value}</span> : null}
    </button>
  );
}

function Drawings({ id, values, chosen, onChoose }: { id: FoundationId; values: ReadonlyMap<string, string>; chosen: string | null; onChoose: (name: string) => void }) {
  const [playing, setPlaying] = useState(false);
  const spec = (name: string, figure: ReactNode) => (
    <Specimen key={name} token={name} value={shownValue(TOKEN_BY_NAME.get(name)!, values.get(name) ?? "")} chosen={chosen === name} onChoose={onChoose}>{figure}</Specimen>
  );
  if (id === "spacing") return <>
    <CanvasSection id="spacing-ramp" title="Space ramp" lede="Every gap and padding is one of these.">
      <div className="studio-foundation__rows">
        {byValue(pick(/^--area-space-\d+$/)).map(token => spec(token.name, <span className="studio-foundation__bar" style={{ width: `var(${token.name})` } as CSSProperties} />))}
      </div>
    </CanvasSection>
    <CanvasSection id="spacing-gaps" title="Gaps" lede="Between items, smallest to largest; Density moves them.">
      <div className="studio-foundation__rows">
        {["xs", "sm", "md", "lg", "xl", "row"].map(step => `--area-gap-${step}`).filter(name => TOKEN_BY_NAME.has(name))
          .map(name => spec(name, <span className="studio-foundation__bar" style={{ width: `var(${name})` } as CSSProperties} />))}
      </div>
    </CanvasSection>
    <CanvasSection id="spacing-controls" title="Control heights" lede="Buttons, fields and selects at each size.">
      <div className="studio-foundation__grid">
        {["xs", "sm", "md", "lg", "xl"].map(step => `--area-control-${step}`).filter(name => TOKEN_BY_NAME.has(name))
          .map(name => spec(name, <span className="studio-foundation__control" style={{ height: `var(${name})` } as CSSProperties} />))}
      </div>
    </CanvasSection>
  </>;
  if (id === "shape") return <>
    <CanvasSection id="shape-corners" title="Corners" lede="The radius ramp; a surface's corner comes from Corner.">
      <div className="studio-foundation__grid">
        {[...byValue(pick(/^--area-radius-\d+$/)), ...pick(/^--area-radius-(full|surface)$/)].map(token =>
          spec(token.name, <span className="studio-foundation__box" style={{ borderRadius: `var(${token.name})` } as CSSProperties} />))}
      </div>
    </CanvasSection>
    <CanvasSection id="shape-strokes" title="Strokes" lede="How wide an edge is, and how strong each group of components draws it.">
      <div className="studio-foundation__grid">
        {pick(/^--area-edge-[a-z]+$/).map(token =>
          spec(token.name, <span className="studio-foundation__box" style={{ borderColor: `var(${token.name})` } as CSSProperties} />))}
      </div>
    </CanvasSection>
  </>;
  if (id === "elevation") return <>
    <CanvasSection id="elevation-shadows" title="Shadows" lede="From a control's edge to a dialog floating over the page.">
      <div className="studio-foundation__grid">
        {["control", "field", "resting", "lift", "tooltip", "float", "modal"].map(step => `--area-shadow-${step}`).filter(name => TOKEN_BY_NAME.has(name))
          .map(name => spec(name, <span className="studio-foundation__card" style={{ boxShadow: `var(${name})` } as CSSProperties} />))}
      </div>
    </CanvasSection>
  </>;
  return <>
    <div className="studio-foundation__play">
      <Button size="sm" variant="soft" tone="neutral" icon={<PlayIcon />} onClick={() => setPlaying(on => !on)}>{playing ? "Play back" : "Play"}</Button>
    </div>
    <CanvasSection id="motion-durations" title="Durations" lede="Each dot crosses at its duration, easing out.">
      <div className="studio-foundation__rows" data-playing={playing ? "" : undefined}>
        {pick(/^--area-duration-(?!loop)/).sort((a, b) => parseFloat(values.get(a.name) ?? "0") - parseFloat(values.get(b.name) ?? "0")).map(token =>
          spec(token.name, <span className="studio-foundation__track"><span className="studio-foundation__dot" style={{ transitionDuration: `var(${token.name})`, transitionTimingFunction: "var(--area-ease-out)" } as CSSProperties} /></span>))}
      </div>
    </CanvasSection>
    <CanvasSection id="motion-easing" title="Easing" lede="Each curve at the slow duration.">
      <div className="studio-foundation__rows" data-playing={playing ? "" : undefined}>
        {pick(/^--area-ease-/).map(token =>
          spec(token.name, <span className="studio-foundation__track"><span className="studio-foundation__dot" style={{ transitionDuration: "var(--area-duration-slow)", transitionTimingFunction: `var(${token.name})` } as CSSProperties} /></span>))}
      </div>
    </CanvasSection>
  </>;
}

export function FoundationPage({ id }: { id: FoundationId }) {
  const foundation = FOUNDATIONS[id];
  const scope = useRef<HTMLDivElement>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const tokens = useMemo(() => TOKEN_LIST.filter(token => token.group === id), [id]);
  const values = useTokenValues(scope, tokens);
  const chosenToken = chosen ? TOKEN_BY_NAME.get(chosen) ?? null : null;
  return (
    <Workspace
      canvasTitle={foundation.title}
      canvas={
        <div ref={scope} className="studio-sections studio-foundation">
          <Drawings id={id} values={values} chosen={chosen} onChoose={setChosen} />
          {TIERS.map(tier => {
            const listed = tokens.filter(token => token.tier === tier.id);
            return listed.length ? (
              <CanvasSection key={tier.id} id={`${id}-${tier.id}`} title={tier.label} count={listed.length} lede={tier.lede}>
                <TokenTable tokens={listed} values={values} chosen={chosen} onChoose={setChosen} label={`${foundation.title}: ${tier.label}`} />
              </CanvasSection>
            ) : null;
          })}
        </div>
      }
      inspector={{
        theme: <CanvasSettings axes={foundation.axes} />,
        design: chosenToken ? <TokenFacts token={chosenToken} value={values.get(chosenToken.name) ?? ""} /> : (
          <PanelSection heading={foundation.title}>
            <Facts label={foundation.title} items={[
              ["Tokens", tokens.length],
              ...TIERS.map(tier => [tier.label, tokens.filter(token => token.tier === tier.id).length] as [string, number]),
            ]} note={foundation.lede} />
          </PanelSection>
        ),
      }}
    />
  );
}
