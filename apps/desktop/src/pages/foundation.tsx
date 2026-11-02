/**
 * Spacing, Shape, Elevation and Motion: the Foundations a system had as settings only, under Themes, until 2026-10-31
 * (owner: "build it", after the design systems' sites and Figma's variables and styles: each foundation its own page
 * beside Colors, Typography and Icons). One page each: the foundation drawn, then its tokens in their tiers
 * (pages/tokens.tsx), every value as the Canvas's theme and settings resolve it. The drawings are the feed's own two
 * blocks (owner, 2026-11-01: "bring the rest of the system axes up to speed … a big, expansive library of cohesive
 * containers"; they were bare rows and boxes on the page): a ramp is a Scale table, framed as every feed table, its
 * drawing in the last column (the space ramp and gaps as bars, durations as a crossing dot); a specimen is the feed's one
 * square card, its name under it and its value its badge (control heights, corners, strokes, shadows, easing curves).
 * Motion's Play is in the Canvas bar. Its settings are the Inspector's Theme view, edited where their effect is
 * seen (product UI rule 22). A row chosen shows its facts.
 *
 * Location: #system/<system>/spacing, …/shape, …/elevation, …/motion.
 */
import { useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Button, Code, PanelSection, Table, TableCell, TableHeaderCell } from "@area/react";
import { PlayIcon } from "@area/icons";
import { useStudio, Workspace } from "../studio.tsx";
import { CanvasSection, FEED_TABLE, Tile, TileGrid } from "../tile.tsx";
import { ViewControls } from "../view-controls.tsx";
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

/** A ramp read down a table (the feed's Table, framed as every table in the feed): each token's name, its value and its
 *  drawing at its true size, in the column a Value column takes on the token tables under it. A row chooses its token. */
export function ScaleTable({ label, figure, rows, chosen, onChoose }: {
  label: string; figure: string; rows: ReadonlyArray<{ token: string; value: string; drawing: ReactNode }>; chosen?: string | null; onChoose?: (name: string) => void;
}) {
  return (
    // Each column sized by what it holds (owner, 2026-11-02: "be more intentional about column widths and alignment in
    // tables"): the token as narrow as its longest name, the value as narrow as its longest and set to the end in tabular
    // figures so the numbers line up, the drawing in the rest of the width, where its length reads against the others.
    // Every cell on the row's first baseline (`baseline`), so the token's chip, its value and the drawing share one line.
    <Table wrapperProps={FEED_TABLE} size="md" baseline interactive={Boolean(onChoose)} aria-label={label}>
      <thead><tr><TableHeaderCell fit>Token</TableHeaderCell><TableHeaderCell numeric fit>Value</TableHeaderCell><TableHeaderCell>{figure}</TableHeaderCell></tr></thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.token} data-token={row.token} data-selected={row.token === chosen ? "" : undefined} onClick={onChoose ? () => onChoose(row.token) : undefined}>
            <TableCell fit><Code>{shortName(row.token)}</Code></TableCell>
            <TableCell numeric fit><span className="studio-tokens__text">{row.value || "—"}</span></TableCell>
            <td><span className="studio-scale__figure">{row.drawing}</span></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

/** A token's specimen as the feed's one card (tile.tsx Tile, square): the drawing in the middle, its name under the card
 *  and its value as the card's badge, as a component's or a colour's card. Choosing it shows its facts. */
export function SpecimenCard({ token, value, chosen, onChoose, children }: { token: string; value?: string; chosen?: boolean; onChoose?: (name: string) => void; children: ReactNode }) {
  return (
    <Tile span="unit" stage="center" inert label={shortName(token)} value={value} selected={chosen} onSelect={onChoose ? () => onChoose(token) : undefined} data-key={token}>
      <span className="studio-specimen">{children}</span>
    </Tile>
  );
}

/** An easing's curve, its progress over time from the start to the end, drawn in the unit square (Area's 1:1 plot, as
 *  the design systems' motion pages draw it). A curve that overshoots (spring) is fitted, the square kept as its frame. */
const KEYWORDS: Record<string, number[]> = { linear: [0, 0, 1, 1], ease: [0.25, 0.1, 0.25, 1], "ease-in": [0.42, 0, 1, 1], "ease-out": [0, 0, 0.58, 1], "ease-in-out": [0.42, 0, 0.58, 1] };
export function EasingCurve({ value }: { value: string }) {
  const points = KEYWORDS[value.trim()] ?? (value.match(/cubic-bezier\(([^)]+)\)/)?.[1]?.split(",").map(Number) ?? KEYWORDS.linear!);
  const [x1, y1, x2, y2] = points as [number, number, number, number];
  const low = Math.min(0, y1, y2), high = Math.max(1, y1, y2);
  // The plot's 0 to 1 keeps the middle of the box; overshoot takes the room above and below it.
  const size = 64, pad = 4, span = size - pad * 2, scale = span / (high - low);
  const x = (t: number) => pad + t * span, y = (t: number) => pad + (high - t) * scale;
  return (
    <svg className="studio-curve" viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <rect className="studio-curve__frame" x={x(0)} y={y(1)} width={span} height={y(0) - y(1)} />
      <path className="studio-curve__line" d={`M ${x(0)} ${y(0)} C ${x(x1)} ${y(y1)} ${x(x2)} ${y(y2)} ${x(1)} ${y(1)}`} />
    </svg>
  );
}

/** A dot crossing its track at a duration and an easing, when Play is on (the Canvas bar). */
const Track = ({ duration, easing }: { duration: string; easing: string }) => (
  <span className="studio-track"><span className="studio-track__dot" style={{ transitionDuration: duration, transitionTimingFunction: easing } as CSSProperties} /></span>
);

function Drawings({ id, values, chosen, onChoose }: { id: FoundationId; values: ReadonlyMap<string, string>; chosen: string | null; onChoose: (name: string) => void }) {
  const value = (name: string) => shownValue(TOKEN_BY_NAME.get(name)!, values.get(name) ?? "");
  const scale = (names: string[], drawing: (name: string) => ReactNode) => names.map(token => ({ token, value: value(token), drawing: drawing(token) }));
  // A value too long for a badge (an easing's curve, `badge` false) stays the Inspector's, so the name keeps its line.
  const card = (name: string, figure: ReactNode, badge = true) => (
    <SpecimenCard key={name} token={name} value={badge ? value(name) : undefined} chosen={chosen === name} onChoose={onChoose}>{figure}</SpecimenCard>
  );
  const bar = (name: string) => <span className="studio-scale__bar" style={{ inlineSize: `var(${name})` } as CSSProperties} />;
  const known = (names: string[]) => names.filter(name => TOKEN_BY_NAME.has(name));
  if (id === "spacing") {
    const ramp = byValue(pick(/^--area-space-\d+$/)).map(token => token.name);
    const gaps = known(["xs", "sm", "md", "lg", "xl", "row"].map(step => `--area-gap-${step}`));
    const controls = known(["xs", "sm", "md", "lg", "xl"].map(step => `--area-control-${step}`));
    return <>
    <CanvasSection id="spacing-ramp" title="Space ramp" count={ramp.length} lede="Every gap and padding is one of these.">
      <ScaleTable label="Space ramp" figure="Length" rows={scale(ramp, bar)} chosen={chosen} onChoose={onChoose} />
    </CanvasSection>
    <CanvasSection id="spacing-gaps" title="Gaps" count={gaps.length} lede="Between items, smallest to largest; Density moves them.">
      <ScaleTable label="Gaps" figure="Length" rows={scale(gaps, bar)} chosen={chosen} onChoose={onChoose} />
    </CanvasSection>
    <CanvasSection id="spacing-controls" title="Control heights" count={controls.length} lede="Buttons, fields and selects at each size.">
      <TileGrid span="unit">
        {controls.map(name => card(name, <span className="studio-specimen__control" style={{ blockSize: `var(${name})` } as CSSProperties} />))}
      </TileGrid>
    </CanvasSection>
  </>;
  }
  if (id === "shape") {
    const corners = [...byValue(pick(/^--area-radius-\d+$/)), ...pick(/^--area-radius-(full|surface)$/)];
    const edges = pick(/^--area-edge-[a-z]+$/);
    return <>
    <CanvasSection id="shape-corners" title="Corners" count={corners.length} lede="The radius ramp; a surface's corner comes from Corner.">
      <TileGrid span="unit">
        {corners.map(token =>
          card(token.name, <span className="studio-specimen__box" style={{ borderRadius: `var(${token.name})` } as CSSProperties} />))}
      </TileGrid>
    </CanvasSection>
    <CanvasSection id="shape-strokes" title="Strokes" count={edges.length} lede="How wide an edge is, and how strong each group of components draws it.">
      <TileGrid span="unit">
        {edges.map(token =>
          card(token.name, <span className="studio-specimen__box" data-edge="" style={{ borderColor: `var(${token.name})` } as CSSProperties} />))}
      </TileGrid>
    </CanvasSection>
  </>;
  }
  if (id === "elevation") {
    const shadows = known(["control", "field", "resting", "lift", "tooltip", "float", "modal"].map(step => `--area-shadow-${step}`));
    return <>
    <CanvasSection id="elevation-shadows" title="Shadows" count={shadows.length} lede="From a control's edge to a dialog floating over the page.">
      <TileGrid span="unit">
        {shadows.map(name => card(name, <span className="studio-specimen__box" data-raised="" style={{ boxShadow: `var(${name})` } as CSSProperties} />))}
      </TileGrid>
    </CanvasSection>
  </>;
  }
  const easings = pick(/^--area-ease-/);
  const durations = pick(/^--area-duration-(?!loop)/).sort((a, b) => parseFloat(values.get(a.name) ?? "0") - parseFloat(values.get(b.name) ?? "0"));
  return <>
    <CanvasSection id="motion-durations" title="Durations" count={durations.length} lede="Each dot crosses at its duration, easing out. Play is in the bar.">
      <ScaleTable label="Durations" figure="Crossing" chosen={chosen} onChoose={onChoose}
        rows={scale(durations.map(token => token.name), name => <Track duration={`var(${name})`} easing="var(--area-ease-out)" />)} />
    </CanvasSection>
    <CanvasSection id="motion-easing" title="Easing" count={easings.length} lede="Each curve, its progress over time; its dot crosses at the slow duration.">
      <TileGrid span="unit">
        {easings.map(token => card(token.name, <span className="studio-specimen__motion">
          <EasingCurve value={values.get(token.name) ?? ""} />
          <Track duration="var(--area-duration-slow)" easing={`var(${token.name})`} />
        </span>, false))}
      </TileGrid>
    </CanvasSection>
  </>;
}

export function FoundationPage({ id }: { id: FoundationId }) {
  const foundation = FOUNDATIONS[id];
  const scope = useRef<HTMLDivElement>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const tokens = useMemo(() => TOKEN_LIST.filter(token => token.group === id), [id]);
  const values = useTokenValues(scope, tokens);
  const chosenToken = chosen ? TOKEN_BY_NAME.get(chosen) ?? null : null;
  return (
    <Workspace
      canvasTitle={foundation.title}
      // Motion's Play is a view control: it sits in the Canvas bar, as every page's do, not loose over the feed.
      canvasActions={id === "motion" ? (
        <ViewControls>
          <Button size="sm" variant="ghost" tone="neutral" icon={<PlayIcon />} aria-pressed={playing} onClick={() => setPlaying(on => !on)}>{playing ? "Play back" : "Play"}</Button>
        </ViewControls>
      ) : undefined}
      canvas={
        <div ref={scope} className="studio-sections studio-foundation" data-playing={playing ? "" : undefined}>
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
