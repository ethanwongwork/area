#!/usr/bin/env bash
# Check out the pinned design-system sources into ./.cache (git-ignored).
# Usage: ./fetch.sh            pinned commits and versions from sources.json
#        ./fetch.sh --latest   move to current heads / latest, rewrite sources.json
set -euo pipefail
cd "$(dirname "$0")"
LATEST=0; [ "${1:-}" = "--latest" ] && LATEST=1
mkdir -p .cache/src .cache/npm
python3 - "$LATEST" <<'PY'
import json,subprocess,sys,os
latest=sys.argv[1]=="1"; S=json.load(open("sources.json"))
def run(*a,cwd=None): subprocess.run(a,cwd=cwd,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
for key,g in S["git"].items():
    d=f".cache/src/{key}"
    if not os.path.isdir(d+"/.git"):
        os.makedirs(d,exist_ok=True); run("git","init","-q",cwd=d); run("git","remote","add","origin",g["url"],cwd=d)
        run("git","config","core.sparseCheckout","true",cwd=d)
    open(d+"/.git/info/sparse-checkout","w").write("\n".join("/"+p.strip("/")+"/" for p in g["sparse"])+"\n")
    ref="HEAD" if latest else g["commit"]
    print(f"fetch {key} {ref[:10]}",flush=True)
    run("git","fetch","-q","--depth","1","--filter=blob:none","origin",ref,cwd=d)
    run("git","checkout","-q","-f","FETCH_HEAD",cwd=d)
    g["commit"]=subprocess.check_output(["git","rev-parse","HEAD"],cwd=d,text=True).strip()
    g["date"]=subprocess.check_output(["git","log","-1","--format=%ad","--date=short"],cwd=d,text=True).strip()
pk=".cache/npm/package.json"
if not os.path.exists(pk): open(pk,"w").write('{"name":"audit-evidence-cache","private":true}')
specs=[f"{n}@{'latest' if latest else v}" for n,v in S["npm"].items()]
print("npm install",len(specs),"packages",flush=True)
subprocess.run(["npm","i","--no-audit","--no-fund","--ignore-scripts","--silent",*specs],cwd=".cache/npm",check=True)
for n in S["npm"]:
    S["npm"][n]=json.load(open(f".cache/npm/node_modules/{n}/package.json"))["version"]
json.dump(S,open("sources.json","w"),indent=2); open("sources.json","a").write("\n")
PY
echo "done. next: python3 extract.py"
