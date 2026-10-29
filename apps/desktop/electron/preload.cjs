// The page's only bridge to Electron: the platform (for the Titlebar inset), the theme and its page ground, showing a Brand
// file in Finder, and the app menu's tab commands.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("areaDesktop", {
  platform: process.platform,
  setTheme: theme => ipcRenderer.send("area:theme", theme === "dark" ? "dark" : "light"),
  setGround: color => ipcRenderer.send("area:ground", String(color)),
  setTitlebar: height => ipcRenderer.send("area:titlebar", Number(height)),
  revealBrand: path => ipcRenderer.send("area:brand-reveal", String(path)),
  onCommand: listener => {
    const relay = (_event, command, index) => listener(String(command), typeof index === "number" ? index : undefined);
    ipcRenderer.on("area:command", relay);
    return () => ipcRenderer.removeListener("area:command", relay);
  },
});
