/**
 * The move between a gallery's card and the view it opens (owner, 2026-10-25: the view shifts "to some kind of gallery
 * view … then you can return back to the original design thing you were looking at or open a new one"; one behaviour for
 * every gallery since 2026-10-31): opening a card grows the view from it on `slow`; leaving shrinks the view into its card
 * on `moderate`, exits being a step faster. Both are moves across the screen while visible, so ease-in-out (MOTION.md),
 * and both read the motion tokens where they play, so Motion 0 and reduced motion skip them. The scale is the width's
 * alone, from the top start, so nothing is stretched; the element rests untransformed, on whole pixels.
 *
 * A card names what it opens with `data-design="<key>"`; the design viewer (src/design-viewer.tsx) plays the opening, and
 * a gallery that calls `useCardArrival` plays the return. The Components page keeps its own pending move for its Stage.
 */
import { useLayoutEffect } from "react";

export function morph(element: Element | null | undefined, from: DOMRect, duration: "slow" | "moderate") {
  if (!(element instanceof HTMLElement)) return;
  const to = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  const ms = parseFloat(style.getPropertyValue(`--area-duration-${duration}`)) || 0;
  if (!ms || !to.width || !from.width) return;
  const easing = style.getPropertyValue("--area-ease-in-out").trim() || "ease-in-out";
  element.animate([
    { transformOrigin: "0 0", transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width})` },
    { transformOrigin: "0 0", transform: "none" },
  ], { duration: ms, easing });
}

/** The move waiting for the next view to draw: where it starts, which design, and which way. */
let pending: { from: DOMRect; design: string; to: "viewer" | "card" } | null = null;

/** A card is opening: the viewer grows from it. `card` is the element clicked, or the card itself. */
export function openFrom(card: Element | null | undefined, design: string) {
  const frame = card?.closest("[data-design]") ?? card;
  pending = frame ? { from: frame.getBoundingClientRect(), design, to: "viewer" } : null;
}

/** A gallery opens the design its card names (`data-design`): the viewer grows from that card. */
export function openDesign(design: string) {
  openFrom(document.querySelector(`[data-design="${CSS.escape(design)}"]`), design);
}

/** The viewer is closing: its card takes it back. */
export function leaveFrom(view: Element | null | undefined, design: string) {
  pending = view ? { from: view.getBoundingClientRect(), design, to: "card" } : null;
}

/** The move for this view, if it is the one waiting (taken, so it plays once). */
export function takeMorph(to: "viewer" | "card", design?: string) {
  if (!pending || pending.to !== to || (design !== undefined && pending.design !== design)) return null;
  const move = pending;
  pending = null;
  return move;
}

/** A gallery's return: once the card the viewer closed into is drawn, bring it into view and shrink the viewer into it. */
export function useCardArrival() {
  useLayoutEffect(() => {
    if (pending?.to !== "card") return;
    const card = document.querySelector(`[data-design="${CSS.escape(pending.design)}"]`);
    if (!card) return;
    const move = takeMorph("card")!;
    card.scrollIntoView({ block: "nearest" });
    morph(card, move.from, "moderate");
  });
}
