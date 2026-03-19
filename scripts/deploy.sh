#!/usr/bin/env bash
# =============================================================================
# ShopSmart — Idempotent EC2 Deploy Script
# Run this script as many times as you like; it produces the same safe result.
# Usage: bash scripts/deploy.sh
# =============================================================================
set -euo pipefail

APP_DIR="${HOME}/shopsmart"
REPO_URL="https://github.com/Vikas-Eranki/shopsmart.git"
SERVER_DIR="${APP_DIR}/server"
CLIENT_DIR="${APP_DIR}/client"
APP_NAME="shopsmart-backend"
PORT=5001

echo "======================================"
echo " ShopSmart Deployment — $(date)"
echo "======================================"

# ── 1. Ensure app directory exists (idempotent: mkdir -p) ──────────────────
echo "[1/7] Ensuring app directory..."
mkdir -p "${APP_DIR}"

# ── 2. Clone or pull latest code ───────────────────────────────────────────
echo "[2/7] Syncing code..."
if [ -d "${APP_DIR}/.git" ]; then
  git -C "${APP_DIR}" pull --ff-only
else
  git clone "${REPO_URL}" "${APP_DIR}"
fi

# ── 3. Install server dependencies (idempotent: npm ci) ───────────────────
echo "[3/7] Installing server dependencies..."
npm ci --prefix "${SERVER_DIR}"

# ── 4. Install client dependencies & build ────────────────────────────────
echo "[4/7] Building client..."
npm ci --prefix "${CLIENT_DIR}"
npm run build --prefix "${CLIENT_DIR}"

# ── 5. Ensure PM2 is available ────────────────────────────────────────────
echo "[5/7] Checking PM2..."
if ! command -v pm2 &> /dev/null; then
  echo "Installing PM2 globally..."
  npm install -g pm2
fi

# ── 6. Start or gracefully reload server (idempotent: pm2 reload or start) ─
echo "[6/7] Starting / reloading server..."
if pm2 describe "${APP_NAME}" &> /dev/null; then
  echo "  → Reloading existing PM2 process: ${APP_NAME}"
  pm2 reload "${APP_NAME}" --update-env
else
  echo "  → Starting new PM2 process: ${APP_NAME} on port ${PORT}"
  PORT="${PORT}" pm2 start "${SERVER_DIR}/src/index.js" --name "${APP_NAME}" --update-env
fi

# Save PM2 process list so it survives reboots (idempotent)
pm2 save

# ── 7. Health check ────────────────────────────────────────────────────────
echo "[7/7] Running health check..."
sleep 3  # Give server a moment to start
if curl -sf "http://localhost:${PORT}/api/health" > /dev/null; then
  echo "✅ Health check passed — ShopSmart is live on port ${PORT}"
else
  echo "❌ Health check failed — check PM2 logs: pm2 logs ${APP_NAME}"
  exit 1
fi

echo ""
echo "=============================="
echo " Deployment complete! ✅"
echo " Server: http://localhost:${PORT}"
echo "=============================="
