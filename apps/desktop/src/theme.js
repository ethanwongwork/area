// Restores the saved theme before first paint, so a dark app never flashes light.
(function () {
  try {
    // ?theme= wins (electron/main.cjs --theme, for captures), then the saved choice, then the OS.
    var saved = new URLSearchParams(location.search).get("theme") || JSON.parse(localStorage.getItem("area-desktop") || "{}").theme;
    var theme = saved === "dark" || saved === "light" ? saved : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.setAttribute("data-area-theme", theme);
  } catch (error) {}
})();
