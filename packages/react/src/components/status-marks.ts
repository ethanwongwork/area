/** Area-drawn presence marks, generated from apps/docs/assets/area-icons-pilot/status by
 * apps/docs/scripts/gen-pilot-icons.mjs. Do not edit by hand. Construction: docs/specs/icons.md. */
export const statusMarks = {
  "available": [
    {
      "tag": "path",
      "d": "M4.5 8.25L7 10.75L11.5 6.25",
      "fill": "none",
      "stroked": true
    }
  ],
  "away": [
    {
      "tag": "path",
      "d": "M8 4.5V8L10.5 10.5",
      "fill": "none",
      "stroked": true
    }
  ],
  "blocked": [
    {
      "tag": "path",
      "d": "M4.75 11.25L11.25 4.75",
      "fill": "none",
      "stroked": true
    }
  ],
  "do-not-disturb": [
    {
      "tag": "path",
      "d": "M4.5 8H11.5",
      "fill": "none",
      "stroked": true
    }
  ],
  "offline": [
    {
      "tag": "path",
      "d": "M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5",
      "fill": "none",
      "stroked": true
    }
  ],
  "out-of-office": [
    {
      "tag": "path",
      "d": "M11.5 8H4.5M7.5 5L4.5 8L7.5 11",
      "fill": "none",
      "stroked": true
    }
  ],
  "unknown": [
    {
      "tag": "path",
      "d": "M6 6.25A2 2 0 1 1 9.1 7.9C8.45 8.35 8 8.85 8 9.75",
      "fill": "none",
      "stroked": true
    },
    {
      "tag": "circle",
      "cx": "8",
      "cy": "12",
      "r": "0.875",
      "fill": "currentColor"
    }
  ]
} as const;
