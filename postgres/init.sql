-- BƯỚC 1: TẠO USER (ROLE) AN TOÀN CHO ỨNG DỤNG
-- LƯU Ý: Lệnh này phải được chạy bởi Superuser (postgres)
CREATE ROLE qlscl_app_user WITH LOGIN PASSWORD 'batminton123';

-- BƯỚC 2: TẠO TẤT CẢ CÁC BẢNG (TABLES)

-- 1. Bảng quản lý người dùng
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone_number VARCHAR(15),
    role VARCHAR(50) NOT NULL DEFAULT 'user', -- user, staff, admin
    membership_id INT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng quản lý gói thành viên
CREATE TABLE memberships (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    discount_percent INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration_days INT NOT NULL,
    description TEXT
);

-- 3. Bảng quản lý sân cầu
CREATE TABLE courts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- Sân 1, Sân 2, ...
    hourly_rate DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'available' -- available, maintenance, booked
);

-- 4. Bảng lịch đặt sân
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) NOT NULL,
    court_id INT REFERENCES courts(id) NOT NULL,
    start_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    end_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    deposit DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, confirmed, checked_in, canceled
    staff_checkin_id INT REFERENCES users(id) -- Staff nào check-in
);

-- 5. Bảng ghi nhận thanh toán
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES bookings(id), -- Nullable nếu thanh toán gói thành viên
    user_id INT REFERENCES users(id) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_type VARCHAR(50), -- deposit, full, membership
    payment_status VARCHAR(50) NOT NULL DEFAULT 'completed',
    transaction_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Bảng thông báo/Bản tin
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    type VARCHAR(50) NOT NULL, -- confirmation, marketing
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- BƯỚC 3: THÊM DỮ LIỆU MẪU (Cho việc Demo)
INSERT INTO memberships (name, discount_percent, price, duration_days) VALUES
('VIP Monthly', 20, 500000.00, 30);
INSERT INTO courts (name, hourly_rate) VALUES
('Sân A', 80000.00), ('Sân B', 90000.00), ('Sân C', 80000.00), ('Sân D', 90000.00);
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@example.com', 'hashed_admin_pass', 'Nguyễn Văn Admin', 'admin'),
('staff@example.com', 'hashed_staff_pass', 'Trần Thị Staff', 'staff'),
('user@example.com', 'hashed_user_pass', 'Lê Khách Hàng', 'user');


-- BƯỚC 4: CẤP QUYỀN AN TOÀN CHO USER ỨNG DỤNG (qlscl_app_user)
-- Cấp quyền sử dụng trên schema public (nơi các bảng vừa được tạo)
GRANT USAGE ON SCHEMA public TO qlscl_app_user;
-- Cấp quyền truy cập (SELECT, INSERT, UPDATE, DELETE) trên TẤT CẢ TABLE cho user đó
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO qlscl_app_user;
-- Cấp quyền sử dụng SEQUENCE (để tạo ID tự động)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO qlscl_app_user;