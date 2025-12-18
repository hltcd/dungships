#!/bin/bash

# Remove set -e to handle errors manually
# set -e 

DOMAIN="hoclaptrinhcungdung.com"
EMAIL="dunglvdeveloper@gmail.com"

echo "🚀 Bắt đầu quá trình Deploy 'IMMORTAL Bulletproof'..."

# 1. Tự động sửa file .env
if [ -f .env ]; then
    # Sửa lỗi kết nối Database
    if grep -q "localhost:5432" .env; then
        echo "🔧 Tự động chuyển .env sang 'postgres'..."
        cp .env .env.bak
        sed -i 's/localhost:5432/postgres:5432/g' .env
    fi

    # Sửa lỗi Auth.js trên Production (Quan trọng)
    if ! grep -q "AUTH_SECRET" .env; then
        echo "🔐 Đang tạo AUTH_SECRET cho bảo mật..."
        NEW_SECRET=$(openssl rand -base64 32)
        echo "AUTH_SECRET=\"$NEW_SECRET\"" >> .env
    fi

    if ! grep -q "AUTH_TRUST_HOST" .env; then
        echo "🛡️ Đang cấu hình AUTH_TRUST_HOST=true cho Production..."
        echo "AUTH_TRUST_HOST=true" >> .env
    fi

    if ! grep -q "AUTH_URL" .env; then
        echo "🌐 Đang cấu hình AUTH_URL..."
        echo "AUTH_URL=https://$DOMAIN" >> .env
    fi
fi

# 2. Kéo code mới nhất
echo "📥 Đang tải source code mới nhất..."
git pull origin main

# 3. Kiểm tra SSL - Nếu chưa có cert thì tạo "Dummy Cert" để Nginx không bị crash
if [ ! -f "./certbot/conf/live/$DOMAIN/fullchain.pem" ]; then
    echo "⚠️  Phát hiện thiếu SSL certificate. Đang tạo chứng chỉ tạm thời để kích hoạt Nginx..."
    mkdir -p "./certbot/conf/live/$DOMAIN"
    mkdir -p "./certbot/www"
    
    # Tải các file config mẫu của Certbot nếu chưa có
    if [ ! -f "./certbot/conf/options-ssl-nginx.conf" ]; then
        curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "./certbot/conf/options-ssl-nginx.conf"
        curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "./certbot/conf/ssl-dhparams.pem"
    fi

    # Tạo dummy cert
    docker compose run --rm --entrypoint \
      "openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
        -keyout '/etc/letsencrypt/live/$DOMAIN/privkey.pem' \
        -out '/etc/letsencrypt/live/$DOMAIN/fullchain.pem' \
        -subj '/CN=localhost'" certbot
fi

# 4. Khởi động TẤT CẢ các service
echo "🐳 Đang khởi động hệ thống Docker..."
docker compose up -d --build

# 5. Chờ Database sẵn sàng
echo "⏳ Đang chờ Database sẵn sàng..."
MAX_RETRIES=60
COUNT=0
while [ $COUNT -lt $MAX_RETRIES ]; do
  if docker compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ Database đã sẵn sàng!"
    DB_READY=1
    break
  fi
  echo -n "."
  sleep 1
  ((COUNT++))
done

if [ "$DB_READY" != "1" ]; then
  echo "❌ Database không khởi động kịp."
  exit 1
fi

# 6. Cập nhật Database
echo "🛠️ Đang chạy Migration & Seed Database..."
docker compose exec -T app npx -y prisma@5.22.0 generate || true
docker compose exec -T app npx -y prisma@5.22.0 migrate deploy
docker compose exec -T app npx -y prisma@5.22.0 db seed

# 7. Tự động đăng ký SSL thật nếu đang dùng Dummy
if grep -q "localhost" "./certbot/conf/live/$DOMAIN/fullchain.pem" 2>/dev/null; then
    echo "🛡️ Đang yêu cầu Let's Encrypt cấp SSL thật cho $DOMAIN..."
    docker compose run --rm --entrypoint \
      "certbot certonly --webroot -w /var/www/certbot \
        --email $EMAIL --agree-tos --no-eff-email \
        -d $DOMAIN -d www.$DOMAIN --force-renewal" certbot
    
    echo "🔄 Loading lại Nginx với SSL mới..."
    docker compose exec -T nginx nginx -s reload
fi

# 8. Dọn dẹp
docker image prune -f

echo ""
echo "✅ [SUCCESS] Website đã online và an toàn!"
echo "📍 https://$DOMAIN"
