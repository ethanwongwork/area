import json, statistics as st, sys
d = json.load(open(sys.argv[1]))
by = {}
for r in d: by.setdefault(r["name"], {})[r["lib"]] = r
shared = [n for n, v in by.items() if len(v) == 3]
print("concepts in all three:", len(shared))
med = {lib: st.median(by[n][lib]["size"] for n in shared) for lib in ("area", "lucide", "phosphor")}
def spread(lib):
    rel = [by[n][lib]["size"] / med[lib] for n in shared]
    q = st.quantiles(rel, n=20)
    return f"{lib:9} median {med[lib]*24:5.2f}px@24  within ±8%: {sum(abs(x-1)<=.08 for x in rel)/len(rel):4.0%}  ±15%: {sum(abs(x-1)<=.15 for x in rel)/len(rel):4.0%}  5–95%: {q[0]:.2f}–{q[-1]:.2f}  sd {st.pstdev(rel):.3f}"
for lib in ("area", "lucide", "phosphor"): print(spread(lib))
# per-icon residual: Area's relative size against the references' mean relative size
rows = []
for n in shared:
    a = by[n]["area"]["size"] / med["area"]; ref = (by[n]["lucide"]["size"] / med["lucide"] + by[n]["phosphor"]["size"] / med["phosphor"]) / 2
    agree = abs(by[n]["lucide"]["size"] / med["lucide"] - by[n]["phosphor"]["size"] / med["phosphor"])
    rows.append((a / ref - 1, n, a, ref, agree, by[n]["area"]["key"]))
rows.sort()
res = [r[0] for r in rows]
print(f"Area vs references (same concept): within ±8%: {sum(abs(x)<=.08 for x in res)/len(res):.0%}, ±12%: {sum(abs(x)<=.12 for x in res)/len(res):.0%}")
print("\nArea smaller than the references draw the same concept (refs agree within 10%):")
for r in rows:
    if r[0] < -.10 and r[4] < .10: print(f"  {r[1]:22} {r[5]:10} area {r[2]:.2f} refs {r[3]:.2f}  {r[0]:+.0%}")
print("\nArea larger:")
for r in reversed(rows):
    if r[0] > .10 and r[4] < .10: print(f"  {r[1]:22} {r[5]:10} area {r[2]:.2f} refs {r[3]:.2f}  {r[0]:+.0%}")
# centring: ink centre offset (px at 24)
print("\nink-centre offset from the middle, px at 24 (mean abs):", {lib: round(st.mean(abs(by[n][lib]["cx"]-.5)+abs(by[n][lib]["cy"]-.5) for n in shared)*24, 2) for lib in ("area","lucide","phosphor")})
off = []
for n in shared:
    a = by[n]["area"]; dx = (a["cx"]-.5)*24; dy = (a["cy"]-.5)*24
    rdx = st.mean((by[n][l]["cx"]-.5)*24 for l in ("lucide","phosphor")); rdy = st.mean((by[n][l]["cy"]-.5)*24 for l in ("lucide","phosphor"))
    e = ((dx-rdx)**2+(dy-rdy)**2)**.5
    if (dx*dx+dy*dy)**.5 > .6 and e > .6: off.append((e, n, round(dx,2), round(dy,2), round(rdx,2), round(rdy,2)))
print("Area off-centre where the references are not (>0.6px at 24):", len(off))
for o in sorted(off, reverse=True)[:25]: print("  ", o[1], "area", o[2:4], "refs", o[4:6])
