/**
 * A mode's page as one exact colour (owner, 2026-10-27; plan https://claude.ai/artifact/K4rswTACDiMB31nd4nzWz2), for
 * Setup's Colours stage and the Inspector: Area's Color picker over lightness and chroma at a hue, drawn from Area's own
 * rules (`reachableChroma`), so it offers only the colours Area paints; the colourful part narrows to nothing at white
 * (light) and black (dark). Neutral, Cool and Warm are starting points that set today's greys exactly (the Neutral
 * setting, its own tint), not picks. The picks themselves are src/colours.ts.
 */
import { useEffect, useRef, useState } from "react";
import { Button, ColorPicker, ColorSwatch, ColorSwatchPicker, Popover } from "@area/react";
import { ColorIcon } from "@area/icons";
import { DEFAULT_PAGE, PAGE_RANGE, formatOklch, oklchHex, paintedChroma, parseColour, reachableChroma, type Oklch } from "@area/tokens/color";
import { neutralCast, presetColour, type ColoursState, type Mode } from "./colours.ts";
import { hueName, RowField } from "./inspector-rows.tsx";
import { SCALES } from "./tokens.ts";
import { useStudio, type CanvasAxes } from "./studio.tsx";

/** Tint 100: the most chroma any page shows, the area's right edge. */
const TINT_MAX = 0.08;
const REACH = {
  light: (l: number, h: number) => reachableChroma("light", l, h),
  dark: (l: number, h: number) => reachableChroma("dark", l, h),
} as const;
const GREY_STARTS = [["neutral", "Neutral"], ["cool", "Cool"], ["warm", "Warm"]] as const;
/** A grey family's swatch: its own ramp where the cast shows (100 in light, 850 in dark). */
const greyHex = (id: string, mode: Mode) => SCALES.find(scale => scale.id === id)?.steps.find(step => step.level === (mode === "light" ? 100 : 850))?.hex ?? "#808080";

/** What a mode's page is now: the pick, else what its settings paint. */
export function pageNow(mode: Mode, values: Readonly<CanvasAxes>, picks: ColoursState): Oklch {
  const own = picks[mode] ?? presetColour(values as CanvasAxes, mode);
  if (own) return parseColour(own);
  // Cool's or Warm's own page (or a tint no pick says): the Neutral setting's cast at the page's lightness.
  const ground = Number(values[`ground-${mode}`]), l = mode === "dark" && ground === 8 ? DEFAULT_PAGE.dark.l : ground / 100;
  const cast = neutralCast(values.neutral, mode);
  return { l, c: paintedChroma(mode, l, cast), h: cast.hue };
}
/** The page in words: its hue's name and lightness, or the grey family it starts from. */
export function pageAnswer(mode: Mode, values: Readonly<CanvasAxes>, picks: ColoursState): string {
  if (!picks[mode] && values.neutral !== "neutral") return `${values.neutral === "cool" ? "Cool" : "Warm"} greys`;
  const { l, c, h } = pageNow(mode, values, picks);
  return `${c < 0.001 ? "Grey" : hueName(h)} ${Number((l * 100).toFixed(2))}%`;
}
export const pageHex = (mode: Mode, values: Readonly<CanvasAxes>, picks: ColoursState) => oklchHex(pageNow(mode, values, picks));
/** The page now as a pick: where Exact color starts, so choosing it changes nothing until a color is picked. */
export const pageColour = (mode: Mode, values: Readonly<CanvasAxes>, picks: ColoursState) => formatOklch(pageNow(mode, values, picks));

/** The picker and the grey families to start from. `onPick` takes each colour as it is chosen. */
export function PagePicker({ mode, values, picks, onPick, set, swatchSize = "lg" }: {
  mode: Mode; values: Readonly<CanvasAxes>; picks: ColoursState; onPick: (colour: string) => void;
  set: (changes: Partial<Record<keyof CanvasAxes, string>>) => void; swatchSize?: "md" | "lg";
}) {
  const now = pageNow(mode, values, picks);
  const startFrom = (id: string) => set({ neutral: id, "tint-hue": "auto", "tint-hue-dark": "same", "tint-light": "auto", "tint-dark": "auto",
    // The starting point keeps the page's lightness, to the whole percent the settings take.
    [`ground-${mode}`]: String(Math.round(now.l * 100)) });
  return <>
    <ColorPicker variant="plain" label={mode === "light" ? "Light page" : "Dark page"}
      gamut={{ lightness: PAGE_RANGE[mode], chroma: TINT_MAX, reach: REACH[mode] }}
      oklch={now} onOklchChange={next => onPick(formatOklch(next))} />
    <ColorSwatchPicker label="Start from" size={swatchSize} layout="row" value={picks[mode] ? "" : greyHex(values.neutral, mode)}
      items={GREY_STARTS.map(([id, label]) => ({ value: greyHex(id, mode), label }))}
      onValueChange={hex => { const entry = GREY_STARTS.find(([id]) => greyHex(id, mode) === hex); if (entry) startFrom(entry[0]); }} />
  </>;
}

const REST = 300; /* pick: as Brand colours' picker (brand-settings.tsx), a held pointer well past a drag's pace */
/**
 * The Inspector's page colour, for the mode the app is in: the colour in words beside its swatch, and the picker in a
 * Popover. A colour lands when let go (the pointer lifts or rests REST ms, or the picker closes), since each restyles
 * the Canvas.
 */
export function PageColourRow({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const { canvas, colours, setColours, setCanvas, theme } = useStudio();
  const [draft, setDraft] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const field = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // The colour waiting to land, read by handlers made before it was picked.
  const pending = useRef<string | null>(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const land = () => { clearTimeout(timer.current); if (pending.current !== null) setColours({ [theme]: pending.current }); pending.current = null; setDraft(null); };
  const picks = draft === null ? colours : { ...colours, [theme]: draft };
  return (
    <RowField label="Color" orientation="horizontal" title="The page's exact color: every grey, edge and text color is worked out from it">
      <div ref={field} className="studio-brand__colour">
        <span className="studio-page-colour">
          <ColorSwatch size="sm" color={pageHex(theme, canvas, picks)} aria-hidden="true" />
          <span>{pageAnswer(theme, canvas, picks)}</span>
        </span>
        <Popover open={open} onOpenChange={next => { setOpen(next); if (!next) land(); }} anchor={field} align="end" aria-label={`${theme === "light" ? "Light" : "Dark"} page color`}
          trigger={<Button size={size} variant="ghost" iconOnly aria-label={`Pick the ${theme} page color`} icon={<ColorIcon />} />}>
          <div className="studio-page-colour__picker" onPointerUp={land}>
            <PagePicker mode={theme} values={canvas} picks={picks} swatchSize="md"
              onPick={colour => { setDraft(colour); pending.current = colour; clearTimeout(timer.current); timer.current = setTimeout(land, REST); }}
              set={changes => { pending.current = null; setDraft(null); for (const [axis, value] of Object.entries(changes)) setCanvas(axis as keyof CanvasAxes, value!); }} />
          </div>
        </Popover>
      </div>
    </RowField>
  );
}
