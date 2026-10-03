import os,re,plistlib,sys,json
R="apps/docs/.cache/refs"
def libs():
    fl={re.sub(r"_\d+_(regular|filled)\.svg$","",f) for f in os.listdir("node_modules/@fluentui/svg-icons/icons")}
    lu={f[:-4] for f in os.listdir(R+"/lucide-static/package/icons") if f.endswith(".svg")}
    ph={f[:-4] for f in os.listdir(R+"/phosphor-icons-core/package/assets/regular")}
    hu={f[:-7] for f in os.listdir(R+"/hugeicons-core-free-icons/package/dist/esm") if f.endswith("Icon.js")}
    sf=set(plistlib.load(open("/Applications/SF Symbols.app/Contents/Resources/Metadata/name_availability.plist","rb"))["symbols"].keys())
    return dict(fluent=fl,lucide=lu,phosphor=ph,huge=hu,sf=sf)
if __name__=="__main__":
    L=libs()
    for q in sys.argv[1:]:
        print("##",q)
        for k,v in L.items():
            hits=sorted(n for n in v if re.search(q,n,re.I))[:8]
            print(f"  {k:8} {len(hits)}: {', '.join(hits)}")
