import React, { useState, useContext, useEffect } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
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
    const [screen, setScreen] = useState('login'); 
    
    // screenData sẽ chứa: { courtId: 1, courtName: "Sân A", ... }
    const [screenData, setScreenData] = useState({});

    // 1. LOGIC TỰ ĐỘNG CHUYỂN TRANG CHỦ THEO ROLE
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

    // 2. USER ROUTES
    const renderUserRoutes = () => {
        switch (screen) {
            case 'home': return <HomeScreen navigateTo={navigateTo} />;
            case 'courtDetails': return <CourtDetailsScreen courtId={screenData.courtId} navigateTo={navigateTo} />;
            case 'booking': return <BookingScreen courtId={screenData.courtId} courtName={screenData.courtName} navigateTo={navigateTo} />;
            case 'bookingSuccess': return <BookingSuccessScreen navigateTo={navigateTo} />;
            case 'myBookings': return <MyBookingsScreen navigateTo={navigateTo} />;
            case 'profile': return <ProfileScreen />;
            default: return <HomeScreen navigateTo={navigateTo} />;
        }
    };

    // 3. STAFF ROUTES
    const renderStaffRoutes = () => {
        switch (screen) {
            case 'staffDashboard': return <StaffDashboardScreen />;
            default: return <StaffDashboardScreen />; 
        }
    };

    // 4. ADMIN ROUTES
    const renderAdminRoutes = () => {
        switch (screen) {
            case 'adminDashboard': return <AdminDashboardScreen navigateTo={navigateTo} />;
            case 'staffBooking': 
            case 'staffDashboard': return <StaffDashboardScreen />;
            default: return <AdminDashboardScreen navigateTo={navigateTo} />;
        }
    };

    // 5. RENDER CHÍNH
    const renderContent = () => {
        if (!user) return <LoginScreen onLoginSuccess={() => {}} />;
        
        switch (user.role) {
            case 'admin': return renderAdminRoutes();
            case 'staff': return renderStaffRoutes();
            default: return renderUserRoutes();
        }
    };

    // --- CẤU HÌNH HEADER ---
    
    // CẬP NHẬT: Lấy tên sân từ screenData thay vì tra cứu MOCK_DB
    const getScreenTitle = () => {
        if (screen === 'courtDetails') return screenData.courtName ? `Chi Tiết: ${screenData.courtName}` : 'Chi Tiết Sân';
        if (screen === 'booking') return 'Đặt Sân';
        if (screen === 'profile') return 'Hồ Sơ Cá Nhân';
        if (screen === 'staffDashboard') return 'Cổng Nhân Viên';
        if (screen === 'adminDashboard') return 'Hệ Thống Quản Trị';
        return 'Badminton Booking';
    };

    const isLogin = !user || screen === 'login';
    const showTopNav = user && !isLogin; 
    const showBackHeader = !isLogin && user.role === 'user' && screen !== 'home' && screen !== 'myBookings' && screen !== 'profile';

    return (
        <div className={isLogin ? "login-page-container" : "app-container"}>
            {/* MENU CHÍNH */}
            {showTopNav && (
                <TopNav currentScreen={screen} navigateTo={navigateTo} user={user} onLogout={logout} />
            )}

            {/* HEADER PHỤ */}
            {showBackHeader && (
                <Header 
                    title={getScreenTitle()}
                    showBackButton={true}
                    onBack={() => navigateTo('home')} 
                    showAuthButton={false} 
                />
            )}
            
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