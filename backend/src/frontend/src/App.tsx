import React, { JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layouts
import UserLayout from './layouts/UserLayouts';
import AdminLayout from './layouts/AdminLayout';

// Views/Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/user/HomePage';
import RevenueDashboard from './pages/admin/RevenueDashBoard';
import BookingPage from './pages/booking/BookingPage';
import PaymentPage from './pages/payment/PaymentPage';
import VoucherManagementPage from './pages/vouchers/VoucherManagermentPage';
// Thêm các trang khác cần thiết

// Component để bảo vệ route
const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const { currentUser, isLoading } = useAuth(); // Đã sửa lỗi chính tả ở đây

    if (isLoading) {
        return <div>Loading...</div>; // Hoặc một spinner loading
    }

    // Nếu không có currentUser, chuyển hướng về trang login
    return currentUser ? children : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const { currentUser, isLoading } = useAuth(); // Đã sửa lỗi chính tả ở đây

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Nếu không có currentUser, chuyển hướng về trang login
    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    // Nếu currentUser không phải admin, chuyển hướng về trang chủ
    if (currentUser.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return children;
};


const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* User Routes (Protected by PrivateRoute) */}
                    <Route path="/" element={<UserLayout />}>
                        {/* Trang chủ mặc định */}
                        <Route index element={<PrivateRoute><HomePage /></PrivateRoute>} />
                        <Route path="home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
                        <Route path="booking" element={<PrivateRoute><BookingPage /></PrivateRoute>} />
                        <Route path="payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
                        {/* Thêm các route khác cho người dùng */}
                        {/* <Route path="profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} /> */}
                        {/* <Route path="history" element={<PrivateRoute><BookingHistoryPage /></PrivateRoute>} /> */}
                    </Route>

                    {/* Admin Routes (Protected by AdminRoute and AdminLayout) */}
                    <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                        <Route path="dashboard" element={<RevenueDashboard />} />
                        <Route path="vouchers" element={<VoucherManagementPage />} />
                        {/* Thêm các route khác cho admin */}
                        {/* <Route path="users" element={<UserManagementPage />} /> */}
                        {/* <Route path="courts" element={<CourtManagementPage />} /> */}
                    </Route>

                    {/* Redirect unknown routes to home or a 404 page */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;