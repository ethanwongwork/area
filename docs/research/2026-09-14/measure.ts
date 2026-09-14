/** Reproduce the audit's token measurements: node docs/research/2026-09-14/measure.ts */
import { AXES, checkAxisIntegrity } from '../../../packages/tokens/src/axes/registry.ts';
import { shippedThemes } from '../../../packages/tokens/src/semantic/resolve.ts';
import { wcagContrastHex } from '../../../packages/tokens/src/color/contrast.ts';
const themes = shippedThemes();
function pair(fg: string, bg: string, threshold: number) {
  const values = themes.map(t => ({ theme: `${t.theme}/${t.neutral}/${t.brand}`, fg: t.tokens[fg], bg: t.tokens[bg], ratio: wcagContrastHex(t.tokens[fg]!,t.tokens[bg]!) }));
  const failing = values.filter(v => v.ratio < threshold);
  return {fg, bg, threshold, failures:failing.length, total:values.length, worst:values.sort((a,b)=>a.ratio-b.ratio)[0]};
}
const injected = structuredClone(AXES);
const target = injected.find(a=>a.id==='brand')!.presets[0]!;
target.darkTokens!['--area-audit-undeclared'] = 'NaN';
console.log(JSON.stringify({
  date:'2026-09-14', baseline:'e07ec11', note:'75/100/150 trial. Ratios are computed from resolved tokens, not a whole-site conformance audit.',
  axes:AXES.map(a=>({id:a.id, presets:a.presets.map(p=>p.id), default:a.defaultPreset})),
  combinations:AXES.reduce((v,a)=>v*a.presets.length,1), colorThemes:themes.length,
  neutralLight:themes.filter(t=>t.theme==='light'&&t.brand==='indigo').map(t=>({neutral:t.neutral, strokes:Object.fromEntries(['border-decorative','border-faint','border-subtle'].map(n=>[n,{hex:t.tokens[n],ratio:wcagContrastHex(t.tokens[n]!,t.tokens['bg-page']!)}]))})),
  pairs:[pair('border-subtle','bg-surface',1.3),pair('border-faint','bg-page',1.2),pair('border-faint','bg-subtle',1.1),pair('fg-placeholder','bg-surface',4.5), ...['brand','danger','warning','caution','success','info','discovery'].map(t=>pair(`fg-on-${t}`,`${t}-solid-hover`,4.5))],
  integrity: {unmodified:checkAxisIntegrity().length, extraInvalidDarkToken:checkAxisIntegrity(injected).length}
},null,2));
