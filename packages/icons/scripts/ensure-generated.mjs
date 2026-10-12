// Typecheck needs the generated sources; generate them (lint included) when they are missing.
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
if (!existsSync(new URL("../src/generated/meta.ts", import.meta.url)))
  execFileSync(process.execPath, [new URL("../../../apps/docs/scripts/gen-pilot-icons.mjs", import.meta.url).pathname, "--package"], { stdio: "inherit" });
