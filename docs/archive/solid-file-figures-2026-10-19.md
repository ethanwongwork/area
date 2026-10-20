# Archived: the solid file figures (2026-10-19)

Owner, review round 57 (File image): "remove the solid variant from everything, folders, image, document, just archive
it for now."

What was removed, and where to find it:

| Family | Removed | Source to restore from |
|---|---|---|
| Folder | `variant="solid"`: Finder's lit folder (top-lit OKLCH gradients for the back and the pocket, a 1px lit lip, Folder's drop shadow); `tone` (blue, neutral, cyan, green, yellow, orange, red, pink, purple, brown: a hue and chroma shift of the solid stops); `contents` (one straight white sheet shown above the pocket when the folder holds something, an image on it) | `main` at `ec77d17`: `packages/styles/src/components/folder.css`, `packages/react/src/components/Folder.tsx`, `docs/specs/folder.md` (Owner decisions 2026-10-18, Measurements) |
| File page | `variant="solid"`: the lit page (#ffffff to #f4f5f7) and flap (#f6f7f9 to #f0f1f4), Folder's shadow, the #b4b4b8 glyph ink | `main` at `ec77d17`: `file-page.css`, `FilePage.tsx`, `docs/specs/file-page.md` |
| File image | `variant="solid"`: the lit frame (#ffffff to #f4f5f7) with Folder's shadow | this branch before round 57's notes (`claude/swatch-combobox-audit-b5f2cd`, round 57 review build) |

The props stay accepted and ignored (`@deprecated`), so existing markup renders the outline figure. To restore: bring
back the CSS blocks and the SVG gradients from the sources above, re-add `solid` (and `tone`) to the manifests, and
give each value its own gallery tile again.
