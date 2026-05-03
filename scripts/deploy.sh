#!/usr/bin/env bash
# deploy.sh: idempotent EC2 deploy script for ShopSmart.
# Safe to run multiple times; always produces the same result.
# Usage: bash scripts/deploy.sh
set -euo pipefail

APP_DIR="${HOME}/shopsmart"
REPO_URL="https://github.com/Vikas-Eranki/shopsmart.git"
SERVER_DIR="${APP_DIR}/server"
CLIENT_DIR="${APP_DIR}/client"
APP_NAME="shopsmart-backend"
PORT=5001

echo "[1/7] Ensuring app directory..."
mkdir -p "${APP_DIR}"

# Pull latest code if the repo exists, otherwise clone it
echo "[2/7] Syncing code..."
if [ -d "${APP_DIR}/.git" ]; then
  git -C "${APP_DIR}" pull --ff-only
else
  git clone "${REPO_URL}" "${APP_DIR}"
fi

echo "[3/7] Installing server dependencies..."
npm ci --prefix "${SERVER_DIR}"

echo "[4/7] Building client..."
npm ci --prefix "${CLIENT_DIR}"
npm run build --prefix "${CLIENT_DIR}"

echo "[5/7] Checking PM2..."
if ! command -v pm2 &> /dev/null; then
  echo "Installing PM2 globally..."
  npm install -g pm2
fi

# Reload if the process exists, otherwise start it fresh
echo "[6/7] Starting / reloading server..."
if pm2 describe "${APP_NAME}" &> /dev/null; then
  pm2 reload "${APP_NAME}" --update-env
else
  PORT="${PORT}" pm2 start "${SERVER_DIR}/src/index.js" --name "${APP_NAME}" --update-env
fi

pm2 save

echo "[7/7] Running health check..."
sleep 3
if curl -sf "http://localhost:${PORT}/api/health" > /dev/null; then
  echo "Health check passed. ShopSmart is live on port ${PORT}."
else
  echo "Health check failed. Check PM2 logs: pm2 logs ${APP_NAME}"
  exit 1
fi

echo ""
echo "Deployment complete."
echo "Server: http://localhost:${PORT}"
