
# 🛡️ Hướng dẫn Bảo Mật VPS (Chống Hacker)

## 0. Nguyên Tắc Cốt Lõi
- **Ẩn mình**: Không để lộ phiên bản phần mềm.
- **Giới hạn**: Chỉ mở những cổng cần thiết.
- **Quan sát**: Ghi log và chặn ngay hành vi đáng ngờ.
- **Backup**: Luôn có bản sao lưu dữ liệu.

## 1. Bảo mật SSH (Thay chìa khóa nhà)
Hacker thường dùng tool dò mật khẩu tài khoản `root`. Hãy làm như sau:
- **Tạo user mới** và cấp quyền `sudo`, không dùng `root` trực tiếp.
- **Sử dụng SSH Key**: Chỉ máy tính có "chìa khóa" (key) mới vào được, tắt đăng nhập bằng mật khẩu.
- **Đổi cổng SSH**: Mặc định là `22`, hãy đổi sang một số ngẫu nhiên (ví dụ `22000`) để tránh bị tool quét tự động.

## 2. Thiết lập Tường Lửa (UFW) - "Người Bảo Vệ"
Chỉ mở những cổng thực sự cần thiết:
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp # HTTPS
sudo ufw allow 22000/tcp # Cổng SSH mới của bạn
sudo ufw enable
```

## 3. Cài đặt Fail2Ban - "Cảnh Sát"
Fail2Ban sẽ tự động "bỏ tù" (ban IP) những kẻ cố tình dò mật khẩu hoặc spam request.
- Cài đặt: `sudo apt install fail2ban`
- Cấu hình nó để theo dõi SSH và Nginx.

## 4. Bảo mật Docker & Database
- **Mật khẩu mạnh**: Mình đã cập nhật `docker-compose.yml` để dùng biến môi trường. **TUYỆT ĐỐI KHÔNG** để hard-code password trong file.
- **Không mở cổng Database ra ngoài**: Trong `docker-compose.yml`, không nên để `ports: "5432:5432"` trừ khi bạn cần debug từ xa. Nếu chỉ web cần kết nối, hãy xóa dòng này để Database nằm hoàn toàn trong mạng nội bộ docker.

## 5. SSL / HTTPS (Ổ khóa xanh)
Sử dụng HTTPS là bắt buộc.
- Dùng **Certbot** (miễn phí) hoặc **Cloudflare** (dễ dùng).
- Cloudflare còn giúp ẩn IP gốc của VPS, chống DDoS rất tốt cho các dự án vừa và nhỏ.

## 6. Backup (Đường lui)
- Cài đặt script tự động backup database mỗi ngày.
- Gửi file backup lên Google Drive hoặc S3 (ví dụ dùng `rclone`).
- Đừng để file backup nằm trên cùng một server.

---
*Hãy thực hiện từng bước một. An toàn không phải là đích đến, mà là một quá trình liên tục!* 🚀🔐
