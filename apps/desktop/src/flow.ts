/**
 * A page read as a flow (the user flows study, owner 2026-11-08: "go with your recs"; docs/research/user-flows-2026-11-08).
 * A page becomes a flow at its first link (projects.ts `setLink`). Then:
 *
 *   the path      its layers in order, less branches and states, numbered 1, 2, 3 …
 *   a branch      a layer marked off the path, reached by a link; numbered after the step it leaves (1a, 1b …)
 *   a state       a layer that is another step changed (Error, Loading): drawn under its step, not counted
 *   an edge       a link from an element of a layer to another layer; a step with no forward links goes on to the next
 *                 step (an implicit edge, "Next"), as a prototype goes on with a click anywhere when a screen has no
 *                 hotspot
 *
 * Pure: tests/flow.test.ts imports it.
 */
import { BACK, type FlowLink, type Layer, type ProjectPage } from "./projects.ts";

export type FlowRole = "step" | "branch" | "state";
export interface FlowStep {
  layer: Layer;
  role: FlowRole;
  /** "1", "1a"; a state takes its step's. */
  number: string;
  /** A branch's source step, a state's step. */
  of?: string;
}
export interface FlowEdge {
  id: string;
  from: string;
  /** A layer's id, or BACK. */
  to: string;
  label: string;
  path: number[];
  /** No link: where the step goes on a click anywhere. */
  implicit: boolean;
}
export interface Flow {
  /** The path, in order. */
  steps: FlowStep[];
  branches: FlowStep[];
  /** Each step's states, by the step's layer id. */
  states: Map<string, FlowStep[]>;
  /** Every layer, in the order the Sidebar lists them: a step, its states, then the branches that leave it. */
  ordered: FlowStep[];
  edges: FlowEdge[];
  byId: Map<string, FlowStep>;
}

export const isFlow = (page: ProjectPage) => Boolean(page.links?.length);
export const linksOf = (page: ProjectPage): FlowLink[] => page.links ?? [];

const LETTERS = "abcdefghijklmnopqrstuvwxyz";

export function readFlow(page: ProjectPage): Flow {
  const links = linksOf(page);
  const pathLayers = page.layers.filter(layer => !layer.of && !layer.branch);
  const steps: FlowStep[] = pathLayers.map((layer, index) => ({ layer, role: "step", number: String(index + 1) }));
  const stepOf = new Map(steps.map(step => [step.layer.id, step]));
  // A branch leaves the first path step that links to it (through other branches if need be), else the path step before
  // it in the page's order, else the first.
  const branchLayers = page.layers.filter(layer => layer.branch && !layer.of);
  const sourceOf = new Map<string, string>();
  const resolve = (id: string, seen = new Set<string>()): string | undefined => {
    if (stepOf.has(id)) return id;
    if (seen.has(id)) return undefined;
    seen.add(id);
    for (const link of links) if (link.to === id) { const found = resolve(link.from, seen); if (found) return found; }
    return undefined;
  };
  for (const layer of branchLayers) {
    let source = resolve(layer.id);
    if (!source) {
      const before = page.layers.slice(0, page.layers.indexOf(layer)).reverse().find(other => stepOf.has(other.id));
      source = before?.id ?? steps[0]?.layer.id;
    }
    if (source) sourceOf.set(layer.id, source);
  }
  const lettered = new Map<string, number>();
  const branches: FlowStep[] = branchLayers.map(layer => {
    const source = sourceOf.get(layer.id);
    const count = lettered.get(source ?? "") ?? 0;
    lettered.set(source ?? "", count + 1);
    return { layer, role: "branch", number: `${source ? stepOf.get(source)!.number : "0"}${LETTERS[count] ?? "+"}`, ...(source ? { of: source } : {}) };
  });
  const states = new Map<string, FlowStep[]>();
  const byId = new Map<string, FlowStep>([...steps, ...branches].map(step => [step.layer.id, step]));
  for (const layer of page.layers) {
    if (!layer.of) continue;
    const owner = byId.get(layer.of);
    const state: FlowStep = { layer, role: "state", number: owner?.number ?? "", of: layer.of };
    states.set(layer.of, [...(states.get(layer.of) ?? []), state]);
  }
  for (const list of states.values()) for (const state of list) byId.set(state.layer.id, state);
  const ordered: FlowStep[] = [];
  for (const step of steps) {
    ordered.push(step, ...(states.get(step.layer.id) ?? []));
    for (const branch of branches.filter(entry => entry.of === step.layer.id)) ordered.push(branch, ...(states.get(branch.layer.id) ?? []));
  }
  for (const branch of branches.filter(entry => !entry.of)) ordered.push(branch, ...(states.get(branch.layer.id) ?? []));

  const edges: FlowEdge[] = links.map(link => ({ id: link.id, from: link.from, to: link.to, label: link.label, path: link.path, implicit: false }));
  for (const step of [...steps, ...branches]) {
    // A forward link replaces "Next"; a Back link alone leaves it.
    if (links.some(link => link.from === step.layer.id && link.to !== BACK)) continue;
    const next = nextStep(steps, step, sourceOf);
    if (next) edges.push({ id: `next:${step.layer.id}`, from: step.layer.id, to: next, label: "Next", path: [], implicit: true });
  }
  return { steps, branches, states, ordered, edges, byId };
}

/** Where a step goes when nothing links it on: the next path step (a branch's, the one after the step it leaves). */
function nextStep(steps: readonly FlowStep[], step: FlowStep, sourceOf: ReadonlyMap<string, string>): string | null {
  const from = step.role === "branch" ? sourceOf.get(step.layer.id) : step.layer.id;
  const at = steps.findIndex(entry => entry.layer.id === from);
  return at >= 0 && at + 1 < steps.length ? steps[at + 1]!.layer.id : null;
}

/** The step a layer belongs to: itself, or for a state its step. */
export const stepOf = (flow: Flow, layer: string) => { const found = flow.byId.get(layer); return found?.role === "state" ? flow.byId.get(found.of!) : found; };

/** Where a click anywhere goes on a layer with no links: its step's next. Null at the end. */
export function nextOf(flow: Flow, layer: string): string | null {
  const step = stepOf(flow, layer);
  if (!step) return null;
  return flow.edges.find(edge => edge.from === step.layer.id && edge.implicit)?.to ?? null;
}

/** The link an element (or one of its ancestors, by path) carries on a layer: the deepest one that holds the path. */
export function linkAt(page: ProjectPage, layer: string, path: readonly number[]): FlowLink | null {
  let best: FlowLink | null = null;
  for (const link of linksOf(page)) {
    if (link.from !== layer || link.path.length > path.length) continue;
    if (link.path.every((step, index) => path[index] === step) && (!best || link.path.length > best.path.length)) best = link;
  }
  return best;
}

/** A layer's name with its number: "2 Verify email", "1a Sign in", "Verify email, Error". */
export function stepName(flow: Flow, layer: Layer): string {
  const step = flow.byId.get(layer.id);
  if (!step) return layer.name;
  if (step.role === "state") { const owner = flow.byId.get(step.of!); return `${owner?.layer.name ?? ""}, ${layer.state}`; }
  return `${step.number} ${layer.name}`;
}

/* --- Checks: what a flow leaves undesigned ---------------------------------------------------------------------------- */

export type FlowCheckKind = "unreachable" | "dead-end" | "no-back";
export interface FlowCheck { kind: FlowCheckKind; layer: string; what: string; detail: string }

/**
 * What the flow leaves undesigned, as a walk through it finds (a user flow template's "close every path; dangling arrows
 * mean undesigned states"): a step nothing reaches from the first, a step that goes nowhere before the end, and a wired
 * step (one with links) with no way back. A state is reached by its step's links and is not walked.
 */
export function checkFlow(flow: Flow): FlowCheck[] {
  const out: FlowCheck[] = [];
  const first = flow.steps[0]?.layer.id;
  const last = flow.steps[flow.steps.length - 1]?.layer.id;
  const reached = new Set<string>();
  const walk = (id: string) => {
    const step = stepOf(flow, id);
    const at = step?.layer.id ?? id;
    if (reached.has(at)) return;
    reached.add(at);
    for (const edge of flow.edges) if (edge.from === at || flow.states.get(at)?.some(state => state.layer.id === edge.from)) if (edge.to !== BACK) walk(edge.to);
  };
  if (first) walk(first);
  for (const step of [...flow.steps, ...flow.branches]) {
    const name = `${step.number} ${step.layer.name}`;
    if (!reached.has(step.layer.id)) out.push({ kind: "unreachable", layer: step.layer.id, what: name, detail: "Nothing leads here from the first step." });
    const leaves = flow.edges.filter(edge => edge.from === step.layer.id || flow.states.get(step.layer.id)?.some(state => state.layer.id === edge.from));
    if (!leaves.some(edge => edge.to !== BACK) && step.layer.id !== last) out.push({ kind: "dead-end", layer: step.layer.id, what: name, detail: "Goes nowhere forward: link an element on to another step." });
    const wired = leaves.some(edge => !edge.implicit);
    const back = leaves.some(edge => edge.to === BACK || flow.steps.findIndex(entry => entry.layer.id === edge.to) >= 0 && flow.steps.findIndex(entry => entry.layer.id === edge.to) < flow.steps.findIndex(entry => entry.layer.id === (step.role === "branch" ? step.of : step.layer.id)));
    if (wired && !back && step.layer.id !== first && step.layer.id !== last) out.push({ kind: "no-back", layer: step.layer.id, what: name, detail: "Has no way back: link a Back control." });
  }
  return out;
}
export const FLOW_CHECK_TITLES: Record<FlowCheckKind, string> = { unreachable: "Unreachable", "dead-end": "Dead ends", "no-back": "No way back" };
