/**
 * Layers (color/layers.ts): every combination of ground and layer contrast, in every neutral, keeps text readable and
 * keeps controls, selection and frames visible; the CSS that ships computes the same lightness as the model; and the
 * defaults reproduce Area's light theme as it was. docs/research/layers-2026-10-16/.
 */
import { describe, expect, it } from "vitest";
import {
  DARK_FILL_FLOOR, GROUND_DARK_STEPS, GROUND_LIGHT_STEPS, HUED_INKS, LAYER_STEPS, VIVID_ROLES, castOf, DEFAULT_FILL, FILL_STEPS, type FillSelection, groundLightness, layerHex, layerLightness, layerLightnessCss, layerTokens,
  DEFAULT_INK_TINT, INK_TINT_STEPS, TINT_HUES, TINT_STEP, TINT_STEPS, inkHex, CARD_TONE_STEPS, type CardTone, tintedDarken, TONAL_Y, VIVID_Y,
  EDGE_OFFSET, PRESS_ROOM, edgeShift, FRAME_SAME, POSITIONS, SIGNED_POSITIONS, layersAt, cardToneAt, inkShareAt,
  layersPosition, cardTonePosition, inkTintPosition, DEFAULT_LAYERS, tintChromaAt, tintPosition, fillStepAt, fillPosition,
} from "./layers.ts";
import { wcagContrastHex } from "./contrast.ts";
import { CHROMATIC_SCALES, NEUTRAL_SCALES } from "./presets.ts";
import { ACCENT_HUES } from "./generate.ts";
import { resolveTheme } from "../semantic/resolve.ts";
import { DARK_WASH, darkWashAlphas } from "../emit/base.ts";
import { THEMES, groundsOf, MIN, casts, mixOklab, alphaOver, problemsFor, cssLightness } from "./layer-checks.ts";

describe("layers: every combination is usable", () => {
  for (const theme of THEMES) for (const { id, cast } of casts) it(`${theme}, ${id}: text reads, controls and frames show`, () => {
    expect(problemsFor(theme, cast[theme])).toEqual([]);
  });
});

// Tint (axes/tint.ts, 2026-10-22): every hue and strength, held inside its hue's room (tintRoom), at every Text tint share,
// in both modes, through every check above, at every ground and Layers step (docs/research/custom-neutral-2026-10-22/).
// The 5° hues at every strength 1 to 16 and every quarter of text went with exact colours (2026-10-27): a picked page
// walks every degree at every chroma it can show, denser than they were (colours.test.ts), and the strengths a page can't
// show, which only the attributes reach, are walked here, every position on every 30° hue at every share and every degree
// at the room-bound strengths.
describe("layers: every tint is usable", () => {
  // Every degree since 2026-10-26: each hue at the strengths a hue's room bounds (4, 8, 16), at the text shares' ends and
  // middle; "every grey tint position" below walks every strength and share on the 30° hues.
  for (const theme of THEMES) it(`${theme}: every hue, every degree`, () => {
    const problems: string[] = [];
    for (const hue of TINT_HUES) for (const step of [4, 8, 16]) for (const share of [0, 2, 4]) {
      const found = problemsFor(theme, { hue, chroma: step * TINT_STEP }, share / 4);
      if (found.length) problems.push(`hue ${hue}, tint ${step}, text ${share}: ${found[0]} (+${found.length - 1})`);
    }
    expect(problems.slice(0, 20)).toEqual([]);
  }, 120_000);
  it("an untinted gray is unchanged by the text rule", () => {
    for (const share of INK_TINT_STEPS) expect(inkHex("light", 0.5, { hue: 0, chroma: 0 }, share / 4)).toBe(layerHex("light", 0.5, { hue: 0, chroma: 0 }));
  });
});

// Every fill setting combination (axes/states.ts): hover 1–5 × selected 0–4, on every ground and Layers step.
const FILL_COMBOS: FillSelection[] = [];
for (let hover = FILL_STEPS.hover.min; hover <= FILL_STEPS.hover.max; hover++) for (let selected = FILL_STEPS.selected.min; selected <= FILL_STEPS.selected.max; selected++) FILL_COMBOS.push({ hover, selected });

// Card tone (axes/card-tone.ts, 2026-10-22): every step in both modes, through every check above, at every ground and
// Layers step; and with the tint at its extremes, so a darker or lighter card on a tinted ground still reads.
describe("layers: every card tone is usable", () => {
  for (const theme of THEMES) it(`${theme}: every step`, () => {
    const problems: string[] = [];
    for (const step of CARD_TONE_STEPS) for (const { id, cast } of casts) {
      const found = problemsFor(theme, cast[theme], DEFAULT_INK_TINT / 4, step);
      if (found.length) problems.push(`card ${step}, ${id}: ${found[0]} (+${found.length - 1})`);
    }
    for (const step of CARD_TONE_STEPS) for (const hue of TINT_HUES.filter(h => h % 30 === 0)) for (const tint of [4, 8]) for (const share of [0, 4]) {
      const found = problemsFor(theme, { hue, chroma: tint * TINT_STEP }, share / 4, step);
      if (found.length) problems.push(`card ${step}, hue ${hue}, tint ${tint}, text ${share}: ${found[0]} (+${found.length - 1})`);
    }
    expect(problems).toEqual([]);
  });
  it("Auto keeps each container's own tone", () => {
    for (const theme of THEMES) for (const g of groundsOf(theme)) for (const n of LAYER_STEPS) {
      const m = layerLightness(theme, g, n);
      expect(m.card).toBe(m.raised); expect(m.tile).toBe(m.recessed);
    }
  });
});

// An Asset card's frame (FRAME_SAME, owner 2026-10-23): the page tone, or the recessed tone where the card around it is the
// page's, so wherever the layers differ at all the frame reads apart from its card; it is never a third tone.
describe("layers: an Asset card's frame reads apart from its card", () => {
  for (const theme of THEMES) it(theme, () => {
    const problems: string[] = [];
    for (const tone of ["auto", ...CARD_TONE_STEPS] as CardTone[]) for (const g of groundsOf(theme)) for (const n of LAYER_STEPS) {
      const m = layerLightness(theme, g, n, DEFAULT_FILL, tone), at = `${tone} ${g}/${n}`;
      for (const [frame, card, name] of [[m.frame, m.tile, "frame"], [m.frameRaised, m.raised, "raised frame"]] as const) {
        if (frame !== m.page && frame !== m.recessed) problems.push(`${at}: ${name} is neither the page nor the recessed tone`);
        if (Math.abs(card - m.page) >= FRAME_SAME && frame !== m.page) problems.push(`${at}: ${name} left the page tone on a card that differs`);
        if (Math.abs(card - m.page) < FRAME_SAME && m.recessed !== m.page && Math.abs(frame - card) < FRAME_SAME) problems.push(`${at}: ${name} matches its card`);
      }
    }
    expect(problems).toEqual([]);
  });
  it("Auto and the default light page keep today's page-tone frame", () => {
    const m = layerLightness("light", 100, 4);
    expect(m.frame).toBe(m.page);
  });
});

describe("layers: the shipped CSS computes what the model does", () => {
  for (const theme of THEMES) it(theme, () => {
    for (const tone of ["auto", ...CARD_TONE_STEPS] as CardTone[]) for (const f of tone === "auto" ? FILL_COMBOS : [DEFAULT_FILL]) for (const g of groundsOf(theme)) for (const n of LAYER_STEPS) {
      const m = layerLightness(theme, g, n, f, tone), c = cssLightness(theme, g, n, f, tone), p = `layer-${theme}-`;
      const pairs: Array<[string, number]> = [
        ["page", m.page], ["raised", m.raised], ["recessed", m.recessed], ["step", m.step],
        ["page-fill-0", m.fill.page[0]], ["page-fill-1", m.fill.page[1]], ["page-fill-2", m.fill.page[2]],
        ["raised-fill-0", m.fill.raised[0]], ["raised-fill-2", m.fill.raised[2]], ["recessed-fill-1", m.fill.recessed[1]],
        ["card", m.card], ["tile", m.tile], ["card-fill-0", m.fill.card[0]], ["card-fill-2", m.fill.card[2]], ["tile-fill-1", m.fill.tile[1]],
        ["frame", m.frame], ["frame-raised", m.frameRaised], ["frame-fill-0", m.fill.frame[0]], ["frame-fill-2", m.fill.frame[2]], ["frame-raised-fill-1", m.fill.frameRaised[1]],
        ["body", m.ink.body], ["muted", m.ink.muted], ["edge", m.ink.edge],
        ...(theme === "light" ? [["vivid-darken", m.vividDarken], ["tonal-darken", m.tonalDarken]] as Array<[string, number]> : [["tint-lift", m.tintLift], ["tint-lift-fill", m.tintLiftFill]] as Array<[string, number]>),
      ];
      for (const [k, x] of pairs) expect(c[p + k], `${theme} ${g}/${n} fill ${f.hover}/${f.selected} card ${tone} ${k}`).toBeCloseTo(x, 6);
    }
    // Exhaustive (every ground, layer step, fill combination and card tone): about 1s here, past vitest's 5s default on
    // a CI runner (it timed out in dark on main and on #176), so it takes the 60s its every-position sibling has.
  }, 60_000);
});

describe("layers: inks with a hue follow the ground", () => {
  // Every hued ink in every accent and neutral (accent's own inks change with it), darkened as the CSS does, on the page.
  const inks = { vivid: new Set<string>(), tonal: new Set<string>() };
  for (const neutral of NEUTRAL_SCALES) for (const accent of CHROMATIC_SCALES) {
    const t = resolveTheme({ theme: "light", neutral: neutral.id, accent: accent.id }).tokens;
    for (const { token, darken } of HUED_INKS) inks[darken].add(t[token]!);
  }
  // And the accent at every hue (axes/color.ts, 2026-10-23), at full strength and the quietest, with the status tones
  // quieted to it (Status colours Match, axes/accent.ts).
  for (const hue of ACCENT_HUES) for (const accentStrength of [100, 30]) {
    const t = resolveTheme({ theme: "light", neutral: "neutral", accent: String(hue), accentStrength, statusColours: "match" }).tokens;
    for (const { token, darken } of HUED_INKS) inks[darken].add(t[token]!);
  }
  it("light: vivid and tonal inks keep 4.5:1 on every page and the grounds on it, and are unchanged on white", () => {
    const problems: string[] = [];
    for (const g of GROUND_LIGHT_STEPS) for (const n of LAYER_STEPS) {
      // On the page and on the deepest ground text sits on, the recessed layer or a card at every Card tone.
      for (const tone of ["auto", ...CARD_TONE_STEPS] as CardTone[]) {
        const m = layerLightness("light", g, n, undefined, tone);
        if (g === 100 && tone === "auto" && (m.vividDarken !== 0 || m.tonalDarken !== 0)) problems.push(`${g}/${n}: darkens on white`);
        // Tonal inks on the deepest ground text sits on, vivid ones on the page or a darker Card tone (VIVID_ROLES).
        for (const [kind, d, ground] of [["vivid", m.vividDarken, Math.min(m.page, m.card)], ["tonal", m.tonalDarken, Math.min(m.recessed, m.card, m.tile)]] as const) {
          const bg = layerHex("light", ground, { chroma: 0, hue: 0 });
          for (const ink of inks[kind]) if (wcagContrastHex(mixOklab(ink, "black", d), bg) < 4.5) problems.push(`${g}/${n} tone ${tone}: ${kind} ${ink} on ${bg}`);
        }
      }
    }
    expect(problems).toEqual([]);
  });
  // On a tinted page too (palette research 2026-10-23: "a blue link on a 0.08 yellow page is unproven"): every hue in 15°
  // steps at Tint 1, 2, 4, 8, 12 and 16, held inside its room as the CSS holds it.
  it("light: vivid and tonal inks keep 4.5:1 on every tinted page", () => {
    const problems: string[] = [];
    for (const g of GROUND_LIGHT_STEPS) for (const n of LAYER_STEPS) for (let hue = 0; hue < 360; hue += 15) for (const step of [1, 2, 4, 8, 12, 16]) {
      const m = layerLightness("light", g, n), grounds = { vivid: m.page, tonal: Math.min(m.recessed, m.card, m.tile) };
      for (const kind of ["vivid", "tonal"] as const) {
        const bg = layerHex("light", grounds[kind], { chroma: step * TINT_STEP, hue }), d = tintedDarken(grounds[kind], step * TINT_STEP, kind === "vivid" ? VIVID_Y : TONAL_Y);
        for (const ink of inks[kind]) if (wcagContrastHex(mixOklab(ink, "black", d), bg) < 4.5) problems.push(`${g}/${n} hue ${hue} tint ${step}: ${kind} ${ink} on ${bg}`);
      }
    }
    expect(problems.slice(0, 20)).toEqual([]);
  }, 60_000);
  // Tag's dark inks (tag.css: the vivid rungs, gray, and its green and yellow literals) over a 16% wash of themselves.
  const tagInks = [...VIVID_ROLES.filter(r => r !== "accent" && r !== "caution" && r !== "success").map(r => resolveTheme({ theme: "dark", neutral: "neutral", accent: "blue" }).tokens[`fg-${r}-vivid`]!), resolveTheme({ theme: "dark", neutral: "neutral", accent: "blue" }).tokens["fg-gray"]!, "#85ce94", "#e2b968"];
  it("dark: tinted labels keep 4.5:1 on their plate on every raised layer, field and hovered row", () => {
    const problems: string[] = [];
    for (const g of GROUND_DARK_STEPS) for (const n of LAYER_STEPS) {
      const m = layerLightness("dark", g, n);
      for (const [ground, lift] of [[m.page, m.tintLift], [m.raised, m.tintLift], [m.fill.raised[0], m.tintLiftFill], [m.fill.raised[1], m.tintLiftFill]] as const) {
        const bg = layerHex("dark", ground, { chroma: 0, hue: 0 });
        for (const ink of tagInks) if (wcagContrastHex(mixOklab(ink, "white", lift), alphaOver(ink, 0.16, bg)) < 4.5) problems.push(`${g}/${n}: ${ink} on ${bg}`);
      }
    }
    expect(problems).toEqual([]);
  });
});

// Layers 4 was the default until the defaults review (2026-10-25), which made Flat (0) the default; 4 still draws Area as it was.
describe("layers: Layers 4 is Area as it was", () => {
  // Muted text is #646464, not #666666, since 2026-10-23: it is solved on the recessed selected fill pressed by PRESS_ROOM,
  // so a sidebar row's press shows (it equalled selected at the defaults).
  it("light 100 + 4 reproduces the light theme", () => {
    const t = layerTokens("light", { groundLight: 100, groundDark: 8, layersLight: 4, layersDark: 4 }, { chroma: 0, hue: 0 });
    expect(t).toMatchObject({
      "bg-page": "#ffffff", "bg-surface": "#ffffff", "bg-subtle": "#f7f7f7", "bg-stripe": "#fafafa", "bg-code": "#ffffff",
      "bg-component": "#f7f7f7", "bg-component-hover": "#f3f3f3", "bg-component-active": "#eeeeee",
      "fg-default": "#282828", "fg-muted": "#646464", "fg-placeholder": "#646464",
      "border-decorative": "#f3f3f3", "border-card": "#eeeeee", "border-float": "#eeeeee", "border-faint": "#e2e2e2", "border-divider": "#e2e2e2",
      "border-subtle": "#d4d4d4", "border": "#c5c5c5", "border-hover": "#b4b4b4", "stroke-control": "#838383", "stroke-control-hover": "#747474",
    });
  });
  it("dark 8 + 4 keeps the near-black page and today's inks", () => {
    const t = layerTokens("dark", { groundLight: 100, groundDark: 8, layersLight: 4, layersDark: 4 }, { chroma: 0, hue: 0 });
    expect(t).toMatchObject({ "bg-page": "#020202", "fg-default": "#eeeeee", "fg-muted": "#c5c5c5", "stroke-control": "#939393", "stroke-control-hover": "#a4a4a4", "border-decorative": "#282828", "border-card": "#333333", "border-float": "#4b4b4b" });
  });
});

describe("layers: the state fills keep their order and read apart at every setting", () => {
  for (const theme of THEMES) it(theme, () => {
    const problems: string[] = [];
    for (const f of FILL_COMBOS) for (const g of groundsOf(theme)) for (const n of LAYER_STEPS) {
      const m = layerLightness(theme, g, n, f);
      for (const ground of ["page", "raised", "recessed"] as const) {
        const [rest, hover, selected] = m.fill[ground], sign = theme === "light" ? -1 : 1;
        // hover moves away from rest, selected never back past hover (equal only at Selected fill 0)
        if (sign * (hover - rest) < -1e-9) problems.push(`${theme} ${g}/${n} ${f.hover}/${f.selected} ${ground}: hover behind rest`);
        if (sign * (selected - hover) < -1e-9) problems.push(`${theme} ${g}/${n} ${f.hover}/${f.selected} ${ground}: selected behind hover`);
        if (f.selected > 0 && Math.abs(selected - hover) < 0.008) problems.push(`${theme} ${g}/${n} ${f.hover}/${f.selected} ${ground}: selected reads as hover (${(selected - hover).toFixed(4)})`);
      }
    }
    expect(problems).toEqual([]);
  });
});

// The dark translucent washes (emit/base.ts DARK_WASH): hover, selected and pressed in order at every setting, every
// Pressed step its own wash, under the cap, and the defaults as they were (theme review 2026-10-24: capped one by one, at
// Hover 3 and 4 every Selected and Pressed step equalled hover). Hover 3 and 4 share the hover stop: the cap leaves no room.
describe("layers: the dark washes keep their order at every setting", () => {
  it("dark", () => {
    const problems: string[] = [];
    for (const h of [1, 2, 3, 4]) for (const sel of [0, 1, 2, 3, 4]) for (const p of [1, 2, 3, 4]) {
      const w = darkWashAlphas(h, sel, p), id = `${h}/${sel}/${p}`;
      if (sel > 0 && w.selected - w.hover < 0.02 - 1e-9) problems.push(`${id}: selected ${w.selected.toFixed(3)} reads as hover ${w.hover.toFixed(3)}`);
      // Pressed moves 0.425% a step by design (owner, 2026-10-21); here only its order is held.
      if (w.pressed - w.selected < 0.002) problems.push(`${id}: press ${w.pressed.toFixed(4)} on selected ${w.selected.toFixed(4)}`);
      if (w.pressed > DARK_WASH.max + 1e-9) problems.push(`${id}: pressed ${w.pressed.toFixed(3)} past the cap`);
      if (p > 1 && w.pressed - darkWashAlphas(h, sel, p - 1).pressed < 0.002) problems.push(`${id}: pressed step ${p} reads as ${p - 1}`);
    }
    const d = darkWashAlphas(2, 1, 4);
    expect([d.hover, d.selected, d.pressed].map(x => Number(x.toFixed(4)))).toEqual([0.14, 0.19, 0.207]);
    expect(problems).toEqual([]);
  });
});

// Pressed (styles/layers.css): the selected fill moved 12% (light) or 14% (dark) toward the body ink, stopped where muted text
// keeps 4.6:1. The inks are solved with PRESS_ROOM to spare on the deepest (light) or lightest (dark) ground, so on every
// ground, at every fill step, card tone and Layers setting, the firmest press moves at least that far past selected (dark:
// as far as white text allows, 0.563 L, on the lightest grounds). The layer map (2026-10-22) found it equal to selected on
// recessed in light at Layers 4 to 8 and on raised in dark from 16 + 8.
describe("layers: a press has room on every ground", () => {
  const whiteLimit = Math.cbrt((1 + 0.05) / 4.6 - 0.05);
  for (const theme of THEMES) it(theme, () => {
    const problems: string[] = [];
    for (const tone of ["auto", ...CARD_TONE_STEPS] as CardTone[]) for (const f of tone === "auto" ? FILL_COMBOS : [DEFAULT_FILL]) for (const g of groundsOf(theme)) for (const n of LAYER_STEPS) {
      const m = layerLightness(theme, g, n, f, tone), muted = m.ink.muted ** 3, body = m.ink.body;
      const bound = theme === "light" ? Math.cbrt(4.6 * (muted + 0.05) - 0.05) : Math.cbrt(Math.max(0, (muted + 0.05) / 4.6 - 0.05));
      for (const ground of ["page", "raised", "recessed", "card", "tile"] as const) {
        const selected = m.fill[ground][2];
        const pressed = theme === "light" ? Math.max(selected - 0.12 * (selected - body), bound) : Math.min(selected + 0.14 * (body - selected), bound);
        // Dark fills stop where white text keeps 4.6:1 pressed (DARK_FILL_CEILING, 2026-10-23), so the room is always there.
        const room = theme === "light" ? PRESS_ROOM.light : PRESS_ROOM.dark;
        if (Math.abs(pressed - selected) < room - 1e-6) problems.push(`${tone} ${f.hover}/${f.selected} ${g}/${n} ${ground}: press ${(pressed - selected).toFixed(4)}`);
        if (theme === "dark" && selected + PRESS_ROOM.dark > whiteLimit + 1e-6) problems.push(`${tone} ${f.hover}/${f.selected} ${g}/${n} ${ground}: selected ${selected.toFixed(4)} leaves white text no press`);
      }
    }
    expect(problems).toEqual([]);
  });
});

// Edges on the ground they sit on (color/layers.ts GROUND_EDGES, styles/layers.css): every edge keeps its page distance
// (dark: from the raised layer) on every ground, so a card's frame on a sidebar reads as it does on the page (the layer map,
// 2026-10-22: 1.01:1 at Layers 8 before), and frames clear the frame minimum on every ground.
describe("layers: edges keep their contrast on every ground", () => {
  for (const theme of THEMES) it(theme, () => {
    const problems: string[] = [];
    for (const tone of ["auto", ...CARD_TONE_STEPS] as CardTone[]) for (const g of groundsOf(theme)) for (const n of LAYER_STEPS) {
      const m = layerLightness(theme, g, n, DEFAULT_FILL, tone), ref = theme === "light" ? m.page : m.raised;
      for (const ground of ["page", "raised", "recessed", "card", "tile"] as const) {
        const L = m[ground], shift = edgeShift(theme, m, L);
        for (const k of Object.keys(EDGE_OFFSET.light) as (keyof typeof EDGE_OFFSET.light)[]) {
          const on = theme === "light" ? m.edge[k] - shift : m.edge[k] + shift;
          if (Math.abs(on - L) < Math.abs(m.edge[k] - ref) - 1e-9 && Math.abs(on - L) < Math.abs(m.edge[k] - L) - 1e-9) problems.push(`${tone} ${g}/${n} ${k} on ${ground}`);
        }
        const frame = theme === "light" ? m.edge.card - shift : m.edge.card + shift;
        if (Math.abs(frame - L) < MIN[theme].frame) problems.push(`${tone} ${g}/${n} card frame on ${ground}: ${Math.abs(frame - L).toFixed(4)}`);
      }
    }
    expect(problems).toEqual([]);
  });
});

// Positions (2026-10-26, owner: "a slider that adjusts to every possible percentage maybe to the ones place only"): Layer
// contrast, Card shade and Text tint take every whole number of 0–100 (Card shade ±100). The grids above walk the marks; here
// every pair of Layer contrast and Card shade positions on every ground goes through every check, each with every neutral
// against the other's marks, Text tint at every position, and the shipped CSS at every position. A tone can turn back along
// a setting (a raised fill on a gray page climbs to white, then steps down), so the walk is every position, not the ends.
describe("layers: every position is usable", () => {
  const LAYERS = POSITIONS.map(layersAt), TONES = SIGNED_POSITIONS.map(cardToneAt);
  const MARK_TONES: CardTone[] = ["auto", -4, 0, 4];
  it("the marks are whole positions and the old steps land on them", () => {
    expect(LAYER_STEPS.map(layersPosition)).toEqual([0, 25, 50, 75, 100]);
    expect(CARD_TONE_STEPS.map(cardTonePosition)).toEqual([-100, -88, -75, -63, -50, -38, -25, -13, 0, 13, 25, 38, 50, 63, 75, 88, 100]);
    expect(INK_TINT_STEPS.map(inkTintPosition)).toEqual([0, 25, 50, 75, 100]);
    for (const step of LAYER_STEPS) expect(layersAt(layersPosition(step))).toBe(step);
    for (const step of INK_TINT_STEPS) expect(inkShareAt(inkTintPosition(step))).toBe(step / 4);
    expect(layersPosition(DEFAULT_LAYERS)).toBe(0);
  });
  for (const theme of THEMES) {
    it(`${theme}: every Layer contrast position, in every neutral, at the Card shade marks`, () => {
      const problems: string[] = [];
      for (const tone of MARK_TONES) for (const { id, cast } of casts) {
        const found = problemsFor(theme, cast[theme], DEFAULT_INK_TINT / 4, tone, LAYERS);
        if (found.length) problems.push(`card ${tone}, ${id}: ${found[0]} (+${found.length - 1})`);
      }
      expect(problems).toEqual([]);
    }, 60_000);
    it(`${theme}: every Card shade position, in every neutral, at the Layer contrast marks`, () => {
      const problems: string[] = [];
      for (const tone of TONES) for (const { id, cast } of casts) {
        const found = problemsFor(theme, cast[theme], DEFAULT_INK_TINT / 4, tone);
        if (found.length) problems.push(`card ${tone}, ${id}: ${found[0]} (+${found.length - 1})`);
      }
      expect(problems).toEqual([]);
    }, 60_000);
    it(`${theme}: every pair of Layer contrast and Card shade positions, on every ground`, () => {
      const problems: string[] = [];
      for (const tone of TONES) {
        const found = problemsFor(theme, casts[0]!.cast[theme], DEFAULT_INK_TINT / 4, tone, LAYERS);
        if (found.length) problems.push(`card ${tone}: ${found[0]} (+${found.length - 1})`);
      }
      expect(problems).toEqual([]);
    }, 300_000);
    it(`${theme}: every Text tint position, on every 30° hue at the strongest tints`, () => {
      const problems: string[] = [];
      for (const position of POSITIONS) for (const hue of TINT_HUES.filter(h => h % 30 === 0)) for (const tint of [8, 16]) {
        const found = problemsFor(theme, { hue, chroma: tint * TINT_STEP }, inkShareAt(position));
        if (found.length) problems.push(`text ${position}, hue ${hue}, tint ${tint}: ${found[0]} (+${found.length - 1})`);
      }
      expect(problems).toEqual([]);
    }, 60_000);
    it(`${theme}: an Asset card's frame reads apart at every position`, () => {
      const problems: string[] = [];
      const check = (g: number, n: number, tone: CardTone) => {
        const m = layerLightness(theme, g, n, DEFAULT_FILL, tone);
        for (const [frame, card, name] of [[m.frame, m.tile, "frame"], [m.frameRaised, m.raised, "raised frame"]] as const) {
          if (frame !== m.page && frame !== m.recessed) problems.push(`${tone} ${g}/${n}: ${name} is a third tone`);
          // The frame sits FRAME_SAME from its card, or where neither tone is that far, as far as the layers go.
          const room = Math.min(FRAME_SAME, Math.max(Math.abs(m.page - card), Math.abs(m.recessed - card)));
          if (Math.abs(frame - card) < room - 1e-9) problems.push(`${tone} ${g}/${n}: ${name} is ${Math.abs(frame - card).toFixed(5)} from its card`);
        }
      };
      for (const g of groundsOf(theme)) {
        for (const n of LAYERS) for (const tone of MARK_TONES) check(g, n, tone);
        for (const tone of TONES) for (const n of LAYER_STEPS) check(g, n, tone);
      }
      expect(problems).toEqual([]);
    });
    it(`${theme}: the shipped CSS computes what the model does at every position`, () => {
      const grounds = [groundsOf(theme)[0]!, theme === "light" ? 100 : 8, groundsOf(theme).at(-1)!];
      const keys = ["page", "raised", "recessed", "card", "tile", "frame", "frame-raised", "page-fill-2", "card-fill-0", "body", "muted", "edge"] as const;
      const model = (m: ReturnType<typeof layerLightness>): Record<(typeof keys)[number], number> => ({ page: m.page, raised: m.raised, recessed: m.recessed, card: m.card, tile: m.tile, frame: m.frame, "frame-raised": m.frameRaised, "page-fill-2": m.fill.page[2], "card-fill-0": m.fill.card[0], body: m.ink.body, muted: m.ink.muted, edge: m.ink.edge });
      const compare = (g: number, n: number, tone: CardTone) => {
        const m = model(layerLightness(theme, g, n, DEFAULT_FILL, tone)), c = cssLightness(theme, g, n, DEFAULT_FILL, tone);
        for (const k of keys) expect(c[`layer-${theme}-${k}`], `${theme} ${g}/${n} card ${tone} ${k}`).toBeCloseTo(m[k], 6);
      };
      for (const g of grounds) {
        for (const n of LAYERS) for (const tone of MARK_TONES) compare(g, n, tone);
        for (const tone of TONES) for (const n of [0, 4, 8]) compare(g, n, tone);
      }
    }, 60_000);
  }
});

// Grey tint strength and the state fills as positions (2026-10-26). Tint: every position on every 30° hue at every Text
// tint quarter (the 5° hues at the marks are "every tint is usable"). Fills: every Hover position at every Selected mark
// and every Selected position at every Hover mark, through every check, the order, the press's room and the dark washes.
// The minimum steps between neighbouring fills hold at the marks (25, 50, 75, 100); between Selected 0 (the hover plate)
// and 25 a selected row moves from the hover plate toward the first mark, never behind hover.
describe("layers: every grey tint and fill position is usable", () => {
  const HOVERS = POSITIONS.filter(p => p >= fillPosition(FILL_STEPS.hover.min)).map(fillStepAt);
  const SELECTEDS = POSITIONS.map(fillStepAt), PRESSES = POSITIONS.filter(p => p >= fillPosition(FILL_STEPS.pressed.min)).map(fillStepAt);
  const COMBOS: FillSelection[] = [
    ...HOVERS.flatMap(hover => [0, 1, 2, 3, 4].map(selected => ({ hover, selected }))),
    ...[1, 2, 3, 4].flatMap(hover => SELECTEDS.map(selected => ({ hover, selected }))),
  ];
  it("the marks are whole positions", () => {
    expect([4, 8, 12, 16].map(tintPosition)).toEqual([25, 50, 75, 100]);
    expect(tintChromaAt(50)).toBe(8 * TINT_STEP);
    expect([0, 1, 2, 3, 4].map(fillPosition)).toEqual([0, 25, 50, 75, 100]);
    for (const step of [0, 1, 2, 3, 4]) expect(fillStepAt(fillPosition(step))).toBe(step);
  });
  for (const theme of THEMES) {
    it(`${theme}: every grey tint position`, () => {
      const problems: string[] = [];
      for (const position of POSITIONS) for (const hue of TINT_HUES.filter(h => h % 30 === 0)) for (const share of INK_TINT_STEPS) {
        if (position === 0) continue;
        const found = problemsFor(theme, { hue, chroma: tintChromaAt(position) }, share / 4);
        if (found.length) problems.push(`hue ${hue}, tint ${position}, text ${share}: ${found[0]} (+${found.length - 1})`);
      }
      expect(problems.slice(0, 20)).toEqual([]);
    }, 120_000);
    it(`${theme}: every fill position reads, in order, with room to press`, () => {
      const problems: string[] = [];
      for (const f of COMBOS) {
        const found = problemsFor(theme, { hue: 0, chroma: 0 }, DEFAULT_INK_TINT / 4, "auto", LAYER_STEPS, f);
        if (found.length) problems.push(`fill ${f.hover}/${f.selected}: ${found[0]} (+${found.length - 1})`);
        for (const g of groundsOf(theme)) for (const n of LAYER_STEPS) {
          const m = layerLightness(theme, g, n, f), sign = theme === "light" ? -1 : 1;
          for (const ground of ["page", "raised", "recessed"] as const) {
            const [rest, hover, selected] = m.fill[ground];
            if (sign * (hover - rest) < -1e-9) problems.push(`${g}/${n} ${f.hover}/${f.selected} ${ground}: hover behind rest`);
            if (sign * (selected - hover) < -1e-9) problems.push(`${g}/${n} ${f.hover}/${f.selected} ${ground}: selected behind hover`);
            if (Number.isInteger(f.selected) && f.selected > 0 && Math.abs(selected - hover) < 0.008) problems.push(`${g}/${n} ${f.hover}/${f.selected} ${ground}: selected reads as hover`);
            // The firmest press keeps PRESS_ROOM past selected, as "a press has room on every ground" measures it.
            const muted = m.ink.muted ** 3, bound = theme === "light" ? Math.cbrt(4.6 * (muted + 0.05) - 0.05) : Math.cbrt(Math.max(0, (muted + 0.05) / 4.6 - 0.05));
            const press = theme === "light" ? Math.max(selected - 0.12 * (selected - m.ink.body), bound) : Math.min(selected + 0.14 * (m.ink.body - selected), bound);
            if (Math.abs(press - selected) < PRESS_ROOM[theme] - 1e-6) problems.push(`${g}/${n} ${f.hover}/${f.selected} ${ground}: press ${(press - selected).toFixed(4)}`);
          }
        }
      }
      expect(problems.slice(0, 20)).toEqual([]);
    }, 120_000);
  }
  for (const theme of THEMES) it(`${theme}: the shipped CSS computes every fill position as the model does`, () => {
    const grounds = [groundsOf(theme)[0]!, groundsOf(theme).at(-1)!];
    const combos = [...HOVERS.map(hover => ({ hover, selected: 1 })), ...SELECTEDS.map(selected => ({ hover: 2, selected }))];
    for (const f of combos) for (const g of grounds) for (const n of [0, 4, 8]) {
      const m = layerLightness(theme, g, n, f), c = cssLightness(theme, g, n, f), p = `layer-${theme}-`;
      for (const [k, x] of [["page-fill-1", m.fill.page[1]], ["page-fill-2", m.fill.page[2]], ["raised-fill-2", m.fill.raised[2]], ["recessed-fill-1", m.fill.recessed[1]], ["body", m.ink.body], ["muted", m.ink.muted]] as Array<[string, number]>)
        expect(c[p + k], `${theme} ${g}/${n} fill ${f.hover}/${f.selected} ${k}`).toBeCloseTo(x, 6);
    }
  }, 120_000);
  it("dark: the washes keep their order at every position", () => {
    const problems: string[] = [];
    for (const h of HOVERS) for (const sel of SELECTEDS) for (const p of PRESSES) {
      const w = darkWashAlphas(h, sel, p), id = `${h}/${sel}/${p}`;
      if (w.selected < w.hover - 1e-9) problems.push(`${id}: selected behind hover`);
      if (w.pressed - w.selected < 0.002 * Math.min(1, p) - 1e-9) problems.push(`${id}: press ${w.pressed.toFixed(4)} on selected ${w.selected.toFixed(4)}`);
      if (w.pressed > DARK_WASH.max + 1e-9) problems.push(`${id}: pressed past the cap`);
    }
    expect(problems.slice(0, 20)).toEqual([]);
  });
});
