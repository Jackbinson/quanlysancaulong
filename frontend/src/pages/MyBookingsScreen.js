import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { mockApiCall, MOCK_DB } from '../api/mockApi'; 
import { MOCK_API_BASE } from '../utils/constants';
import '../App.css'; // Import CSS chung

const MyBookingsScreen = ({ navigateTo }) => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) return;
            try {
                // Gọi API lấy danh sách booking
                const res = await mockApiCall('GET', `${MOCK_API_BASE}/bookings`);
                // Lọc booking của user hiện tại (Logic giả định cho Mock)
                const userBookings = res.bookings || [];
                setBookings(userBookings);
            } catch (err) {
                console.error("Lỗi tải lịch sử:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [user]);

    const handleCancel = (id) => {
        if(window.confirm('Bạn có chắc muốn hủy lịch này không?')) {
            // Giả lập xóa khỏi danh sách
            setBookings(bookings.filter(b => b.id !== id));
            alert(`Đã hủy đơn ${id.slice(0,6)} thành công!`);
        }
    };

    const formatDate = (dateStr) => {
        if(!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className="main-content" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>
            
            {/* Header Title */}
            <div style={{ marginBottom: '30px', borderBottom: '1px solid #e5e7eb', paddingBottom: '20px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', margin: 0 }}>Lịch Sử Đặt Sân</h2>
                <p style={{ color: '#6b7280', marginTop: '8px' }}>Quản lý các lịch đặt sân sắp tới và đã hoàn thành của bạn.</p>
            </div>

            {/* Nội dung chính */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Đang tải dữ liệu...</div>
            ) : bookings.length === 0 ? (
                // --- EMPTY STATE (Khi chưa có lịch) ---
                <div className="card-modern" style={{ textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ 
                        width: '80px', height: '80px', background: '#f3f4f6', borderRadius: '50%', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
                        fontSize: '40px'
                    }}>
                        📅
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#374151', margin: '0 0 8px 0' }}>Chưa có lịch đặt nào</h3>
                    <p style={{ color: '#9ca3af', marginBottom: '24px' }}>Bạn chưa đặt sân nào cả. Hãy đặt sân ngay để trải nghiệm nhé!</p>
                    
                    <button 
                        onClick={() => navigateTo('home')}
                        className="btn-primary"
                        style={{ width: 'auto', padding: '12px 30px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        Đặt sân ngay
                    </button>
                </div>
            ) : (
                // --- LIST BOOKINGS ---
                <div style={{ display: 'grid', gap: '20px' }}>
                    {bookings.map((booking) => {
                        // Tìm tên sân từ ID
                        const courtName = MOCK_DB.courts.find(c => c.id === booking.courtId)?.name || 'Sân Cầu Lông';
                        
                        return (
                            <div key={booking.id} className="card-modern" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                                {/* Thông tin bên trái */}
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <span style={{ 
                                            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                                            background: booking.status === 'confirmed' ? '#dcfce7' : '#f3f4f6',
                                            color: booking.status === 'confirmed' ? '#166534' : '#6b7280',
                                            textTransform: 'uppercase'
                                        }}>
                                            {booking.status === 'confirmed' ? 'Thành công' : 'Chờ xác nhận'}
                                        </span>
                                        <span style={{ fontSize: '13px', color: '#9ca3af', fontFamily: 'monospace' }}>#{booking.id.slice(0, 8)}</span>
                                    </div>
                                    
                                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 6px 0' }}>
                                        {courtName}
                                    </h3>
                                    <div style={{ fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                            {formatDate(booking.date)}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                            {booking.timeSlot}
                                        </span>
                                    </div>
                                </div>

                                {/* Giá tiền & Hành động bên phải */}
                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#00994C' }}>
                                        {booking.totalAmount?.toLocaleString()} đ
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button 
                                            onClick={() => handleCancel(booking.id)}
                                            style={{ 
                                                background: 'white', border: '1px solid #fee2e2', color: '#ef4444', 
                                                padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', 
                                                fontSize: '13px', fontWeight: '600', transition: 'all 0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = '#fef2f2'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                        >
                                            Hủy
                                        </button>
                                        <button 
                                            className="btn-book-web"
                                            onClick={() => navigateTo('courtDetails', { courtId: booking.courtId })}
                                        >
                                            Đặt lại
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyBookingsScreen;