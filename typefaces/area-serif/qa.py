"""One command for every check after a build. Usage:  .venv/bin/python qa.py [--skip-build] [--diff]

Runs, in order, and reports each validator's own outcome (a run that finishes is not a pass):
  1. build.py                      sources -> UFO, TTF, WOFF2 (previous TTF kept in build/previous/)
  2. check.py                      measured targets from the plan
  3. pathlint.py                   outline quality on the sources, winding on the built font
  3b. audit_parts.py               one value per shared part (stems, flags, feet, balls, arches, counters)
  3c. parts.py                     one construction per join and bowl: necks, pointed crotches, b d p q, u from n
  3c2. curvecheck.py               curvature continuity along g's loop, the tails of g.ss02 j y, a.ss03 and l.ss04
  3d. audit_charset.py             beyond a-z A-Z 0-9: mark placement, plain strokes, signs from letters, mirrors
  3e. audit_kern.py                (0.81) every pair's least white at 300 350 400 600 800, against the weight's floor
Weights are on the 0.82 axis (300 to 800, or 200 to 800 with the ExtraLight; weightaxis.py): the Bold master is 800, the
mid master 600; the audits' default stops are 0.81's at the same stems.
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
    awaiting = []
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
    code, out = run("curves", [PY, "curvecheck.py"])           # 0.81: descender loops and tails, the new a and l
    print("\n".join(l for l in out.splitlines() if not l.startswith("    ") or "known" not in l))
    results.append(("curve continuity (descender loops and tails, a.ss03, l.ss04)", code == 0))
    code, out = run("evenness", [PY, "even.py"])
    print("\n".join(out.splitlines()[-4:]))
    results.append(("evenness (a stroke's thickness round each counter)", code == 0))
    vf = os.path.join(HERE, "build", "AreaSerif[wght].ttf")
    if os.path.exists(vf):                                     # 0.76: the Bold master and the weight axis
        code, out = run("bold", [PY, "audit_bold.py"])
        print("\n".join(out.splitlines()[:2] + [l for l in out.splitlines() if l.startswith("  ")][:20]))
        results.append(("bold audit (each part on its target, letters and figures)", code == 0))
        if os.path.exists(os.path.join(HERE, "build", "AreaSerif-Light.ufo")):     # 0.80: the Light master, the same audit
            import bold as _B
            code, out = run("light", [PY, "audit_bold.py", str(_B.LIGHT_STEM)])
            print("\n".join(out.splitlines()[:2] + [l for l in out.splitlines() if l.startswith("  ")][:20]))
            results.append(("light audit (each part on its target, letters and figures)", code == 0))
            code, out = run("bold again (leaves build/weight/audit-bold.txt as the Bold's)", [PY, "audit_bold.py"])
            import ufoLib2                                     # 0.81: the Light's sides are light_bearings.json's
            miss = _B.check_light_bearings(ufoLib2.Font.open(os.path.join(HERE, "build", "AreaSerif-Regular.ufo")),
                                           ufoLib2.Font.open(os.path.join(HERE, "build", "AreaSerif-Light.ufo")))
            print("\n== light side bearings (bold.check_light_bearings)\n" + (f"{len(miss)} sides off: {miss[:12]}" if miss else "every named side as light_bearings.json sets it"))
            results.append(("light side bearings (light_bearings.json, one path)", not miss))
            import weightaxis as _W0
            tp = os.path.join(HERE, "build", f"AreaSerif-{_W0.LOW_NAME}.ufo")
            if os.path.exists(tp):                             # 0.82 (axis B): the Thin's, light + thin_bearings.json
                import weightaxis as _W
                tmiss = _B.check_light_bearings(ufoLib2.Font.open(os.path.join(HERE, "build", "AreaSerif-Regular.ufo")),
                                                ufoLib2.Font.open(tp), _W.THIN_STEM)
                print("\n== thin side bearings\n" + (f"{len(tmiss)} sides off: {tmiss[:12]}" if tmiss else "every named side as light_bearings.json and thin_bearings.json set it"))
                results.append(("thin side bearings (light_bearings.json + thin_bearings.json)", not tmiss))
        import weightaxis as _W1
        if os.path.exists(os.path.join(HERE, "build", f"AreaSerif-{_W1.LOW_NAME}.ufo")):   # 0.82 (axis B): the lightest master
            code, out = run(_W1.LOW_NAME.lower(), [PY, "audit_bold.py", str(_W1.THIN_STEM)])
            print("\n".join(out.splitlines()[:2] + [l for l in out.splitlines() if l.startswith("  ")][:20]))
            results.append(("thin audit (each part on its target, letters and figures)", code == 0))
            code, out = run("bold again (leaves build/weight/audit-bold.txt as the Bold's)", [PY, "audit_bold.py"])
        for style in (_W1.LOW_NAME, "Light", "Bold"):                # 0.81 (owner): the tails and loops in every master
            mp = os.path.join(HERE, "build", f"AreaSerif-{style}.ufo")
            if os.path.exists(mp):
                code, out = run(f"curves, {style}", [PY, "curvecheck.py", mp])
                print("\n".join(l for l in out.splitlines() if not l.startswith("    ") or "known" not in l))
                results.append((f"curve continuity in the {style} master", code == 0))
                # axis round 2: the hooks and tails ending in a tilted ball, their ball and neck
                code, out = run(f"curves of the hooks with a ball, {style}", [PY, "curvecheck.py", mp, "--hooks"])
                print("\n".join(l for l in out.splitlines() if "(drawn)" not in l))
                results.append((f"curve continuity of the hooks with a ball in the {style} master", code == 0))
        code, out = run("axis", [PY, "audit_bold.py", "--sweep"])
        print(out)
        results.append(("weight axis (the same audit at 0.81's every 25 units: 400 to 800 every 33.3)", code == 0))
        code, out = run("axis, every glyph", [PY, "audit_axis.py"])
        print(out)
        results.append(("weight axis, all glyphs (moved, turns, crossings, thin, monotone, composites)", code == 0))
        held = [l.strip() for l in out.splitlines() if l.strip().startswith("AWAITING")]
        if held:                                               # 0.81: the one expected failure, said every run
            awaiting.extend(held)
        code, out = run("axis, second method (rays across the stroke on the variable font's instances)", [PY, "audit_rays.py"])
        print(out[-3000:])
        results.append(("weight axis, second method (audit_rays: stroke across itself at 300 to 800)", code == 0))
        code, out = run("interpolation", [os.path.join(BIN, "fonttools"), "varLib.interpolatable", "--kinkiness", "1.0", vf])
        print(out[:2000] or "nothing reported")
        results.append(("variable font (fontTools interpolatable, kinkiness 1.0)", code == 0 and not out.strip()))
        code, out = run("kerning along the axis (audit_kern: least white of every pair at 300 350 400 600 800)", [PY, "audit_kern.py", vf])
        print(out)
        results.append(("kerning along the axis (no pair under the weight's floor)", code == 0))
    code, out = run("charset", [PY, "audit_charset.py"])
    print("\n".join(l for l in out.splitlines() if l.startswith(("ERROR", "charset audit"))))
    results.append(("character set (marks, signs, mirrors)", code == 0))
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
    vf = os.path.join(HERE, "build", "AreaSerif[wght].ttf")
    if os.path.exists(vf):
        code, out = run("fontbakery, variable font", [os.path.join(BIN, "fontbakery"), "check-universal", vf, "--succinct", "--loglevel", "WARN"])
        lines_ = [l for l in out.splitlines() if re.search(r"(FAIL|ERROR|FATAL|WARN) \[", l) or "ERROR:" in l]
        print("\n".join(lines_))
        results.append(("fontbakery on the variable font (no FAIL, ERROR or FATAL)", not any(re.search(r"(FAIL|ERROR|FATAL) \[", l) for l in lines_)))
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
    for line in awaiting:                                      # failing, held apart by name: not a pass
        print(f"HELD  {line[len('AWAITING'):].strip()}")
    sys.exit(0 if all(ok for _, ok in results) else 1)


if __name__ == "__main__":
    main()
