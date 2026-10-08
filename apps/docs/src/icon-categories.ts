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
    "arrow-left-right", "arrow-right-left", "arrow-up-down",
    "arrow-up-circle", "arrow-right-circle", "arrow-down-circle", "arrow-left-circle",
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
    "sync", "repeat", "shuffle",
    "download", "upload", "import", "share", "share-nodes", "open",
    "log-in", "log-out", "exit-door",
  ] },
  { slug: "marks", name: "Marks & symbols", icons: [
    "add", "minus", "plus-minus", "equal", "dismiss", "check", "check-check",
    "add-circle", "remove-circle", "prohibited",
    "square-plus", "square-minus", "square-x", "square-slash", "square-dot",
    "asterisk", "hash", "at", "percent", "sigma", "infinity",
  ] },
  { slug: "status", name: "Status & alerts", icons: [
    "info", "alert-circle", "help", "warning", "error", "octagon-alert",
    "status-available", "badge", "badge-check", "square-badge",
    "circle-dashed", "circle-dot-dashed", "circle-check-dashed",
    "loader", "loader-circle", "record",
    "bell", "bell-dot", "bell-ring", "bell-off",
  ] },
  { slug: "controls", name: "Controls", icons: [
    "menu", "more-horizontal", "more-vertical", "more-circle",
    "grip", "grip-vertical", "grip-horizontal", "dots-four",
    "settings", "options", "sliders",
    "filter", "filter-add", "filter-dismiss",
    "sort", "sort-ascending", "sort-descending",
    "checkbox", "radio-button", "toggle", "toggle-off",
  ] },
  { slug: "view", name: "View & zoom", icons: [
    "search", "search-off", "square-search",
    "zoom-in", "zoom-out", "zoom-fit",
    "expand", "collapse", "maximize", "minimize",
    "eye", "eye-off", "scan-check",
  ] },
  { slug: "layout", name: "Layout & panels", icons: [
    "app-window", "layout", "layout-dashboard",
    "panel-left", "panel-right", "panel-top", "panel-bottom",
    "panel-left-close", "panel-right-close", "panel-left-open", "panel-right-open",
    "columns", "rows", "split", "grid", "grid-plus", "blocks", "kanban", "cards", "table",
    "picture-in-picture", "stack-frame",
  ] },
  { slug: "edit", name: "Edit & clipboard", icons: [
    "copy", "copy-check", "duplicate",
    "clipboard", "clipboard-check", "clipboard-paste", "clipboard-list",
    "scissors", "save", "trash",
    "attach", "link", "link-off",
    "pushpin", "unpin", "merge", "replace",
  ] },
  { slug: "draw", name: "Draw & color", icons: [
    "pencil", "pencil-off", "pen", "compose", "signature",
    "highlighter", "eraser", "paintbrush", "paint-bucket", "eyedropper",
    "palette", "color", "contrast", "wand",
  ] },
  { slug: "type", name: "Type", icons: [
    "text", "text-size", "text-color", "heading", "heading-1", "heading-2", "heading-3",
    "bold", "italic", "underline", "strikethrough", "superscript", "subscript",
    "case-upper", "case-lower", "case-sensitive", "remove-formatting",
    "text-cursor", "square-text", "square-text-cursor",
    "line-height", "letter-spacing", "text-wrap",
    "quote", "pilcrow", "spell-check", "translate", "markdown",
  ] },
  { slug: "paragraphs", name: "Lists & paragraphs", icons: [
    "text-align-left", "text-align-center", "text-align-right", "text-align-justify",
    "indent", "outdent",
    "list", "list-bullet", "list-numbered", "list-checklist", "square-list",
    "list-plus", "list-minus", "list-tree",
    "insert-row", "insert-column",
  ] },
  { slug: "design", name: "Design tools", icons: [
    "pointer", "mouse-pointer-click", "hand", "lasso", "frame", "crop",
    "pen-tool", "spline", "line", "ruler", "stroke-weight",
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
    "layers", "square-dashed", "token",
  ] },
  { slug: "shapes", name: "Shapes", icons: [
    "shapes", "rectangle", "ellipse", "polygon", "pentagon", "hexagon", "octagon", "diamond",
    "cube", "cube-wireframe",
  ] },
  { slug: "files", name: "Files & documents", icons: [
    "document", "document-add", "document-remove", "document-check", "document-dismiss",
    "files", "file-export", "file-download", "file-search", "file-pen", "file-lock", "file-cog",
    "file-code", "file-diff", "file-image", "file-spreadsheet",
    "sticky-note", "notebook", "book", "library", "newspaper",
  ] },
  { slug: "folders", name: "Folders & storage", icons: [
    "folder", "folder-add", "folder-remove", "folder-check", "folder-open", "folder-search",
    "folder-lock", "folder-zip", "folders",
    "archive", "archive-restore", "inbox",
    "cloud", "cloud-check", "cloud-upload", "cloud-download", "cloud-alert", "cloud-off",
    "database", "server", "hard-drive",
  ] },
  { slug: "communication", name: "Chat & mail", icons: [
    "chat", "chat-add", "chat-dot", "chat-more", "chat-question", "chat-warning", "chat-code", "chat-off",
    "chat-multiple",
    "mail", "mail-plus", "mail-dot", "mail-open", "send",
    "call", "call-incoming", "call-outgoing", "call-end", "call-off", "phone-missed", "voicemail",
    "megaphone", "broadcast", "rss",
  ] },
  { slug: "people", name: "People", icons: [
    "person", "person-add", "person-remove", "person-check", "person-x",
    "person-key", "person-lock", "person-settings",
    "person-circle", "person-square", "person-chat", "people",
    "id-card", "handshake", "accessibility",
  ] },
  { slug: "reactions", name: "Reactions", icons: [
    "smile", "smile-plus", "meh", "frown", "square-smile",
    "thumbs-up", "thumbs-down",
    "heart", "heart-off", "star", "star-half", "star-off",
    "bookmark", "bookmark-add", "bookmark-remove", "bookmark-off",
    "flag", "flag-off", "tag",
  ] },
  { slug: "ai", name: "AI & agents", icons: [
    "sparkle", "sparkle-off", "chat-sparkle", "grid-sparkle",
    "agent", "bot", "bot-agent", "bot-builder", "bot-researcher", "bot-scholar", "bot-guard",
    "bot-lead", "bot-designer", "bot-generator", "bot-automator",
    "brain", "brain-off",
  ] },
  { slug: "media", name: "Media", icons: [
    "play", "pause", "stop", "play-circle", "pause-circle", "stop-circle",
    "skip-back", "skip-forward", "rewind", "fast-forward", "playlist",
    "music", "waveform", "mic", "mic-off", "volume", "volume-low", "volume-off",
    "video", "video-off", "camera", "camera-off", "film", "clapperboard", "captions",
    "image", "image-plus", "image-off", "images", "gallery",
    "screen-share", "screen-share-off", "cast", "radio", "disc",
  ] },
  { slug: "devices", name: "Devices", icons: [
    "desktop", "desktop-check", "desktop-play", "laptop", "tablet", "phone", "watch", "tv", "devices",
    "mouse", "printer", "headphones", "headset", "speaker",
    "chip", "circuit-board", "usb", "gamepad", "vr-goggles",
  ] },
  { slug: "keys", name: "Keys", icons: [
    "keyboard", "command", "option", "shift", "arrow-big-down", "arrow-big-left", "arrow-big-right",
    "caps-lock", "return", "backspace", "escape",
  ] },
  { slug: "connectivity", name: "Signal & power", icons: [
    "wifi", "wifi-off", "signal",
    "bluetooth", "bluetooth-connected", "bluetooth-off",
    "battery", "battery-low", "battery-medium", "battery-full", "battery-charging",
    "plug", "plug-off", "power", "flash", "zap-off",
  ] },
  { slug: "code", name: "Code", icons: [
    "code", "code-block", "terminal", "braces", "brackets", "function", "variable", "regex", "binary",
    "bug", "bug-off", "debug-step-over", "breakpoint",
    "git-branch", "git-commit", "git-merge", "git-fork", "git-compare",
    "git-pull-request", "git-pull-request-closed", "git-pull-request-draft",
    "webhook", "workflow", "puzzle",
  ] },
  { slug: "data", name: "Data & charts", icons: [
    "chart", "bar-chart", "chart-bar-horizontal", "pie-chart", "chart-scatter", "chart-gantt",
    "activity", "gauge", "radar", "network", "waypoints",
  ] },
  { slug: "places", name: "Places & travel", icons: [
    "home", "building", "store", "bank",
    "globe", "map", "location", "location-off", "locate", "navigation", "compass", "compass-dot",
    "route", "target", "crosshair", "goal",
    "car", "truck", "plane", "rocket", "anchor",
  ] },
  { slug: "security", name: "Security", icons: [
    "lock", "unlock", "key", "password", "fingerprint", "scan-face",
    "shield", "shield-check", "shield-plus", "shield-x", "shield-alert", "shield-lock", "shield-user", "shield-off",
    "vault",
  ] },
  { slug: "time", name: "Time & calendar", icons: [
    "clock", "clock-alert", "alarm", "timer", "timer-off", "hourglass",
    "calendar", "calendar-add", "calendar-remove", "calendar-check", "calendar-x", "calendar-clock",
  ] },
  { slug: "commerce", name: "Commerce", icons: [
    "cart", "cart-add", "shopping-bag", "basket",
    "credit-card", "wallet", "banknote", "coins", "dollar", "currency-euro", "piggy-bank",
    "receipt", "discount", "ticket", "gift", "package", "barcode", "qr-code",
  ] },
  { slug: "nature", name: "Weather & nature", icons: [
    "sun", "moon", "brightness", "cloud-sun", "cloud-rain", "cloud-lightning", "cloud-snow",
    "wind", "snowflake", "umbrella", "thermometer",
    "flame", "leaf", "tree", "mountain", "paw",
  ] },
  { slug: "science", name: "Science", icons: [
    "flask", "flask-off", "atom", "magnet", "binoculars", "lightbulb",
    "graduation-cap", "calculator", "presentation", "scale",
  ] },
  { slug: "objects", name: "Objects", icons: [
    "briefcase", "hammer", "wrench", "broom", "life-buoy", "bandage",
    "coffee", "utensils", "chef-hat", "cookie",
    "trophy", "award", "crown", "party-popper",
    "dice", "chess-rook", "toy-brick", "crystal-ball", "basketball", "dumbbell", "piano",
  ] },
];
