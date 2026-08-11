#!/bin/bash
# Force ds-builder's file watcher to rebuild and push updates to the preview.
# Touching a watched source file triggers chokidar → runBuild → WebSocket push.
for f in \
  ds-builder/.demo-workspace/.ds-builder/ds/tokens/primitives/color.json \
  ds-builder/templates/ds/tokens/primitives/color.json; do
  [ -f "$f" ] && touch "$f"
done
echo '{}'
exit 0
