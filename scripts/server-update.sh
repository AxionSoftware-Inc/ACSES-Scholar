#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/ACSES Scholar backend"

cd "$ROOT_DIR"

git pull --ff-only origin main
git submodule update --init --recursive

if [ -d "$BACKEND_DIR/.git" ]; then
  git -C "$BACKEND_DIR" checkout main
  git -C "$BACKEND_DIR" pull --ff-only origin main
fi

docker compose -f docker-compose.prod.yml up -d --build
