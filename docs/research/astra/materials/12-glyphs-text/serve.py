"""Serve only this research folder; no writes or product access."""
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

if __name__ == "__main__":
    root = Path(__file__).resolve().parent
    print("Glyph/text research: http://127.0.0.1:8767", flush=True)
    ThreadingHTTPServer(("127.0.0.1", 8767), partial(SimpleHTTPRequestHandler, directory=str(root))).serve_forever()
