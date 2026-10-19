// The page's only bridge to Electron: the platform (for the Titlebar inset), the theme, and showing a Brand file in Finder.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("areaDesktop", {
  platform: process.platform,
  setTheme: theme => ipcRenderer.send("area:theme", theme === "dark" ? "dark" : "light"),
  revealBrand: path => ipcRenderer.send("area:brand-reveal", String(path)),
});
