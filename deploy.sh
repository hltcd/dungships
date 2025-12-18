#!/bin/bash

# Exit on error
set -e

echo "🚀 Bắt đầu quá trình Deploy 'Super Bulletproof'..."

# 1. Tự động sửa file .env nếu user để localhost
if [ -f .env ]; then
    if grep -q "localhost:5432" .env; then
        echo "🔧 Phát hiện localhost trong .env, tự động chuyển sang 'postgres' để chạy trong Docker..."
        cp .env .env.bak
        # Sửa lỗi kết nối Database: localhost -> postgres
        sed -i 's/localhost:5432/postgres:5432/g' .env
        echo "✅ Đã sửa xong .env!"
    fi
fi

# 2. Kéo code mới nhất
echo "📥 Đang tải source code mới nhất..."
git pull origin main

# 3. Khởi động TẤT CẢ các service (Đảm bảo Database cũng được up)
echo "🐳 Đang khởi động hệ thống Docker..."
docker compose up -d --build

# 4. Chờ Database sẵn sàng (Tăng timeout lên 60s)
echo "⏳ Đang chờ Database sẵn sàng (có thể mất 10-20s)..."
MAX_RETRIES=60
COUNT=0

# Thử kết nối đến DB cho đến khi thành công hoặc hết lượt
while [ $COUNT -lt $MAX_RETRIES ]; do
  if docker compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ Database đã sẵn sàng!"
    break
  fi
  echo -n "."
  sleep 1
  ((COUNT++))
done

if [ $COUNT -eq $MAX_RETRIES ]; then
  echo ""
  echo "❌ Database không khởi động kịp."
  echo "👉 Hãy chạy thử lệnh này để xem lỗi: docker compose logs postgres"
  exit 1
fi

# 5. Cập nhật Database (Migration & Seed)
echo "🛠️ Đang chạy Migration & Seed Database..."
# Dùng bản fix cứng 5.22.0
docker compose exec -T app npx -y prisma@5.22.0 generate
docker compose exec -T app npx -y prisma@5.22.0 migrate deploy
docker compose exec -T app npx -y prisma@5.22.0 db seed

# 6. Dọn dẹp hệ thống
echo "🧹 Đang dọn dẹp hệ thống..."
docker image prune -f

echo ""
echo "✅ [SUCCESS] Website đã được cập nhật thành công và an toàn!"
echo "📍 Truy cập: https://hoclaptrinhcungdung.com"
