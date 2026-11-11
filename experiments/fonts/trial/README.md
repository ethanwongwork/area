# Trial fonts

Drop trial font files here (`.woff2`, `.woff`, `.otf`, `.ttf`). They are git-ignored:
trial licences allow testing and pitching, not redistribution or published work.

Every file is registered as an `@font-face` on every page in dev. The family is the
file name up to its first `-` or `_`:

| File | Family | Weight |
|---|---|---|
| `ABCDiatype-Medium-Trial.woff2` | `ABCDiatype` | 500 |
| `PPNeueMontreal-Book.otf` | `PPNeueMontreal` | 400 |
| `ABCDiatypeVariable-Trial.woff2` | `ABCDiatypeVariable` | 1–1000 (variable) |

The dev server prints the families it found. In an experiment, ask for a trial face
with a fallback, so the piece still works on a machine without it:

```js
const { font } = shell('001-stretch');
const grotesk = font(['ABCDiatype', 'PPNeueMontreal'], 'Inter Tight Variable');
```

`npm run build` leaves trial fonts out (the fallback is used). Once you hold a web
licence, `FONTS_LICENSED=1 npm run build` bundles them.

Where to get trials: ABC Dinamo (abcdinamo.com, trial fonts on each family page),
Pangram Pangram (pangrampangram.com, free for personal use), Displaay
(displaay.net, free full trials), Frostype (frostype.xyz).
