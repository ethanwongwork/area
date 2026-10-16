"""Loopback-only static specimen server. No writes, dependencies or external requests."""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import unquote, urlsplit
import argparse
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[4]
p=argparse.ArgumentParser();p.add_argument('--area-root',type=Path,default=ROOT);p.add_argument('--port',type=int,default=8767);args=p.parse_args()
css=(args.area_root/'packages/styles/dist/area.css').resolve()
if not css.is_file():raise SystemExit('Build first: npm run build in --area-root')
class Handler(SimpleHTTPRequestHandler):
 def do_GET(self):
  if self.path=='/':
   self.send_response(302);self.send_header('Location','/16-specimen/');self.end_headers();return
  super().do_GET()
 def translate_path(self,path):
  route=unquote(urlsplit(path).path)
  if route=='/packages/styles/dist/area.css':return str(css)
  if route=='/area-capture.js':return str(args.area_root/'apps/docs/public/area-capture.js')
  # Only the research materials tree and one built CSS asset are exposed.
  target=(HERE.parent/(route.lstrip('/') or '16-specimen/index.html')).resolve()
  if target.is_relative_to(HERE.parent):return str(target)
  return str(HERE/'__not_found__')
 def end_headers(self):
  self.send_header('Cache-Control','no-store');super().end_headers()
print(f'Specimen http://127.0.0.1:{args.port}/ (Area CSS: {css})',flush=True)
ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
