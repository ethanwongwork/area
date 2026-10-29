/**
 * The accent as exact colours (owner, 2026-10-26; docs/research/brand-palette-2026-10-26/PLAN.md, phase 3): Area's palette,
 * or up to three exact colours (src/brand.ts). Since 2026-10-27 (exact colours plan, phase 4) these are the Accent row's own
 * (inspector-rows.tsx): its "Exact colour" choice turns them on, a palette accent off; there is no Brand colours switch. Each colour is a hex field, typed exactly, with
 * a picker beside it. A colour lands on the Canvas when it is let go: a typed hex on Enter or blur, a picker drag when the
 * pointer lifts or holds still for REST ms, and whatever is pending when the picker closes, because each new colour works
 * out a brand (about 60ms) and restyles the Canvas. Under Primary, the button the brand draws: its nearest readable shade.
 */
import { useEffect, useRef, useState } from "react";
import { Button, ColorField, ColorPicker, Field, hexToHsv, hsvToHex, Popover, Segmented, Toggletip } from "@area/react";
import { AddIcon, ColorIcon } from "@area/icons";
import { brandSlots, type BrandState } from "./brand.ts";
import { useStudio } from "./studio.tsx";

type Slot = "primary" | "secondary" | "tertiary";
const SLOTS: ReadonlyArray<[Slot, string]> = [["primary", "Colour"], ["secondary", "Secondary"], ["tertiary", "Tertiary"]];
const REST = 300; /* pick: as a setting's bar (inspector-rows.tsx), a held pointer well past a drag's pace */

/** A colour for a slot just added: the primary turned a third of the way round the wheel, at its own strength. */
function offset(primary: string, turns: number) {
  const [h, s, v] = hexToHsv(primary);
  return hsvToHex((h + 360 * turns) % 360, s, v).toLowerCase();
}

/** The exact accent's rows, under the Accent row while it is an exact colour: the colours, then which status hues. */
export function BrandRows() {
  const { brand, setBrand, theme } = useStudio();
  const info = brand.on ? brandSlots(brand, theme)?.primary ?? null : null;
  return (
    <>
      {brand.on ? <>
        {SLOTS.map(([slot, label], at) => [brand[slot] === null ? (
          <Field key={slot} label={label} orientation="horizontal">
            <Button size="sm" variant="soft" fullWidth icon={<AddIcon />} onClick={() => setBrand({ [slot]: offset(brand.primary, at / 3) })}>Add</Button>
          </Field>
        ) : (
          <BrandColour key={slot} label={label} value={brand[slot]!} set={hex => setBrand({ [slot]: hex })}
            remove={slot === "primary" ? undefined : () => setBrand({ [slot]: null })}
            // What buttons paint from it, behind an info button beside its name (owner 2026-10-27; was a caption).
            note={slot === "primary" && info ? (info.button === brand.primary
              ? `Buttons use it exactly, with a ${info.label === "#000000" ? "black" : "white"} label.`
              : `Buttons use ${info.button.toUpperCase()}, its nearest shade a ${info.label === "#000000" ? "black" : "white"} label reads on.`) : undefined} />
        )])}
        <Field label="Status hues" orientation="horizontal" title="Danger, warning, success and info: turned toward the exact colours, or Area's own">
          <Segmented size="sm" fullWidth value={brand.status} onValueChange={status => setBrand({ status: status as BrandState["status"] })}
            items={[{ value: "harmonised", label: "Matched" }, { value: "own", label: "Area's" }]} />
        </Field>
      </> : null}
    </>
  );
}

/** One slot: its hex, exact, and a picker beside it whose colour lands when let go. */
function BrandColour({ label, value, set, remove, note }: { label: string; value: string; set: (hex: string) => void; remove?: () => void; note?: string }) {
  const [draft, setDraft] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const field = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pending = useRef<string | null>(null);
  const apply = useRef(set);
  apply.current = set;
  useEffect(() => () => clearTimeout(timer.current), []);
  const land = () => {
    clearTimeout(timer.current);
    if (pending.current !== null) apply.current(pending.current.toLowerCase());
    pending.current = null;
    setDraft(null);
  };
  const shown = draft ?? value;
  return (
    <Field label={label} orientation="horizontal" labelAction={note ? <Toggletip content={note} label={`How buttons use the ${label.toLowerCase()} colour`} /> : undefined}>
      <div ref={field} className="studio-brand__colour">
        <ColorField size="sm" variant="soft" fullWidth aria-label={label} value={shown.toUpperCase()} onValueChange={hex => { pending.current = hex; land(); }} />
        <Popover open={open} onOpenChange={next => { setOpen(next); if (!next) land(); }} anchor={field} align="end" aria-label={`${label} colour`}
          trigger={<Button size="sm" variant="ghost" iconOnly aria-label={`Pick the ${label.toLowerCase()} colour`} icon={<ColorIcon />} />}>
          <div onPointerUp={land}>
            <ColorPicker variant="plain" label={label} alpha={false} views={["spectrum", "sliders"]} defaultModel="oklch" eyedropper value={shown.toUpperCase()}
              header={remove ? <div className="studio-brand__head"><span>{label}</span><Button size="sm" variant="ghost" onClick={() => { setOpen(false); pending.current = null; setDraft(null); remove(); }}>Remove</Button></div> : undefined}
              onValueChange={hex => {
                setDraft(hex);
                pending.current = hex;
                clearTimeout(timer.current);
                timer.current = setTimeout(land, REST);
              }} />
          </div>
        </Popover>
      </div>
    </Field>
  );
}
