# Builds the Theme controls review page (https://claude.ai/artifact/XbbMMBCfHriS8vZV9ARiaV) from the app's real controls.
# From the repo root, after `npm run build -w @area/desktop`:
#   NODE_PATH=$PWD/node_modules node_modules/.bin/esbuild docs/research/theme-review-2026-10-23/controls-page/entry.tsx \
#     --bundle --format=iife --minify --jsx=automatic --define:process.env.NODE_ENV='"production"' --outfile=<scratch>/bundle.js
#   python3 docs/research/theme-review-2026-10-23/controls-page/build.py <scratch>/bundle.js <scratch>/theme-controls-review.html
# then publish the HTML to the same artifact URL. Verdicts live in its database, collection `controls`, one doc per axis.
import sys, pathlib
here = pathlib.Path(__file__).parent
root = here.parents[3]
bundle, out = sys.argv[1], sys.argv[2]
css = (root / "apps/desktop/dist/area.css").read_text() + "\n" + (root / "apps/desktop/dist/styles/option-marks.css").read_text()
js = pathlib.Path(bundle).read_text().replace("</script", "<\\/script")
page_css = (here / "page.css").read_text()
html = ('<title>Theme Controls Review</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n'
  '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@400..600&display=swap">\n'
  '<style>\n' + css + '\n</style>\n<style>' + page_css + '</style>\n<div id="root"></div>\n'
  '<script>(function(){try{var d=document.documentElement;var t=d.dataset.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");d.setAttribute("data-area-theme",t);}catch(e){}})();</script>\n'
  '<script>' + js + '</script>\n')
pathlib.Path(out).write_text(html)
print(len(html), "bytes")
