// The Layers model: every background, control fill and edge as an OKLCH lightness derived from a ground and a contrast.
// Shared by the page (script tag) and the checker (node). Numbers trace to docs: Area today, the references, and the
// visibility floors measured below.
(function (root) {
  // OKLCH → sRGB hex (Björn Ottosson's OKLab) and WCAG contrast.
  const toLin = ([L, a, b]) => {
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;
    return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s];
  };
  const gamma = c => { c = Math.min(1, Math.max(0, c)); return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055; };
  const hexOf = (L, c = 0, h = 0) => "#" + toLin([L, c * Math.cos(h * Math.PI / 180), c * Math.sin(h * Math.PI / 180)]).map(gamma).map(v => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
  const lum = hex => { const v = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const clamp = L => Math.min(1, Math.max(0, L));

  // Grounds, as OKLCH lightness. Light from white down in 1% steps; dark from black, then the first visible darks up.
  const GROUNDS = {
    light: [100, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90].map(p => ({ id: String(p), label: p === 100 ? "100 (White)" : String(p), L: p / 100 })),
    dark: [0, 8, 12, 14, 16, 18, 20, 22, 24].map(p => ({ id: String(p), label: p === 0 ? "0 (Black)" : p === 8 ? "8 (Default)" : String(p), L: p === 8 ? 0.085 : p / 100 })),
  };
  const CONTRAST = ["Flat", "Low", "Default", "High"];
  const DEFAULTS = { light: { ground: "100", contrast: 2 }, dark: { ground: "8", contrast: 2 } };

  // Text and required edges stay on the ramp (Area today).
  const TEXT = { light: { body: "#282828", muted: "#666666", edge: "#838383" }, dark: { body: "#eeeeee", muted: "#c5c5c5", edge: "#939393" } };

  // How far each layer sits from the page, by contrast. Light: recessed darker; raised lifts toward white only on a gray
  // page (Carbon). Dark: both lighter, raised twice the recessed.
  const LAYER = {
    light: { recessed: [0, 0.012, 0.024, 0.036], raised: [0, 0.018, 0.036, 0.036] },
    dark: { recessed: [0, 0.015, 0.03, 0.06], raised: [0, 0.03, 0.06, 0.12] },
  };
  // A control's fill steps from its own ground. Light: rest s, hover 1.5 s, pressed / selected 2.125 s (today on white:
  // 50 / 75 / 100). Dark: rest at least s above the ground and never under L 0.20 (a smaller step near black doesn't show
  // on a screen; ChatGPT's controls are #303030 on #000), hover + s, pressed / selected + 2 s (today: 800 / 750 / 700).
  const STEP = { light: [0.018, 0.018, 0.024, 0.03], dark: [0.04, 0.04, 0.046, 0.06] };
  const DARK_FILL_FLOOR = 0.2;
  // Near black a layer offset doesn't show either: on a darker ground, layers start at L 0.12 (Spectrum Darkest's first
  // layer is #0e0e0e, L 0.164).
  const DARK_LAYER_FLOOR = 0.12;
  // Edges follow the ground: Area today's distance from white (light) or from the raised 850 (dark), kept at least as
  // strong as today's absolute value.
  const EDGES = {
    light: { decorative: 0.036, card: 0.051, float: 0.051, faint: 0.087, subtle: 0.13, border: 0.1766, hover: 0.2301 },
    dark: { decorative: 0.05, card: 0.09, float: 0.182, faint: 0.09, subtle: 0.09, border: 0.182, hover: 0.2296 },
    darkToday: { decorative: 0.2768, card: 0.3211, float: 0.4128, faint: 0.3211, subtle: 0.3211, border: 0.4128, hover: 0.4604 },
  };

  function layers(theme, groundL, k, step) {
    if (theme === "light") {
      const page = groundL, raised = clamp(page + (page < 1 ? Math.min(1 - page, LAYER.light.raised[k]) : 0)), recessed = page - LAYER.light.recessed[k];
      return { page, raised, recessed };
    }
    const lift = k && groundL < DARK_LAYER_FLOOR ? DARK_LAYER_FLOOR - groundL : 0;
    return { page: groundL, raised: groundL + lift + LAYER.dark.raised[k], recessed: groundL + lift + LAYER.dark.recessed[k] };
  }
  function fills(theme, g, s) {
    if (theme === "light") return [g - s, g - 1.5 * s, g - 2.125 * s].map(clamp);
    const rest = Math.max(g + s, DARK_FILL_FLOOR);
    return [rest, rest + s, rest + 2 * s].map(clamp);
  }
  function edges(theme, page, raised) {
    const out = {};
    for (const [k, d] of Object.entries(EDGES[theme === "light" ? "light" : "dark"]))
      out[k] = theme === "light" ? clamp(page - d) : Math.max(EDGES.darkToday[k], raised + d);
    return out;
  }

  // Text and required edges hold their contrast on whatever they sit on: muted text and control edges keep today's
  // value (#666 / #838383 light, #c5c5c5 / #939393 dark) wherever it passes, and otherwise darken (light) or lighten
  // (dark) just enough for 4.5:1 and 3:1 on the deepest surface they sit on: every layer and every field at rest or
  // under the pointer. Body text keeps #282828 / #eeeeee unless that fails, which no ground here makes it do.
  const TODAY_INK = { light: { body: 0.27685, muted: 0.51028, edge: 0.60999 }, dark: { body: 0.94912, muted: 0.82344, edge: 0.66325 } };
  function inkFor(theme, startL, grounds, min) {
    const ok = L => grounds.every(g => ratio(hexOf(L), hexOf(g)) >= min);
    let L = startL;
    for (let i = 0; i < 400 && !ok(L); i++) L += theme === "light" ? -0.0025 : 0.0025;
    return clamp(L);
  }
  function inks(theme, r) {
    const text = [r.page, r.raised, r.recessed, ...["page", "raised", "recessed"].flatMap(k => r.fill[k].slice(0, 2))];
    const edgeGrounds = [r.page, r.raised, r.recessed, ...["page", "raised", "recessed"].map(k => r.fill[k][0])];
    const sel = ["page", "raised", "recessed"].map(k => r.fill[k][2]);
    return {
      body: inkFor(theme, TODAY_INK[theme].body, [...text, ...sel], 4.6),
      muted: inkFor(theme, TODAY_INK[theme].muted, text, 4.6),
      edge: inkFor(theme, TODAY_INK[theme].edge, edgeGrounds, 3.1),
    };
  }

  /** Everything a scene needs for one theme at one ground and contrast (or explicit numbers). */
  function resolve(theme, { groundL, contrast, custom }) {
    const k = contrast ?? 2;
    const step = custom?.step ?? STEP[theme][k];
    const L = custom ? { page: custom.page, raised: clamp(custom.page + custom.raised), recessed: clamp(custom.page + custom.recessed) } : layers(theme, groundL, k, step);
    const r = { theme, ...L, step, fill: { page: fills(theme, L.page, step), raised: fills(theme, L.raised, step), recessed: fills(theme, L.recessed, step) }, edge: edges(theme, L.page, L.raised) };
    r.ink = inks(theme, r);
    return r;
  }

  // Usability checks. ΔL floors are the smallest steps Area ships today that read: light 0.012 (sidebar 50 → hover 75),
  // dark 0.04 (a fill near today's 0.046).
  const MIN = { light: { fill: 0.017, hover: 0.009, selected: 0.035, frame: 0.03, layer: 0.009 }, dark: { fill: 0.035, hover: 0.035, selected: 0.07, frame: 0.06, layer: 0.012 } };
  function check(r, cast = [0, 0]) {
    const m = MIN[r.theme], hx = L => hexOf(L, cast[0], cast[1]), t = { body: hexOf(r.ink.body), muted: hexOf(r.ink.muted), edge: hexOf(r.ink.edge) };
    const issues = [];
    const grounds = [["page", r.page], ["raised", r.raised], ["recessed", r.recessed]];
    for (const [name, g] of grounds) {
      const [rest, hover, sel] = r.fill[name];
      if (ratio(t.muted, hx(g)) < 4.5) issues.push(`muted text on ${name} ${ratio(t.muted, hx(g)).toFixed(2)}`);
      if (ratio(t.muted, hx(rest)) < 4.5) issues.push(`placeholder on a field (${name}) ${ratio(t.muted, hx(rest)).toFixed(2)}`);
      if (ratio(t.muted, hx(hover)) < 4.5) issues.push(`muted text on a hovered row (${name}) ${ratio(t.muted, hx(hover)).toFixed(2)}`);
      if (ratio(t.body, hx(sel)) < 4.5) issues.push(`text on a selected row (${name})`);
      if (ratio(t.edge, hx(g)) < 3) issues.push(`control edge on ${name} ${ratio(t.edge, hx(g)).toFixed(2)}`);
      if (ratio(t.edge, hx(rest)) < 3) issues.push(`control edge on a field (${name}) ${ratio(t.edge, hx(rest)).toFixed(2)}`);
      if (Math.abs(rest - g) < m.fill) issues.push(`field on ${name} barely shows (ΔL ${Math.abs(rest - g).toFixed(3)})`);
      if (Math.abs(hover - rest) < m.hover) issues.push(`hover on ${name} barely changes (ΔL ${Math.abs(hover - rest).toFixed(3)})`);
      if (Math.abs(sel - g) < m.selected) issues.push(`selected on ${name} barely shows (ΔL ${Math.abs(sel - g).toFixed(3)})`);
      if (r.theme === "dark" && rest < DARK_FILL_FLOOR - 1e-9) issues.push(`field on ${name} under the dark floor`);
    }
    if (Math.abs(r.edge.card - r.page) < m.frame) issues.push(`card frame on the page barely shows (ΔL ${Math.abs(r.edge.card - r.page).toFixed(3)})`);
    if (Math.abs(r.edge.float - r.raised) < m.frame) issues.push(`menu frame barely shows`);
    if (Math.abs(r.edge.decorative - r.page) < m.frame * 0.8 && Math.abs(r.edge.decorative - r.recessed) < m.frame * 0.8) issues.push(`sidebar rule barely shows`);
    return issues;
  }
  root.Layers = { GROUNDS, CONTRAST, DEFAULTS, TEXT, TODAY_INK, resolve, check, hexOf, ratio };
})(typeof window !== "undefined" ? window : globalThis);
