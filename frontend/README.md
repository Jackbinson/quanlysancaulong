Thư mục này chứa mã nguồn frontend của dự án quanlysancaulong, được xây dựng bằng React + Create React App.

1️⃣ Yêu cầu hệ thống

Trước khi chạy frontend, bạn cần:

Node.js >= 16

npm >= 6

Kiểm tra bằng:

node -v
npm -v

2️⃣ Cài đặt dependencies (bao gồm react-scripts)

Trong thư mục frontend, chạy:

cd frontend
npm install


Lệnh này sẽ tự động cài tất cả thư viện trong package.json, bao gồm:

react

react-dom

react-scripts

các thư viện UI/API mà bạn thêm vào

Nếu react-scripts chưa được cài hoặc bị lỗi, bạn có thể chạy:

npm install react-scripts --save

3️⃣ Chạy dự án ở chế độ development
npm start


Ứng dụng sẽ chạy tại:

👉 http://localhost:3000

Trang web sẽ tự reload khi bạn chỉnh sửa mã nguồn.

4️⃣ Build sản phẩm để deploy
npm run build


Thư mục build/ sẽ được tạo để deploy lên server hoặc Nginx.

5️⃣ Chạy test (nếu sử dụng)
npm test

6️⃣ Cài thêm thư viện

Bạn có thể cài thư viện bất kỳ bằng npm:

📌 React Router
npm install react-router-dom

📌 Axios
npm install axios

📌 TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

📌 Redux Toolkit
npm install @reduxjs/toolkit react-redux

7️⃣ Cấu trúc thư mục Frontend
frontend/
│
├── node_modules/
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── pages/
│   ├── components/
│   ├── utils/
│   ├── setupTests.js
│   ├── reportWebVitals.js
│   ├── App.js
│   └── index.js
│
├── package.json
├── package-lock.json
└── README.md

🔍 Giải thích nhanh:

src/pages/ → các màn hình chính

src/components/ → các component dùng chung

src/utils/ → hằng số, hàm tiện ích

public/ → template HTML

package.json → danh sách thư viện + script

8️⃣ Các lệnh npm quan trọng
Lệnh	Chức năng
npm start	Chạy frontend
npm install	Cài thư viện
npm run build	Build để deploy
npm test	Chạy test
npm install <package>	Cài thư viện mới
9️⃣ Lỗi thường gặp
❌ react-scripts: command not found

Cách fix:

npm install react-scripts

❌ Lỗi Node version quá cao

Fix bằng nvm:

nvm install 18
nvm use 18
