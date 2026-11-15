/**
 * Tokens as data (plan F7, RD8): every public token carries a usage, every role a component reads says what it is for,
 * and every rule is a quote its doc still holds.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { SEMANTIC_ALIASES } from "../semantic/aliases.ts";
import { buildTokensJson, publicTokenNames } from "./json.ts";
import { quotedRules, usageOf } from "./usage.ts";

const ROOT = fileURLToPath(new URL("../../../../", import.meta.url));
const flat = (text: string) => text.replace(/\s+/g, " ").trim();

describe("token usage", () => {
  const names = publicTokenNames();
  const json = buildTokensJson();

  it("covers every public token", () => {
    const missing = names.filter((name) => !usageOf(name));
    expect(missing, `no usage for: ${missing.join(", ")}`).toEqual([]);
    expect(Object.keys(json.usage).length).toBe(names.length);
  });

  it("gives every semantic role a role's usage", () => {
    for (const name of Object.keys(SEMANTIC_ALIASES)) {
      const entry = json.usage[name];
      expect(entry, name).toBeDefined();
      expect(["role", "component"], `${name} is ${entry?.kind}`).toContain(entry!.kind);
      expect(entry!.usage.length, name).toBeGreaterThan(8);
    }
  });

  it("names a use for every role and component token, in a sentence", () => {
    for (const [name, entry] of Object.entries(json.usage)) {
      if (entry.kind !== "role" && entry.kind !== "component") continue;
      expect(entry.usage, name).toMatch(/^[`A-Z].*\.$/s);
      expect(entry.usage, name).not.toMatch(/undefined/);
    }
  });

  it("quotes every rule word for word from its doc", () => {
    const docs = new Map<string, string>();
    for (const name of names) usageOf(name);
    expect(Object.keys(json.tokenRules).length).toBeGreaterThan(30);
    for (const { rule, source } of quotedRules()) {
      const [file, anchor] = source.split("#");
      if (!docs.has(file!)) docs.set(file!, flat(readFileSync(`${ROOT}${file}`, "utf8")));
      expect(docs.get(file!), `"${rule}" is not in ${file}`).toContain(flat(rule));
      // The anchor is a heading of that doc.
      const headings = readFileSync(`${ROOT}${file}`, "utf8").split("\n").filter((line) => /^#{2,3} /.test(line))
        .map((line) => line.replace(/^#+ /, "").toLowerCase().replace(/[^a-z0-9 -]/g, "").trim().replace(/ /g, "-"));
      expect(headings, `${source}`).toContain(anchor);
    }
  });

  it("puts each rule only on tokens it is about", () => {
    // Spot checks of the shared state paint and stroke rules landing where the docs put them.
    expect(usageOf("edge-dividers")!.rules!.map((rule) => rule.rule)).toContain("**A divider is the lightest line**");
    // tokens.json names rules by id, each id quoted in tokenRules.
    for (const entry of Object.values(json.usage)) for (const id of entry.rules ?? []) expect(json.tokenRules[id], id).toBeDefined();
    expect(json.usage["edge-dividers"]!.rules).toContain("design-system-a-divider-is-the-lightest");
    expect(usageOf("bg-component-hover")!.usage).toMatch(/^Hover/);
    expect(usageOf("neutral-100")!.kind).toBe("primitive");
    expect(usageOf("fg-danger-rung")!.kind).toBe("derivation");
    expect(usageOf("shadow-float")!.rules!.length).toBeGreaterThan(0);
  });
});
