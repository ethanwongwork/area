/** Types for stage.js, which the app's Illustrations page imports (apps/desktop/src/pages/illustrations.tsx). */
export type Fidelity = "line" | "bars" | "real" | "shapes";
export interface StageOptions {
  html: string; w?: number; h?: number; fidelity?: Fidelity; scope?: Record<string, string | undefined>; states?: string[];
  fit?: "fill" | number; pad?: number; max?: number; center?: null | "contain" | "cover" | "right" | "width";
}
export const AFS: {
  stage(parent: Element, options: StageOptions): HTMLDivElement;
  painted(root: Element): { l: number; t: number; r: number; b: number } | null;
  centre(stage: HTMLElement, z: Element, mode: "contain" | "cover" | "right" | "width", pad: number, max: number): void;
  easeOf(text: string): (x: number) => number;
};
