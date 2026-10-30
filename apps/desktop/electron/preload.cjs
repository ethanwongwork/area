// The page's only bridge to Electron: the platform (for the Titlebar inset), the theme and its page ground, showing a Brand
// file in Finder, the app menu's tab commands, and the workspace's systems and projects (read once, written on change, moved to the Trash).
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
  onCommand: listener => {
    const relay = (_event, command, index) => listener(String(command), typeof index === "number" ? index : undefined);
    ipcRenderer.on("area:command", relay);
    return () => ipcRenderer.removeListener("area:command", relay);
  },
});
