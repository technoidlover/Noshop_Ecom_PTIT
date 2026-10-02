# noshop - Hệ Thống Sàn Thương Mại Điện Tử Đa Vai Trò (Multi-Role E-Commerce Platform)

**noshop** là nền tảng thương mại điện tử đa gian hàng (Multi-vendor E-Commerce) được thiết kế tối ưu theo chuẩn trải nghiệm người dùng hiện đại (tham khảo Shopee, Lazada, Tiki) với 3 phân quyền cốt lõi: **Quản trị viên (Admin)**, **Người bán hàng (Seller)** và **Khách mua hàng (User/Buyer)**.

---

## 1. Thông Tin Truy Cập & Máy Chủ Triển Khai

| Hạng mục | Chi tiết |
| :--- | :--- |
| **Tên miền chính thức** | [https://stg-ecom.minhtech.com.vn](https://stg-ecom.minhtech.com.vn) |
| **Trang Đăng Nhập** | [https://stg-ecom.minhtech.com.vn/login](https://stg-ecom.minhtech.com.vn/login) |
| **API Health Check** | [https://stg-ecom.minhtech.com.vn/api/health](https://stg-ecom.minhtech.com.vn/api/health) |
| **Máy chủ (Production/Staging)** | `150.95.104.244` (Ubuntu 24.04 LTS - SSH `root@150.95.104.244`) |
| **Thư mục cài đặt trên Server** | `/opt/ecommerce` |
| **Container Registry** | `harbor.nodesign.vn/ecommerce` |

---

## 2. Danh Sách Tài Khoản Mẫu (Sample Accounts)

Bạn có thể đăng nhập bằng mật khẩu hoặc bấm nút **Đăng Nhập Nhanh 1-Chạm** tại trang `/login`:

| Vai trò | Email | Password | Quyền hạn chính |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@noshop.vn` | `Admin@123` | Thống kê toàn sàn, quản lý người dùng (khóa/mở/phân quyền), quản lý danh mục, quản lý đơn hàng toàn hệ thống. |
| **Seller** | `seller@noshop.vn` | `Seller@123` | Quản lý gian hàng (`noshop Official Store`), thống kê doanh thu shop, thêm/sửa/xóa sản phẩm, xử lý & cập nhật trạng thái đơn hàng. |
| **User** | `user@noshop.vn` | `User@123` | Tìm kiếm & lọc sản phẩm, giỏ hàng, áp mã giảm giá (`NOSHOP50K`), đặt hàng (COD / VietQR), theo dõi đơn hàng và đánh giá sản phẩm. |

*(Tài khoản phụ bổ sung: Seller 2 `fashion@noshop.vn` / `Seller@123` | Buyer 2 `buyer@noshop.vn` / `User@123`)*

---

## 3. Kiến Trúc Kỹ Thuật (System Architecture)

```
Khách hàng / Quản trị viên
        │
        ▼ (HTTPS - Port 80/443)
Cloudflare DNS (stg-ecom.minhtech.com.vn)
        │
        ▼
Nginx Reverse Proxy (Server: 150.95.104.244)
  ├── /             ──► ecommerce_frontend (Next.js 15 Standalone - Port 3000)
  ├── /api/*        ──► ecommerce_backend  (Node.js + Express + TS - Port 5000)
  └── /uploads/*    ──► ecommerce_backend  (Static Uploads Volume)
                              │
                              ▼
                        ecommerce_mongo    (MongoDB 7.0 - Port 27017)
```

### Công nghệ sử dụng:
- **Frontend**: Next.js 15 (App Router, Standalone Build), React 19, TypeScript, Tailwind CSS, Axios, Lucide Icons.
- **Backend**: Node.js 22, Express.js, TypeScript, Mongoose (MongoDB ODM), JWT Authentication, bcryptjs, Multer.
- **Database**: MongoDB 7.0 (Lưu trữ bền vững qua Docker Volume `/opt/ecommerce/data/mongo`).
- **Hạ tầng**: Docker, Docker Compose v2, Nginx Reverse Proxy, SSL/TLS, UFW Firewall.

---

## 4. Cấu Trúc Thư Mục Dự Án

```text
e:\Ecommerce\
├── backend/                  # Mã nguồn Backend RESTful API (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/           # Cấu hình kết nối MongoDB
│   │   ├── controllers/      # Xử lý nghiệp vụ: Auth, Product, Category, Order, Review, User, Stats
│   │   ├── middleware/       # Xác thực JWT (protect) và kiểm tra quyền (authorize)
│   │   ├── models/           # Schema dữ liệu: User, Category, Product, Order, Review
│   │   ├── routes/           # Định tuyến API (/api/auth, /api/products, /api/orders,...)
│   │   ├── seed/             # Script khởi tạo dữ liệu mẫu (seedData.ts)
│   │   └── server.ts         # Entry point của Backend
│   ├── Dockerfile            # Multi-stage Dockerfile cho Backend
│   └── package.json
│
├── frontend/                 # Mã nguồn Giao diện người dùng (Next.js 15 + Tailwind CSS)
│   ├── src/
│   │   ├── app/              # Các trang theo cơ chế App Router
│   │   │   ├── admin/        # Giao diện Quản trị viên (dashboard, users, categories, orders)
│   │   │   ├── seller/       # Kênh Người bán (dashboard, products, orders)
│   │   │   ├── products/     # Danh sách tìm kiếm & Chi tiết sản phẩm (/products/[id])
│   │   │   ├── cart/         # Giỏ hàng & áp dụng mã giảm giá
│   │   │   ├── checkout/     # Thanh toán đơn hàng & sinh mã VietQR tự động
│   │   │   ├── orders/       # Lịch sử mua hàng của khách
│   │   │   ├── login/        # Đăng nhập & Đăng nhập nhanh 1-chạm
│   │   │   └── register/     # Đăng ký tài khoản Mua hàng hoặc Mở Shop
│   │   ├── components/       # Navbar, Footer, ProductCard
│   │   ├── context/          # AuthContext, CartContext, ToastContext
│   │   └── lib/              # Cấu hình Axios interceptor & hàm tiện ích
│   ├── Dockerfile            # Multi-stage Dockerfile tối ưu Standalone
│   └── next.config.ts
│
└── deploy/                   # Công cụ tự động hóa Triển khai & Kiểm thử
    ├── docker-compose.yml    # Cấu hình 3 containers: mongodb, backend, frontend
    ├── nginx/stg-ecom.conf   # Cấu hình Nginx Reverse Proxy & SSL
    ├── pack_and_deploy.py    # Script đóng gói, đẩy lên server, build Docker & seed DB
    ├── test_routes.py        # Kiểm thử tự động 15 routes giao diện
    ├── test_dynamic.py       # Kiểm thử luồng động (tạo/sửa/xóa sản phẩm, đánh giá, đặt hàng)
    └── verify_sample_accounts.py # Kiểm thử đăng nhập 3 tài khoản mẫu
```

---

## 5. Tài Liệu API (RESTful API Endpoints)

### 5.1. Xác thực & Tài khoản (`/api/auth`)
- `POST /api/auth/register` - Đăng ký tài khoản mới (`buyer` hoặc `seller`).
- `POST /api/auth/login` - Đăng nhập bằng email & mật khẩu, trả về JWT token.
- `POST /api/auth/demo-login` - Đăng nhập nhanh 1-chạm theo role (`admin`, `seller`, `buyer`).
- `GET /api/auth/me` - Lấy thông tin tài khoản hiện tại *(Yêu cầu Token)*.
- `PUT /api/auth/profile` - Cập nhật hồ sơ cá nhân / thông tin gian hàng *(Yêu cầu Token)*.

### 5.2. Sản phẩm (`/api/products`)
- `GET /api/products` - Lấy danh sách sản phẩm (hỗ trợ lọc `keyword`, `category`, `seller`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`).
- `GET /api/products/seller/me` - Lấy danh sách sản phẩm thuộc gian hàng của Seller đang đăng nhập *(Role: Seller/Admin)*.
- `GET /api/products/:id` - Xem chi tiết sản phẩm.
- `POST /api/products` - Thêm sản phẩm mới *(Role: Seller/Admin)*.
- `PUT /api/products/:id` - Cập nhật thông tin sản phẩm *(Role: Seller sở hữu / Admin)*.
- `DELETE /api/products/:id` - Xóa sản phẩm *(Role: Seller sở hữu / Admin)*.

### 5.3. Danh mục ngành hàng (`/api/categories`)
- `GET /api/categories` - Lấy tất cả danh mục.
- `POST /api/categories` - Tạo danh mục mới *(Role: Admin)*.
- `PUT /api/categories/:id` - Sửa danh mục *(Role: Admin)*.
- `DELETE /api/categories/:id` - Xóa danh mục *(Role: Admin)*.

### 5.4. Đơn hàng (`/api/orders`)
- `POST /api/orders` - Đặt hàng mới, tự động trừ tồn kho sản phẩm *(Yêu cầu Token)*.
- `GET /api/orders/my-orders` - Lịch sử đơn hàng của người mua *(Yêu cầu Token)*.
- `GET /api/orders/seller-orders` - Danh sách đơn hàng có chứa sản phẩm của Seller *(Role: Seller/Admin)*.
- `GET /api/orders` - Toàn bộ đơn hàng trên sàn *(Role: Admin)*.
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn (`PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).

### 5.5. Đánh giá (`/api/reviews`) & Thống kê (`/api/stats`)
- `GET /api/reviews/product/:productId` - Xem danh sách đánh giá của sản phẩm.
- `POST /api/reviews` - Gửi đánh giá sao & nhận xét sản phẩm *(Yêu cầu Token)*.
- `GET /api/stats/admin` - Số liệu tổng quan toàn sàn cho Admin Dashboard.
- `GET /api/stats/seller` - Số liệu doanh thu & đơn hàng riêng cho Seller Dashboard.

---

## 6. Hướng Dẫn Vận Hành & Quản Trị Server (`150.95.104.244`)

### 6.1. Triển khai tự động từ máy Local (Windows)
Khi có thay đổi code ở `frontend` hoặc `backend`, chỉ cần chạy lệnh:
```bash
python deploy/pack_and_deploy.py
```
Script sẽ tự động:
1. Nén mã nguồn `backend` và `frontend`.
2. Upload lên `root@150.95.104.244:/opt/ecommerce/`.
3. Build Docker images mới, đồng bộ Harbor (nếu Harbor online) và khởi động lại containers.
4. Khởi tạo lại dữ liệu mẫu (nếu cần).

### 6.2. Các lệnh quản lý trực tiếp trên Server (`ssh root@150.95.104.244`)

- **Kiểm tra trạng thái các containers:**
  ```bash
  cd /opt/ecommerce && docker compose ps
  ```

- **Xem logs thời gian thực:**
  ```bash
  cd /opt/ecommerce
  docker compose logs -f backend
  docker compose logs -f frontend
  ```

- **Khởi động lại toàn bộ dịch vụ:**
  ```bash
  cd /opt/ecommerce && docker compose restart
  ```

- **Reset và nạp lại dữ liệu mẫu (Seed Database):**
  ```bash
  docker exec ecommerce_backend node dist/seed/seedData.js
  ```

- **Kiểm tra và khởi động lại Nginx:**
  ```bash
  nginx -t && systemctl reload nginx
  ```

- **Sao lưu (Backup) cơ sở dữ liệu MongoDB:**
  ```bash
  docker exec ecommerce_mongo mongodump --db ecommerce --out /data/db/backup_$(date +%F)
  ```
