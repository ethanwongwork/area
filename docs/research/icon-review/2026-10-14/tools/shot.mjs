// Screenshot an HTML file with headless Edge: node shot.mjs in.html out.png width height [scale]
import { edgeShot } from "../../2026-10-07/edge.mjs";
const [inp, out, w, h, sc = "2"] = process.argv.slice(2);
await edgeShot(["--user-data-dir=" + out + "-prof", "--no-first-run", "--disable-gpu", "--hide-scrollbars", `--force-device-scale-factor=${sc}`, `--window-size=${w},${h}`], out, "file://" + inp);
console.log(out);
