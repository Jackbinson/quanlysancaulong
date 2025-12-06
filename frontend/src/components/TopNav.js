import React, { useState } from 'react';
import '../App.css'; // Import CSS chung

const TopNav = ({ currentScreen, navigateTo, user, onLogout }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Không hiển thị Nav ở trang Login
    if (currentScreen === 'login') return null;

    const navItems = [
        { 
            id: 'home', 
            label: 'Trang chủ', 
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        },
        { 
            id: 'myBookings', 
            label: 'Lịch sử', 
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        },
    ];

    const handleProfileClick = () => {
        const target = user?.role === 'admin' ? 'adminDashboard' : 'profile';
        navigateTo(target);
        setIsDropdownOpen(false);
    };

    return (
        <div className="top-nav">
            <div className="nav-content">
                {/* 1. Logo Brand */}
                <div className="brand-logo" onClick={() => navigateTo('home')}>
                    <div className="logo-box">B</div>
                    <span className="brand-text">Badminton</span>
                </div>

                {/* 2. Menu Items & User */}
                <div className="nav-menu">
                    {navItems.map((item) => {
                        const isActive = currentScreen === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigateTo(item.id)}
                                className={`nav-item ${isActive ? 'active' : ''}`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        );
                    })}

                    <div className="divider"></div>

                    {/* 3. KHU VỰC TÀI KHOẢN */}
                    <div 
                        style={{ position: 'relative', marginLeft: '8px', height: '100%', display: 'flex', alignItems: 'center' }}
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        {/* Nút hiển thị User */}
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px', 
                            cursor: 'pointer',
                            padding: '6px 12px',
                            borderRadius: '30px',
                            backgroundColor: isDropdownOpen ? '#f3f4f6' : 'transparent',
                            transition: 'all 0.2s',
                            position: 'relative',
                            zIndex: 1001 // Đảm bảo nút nằm trên
                        }}>
                            <div style={{
                                width: '38px', height: '38px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #00994C 0%, #007a3d 100%)',
                                color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', fontSize: '16px',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}>
                                {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>
                                    {user?.username || 'Khách'}
                                </span>
                                <span style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>
                                    {user?.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                                </span>
                            </div>

                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>

                        {/* MENU THẢ XUỐNG (Đã sửa lỗi không hover được) */}
                        {isDropdownOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '100%', // Bắt đầu ngay dưới nút
                                right: '0',
                                width: '240px',
                                paddingTop: '10px', // FIX: Tạo vùng đệm vô hình để chuột không bị mất focus
                                zIndex: 1000,
                            }}>
                                {/* Hộp nội dung thực sự của menu */}
                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: '16px',
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid #f3f4f6',
                                    padding: '8px',
                                    animation: 'fadeIn 0.2s ease-out'
                                }}>
                                    {/* Nút Hồ sơ */}
                                    <button 
                                        onClick={handleProfileClick}
                                        style={{
                                            width: '100%', textAlign: 'left',
                                            padding: '12px',
                                            background: 'transparent', border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                            fontSize: '14px', fontWeight: '500', color: '#374151'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <div style={{ padding: '6px', background: '#ecfdf5', borderRadius: '6px', color: '#059669' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        </div>
                                        {user?.role === 'admin' ? 'Trang quản trị' : 'Hồ sơ cá nhân'}
                                    </button>
                                    
                                    <div style={{ height: '1px', background: '#f3f4f6', margin: '6px 0' }}></div>

                                    {/* Nút Đăng xuất */}
                                    <button 
                                        onClick={onLogout}
                                        style={{
                                            width: '100%', textAlign: 'left',
                                            padding: '12px',
                                            background: 'transparent', border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                            fontSize: '14px', fontWeight: '500', color: '#ef4444'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <div style={{ padding: '6px', background: '#fef2f2', borderRadius: '6px', color: '#ef4444' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                        </div>
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default TopNav;