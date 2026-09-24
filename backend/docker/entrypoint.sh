#!/bin/sh
set -e

echo "📦 Checking node_modules sync with package.json..."

# So sánh package.json hiện tại với lần cài trước
# Nếu package.json thay đổi hoặc node_modules chưa có thì chạy npm install
if [ ! -f /app/node_modules/.install_stamp ] || \
   ! diff -q /app/package.json /app/node_modules/.install_stamp > /dev/null 2>&1; then
  echo "🔄 package.json changed or node_modules missing. Running npm install..."
  npm install
  # Lưu dấu stamp để lần sau so sánh
  cp /app/package.json /app/node_modules/.install_stamp
  echo "✅ npm install complete."
else
  echo "✅ node_modules is up-to-date. Skipping npm install."
fi

exec "$@"
