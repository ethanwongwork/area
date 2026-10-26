/**
 * Which derived tokens a brand restates (build time only; the runtime embeds the result). A derived token resolves where
 * it is declared, so a brand scope that sets the accent's and the tones' inputs must declare again every derivation that
 * reads one of them, directly or through another derivation, or its descendants would keep the root's. Which ones depends
 * only on which inputs a brand can set, never on its colours, so it is worked out here once (build.ts) and shipped as
 * data, and the brand runtime never loads the derivations themselves.
 */
import { derivedTokens } from "./base.ts";
import { materialDerived } from "../axes/material.ts";
import { brandInputNames } from "./brand.ts";

const reads = (value: string) => [...value.matchAll(/var\((--area-[a-z0-9-]+)/g)].map(match => match[1]!);

/** The derivations a brand restates, `--area-` name to formula, in the order the stylesheet declares them. */
export function brandDerivedFormulas(): Record<string, string> {
  const derived: Record<string, string> = { ...derivedTokens(), ...materialDerived() };
  const set = new Set(brandInputNames().map(name => `--area-${name}`));
  const memo = new Map<string, boolean>();
  const touched = (name: string, seen = new Set<string>()): boolean => {
    if (memo.has(name)) return memo.get(name)!;
    let hit = false;
    for (const ref of reads(derived[name]!)) {
      if (set.has(ref)) { hit = true; break; }
      if (ref in derived && !seen.has(ref)) { seen.add(ref); if (touched(ref, seen)) { hit = true; break; } }
    }
    memo.set(name, hit);
    return hit;
  };
  return Object.fromEntries(Object.entries(derived).filter(([name]) => touched(name)));
}
