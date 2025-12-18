#!/bin/bash

echo "🚀 Bắt đầu quá trình Deploy..."

# 1. Kéo code mới nhất về
echo "📥 Đang tải source code mới nhất..."
git pull origin main

# 2. Rebuild và khởi động lại container (chỉ web app)
echo "🐳 Đang build lại Docker image..."
# --build: Build lại image mới
# -d: Chạy ngầm
# --no-deps: Không restart lại các service phụ thuộc (như db) nếu không cần thiết
docker compose up -d --build --no-deps app

# 3. Cập nhật Database (Migration & Seed)
echo "🛠️ Đang chạy Migration & Seed Database..."
# Generate Prisma Client mới nhất
docker compose exec app npx -y prisma generate
# Chạy migration (cập nhật cấu trúc bảng)
docker compose exec app npx -y prisma migrate deploy
# Chạy seed (tạo dữ liệu mẫu & admin)
docker compose exec app npx -y prisma db seed

# 4. Dọn dẹp rác (Image cũ không dùng nữa)
echo "🧹 Đang dọn dẹp hệ thống..."
docker image prune -f

echo "✅ Deploy hoàn tất! Website đã được cập nhật."
