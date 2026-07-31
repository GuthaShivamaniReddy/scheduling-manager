#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

VERSION="${1:-$(date +%Y%m%d)-$(git rev-parse --short HEAD)}"
OUTPUT_DIR="${OUTPUT_DIR:-$ROOT}"
OUTPUT="$OUTPUT_DIR/vitalize-interview-${VERSION}.zip"

mkdir -p "$OUTPUT_DIR"

git archive \
  --format=zip \
  --prefix=vitalize-interview/ \
  --output "$OUTPUT" \
  HEAD

echo "Created $OUTPUT"
