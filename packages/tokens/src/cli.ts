/**
 * `area-tokens`: Area's token command (2026-10-26). Two subcommands:
 *
 *   area-tokens brand --primary #00b65c [--secondary #a785fe] [--tertiary #f8311c]
 *                     [--status harmonised|fixed|match] [--selector "[data-area-brand]"] > brand.css
 *   area-tokens colours [--page-light "oklch(0.9634 0.012 255)"] [--page-dark "#101418"] [--accent #2f5bd3]
 *                       [--secondary <colour>] [--tertiary <colour>] [--status harmonised|fixed|match]
 *                       [--selector "[data-area-colours]"] > colours.css
 *
 * Each writes one CSS rule (emit/brand.ts, emit/colours.ts), for products that use Area's CSS without its React
 * components. `colours` (2026-10-27) writes exact page and accent colours; a colour is oklch(L C h) or a hex.
 */
import { brandCss, isBrandColour } from "./brand-entry.ts";
import { colourCss, isColour } from "./colours-entry.ts";

const [command, ...rest] = process.argv.slice(2);
const flag = (name: string) => { const i = rest.indexOf(`--${name}`); return i >= 0 ? rest[i + 1] : undefined; };
const usage = [
  "Usage: area-tokens brand --primary <hex> [--secondary <hex>] [--tertiary <hex>] [--status harmonised|fixed|match] [--selector <css>]",
  "       area-tokens colours [--page-light <colour>] [--page-dark <colour>] [--accent <colour> [--secondary <colour>] [--tertiary <colour>]] [--status harmonised|fixed|match] [--selector <css>]",
  "       a colour is oklch(L C h) or a hex",
].join("\n");
const fail = (message: string): never => { console.error(message); process.exit(1); };

if (command !== "brand" && command !== "colours") {
  console.error(usage);
  process.exit(command ? 1 : 0);
}
const status = flag("status"), selector = flag("selector");
if (status && !["harmonised", "fixed", "match"].includes(status)) fail(`--status must be harmonised, fixed or match, not "${status}".`);
const options = { ...(status ? { statusColours: status as "harmonised" | "fixed" | "match" } : {}), ...(selector ? { selector } : {}) };

if (command === "brand") {
  const primary = flag("primary"), secondary = flag("secondary"), tertiary = flag("tertiary");
  for (const [name, value] of [["primary", primary], ["secondary", secondary], ["tertiary", tertiary]] as const) {
    if (value !== undefined && !isBrandColour(value)) fail(`--${name} must be a hex colour (#rgb or #rrggbb), not "${value}".`);
  }
  if (!primary) fail(usage);
  const expand = (hex?: string) => hex && hex.length === 4 ? `#${[...hex.slice(1)].map(c => c + c).join("")}` : hex;
  process.stdout.write(brandCss(
    { primary: expand(primary)!, ...(secondary ? { secondary: expand(secondary) } : {}), ...(tertiary ? { tertiary: expand(tertiary) } : {}) },
    options,
  ));
} else {
  const light = flag("page-light"), dark = flag("page-dark"), accent = flag("accent"), secondary = flag("secondary"), tertiary = flag("tertiary");
  for (const [name, value] of [["page-light", light], ["page-dark", dark], ["accent", accent], ["secondary", secondary], ["tertiary", tertiary]] as const) {
    if (value !== undefined && !isColour(value)) fail(`--${name} must be oklch(L C h) or a hex colour, not "${value}".`);
  }
  if (!light && !dark && !accent) fail(usage);
  if ((secondary || tertiary) && !accent) fail("--secondary and --tertiary go with --accent.");
  const page = { ...(light ? { light } : {}), ...(dark ? { dark } : {}) };
  process.stdout.write(colourCss({ ...(light || dark ? { page } : {}), ...(accent ? { accent } : {}), ...(secondary ? { secondary } : {}), ...(tertiary ? { tertiary } : {}) }, options));
}
