import { cloneElement, type CSSProperties, type ReactElement, type ReactNode } from "react";
import { Badge, Button, Nav, NavItem } from "@area/react";
import { PILOT_BATCHES, PILOT_ICONS } from "../pilot-icons.tsx";
import { EXPLORE } from "../pilot-explore.tsx";

/* The Iconography sheets compare base drawings; rotations appear on the per-icon review page. */
const BASE_ICONS = PILOT_ICONS.filter(icon => !icon.derivedFrom);
import { FluentCutAlignLeftIcon as AlignLeftIcon, FluentCutBellIcon as BellIcon, FluentCutCheckIcon as CheckIcon, FluentCutChevronIcon as ChevronIcon, FluentCutDismissIcon as DismissIcon, FluentCutInfoIcon as InfoIcon, FluentCutMoreIcon as MoreIcon, FluentCutPlusIcon as PlusIcon, PresenceAvailableIcon, FluentCutSearchIcon as SearchIcon, FluentCutSettingsIcon as SettingsIcon, FluentEyeIcon, FluentAlignLeftFilledIcon, FluentBellFilledIcon, FluentCheckCircleFilledIcon, FluentEyeFilledIcon, FluentInfoFilledIcon, FluentSettingsFilledIcon, FluentCutAlertIcon as AlertIcon, FluentCutArrowUpIcon as ArrowUpIcon, FluentCutArrowIcon as ArrowIcon, FluentCutLinkIcon as LinkIcon, FluentCutOpenIcon as OpenIcon, FluentCutPersonSmallIcon as PersonSmallIcon, FluentResetIcon, FluentChevronLeftIcon, FluentChevronRightIcon, FluentChevronUpIcon, FluentArrowLeftIcon, FluentArrowDownIcon, FluentAlignRightIcon, FluentAlignCenterIcon, FluentCutAlignTopIcon as AlignTopIcon, FluentCutAlignMiddleIcon as AlignMiddleIcon, FluentCutAlignBottomIcon as AlignBottomIcon, FluentExpandIcon, FluentExpandFilledIcon, FluentPanelLeftIcon, FluentPanelLeftFilledIcon, FluentPanelRightIcon, FluentPanelRightFilledIcon, FluentBookIcon, FluentBookFilledIcon, FluentOptionsIcon, FluentOptionsFilledIcon, FluentColorIcon, FluentColorFilledIcon, FluentTextIcon, FluentTextFilledIcon, FluentShapesIcon, FluentShapesFilledIcon, FluentListIcon, FluentListFilledIcon, FluentSquareDashedIcon, FluentSquareDashedFilledIcon, FluentLayersIcon, FluentLayersFilledIcon, FluentFlashIcon, FluentFlashFilledIcon, FluentCutDocumentIcon as DocumentIcon, FluentCutFolderIcon as FolderIcon, FluentCutTrashIcon as TrashIcon, FluentCopyIcon, FluentCopyFilledIcon, FluentDocumentFilledIcon, FluentFolderFilledIcon, FluentTrashFilledIcon, FluentWarningFilledIcon } from "../icons.tsx";
import * as FluentRefs from "../icons.tsx";

/* Icon pilot (docs/specs/icons.md): each icon beside a 14/20 regular label, the UI text it
   pairs with. One tile per stroke weight, plus the Fluent icons Area uses today. */

const LABELS: Record<string, string> = {
  "add": "Add", "align-left": "Align left", "bell": "Notifications", "check": "Check",
  "chevron-down": "Expand", "dismiss": "Close", "eye": "Show", "info": "Info",
  "more-horizontal": "More", "search": "Search", "settings": "Settings", "status-available": "Available",
  "arrow-up": "Send", "arrow-right": "Next", "arrow-down": "Down", "arrow-left": "Back", "chevron-left": "Previous", "chevron-right": "Open", "chevron-up": "Collapse", "link": "Link", "open": "Open in new tab", "person": "Profile", "reset": "Reset", "align-right": "Align right", "align-center": "Align center", "align-top": "Align top", "align-middle": "Align middle", "align-bottom": "Align bottom", "lock": "Lock", "star": "Favorite", "heart": "Like", "calendar": "Date", "clock": "Time", "pencil": "Edit", "download": "Download", "upload": "Upload", "filter": "Filter", "sort": "Sort", "sparkle": "Ask AI", "location": "Location", "minus": "Remove", "send": "Send message", "refresh": "Refresh", "home": "Home", "mail": "Mail", "chat": "Comment", "image": "Image", "mic": "Dictate", "help": "Help", "bookmark": "Save", "menu": "Menu", "grid": "Apps", "more-vertical": "More", "play": "Play", "pause": "Pause", "undo": "Undo", "redo": "Redo", "sun": "Light", "moon": "Dark", "desktop": "System", "code": "Code", "terminal": "Terminal", "error": "Error", "unlock": "Unlock", "share": "Share", "globe": "Language", "attach": "Attach", "tag": "Tag", "people": "Team", "zoom-in": "Zoom in", "zoom-out": "Zoom out", "flag": "Flag", "archive": "Archive", "cloud": "Cloud", "phone": "Mobile", "camera": "Camera", "cart": "Cart", "bold": "Bold", "italic": "Italic", "underline": "Underline", "quote": "Quote", "hash": "Channel", "at": "Mention", "key": "Key", "shield": "Security", "gift": "Gift", "map": "Map", "chart": "Chart", "table": "Table", "strikethrough": "Strikethrough", "heading": "Heading", "list-bullet": "Bulleted list", "wifi": "Wi-Fi", "bluetooth": "Bluetooth", "battery": "Battery", "plug": "Plug", "power": "Power", "printer": "Print", "headphones": "Audio", "video": "Video", "inbox": "Inbox", "thumbs-up": "Like", "thumbs-down": "Dislike", "smile": "Emoji", "briefcase": "Work", "building": "Company", "compass": "Explore", "crop": "Crop", "trophy": "Achievements", "coffee": "Break", "database": "Database", "server": "Server", "scissors": "Cut", "log-in": "Sign in", "log-out": "Sign out", "keyboard": "Shortcuts", "pointer": "Select", "move": "Move", "hourglass": "Pending", "loader": "Loading", "volume": "Sound", "volume-off": "Mute", "music": "Music", "film": "Film", "credit-card": "Payment", "wallet": "Wallet", "receipt": "Receipt", "lightbulb": "Tip", "megaphone": "Announce", "person-add": "Invite", "history": "History", "save": "Save file", "bug": "Report a bug", "eyedropper": "Pick color", "paintbrush": "Style", "puzzle": "Integrations", "ruler": "Measure", "bell-off": "Mute notifications", "mic-off": "Mute microphone", "video-off": "Camera off", "calculator": "Calculate", "graduation-cap": "Learn", "car": "Travel", "package": "Package", "wifi-off": "Offline", "link-off": "Unlink", "cloud-upload": "Upload to cloud", "command": "Command", "return": "Enter", "backspace": "Backspace", "rocket": "Launch", "skip-forward": "Next track", "skip-back": "Previous track", "stop": "Stop", "repeat": "Repeat", "person-remove": "Remove member", "clipboard": "Paste", "sticky-note": "Note", "trending-up": "Trending", "shopping-bag": "Shop", "cloud-download": "Download from cloud", "calendar-add": "New event", "folder-add": "New folder", "document-add": "New document", "shuffle": "Shuffle", "fingerprint": "Biometrics", "gauge": "Performance", "chat-add": "New message", "cloud-off": "Offline", "folder-open": "Open folder", "mail-open": "Read", "timer": "Timer", "laptop": "Laptop", "tablet": "Tablet", "tv": "TV", "watch": "Watch", "mouse": "Mouse", "speaker": "Speaker", "hard-drive": "Storage", "chip": "Processor", "calendar-check": "Scheduled", "document-check": "Approved", "person-check": "Verified", "shield-check": "Protected", "bar-chart": "Analytics", "pie-chart": "Breakdown", "add-circle": "Add", "remove-circle": "Remove", "prohibited": "Blocked", "chevrons-up-down": "Select", "collapse": "Collapse", "alarm": "Alarm", "git-branch": "Branch", "grip-vertical": "Drag", "activity": "Activity", "layout": "Layout", "percent": "Percent", "call": "Call", "reply": "Reply", "sync": "Sync", "eraser": "Erase", "text-align-left": "Align text left", "text-align-center": "Center text", "indent": "Indent", "outdent": "Outdent", "columns": "Columns", "calendar-remove": "Remove event", "folder-remove": "Remove folder", "document-remove": "Remove document", "list-numbered": "Numbered list", "sort-ascending": "Sort ascending", "sort-descending": "Sort descending", "filter-dismiss": "Clear filters", "bookmark-add": "Add bookmark", "reply-all": "Reply all", "text-cursor": "Text cursor", "zoom-fit": "Zoom to fit", "paint-bucket": "Fill", "panel-bottom": "Bottom panel", "panel-left-close": "Collapse sidebar", "panel-right-close": "Collapse inspector", "panel-left-open": "Expand sidebar", "panel-right-open": "Expand inspector", "checkbox": "Done", "list-checklist": "Checklist", "bookmark-remove": "Remove bookmark", "filter-add": "Add filter", "pushpin": "Pin", "palette": "Palette", "panel-top": "Top panel", "arrow-up-circle": "Submit", "stop-circle": "Stop generating", "compose": "New chat", "waveform": "Voice", "bot": "Assistant", "frame": "Frame", "pen-tool": "Pen", "hand": "Hand tool", "spline": "Path", "unpin": "Unpin", "truck": "Shipping", "store": "Store", "ticket": "Ticket", "kanban": "Board", "highlighter": "Highlight", "flame": "Trending", "leaf": "Eco", "umbrella": "Insurance", "snowflake": "Freeze", "thermometer": "Temperature", "mountain": "Landscape", "anchor": "Anchor", "magnet": "Snap", "translate": "Translate", "letter-spacing": "Letter spacing", "line-height": "Line height", "blur": "Blur", "shadow": "Drop shadow", "escape": "Escape", "paw": "Pets", "plane": "Travel", "git-pull-request": "Pull request", "file-code": "Code file", "file-image": "Image file", "newspaper": "News", "id-card": "Profile card", "stroke-weight": "Stroke weight", "option": "Option", "shift": "Shift", "subscript": "Subscript", "superscript": "Superscript", "text-size": "Text size", "tree": "Nature", "flask": "Labs", "contrast": "Contrast", "call-end": "End call", "chat-multiple": "Conversations", "person-circle": "Account", "frown": "Dislike", "crown": "Premium", "award": "Award", "barcode": "Barcode", "bank": "Bank", "banknote": "Cash", "code-block": "Code block", "library": "Library", "camera-off": "Camera off", "captions": "Captions", "images": "Gallery", "picture-in-picture": "Picture in picture", "screen-share": "Share screen", "fast-forward": "Fast forward", "sigma": "Sum", "function": "Function", "variable": "Variable", "braces": "Braces", "git-merge": "Merge", "git-commit": "Commit", "boolean-exclude": "Exclude", "boolean-intersect": "Intersect", "boolean-subtract": "Subtract", "boolean-union": "Union", "mask": "Mask", "diamond": "Instance", "polygon": "Polygon", "line": "Line", "record": "Record", "distribute-horizontal": "Distribute", "wand": "Magic", "cloud-sun": "Partly cloudy", "arrow-up-right": "Open link", "cloud-rain": "Rain", "cloud-lightning": "Storm", "wind": "Wind", "star-off": "Unfavorite", "qr-code": "QR code", "rectangle": "Rectangle", "ellipse": "Ellipse", "coins": "Credits", "angle": "Angle", "aspect-ratio": "Ratio", "auto-layout": "Auto layout", "corner": "Radius", "corner-top-right": "Top right", "corner-bottom-left": "Bottom left", "corner-bottom-right": "Bottom right", "corners": "Corners", "dots-four": "Components", "eye-off": "Hide", "flip": "Flip", "flip-vertical": "Flip vertical", "flow": "Horizontal", "flow-vertical": "Vertical", "flow-wrap": "Wrap", "flow-free": "Freeform", "gap": "Gap", "gap-vertical": "Row gap", "opacity": "Opacity", "padding": "Padding", "padding-sides": "Side padding", "padding-ends": "End padding", "token": "Token", "sliders": "Adjust", "rotate": "Rotate", "expand": "Expand", "panel-left": "Sidebar", "panel-right": "Inspector", "book": "Docs", "options": "Options", "color": "Color", "text": "Text", "shapes": "Shapes", "list": "List", "square-dashed": "Placeholder", "layers": "Layers", "flash": "Motion", "copy": "Copy", "document": "Document", "folder": "Folder", "trash": "Delete", "warning": "Warning",
  "square-dot": "Square dot", "square-slash": "None", "square-plus": "Add item", "square-minus": "Remove item", "square-arrow-up": "Square arrow", "square-arrow-up-right": "Go to", "square-text": "Text block", "square-text-cursor": "Input field", "square-list": "List block", "square-search": "Find in page",
  "chevron-down-circle": "Expand section", "play-circle": "Play video", "pause-circle": "Pause", "circle-dashed": "Not started", "circle-dot-dashed": "In progress", "circle-check-dashed": "In review",
  "bell-dot": "Unread notifications", "chat-dot": "Unread message", "mail-dot": "Unread mail", "square-badge": "App with news", "compass-dot": "New to explore",
  "folder-check": "Synced folder", "scan-check": "Scan complete", "desktop-check": "Deployed", "desktop-play": "Present", "search-off": "No results", "flask-off": "Experiments off",
  "agent": "Agent", "chat-sparkle": "Ask AI", "grid-sparkle": "AI apps", "grid-plus": "Add widget", "corners-sparkle": "Smart select",
  "arrow-left-right": "Resize", "arrow-right-left": "Swap", "arrow-right-to-line": "Move to end", "caps-lock": "Caps lock", "chevrons-right": "Skip ahead", "chevrons-down-up": "Collapse all",
  "files": "Several files", "file-export": "Export", "clipboard-list": "Tasks",
  "hexagon": "Hexagon", "cube": "3D object", "asterisk": "Required", "plus-minus": "Tolerance", "brackets": "Array", "split": "Fork", "git-pull-request-closed": "Closed pull request", "git-pull-request-draft": "Draft pull request",
  "dollar": "Price", "chart-scatter": "Correlation", "layout-dashboard": "Dashboard", "network": "Sitemap",
  "chat-more": "Typing", "chat-code": "Code comment",
  "target": "Goal", "crosshair": "Pick element", "disc": "Album", "infinity": "Unlimited",
  "check-check": "Read", "presentation": "Present", "blocks": "Extensions", "badge-check": "Verified", "cookie": "Cookies", "clapperboard": "Video", "route": "Route", "vault": "Vault",
  "bug-off": "Bugs off", "file-lock": "Private file", "folders": "Collections", "chat-warning": "Failed message", "call-incoming": "Incoming call", "call-outgoing": "Outgoing call", "app-window": "App window", "gallery": "Gallery", "markdown": "Markdown", "case-upper": "Uppercase", "case-sensitive": "Match case", "wrench": "Tools", "bandage": "Fix", "atom": "Science",
  "brain": "Reasoning", "brain-off": "Reasoning off", "waypoints": "Connections", "smile-plus": "Add reaction", "person-chat": "Contact support", "binoculars": "Explore",
  "dumbbell": "Fitness", "piano": "Music", "toy-brick": "Components", "square-smile": "Sticker", "crystal-ball": "Predictions", "utensils": "Food", "basketball": "Sports",
  "chef-hat": "Recipes", "chess-rook": "Strategy", "vr-goggles": "Immersive", "circuit-board": "Hardware", "cube-wireframe": "3D wireframe", "debug-step-over": "Step over", "breakpoint": "Breakpoint", "stack-frame": "Stack frame",
  "bot-agent": "Agent", "bot-builder": "Builder", "bot-researcher": "Researcher", "bot-scholar": "Scholar", "bot-guard": "Guard", "bot-lead": "Lead", "bot-designer": "Designer", "bot-generator": "Generator", "bot-automator": "Automator",
  "corner-down-right": "Sub-item", "chevron-last": "Last page", "navigation": "Location", "mouse-pointer-click": "Click", "import": "Import", "signature": "Sign", "text-color": "Text colour", "bring-to-front": "Bring forward", "group": "Group", "remove-formatting": "Clear format", "clipboard-check": "Copied", "clipboard-paste": "Paste", "list-plus": "Add to list", "list-tree": "Outline", "workflow": "Workflow", "cloud-check": "Synced", "archive-restore": "Restore", "headset": "Support", "person-settings": "Account settings", "bell-ring": "Ringing", "life-buoy": "Help centre", "square-x": "Close box", "more-circle": "More options", "radio-button": "Radio option", "star-half": "Half rating", "shield-alert": "Security warning", "image-plus": "Add image", "cart-add": "Add to cart", "calendar-clock": "Scheduled", "octagon-alert": "Critical alert", "toggle": "Switch on", "accessibility": "Accessibility", "discount": "Discount", "currency-euro": "Euro price", "cards": "Stack",
  "exit-door": "Exit door", "locate": "Locate me", "lasso": "Lasso select", "pilcrow": "Paragraph mark", "insert-row": "Insert row", "spell-check": "Spell check", "text-wrap": "Text wrap", "file-search": "Search files", "file-spreadsheet": "Spreadsheet file", "rss": "RSS feed", "file-pen": "Edit file", "folder-lock": "Locked folder", "chart-gantt": "Gantt chart", "webhook": "Webhook", "voicemail": "Voicemail", "phone-missed": "Missed call", "broadcast": "Live broadcast", "cast": "Cast to screen", "image-off": "Image off", "radio": "Radio", "battery-charging": "Battery charging", "battery-low": "Battery low", "brightness": "Brightness", "devices": "Devices", "gamepad": "Game controller", "signal": "Signal strength", "usb": "USB drive", "scan-face": "Face scan", "shield-off": "Protection off", "badge": "Badge", "handshake": "Agreement", "meh": "Neutral face", "basket": "Shopping basket", "piggy-bank": "Savings", "scale": "Balance scale", "cloud-snow": "Snow", "dice": "Random", "hammer": "Build", "notebook": "Notebook", "party-popper": "Celebration", "pentagon": "Pentagon", "octagon": "Octagon",
  "folder-zip": "Zip archive",
  "file-diff": "File diff", "chat-question": "Ask", "plug-off": "Plug off", "binary": "Binary", "goal": "Goal", "radar": "Radar", "broom": "Broom",
  "pencil-off": "Edit off", "zap-off": "Flash off", "location-off": "Location off", "chat-off": "Chat off", "screen-share-off": "Stop sharing", "bookmark-off": "Bookmark off", "heart-off": "Heart off", "flag-off": "Flag off", "bluetooth-off": "Bluetooth off", "cloud-alert": "Cloud alert", "clock-alert": "Clock alert", "shield-user": "Shield user", "shield-x": "Shield dismiss", "shield-plus": "Shield add", "mail-plus": "Mail add", "person-x": "Person remove", "person-key": "Person key", "file-cog": "Document settings", "file-download": "Document download", "password": "Masked password", "volume-low": "Volume low", "merge": "Merge paths", "duplicate": "Duplicate", "toggle-off": "Toggle off", "share-nodes": "Share nodes", "git-fork": "Git fork", "git-compare": "Git compare", "bluetooth-connected": "Bluetooth connected", "playlist": "Playlist", "chart-bar-horizontal": "Horizontal bar chart", "equal": "Equal", "person-square": "Person in square",
  "pen": "Pen",
  "copy-check": "Copied", "document-dismiss": "Remove file", "calendar-x": "Cancel event", "folder-search": "Search folder", "timer-off": "Timer off", "call-off": "Call off", "sparkle-off": "AI off", "person-lock": "Restricted member", "shield-lock": "Privacy", "battery-full": "Battery full", "battery-medium": "Battery medium", "minimize": "Exit full screen", "loader-circle": "Loading", "text-align-justify": "Justify text", "list-minus": "Remove from list", "case-lower": "Lowercase", "regex": "Use regular expression", "replace": "Replace", "heading-1": "Heading 1", "heading-2": "Heading 2", "heading-3": "Heading 3", "send-to-back": "Send backward", "ungroup": "Ungroup", "arrow-up-from-line": "Up from line",
  "maximize": "Maximize",
  "whole-word": "Match whole word", "text-search": "Search in files", "list-filter": "Filter list", "git-graph": "Commit graph", "git-branch-plus": "New branch", "git-pull-request-create": "Create pull request", "diff": "Diff", "repository": "Repository", "issue": "Issue", "folder-git": "Repository folder", "folder-code": "Code folder", "folder-tree": "File tree", "folder-input": "Move to folder", "file-json": "JSON file", "file-warning": "File problem", "logs": "Logs", "pipeline": "Pipeline", "container": "Container", "server-cog": "Server settings", "database-search": "Database search", "database-zap": "Database cache", "cloud-sync": "Cloud sync", "api": "API", "memory": "Memory", "brain-circuit": "AI model", "toolbox": "Toolbox", "telescope": "Telescope", "scan-text": "Scan text", "siren": "Siren", "square-mouse-pointer": "Select element", "text-select": "Select text", "table-of-contents": "Table of contents", "layout-template": "Template", "timeline": "Timeline", "milestone": "Milestone", "monitor-cog": "Display settings", "stamp": "Stamp", "component": "Component", "slice": "Slice", "blend": "Blend mode", "swatch-book": "Swatches", "line-style": "Stroke style",
  "file-x": "Invalid file", "file-clock": "Recent file", "file-question": "Unknown file type", "file-user": "My file", "file-zip": "Zip file", "folder-cog": "Folder settings", "folder-sync": "Synced folder", "form": "Form", "table-cells-merge": "Merge cells", "table-cells-split": "Split cell", "person-search": "Find people", "person-pen": "Edit profile", "person-star": "Favourite contact", "shield-cog": "Security settings", "eye-closed": "Password hidden", "mail-check": "Email verified", "mail-warning": "Delivery failed", "hand-wave": "Wave", "gif": "GIF", "calendar-off": "Unavailable", "calendar-search": "Find a date", "calendar-sync": "Calendar synced", "alarm-off": "Alarm off", "clock-check": "On time", "search-alert": "Search error", "scan-qr": "Scan QR code", "webcam": "Webcam", "wifi-low": "Weak connection", "globe-off": "Offline", "book-add": "Add book", "scroll": "Scroll", "gavel": "Gavel", "tags": "Tags", "vote": "Vote", "text-quote": "Quote block", "copyright": "Copyright", "divide": "Divide", "location-add": "Add location", "arrow-up-right-circle": "Arrow up right circle",
  "repeat-once": "Repeat once", "switch-camera": "Switch camera", "eject": "Eject", "headphones-off": "Headphones off", "captions-off": "Captions off", "vibrate": "Vibrate", "sim-card": "SIM card", "monitor-off": "Monitor off", "megaphone-off": "Megaphone off", "lightbulb-off": "Lightbulb off", "keyboard-off": "Keyboard off", "power-off": "Power off", "bell-plus": "Add reminder", "calendar-range": "Date range", "bookmark-check": "Saved", "tag-plus": "Add tag", "paint-roller": "Format painter", "square-root": "Equation", "list-collapse": "Toggle list", "file-video": "Video file", "file-audio": "Audio file", "file-upload": "Upload file", "chart-area": "Area chart", "gift-card": "Gift card",
  "gem": "Premium", "file-pdf": "PDF", "hand-coins": "Tip", "package-check": "Delivered", "sort-alpha": "Sort A to Z", "sort-numeric": "Sort 0 to 9", "incognito": "Private mode",
  "move-horizontal": "Move horizontal", "fold-horizontal": "Fold horizontal", "unfold-horizontal": "Unfold horizontal", "space": "Space", "chat-check": "Resolve thread", "list-x": "Clear list", "signal-low": "Low priority", "signal-medium": "Medium priority", "square-alert": "Urgent",
  "panel-bottom-open": "Open bottom panel", "panel-bottom-close": "Close bottom panel",
};

const row: CSSProperties = { display: "flex", alignItems: "center", gap: "var(--area-space-8)" };

/* Fluent references for batches 5–10, generated as FluentRef<Name>Icon and
   FluentRef<Name>FilledIcon by scripts/gen-icons.mjs. */
const REF_NAMES = ["lock", "star", "heart", "calendar", "clock", "pencil", "download", "upload", "filter", "sort", "sparkle", "location", "minus", "send", "refresh", "home", "mail", "chat", "image", "mic", "help", "bookmark", "menu", "grid", "more-vertical", "play", "pause", "undo", "redo", "sun", "moon", "desktop", "code", "terminal", "error", "unlock", "share", "globe", "attach", "tag", "people", "zoom-in", "zoom-out", "flag", "archive", "cloud", "phone", "camera", "cart", "bold", "italic", "underline", "quote", "hash", "at", "key", "shield", "gift", "map", "chart", "table", "strikethrough", "heading", "list-bullet", "wifi", "bluetooth", "battery", "plug", "power", "printer", "headphones", "video", "inbox", "thumbs-up", "smile", "briefcase", "building", "compass", "crop", "trophy", "coffee", "database", "server", "scissors", "log-in", "log-out", "keyboard", "pointer", "move", "hourglass", "loader", "volume", "volume-off", "music", "film", "credit-card", "wallet", "receipt", "lightbulb", "megaphone", "person-add", "history", "save", "bug", "eyedropper", "paintbrush", "puzzle", "ruler", "bell-off", "mic-off", "video-off", "calculator", "graduation-cap", "car", "package", "wifi-off", "link-off", "cloud-upload", "command", "return", "backspace", "rocket", "skip-forward", "skip-back", "stop", "repeat", "person-remove", "clipboard", "sticky-note", "trending-up", "shopping-bag", "cloud-download", "calendar-add", "folder-add", "document-add", "shuffle", "fingerprint", "gauge", "chat-add", "cloud-off", "folder-open", "mail-open", "timer", "laptop", "tablet", "tv", "watch", "speaker", "hard-drive", "chip", "calendar-check", "document-check", "person-check", "shield-check", "bar-chart", "pie-chart", "add-circle", "remove-circle", "prohibited", "chevrons-up-down", "collapse", "alarm", "git-branch", "grip-vertical", "activity", "layout", "call", "reply", "sync", "eraser", "text-align-left", "text-align-center", "indent", "outdent", "columns", "folder-remove", "document-remove", "list-numbered", "sort-ascending", "filter-dismiss", "bookmark-add", "reply-all", "zoom-fit", "paint-bucket", "panel-bottom", "panel-left-close", "panel-left-open", "checkbox", "list-checklist", "filter-add", "pushpin", "palette", "arrow-up-circle", "stop-circle", "compose", "bot", "frame", "hand", "unpin", "truck", "store", "ticket", "kanban", "highlighter", "flame", "leaf", "umbrella", "snowflake", "thermometer", "cloud-rain", "cloud-lightning", "wind", "star-off", "qr-code", "rectangle", "ellipse", "arrow-up-right", "cloud-sun", "wand", "record", "polygon", "diamond", "boolean-union", "boolean-subtract", "boolean-intersect", "boolean-exclude", "braces", "variable", "fast-forward", "screen-share", "picture-in-picture", "images", "captions", "camera-off", "library", "code-block", "banknote", "bank", "award", "crown", "frown", "person-circle", "chat-multiple", "call-end", "contrast", "flask", "tree", "text-size", "superscript", "subscript", "shift", "stroke-weight", "id-card", "newspaper", "file-image", "file-code", "git-pull-request", "plane", "paw", "shadow", "blur", "line-height", "translate", "square-plus", "square-minus", "square-arrow-up", "square-arrow-up-right", "square-text", "square-text-cursor", "square-list", "chevron-down-circle", "play-circle", "pause-circle", "circle-dashed", "circle-check-dashed", "bell-dot", "mail-dot", "desktop-check", "flask-off", "chat-sparkle", "arrow-left-right", "arrow-right-left", "arrow-right-to-line", "chevrons-right", "files", "file-export", "clipboard-list", "hexagon", "cube", "asterisk", "plus-minus", "split", "git-pull-request-closed", "git-pull-request-draft", "dollar", "chart-scatter", "layout-dashboard", "network", "target", "disc", "presentation", "blocks", "badge-check", "cookie", "clapperboard", "vault", "bug-off", "file-lock", "folders", "chat-warning", "call-incoming", "call-outgoing", "app-window", "case-upper", "case-sensitive", "wrench", "brain", "brain-off", "smile-plus", "person-chat", "dumbbell", "utensils", "basketball", "chess-rook", "vr-goggles", "cube-wireframe", "bot-agent", "bot-builder", "bot-researcher", "bot-scholar", "bot-guard", "bot-lead", "bot-designer", "bot-generator", "bot-automator", "corner-down-right", "chevron-last", "navigation", "mouse-pointer-click", "import", "signature", "text-color", "group", "remove-formatting", "clipboard-check", "clipboard-paste", "list-plus", "list-tree", "workflow", "cloud-check", "archive-restore", "headset", "person-settings", "bell-ring", "square-x", "more-circle", "radio-button", "star-half", "shield-alert", "image-plus", "cart-add", "calendar-clock", "toggle", "accessibility", "discount", "currency-euro", "exit-door", "locate", "lasso", "pilcrow", "insert-row", "spell-check", "text-wrap", "file-search", "file-spreadsheet", "rss", "file-pen", "chart-gantt", "voicemail", "phone-missed", "broadcast", "cast", "image-off", "battery-charging", "battery-low", "brightness", "devices", "gamepad", "signal", "usb", "shield-off", "badge", "handshake", "meh", "piggy-bank", "scale", "cloud-snow", "notebook", "pentagon", "folder-zip", "chat-question", "plug-off", "goal", "radar", "broom", "pencil-off", "zap-off", "location-off", "chat-off", "screen-share-off", "bookmark-off", "heart-off", "flag-off", "bluetooth-off", "cloud-alert", "clock-alert", "shield-user", "shield-x", "shield-plus", "mail-plus", "person-x", "person-key", "file-cog", "file-download", "password", "volume-low", "merge", "duplicate", "toggle-off", "share-nodes", "git-fork", "git-compare", "bluetooth-connected", "chart-bar-horizontal", "person-square", "pen", "copy-check", "document-dismiss", "calendar-x", "folder-search", "timer-off", "call-off", "sparkle-off", "person-lock", "shield-lock", "battery-full", "battery-medium", "minimize", "loader-circle", "text-align-justify", "case-lower", "heading-1", "heading-2", "heading-3", "send-to-back", "arrow-up-from-line", "maximize", "whole-word", "repository", "folder-tree", "folder-input", "file-json", "file-warning", "logs", "pipeline", "database-search", "database-zap", "cloud-sync", "api", "memory", "brain-circuit", "toolbox", "scan-text", "text-select", "table-of-contents", "timeline", "line-style", "file-x", "file-question", "file-user", "folder-sync", "form", "table-cells-merge", "table-cells-split", "person-search", "person-pen", "person-star", "shield-cog", "mail-check", "mail-warning", "hand-wave", "gif", "calendar-off", "calendar-search", "calendar-sync", "scan-qr", "wifi-low", "globe-off", "book-add", "gavel", "tags", "vote", "text-quote", "location-add", "arrow-up-right-circle", "repeat-once", "switch-camera", "eject", "captions-off", "vibrate", "sim-card", "monitor-off", "megaphone-off", "keyboard-off", "tag-plus", "paint-roller", "square-root", "file-upload", "chart-area", "gift-card", "gem", "file-pdf", "hand-coins", "package-check", "sort-alpha", "incognito", "move-horizontal", "unfold-horizontal", "chat-check", "list-x", "signal-low", "signal-medium", "panel-bottom-open", "panel-bottom-close"];
const refName = (name: string) => name.replace(/(^|-)([a-z])/g, (_m: string, _d: string, c: string) => c.toUpperCase());
const refIcon = (name: string, filled = false) =>
  (FluentRefs as unknown as Record<string, () => ReactElement>)[`FluentRef${refName(name)}${filled ? "Filled" : ""}Icon`] as () => ReactElement;
const FLUENT: [string, () => ReactElement][] = [
  ["add", PlusIcon], ["align-left", AlignLeftIcon], ["bell", BellIcon], ["check", CheckIcon],
  ["chevron-down", ChevronIcon], ["dismiss", DismissIcon], ["eye", FluentEyeIcon], ["info", InfoIcon],
  ["more-horizontal", MoreIcon], ["search", SearchIcon], ["settings", SettingsIcon], ["status-available", PresenceAvailableIcon],
  ["arrow-up", ArrowUpIcon], ["arrow-right", ArrowIcon], ["copy", FluentCopyIcon], ["link", LinkIcon], ["open", OpenIcon], ["person", PersonSmallIcon], ["reset", FluentResetIcon], ["chevron-left", FluentChevronLeftIcon], ["chevron-right", FluentChevronRightIcon], ["chevron-up", FluentChevronUpIcon], ["arrow-left", FluentArrowLeftIcon], ["arrow-down", FluentArrowDownIcon], ["align-right", FluentAlignRightIcon], ["align-center", AlignMiddleIcon], ["align-top", AlignTopIcon], ["align-middle", FluentAlignCenterIcon], ["align-bottom", AlignBottomIcon], ["expand", FluentExpandIcon], ["panel-left", FluentPanelLeftIcon], ["panel-right", FluentPanelRightIcon], ["book", FluentBookIcon], ["options", FluentOptionsIcon], ["color", FluentColorIcon], ["text", FluentTextIcon], ["shapes", FluentShapesIcon], ["list", FluentListIcon], ["square-dashed", FluentSquareDashedIcon], ["layers", FluentLayersIcon], ["flash", FluentFlashIcon], ["document", DocumentIcon], ["folder", FolderIcon], ["trash", TrashIcon], ["warning", AlertIcon],
  ...REF_NAMES.map((name): [string, () => ReactElement] => [name, refIcon(name)]),
];
/* Side by side (docs/specs/icons.md, "Construction system"): each pilot icon beside its
   Fluent equivalent at 16px, then both at 4× on the 16px pixel grid with the icon's
   optical keyline (Cursor's four shapes, as ink boxes), then Area drawn over Fluent. */
const fluentFor = (name: string) => FLUENT.find(([key]) => key === name)?.[1];
const KEYLINE_SHAPES: Record<string, ReactNode> = {
  square: <rect x="1.5" y="1.5" width="13" height="13" />,
  circle: <circle cx="8" cy="8" r="7" />,
  horizontal: <rect x="1" y="2.5" width="14" height="11" />,
  vertical: <rect x="2.5" y="1" width="11" height="14" />,
};
const ENLARGED = 64;
const plate: CSSProperties = {
  position: "relative", inlineSize: "var(--area-space-64)", blockSize: "var(--area-space-64)",
  backgroundImage: "linear-gradient(var(--area-border-subtle) var(--area-border-width), transparent var(--area-border-width)), linear-gradient(to right, var(--area-border-subtle) var(--area-border-width), transparent var(--area-border-width))",
  backgroundSize: "var(--area-space-4) var(--area-space-4)", boxShadow: "0 0 0 var(--area-border-width) var(--area-border-decorative)",
};
const layer: CSSProperties = { position: "absolute", inset: 0 };
const Keyline = ({ shape }: { shape: string }) => (
  <svg viewBox="0 0 16 16" width={ENLARGED} height={ENLARGED} style={{ ...layer, color: "var(--area-fg-accent)" }} aria-hidden="true"
    fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeWidth={0.25}>
    {KEYLINE_SHAPES[shape]}
  </svg>
);
const big = (element: ReactElement, style?: CSSProperties) => cloneElement(element as ReactElement<Record<string, unknown>>, { width: ENLARGED, height: ENLARGED, style: { ...layer, ...style } });
const compareGrid: CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(6, max-content)", alignItems: "center",
  columnGap: "var(--area-space-16)", rowGap: "var(--area-space-12)", color: "var(--area-fg-default)",
  font: "var(--area-weight-regular) var(--area-text-xs-size)/var(--area-text-xs-leading) var(--area-font-sans)",
};
export const GalleryIconPilotCompare = () => (
  <div style={compareGrid}>
    <span>Icon</span><span>Fluent</span><span>Area</span><span>Fluent 4×</span><span>Area 4×</span><span>Area over Fluent</span>
    {BASE_ICONS.map(({ name, keyline, Icon }) => {
      const Fluent = fluentFor(name) ?? (() => <span />);
      return [
        <span key={name + "-label"}>{LABELS[name]}<br /><span style={{ color: "var(--area-fg-muted)" }}>{keyline}</span></span>,
        <Fluent key={name + "-f"} />,
        <Icon key={name + "-a"} weight={1.125} />,
        <div key={name + "-f4"} style={plate}><Keyline shape={keyline} />{big(Fluent())}</div>,
        <div key={name + "-a4"} style={plate}><Keyline shape={keyline} />{big(<Icon weight={1.125} />)}</div>,
        <div key={name + "-o4"} style={plate}>{big(Fluent(), { color: "var(--area-fg-accent)", opacity: 0.45 })}{big(<Icon weight={1.125} />)}</div>,
      ];
    })}
  </div>
);

/* Optical balance: the whole set in one line at 16px and at 2×, Area above Fluent, so an
   icon that reads larger, smaller, heavier or lighter than its neighbours stands out. */
const strip: CSSProperties = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--area-space-12)", color: "var(--area-fg-default)" };
const balanceGrid: CSSProperties = {
  display: "grid", gridTemplateColumns: "max-content minmax(0, 1fr)", alignItems: "center", inlineSize: "100%",
  columnGap: "var(--area-space-16)", rowGap: "var(--area-space-16)", color: "var(--area-fg-default)",
  font: "var(--area-weight-regular) var(--area-text-xs-size)/var(--area-text-xs-leading) var(--area-font-sans)",
};
const at = (element: ReactElement, size: number) => cloneElement(element as ReactElement<Record<string, unknown>>, { width: size, height: size });
export const GalleryIconPilotBalance = () => (
  <div style={balanceGrid}>
    {[16, 32].flatMap(size => [
      <span key={"a" + size}>Area {size}</span>,
      <div key={"as" + size} style={{ ...strip, gap: `var(--area-space-${size / 2})` }}>{BASE_ICONS.map(({ name, Icon }) => <span key={name}>{at(<Icon weight={1.125} />, size)}</span>)}</div>,
      <span key={"f" + size}>Fluent {size}</span>,
      <div key={"fs" + size} style={{ ...strip, gap: `var(--area-space-${size / 2})` }}>{BASE_ICONS.map(({ name }) => { const Fluent = fluentFor(name); return <span key={name}>{Fluent ? at(Fluent(), size) : null}</span>; })}</div>,
    ])}
  </div>
);

/* Weights: the whole set at 1, 1.125 (chosen) and 1.25px, one strip each at 16px. */
export const GalleryIconPilotWeights = () => (
  <div style={balanceGrid}>
    {[1, 1.125, 1.25].flatMap(weight => [
      <span key={"l" + weight}>{weight}px{weight === 1.125 ? " (chosen)" : ""}</span>,
      <div key={"s" + weight} style={{ ...strip, gap: "var(--area-space-8)" }}>{BASE_ICONS.map(({ name, Icon }) => <span key={name}><Icon weight={weight} /></span>)}</div>,
    ])}
  </div>
);

/* Filled (docs/specs/icons.md, "Filled"): the variants derived from each shape's role
   (solid, knockout, hole), beside the outline and Fluent's filled cut. Line glyphs (add,
   check, close, chevron, more) have no filled variant. */
const FLUENT_FILLED: Record<string, () => ReactElement> = {
  "align-left": FluentAlignLeftFilledIcon, bell: FluentBellFilledIcon, eye: FluentEyeFilledIcon,
  info: FluentInfoFilledIcon, settings: FluentSettingsFilledIcon, "status-available": FluentCheckCircleFilledIcon,
  "expand": FluentExpandFilledIcon, "panel-left": FluentPanelLeftFilledIcon, "panel-right": FluentPanelRightFilledIcon, "book": FluentBookFilledIcon, "options": FluentOptionsFilledIcon, "color": FluentColorFilledIcon, "text": FluentTextFilledIcon, "shapes": FluentShapesFilledIcon, "list": FluentListFilledIcon, "square-dashed": FluentSquareDashedFilledIcon, "layers": FluentLayersFilledIcon, "flash": FluentFlashFilledIcon,
  copy: FluentCopyFilledIcon, document: FluentDocumentFilledIcon, folder: FluentFolderFilledIcon, trash: FluentTrashFilledIcon, warning: FluentWarningFilledIcon,
  ...Object.fromEntries(REF_NAMES.map(name => [name, refIcon(name, true)])),
};
export const GalleryIconPilotFilled = () => (
  <div style={compareGrid}>
    <span>Icon</span><span>Outline</span><span>Filled</span><span>Fluent filled</span><span>Area filled 4×</span><span>Fluent filled 4×</span>
    {BASE_ICONS.filter(({ Filled }) => Filled).map(({ name, keyline, Icon, Filled }) => {
      const Area = Filled!, Fluent = FLUENT_FILLED[name] ?? (() => <svg viewBox="0 0 16 16" />);
      return [
        <span key={name + "-label"}>{LABELS[name]}</span>,
        <Icon key={name + "-o"} weight={1.125} />,
        <Area key={name + "-a"} weight={1.125} />,
        <Fluent key={name + "-f"} />,
        <div key={name + "-a4"} style={plate}><Keyline shape={keyline} />{big(<Area weight={1.125} />)}</div>,
        <div key={name + "-f4"} style={plate}><Keyline shape={keyline} />{big(Fluent())}</div>,
      ];
    })}
  </div>
);

/* Exploration (docs/specs/icons.md): candidates under review, one group per question, each
   at 16px beside text, at 32px and at 4× with its keyline, with the lint's measurements.
   A candidate the rules reject shows why. */
const exploreGroup: CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(calc(var(--area-space-64) * 2), max-content))",
  columnGap: "var(--area-space-24)", rowGap: "var(--area-space-16)", color: "var(--area-fg-default)",
  font: "var(--area-weight-regular) var(--area-text-xs-size)/var(--area-text-xs-leading) var(--area-font-sans)",
};
const exploreCell: CSSProperties = { display: "flex", flexDirection: "column", gap: "var(--area-space-8)" };
const muted: CSSProperties = { color: "var(--area-fg-muted)" };
const ExploreGroup = ({ group }: { group: string }) => (
  <div style={exploreGroup}>
    {EXPLORE.filter(candidate => candidate.group === group).map(({ label, Icon, gaps, counters, notes }) => (
      <div key={label} style={exploreCell}>
        <span>{label}</span>
        <div style={{ ...row, font: "var(--area-weight-regular) var(--area-text-sm-size)/var(--area-text-sm-leading) var(--area-font-sans)" }}><Icon weight={1.125} /><span>{group}</span></div>
        <div style={plate}>{big(<Icon weight={1.125} />)}</div>
        <span style={muted}>gaps {gaps.join(", ") || "none"}<br />counters {counters.join(", ")}</span>
        {notes.map(note => <span key={note} style={{ color: "var(--area-fg-caution)" }}>{note}</span>)}
      </div>
    ))}
  </div>
);
/* Renders nothing when there are no candidates; the build then omits the section. */
export const GalleryIconPilotExplore = () => (
  <div style={{ ...exploreCell, gap: "var(--area-space-32)", inlineSize: "100%", alignSelf: "start" }}>
    {[...new Set(EXPLORE.map(candidate => candidate.group))].map(group => (
      <div key={group} style={exploreCell}><span style={muted}>{group}</span><ExploreGroup group={group} /></div>
    ))}
  </div>
);

/* Sizes (docs/specs/icons.md, "Sizes"): the 16px drawings at every slot size on the size
   curve (the line grows with size^0.45, Cursor's 1.25 → 1.5px from 16 to 24px), each strip
   beside the text size the slot pairs with, and the old uniform scaling for comparison. */
const SIZE_TEXT: Record<number, string> = { 12: "xs", 16: "sm", 20: "md", 24: "md" };
const px = (value: number) => Math.round(value * 100) / 100;
const curveLine = (size: number) => 1.125 * Math.pow(size / 16, 0.45);
const SizeStrip = ({ size, uniform = false }: { size: number; uniform?: boolean }) => {
  const line = uniform ? 1.125 * size / 16 : curveLine(size), scale = size / 16;
  const text = SIZE_TEXT[size];
  return (
    <div style={exploreCell}>
      <span style={muted}>{size}px{uniform ? ", uniform scaling (previous)" : ""}: line {px(line)}, standard gap {px(3 * scale - line)}, tight gap {px(2.5 * scale - line)}</span>
      <div style={{ ...strip, gap: "var(--area-space-12)", font: `var(--area-weight-regular) var(--area-text-${text}-size)/var(--area-text-${text}-leading) var(--area-font-sans)` }}>
        {BASE_ICONS.map(({ name, Icon }) => <span key={name}>{uniform ? at(<Icon weight={1.125} />, size) : <Icon size={size} />}</span>)}
        <span>Settings</span>
      </div>
    </div>
  );
};
export const GalleryIconPilotSizes = () => (
  <div style={{ ...exploreCell, gap: "var(--area-space-24)", font: "var(--area-weight-regular) var(--area-text-xs-size)/var(--area-text-xs-leading) var(--area-font-sans)" }}>
    {[12, 16, 20, 24].map(size => <SizeStrip key={size} size={size} />)}
    <SizeStrip size={24} uniform />
  </div>
);
const SizeRaster = ({ size, scale }: { size: number; scale: number }) => (
  <div style={exploreCell}>
    <span style={muted}>{size}px on the curve, {scale}×</span>
    <div style={{ ...strip, gap: "var(--area-space-8)" }}>
      {BASE_ICONS.map(({ name, Icon }) => (
        <Pixels key={name}><Icon weight={1.125} size={size} data-scale={String(scale)} data-size={String(size)} /></Pixels>
      ))}
    </div>
  </div>
);
export const GalleryIconPilotSizesRaster = () => (
  <div style={{ ...exploreCell, gap: "var(--area-space-16)" }}>
    <SizeRaster size={12} scale={1} />
    <SizeRaster size={12} scale={2} />
    <SizeRaster size={20} scale={1} />
  </div>
);

/* Pixel check: the browser rasterises each icon into 16px (1×) and 32px (2×) canvases,
   shown enlarged with hard pixel edges (public/pixel-preview.js). Chosen weight 1.125px.
   Snapping to 1px on 1× screens was measured and gains nothing (docs/specs/icons.md). */
const pixelGrid: CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(5, max-content)", alignItems: "center",
  columnGap: "var(--area-space-16)", rowGap: "var(--area-space-8)", color: "var(--area-fg-default)",
  font: "var(--area-weight-regular) var(--area-text-xs-size)/var(--area-text-xs-leading) var(--area-font-sans)",
};
const Pixels = ({ children }: { children: ReactNode }) => (
  <span data-pixel-preview="">{children}</span>
);
export const GalleryIconPilotPixels = () => (
  <div style={pixelGrid}>
    <span>Icon</span><span>Area 1×</span><span>Area 2×</span><span>Fluent 1×</span><span>Fluent 2×</span>
    {BASE_ICONS.map(({ name, Icon }) => {
      const Fluent = fluentFor(name);
      return [
        <span key={name + "-label"}>{LABELS[name] ?? name}</span>,
        <Pixels key={name + "-1x"}><Icon weight={1.125} data-scale="1" /></Pixels>,
        <Pixels key={name + "-2x"}><Icon weight={1.125} data-scale="2" /></Pixels>,
        <Pixels key={name + "-f1x"}>{Fluent ? <span data-scale="1"><Fluent /></span> : null}</Pixels>,
        <Pixels key={name + "-f2x"}>{Fluent ? <span data-scale="2"><Fluent /></span> : null}</Pixels>,
      ];
    })}
  </div>
);

/* Icon review cards (gallery-icons.html): the icon at every size on the size curve and
   filled, 3× plates on the pixel grid (Area, Fluent, Area over Fluent, filled) and the icon
   in use. The build adds each card's header (name and status). */
const card: CSSProperties = {
  display: "grid", gridTemplateColumns: "var(--area-space-40) minmax(0, 1fr)", alignItems: "center",
  columnGap: "var(--area-space-12)", rowGap: "var(--area-space-16)", color: "var(--area-fg-default)",
  font: "var(--area-weight-regular) var(--area-text-xs-size)/var(--area-text-xs-leading) var(--area-font-sans)",
};
const cardRow: CSSProperties = { display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "var(--area-space-12)" };
const sizeCell: CSSProperties = { display: "grid", justifyItems: "center", gap: "var(--area-space-4)" };
const SIZES = [12, 16, 20, 24, 32];
/* 3× plates: one screen pixel per grid unit ×3. */
const PLATE = 48;
const plateSm: CSSProperties = { ...plate, inlineSize: "var(--area-space-48)", blockSize: "var(--area-space-48)", backgroundSize: "calc(var(--area-space-48) / 16) calc(var(--area-space-48) / 16)" };
const mid = (element: ReactElement, style?: CSSProperties) => cloneElement(element as ReactElement<Record<string, unknown>>, { width: PLATE, height: PLATE, style: { ...layer, ...style } });
const KeylineSm = ({ shape }: { shape: string }) => (
  <svg viewBox="0 0 16 16" width={PLATE} height={PLATE} style={{ ...layer, color: "var(--area-fg-accent)" }} aria-hidden="true"
    fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeWidth={0.3}>
    {KEYLINE_SHAPES[shape]}
  </svg>
);
const Cell = ({ label, children }: { label: string | number; children: ReactNode }) => (
  <div style={sizeCell}>{children}<span style={muted}>{label}</span></div>
);
const IconReview = ({ name }: { name: string }) => {
  const entry = PILOT_ICONS.find(icon => icon.name === name)!;
  const { Icon, Filled, keyline, fill } = entry;
  const Fluent = fluentFor(name);
  const label = LABELS[name] ?? name;
  return (
    <div style={card}>
      <span style={{ ...muted, gridColumn: "1 / -1" }}>{label} · {keyline} keyline · filled by {fill === "solid" ? "shape" : "weight"}{entry.derivedFrom ? ` · from ${entry.derivedFrom}` : ""}</span>
      <span style={muted}>Sizes</span>
      <div style={cardRow}>
        {SIZES.map(size => <Cell key={size} label={size}><Icon size={size} /></Cell>)}
        <Cell label="filled"><Filled size={16} /></Cell>
      </div>
      <span style={muted}>3×</span>
      <div style={{ ...cardRow, gap: "var(--area-space-8)" }}>
        <Cell label="Area"><div style={plateSm}><KeylineSm shape={keyline} />{mid(<Icon weight={1.125} />)}</div></Cell>
        {Fluent ? <Cell label="Fluent"><div style={plateSm}><KeylineSm shape={keyline} />{mid(Fluent())}</div></Cell> : null}
        {Fluent ? <Cell label="over"><div style={plateSm}>{mid(Fluent(), { color: "var(--area-fg-accent)", opacity: 0.45 })}{mid(<Icon weight={1.125} />)}</div></Cell> : null}
        <Cell label="filled"><div style={plateSm}><KeylineSm shape={keyline} />{mid(<Filled weight={1.125} />)}</div></Cell>
      </div>
      <span style={{ ...muted, alignSelf: "start", paddingBlockStart: "var(--area-space-4)" }}>In use</span>
      <div style={{ ...cardRow, alignItems: "center", gap: "var(--area-space-8)" }}>
        <Button variant="outline" size="sm" icon={<Icon />}>{label}</Button>
        <Button variant="ghost" size="sm" iconOnly icon={<Icon />} aria-label={label} />
        <Badge icon={<Icon />}>{label}</Badge>
        <Nav aria-label={label} style={{ inlineSize: "calc(var(--area-space-64) * 2)" }}>
          <NavItem href="#" current icon={<Filled />}>{label}</NavItem>
        </Nav>
      </div>
    </div>
  );
};
const pascal = (name: string) => name.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());
/** One review demo per pilot icon, named GalleryIconReview<Name>; the build lays them out. */
export const ICON_REVIEW_DEMOS: Record<string, () => ReactElement> = Object.fromEntries(
  PILOT_ICONS.map(({ name }) => [`GalleryIconReview${pascal(name)}`, () => <IconReview name={name} />]),
);

/* All icons (gallery-icons.html): every icon, outline and filled at 16px, one group per
   batch with the newest first. Rotations and mirrors follow their base icon; a dot marks
   an icon in review. Each cell links to the icon's card. */
const withDerived = (names: readonly string[]) => names.flatMap(name => [
  ...PILOT_ICONS.filter(icon => icon.name === name),
  ...PILOT_ICONS.filter(icon => icon.derivedFrom === name),
]);
export const GalleryIconCatalog = () => (
  <div className="docs-icon-catalog">
    {[...PILOT_BATCHES].reverse().map(batch => {
      const status = batch.icons as Record<string, string>;
      const icons = withDerived(Object.keys(status));
      const open = Object.values(status).filter(value => value !== "approved").length;
      return (
        <section key={batch.id} className="docs-icon-catalog__batch">
          <h4 className="docs-icon-catalog__title">{batch.title}<span>{icons.length} icons{open ? ` · ${open} in review` : ""}</span></h4>
          <div className="docs-icon-catalog__grid">
            {icons.map(({ name, Icon, Filled, derivedFrom }) => (
              <a key={name} href={`#gallery-icon-review-${name}`} className="docs-icon-catalog__cell" title={LABELS[name] ?? name}
                data-review={status[derivedFrom ?? name] !== "approved" ? "" : undefined}>
                <span className="docs-icon-catalog__icons"><Icon size={16} /><Filled size={16} /></span>
                <span className="docs-icon-catalog__name">{name}</span>
              </a>
            ))}
          </div>
        </section>
      );
    })}
  </div>
);
