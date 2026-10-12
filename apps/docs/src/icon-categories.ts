/**
 * The icon browser's categories (icons.html, owner 2026-10-05: "group the icons close to their
 * similar icons"). Every Area icon appears in exactly one category; the build fails on an icon
 * missing here or a name that is not an icon (scripts/icon-browser.mjs). Within a category the
 * order is deliberate: a base drawing, then its states (add, remove, check, off), then its
 * rotations and mirrors, then the next family, so look-alikes sit side by side.
 */
export interface IconCategory {
  slug: string;
  name: string;
  icons: readonly string[];
}

export const ICON_CATEGORIES: readonly IconCategory[] = [
  { slug: "arrows", name: "Arrows", icons: [
    "arrow-up", "arrow-right", "arrow-down", "arrow-left",
    "arrow-up-right", "arrow-down-right", "arrow-down-left", "arrow-up-left",
    "arrow-left-right", "move-horizontal", "move-vertical", "arrow-right-left", "arrow-up-down",
    "arrow-up-circle", "arrow-right-circle", "arrow-down-circle", "arrow-left-circle", "arrow-up-right-circle", "arrow-down-right-circle", "arrow-down-left-circle", "arrow-up-left-circle",
    "arrow-up-from-line", "arrow-right-from-line", "arrow-down-from-line", "arrow-left-from-line",
    "arrow-up-to-line", "arrow-right-to-line", "arrow-down-to-line", "arrow-left-to-line",
    "square-arrow-up", "square-arrow-right", "square-arrow-down", "square-arrow-left",
    "square-arrow-up-right", "square-arrow-down-right", "square-arrow-down-left", "square-arrow-up-left",
    "corner-down-right", "corner-up-right", "corner-up-left",
    "trending-up", "trending-down", "move",
  ] },
  { slug: "chevrons", name: "Chevrons", icons: [
    "chevron-up", "chevron-right", "chevron-down", "chevron-left",
    "chevron-first", "chevron-last",
    "chevron-up-circle", "chevron-right-circle", "chevron-down-circle", "chevron-left-circle",
    "chevrons-up", "chevrons-right", "chevrons-down", "chevrons-left",
    "chevrons-up-down", "chevrons-down-up", "chevrons-left-right",
  ] },
  { slug: "actions", name: "Undo & transfer", icons: [
    "undo", "redo", "reply", "reply-all", "forward",
    "reset", "refresh", "rotate", "rotate-ccw", "history",
    "sync", "repeat", "repeat-once", "shuffle",
    "download", "upload", "import", "share", "share-nodes", "open",
    "log-in", "log-out", "exit-door",
  ] },
  { slug: "marks", name: "Marks & symbols", icons: [
    "add", "minus", "plus-minus", "equal", "divide", "dismiss", "check", "check-check",
    "add-circle", "remove-circle", "prohibited",
    "square-plus", "square-minus", "square-x", "square-alert", "square-slash", "square-dot",
    "asterisk", "hash", "at", "percent", "sigma", "square-root", "infinity",
  ] },
  { slug: "status", name: "Status & alerts", icons: [
    "info", "alert-circle", "help", "warning", "error", "octagon-alert",
    "status-available", "badge", "badge-check", "square-badge",
    "circle-dashed", "circle-dot-dashed", "issue", "circle-check-dashed",
    "loader", "loader-circle", "record",
    "bell", "bell-dot", "bell-ring", "bell-off", "bell-plus", "siren",
  ] },
  { slug: "controls", name: "Controls", icons: [
    "menu", "more-horizontal", "more-vertical", "more-circle",
    "grip", "grip-vertical", "grip-horizontal", "dots-four",
    "settings", "options", "sliders",
    "filter", "list-filter", "filter-add", "filter-dismiss",
    "sort", "sort-ascending", "sort-alpha", "sort-numeric", "sort-descending",
    "checkbox", "radio-button", "toggle", "toggle-off",
  ] },
  { slug: "view", name: "View & zoom", icons: [
    "search", "search-off", "search-alert", "square-search",
    "zoom-in", "zoom-out", "zoom-fit",
    "expand", "collapse", "fold-horizontal", "fold-vertical", "unfold-horizontal", "unfold-vertical", "maximize", "minimize",
    "eye", "eye-off", "eye-closed", "scan-check", "scan-qr", "scan-text",
  ] },
  { slug: "layout", name: "Layout & panels", icons: [
    "app-window", "layout", "layout-dashboard", "layout-template",
    "panel-left", "panel-right", "panel-top", "panel-bottom", "panel-bottom-open", "panel-bottom-close", "panel-top-open", "panel-top-close",
    "panel-left-close", "panel-right-close", "panel-left-open", "panel-right-open",
    "columns", "rows", "split", "grid", "grid-plus", "blocks", "kanban", "cards", "table", "table-cells-merge", "table-cells-split", "form",
    "picture-in-picture", "stack-frame", "timeline",
  ] },
  { slug: "edit", name: "Edit & clipboard", icons: [
    "copy", "copy-check", "duplicate",
    "clipboard", "clipboard-check", "clipboard-paste", "clipboard-list",
    "scissors", "save", "trash",
    "attach", "link", "link-off",
    "pushpin", "unpin", "merge", "replace", "text-select",
  ] },
  { slug: "draw", name: "Draw & color", icons: [
    "pencil", "pencil-off", "pen", "compose", "signature",
    "highlighter", "eraser", "paintbrush", "paint-roller", "paint-bucket", "eyedropper",
    "palette", "color", "contrast", "wand", "blend", "swatch-book",
  ] },
  { slug: "type", name: "Type", icons: [
    "text", "text-size", "text-color", "heading", "heading-1", "heading-2", "heading-3", "heading-4", "heading-5", "heading-6",
    "bold", "italic", "underline", "strikethrough", "superscript", "subscript",
    "case-upper", "case-lower", "case-sensitive", "remove-formatting",
    "text-cursor", "square-text", "square-text-cursor",
    "line-height", "letter-spacing", "text-wrap",
    "quote", "text-quote", "pilcrow", "pilcrow-right", "pilcrow-left", "spell-check", "translate", "markdown",
  ] },
  { slug: "paragraphs", name: "Lists & paragraphs", icons: [
    "text-align-left", "text-align-center", "text-align-right", "text-align-justify",
    "indent", "outdent",
    "list", "list-bullet", "table-of-contents", "list-numbered", "list-checklist", "square-list",
    "list-plus", "list-x", "list-minus", "list-tree", "list-collapse",
    "insert-row", "insert-column",
  ] },
  { slug: "design", name: "Design tools", icons: [
    "pointer", "mouse-pointer-click", "square-mouse-pointer", "hand", "hand-wave", "lasso", "frame", "crop",
    "pen-tool", "spline", "line", "ruler", "stroke-weight", "line-style",
    "align-left", "align-center", "align-right", "align-top", "align-middle", "align-bottom",
    "distribute-horizontal", "distribute-vertical",
    "auto-layout", "flow", "flow-vertical", "flow-wrap", "flow-free",
    "gap", "gap-vertical",
    "padding", "padding-sides", "padding-ends", "padding-side", "padding-axis", "sides",
    "corner", "corner-top-right", "corner-bottom-right", "corner-bottom-left", "corners", "corners-sparkle",
    "angle", "aspect-ratio", "flip", "flip-vertical",
    "opacity", "blur", "shadow", "mask",
    "boolean-union", "boolean-subtract", "boolean-intersect", "boolean-exclude", "subtract",
    "group", "ungroup", "bring-to-front", "send-to-back",
    "layers", "square-dashed", "token", "component", "slice",
  ] },
  { slug: "shapes", name: "Shapes", icons: [
    "shapes", "rectangle", "rectangle-vertical", "ellipse", "polygon", "pentagon", "hexagon", "octagon", "diamond",
    "cube", "cube-wireframe",
  ] },
  { slug: "files", name: "Files & documents", icons: [
    "document", "document-add", "document-remove", "document-check", "document-dismiss", "file-x", "file-upload", "file-video", "file-audio", "file-pdf", "file-question", "file-clock", "file-user", "file-zip",
    "files", "file-export", "file-download", "file-search", "file-pen", "file-lock", "file-cog",
    "file-code", "file-warning", "file-json", "file-diff", "file-image", "file-spreadsheet",
    "sticky-note", "notebook", "book", "book-add", "scroll", "library", "newspaper",
  ] },
  { slug: "folders", name: "Folders & storage", icons: [
    "folder", "folder-add", "folder-remove", "folder-check", "folder-open", "folder-search",
    "folder-lock", "folder-cog", "folder-sync", "folder-zip", "folders",
    "archive", "archive-restore", "inbox",
    "cloud", "cloud-check", "cloud-sync", "cloud-upload", "cloud-download", "cloud-alert", "cloud-off",
    "database", "database-zap", "database-search", "server", "server-cog", "hard-drive", "folder-git", "folder-code", "folder-tree", "folder-input",
  ] },
  { slug: "communication", name: "Chat & mail", icons: [
    "chat", "chat-add", "chat-dot", "chat-more", "chat-question", "chat-warning", "chat-check", "chat-code", "chat-pen", "chat-off",
    "chat-multiple", "gif", "vote",
    "mail", "mail-plus", "mail-check", "mail-warning", "mail-dot", "mail-open", "send",
    "call", "call-incoming", "call-outgoing", "call-end", "call-off", "phone-missed", "voicemail",
    "megaphone", "megaphone-off", "broadcast", "rss",
  ] },
  { slug: "people", name: "People", icons: [
    "person", "person-add", "person-remove", "person-check", "person-x",
    "person-key", "person-lock", "person-settings", "person-search", "person-pen", "person-star",
    "person-circle", "person-dashed", "person-square", "person-chat", "people", "people-group",
    "id-card", "handshake", "accessibility",
  ] },
  { slug: "reactions", name: "Reactions", icons: [
    "smile", "smile-plus", "meh", "frown", "square-smile",
    "thumbs-up", "thumbs-down",
    "heart", "heart-off", "star", "star-half", "star-off",
    "bookmark", "bookmark-add", "bookmark-remove", "bookmark-off", "bookmark-check",
    "flag", "flag-off", "tag", "tags", "tag-plus",
  ] },
  { slug: "ai", name: "AI & agents", icons: [
    "sparkle", "sparkle-off", "chat-sparkle", "grid-sparkle", "image-sparkle", "pencil-sparkle", "text-sparkle", "code-sparkle",
    "agent", "bot", "bot-agent", "bot-builder", "bot-researcher", "bot-scholar", "bot-guard",
    "bot-lead", "bot-designer", "bot-generator", "bot-automator",
    "brain", "brain-circuit", "brain-off",
  ] },
  { slug: "media", name: "Media", icons: [
    "play", "pause", "stop", "play-circle", "pause-circle", "stop-circle",
    "skip-back", "skip-forward", "eject", "rewind", "fast-forward", "playlist",
    "music", "waveform", "mic", "mic-off", "volume", "volume-low", "volume-off",
    "video", "video-off", "camera", "camera-off", "switch-camera", "webcam", "film", "clapperboard", "captions", "captions-off",
    "image", "image-plus", "image-off", "images", "gallery",
    "screen-share", "screen-share-off", "cast", "radio", "disc",
  ] },
  { slug: "devices", name: "Devices", icons: [
    "desktop", "monitor-off", "desktop-check", "monitor-cog", "desktop-play", "laptop", "tablet", "phone", "vibrate", "sim-card", "watch", "tv", "devices",
    "mouse", "printer", "headphones", "headphones-off", "headset", "speaker",
    "chip", "circuit-board", "usb", "gamepad", "vr-goggles", "memory",
  ] },
  { slug: "keys", name: "Keys", icons: [
    "keyboard", "keyboard-off", "command", "option", "space", "shift", "arrow-big-down", "arrow-big-left", "arrow-big-right",
    "caps-lock", "return", "backspace", "escape",
  ] },
  { slug: "connectivity", name: "Signal & power", icons: [
    "wifi", "wifi-off", "wifi-low", "signal", "signal-low", "signal-medium",
    "bluetooth", "bluetooth-connected", "bluetooth-off",
    "battery", "battery-low", "battery-medium", "battery-full", "battery-charging",
    "plug", "plug-off", "power", "power-off", "flash", "zap-off", "api",
  ] },
  { slug: "code", name: "Code", icons: [
    "code", "code-block", "terminal", "braces", "brackets", "function", "variable", "regex", "binary",
    "bug", "bug-off", "debug-step-over", "breakpoint",
    "git-branch", "git-branch-plus", "git-graph", "git-commit", "git-merge", "git-fork", "git-compare",
    "git-pull-request", "git-pull-request-create", "git-pull-request-closed", "git-pull-request-draft",
    "webhook", "workflow", "puzzle", "whole-word", "text-search", "diff", "repository", "logs", "pipeline", "container",
  ] },
  { slug: "data", name: "Data & charts", icons: [
    "chart", "bar-chart", "chart-bar-horizontal", "pie-chart", "chart-area", "chart-scatter", "chart-gantt",
    "activity", "gauge", "radar", "network", "waypoints",
  ] },
  { slug: "places", name: "Places & travel", icons: [
    "home", "building", "store", "bank",
    "globe", "globe-off", "map", "location", "location-off", "location-add", "locate", "navigation", "compass", "compass-dot",
    "route", "target", "crosshair", "goal",
    "car", "truck", "plane", "rocket", "anchor", "milestone",
  ] },
  { slug: "security", name: "Security", icons: [
    "lock", "unlock", "key", "password", "fingerprint", "scan-face",
    "shield", "shield-check", "shield-cog", "incognito", "shield-plus", "shield-x", "shield-alert", "shield-lock", "shield-user", "shield-off",
    "vault",
  ] },
  { slug: "time", name: "Time & calendar", icons: [
    "clock", "clock-alert", "clock-check", "alarm", "alarm-off", "timer", "timer-off", "hourglass",
    "calendar", "calendar-add", "calendar-remove", "calendar-check", "calendar-x", "calendar-clock", "calendar-off", "calendar-search", "calendar-sync", "calendar-range",
  ] },
  { slug: "commerce", name: "Commerce", icons: [
    "cart", "cart-add", "shopping-bag", "basket",
    "credit-card", "wallet", "banknote", "coins", "hand-coins", "dollar", "circle-dollar", "currency-euro", "piggy-bank",
    "receipt", "discount", "gem", "ticket", "gift", "gift-card", "package", "package-check", "barcode", "qr-code",
  ] },
  { slug: "nature", name: "Weather & nature", icons: [
    "sun", "moon", "sun-moon", "brightness", "cloud-sun", "cloud-rain", "cloud-lightning", "cloud-snow",
    "wind", "snowflake", "umbrella", "thermometer",
    "flame", "leaf", "tree", "mountain", "paw",
  ] },
  { slug: "science", name: "Science", icons: [
    "flask", "flask-off", "atom", "magnet", "binoculars", "lightbulb", "lightbulb-off",
    "graduation-cap", "calculator", "presentation", "scale", "telescope",
  ] },
  { slug: "objects", name: "Objects", icons: [
    "briefcase", "hammer", "gavel", "wrench", "broom", "life-buoy", "bandage",
    "coffee", "utensils", "chef-hat", "cookie",
    "trophy", "award", "crown", "party-popper",
    "dice", "chess-rook", "toy-brick", "crystal-ball", "basketball", "dumbbell", "piano", "toolbox", "stamp", "copyright",
  ] },
];
