#!/usr/bin/env python3
"""Loopback-only fixture server; accepts aggregate benchmark data, never arbitrary paths."""
import json,re,hashlib
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
HERE=Path(__file__).resolve().parent
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(HERE),**kwargs)
 def log_message(self,*args):pass
 def do_POST(self):
  if self.path!='/save':self.send_error(404);return
  n=int(self.headers.get('Content-Length','0'))
  if not 0<n<1_000_000:self.send_error(413);return
  try:
   d=json.loads(self.rfile.read(n));label=d['label'];assert re.fullmatch('[a-z0-9-]{1,40}',label)
   assert d['schema']==1 and isinstance(d['trials'],list)
   d['fixture_sha256']={p:hashlib.sha256((HERE/p).read_bytes()).hexdigest() for p in ['index.html','bench.css','bench.js']}
   out=json.dumps(d,indent=2)+'\n';assert len(out.encode())<1_000_000
   (HERE/'results').mkdir(exist_ok=True);(HERE/'results'/f'{label}.json').write_text(out)
  except Exception as e:self.send_error(400,str(e));return
  self.send_response(200);self.end_headers();self.wfile.write(b'ok')
if __name__=='__main__':
 print('Serving http://127.0.0.1:8766/index.html',flush=True)
 ThreadingHTTPServer(('127.0.0.1',8766),Handler).serve_forever()
