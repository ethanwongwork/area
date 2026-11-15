// Save, review and publish (electron/github.cjs) against temporary repositories: a project folder cloned from a local
// stand-in for GitHub (a bare repository named like one), and a stand-in gh that records what it is asked and answers
// as GitHub would. Nothing here reaches GitHub.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { chmodSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createGit, githubOf, branchFor } = require("../electron/github.cjs");

const sh = (cwd: string, ...args: string[]) => execFileSync("git", args, { cwd, encoding: "utf8", env: { ...process.env, GIT_AUTHOR_NAME: "David Tee", GIT_AUTHOR_EMAIL: "david@example.com", GIT_COMMITTER_NAME: "David Tee", GIT_COMMITTER_EMAIL: "david@example.com" } }).trim();

/** A project folder whose origin is a local bare repository at a path that reads as github.com/acme/shop. */
function setup() {
  const root = mkdtempSync(join(tmpdir(), "area-github-"));
  const remote = join(root, "github.com", "acme", "shop.git");
  execFileSync("mkdir", ["-p", remote]);
  sh(remote, "init", "--bare", "--initial-branch=main");
  const folder = join(root, "shop");
  sh(root, "clone", remote, folder);
  // The app's own commits run without the env above: give the project an identity, as a person's machine has one.
  sh(folder, "config", "user.name", "David Tee"); sh(folder, "config", "user.email", "david@example.com");
  writeFileSync(join(folder, "app.css"), "button { color: blue; }\n");
  sh(folder, "add", "-A"); sh(folder, "commit", "-m", "Start"); sh(folder, "push", "origin", "main");
  sh(folder, "remote", "set-head", "origin", "main");
  // The stand-in gh: signed in; answers pr view / create / merge from a state file, and logs every call.
  const log = join(root, "gh.log"), store = join(root, "gh.json");
  writeFileSync(store, "{}");
  const gh = join(root, "gh");
  writeFileSync(gh, `#!/usr/bin/env node
const fs = require("fs"); const args = process.argv.slice(2); fs.appendFileSync(${JSON.stringify(log)}, JSON.stringify(args) + "\\n");
const db = JSON.parse(fs.readFileSync(${JSON.stringify(store)}, "utf8"));
const save = () => fs.writeFileSync(${JSON.stringify(store)}, JSON.stringify(db));
if (args[0] === "auth") process.exit(process.env.GH_SIGNED_OUT ? 1 : 0);
if (args[0] === "pr" && args[1] === "view") { const pr = db[args[2]]; if (!pr) { console.error("no pull requests found"); process.exit(1); } console.log(JSON.stringify(pr)); process.exit(0); }
if (args[0] === "pr" && args[1] === "create") { const head = args[args.indexOf("--head") + 1]; db[head] = { number: 7, url: "https://github.com/acme/shop/pull/7", state: "OPEN", title: args[args.indexOf("--title") + 1] }; save(); console.log("https://github.com/acme/shop/pull/7"); process.exit(0); }
if (args[0] === "pr" && args[1] === "merge") { for (const k of Object.keys(db)) db[k].state = "MERGED"; save(); process.exit(0); }
process.exit(2);
`);
  chmodSync(gh, 0o755);
  return { root, folder, remote, gh, log: () => readFileSync(log, "utf8").trim().split("\n").filter(Boolean).map(line => JSON.parse(line) as string[]) };
}

test("github: a remote's owner and name; a project's working branch", () => {
  assert.deepEqual(githubOf("git@github.com:acme/shop.git"), { owner: "acme", name: "shop" });
  assert.deepEqual(githubOf("https://github.com/acme/shop"), { owner: "acme", name: "shop" });
  assert.equal(githubOf("https://gitlab.com/acme/shop.git"), null);
  assert.equal(branchFor("Spring Launch!"), "area/spring-launch");
  assert.equal(branchFor(""), "area/project");
});

test("github: a folder without git, and one with nothing to save, say so", async () => {
  const engine = createGit({ gh: "/bin/false" });
  const plain = mkdtempSync(join(tmpdir(), "area-plain-"));
  assert.deepEqual(await engine.state(plain, "Shop"), { kind: "plain" });
  assert.deepEqual(await engine.state("relative/path", "Shop"), { kind: "none" });
  const { folder } = setup();
  assert.match((await engine.save(folder, "Shop", "Nothing")).error, /nothing new/);
  assert.match((await engine.save(folder, "Shop", "  ")).error, /Say what changed/);
});

test("github: save makes the project's line of work from the main line and keeps the changes; review sends and opens one; publish merges", async () => {
  const { folder, remote, gh, log } = setup();
  const engine = createGit({ gh });
  writeFileSync(join(folder, "app.css"), "button { color: var(--area-fg-default); }\n");
  writeFileSync(join(folder, "new.css"), ".x {}\n");
  const before = await engine.state(folder, "Shop");
  assert.equal(before.kind, "git");
  assert.deepEqual([before.branch, before.main, before.working, before.files.length, before.saves, before.signedIn], ["main", "main", "area/shop", 2, 0, true]);
  assert.deepEqual(before.github, { owner: "acme", name: "shop" });

  const saved = await engine.save(folder, "Shop", "Buttons use the system's text color");
  assert.equal(saved.ok, true, saved.error);
  assert.deepEqual([saved.state.branch, saved.state.files.length, saved.state.saves], ["area/shop", 0, 1]);
  assert.equal(sh(folder, "rev-parse", "main"), sh(remote, "rev-parse", "main"), "the main line is untouched");
  assert.match(sh(folder, "log", "-1", "--format=%s"), /Buttons use the system's text color/);

  assert.match((await createGit({ gh, env: { ...process.env, GH_SIGNED_OUT: "1" } }).review(folder, "Shop", "t", "b")).error, /isn't signed in/);
  const reviewed = await engine.review(folder, "Shop", "Buttons use the system's text color", "Made in Area.");
  assert.equal(reviewed.ok, true, reviewed.error);
  assert.equal(reviewed.url, "https://github.com/acme/shop/pull/7");
  assert.equal(sh(remote, "rev-parse", "area/shop"), sh(folder, "rev-parse", "HEAD"), "the saves were sent");
  const create = log().find(args => args[1] === "create")!;
  assert.deepEqual([create[create.indexOf("--base") + 1], create[create.indexOf("--head") + 1]], ["main", "area/shop"]);
  assert.equal((await engine.state(folder, "Shop")).review.state, "OPEN");
  // Asked again, the open review is answered, not a second one made.
  const again = await engine.review(folder, "Shop", "x", "y");
  assert.equal(again.url, "https://github.com/acme/shop/pull/7");
  assert.equal(log().filter(args => args[1] === "create").length, 1);

  // A change not saved stops publishing.
  writeFileSync(join(folder, "late.css"), ".y {}\n");
  assert.match((await engine.publish(folder, "Shop")).error, /Save or undo/);
  sh(folder, "clean", "-fd");
  const published = await engine.publish(folder, "Shop");
  assert.equal(published.ok, true, published.error);
  assert.ok(log().some(args => args[1] === "merge" && args.includes("--squash")));
  assert.equal(published.state.branch, "main", "back on the main line");
});

test("github: another line of work in the folder is left alone", async () => {
  const { folder, gh } = setup();
  const engine = createGit({ gh });
  sh(folder, "switch", "-c", "area/shop"); sh(folder, "switch", "main"); sh(folder, "switch", "-c", "someone-elses");
  writeFileSync(join(folder, "app.css"), "button { color: red; }\n");
  assert.match((await engine.save(folder, "Shop", "Red")).error, /another line of work \(someone-elses\)/);
  assert.equal(sh(folder, "branch", "--show-current"), "someone-elses");
});
