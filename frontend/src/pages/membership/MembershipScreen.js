import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { mockApiCall } from '../../api/mockApi';
import { MOCK_API_BASE } from '../../utils/constants';
import '../../App.css'; 

const MembershipScreen = ({ navigateTo }) => {
    const { user, isAuthorized } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // DỮ LIỆU CỨNG (Để hiển thị luôn mà không cần chờ API)
    const packages = [
        {
            id: 1,
            name: 'Gói Cơ Bản (Silver)',
            price: 200000,
            duration: '1 Tháng',
            bg: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)', // Màu Bạc
            features: ['Giảm 5% khi đặt sân', 'Ưu tiên đặt trước 3 ngày', 'Miễn phí nước suối']
        },
        {
            id: 2,
            name: 'Gói Cao Cấp (Gold)',
            price: 500000,
            duration: '3 Tháng',
            bg: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)', // Màu Vàng
            features: ['Giảm 10% khi đặt sân', 'Ưu tiên đặt trước 7 ngày', 'Tủ đồ cá nhân miễn phí', 'Miễn phí thuê vợt']
        },
        {
            id: 3,
            name: 'Gói V.I.P (Diamond)',
            price: 1500000,
            duration: '1 Năm',
            bg: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', // Màu Kim Cương
            features: ['Giảm 20% toàn hệ thống', 'Đặt sân bất kỳ lúc nào', 'Huấn luyện viên kèm 2 buổi', 'Nước uống không giới hạn']
        }
    ];

    const handleSubscribe = async (membershipId) => {
        if (user.isMember) {
            setMessage({ type: 'error', text: 'Bạn đã là thành viên VIP rồi.' });
            return;
        }
        setLoading(true);
        setMessage(null);
        try {
            await mockApiCall('POST', `${MOCK_API_BASE}/memberships/subscribe`, { membershipId });
            setMessage({ type: 'success', text: 'Đăng ký thành công! Bạn đã là thành viên VIP.' });
        } catch (err) { 
            setMessage({ type: 'error', text: err.message }); 
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div className="main-content" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>Gói Thành Viên</h2>
                <p style={{ color: '#6b7280' }}>Nâng cấp tài khoản để nhận ưu đãi giảm giá và tiện ích đặc biệt</p>
            </div>

            {/* Thông báo */}
            {message && (
                <div style={{
                    padding: '12px 16px', borderRadius: '12px', marginBottom: '24px',
                    backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
                    color: message.type === 'success' ? '#059669' : '#dc2626',
                    border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
                    fontWeight: '500', textAlign: 'center'
                }}>
                    {message.text}
                </div>
            )}

            {/* Nút Admin */}
            {isAuthorized && isAuthorized(['admin']) && (
                <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                    <button 
                        onClick={() => navigateTo('adminMembership')} 
                        className="btn-primary" 
                        style={{ width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '14px' }}
                    >
                        ⚙️ Quản lý gói (Admin)
                    </button>
                </div>
            )}

            {/* Danh sách Gói (Grid Layout) */}
            <div className="court-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                {packages.map((pkg) => (
                    <div key={pkg.id} className="court-card-web" style={{ overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                        
                        {/* Header Card (Màu sắc) */}
                        <div style={{ background: pkg.bg, padding: '30px 20px', textAlign: 'center', color: 'white' }}>
                            <h3 style={{ margin: '0', fontSize: '22px', fontWeight: '800', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{pkg.name}</h3>
                            <div style={{ fontSize: '32px', fontWeight: '800', marginTop: '10px' }}>
                                {pkg.price.toLocaleString()}đ
                            </div>
                            <div style={{ fontSize: '14px', opacity: 0.9, fontWeight: '500' }}>
                                / {pkg.duration}
                            </div>
                        </div>

                        {/* Body Card */}
                        <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px' }}>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', flex: 1 }}>
                                {pkg.features.map((feature, idx) => (
                                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px', color: '#374151', fontSize: '14px', lineHeight: '1.5' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00994C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            
                            <button 
                                onClick={() => handleSubscribe(pkg.id)}
                                disabled={loading || user.isMember}
                                className="btn-primary"
                                style={{ 
                                    width: '100%', 
                                    background: user.isMember ? '#e2e8f0' : 'var(--primary)',
                                    color: user.isMember ? '#94a3b8' : 'white',
                                    cursor: user.isMember ? 'not-allowed' : 'pointer',
                                    boxShadow: user.isMember ? 'none' : '0 4px 12px rgba(0, 153, 76, 0.3)'
                                }}
                            >
                                {loading ? 'Đang xử lý...' : user.isMember ? 'Đã Sở Hữu' : 'Đăng Ký Ngay'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MembershipScreen;