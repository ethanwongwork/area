"""Extract two outline renders from the pinned commit, never from the working tree."""
from pathlib import Path
import json, re, subprocess

HERE = Path(__file__).resolve().parent
ROOT = next(p for p in HERE.parents if (p / ".git").exists())
SHA = "831f819e5b55b5ca0033fd628eeb9f95ccb92df7"
FILE = "apps/docs/src/pilot-icons.tsx"
source = subprocess.check_output(["git", "show", f"{SHA}:{FILE}"], cwd=ROOT, text=True)
fixtures = {}
for name in ("Search", "Calendar"):
    start = source.index(f"export const Pilot{name}Icon =")
    end = source.index("\n);", start)
    raw = source[start:end]
    body = raw[raw.index(">\n") + 2:raw.index("</svg>")].strip()
    body = body.replace('style={{ strokeWidth: sw(weight, size) }}', 'style="stroke-width:var(--sw)"')
    body = body.replace('style={{ r: sw(weight, size, 0.6667) }}', 'style="r:calc(var(--sw) * 0.6667)"')
    for before, after in (("strokeLinecap", "stroke-linecap"), ("strokeLinejoin", "stroke-linejoin")):
        body = body.replace(before, after)
    # Research-only semantic annotations. Never use nth-child as a production API.
    body = re.sub(r'<(path|rect|circle) ', lambda m: f'<{m[1]} data-material-ink="true" data-material-part="{("detail" if m[1] == "circle" else "frame")}" ', body)
    fixtures[name.lower()] = {"source": f"{FILE}:{source[:start].count(chr(10))+1}", "svg": body}
assert "{{" not in str(fixtures)
(HERE / "fixtures.json").write_text(json.dumps({"commit": SHA, "fixtures": fixtures}, indent=2) + "\n")
print("Extracted unchanged Search/Calendar outline geometry; JSX styles translated and research part labels added.")
