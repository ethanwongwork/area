/**
 * A scene: one Pinterest reference rebuilt as an image (owner, 2026-10-19: "treat these images as images, using area
 * components and reconstructing the exact visual that is being referenced with area design principles ... not
 * everything has to be a component or variant ... reconstruct the layout and composition as close as possible").
 *
 * Each scene is the reference's frame at the zoom where its controls land on Area's own sizes: the reference image is
 * `view` pixels wide (its 1400px reading copy) and `zoom` of those pixels make one CSS pixel, so the scene is
 * view / zoom CSS pixels and every position inside it is a measured reading divided by the zoom. Area settings scoped
 * to the scene (type, density, radius, ground, theme, accent) carry the reference's character in Area's own terms;
 * nothing here adds a variant.
 */
import type { CSSProperties, ReactNode } from "react";

export interface SceneProps {
  /** The reference's reading copy, in px. */
  view: [number, number];
  /** Reference px per CSS px. */
  zoom: number;
  /** The page behind the composition (an Area token by default: the scene's own ground). */
  bg?: string;
  /** Area settings scoped to this scene: data-area-theme, -type, -density, -radius, -ground-light, -accent … */
  scope?: Record<string, string>;
  className?: string;
  children: ReactNode;
}

export function Scene({ view, zoom, bg, scope, className, children }: SceneProps) {
  // --z carries the zoom to CSS, so a scene's rules can write measured reference px as calc(Npx / var(--z)).
  const style = { inlineSize: view[0] / zoom, blockSize: view[1] / zoom, background: bg, "--z": zoom } as CSSProperties;
  return <div className={className ? `sc ${className}` : "sc"} style={style} {...scope}>{children}</div>;
}

/** A measured box: reference px (in the scene's reading copy) converted to CSS px by the scene's zoom. */
export const box = (zoom: number) => (left: number, top: number, width?: number, height?: number): CSSProperties => ({
  position: "absolute",
  left: left / zoom,
  top: top / zoom,
  ...(width !== undefined ? { width: width / zoom } : {}),
  ...(height !== undefined ? { height: height / zoom } : {}),
});
