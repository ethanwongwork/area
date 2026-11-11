# Area against Cursor, ChatGPT (Codex) and Figma (2026-11-10)

Owner's request: evaluate what coding environments have (infrastructure, pages, navigation) and what Area can gain
in usability, cohesion, smoother interaction, personalization, technical capability and a simpler interface.

- Review page: https://claude.ai/artifact/KnodsVM8y8WTmkTUWbxz5d (source `page.html` here). 26 proposals; the owner's
  picks are in the page's `verdicts` collection (doc id = proposal id, `{pick: build|later|no, note}`), empty at
  publish. Read them before building anything from this.

## How it was read

Screen control was not available, so no app was driven live. Each was read from its installed bundle and official docs:
Cursor 3.27.22 (`workbench.glass.main.{js,css}`), ChatGPT 26.1023 (the Codex Electron app, bundle id
`com.openai.codex`; interface strings), Figma 126.9.13 (desktop shell; editor, Dev Mode, Make and MCP from docs), Area
from source at `e915a483`. A bundle string shows a feature is built, not that it is switched on.

## Findings

- Area is ahead on the design side (settings, inventory, versions, flows, direct editing, checks).
- The chat is real (Claude Agent SDK) but its working folder is Area's repository (`apps/desktop/electron/agent.cjs`,
  `ROOT`, `cwd`), not the user's project. No folder per project, no preview of a running app, no per-file changes, no
  destination but a local folder.
- The three references share one shell: work in the sidebar, chat in the middle, a side panel of tabs opened on demand
  (Changes, Files, Browser, Terminal, Plan; Figma Make: Browser, Files, Review).
- `docs/BRIEF.md` "What exists today" is out of date: the generator, lock and merge, and the MCP server exist in
  `packages/output`.

## Recommended order

1. T1 a folder per project and chat works there; U4 chats kept with their project.
2. T3 Changes view (per file keep or undo, a comment on a line to chat).
3. T2 preview of the running app, with the stage's selection on it.
4. T7 more MCP tools and a setup page; U9 `area://` links and Open in editor.
5. T10 finish notice and working marks; U1 ⌘K runs commands.
6. V1 panel motion; V4 Components scroll; V3 loading and failure states.
7. T4 GitHub, after Changes.
8. T6 technical tools, switched on in Settings and off by default: Files, a code editor and a terminal as side tabs
   for design engineers (owner, 2026-11-10: "it would be good to have these as options to toggle on for more technical
   users"). The brief already says "by default", so it stands.

Left out on purpose: an editor fork, an extension store, cloud agents, scheduled runs, voice.

## Built

Step 1 (T1 and U4), 2026-11-10, uncommitted:

- A project records a folder (`src/projects.ts` `folder`, chosen on the Overview's Code section; `electron/folder.cjs`).
- Chat works in that folder under instructions about the person's project (`electron/agent.cjs` `PROJECT`); without a
  folder it works in Area's repository as before; a folder that is gone fails the prompt and never falls back.
- The @ menu lists the folder's real files.
- A chat belongs to its place: each project and each system has its own conversation, the rest of the app shares one
  (`src/chat/chat.tsx` `ChatHost`). Chats are kept as files beside their place (`src/chat/store.ts`,
  `Projects/<id>/chats/`) and open again from Past chats in the conversation's head.
- Not built from the proposals' words: a project without a folder is not made read-only (it would stop the Design
  view's changes, which today go to Area's code); chats are not yet listed in the Sidebar or found from ⌘K; a system's
  chat does not yet work in the folder its version was written to; a kept chat cannot be deleted from the app.

Step 2 (T3, the Changes view), 2026-11-10, uncommitted:

- In a project's tab the Inspector's Code view is Changes (`src/chat/changes.tsx`, `changes.ts`): what the project's chat
  changed, a file once across the whole conversation, with lines added and deleted, the change with line numbers and
  folds (`src/chat/line-diff.ts`), Keep or Undo per file and for all. The Code tab counts the files still waiting.
- The engine records each file before the chat's first edit and after its last (`electron/agent.cjs` `changes`); a
  file undone goes back edit by edit. Without a record (a chat opened again after the app closed) the edits' own
  lines show, unnumbered.
- A + on a line writes a comment under it; comments go to Chat together as one card, as the Design view's changes do.
  Diff gained `onComment` and `notes` for this (docs/specs/edit-summary.md, tile "Variant / diff, comment").
- `AREA_AGENT_SDK=<file>` loads a stand-in agent, so the whole chat path can be driven in the app without Claude.
- Not built: side by side (it needs about twice the Inspector's width); changes outside Edit and Write (a command that
  writes files); the same view for a system's chat.

Step 3 (T2, the Preview), 2026-11-10, uncommitted:

- A project's nav has Preview (`src/pages/preview.tsx`, place `#project/<id>/preview`): the project's own app, running
  on this Mac, on the Canvas in a `<webview>`. The person starts the app themselves and gives its address once
  (`Project.preview`); Area starts nothing. Nothing running there says so, with Try again.
- Only this Mac's addresses load (`electron/preview.cjs` `localUrl`, `src/preview.ts` `localAddress`): localhost,
  127.0.0.1, [::1], *.localhost. The guest has no preload, no Node and its own session; a link that leaves opens in
  the browser.
- Choose reads the element clicked (the click never reaches the app): what it is, its React component and source line
  where a development build keeps them, its styles and its picture. The Inspector's Design view lists the styles in
  its own words; a value typed there is tried in the running page only. Send to chat puts the tried values and a note
  in the composer as one card with the picture (`ChangeSet.pictures`), and tells the agent how to find the element.
- Not built: Area starting the app; widths (phone, tablet); choosing a parent or child from the Inspector; the
  system's tokens offered as values; the same on the page's stage beside Area's own screens.

Step 4 (T7, tools for coding apps), 2026-11-10, uncommitted:

- The server gained `preview.screenshot` (`packages/output/src/picture.ts`, `mcp.ts`): a component's picture as a PNG,
  under the project's theme settings, in light or dark. The desktop app draws it through its capture mode, which gained
  `--clip=<selector>` and `--pad` (`apps/desktop/electron/main.cjs`). It shows the default specimen only, and a
  theme's exact colors, own accent and material are not drawn. It needs the Area checkout with the app built.
  The other five tools (find, read, token, check, rules) were already there.
- Settings › Coding apps (`apps/desktop/src/coding-apps.ts`, `pages/settings.tsx`): the line or file that connects
  Claude Code, Cursor, VS Code and Codex, with this Mac's path to the command, and what each tool answers. The
  snippets follow each app's documented shape and were not tried in those apps.
- Not built: the command published (the path is this checkout's, so it moves with the checkout); `library.get_item`;
  a picture of a chosen variant; a switch that writes an app's file for the person.

Step 5 (U9, links in and out), 2026-11-10, uncommitted:

- `area://` links name a place as a tab's hash does (`apps/desktop/src/links.ts`; `area://project/<id>/preview`). A
  link in a page or a chat reply opens its place in the tab holding it; a link Area is started with, or one handed to
  a second copy, goes to the running window (`electron/links.cjs`, single-instance lock; a copy started without a link
  keeps running as before). A link to a place that isn't here says so in a notice.
- Copy Link (⌘⇧C, File menu) puts the current place's link on the clipboard, with a "Link copied" notice (the app
  now has a Toaster at its root).
- Open in editor: the editors installed are those macOS says answer their own link scheme (Cursor, VS Code, Windsurf,
  Zed), plus Default app; Settings › Coding apps chooses one. Buttons on the Overview's Code section (the folder), under
  a changed file's diff in Changes (at its first changed line), and on the Preview's chosen element when its source
  line is known. Only a path inside the project's folder opens, links followed.
- Not built: links from other apps on macOS, which need the packaged app (its bundle declares the scheme; this
  checkout runs plain Electron); the agent writing `area://` links in its replies; Open in editor in the system's
  Code views.

Step 6 (T10 and U1), 2026-11-10, uncommitted:

- A tab's icon shows its chat's state (`apps/desktop/src/chat/activity.ts`, `app-nav.tsx` ActivityMark): a turning
  ring while Claude works, a question while an approval or question waits, a finished or stopped mark for a reply
  that ended while the tab wasn't showing, cleared when the tab shows. Screen readers hear it after the tab's name.
- A macOS notice when a reply ends or Claude needs an answer while Area is in the background; clicking it opens the
  place with its chat. Settings › Chat › Notices turns each off.
- Quitting while a chat works asks first ("Claude is still working in a chat").
- ⌘K has a Commands group, each with its keys: Open chat, New chat, Copy link, Hide or show the sidebar and the
  inspector, Switch to light or dark or Match my Mac, Open settings, Connect a coding app; in a project New page,
  New exploration, Show the running app; in a system with several themes, Switch theme…
- Not built: marks on the Sidebar's rows (the tab carries them); a sound; a key to the next chat that needs you;
  Publish and Save version in ⌘K (both open dialogs that live on their pages).

Step 7 (V1, V3, V4), 2026-11-11, uncommitted:

- V4, the Components overview's first scroll. Measured in the app (40 quarter-screen steps): median frame 120 to 150 ms
  and about 6 s in all, the second pass 8 ms. A profile showed layout, not drawing: any change laid out all 125 family
  sections again (about 70 ms). Sections far from the view now skip layout and paint (`content-visibility: auto`,
  `.studio-section--far`), and galleries draw what is within three screens in idle time, nearest first (`tile.tsx`
  `useNear`, also used by WhenVisible). After: median 24 to 46 ms, about 2.7 s in all. Frames where a family first
  draws still reach about 200 ms. Tried and reverted: batching Design card's own measuring (no change).
- V3: each region catches its own failure (`apps/desktop/src/region-boundary.ts`): the Canvas, the Sidebar's list,
  an Inspector view and the Chat say what failed with Try again, and the rest keeps working. PRODUCT_UI.md rule 27
  (with WRITING.md's loading ladder).
- V1: the Sidebar and Inspector slide in and out from their edge with the Canvas's edge (a view transition,
  `studio.tsx` `moveRegions`), on `moderate` and the drawer ease; none at Motion 0 or under reduced motion. MOTION.md
  recipe "Region shown or hidden". Not done: the tab strip and the design panel.

Step 8 (T4, GitHub), 2026-11-11, uncommitted:

- A project's Inspector › Code shows Versions under Changes (`apps/desktop/src/chat/versions.tsx`,
  `electron/github.cjs`), in the app's words (PRODUCT_UI.md rule 24): Save keeps every change in the folder as a
  version on the project's own line of work (`area/<project>`, made from the main line the first time, the changes
  carried with it); Ask for review sends the saves to GitHub and opens a review titled by the latest save, listing
  every save; Publish, after a confirm, merges the review into the main line and the folder goes back to it.
- Sign-in is the one the Mac already has: git's own, and GitHub's command line for reviews. Without it, Versions says
  how to sign in. A GitHub App of Area's own, as the brief has it, needs registering first.
- Area never touches the main line except through a published review, never saves on someone else's line of work,
  and a change not saved stops publishing.
- Tried in the app and the tests against a local repository standing in for GitHub and a stand-in GitHub command
  line (`AREA_GH`); nothing reached GitHub.
- Not built: before and after pictures on the review, the check report on it, making a new repository, choosing what
  to save file by file, other hosts.

Step 9 (T6, technical tools), 2026-11-11, uncommitted:

- Settings › Coding apps › Technical tools, off by default (`apps/desktop/src/tech-tools.ts`). On, a project with a
  folder gains Files in its nav (`#project/<id>/files/<path>`, `src/pages/files.tsx`): the folder's tree in the Sidebar,
  the chosen file in a code editor on the Canvas, a terminal under it. Off, none of it shows.
- The editor is a text field over the same text drawn in Code block's syntax colors (the app's own highlighter, which
  knows JSX-like files; others are plain), with line numbers, Tab for two spaces, ⌘S or Save to save, "not saved" in
  the bar, and a confirm before another file replaces one not saved. A file changed in another app since it was
  opened isn't overwritten. Binary files and files over 1 MB don't open.
- The terminal runs a command line in the folder with the person's shell, streams its output, takes a line of input
  for a running command, recalls earlier commands with Up and Down, and stops on Stop (the whole process group). It
  says it runs outside Chat's approvals. It has no screen of its own: no colors, no full-screen programs.
- Reading and saving stay inside the folder, links followed; a link that leads out is never written through
  (`electron/tools.cjs`; found and fixed while testing).
- Not built: a real terminal emulator (needs a native pseudo-terminal module and a terminal view, new dependencies);
  highlighting for CSS, JSON or Markdown; find and replace; several files open at once; a library component for the
  editor (it is app composition for now, a candidate for Area's own Code editor).

## Measured from Cursor's bundle (for V1 and V2)

Type 11/12/13/14 on lines 14/16/18/22; radius 2/4/6/8/12/14/16/18; spacing 2/4/8/12/16/24/32; durations
50/100/150/200/300 ms; easing `cubic-bezier(0.16,1,0.3,1)`; header bar 40 and 44; hairline and focus ring 1.
