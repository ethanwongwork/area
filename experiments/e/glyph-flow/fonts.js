// The fonts this experiment can use, shared by the poster page and the variations page.
import fallbackUrl from '@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2?url';
import { loadGlyphFont, trialFiles } from '../../src/glyphs.js';

// Fonts: every variable trial font in fonts/trial, then an open-source fallback for builds.
const label = (file) =>
  file
    .replace(/\.(ttf|otf|woff2?)$/i, '')
    .replace(/[-_]?(TRIAL|VF|Variable|VariableFont.*)$/gi, '')
    .replace(/(VF|Variable)$/i, '')
    .replace(/^ABC/, 'ABC ')
    .replace(/([a-z])([A-Z])/g, '$1 $2');
// Variable files are one font each; static files that share a family name (PPKyoto-Medium,
// PPKyoto-LightItalic…) load together as one font with several styles.
export const fonts = {};
for (const f of trialFiles()) {
  const stem = f.name.replace(/\.(ttf|otf|woff2?)$/i, '');
  if (/VF|Variable/i.test(stem)) fonts[label(f.name)] = [f.url];
  else (fonts[label(stem.split('-')[0]).replace(/^PP(?=[A-Z])/, 'PP ')] ??= []).push(f.url);
}
fonts['Fraunces (open source)'] = [fallbackUrl];
export const names = Object.keys(fonts);

const cache = new Map();
export const getFont = (name) => {
  if (!cache.has(name)) {
    const urls = fonts[name];
    cache.set(
      name,
      Promise.all(urls.map(loadGlyphFont)).then((styles) => {
        styles.forEach((st, i) => (st.style = decodeURIComponent(urls[i].split('/').pop()).replace(/\.\w+$/, '').split('-').slice(1).join(' ') || 'Regular'));
        const primary = styles.find((st) => st.style === 'Medium') ?? styles.find((st) => !/italic/i.test(st.style)) ?? styles[0];
        primary.styles = styles;
        return primary;
      }),
    );
  }
  return cache.get(name);
};

