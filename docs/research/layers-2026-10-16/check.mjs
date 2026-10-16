import "./model.js";
const { GROUNDS, CONTRAST, resolve, check } = globalThis.Layers;
let fails = 0;
for (const theme of ["light", "dark"]) for (const g of GROUNDS[theme]) for (let k = 0; k < CONTRAST.length; k++) for (const cast of [[0,0], theme === "light" ? [0.0034, 247] : [0.0115, 254]]) {
  const issues = check(resolve(theme, { groundL: g.L, contrast: k }), cast);
  if (issues.length) { fails++; console.log(theme, g.label, CONTRAST[k], cast[0] ? "cool" : "gray", "→", issues.join("; ")); }
}
console.log("combinations failing:", fails);
