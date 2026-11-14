"""One command for every check after a build. Usage:  .venv/bin/python qa.py [--skip-build] [--diff]

Runs, in order, and reports each validator's own outcome (a run that finishes is not a pass):
  1. build.py                      sources -> UFO, TTF, WOFF2 (previous TTF kept in build/previous/)
  2. check.py                      measured targets from the plan
  3. pathlint.py                   outline quality on the sources, winding on the built font
  3b. audit_parts.py               one value per shared part (stems, flags, feet, balls, arches, counters)
  3c. parts.py                     one construction per join and bowl: necks, pointed crotches, b d p q, u from n
  4. fontbakery check-universal    font engineering (names, tables, metrics, glyphs, features)
  5. diffenator2 diff (--diff)     before/after renders and table diffs against build/previous/
Proof sheets (proof.py, overlay.py) are separate: they are for eyes, not exit codes.
Known, expected fontbakery results while the glyph set is partial are listed in EXPECTED."""
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
PY = sys.executable
BIN = os.path.dirname(PY)
TTF = os.path.join(HERE, "build", "AreaSerif-Regular.ttf")
PREV = os.path.join(HERE, "build", "previous", "AreaSerif-Regular.ttf")

# Check id -> why it is expected now. Remove an entry the moment its reason stops being true.
EXPECTED = {
    "contour_count": "inherited from Libre Baskerville: ogonek and similar accents drawn as separate contours",
}


def run(label, cmd):
    print(f"\n== {label}: {' '.join(os.path.relpath(c, HERE) if c.startswith(HERE) else c for c in cmd)}")
    env = dict(os.environ, PATH=BIN + os.pathsep + os.environ.get("PATH", ""))   # diffenator2 calls helpers by name
    r = subprocess.run(cmd, cwd=HERE, capture_output=True, text=True, env=env)
    out = (r.stdout + r.stderr).strip()
    return r.returncode, out


def main():
    results = []
    if "--skip-build" not in sys.argv:
        code, out = run("build", [PY, "build.py"])
        print(out.splitlines()[-1] if out else "")
        if code:
            print(out)
            sys.exit("build failed")
    code, out = run("targets", [PY, "check.py"])
    print("\n".join(l for l in out.splitlines() if l.startswith("OFF")) or "", out.splitlines()[-1], sep="\n")
    results.append(("targets", code == 0))
    code, out = run("outlines", [PY, "pathlint.py"])
    lines = out.splitlines()
    print("\n".join(l for l in lines if l.startswith(("ERROR", "WARNING")))[:4000])
    print(lines[-1])
    results.append(("outlines (errors)", code == 0))
    code, out = run("parts", [PY, "audit_parts.py"])
    print("\n".join(l for l in out.splitlines() if "OUTLIERS" in l or l.startswith("parts audit")))
    results.append(("parts audit (one value per part)", code == 0))
    code, out = run("joins", [PY, "parts.py"])
    print("\n".join(l for l in out.splitlines() if l.startswith(("ERROR", "parts:"))))
    results.append(("joins and bowls (one construction per part)", code == 0))
    code, out = run("fontbakery", [os.path.join(BIN, "fontbakery"), "check-universal", TTF, "--succinct", "--loglevel", "WARN"])
    bad = []
    for line in out.splitlines():
        m = re.match(r".*?: (\w+): (FAIL|FATAL|ERROR|WARN) \[(.*)\]", line)
        if m:
            check, level, code_ = m.groups()
            note = f"  (expected: {EXPECTED[check]})" if check in EXPECTED else ""
            print(f"{level:5s} {check} [{code_}]{note}")
            if check not in EXPECTED and level in ("FAIL", "FATAL", "ERROR"):
                bad.append(check)
    print(out.splitlines()[-1] if out else "")
    results.append(("fontbakery (unexpected FAIL)", not bad))
    if "--diff" in sys.argv:
        if os.path.exists(PREV):
            out_dir = os.path.join(HERE, "build", "diff")
            code, out = run("diffenator2", [os.path.join(BIN, "diffenator2"), "diff", "-fb", PREV, "-fa", TTF, "-o", out_dir])
            print("\n".join(l for l in out.splitlines() if "it/s" not in l and "%|" not in l and "{'" not in l)[-1500:])
            print(f"report: {os.path.relpath(out_dir, HERE)}/ (open the .html files)")
            results.append(("diffenator2 ran", code == 0))
        else:
            print("\n== diffenator2: no previous build yet; it is kept from the next build on")
    print("\n== summary")
    for name, ok in results:
        print(f"{'pass' if ok else 'FAIL'}  {name}")
    sys.exit(0 if all(ok for _, ok in results) else 1)


if __name__ == "__main__":
    main()
