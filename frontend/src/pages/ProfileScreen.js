import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../App.css'; // Import CSS chung

const ProfileScreen = () => {
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('history'); // Mặc định hiển thị Lịch sử

    // --- NỘI DUNG BÊN PHẢI (Thay đổi theo Tab) ---
    const renderContent = () => {
        switch (activeTab) {
            case 'settings':
                return (
                    <div>
                        <div className="content-header"><h2 className="content-title">Cài đặt tài khoản</h2></div>
                        <form className="profile-form">
                            <div className="form-group">
                                <label className="form-label">Tên hiển thị</label>
                                <input type="text" className="input-modern" defaultValue={user?.username} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input type="email" className="input-modern" defaultValue={user?.email || "user@example.com"} disabled style={{background: '#f9fafb'}} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Số điện thoại</label>
                                <input type="text" className="input-modern" placeholder="Thêm số điện thoại" />
                            </div>
                            <button className="btn-primary" style={{width: 'auto', padding: '10px 30px', marginTop: '10px'}}>Lưu thay đổi</button>
                        </form>
                    </div>
                );

            case 'history':
                return (
                    <div>
                        <div className="content-header"><h2 className="content-title">Lịch sử đặt sân</h2></div>
                        <div style={{textAlign: 'center', padding: '60px 0', color: '#6b7280'}}>
                            <div style={{fontSize: '48px', marginBottom: '16px'}}>📅</div>
                            <p style={{fontSize: '16px', marginBottom: '20px'}}>Bạn chưa có lịch đặt sân nào.</p>
                            <button className="btn-primary" style={{width: 'auto', background: 'white', color: '#00994C', border: '1px solid #00994C'}}>
                                Đặt sân ngay &rarr;
                            </button>
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div>
                        <div className="content-header"><h2 className="content-title">Thông báo</h2></div>
                        <div>
                            <div style={{padding: '20px', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'flex-start'}}>
                                <div style={{width: '40px', height: '40px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '20px'}}>🎉</div>
                                <div>
                                    <div style={{fontWeight: '700', color: '#111827', marginBottom: '4px'}}>Chào mừng thành viên mới!</div>
                                    <div style={{fontSize: '14px', color: '#6b7280', lineHeight: '1.5'}}>Cảm ơn bạn đã tham gia hệ thống. Hãy đặt sân ngay để trải nghiệm dịch vụ tốt nhất.</div>
                                    <div style={{fontSize: '12px', color: '#9ca3af', marginTop: '8px'}}>Vừa xong</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'vouchers': // <--- MỚI: KHO ƯU ĐÃI
                return (
                    <div>
                        <div className="content-header"><h2 className="content-title">Kho Ưu Đãi & Voucher</h2></div>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px'}}>
                            {/* Voucher 1 */}
                            <div style={{border: '1px dashed #00994C', borderRadius: '12px', padding: '20px', background: '#f0fdf4', position: 'relative'}}>
                                <div style={{position: 'absolute', top: 0, left: 0, background: '#00994C', color: 'white', padding: '4px 10px', fontSize: '11px', fontWeight: 'bold', borderBottomRightRadius: '10px'}}>MỚI</div>
                                <h3 style={{margin: '10px 0 5px', color: '#166534', fontSize: '16px', fontWeight: '700'}}>Giảm 20%</h3>
                                <p style={{fontSize: '13px', color: '#15803d', marginBottom: '15px'}}>Cho lần đặt sân đầu tiên.</p>
                                <button className="btn-primary" style={{width: '100%', height: '36px', fontSize: '13px'}}>Dùng ngay</button>
                            </div>
                            {/* Voucher 2 */}
                            <div style={{border: '1px dashed #eab308', borderRadius: '12px', padding: '20px', background: '#fefce8'}}>
                                <h3 style={{margin: '0 0 5px', color: '#854d0e', fontSize: '16px', fontWeight: '700'}}>Tặng nước suối</h3>
                                <p style={{fontSize: '13px', color: '#a16207', marginBottom: '15px'}}>Miễn phí 2 chai nước khi check-in.</p>
                                <button className="btn-primary" style={{width: '100%', height: '36px', fontSize: '13px', background: '#eab308'}}>Dùng ngay</button>
                            </div>
                        </div>
                    </div>
                );

            case 'courses': // <--- MỚI: KHÓA HỌC
                return (
                    <div>
                        <div className="content-header"><h2 className="content-title">Khóa học của tôi</h2></div>
                        <div style={{textAlign: 'center', padding: '60px 0', color: '#6b7280'}}>
                            <div style={{fontSize: '48px', marginBottom: '16px'}}>🎓</div>
                            <p>Bạn chưa đăng ký khóa học nào.</p>
                            <button className="btn-primary" style={{width: 'auto', marginTop: '20px', background: 'white', color: '#00994C', border: '1px solid #00994C'}}>
                                Tìm khóa học &rarr;
                            </button>
                        </div>
                    </div>
                );

            default: return null;
        }
    };

    return (
        <div className="profile-wrapper">
            
            {/* --- SIDEBAR TRÁI --- */}
            <div className="profile-sidebar">
                
                {/* 1. Card User */}
                <div className="user-summary-card">
                    <div className="user-avatar-circle">
                        {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                        <div style={{fontWeight: '700', fontSize: '16px', color: '#111827'}}>{user?.username || 'User'}</div>
                        <div style={{fontSize: '13px', color: '#6b7280'}}>Thành viên</div>
                    </div>
                </div>

                {/* 2. Banner Hạng thành viên */}
                <div className="membership-card">
                    <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                        <span style={{fontSize:'18px'}}>💎</span> Hạng thành viên
                    </div>
                    <span>Silver</span>
                </div>

                {/* --- (ĐÃ XÓA 4 Ô VUÔNG Ở ĐÂY) --- */}

                {/* 3. Menu Hoạt động */}
                <div className="menu-section-title">Hoạt động</div>
                <div className="menu-card-group">
                    <div className={`menu-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                        <div className="menu-item-left"><span style={{color: '#00994C'}}>📅</span> Lịch đã đặt</div>
                        <svg width="16" height="16" stroke="currentColor" fill="none" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                    
                    <div className={`menu-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
                        <div className="menu-item-left"><span style={{color: '#00994C'}}>🔔</span> Thông báo</div>
                        <svg width="16" height="16" stroke="currentColor" fill="none" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>

                    {/* Mục Ưu Đãi Mới */}
                    <div className={`menu-item ${activeTab === 'vouchers' ? 'active' : ''}`} onClick={() => setActiveTab('vouchers')}>
                        <div className="menu-item-left"><span style={{color: '#eab308'}}>🎁</span> Kho Ưu Đãi</div>
                        <svg width="16" height="16" stroke="currentColor" fill="none" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>

                    {/* Mục Khóa Học Mới */}
                    <div className={`menu-item ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>
                        <div className="menu-item-left"><span style={{color: '#00994C'}}>🎓</span> Khóa học</div>
                        <svg width="16" height="16" stroke="currentColor" fill="none" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                </div>

                {/* 4. Menu Hệ thống */}
                <div className="menu-section-title">Hệ thống</div>
                <div className="menu-card-group">
                    <div className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                        <div className="menu-item-left"><span style={{color: '#00994C'}}>⚙️</span> Cài đặt tài khoản</div>
                        <svg width="16" height="16" stroke="currentColor" fill="none" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                    <div className="menu-item" onClick={logout} style={{color: '#ef4444'}}>
                        <div className="menu-item-left"><span>🚪</span> Đăng xuất</div>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT PHẢI --- */}
            <div className="profile-main-content animate-fade-in">
                <div className="content-body" style={{padding: 0}}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;