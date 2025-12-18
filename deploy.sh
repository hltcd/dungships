#!/bin/bash

# Remove set -e to handle errors manually and prevent sudden death
# set -e 

echo "🚀 Bắt đầu quá trình Deploy 'ULTRA Bulletproof'..."

# 1. Tự động sửa file .env nếu user để localhost
if [ -f .env ]; then
    if grep -q "localhost:5432" .env; then
        echo "🔧 Phát hiện localhost trong .env, tự động chuyển sang 'postgres' để chạy trong Docker..."
        cp .env .env.bak
        sed -i 's/localhost:5432/postgres:5432/g' .env
        echo "✅ Đã sửa xong .env!"
    fi
fi

# 2. Kéo code mới nhất
echo "📥 Đang tải source code mới nhất..."
git pull origin main

# 3. Khởi động TẤT CẢ các service
echo "🐳 Đang khởi động hệ thống Docker..."
docker compose up -d --build

# 4. Chờ Database sẵn sàng (Tăng timeout lên 60s)
echo "⏳ Đang chờ Database sẵn sàng (có thể mất 10-20s)..."
MAX_RETRIES=60
COUNT=0

while [ $COUNT -lt $MAX_RETRIES ]; do
  # Thử pg_ready, dùng 2>&1 để ẩn lỗi nếu container chưa bật hẳn
  if docker compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo ""
    echo "✅ Database đã sẵn sàng!"
    DB_READY=1
    break
  fi
  echo -n "."
  sleep 1
  ((COUNT++))
done

if [ "$DB_READY" != "1" ]; then
  echo ""
  echo "❌ Database không khởi động kịp sau 60s."
  echo "👉 Hãy chạy thử lệnh này để xem lỗi: docker compose logs postgres"
  exit 1
fi

# 5. Cập nhật Database (Migration & Seed)
echo "🛠️ Đang chạy Migration & Seed Database..."
# Dùng bản fix cứng 5.22.0 và bắt lỗi từng lệnh
docker compose exec -T app npx -y prisma@5.22.0 generate || echo "⚠️ Cảnh báo: Lỗi khi generate Prisma Client"
docker compose exec -T app npx -y prisma@5.22.0 migrate deploy || { echo "❌ Lỗi: Không thể chạy Migration"; exit 1; }
docker compose exec -T app npx -y prisma@5.22.0 db seed || { echo "❌ Lỗi: Không thể chạy Seed dữ liệu"; exit 1; }

# 6. Dọn dẹp hệ thống
echo "🧹 Đang dọn dẹp hệ thống..."
docker image prune -f

echo ""
echo "✅ [SUCCESS] Website đã được cập nhật thành công và an toàn!"
echo "📍 Truy cập: https://hoclaptrinhcungdung.com"
