#!/usr/bin/env python3
"""Extract resolved geometry from the pinned design-system sources into evidence files.

Every evidence file is a filtered copy of real source with tokens resolved to px, so a
number in an audit can be traced to a file and line. Nothing here is hand-written.
Usage: python3 extract.py [--out DIR]   (default: ../../evidence next to the pack docs)
"""
import re, sys, os, glob, json, shutil, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, ".cache", "src")
NPM = os.path.join(HERE, ".cache", "npm", "node_modules")
OUT = os.path.abspath(sys.argv[sys.argv.index("--out") + 1]) if "--out" in sys.argv else os.path.abspath(os.path.join(HERE, "..", "..", "evidence"))
PINS = json.load(open(os.path.join(HERE, "sources.json")))

def rel(path, key):
    return path.replace(os.path.join(SRC, key) + os.sep, "")

def header(key, path):
    g = PINS["git"][key]
    return f"### {g['name']} @ {g['commit'][:7]}  {rel(path, key)}"

def write(sysk, name, lines, mode="a"):
    d = os.path.join(OUT, sysk); os.makedirs(d, exist_ok=True)
    open(os.path.join(d, name + ".txt"), mode).write("\n".join(lines) + "\n")

# ---------- CSS custom property resolver ----------
def load_vars(patterns):
    d = {}
    for p in patterns:
        for f in glob.glob(p, recursive=True):
            try: s = open(f, errors="ignore").read()
            except OSError: continue
            s = re.sub(r"/\*.*?\*/", "", s, flags=re.S)
            for m in re.finditer(r"(--[\w-]+)\s*:\s*([^;{}]+);", s):
                d.setdefault(m.group(1), m.group(2).strip())
    return d

def evaluate(expr):
    e = re.sub(r"(-?[\d.]+)rem", lambda m: format(float(m.group(1)) * 16, "g") + "px", expr)
    def one(m):
        inner = m.group(1)
        if re.fullmatch(r"[\d.\s+\-*/()px]+", inner) and "px" in inner:
            try: return format(round(eval(inner.replace("px", "")), 2), "g") + "px"
            except Exception: return m.group(0)
        return m.group(0)
    prev = None
    while prev != e:
        prev = e
        e = re.sub(r"(?:calc)?\(((?:[^()])*)\)", lambda m: one(m) if ("calc" in m.group(0) or re.fullmatch(r"[\d.\s+\-*/px]+", m.group(1))) else m.group(0), e)
    e = re.sub(r"max\((-?[\d.]+)px,\s*(-?[\d.]+)px\)", lambda m: format(max(float(m.group(1)), float(m.group(2))), "g") + "px", e)
    e = re.sub(r"min\((-?[\d.]+)px,\s*(-?[\d.]+)px\)", lambda m: format(min(float(m.group(1)), float(m.group(2))), "g") + "px", e)
    return e

def resolve(v, d, depth=0):
    if depth > 12: return v
    def r(m):
        name, fb = m.group(1), m.group(2)
        if name in d: return resolve(d[name], d, depth + 1)
        if fb is not None: return resolve(fb.strip(), d, depth + 1)
        return m.group(0)
    prev = None
    while prev != v and "var(" in v:
        prev = v
        v = re.sub(r"var\(\s*(--[\w-]+)\s*(?:,\s*((?:[^()]|\([^()]*\))*))?\)", r, v)
    v = re.sub(r"spacing\(([\d.]+)\)", lambda m: f"{float(m.group(1)) * 4:g}px", v)
    return evaluate(v)

def dump_css(key, token_globs, src_glob, overrides=None):
    d = load_vars(token_globs)
    if overrides: d.update(overrides)
    for f in sorted(glob.glob(src_glob, recursive=True)):
        if "__" in f or "stories" in f: continue
        name = os.path.basename(f).replace(".module.css", "").replace(".css", "")
        dd = dict(d)
        for k, v in load_vars([f]).items(): dd.setdefault(k, v)
        lines = [header(key, f)]
        for line in open(f, errors="ignore"):
            line = line.rstrip("\n")
            m = re.match(r"(\s*)([\w-]+)\s*:\s*([^;]+);?\s*$", line)
            if m and re.search(r"var\(|rem|spacing\(", line):
                r_ = resolve(m.group(3), dd)
                lines.append(f"{line.rstrip()}   /* = {r_} */" if r_ != m.group(3).strip() else line.rstrip())
            else: lines.append(line)
        write(key, name, lines)

# ---------- OpenAI component variables, resolved ----------
def dump_oai_vars():
    base = os.path.join(SRC, "oai", "src", "styles")
    d = load_vars([os.path.join(base, "variables-*.css"), os.path.join(base, "tailwind-utilities.css")])
    lines = [header("oai", os.path.join(base, "variables-components.css")) + "  (every component variable, resolved)"]
    for k, v in d.items():
        if not re.search(r"color|bg|shadow|transition|opacity|ease|background", k):
            lines.append(f"{k}: {resolve(v, d)}")
    write("oai", "_variables", lines, "w")

# ---------- shadcn: Tailwind classes to px ----------
TW_TEXT = {"xs": "12/16", "sm": "14/20", "base": "16/24", "lg": "18/28", "xl": "20/28", "2xl": "24/32"}
TW_RAD = {"xs": "2", "sm": "6", "md": "8", "lg": "10", "xl": "14", "2xl": "18", "3xl": "22", "4xl": "26", "full": "9999", "none": "0", "": "4"}
TW_MAXW = {"xs": 320, "sm": 384, "md": 448, "lg": 512, "xl": 576, "2xl": 672, "3xl": 768, "4xl": 896}
def tw(c):
    base = c.split(":")[-1].lstrip("-!")
    m = re.fullmatch(r"(h|w|size|min-h|min-w|max-h|max-w|p|px|py|pt|pb|pl|pr|ps|pe|m|mx|my|mt|mb|ml|mr|ms|me|gap|gap-x|gap-y|space-x|space-y|top|right|bottom|left|inset|inset-x|inset-y|start|end|translate-x|translate-y|basis|indent|outline-offset|ring-offset)-(\d+(?:\.\d+)?|px)", base)
    if m:
        v = m.group(2); return f"{c}={'1' if v == 'px' else format(float(v) * 4, 'g')}px"
    m = re.fullmatch(r"(max-w|min-w|w)-(xs|sm|md|lg|xl|2xl|3xl|4xl)", base)
    if m: return f"{c}={TW_MAXW[m.group(2)]}px"
    m = re.fullmatch(r"text-(xs|sm|base|lg|xl|2xl)", base)
    if m: return f"{c}={TW_TEXT[m.group(1)]}px"
    m = re.fullmatch(r"rounded(?:-(?:[trbl]|tl|tr|bl|br|s|e|ss|se|es|ee))?(?:-(xs|sm|md|lg|xl|2xl|3xl|4xl|full|none))?", base)
    if m: return f"{c}={TW_RAD[m.group(1) or '']}px"
    m = re.fullmatch(r"(border|ring|outline|border-[trblxy])(?:-(\d))?", base)
    if m: return f"{c}={(m.group(2) or ('3' if m.group(1) == 'ring' else '1'))}px"
    if re.search(r"\[[^\]]*(px|rem|%|calc|ch)[^\]]*\]", base) or re.fullmatch(r"(leading|tracking|font|shrink|grow|aspect|line-clamp)-.+", base): return c
    return None

def dump_sha():
    for f in sorted(glob.glob(os.path.join(SRC, "sha", "apps/v4/registry/new-york-v4/ui/*.tsx"))):
        name = os.path.basename(f)[:-4]
        out = [header("sha", f) + "  (Tailwind to px: spacing unit 4; --radius 0.625rem so sm 6, md 8, lg 10, xl 14)"]
        for i, line in enumerate(open(f).read().split("\n"), 1):
            m = re.search(r'data-slot="([\w-]+)"', line)
            if m: out.append(f"  [slot {m.group(1)}]")
            for q in re.findall(r'"([^"]{6,})"|\'([^\']{6,})\'', line):
                q = q[0] or q[1]
                if not re.search(r"\b(h|w|p|px|py|gap|text|rounded|size|min-h|min-w|max-w)-", q): continue
                geo = [x for x in (tw(c) for c in q.split()) if x]
                if geo:
                    key = re.match(r"\s*([\w\"-]+)\s*:", line)
                    out.append(f"  L{i} {(key.group(1) + ': ') if key else ''}{' '.join(geo)}")
        write("sha", name, out, "w")

# ---------- Fluent v9 ----------
def fluent_tokens():
    js = ("const t=require('@fluentui/tokens');const th=t.webLightTheme;const o={};"
          "for(const k in th){if(/^(spacing|borderRadius|fontSize|lineHeight|strokeWidth|fontWeight)/.test(k))o[k]=th[k];}"
          "for(const k in t.typographyStyles){const s=t.typographyStyles[k];const r=x=>String(x).replace(/var\\(--(\\w+)\\)/,(m,n)=>th[n]);"
          "o['typographyStyles.'+k]=r(s.fontSize)+'/'+r(s.lineHeight)+' w'+r(s.fontWeight)}console.log(JSON.stringify(o))")
    return json.loads(subprocess.check_output(["node", "-e", js], cwd=os.path.dirname(NPM), text=True))

def dump_flu():
    T = fluent_tokens()
    geo = re.compile(r"[hH]eight|[wW]idth|[pP]adding|[gG]ap|Radius|fontSize|lineHeight|fontWeight|[mM]argin|inset|[sS]ize\b|typographyStyles|top:|left:|right:|bottom:|shorthands\.(border|padding|margin|gap)|: `?'?\d|const \w+ = '?\d")
    for f in sorted(glob.glob(os.path.join(SRC, "flu", "packages/react-components/*/library/src/components/*/use*Styles.styles.ts"))):
        comp = f.split("/components/")[-1].split("/")[0]
        out = [header("flu", f)]
        for i, line in enumerate(open(f, errors="ignore"), 1):
            l = line.rstrip()
            if geo.search(l):
                ann = [f"{m}={T[m]}" for m in re.findall(r"tokens\.(\w+)", l) if m in T] + [f"{m}={T[m]}" for m in re.findall(r"(typographyStyles\.\w+)", l) if m in T]
                out.append(f"L{i} {l.strip()[:170]}" + (f"   // {' '.join(ann)}" if ann else ""))
            elif re.search(r"^\s{2,4}[\w']+: \{|const \w+ ?= ?make", l):
                out.append(f"L{i} {l.strip()[:120]}")
        write("flu", comp, out)

# ---------- Material 3 tokens ----------
def dump_m3():
    D = os.path.join(SRC, "m3", "tokens/versions/latest/sass")
    def vars_(f): return {m.group(1): m.group(2).strip() for m in re.finditer(r"^\$([\w-]+):\s*([^;]+);", open(f).read(), re.M)}
    SH = vars_(os.path.join(D, "_md-sys-shape.scss")); TY = vars_(os.path.join(D, "_md-sys-typescale.scss"))
    def r(v):
        m = re.fullmatch(r"md-sys-shape\.\$([\w-]+)", v)
        if m: return f"{m.group(1)} = {SH.get(m.group(1), '?')}"
        m = re.fullmatch(r"md-sys-typescale\.\$([\w-]+)", v)
        if m: return f"{m.group(1)} = {evaluate(TY.get(m.group(1), '?'))}"
        return v
    for f in sorted(glob.glob(os.path.join(D, "_md-comp-*.scss"))):
        name = os.path.basename(f)[9:-5]; out = [header("m3", f)]
        for k, v in vars_(f).items():
            if re.search(r"color|opacity|font$|tracking|weight|elevation", k): continue
            out.append(f"{k}: {r(v)}")
        write("m3", name, out, "w")

# ---------- Carbon ----------
CAR_SP = {"01": 2, "02": 4, "03": 8, "04": 12, "05": 16, "06": 24, "07": 32, "08": 40, "09": 48, "10": 64, "11": 80, "12": 96, "13": 160}
CAR_TYPE = {"label-01": "12/16", "label-02": "14/18", "helper-text-01": "12/16", "body-short-01": "14/18", "body-compact-01": "14/18", "body-01": "14/20", "body-compact-02": "16/22", "body-02": "16/24", "heading-compact-01": "14/18 w600", "heading-01": "14/20 w600", "heading-02": "16/24 w600", "heading-compact-02": "16/22 w600", "heading-03": "20/28", "code-01": "12/16", "code-02": "14/20", "legal-01": "12/16"}
def dump_car():
    geo = re.compile(r"height|width|size|padding|margin|gap|radius|inset|type-style|font-size|line-height|border(-\w+)?:|top:|left:|right:|bottom:|flex-basis|spacing|to-rem")
    note = "  (layout.size('height') control scale: xs 24, sm 32, md 40, lg 48, xl 64, 2xl 80 unless the component redefines it)"
    for f in sorted(glob.glob(os.path.join(SRC, "car", "packages/styles/scss/components/*/_*.scss"))):
        comp = f.split("/components/")[1].split("/")[0]
        if os.path.basename(f) in ("_index.scss", "_tokens.scss"): continue
        out = [header("car", f) + note]
        for i, l in enumerate(open(f, errors="ignore"), 1):
            s = l.rstrip()
            if re.match(r"\s*(\.|&|@include breakpoint|@mixin|\#\{)", s) and s.strip().endswith("{"):
                out.append(f"L{i} {s.strip()[:110]}"); continue
            if geo.search(s) and not re.search(r"color|@use|@forward|transition|^\s*//", s):
                a = [f"spacing-{m}={CAR_SP[m]}px" for m in re.findall(r"spacing-(\d\d)", s)] + [f"{m}={CAR_TYPE[m]}" for m in re.findall(r"type-style\('([\w-]+)'\)", s) if m in CAR_TYPE]
                out.append(f"L{i}   {s.strip()[:130]}" + (f"   // {' '.join(a)}" if a else ""))
        write("car", comp, out)

# ---------- MUI ----------
def dump_mui():
    G = re.compile(r"(^|[\s{,'\"])(height|minHeight|maxHeight|width|minWidth|maxWidth|padding\w*|margin\w*|gap|columnGap|rowGap|borderRadius|fontSize|lineHeight|fontWeight|borderWidth|border|top|left|right|bottom|inset\w*|size|flexBasis|typography\.\w+)\b\s*[:(]", re.I)
    for f in sorted(glob.glob(os.path.join(SRC, "mui", "packages/mui-material/src/*/[A-Z]*.js"))):
        if re.search(r"\.(test|spec|d)\.", f): continue
        comp = os.path.basename(os.path.dirname(f)); o = [header("mui", f)]
        for i, l in enumerate(open(f, errors="ignore"), 1):
            s = l.rstrip()[:400]
            if re.search(r"^\s*(const \w+ = (styled|css|\{)|variants:|props: \{|style: \{|'?&?[ .:\[\w-]+'?: \{$|name: '|slot: ')", s): o.append(f"L{i} {s.strip()[:120]}"); continue
            if G.search(s) and not re.search(r"color|Color|transition|import |propTypes|PropTypes|^\s*(\*|//)", s): o.append(f"L{i}   {s.strip()[:170]}")
        if len(o) > 1: write("mui", comp, o)

# ---------- Atlassian (compiled atomic CSS mapped back to named style blocks) ----------
def dump_atl():
    root = os.path.join(NPM, "@atlaskit")
    GEO = re.compile(r"^(height|min-height|max-height|width|min-width|max-width|padding|margin|gap|column-gap|row-gap|border-radius|border|font|font-size|line-height|font-weight|inset|top|left|right|bottom|block-size|inline-size|min-inline-size|min-block-size|flex-basis|border-width|box-sizing|text-transform|border-.*-radius|padding-.*|margin-.*|inset-.*)$")
    def fb(v):
        prev = None
        while prev != v:
            prev = v; v = re.sub(r"var\(--[\w-]+,\s*((?:[^()]|\([^()]*\))+)\)", r"\1", v)
        return v.replace("9pt", "12px").replace("1pc", "16px").replace("2pc", "32px").replace("15pc", "240px")
    for pkg in sorted(os.listdir(root)):
        base = os.path.join(root, pkg, "dist", "esm")
        if not os.path.isdir(base): continue
        ver = json.load(open(os.path.join(root, pkg, "package.json")))["version"]
        cmap = {}
        for c in glob.glob(base + "/**/*.compiled.css", recursive=True):
            for m in re.finditer(r"\.(_[\w]+)(?:[^{]*)\{([^}]*)\}", open(c).read()):
                cmap.setdefault(m.group(1), []).append((m.group(0).split("{")[0], m.group(2)))
        if not cmap: continue
        out = []
        for j in sorted(glob.glob(base + "/**/*.js", recursive=True)):
            s = open(j, errors="ignore").read()
            ents = re.findall(r"(\w+|\"[\w-]+\"|'[\w .-]+')\s*:\s*\"((?:_[\w]+\s?)+)\"", s) + [(a, b) for a, b in re.findall(r"var (\w+) = (?:null|\"((?:_[\w]+\s?)+)\")", s) if b]
            block = []
            for k, classes in ents:
                decl = []
                for cl in classes.split():
                    for sel, d in cmap.get(cl, []):
                        if GEO.match(d.split(":")[0].strip()):
                            pseudo = re.sub(r"^\." + cl, "", sel).strip()
                            decl.append((f"[{pseudo}] " if pseudo else "") + fb(d.strip()))
                if decl: block.append(f"  {k}: " + "; ".join(dict.fromkeys(decl)))
            if block: out += [f"### @atlaskit/{pkg}@{ver}  {j.split('/dist/esm/')[1]}  (token fallbacks; pt and pc converted to px)"] + block
        # plain JS size maps (avatar sizes, modal widths)
        for j in sorted(glob.glob(base + "/**/*.js", recursive=True)):
            hits = sorted(set(re.findall(r"\b(xsmall|small|medium|large|xlarge|xxlarge)\s*:\s*['\"]?(\d+)(?:px)?['\"]?", open(j, errors="ignore").read())))
            if hits: out.append(f"### @atlaskit/{pkg}@{ver}  {j.split('/dist/esm/')[1]}  size map: " + ", ".join(f"{a} {b}" for a, b in hits))
        if out: write("atl", pkg, out, "w")

def main():
    if os.path.isdir(OUT): shutil.rmtree(OUT)
    prim = os.path.join(NPM, "@primer/primitives/dist/css")
    dump_css("oai", [os.path.join(SRC, "oai/src/styles/variables-*.css"), os.path.join(SRC, "oai/src/styles/tailwind-utilities.css")], os.path.join(SRC, "oai/src/components/**/*.module.css"))
    dump_oai_vars()
    dump_css("pri", [prim + "/base/**/*.css", prim + "/functional/size/*.css", prim + "/functional/typography/*.css", prim + "/primitives.css"], os.path.join(SRC, "pri/packages/react/src/**/*.module.css"))
    rdx = os.path.join(SRC, "rdx/packages/radix-ui-themes/src")
    ov = {"--scaling": "1", "--radius-factor": "1", "--radius-full": "0px", "--radius-thumb": "0.5px"}
    dump_css("rdx", [rdx + "/styles/tokens/*.css"], rdx + "/components/*.css", ov)
    dump_css("rdx", [rdx + "/styles/tokens/*.css"], rdx + "/components/_internal/*.css", ov)
    dump_sha(); dump_flu(); dump_m3(); dump_car(); dump_mui(); dump_atl()
    pins = ["# Evidence pins", "", "Generated by `tools/audit-evidence/extract.py`. Do not edit by hand.", "", "| Key | System | Commit or version | Commit date |", "| --- | --- | --- | --- |"]
    for k, g in PINS["git"].items(): pins.append(f"| `{k}` | {g['name']} | `{g['commit'][:10]}` | {g.get('date', '')} |")
    pins.append("| `atl` | Atlassian Design System (npm, compiled) | per file header | |")
    pins += ["", "Token resolvers: `@primer/primitives@%s`, `@fluentui/tokens@%s`. Radix resolved at scaling 1, radius `medium`. shadcn resolved at `--radius: 0.625rem`. Carbon spacing and type resolved from the published scale." % (PINS["npm"]["@primer/primitives"], PINS["npm"]["@fluentui/tokens"]),
             "", "Not covered, because they publish no readable geometry: Geist, Notion, Figma, Apple HIG. Record them as `n/p`; never recall numbers for them."]
    open(os.path.join(OUT, "PINS.md"), "w").write("\n".join(pins) + "\n")
    for k in sorted(os.listdir(OUT)):
        p = os.path.join(OUT, k)
        if os.path.isdir(p): print(k, len(os.listdir(p)), "files")

if __name__ == "__main__":
    main()
