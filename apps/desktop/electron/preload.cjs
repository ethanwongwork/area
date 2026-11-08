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
    onEvent: listener => {
      const relay = (_event, chat, message) => listener(String(chat), message);
      ipcRenderer.on("area:agent-event", relay);
      return () => ipcRenderer.removeListener("area:agent-event", relay);
    },
  },
  onCommand: listener => {
    const relay = (_event, command, index) => listener(String(command), typeof index === "number" ? index : undefined);
    ipcRenderer.on("area:command", relay);
    return () => ipcRenderer.removeListener("area:command", relay);
  },
});
