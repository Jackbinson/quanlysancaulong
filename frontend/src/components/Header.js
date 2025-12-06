import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../App.css'; // Import CSS chung

const Header = ({ title, showBackButton, onBack, showAuthButton = true }) => {
    const { user, logout } = useContext(AuthContext);

    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            backgroundColor: 'white',
            color: '#111827', // Màu chữ đen xám
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 90,
            borderBottom: '1px solid #e5e7eb'
        }}>
            {/* Phần tiêu đề và nút Back */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {showBackButton && (
                    <button 
                        onClick={onBack} 
                        style={{
                            width: '36px', height: '36px',
                            borderRadius: '10px',
                            border: '1px solid #e5e7eb',
                            background: 'transparent',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#374151',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = '#f3f4f6';
                            e.currentTarget.style.borderColor = '#d1d5db';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                        }}
                    >
                        {/* Icon ChevronLeft (Back) */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                )}
                <h1 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>{title}</h1>
            </div>

            {/* Phần Auth (nếu cần hiển thị) */}
            {showAuthButton && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {user && (
                         <div style={{
                             display: 'flex', alignItems: 'center', gap: '6px',
                             fontSize: '12px',
                             backgroundColor: '#f3f4f6',
                             borderRadius: '20px',
                             padding: '6px 12px',
                             color: '#4b5563',
                             fontWeight: '600'
                         }} title={`Phone: ${user.phone}`}>
                            {/* Icon User */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            <span style={{ textTransform: 'capitalize' }}>{user.role}</span>
                        </div>
                    )}
                    {user ? (
                        <button 
                            onClick={logout} 
                            style={{
                                width: '36px', height: '36px',
                                background: '#fee2e2', // Đỏ nhạt
                                color: '#ef4444', // Đỏ đậm
                                borderRadius: '50%',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: '0.2s'
                            }}
                            title="Đăng xuất"
                        >
                            {/* Icon LogOut */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        </button>
                    ) : (
                        <button 
                            onClick={onBack} 
                            style={{
                                width: '36px', height: '36px',
                                background: '#dcfce7', // Xanh nhạt
                                color: '#16a34a', // Xanh đậm
                                borderRadius: '50%',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: '0.2s'
                            }}
                            title="Đăng nhập"
                        >
                            {/* Icon LogIn */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                        </button>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;