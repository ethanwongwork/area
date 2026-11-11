// The typefaces 2 Grid Glyphs can set on the grid. Trial fonts come from fonts/trial (dev
// only); each has an open-source stand-in so a build still draws every view.
import '@fontsource-variable/bricolage-grotesque/standard.css';
import '@fontsource-variable/roboto-flex/full.css';
import '@fontsource-variable/fraunces/full.css';
import { loadGlyphFont, trialFiles } from '../../src/glyphs.js';

export const TYPEFACES = {
  kyoto: { label: 'PP Kyoto Extrabold', file: /^PPKyoto-Extrabold\./i, fallback: 'fraunces', credit: 'PP Kyoto by Pangram Pangram', kana: true },
  'kyoto-light': { label: 'PP Kyoto Light', file: /^PPKyoto-Light\./i, fallback: 'fraunces', credit: 'PP Kyoto by Pangram Pangram', kana: true },
  haffer: { label: 'Haffer', file: /^HafferCollection/i, fallback: 'flex', credit: 'Haffer by Displaay' },
  reckless: { label: 'Reckless', file: /^RecklessCollection/i, fallback: 'fraunces', credit: 'Reckless by Displaay' },
  post: { label: 'Post', file: /^PostCollection/i, fallback: 'flex', credit: 'Post by Displaay' },
  coxx: { label: 'Coxx', file: /^CoxxCollection/i, fallback: 'bricolage', credit: 'Coxx by Displaay' },
  areal: { label: 'ABC Areal', file: /^ABCAreal/i, fallback: 'flex', credit: 'ABC Areal by Dinamo' },
  // WOFF2 files: fontkit can't apply their axes, so these are drawn as browser text.
  bricolage: { label: 'Bricolage Grotesque', css: 'Bricolage Grotesque Variable', credit: 'Bricolage Grotesque (open source)' },
  flex: { label: 'Roboto Flex', css: 'Roboto Flex Variable', credit: 'Roboto Flex (open source)' },
  fraunces: { label: 'Fraunces', css: 'Fraunces Variable', credit: 'Fraunces (open source)' },
};

const cache = new Map();

/** Resolves to { gf, key, face }: the font itself, or its stand-in when the trial isn't there. */
export function typeface(key) {
  if (!cache.has(key)) {
    cache.set(
      key,
      (async () => {
        const face = TYPEFACES[key] ?? TYPEFACES.fraunces;
        if (face.css) return { gf: await cssFont(face.css), key, face };
        const url = trialFiles().find((f) => face.file.test(f.name))?.url;
        if (!url) return typeface(face.fallback);
        return { gf: await loadGlyphFont(url), key, face };
      })(),
    );
  }
  return cache.get(key);
}

/** A font the browser draws: glyphMask sets it with fillText at the view's weight and width. */
async function cssFont(family) {
  await Promise.all([300, 800].map((w) => document.fonts.load(`${w} 100px "${family}"`)));
  return { css: family };
}
