import React, { useState, useEffect } from 'react';
import { mockApiCall } from '../../api/mockApi';
import { MOCK_API_BASE, TIME_SLOTS } from '../../utils/constants';
import '../../App.css'; // Import CSS chung

const StaffBookingScreen = () => {
    // Data State
    const [courts, setCourts] = useState([]);
    
    // Form State
    const [bookingData, setBookingData] = useState({
        clientName: '',
        clientPhone: '',
        courtId: '',
        date: new Date().toISOString().split('T')[0], // Mặc định hôm nay
        timeSlot: TIME_SLOTS[0].slot,
        paymentStatus: 'paid' // Mặc định là khách trả tiền ngay
    });

    // UI State
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // 1. Lấy danh sách sân
    useEffect(() => {
        const fetchCourts = async () => {
            try {
                const res = await mockApiCall('GET', `${MOCK_API_BASE}/courts`);
                // Chỉ lấy sân đang hoạt động (không bảo trì)
                const activeCourts = res.courts.filter(c => c.status !== 'Maintenance');
                setCourts(activeCourts);
                
                // Tự động chọn sân đầu tiên
                if (activeCourts.length > 0) {
                    setBookingData(prev => ({ ...prev, courtId: activeCourts[0].id }));
                }
            } catch (e) {
                console.error("Lỗi tải sân:", e);
            }
        };
        fetchCourts();
    }, []);

    // 2. Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookingData(prev => ({ ...prev, [name]: value }));
    };

    // 3. Tính tổng tiền Real-time
    const calculateTotal = () => {
        const court = courts.find(c => c.id === bookingData.courtId);
        const slot = TIME_SLOTS.find(s => s.slot === bookingData.timeSlot);
        if (!court || !slot) return 0;
        // Giá sân * thời lượng slot
        return court.price * slot.duration; 
    };

    // 4. Xử lý Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // Validate cơ bản
            if (!bookingData.clientName || !bookingData.clientPhone) {
                throw new Error("Vui lòng nhập tên và số điện thoại khách hàng!");
            }

            const totalAmount = calculateTotal();

            // Gọi API (Mock)
            await mockApiCall('POST', `${MOCK_API_BASE}/bookings/staff-create`, {
                ...bookingData,
                totalAmount: totalAmount,
                depositAmount: bookingData.paymentStatus === 'paid' ? totalAmount : 0,
                createdBy: 'Staff'
            });

            setMessage({ type: 'success', text: `✅ Đặt sân thành công cho khách: ${bookingData.clientName}` });
            
            // Reset form (Giữ lại ngày và sân để đặt tiếp cho nhanh)
            setBookingData(prev => ({
                ...prev,
                clientName: '',
                clientPhone: '',
                paymentStatus: 'paid'
            }));

        } catch (err) {
            setMessage({ type: 'error', text: `❌ Lỗi: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-content" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            
            {/* Tiêu đề trang */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>Đặt Sân Tại Quầy</h2>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Dành cho nhân viên tiếp nhận khách vãng lai hoặc qua điện thoại</p>
                </div>
            </div>

            {/* Thông báo */}
            {message && (
                <div style={{
                    padding: '12px 16px', borderRadius: '12px', marginBottom: '20px',
                    backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
                    color: message.type === 'success' ? '#059669' : '#dc2626',
                    border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
                    fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                    {message.text}
                </div>
            )}

            <div className="profile-wrapper" style={{ gridTemplateColumns: '2fr 1fr', margin: 0, padding: 0, maxWidth: '100%', gap: '24px' }}>
                
                {/* CỘT TRÁI: FORM NHẬP LIỆU */}
                <div className="card-modern" style={{ padding: '24px' }}>
                    <form onSubmit={handleSubmit}>
                        {/* Nhóm 1: Thông tin khách */}
                        <div style={{ marginBottom: '24px' }}>
                            <div className="menu-section-title">1. Thông tin khách hàng</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Họ tên khách <span style={{color:'red'}}>*</span></label>
                                    <input 
                                        type="text" name="clientName"
                                        className="input-modern" placeholder="VD: Anh Nam"
                                        value={bookingData.clientName} onChange={handleChange} required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Số điện thoại <span style={{color:'red'}}>*</span></label>
                                    <input 
                                        type="text" name="clientPhone"
                                        className="input-modern" placeholder="09xxxx"
                                        value={bookingData.clientPhone} onChange={handleChange} required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Nhóm 2: Thông tin sân */}
                        <div style={{ marginBottom: '24px' }}>
                            <div className="menu-section-title">2. Chọn sân & Thời gian</div>
                            <div className="form-group">
                                <label className="form-label">Chọn sân</label>
                                <select 
                                    name="courtId" className="input-modern" style={{background: 'white'}}
                                    value={bookingData.courtId} onChange={handleChange}
                                >
                                    {courts.map(c => (
                                        <option key={c.id} value={c.id}>{c.name} — Giá: {c.price.toLocaleString()}đ/h</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Ngày đặt</label>
                                    <input 
                                        type="date" name="date"
                                        className="input-modern"
                                        value={bookingData.date} onChange={handleChange} required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Khung giờ</label>
                                    <select 
                                        name="timeSlot" className="input-modern" style={{background: 'white'}}
                                        value={bookingData.timeSlot} onChange={handleChange}
                                    >
                                        {TIME_SLOTS.map(s => (
                                            <option key={s.slot} value={s.slot}>{s.slot} ({s.duration} tiếng)</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Nhóm 3: Thanh toán */}
                        <div>
                            <div className="menu-section-title">3. Trạng thái thanh toán</div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <label style={{ 
                                    flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb',
                                    display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                                    background: bookingData.paymentStatus === 'paid' ? '#ecfdf5' : 'white',
                                    borderColor: bookingData.paymentStatus === 'paid' ? '#10b981' : '#e5e7eb',
                                    transition: 'all 0.2s'
                                }}>
                                    <input 
                                        type="radio" name="paymentStatus" value="paid"
                                        checked={bookingData.paymentStatus === 'paid'}
                                        onChange={handleChange}
                                    />
                                    <span style={{ fontWeight: '600', color: bookingData.paymentStatus === 'paid' ? '#047857' : '#374151' }}>
                                        Đã thanh toán ngay
                                    </span>
                                </label>

                                <label style={{ 
                                    flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb',
                                    display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                                    background: bookingData.paymentStatus === 'pending' ? '#fff7ed' : 'white',
                                    borderColor: bookingData.paymentStatus === 'pending' ? '#f97316' : '#e5e7eb',
                                    transition: 'all 0.2s'
                                }}>
                                    <input 
                                        type="radio" name="paymentStatus" value="pending"
                                        checked={bookingData.paymentStatus === 'pending'}
                                        onChange={handleChange}
                                    />
                                    <span style={{ fontWeight: '600', color: bookingData.paymentStatus === 'pending' ? '#c2410c' : '#374151' }}>
                                        Thanh toán sau (Giữ chỗ)
                                    </span>
                                </label>
                            </div>
                        </div>
                    </form>
                </div>

                {/* CỘT PHẢI: TỔNG KẾT & CONFIRM */}
                <div className="card-modern" style={{ padding: '24px', height: 'fit-content', position: 'sticky', top: '90px' }}>
                    <div style={{ marginBottom: '20px', borderBottom: '1px dashed #e5e7eb', paddingBottom: '20px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>Tóm tắt đơn đặt</h3>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                            <span style={{ color: '#6b7280' }}>Khách hàng:</span>
                            <span style={{ fontWeight: '600' }}>{bookingData.clientName || '---'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                            <span style={{ color: '#6b7280' }}>Sân:</span>
                            <span style={{ fontWeight: '600', textAlign: 'right' }}>
                                {courts.find(c => c.id === bookingData.courtId)?.name || '---'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                            <span style={{ color: '#6b7280' }}>Ngày:</span>
                            <span style={{ fontWeight: '600' }}>{bookingData.date}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                            <span style={{ color: '#6b7280' }}>Giờ:</span>
                            <span style={{ fontWeight: '600' }}>{bookingData.timeSlot}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <span style={{ fontSize: '16px', color: '#374151', fontWeight: '600' }}>Tổng cộng:</span>
                        <span style={{ fontSize: '24px', fontWeight: '800', color: '#00994C' }}>
                            {calculateTotal().toLocaleString()} đ
                        </span>
                    </div>

                    <button 
                        onClick={handleSubmit}
                        className="btn-primary"
                        disabled={loading}
                        style={{ width: '100%', height: '48px', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                    >
                        {loading ? 'Đang xử lý...' : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                Xác Nhận Đặt Sân
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default StaffBookingScreen;