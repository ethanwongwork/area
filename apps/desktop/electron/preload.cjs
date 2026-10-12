// The page's only bridge to Electron: the platform (for the Titlebar inset) and the theme.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("areaDesktop", {
  platform: process.platform,
  setTheme: theme => ipcRenderer.send("area:theme", theme === "dark" ? "dark" : "light"),
});
