// DesignCard: one design in a container at its true size, placed by its layout's rule, its name and true size under it
// (owner, 2026-11-05: the Design Containers page's picks, every one the recommendation: one component, a tenth's margin,
// hold 50% and crop, phones stand, the name below). The design is laid out at its own size, measured, and placed with a
// transform, so it stays live DOM at every scale: what a person zooms in Full view is the design itself. `placeDesign`
// is the rule, exported so a host's Full view places the same way. Spec: docs/specs/design-card.md.
import { forwardRef, useCallback, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { designCardVariants } from "../variants.ts";
import type { MANIFESTS, VariantProps } from "../variants.ts";

type PartProps = HTMLAttributes<HTMLDivElement> & Record<`data-${string}`, string | undefined>;

/** What the card holds, which sets how it is placed. */
export type DesignKind = NonNullable<VariantProps<typeof MANIFESTS.designCard>["kind"]>;
/** @deprecated Use `DesignKind`. */
export type DesignLayout = DesignKind;
/** Where a cropped part is kept: its centre, its top (a menu, a palette) or its start (a type line). */
export type DesignFocus = "center" | "top" | "start";
export interface DesignPlacement {
  /** The room kept round the design, inside the card's edge. */
  margin: number;
  /** The design's scale: at most 1 (an icon's whole multiples aside). */
  scale: number;
  /** The design's top start in the card, in whole pixels. */
  x: number;
  y: number;
  /** The card shows part of the design (a part held at 50%, a phone running off the bottom). */
  cropped: boolean;
}

/** The most a card keeps round its design: Full view's margin. */
const CEILING = 48; /* spec: design-viewer.tsx MARGIN, docs/specs/design-card.md */
/** The least a part is drawn at; below it the card crops instead (13 px text never under 6.5 px). */
const FLOOR = 0.5; /* spec: owner's pick Q3, 2026-11-05 */
/** A phone's width in the card. */
const PHONE = 0.6; /* spec: owner, 2026-11-04 (Illustrations), pick Q4 */
/** A stretching design's width: Area's contained field width (16rem). */
const FLUID = "var(--area-input-inline-size, 16rem)";
const round4 = (n: number) => Math.round(n / 4) * 4;
const clamp = (n: number, low: number, high: number) => Math.min(high, Math.max(low, n));

/** The margin: a part's or an icon's a tenth of the short side, 12 to 48; a screen's or a phone's a twentieth, 8 to 48
 *  (they draw their own edge); a colour's none. On the 4 grid. */
function marginOf(layout: DesignLayout, width: number, height: number) {
  if (layout === "color") return 0;
  const short = Math.min(width, height);
  return layout === "screen" || layout === "phone" ? clamp(round4(short * 0.05), 8, CEILING) : clamp(round4(short * 0.1), 12, CEILING);
}

/**
 * Places a design of `design` size (its true width and height) in a card of `room` size (inside its edge) by the
 * layout's rule. A part never passes 100%, and under 50% it holds 50% and is cropped on its focus; a screen is always
 * whole; a phone stands from the top margin at 60% of the width; an icon is drawn at a whole multiple, 1× to 4×.
 */
export function placeDesign(layout: DesignLayout, design: { width: number; height: number }, room: { width: number; height: number }, focus: DesignFocus = "center"): DesignPlacement {
  const W = room.width, H = room.height, w = design.width, h = design.height;
  const margin = marginOf(layout, W, H);
  if (layout === "color" || !w || !h || !W || !H) return { margin, scale: 1, x: 0, y: 0, cropped: false };
  const fit = Math.min((W - 2 * margin) / w, (H - 2 * margin) / h);
  let scale = Math.min(1, fit), cropped = false;
  if (layout === "icon") {
    // About a quarter of the room, to the nearest whole multiple (the card's edge takes a pixel or two off the room).
    const times = clamp(Math.round((W - 2 * margin) / (w * 4)), 1, 4);
    scale = fit < 1 ? fit : Math.min(times, Math.floor(fit));
  } else if (layout === "phone") {
    scale = Math.min(1, (W * PHONE) / w);
    cropped = h * scale + margin > H;
    return { margin, scale, x: Math.round((W - w * scale) / 2), y: margin, cropped };
  } else if (layout === "part" && scale < FLOOR) {
    scale = FLOOR;
    cropped = true;
    return {
      margin, scale, cropped,
      x: focus === "start" ? margin : Math.round((W - w * scale) / 2),
      y: focus === "top" ? margin : Math.round((H - h * scale) / 2),
    };
  }
  return { margin, scale, x: Math.round((W - w * scale) / 2), y: Math.round((H - h * scale) / 2), cropped };
}

export interface DesignCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "color"> {
  /** The design's name, under the card: one line, then an ellipsis. */
  name?: ReactNode;
  /** After the name, muted: the design's true size by default ("320 × 184"), or what is given (a colour's value, a
   *  status). `null` leaves it out. */
  detail?: ReactNode;
  /** Controls at the caption's end (a Copy button, a More button): small ghost icon-only Buttons, few. */
  actions?: ReactNode;
  /** What the card holds. part (the default): a control, a component, a pattern or a type line. screen: a window, whole,
   *  in a 16:9 card. phone: a phone, standing from the top and running off the bottom. icon: an icon at whole multiples.
   *  color: a colour (`color`) painting the card. */
  kind?: DesignKind;
  /** @deprecated Use `kind`. */
  layout?: DesignKind;
  /** square, or wide (16:9, a 1920 × 1080 window whole). A screen's card is wide unless this says otherwise. */
  aspect?: VariantProps<typeof MANIFESTS.designCard>["aspect"];
  /** Where a part held at 50% is kept when the card crops it: centre (the default), top (a menu, a palette), start (a
   *  type line). */
  focus?: DesignFocus;
  /** A colour design: any CSS colour, painting the card. */
  color?: string;
  /** The width the design is laid out at: a screen's true width, or a component that stretches to its container.
   *  Unset, the design takes its own width. */
  designWidth?: number;
  /** The height the design is laid out at, for a design that fills its box (a screen drawn to its frame). */
  designHeight?: number;
  /** Selected: the card's edge in the selection colour. */
  selected?: boolean;
  /** The card is a control of its own (it opens or selects): hover lifts it, a press drops it, focus rings it. */
  interactive?: boolean;
  /** Attributes for the ground (a host's scope or class). */
  groundProps?: PartProps;
  /** Attributes for the design's box (the scope the design is drawn in). */
  designProps?: PartProps;
  /** Attributes for the caption (a host's scale or class). */
  captionProps?: PartProps;
  /** Hears each placement, with the design's measured size. */
  onPlace?: (placement: DesignPlacement & { width: number; height: number }) => void;
  /** The design, at its true size. */
  children?: ReactNode;
}

const join = (...names: Array<string | undefined>) => names.filter(Boolean).join(" ");

export const DesignCard = /* @__PURE__ */ forwardRef<HTMLDivElement, DesignCardProps>(function DesignCard(
  { name, detail, actions, kind, layout: layoutAlias, aspect, focus = "center", color, designWidth, designHeight, selected, interactive, groundProps, designProps, captionProps, onPlace, children, className, style, ...rest }, ref,
) {
  const layout: DesignKind = kind ?? layoutAlias ?? "part";
  const ground = useRef<HTMLDivElement>(null);
  const design = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState<(DesignPlacement & { width: number; height: number; rtl: boolean }) | null>(null);
  // A design that stretches to its container (a skeleton line, a full-width field) has no width of its own: it is laid
  // out at Area's contained field width instead, as a form would hold it.
  const [fluid, setFluid] = useState(false);
  const report = useRef(onPlace);
  report.current = onPlace;
  const place = useCallback(() => {
    const g = ground.current, d = design.current;
    if (!g) return;
    const width = d ? d.offsetWidth : 0, height = d ? d.offsetHeight : 0;
    if (d && !width && designWidth === undefined && layout !== "color" && !fluid) { setFluid(true); return; }
    const next = { ...placeDesign(layout, { width, height }, { width: g.clientWidth, height: g.clientHeight }, focus), width, height, rtl: getComputedStyle(g).direction === "rtl" };
    setPlaced(was => was && was.scale === next.scale && was.x === next.x && was.y === next.y && was.width === next.width && was.height === next.height && was.rtl === next.rtl ? was : next);
  }, [layout, focus, designWidth, fluid]);
  useLayoutEffect(() => {
    place();
    const observer = new ResizeObserver(() => place());
    if (ground.current) observer.observe(ground.current);
    if (design.current) observer.observe(design.current);
    return () => observer.disconnect();
  }, [place, designWidth, designHeight]);
  useLayoutEffect(() => { if (placed) report.current?.(placed); }, [placed]);

  const shape = aspect ?? (layout === "screen" ? "wide" : "square");
  const { className: groundClass, style: groundStyle, ...groundRest } = groundProps ?? {};
  const { className: designClass, style: designStyle, ...designRest } = designProps ?? {};
  const { className: captionClass, ...captionRest } = captionProps ?? {};
  const shown = detail === undefined ? (placed && layout !== "color" && placed.width ? `${placed.width} × ${placed.height}` : null) : detail;
  const transform = placed ? `translate(${placed.rtl ? -placed.x : placed.x}px, ${placed.y}px) scale(${placed.scale})` : undefined;
  return (
    <div ref={ref} className={designCardVariants({ kind: layout, aspect: shape, interactive }, className)} data-selected={selected ? "" : undefined}
      data-placed={placed ? "" : undefined} data-cropped={placed?.cropped ? "" : undefined}
      style={color !== undefined ? { ...style, "--_design-color": color } as CSSProperties : style} {...rest}>
      <div ref={ground} className={join(designCardVariants.element("ground"), groundClass)} style={groundStyle} {...groundRest}>
        {layout === "color" ? null : (
          <div ref={design} className={join(designCardVariants.element("design"), designClass)}
            style={{ ...designStyle, inlineSize: designWidth ?? (fluid ? FLUID : undefined), blockSize: designHeight, transform }} {...designRest}>{children}</div>
        )}
      </div>
      {name != null || shown != null || actions ? (
        <div className={join(designCardVariants.element("caption"), captionClass)} {...captionRest}>
          <span className={designCardVariants.element("name")}>{name}</span>
          {shown != null && shown !== "" ? <span className={designCardVariants.element("detail")}>{shown}</span> : null}
          {actions ? <div className={designCardVariants.element("actions")}>{actions}</div> : null}
        </div>
      ) : null}
    </div>
  );
});
