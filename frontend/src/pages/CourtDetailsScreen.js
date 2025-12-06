import React from 'react';
import { MOCK_DB } from '../api/mockApi';
import '../App.css'; // Import CSS

const CourtDetailsScreen = ({ courtId, navigateTo }) => {
    // Tìm sân
    const court = MOCK_DB.courts.find(c => c.id === courtId);

    if (!court) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>Không tìm thấy sân này.</div>;
    }

    const isMaintenance = court.status !== 'Available' && court.status !== 'Đang mở';

    return (
        <div className="main-content" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '100px' }}>
            
            {/* 1. HEADER & ẢNH SÂN */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '40px' }}>
                
                {/* Cột trái: Ảnh to */}
                <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', height: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                    <img 
                        src={court.image} 
                        alt={court.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {e.target.src = 'https://via.placeholder.com/800x400?text=Sân+Cầu+Lông'}} 
                    />
                    <div className={`badge-status ${!isMaintenance ? 'badge-open' : 'badge-maintenance'}`} style={{ top: '20px', left: '20px', fontSize: '14px', padding: '6px 14px' }}>
                        {isMaintenance ? 'Đang bảo trì' : 'Đang mở cửa'}
                    </div>
                </div>

                {/* Cột phải: Thông tin chính */}
                <div className="card-modern" style={{ padding: '30px', height: 'fit-content' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', margin: '0 0 10px 0', lineHeight: '1.3' }}>
                        {court.name}
                    </h1>
                    
                    <div style={{ display: 'flex', alignItems: 'center', color: '#64748b', fontSize: '15px', marginBottom: '20px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00994C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        {court.address}
                    </div>

                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ color: '#64748b' }}>Giá thuê</span>
                            <span style={{ fontSize: '24px', fontWeight: '800', color: '#00994C' }}>
                                {court.price.toLocaleString()}đ<span style={{ fontSize: '14px', fontWeight: '500', color: '#9ca3af' }}>/giờ</span>
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#64748b' }}>Giờ mở cửa</span>
                            <span style={{ fontWeight: '600', color: '#111827' }}>05:00 - 22:00</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigateTo('booking', { courtId: court.id })}
                        disabled={isMaintenance}
                        className="btn-primary"
                        style={{ 
                            width: '100%', height: '54px', fontSize: '16px', 
                            background: isMaintenance ? '#9ca3af' : 'var(--primary-gradient)',
                            cursor: isMaintenance ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isMaintenance ? 'Tạm ngưng hoạt động' : 'Đặt Sân Ngay'}
                    </button>
                </div>
            </div>

            {/* 2. MÔ TẢ & TIỆN ÍCH (Full width bên dưới) */}
            <div className="card-modern" style={{ padding: '40px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '60px' }}>
                    
                    {/* Mô tả */}
                    <div>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '16px', borderLeft: '4px solid #00994C', paddingLeft: '12px' }}>
                            Giới thiệu sân
                        </h3>
                        <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#4b5563', textAlign: 'justify' }}>
                            {court.description || "Sân cầu lông tiêu chuẩn thi đấu, mặt sân thảm PVC chất lượng cao giúp giảm chấn thương, hệ thống ánh sáng chống chói mắt hiện đại. Không gian thoáng mát, có khu vực ngồi chờ rộng rãi, quầy nước giải khát và dịch vụ cho thuê vợt cầu lông."}
                        </p>
                    </div>

                    {/* Tiện ích */}
                    <div>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '16px', borderLeft: '4px solid #f59e0b', paddingLeft: '12px' }}>
                            Tiện ích
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                            {(court.features || ['Wifi miễn phí', 'Bãi giữ xe', 'Quầy nước', 'Tủ đồ', 'Cho thuê vợt']).map((feature, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#374151', background: '#f9fafb', padding: '10px 14px', borderRadius: '10px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00994C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default CourtDetailsScreen;