/**
 * Save, ask for review and publish, through the project folder's own git and GitHub (owner, 2026-11-11: "GitHub next";
 * docs/research/desktop-app-analysis-2026-11-10, T4; docs/BRIEF.md, GitHub). The words are the app's (PRODUCT_UI.md
 * rule 24): a save is a commit on a working branch Area makes for the project, a review is a pull request, publishing
 * merges it. Git's own words stay here.
 *
 * Sign-in is the one this Mac already has: git's own for saving and sending, and GitHub's command line (`gh`) for a
 * review and publishing. A GitHub App of Area's own, which the brief names, needs the app registered; until then a
 * person without `gh` is told how to sign in. Nothing here runs unless the person presses its button, and Area never
 * touches the folder's main line except through a review they publish.
 *
 *   area:git-state     what the folder is: on GitHub or not, the working branch, what isn't saved, the open review
 *   area:git-save      save every change in the folder on the working branch (made from the main line when needed)
 *   area:git-review    send the working branch and open a review for it (or answer the one open)
 *   area:git-publish   merge the open review into the main line, then go back to it
 *
 * `createGit` is the engine without Electron: the github test drives it with temporary repositories and a stand-in gh.
 */
const { execFile } = require("node:child_process");
const { existsSync, statSync } = require("node:fs");
const { homedir } = require("node:os");
const { isAbsolute, join } = require("node:path");

/** Where a command is on this Mac: an app started from Finder doesn't have the shell's PATH. */
function findTool(name, override) {
  if (override) return override;
  for (const dir of ["/opt/homebrew/bin", "/usr/local/bin", join(homedir(), ".local", "bin"), "/usr/bin"]) {
    const path = join(dir, name);
    if (existsSync(path)) return path;
  }
  return name;
}

/** A remote's GitHub owner and name ("git@github.com:o/n.git", "https://github.com/o/n"), or null. */
function githubOf(url) {
  const match = /github\.com[:/]+([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+?)(?:\.git)?\/?$/.exec(String(url ?? "").trim());
  return match ? { owner: match[1], name: match[2] } : null;
}

/** A working branch's name for a project: area/<project>, as a branch name may hold it. */
const branchFor = project => `area/${String(project ?? "project").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "project"}`;

function createGit({ git = findTool("git"), gh = findTool("gh", process.env.AREA_GH), env = process.env } = {}) {
  const run = (command, args, cwd) => new Promise(done => {
    execFile(command, args, { cwd, env: { ...env, GIT_TERMINAL_PROMPT: "0", GH_PROMPT_DISABLED: "1" }, maxBuffer: 8 * 1024 * 1024, timeout: 60_000 }, (error, stdout, stderr) => {
      done({ ok: !error, out: String(stdout ?? "").trim(), err: String(stderr ?? "").trim() || (error ? String(error.message) : "") });
    });
  });
  const folderOk = folder => typeof folder === "string" && isAbsolute(folder) && existsSync(folder) && statSync(folder).isDirectory();
  const plain = text => String(text).split("\n").filter(Boolean).slice(-1)[0]?.replace(/^(fatal|error|remote): /i, "") ?? "";

  /** The main line: the remote's HEAD, else main or master, else the branch checked out. */
  async function mainLine(folder) {
    const head = await run(git, ["symbolic-ref", "--short", "refs/remotes/origin/HEAD"], folder);
    if (head.ok && head.out) return head.out.replace(/^origin\//, "");
    for (const name of ["main", "master"]) if ((await run(git, ["rev-parse", "--verify", "--quiet", `refs/heads/${name}`], folder)).ok) return name;
    return (await run(git, ["branch", "--show-current"], folder)).out || "main";
  }

  async function state(folder, project) {
    if (!folderOk(folder)) return { kind: "none" };
    const inside = await run(git, ["rev-parse", "--is-inside-work-tree"], folder);
    if (!inside.ok) return { kind: "plain" };
    const [branch, status, remote, main] = await Promise.all([
      run(git, ["branch", "--show-current"], folder), run(git, ["status", "--porcelain=v1", "--untracked-files=all"], folder),
      run(git, ["remote", "get-url", "origin"], folder), mainLine(folder)]);
    const files = status.out ? status.out.split("\n").map(line => ({ status: line.slice(0, 2).trim(), path: line.slice(3).replace(/^"|"$/g, "") })) : [];
    const working = branchFor(project);
    const current = branch.out;
    const ahead = current && current !== main ? Number((await run(git, ["rev-list", "--count", `${main}..${current}`], folder)).out) || 0 : 0;
    const github = remote.ok ? githubOf(remote.out) : null;
    const signedIn = github ? (await run(gh, ["auth", "status", "--hostname", "github.com"], folder)).ok : false;
    let review = null;
    if (github && signedIn && current && current !== main) {
      const view = await run(gh, ["pr", "view", current, "--json", "number,url,state,title"], folder);
      if (view.ok) { try { review = JSON.parse(view.out); } catch {} }
    }
    return { kind: "git", branch: current, main, working, onWorking: current === working, files, saves: ahead, remote: remote.ok ? remote.out : null, github, signedIn, review };
  }

  /** Save every change in the folder: on the working branch, made from the main line the first time. */
  async function save(folder, project, message) {
    if (!folderOk(folder)) return { error: "This project's folder isn't there any more." };
    const words = String(message ?? "").trim();
    if (!words) return { error: "Say what changed, then save." };
    const now = await state(folder, project);
    if (now.kind !== "git") return { error: "This folder doesn't keep versions yet." };
    if (!now.files.length) return { error: "There's nothing new to save." };
    if (now.branch !== now.working) {
      // Off the main line onto the project's working branch, taking the changes with it (git keeps them in place).
      const exists = (await run(git, ["rev-parse", "--verify", "--quiet", `refs/heads/${now.working}`], folder)).ok;
      if (exists && now.branch !== now.main) return { error: `This folder is on another line of work (${now.branch}). Switch it back in your editor, then save.` };
      const moved = await run(git, exists ? ["switch", now.working] : ["switch", "-c", now.working], folder);
      if (!moved.ok) return { error: `Couldn't start the project's line of work: ${plain(moved.err)}` };
    }
    const added = await run(git, ["add", "--all"], folder);
    if (!added.ok) return { error: plain(added.err) };
    const made = await run(git, ["commit", "--message", words, "--no-verify"], folder);
    if (!made.ok && /empty ident|identity unknown|no email was given|auto-detect email/i.test(made.err)) {
      return { error: "Git doesn't know who's saving. Run git config --global user.name and user.email in Terminal, then save." };
    }
    if (!made.ok) return { error: `Couldn't save: ${plain(made.err || made.out)}` };
    return { ok: true, state: await state(folder, project) };
  }

  /** Send the working branch and open a review of it against the main line (or answer the one already open). */
  async function review(folder, project, title, body) {
    const now = await state(folder, project);
    if (now.kind !== "git" || !now.github) return { error: "This project's folder isn't on GitHub." };
    if (!now.signedIn) return { error: "GitHub isn't signed in on this Mac. Run gh auth login in Terminal, then try again." };
    if (now.branch !== now.working || !now.saves) return { error: "Save first: a review shows what was saved." };
    const sent = await run(git, ["push", "--set-upstream", "origin", now.working], folder);
    if (!sent.ok) return { error: `Couldn't send the saves to GitHub: ${plain(sent.err)}` };
    if (now.review && now.review.state === "OPEN") return { ok: true, url: now.review.url, state: await state(folder, project) };
    // Without words of their own, the review is titled by the latest save and lists every save.
    const saves = (await run(git, ["log", "--format=%s", `${now.main}..${now.working}`], folder)).out.split("\n").filter(Boolean);
    const named = String(title || saves[0] || `Changes from ${project}`).slice(0, 200);
    const said = String(body || [...saves.map(line => `- ${line}`), "", `Made in Area, in the project ${project}.`].join("\n"));
    const made = await run(gh, ["pr", "create", "--base", now.main, "--head", now.working, "--title", named, "--body", said], folder);
    if (!made.ok) return { error: `Couldn't open the review: ${plain(made.err)}` };
    return { ok: true, url: made.out.split("\n").filter(line => /^https?:\/\//.test(line)).pop() ?? made.out, state: await state(folder, project) };
  }

  /** Merge the open review into the main line, then go back to the main line, up to date. */
  async function publish(folder, project) {
    const now = await state(folder, project);
    if (now.kind !== "git" || !now.review || now.review.state !== "OPEN") return { error: "There's no open review to publish." };
    if (now.files.length) return { error: "Save or undo the changes not saved yet, then publish." };
    const merged = await run(gh, ["pr", "merge", String(now.review.number), "--squash", "--delete-branch"], folder);
    if (!merged.ok) return { error: `Couldn't publish: ${plain(merged.err)}` };
    await run(git, ["switch", now.main], folder);
    await run(git, ["pull", "--ff-only"], folder);
    return { ok: true, state: await state(folder, project) };
  }

  return { state, save, review, publish };
}

function register() {
  const { ipcMain } = require("electron");
  const engine = createGit();
  ipcMain.handle("area:git-state", (_event, folder, project) => engine.state(folder, project));
  ipcMain.handle("area:git-save", (_event, folder, project, message) => engine.save(folder, project, message));
  ipcMain.handle("area:git-review", (_event, folder, project, title, body) => engine.review(folder, project, title, body));
  ipcMain.handle("area:git-publish", (_event, folder, project) => engine.publish(folder, project));
}

module.exports = { register, createGit, githubOf, branchFor };
