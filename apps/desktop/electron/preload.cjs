// The page's only bridge to Electron: the platform (for the Titlebar inset), the theme and its page ground, showing a Brand
// file in Finder, the app menu's tab commands, the workspace's systems and projects (read once, written on change, moved to the Trash),
// and the Inspector Chat's agent.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("areaDesktop", {
  platform: process.platform,
  setTheme: theme => ipcRenderer.send("area:theme", theme === "dark" ? "dark" : "light"),
  setGround: color => ipcRenderer.send("area:ground", String(color)),
  setTitlebar: height => ipcRenderer.send("area:titlebar", Number(height)),
  revealBrand: path => ipcRenderer.send("area:brand-reveal", String(path)),
  systems: {
    read: () => ipcRenderer.sendSync("area:systems-read"),
    write: (id, text) => ipcRenderer.send("area:system-write", String(id), String(text)),
    trash: id => ipcRenderer.send("area:system-trash", String(id)),
  },
  projects: {
    read: () => ipcRenderer.sendSync("area:projects-read"),
    write: (id, text) => ipcRenderer.send("area:project-write", String(id), String(text)),
    trash: id => ipcRenderer.send("area:project-trash", String(id)),
  },
  // Write to folder (electron/output.cjs): a system's version written into a project's folder as code.
  output: {
    choose: suggested => ipcRenderer.invoke("area:output-choose", suggested ?? null),
    plan: (where, system, version) => ipcRenderer.invoke("area:output-plan", where, String(system), String(version)),
    write: (where, system, version, prefer) => ipcRenderer.invoke("area:output-write", where, String(system), String(version), String(prefer ?? "markers")),
    reveal: where => ipcRenderer.send("area:output-reveal", where),
    command: () => ipcRenderer.invoke("area:output-command"),
  },
  // A project's folder (electron/folder.cjs): where its code lives and Chat works. Absent calls fail in a capture.
  folder: {
    choose: suggested => ipcRenderer.invoke("area:folder-choose", suggested ?? null),
    state: path => ipcRenderer.invoke("area:folder-state", String(path)),
    files: path => ipcRenderer.invoke("area:folder-files", String(path)),
    reveal: path => ipcRenderer.send("area:folder-reveal", String(path)),
  },
  // The Preview of a project's running app (electron/preview.cjs): check an address, choose an element, set a style on it.
  preview: {
    check: address => ipcRenderer.invoke("area:preview-check", String(address ?? "")),
    pick: () => ipcRenderer.invoke("area:preview-pick"),
    cancel: () => ipcRenderer.send("area:preview-cancel"),
    style: (name, value) => ipcRenderer.invoke("area:preview-style", String(name), String(value)),
    clear: () => ipcRenderer.send("area:preview-clear"),
    open: address => ipcRenderer.send("area:preview-open", String(address ?? "")),
  },
  // Save, review and publish (electron/github.cjs): a project's folder, its name, and what is said.
  git: {
    state: (folder, project) => ipcRenderer.invoke("area:git-state", String(folder ?? ""), String(project ?? "")),
    save: (folder, project, message) => ipcRenderer.invoke("area:git-save", String(folder ?? ""), String(project ?? ""), String(message ?? "")),
    review: (folder, project, title, body) => ipcRenderer.invoke("area:git-review", String(folder ?? ""), String(project ?? ""), String(title ?? ""), String(body ?? "")),
    publish: (folder, project) => ipcRenderer.invoke("area:git-publish", String(folder ?? ""), String(project ?? "")),
  },
  // Technical tools (electron/tools.cjs): a folder's files read and written, and a terminal in it.
  tools: {
    read: (folder, path) => ipcRenderer.invoke("area:file-read", String(folder ?? ""), String(path ?? "")),
    write: (folder, path, text, at) => ipcRenderer.invoke("area:file-write", String(folder ?? ""), String(path ?? ""), String(text ?? ""), typeof at === "number" ? at : null),
    run: (id, folder, command) => ipcRenderer.send("area:term-run", String(id), String(folder ?? ""), String(command ?? "")),
    input: (id, text) => ipcRenderer.send("area:term-input", String(id), String(text ?? "")),
    stop: id => ipcRenderer.send("area:term-stop", String(id)),
    onOutput: listener => { const relay = (_event, id, text, stream) => listener(String(id), String(text), stream === "err" ? "err" : "out"); ipcRenderer.on("area:term-out", relay); return () => ipcRenderer.removeListener("area:term-out", relay); },
    onExit: listener => { const relay = (_event, id, end) => listener(String(id), end ?? {}); ipcRenderer.on("area:term-exit", relay); return () => ipcRenderer.removeListener("area:term-exit", relay); },
  },
  // Kept chats, beside their project or system ("project" | "system" | "app", its id): one file each.
  chats: {
    read: (kind, id) => ipcRenderer.invoke("area:chats-read", String(kind), String(id ?? "")),
    write: (kind, id, chat, text) => ipcRenderer.send("area:chat-write", String(kind), String(id ?? ""), String(chat), String(text)),
    trash: (kind, id, chat) => ipcRenderer.send("area:chat-trash", String(kind), String(id ?? ""), String(chat)),
  },
  // Licensed typefaces installed on the Mac: facts about each match, never the files (electron/main.cjs).
  installedFonts: wanted => ipcRenderer.invoke("area:fonts-installed", wanted),
  // The Inspector Chat's agent (electron/agent.cjs): send a prompt, answer an approval, stop, undo edits. In a capture
  // main registers none of it, so `status` fails and the page keeps its recorded runs.
  agent: {
    status: () => ipcRenderer.invoke("area:agent-status"),
    send: (chat, request) => ipcRenderer.send("area:agent-send", String(chat), request),
    answer: (chat, toolUseId, reply) => ipcRenderer.send("area:agent-answer", String(chat), String(toolUseId), reply),
    stop: chat => ipcRenderer.send("area:agent-stop", String(chat)),
    close: chat => ipcRenderer.send("area:agent-close", String(chat)),
    undo: (chat, ids) => ipcRenderer.invoke("area:agent-undo", String(chat), ids.map(String)),
    changes: chat => ipcRenderer.invoke("area:agent-changes", String(chat)),
    onEvent: listener => {
      const relay = (_event, chat, message) => listener(String(chat), message);
      ipcRenderer.on("area:agent-event", relay);
      return () => ipcRenderer.removeListener("area:agent-event", relay);
    },
  },
  // An area:// link to open (electron/links.cjs): its place's hash.
  onLink: listener => {
    const relay = (_event, hash) => listener(String(hash));
    ipcRenderer.on("area:open-link", relay);
    return () => ipcRenderer.removeListener("area:open-link", relay);
  },
  // Open in editor (electron/links.cjs): the editors installed, and a file inside a project's folder opened in one.
  editors: () => ipcRenderer.invoke("area:editors"),
  // T10: how many chats work (main asks before quitting), and a macOS notice that opens its place when clicked.
  setRunning: count => ipcRenderer.send("area:running", Number(count) || 0),
  notify: notice => ipcRenderer.send("area:notify", { title: String(notice?.title ?? ""), body: String(notice?.body ?? ""), hash: String(notice?.hash ?? "") }),
  copyLink: link => ipcRenderer.invoke("area:copy-link", String(link)),
  openIn: (how, folder, path, line) => ipcRenderer.invoke("area:open-in", String(how), String(folder ?? ""), String(path ?? ""), typeof line === "number" ? line : null),
  onCommand: listener => {
    const relay = (_event, command, index) => listener(String(command), typeof index === "number" ? index : undefined);
    ipcRenderer.on("area:command", relay);
    return () => ipcRenderer.removeListener("area:command", relay);
  },
});
