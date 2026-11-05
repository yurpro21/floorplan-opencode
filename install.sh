#!/usr/bin/env sh
# Install Floorplan for opencode.
#   ./install.sh            install globally (~/.config/opencode, or $XDG_CONFIG_HOME/opencode)
#   ./install.sh --project  install into ./.opencode for this project only
set -eu
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

if [ "${1:-}" = "--project" ]; then
  DEST="$PWD/.opencode"
else
  DEST="${XDG_CONFIG_HOME:-$HOME/.config}/opencode"
fi

mkdir -p "$DEST/skills" "$DEST/command"
rm -rf "$DEST/skills/floorplan"
cp -R "$HERE/skills/floorplan" "$DEST/skills/floorplan"
cp "$HERE/opencode/command/floorplan.md" "$DEST/command/floorplan.md"

echo "Installed Floorplan for opencode:"
echo "  $DEST/skills/floorplan"
echo "  $DEST/command/floorplan.md"
echo "Restart opencode, then ask for a floorplan or run /floorplan."
echo "To remove it: rm -rf \"$DEST/skills/floorplan\" \"$DEST/command/floorplan.md\""
