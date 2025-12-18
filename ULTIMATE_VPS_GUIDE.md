# 🛡️ CẨM NANG BẢO MẬT & DEPLOY VPS TOÀN TẬP (Dành cho người mới)

> **Lời mở đầu từ chuyên gia**: Chào bạn, tôi đã làm bảo mật 50 năm nay. Một VPS "trần trụi" trên mạng internet giống như một ngôi nhà không khóa cửa giữa phố đông người. Chỉ cần 5 phút là hacker có thể chiếm quyền kiểm soát. Hãy làm theo từng bước dưới đây, đừng bỏ sót bất cứ điều gì. Chậm mà chắc!

---

## PHẦN 1: KHI VỪA NHẬN VPS (Thiết lập "Cửa nhà")

Khi bạn vừa mua VPS, bạn sẽ nhận được IP và mật khẩu của tài khoản `root`. Tài khoản `root` là "Vua", có quyền làm mọi thứ. Hacker thích nhất là chiếm được `root`.

### Bước 1: Đăng nhập lần đầu
Mở Terminal (hoặc CMD/PowerShell trên Windows) và gõ:
```bash
ssh root@IP_CUA_BAN
# Nhập mật khẩu họ gửi (lưu ý khi nhập mật khẩu sẽ không hiện ký tự, cứ nhập rồi Enter)
```

### Bước 2: Tạo User riêng (Tuyệt đối không dùng root để chạy web)
Chúng ta sẽ tạo một user tên là `deploy` (hoặc tên bạn) để quản lý.
```bash
# 1. Tạo user mới
adduser deploy
# (Nhập mật khẩu mới cho user này, nhớ kỹ nhé!)

# 2. Cấp quyền "sudo" (quyền quản trị) cho user này
usermod -aG sudo deploy

# 3. Chuyển sang dùng user mới ngay lập tức
su - deploy
```

---

## PHẦN 2: BẢO MẬT SSH (Thay ổ khóa xịn)

Hacker thường dùng tool dò mật khẩu (Brute Force). Chúng ta sẽ chặn đứng việc này bằng cách dùng **SSH Key** (Chìa khóa số) và tắt đăng nhập bằng mật khẩu.

### Bước 3: Đẩy SSH Key lên VPS
Mình đã tạo sẵn cho bạn một chìa khóa riêng cho dự án này rồi.
- **Public Key** (Nội dung của "ổ khóa"):
  ```text
  ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDYJ6tJzDIFd7PILPVWtRPYRNTwUR8o888DbFi1tRmz5 admin@hoclaptrinhcungdung.com
  ```
- **Lệnh để đẩy key lên VPS** (Chạy lệnh này từ máy của bạn):
  ```bash
  ssh-copy-id -i ~/.ssh/id_ed25519_dungship_vps.pub deploy@IP_CUA_BAN
  ```
  *(Thay IP_CUA_BAN bằng IP thật của VPS)*

### Bước 4: Tắt đăng nhập bằng mật khẩu (Trên VPS)
Sau khi đẩy key xong và chắc chắn đã SSH được bằng key, hãy tắt đăng nhập mật khẩu:
1. SSH vào VPS:
   ```bash
   ssh -i ~/.ssh/id_ed25519_dungship_vps deploy@IP_CUA_BAN
   ```
2. Sửa file cấu hình:
   ```bash
   sudo nano /etc/ssh/sshd_config
   ```
Tìm và sửa các dòng sau (nếu có dấu # ở đầu thì xóa đi):
- `PasswordAuthentication no` (Cấm nhập pass, bắt buộc dùng Key)
- `PermitRootLogin no` (Cấm root đăng nhập trực tiếp)
- `Port 22000` (Đổi cổng 22 thành 22000 cho khó đoán - Tùy chọn, nhưng khuyên dùng)

Lưu file (`Ctrl+O` -> Enter -> `Ctrl+X`). Sau đó khởi động lại SSH:
```bash
sudo service ssh restart
```
*> Lưu ý: Từ giờ bạn sẽ SSH bằng lệnh: `ssh -p 22000 deploy@IP_CUA_BAN`*

---

## PHẦN 3: TƯỜNG LỬA & CẢNH SÁT (UFW & Fail2Ban)

### Bước 5: Cài đặt Tường lửa UFW
Chỉ mở đúng những cửa cần thiết. Đóng tất cả cửa sổ còn lại.
```bash
sudo ufw default deny incoming  # Chặn tất cả chiều vào
sudo ufw default allow outgoing # Cho phép thoải mái chiều ra

sudo ufw allow 22000/tcp  # Mở cổng SSH mới (hoặc 22 nếu bạn không đổi bước trên)
sudo ufw allow 80/tcp     # Mở cổng Web (HTTP)
sudo ufw allow 443/tcp    # Mở cổng Web (HTTPS)

sudo ufw enable
# Nhấn 'y' để đồng ý
```

### Bước 6: Cài "Cảnh sát" Fail2Ban
Thằng này sẽ tự động "bỏ tù" (Block IP) bất kỳ ai cố tình dò mật khẩu hoặc tấn công server.
```bash
sudo apt update
sudo apt install fail2ban -y

# Copy cấu hình mặc định để sửa
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo service fail2ban start
```
*Mặc định nó đã bảo vệ SSH rất tốt rồi.*

---

## PHẦN 4: CÀI ĐẶT MÔI TRƯỜNG & DEPLOY (Docker)

Để web chạy mượt và dễ quản lý, chúng ta dùng Docker. Không cài Node.js hay Database lẻ tẻ trực tiếp lên máy.

### Bước 7: Cài Docker & Docker Compose
```bash
# Cài đặt các gói cần thiết
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y

# Thêm Key của Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Thêm kho phần mềm Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Cài đặt Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y

# Cho phép user 'deploy' dùng docker mà không cần gõ sudo
sudo usermod -aG docker deploy
# (Bạn cần thoát SSH và đăng nhập lại để lệnh này có hiệu lực)
```

### Bước 8: Kết nối VPS với GitHub (Deploy Key)
Để VPS có thể tải code từ GitHub về, bạn cần tạo một "chìa khóa phụ" và đưa cho GitHub.
1.  **Tạo SSH Key trên VPS**:
    ```bash
    ssh-keygen -t ed25519 -C "vps-deploy"
    # Nhấn Enter liên tục để để mặc định (không cần mật khẩu cho key này)
    ```
2.  **Lấy nội dung Key**:
    ```bash
    cat ~/.ssh/id_ed25519.pub
    ```
    *Copy toàn bộ dòng chữ hiện ra (bắt đầu bằng `ssh-ed25519...`).*
3.  **Thêm vào GitHub**:
    - Vào Repository của bạn trên GitHub.
    - Chọn **Settings** > **Deploy keys** > **Add deploy key**.
    - **Title**: VPS Deploy
    - **Key**: Dán nội dung vừa copy vào.
    - Nhấn **Add key**.

### Bước 9: Tải Source Code & Cấu hình
```bash
# Tạo thư mục chứa web
mkdir ~/web && cd ~/web

# Clone code về
git clone git@github.com:hltcd/dungships.git .

# Tạo file .env (QUAN TRỌNG: Điền bí mật vào đây)
nano .env
```
*Dán nội dung file `.env` từ máy tính của bạn vào đây. Nhớ sửa `DATABASE_URL` thành cấu hình thật hoặc để mặc định nếu dùng Postgres của Docker.*

### Bước 10: Kích hoạt SSL (HTTPS)
Thay vì chạy lệnh docker thông thường, mình đã chuẩn bị sẵn một script để tự động cài SSL cho bạn.
```bash
# Cấp quyền cho script
chmod +x init-letsencrypt.sh

# Chạy script (Nó sẽ tự động xin chứng chỉ và bật Web)
./init-letsencrypt.sh
```
Sau bước này, website của bạn sẽ chạy tại `https://hoclaptrinhcungdung.com` với ổ khóa xanh an toàn! 🔒

*Lưu ý: Nếu sau này muốn khởi động lại web, bạn chỉ cần chạy `docker compose up -d` là được.*

---

## PHẦN 5: TỐI ƯU HÓA (Để chạy mượt)

1.  **Swap Ram (RAM ảo)**: VPS thường ít RAM. Hãy tạo thêm RAM ảo để tránh bị sập khi quá tải.
    ```bash
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    ```
2.  **Backup tự động**: Nên viết script để dump database mỗi ngày rạng sáng.
---

## PHẦN 6: CẬP NHẬT CODE (Deploy tự động)

Sau này khi bạn sửa code và đẩy lên GitHub, để cập nhật code mới về VPS, bạn CHỈ CẦN chạy đúng 1 lệnh duy nhất:

```bash
# Cấp quyền cho file chạy (chỉ cần làm 1 lần đầu tiên)
chmod +x deploy.sh

# LỆNH DEPLOY TỰ ĐỘNG (Lần sau chỉ cần chạy cái này)
./deploy.sh
```

Nó sẽ tự động:
1.  Kéo code mới nhất từ GitHub.
2.  Build lại ứng dụng (mà không làm gián đoạn Database).
3.  Dọn dẹp rác hệ thống sau khi build.

---

**Lời kết**: Chúc mừng! Bạn đã sở hữu một VPS chuẩn chỉ, bảo mật cao. Hãy giữ kỹ khóa SSH và file `.env` nhé.
