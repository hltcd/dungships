#!/bin/bash

echo "🚀 Bắt đầu quá trình Deploy 'Bulletproof'..."

# 1. Tự động sửa file .env nếu user để localhost
if [ -f .env ]; then
    if grep -q "localhost:5432" .env; then
        echo "🔧 Phát hiện localhost trong .env, tự động chuyển sang 'postgres' để chạy trong Docker..."
        # Backup .env trước khi sửa
        cp .env .env.bak
        # Thay thế localhost bằng tên service database trong docker-compose
        sed -i 's/localhost:5432/postgres:5432/g' .env
        echo "✅ Đã sửa xong .env!"
    fi
fi

# 2. Kéo code mới nhất
echo "📥 Đang tải source code mới nhất..."
git pull origin main

# 3. Build & Restart
echo "🐳 Đang build lại Docker image..."
docker compose up -d --build --no-deps app

# 4. Chờ Database sẵn sàng (Cực kỳ quan trọng)
echo "⏳ Đang chờ Database sẵn sàng..."
MAX_RETRIES=30
COUNT=0
until docker compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1 || [ $COUNT -eq $MAX_RETRIES ]; do
  sleep 1
  ((COUNT++))
done

if [ $COUNT -eq $MAX_RETRIES ]; then
  echo "❌ Database không khởi động kịp, vui lòng kiểm tra 'docker compose logs postgres'"
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

echo "✅ [SUCCESS] Website đã được cập nhật thành công và an toàn!"
