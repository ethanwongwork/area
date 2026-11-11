import { defineConfig } from 'vite';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, extname, resolve } from 'node:path';

const root = import.meta.dirname;

// Every e/<slug>/index.html is its own page.
const pages = Object.fromEntries(
  readdirSync(resolve(root, 'e'))
    .filter((slug) => existsSync(resolve(root, 'e', slug, 'index.html')))
    .map((slug) => [slug, resolve(root, 'e', slug, 'index.html')]),
);

export default defineConfig({
  base: './',
  server: { port: 5190 },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 800, // three.js is ~540 kB on its own
    rollupOptions: { input: { index: resolve(root, 'index.html'), ...pages } },
  },
  plugins: [trialFonts()],
});

/**
 * Registers every file in fonts/trial as an @font-face on every page.
 * Dev serves them from /@fonts/. A build leaves them out unless FONTS_LICENSED=1,
 * because trial licences don't allow publishing.
 */
function trialFonts() {
  const dir = resolve(root, 'fonts/trial');
  const licensed = process.env.FONTS_LICENSED === '1';
  const types = { '.woff2': 'font/woff2', '.woff': 'font/woff', '.otf': 'font/otf', '.ttf': 'font/ttf' };
  const files = () => (existsSync(dir) ? readdirSync(dir).filter((f) => types[extname(f).toLowerCase()]) : []);
  let build = false;

  return {
    name: 'trial-fonts',
    configResolved(config) {
      build = config.command === 'build';
    },
    configureServer(server) {
      server.middlewares.use('/@fonts/', (req, res, next) => {
        const file = decodeURIComponent(req.url.slice(1).split('?')[0]);
        const path = resolve(dir, file);
        if (!path.startsWith(dir) || !existsSync(path)) return next();
        res.setHeader('Content-Type', types[extname(path).toLowerCase()]);
        res.end(readFileSync(path));
      });
      const families = [...new Set(files().map((f) => face(f).family))];
      server.httpServer?.once('listening', () =>
        server.config.logger.info(
          families.length ? `  trial fonts: ${families.join(', ')}` : '  trial fonts: none (fonts/trial is empty)',
        ),
      );
    },
    generateBundle() {
      if (!licensed) return;
      for (const f of files()) this.emitFile({ type: 'asset', fileName: `fonts/${f}`, source: readFileSync(resolve(dir, f)) });
    },
    transformIndexHtml(html, ctx) {
      if (build && !licensed) return html;
      const list = files();
      if (!list.length) return html;
      const depth = ctx.path.split('/').length - 2; // "/e/001/index.html" → 2
      const prefix = build ? `${'../'.repeat(depth)}fonts/` : '/@fonts/';
      const css = list
        .map((f) => {
          const { family, weight, style, variable } = face(f);
          return `@font-face{font-family:"${family}";src:url("${prefix}${encodeURIComponent(f)}");font-weight:${weight};font-style:${style};${variable ? 'font-stretch:25% 200%;' : ''}font-display:swap}`;
        })
        .join('\n');
      const families = [...new Set(list.map((f) => face(f).family))].join(',');
      const urls = list.map((f) => prefix + encodeURIComponent(f)).join(',');
      return html.replace(
        '</head>',
        `<meta name="trial-fonts" content="${families}"><meta name="trial-font-files" content="${urls}"><style>${css}</style></head>`,
      );
    },
  };
}

function face(file) {
  const stem = basename(file, extname(file));
  const family = stem.split(/[-_]/)[0];
  const words = stem.toLowerCase();
  const variable = /variable|\bvar\b|vf\b/.test(words);
  const weights = [
    [/hairline|thin/, 100],
    [/extralight|ultralight/, 200],
    [/light/, 300],
    [/semibold|demibold|semi-bold/, 600],
    [/extrabold|ultrabold|heavy/, 800],
    [/black|ultra/, 900],
    [/bold/, 700],
    [/medium/, 500],
  ];
  const weight = variable ? '1 1000' : (weights.find(([re]) => re.test(words))?.[1] ?? 400);
  const style = /italic|oblique/.test(words) ? 'italic' : 'normal';
  return { family, weight, style, variable };
}
