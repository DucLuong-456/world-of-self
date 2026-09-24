#!/bin/sh
set -e

echo "📦 Checking node_modules sync with package.json..."

if [ ! -f /app/node_modules/.install_stamp ] || \
   ! diff -q /app/package.json /app/node_modules/.install_stamp > /dev/null 2>&1; then
  echo "🔄 package.json changed or node_modules missing. Running npm install..."
  npm install
  cp /app/package.json /app/node_modules/.install_stamp
  echo "✅ npm install complete."
else
  echo "✅ node_modules is up-to-date. Skipping npm install."
fi

exec "$@"
