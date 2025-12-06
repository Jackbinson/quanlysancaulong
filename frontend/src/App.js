import React, { useState, useContext, useEffect } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { MOCK_DB } from './api/mockApi';
import TopNav from './components/TopNav'; 
import Header from './components/Header'; 
import './App.css'; 

// --- IMPORT PAGES ---
import LoginScreen from './pages/LoginScreen';
import HomeScreen from './pages/HomeScreen';
import CourtDetailsScreen from './pages/CourtDetailsScreen';
import BookingScreen from './pages/BookingScreen';
import BookingSuccessScreen from './pages/BookingSuccessScreen';
import MyBookingsScreen from './pages/MyBookingsScreen';
import ProfileScreen from './pages/ProfileScreen';

// Admin & Staff
import AdminDashboardScreen from './pages/admin/AdminDashboardScreen';
import StaffDashboardScreen from './pages/admin/StaffDashboardScreen';

const App = () => {
    const { user, logout } = useContext(AuthContext);
    const [screen, setScreen] = useState('login'); // Mặc định là Login
    const [screenData, setScreenData] = useState({});

    // 1. LOGIC TỰ ĐỘNG CHUYỂN TRANG CHỦ THEO ROLE
    // Mỗi khi user đăng nhập, tự động đưa họ về "nhà" của họ
    useEffect(() => {
        if (user) {
            if (screen === 'login') {
                if (user.role === 'admin') setScreen('adminDashboard');
                else if (user.role === 'staff') setScreen('staffDashboard');
                else setScreen('home');
            }
        } else {
            setScreen('login');
        }
    }, [user, screen]);

    const navigateTo = (newScreen, data = {}) => {
        setScreen(newScreen);
        setScreenData(data);
        window.scrollTo(0, 0);
    };

    // 2. KHU VỰC MÀN HÌNH DÀNH RIÊNG CHO USER (KHÁCH HÀNG)
    const renderUserRoutes = () => {
        switch (screen) {
            case 'home': return <HomeScreen navigateTo={navigateTo} />;
            case 'courtDetails': return <CourtDetailsScreen courtId={screenData.courtId} navigateTo={navigateTo} />;
            case 'booking': return <BookingScreen courtId={screenData.courtId} navigateTo={navigateTo} />;
            case 'bookingSuccess': return <BookingSuccessScreen navigateTo={navigateTo} />;
            case 'myBookings': return <MyBookingsScreen navigateTo={navigateTo} />;
            case 'profile': return <ProfileScreen />;
            default: return <HomeScreen navigateTo={navigateTo} />; // Mặc định về Home
        }
    };

    // 3. KHU VỰC MÀN HÌNH DÀNH RIÊNG CHO STAFF (NHÂN VIÊN)
    const renderStaffRoutes = () => {
        switch (screen) {
            case 'staffDashboard': return <StaffDashboardScreen />;
            // Staff chỉ có 1 màn hình Dashboard chính (đã tích hợp mọi thứ)
            // Nếu có thêm màn hình con, thêm case ở đây
            default: return <StaffDashboardScreen />; 
        }
    };

    // 4. KHU VỰC MÀN HÌNH DÀNH RIÊNG CHO ADMIN (QUẢN TRỊ)
    const renderAdminRoutes = () => {
        switch (screen) {
            case 'adminDashboard': return <AdminDashboardScreen navigateTo={navigateTo} />;
            // Admin có thể vào xem giao diện Staff để kiểm tra (nếu muốn)
            case 'staffBooking': // Giữ lại để Admin có thể test tính năng Staff
            case 'staffDashboard': return <StaffDashboardScreen />;
            default: return <AdminDashboardScreen navigateTo={navigateTo} />;
        }
    };

    // 5. RENDER CHÍNH (MAIN SWITCH)
    // Dựa vào Role để quyết định dùng bộ Router nào
    const renderContent = () => {
        if (!user) return <LoginScreen onLoginSuccess={() => {}} />;
        
        switch (user.role) {
            case 'admin': return renderAdminRoutes();
            case 'staff': return renderStaffRoutes();
            default: return renderUserRoutes();
        }
    };

    // --- CẤU HÌNH HEADER & NAV ---
    
    // Tiêu đề Header
    const getScreenTitle = () => {
        const court = MOCK_DB.courts.find(c => c.id === screenData.courtId);
        if (screen === 'courtDetails') return court ? `Chi Tiết: ${court.name}` : 'Chi Tiết';
        if (screen === 'booking') return 'Đặt Sân';
        if (screen === 'profile') return 'Hồ Sơ Cá Nhân';
        if (screen === 'staffDashboard') return 'Cổng Nhân Viên';
        if (screen === 'adminDashboard') return 'Hệ Thống Quản Trị';
        return 'Badminton Booking';
    };

    // Điều kiện ẩn/hiện nút Back và TopNav
    const isLogin = !user || screen === 'login';
    
    // Chỉ hiện TopNav ở các trang chủ của từng Role
    const showTopNav = user && !isLogin; 

    // Chỉ hiện nút Back ở các trang con của User (Đặt sân, Chi tiết)
    // Admin và Staff dùng Dashboard nên ít khi cần nút Back của Header này
    const showBackHeader = 
        !isLogin && 
        user.role === 'user' && // Chỉ User mới cần header phụ này thường xuyên
        screen !== 'home' && 
        screen !== 'myBookings' && 
        screen !== 'profile';

    return (
        <div className={isLogin ? "login-page-container" : "app-container"}>
            
            {/* 1. MENU ĐIỀU HƯỚNG CHÍNH */}
            {showTopNav && (
                <TopNav 
                    currentScreen={screen} 
                    navigateTo={navigateTo} 
                    user={user}
                    onLogout={logout}
                />
            )}

            {/* 2. HEADER PHỤ (CHO TRANG CON) */}
            {showBackHeader && (
                <Header 
                    title={getScreenTitle()}
                    showBackButton={true}
                    onBack={() => navigateTo('home')} 
                    showAuthButton={false} 
                />
            )}
            
            {/* 3. NỘI DUNG CHÍNH (ĐÃ PHÂN TÁCH LUỒNG) */}
            <main style={{ width: '100%', flex: 1 }}>
                {renderContent()}
            </main>
        </div>
    );
};

export default function WrappedApp() {
    return (
        <AuthProvider>
            <App />
        </AuthProvider>
    );
}