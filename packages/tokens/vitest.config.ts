import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    reporters: ["default"],
    // Most tests here sweep every setting position; on a CI runner even the smaller sweeps take over vitest's 5 s
    // default (two did, 2026-11-15). The long sweeps keep their own, longer limits.
    testTimeout: 60_000,
  },
});
