/**
 * `area-tokens`: Area's token command (2026-10-26). One subcommand so far:
 *
 *   area-tokens brand --primary #00b65c [--secondary #a785fe] [--tertiary #f8311c]
 *                     [--status harmonised|fixed|match] [--selector "[data-area-brand]"] > brand.css
 *
 * writes a brand as one CSS rule (emit/brand.ts), for products that use Area's CSS without its React components.
 */
import { brandCss, isBrandColour } from "./brand-entry.ts";

const [command, ...rest] = process.argv.slice(2);
const flag = (name: string) => { const i = rest.indexOf(`--${name}`); return i >= 0 ? rest[i + 1] : undefined; };
const usage = "Usage: area-tokens brand --primary <hex> [--secondary <hex>] [--tertiary <hex>] [--status harmonised|fixed|match] [--selector <css>]";

if (command !== "brand") {
  console.error(usage);
  process.exit(command ? 1 : 0);
}
const primary = flag("primary"), secondary = flag("secondary"), tertiary = flag("tertiary"), status = flag("status");
for (const [name, value] of [["primary", primary], ["secondary", secondary], ["tertiary", tertiary]] as const) {
  if (value !== undefined && !isBrandColour(value)) { console.error(`--${name} must be a hex colour (#rgb or #rrggbb), not "${value}".`); process.exit(1); }
}
if (!primary) { console.error(usage); process.exit(1); }
if (status && !["harmonised", "fixed", "match"].includes(status)) { console.error(`--status must be harmonised, fixed or match, not "${status}".`); process.exit(1); }
const expand = (hex?: string) => hex && hex.length === 4 ? `#${[...hex.slice(1)].map(c => c + c).join("")}` : hex;
process.stdout.write(brandCss(
  { primary: expand(primary)!, ...(secondary ? { secondary: expand(secondary) } : {}), ...(tertiary ? { tertiary: expand(tertiary) } : {}) },
  { ...(status ? { statusColours: status as "harmonised" | "fixed" | "match" } : {}), ...(flag("selector") ? { selector: flag("selector") } : {}) },
));
