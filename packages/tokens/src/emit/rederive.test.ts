import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";
import { derivedTokens } from "./base.ts";
import { emitAxes } from "./css.ts";
import { OVERRIDABLE } from "./rederive.ts";
import { AXES, attributeFor } from "../axes/registry.ts";

const repo = join(import.meta.dirname, "../../../..");
const files = (dir: string, ext: RegExp): string[] => readdirSync(dir).flatMap(name => {
  const path = join(dir, name);
  if (name === "node_modules" || name === "dist") return [];
  return statSync(path).isDirectory() ? files(path, ext) : ext.test(name) ? [path] : [];
});
const derived = derivedTokens();
const reads = (value: string) => [...value.matchAll(/var\((--area-[a-z0-9-]+)/g)].map(match => match[1]!);
const fed = new Set([...Object.keys(derived), ...Object.values(derived).flatMap(reads)]);

// A derivation restated only where its own axes are set is only right while nothing else sets what it reads (rederive.ts).
it("names every token a stylesheet or an inline style sets that a derivation reads or is", () => {
  const css = [...files(join(repo, "packages/styles/src"), /\.css$/), ...files(join(repo, "apps/desktop/src"), /\.css$/)]
    .flatMap(path => [...readFileSync(path, "utf8").matchAll(/(?:^|[;{\s])(--area-[a-z0-9-]+)\s*:/g)].map(match => match[1]!));
  const inline = [...files(join(repo, "packages/react/src"), /\.tsx?$/), ...files(join(repo, "apps/desktop/src"), /\.tsx?$/)]
    .flatMap(path => [...readFileSync(path, "utf8").matchAll(/["'](--area-[a-z0-9-]+)["']\s*(?:as string\s*)?\]?\s*:/g)].map(match => match[1]!));
  const missing = [...new Set([...css, ...inline])].filter(name => fed.has(name) && !OVERRIDABLE.includes(name));
  expect(missing).toEqual([]);
});

it("restates each derived token in one rule, on every attribute whose axis sets one of its inputs", () => {
  const css = emitAxes();
  const block = css.slice(css.indexOf("Re-derive cross-axis values"), css.indexOf("Re-derive material paints"));
  const rules = [...block.matchAll(/((?:\s*\[[a-z-]+\],?)+)\s*\{([^}]*)\}/g)].map(match => ({
    attributes: new Set(match[1]!.match(/\[([a-z-]+)\]/g)!.map(attribute => attribute.slice(1, -1))),
    tokens: [...match[2]!.matchAll(/(--area-[a-z0-9-]+):/g)].map(token => token[1]!),
  }));
  const owner = new Map<string, Set<string>>();
  for (const rule of rules) for (const token of rule.tokens) {
    expect(owner.has(token), `${token} is restated by two rules`).toBe(false);
    owner.set(token, rule.attributes);
  }
  // Inputs, through other derivations.
  const inputsOf = (name: string, seen = new Set<string>()): Set<string> => {
    for (const ref of reads(derived[name]!)) if (!seen.has(ref)) { seen.add(ref); if (ref in derived) inputsOf(ref, seen); }
    return seen;
  };
  for (const axis of AXES) {
    const keys = new Set(axis.presets.flatMap(preset => [...Object.keys(preset.tokens), ...Object.keys(preset.darkTokens ?? {})]));
    for (const name of Object.keys(derived)) {
      if (![...inputsOf(name)].some(input => keys.has(input))) continue;
      expect(owner.get(name)?.has(attributeFor(axis)), `${name} reads ${axis.id} but is not restated by ${attributeFor(axis)}`).toBe(true);
    }
  }
});
