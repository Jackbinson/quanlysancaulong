import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../App.css'; 

const LoginScreen = ({ onLoginSuccess }) => {
    const { login, loading, error } = useContext(AuthContext); 
    const [username, setUsername] = useState('user1'); 
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isRegister) {
            alert('Chức năng Đăng ký (Mock) thành công!');
            setIsRegister(false);
            return;
        }
        const success = await login(username, password);
        if (success && onLoginSuccess) {
            onLoginSuccess();
        }
    };

    return (
        <div className="app-container">
            <div className="login-wrapper">
                <div className="card-modern">
                    
                    {/* Header */}
                    <div className="login-header-bg">
                        <h1 className="login-title">Badminton Booking</h1>
                    </div>

                    <div className="login-body">
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
                                {isRegister ? 'Đăng Ký Tài Khoản' : 'Chào Mừng Trở Lại'}
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                                {isRegister ? 'Tham gia cộng đồng cầu lông ngay' : 'Đăng nhập để đặt sân nhanh chóng'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Username */}
                            <div className="form-group">
                                <label className="form-label">Tên đăng nhập</label>
                                <div className="input-icon-wrapper">
                                    <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <input
                                        type="text"
                                        className="input-modern"
                                        placeholder="Nhập tên đăng nhập"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="form-group">
                                <label className="form-label">Mật khẩu</label>
                                <div className="input-icon-wrapper">
                                    <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <input
                                        type="password"
                                        className="input-modern"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div style={{ padding: '10px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '15px', fontSize: '14px' }}>
                                    ⚠️ {error}
                                </div>
                            )}

                            {/* Button */}
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Đang xử lý...' : (isRegister ? 'Đăng Ký' : 'Đăng Nhập')}
                                {/* Đã fix cứng kích thước icon ở đây */}
                                {!loading && (
                                    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px', marginLeft: '8px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                )}
                            </button>
                        </form>

                        <div className="register-link">
                            {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
                            <button
                                onClick={() => setIsRegister(!isRegister)}
                                style={{ background: 'none', border: 'none', color: '#16a34a', fontWeight: '700', cursor: 'pointer', marginLeft: '5px', textDecoration: 'underline' }}
                            >
                                {isRegister ? 'Đăng nhập' : 'Đăng ký ngay'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;