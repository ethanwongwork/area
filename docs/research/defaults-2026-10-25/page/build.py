# Builds the defaults review page from the app's real components and Inspector rows.
# From the repo root, after `npm run build` and `npm run build -w @area/desktop`:
#   NODE_PATH=$PWD/node_modules node_modules/.bin/esbuild docs/research/defaults-2026-10-25/page/entry.tsx \
#     --bundle --format=iife --minify --jsx=automatic --loader:.json=json --define:process.env.NODE_ENV='"production"' --outfile=<scratch>/bundle.js
#   python3 docs/research/defaults-2026-10-25/page/build.py <scratch>/bundle.js <scratch>/area-defaults.html
# then publish the HTML to the same artifact URL. Picks live in its database: `picks` (one doc per setting), `groups`.
import sys, pathlib
here = pathlib.Path(__file__).parent
root = here.parents[3]
dist = root / "apps/desktop/dist"
bundle, out = sys.argv[1], sys.argv[2]
layered = "\n".join((dist / "styles" / name).read_text() for name in ["setup.css", "option-marks.css"])
css = (dist / "area.css").read_text() + "\n@layer studio {\n" + layered + "\n}\n" + (dist / "styles/figures.css").read_text()
js = pathlib.Path(bundle).read_text().replace("</script", "<\\/script")
page_css = (here / "page.css").read_text()
html = ('<title>Area Defaults</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n'
  '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@400..600&display=swap">\n'
  '<style>\n' + css + '\n</style>\n<style>' + page_css + '</style>\n<div id="root"></div>\n'
  '<script>(function(){try{var d=document.documentElement;var t=d.dataset.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");d.setAttribute("data-area-theme",t);}catch(e){}})();</script>\n'
  '<script>' + js + '</script>\n')
pathlib.Path(out).write_text(html)
print(len(html), "bytes")
