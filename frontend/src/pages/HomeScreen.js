import React, { useState, useEffect } from 'react';
import { mockApiCall, MOCK_DB } from '../api/mockApi';
import { MOCK_API_BASE } from '../utils/constants';
import CourtCard from '../components/CourtCard';
import '../App.css'; 

const HomeScreen = ({ navigateTo }) => {
    const [courts, setCourts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        mockApiCall('GET', `${MOCK_API_BASE}/courts`)
            .then(res => setCourts(res.courts || MOCK_DB.courts))
            .catch(() => setCourts(MOCK_DB.courts));
    }, []);

    const filteredCourts = courts.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );  

    return (
        <div className="main-content" style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '30px' }}>
            
            {/* 1. BANNER TÌM KIẾM (Đẹp hơn, thay thế cho Navbar cũ) */}
            <div style={{ 
                background: 'linear-gradient(135deg, #00994C 0%, #059669 100%)', 
                borderRadius: '20px', 
                padding: '40px', 
                textAlign: 'center', 
                color: 'white',
                marginBottom: '40px',
                boxShadow: '0 10px 25px -5px rgba(0, 153, 76, 0.4)'
            }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 10px 0' }}>Đặt Sân Cầu Lông Nhanh Chóng</h1>
                <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '24px' }}>Tìm kiếm và đặt lịch sân gần bạn chỉ với vài cú click</p>
                
                {/* Ô tìm kiếm to đẹp */}
                <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                    <input 
                        type="text" 
                        placeholder="Tìm tên sân, khu vực..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ 
                            width: '100%', 
                            padding: '16px 20px 16px 50px', 
                            borderRadius: '50px', 
                            border: 'none', 
                            fontSize: '16px', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            outline: 'none'
                        }}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>
                        <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <button style={{
                        position: 'absolute', right: '6px', top: '6px', bottom: '6px',
                        background: '#111827', color: 'white', border: 'none',
                        padding: '0 24px', borderRadius: '40px', fontWeight: '600', cursor: 'pointer'
                    }}>
                        Tìm kiếm
                    </button>
                </div>
            </div>

            {/* 2. DANH SÁCH SÂN */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', padding: '0 10px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: 0 }}>Danh sách sân nổi bật</h2>
                <span style={{ color: '#00994C', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>Xem tất cả &rarr;</span>
            </div>

            <div className="court-grid">
                {filteredCourts.length > 0 ? (
                    filteredCourts.map(court => (
                        <CourtCard
                            key={court.id}
                            court={court}
                            onBook={() => navigateTo('booking', { courtId: court.id })}
                            onViewDetails={() => navigateTo('courtDetails', { courtId: court.id })}
                        />
                    ))
                ) : (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                        <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔍</div>
                        <p>Không tìm thấy sân nào phù hợp với từ khóa "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeScreen;