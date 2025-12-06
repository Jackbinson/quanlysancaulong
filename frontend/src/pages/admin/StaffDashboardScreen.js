import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { mockApiCall } from '../../api/mockApi';
import { MOCK_API_BASE, TIME_SLOTS } from '../../utils/constants';
import '../../App.css'; 

const StaffDashboardScreen = () => {
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('schedule'); 

    // --- LOGIC POS ---
    const [courts, setCourts] = useState([]);
    const [bookingData, setBookingData] = useState({
        clientName: '', clientPhone: '', courtId: '',
        date: new Date().toISOString().split('T')[0],
        timeSlot: TIME_SLOTS[0].slot, 
        paymentStatus: 'paid' 
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // --- LOGIC CHECK-IN ---
    const [checkinCode, setCheckinCode] = useState('');
    const [checkinResult, setCheckinResult] = useState(null);

    useEffect(() => {
        const fetchCourts = async () => {
            try {
                const res = await mockApiCall('GET', `${MOCK_API_BASE}/courts`);
                const active = res.courts.filter(c => c.status !== 'Maintenance');
                setCourts(active);
                if (active.length > 0) setBookingData(prev => ({...prev, courtId: active[0].id}));
            } catch (e) { console.error(e); }
        };
        fetchCourts();
    }, []);

    // Handler Đặt sân (Logic cũ)
    const handleBookingSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setMessage(null);
        try {
            if (!bookingData.clientName || !bookingData.clientPhone) throw new Error("Vui lòng nhập tên và SĐT khách!");

            const court = courts.find(c => c.id === bookingData.courtId);
            const slot = TIME_SLOTS.find(s => s.slot === bookingData.timeSlot);
            const total = (court && slot) ? court.price * slot.duration : 0;
            
            await mockApiCall('POST', `${MOCK_API_BASE}/bookings/staff-create`, { 
                ...bookingData, 
                totalAmount: total, 
                depositAmount: bookingData.paymentStatus === 'paid' ? total : 0 
            });
            
            setMessage({ type: 'success', text: `✅ Đã tạo lịch thành công cho: ${bookingData.clientName}` });
            setBookingData(prev => ({...prev, clientName: '', clientPhone: '', paymentStatus: 'paid'}));
        } catch (err) { setMessage({ type: 'error', text: err.message }); }
        finally { setLoading(false); }
    };

    const calculateTotal = () => {
        const court = courts.find(c => c.id === bookingData.courtId);
        const slot = TIME_SLOTS.find(s => s.slot === bookingData.timeSlot);
        return (court && slot) ? court.price * slot.duration : 0;
    };

    // Handler Check-in (Logic cũ)
    const handleCheckIn = () => {
        if(!checkinCode) return;
        if(checkinCode.toUpperCase().startsWith("BK")) {
            setCheckinResult({
                status: 'success',
                booking: { id: checkinCode, court: 'Sân Thăng Long A', time: '18:00 - 19:00', client: 'Nguyễn Văn A', paid: true }
            });
        } else {
            setCheckinResult({ status: 'error', text: 'Không tìm thấy mã đặt sân này!' });
        }
    };

    // --- RENDER CONTENT ---
    const renderContent = () => {
        switch (activeTab) {
            case 'pos':
                return (
                    <div>
                        <div className="content-header"><h2 className="content-title">Đặt sân tại quầy (POS)</h2></div>
                        {message && <div style={{padding:'10px', marginBottom:'15px', borderRadius:'8px', background: message.type === 'success' ? '#ecfdf5':'#fef2f2', color: message.type==='success'?'#059669':'#dc2626'}}>{message.text}</div>}
                        <form onSubmit={handleBookingSubmit} style={{display: 'grid', gap: '20px'}}>
                            <div className="card-modern" style={{padding:'24px', border: '1px solid #e5e7eb', boxShadow: 'none'}}>
                                <div style={{marginBottom: '24px'}}>
                                    <h4 style={{margin: '0 0 12px 0', fontSize: '13px', color: '#00994C', fontWeight: '700', textTransform: 'uppercase'}}>1. Khách hàng</h4>
                                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
                                        <div className="form-group" style={{margin:0}}><label className="form-label">Tên khách <span style={{color:'red'}}>*</span></label><input className="input-modern" value={bookingData.clientName} onChange={e=>setBookingData({...bookingData, clientName:e.target.value})} required placeholder="VD: Anh Nam"/></div>
                                        <div className="form-group" style={{margin:0}}><label className="form-label">SĐT <span style={{color:'red'}}>*</span></label><input className="input-modern" value={bookingData.clientPhone} onChange={e=>setBookingData({...bookingData, clientPhone:e.target.value})} required placeholder="09xxxx"/></div>
                                    </div>
                                </div>
                                <div>
                                    <h4 style={{margin: '0 0 12px 0', fontSize: '13px', color: '#00994C', fontWeight: '700', textTransform: 'uppercase'}}>2. Chọn sân & giờ</h4>
                                    <div className="form-group"><label className="form-label">Chọn Sân</label><select className="input-modern" style={{background:'white'}} value={bookingData.courtId} onChange={e=>setBookingData({...bookingData, courtId:e.target.value})}>{courts.map(c=><option key={c.id} value={c.id}>{c.name} ({c.price.toLocaleString()}đ/h)</option>)}</select></div>
                                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
                                        <div className="form-group" style={{margin:0}}><label className="form-label">Ngày</label><input type="date" className="input-modern" value={bookingData.date} onChange={e=>setBookingData({...bookingData, date:e.target.value})}/></div>
                                        <div className="form-group" style={{margin:0}}><label className="form-label">Giờ</label><select className="input-modern" style={{background:'white'}} value={bookingData.timeSlot} onChange={e=>setBookingData({...bookingData, timeSlot:e.target.value})}>{TIME_SLOTS.map(s=><option key={s.slot} value={s.slot}>{s.slot}</option>)}</select></div>
                                    </div>
                                </div>
                            </div>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#f0fdf4', padding:'20px', borderRadius:'12px', border:'1px solid #bbf7d0'}}>
                                <div><span style={{fontSize:'13px', color:'#166534', display: 'block', marginBottom: '4px'}}>Tổng thanh toán</span><div style={{fontSize:'24px', fontWeight:'800', color:'#15803d'}}>{calculateTotal().toLocaleString()} đ</div></div>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end'}}>
                                    <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#15803d'}}><input type="radio" name="payment" value="paid" checked={bookingData.paymentStatus === 'paid'} onChange={() => setBookingData({...bookingData, paymentStatus: 'paid'})} /> Thu tiền ngay</label>
                                    <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#9a3412'}}><input type="radio" name="payment" value="pending" checked={bookingData.paymentStatus === 'pending'} onChange={() => setBookingData({...bookingData, paymentStatus: 'pending'})} /> Chưa thu (Giữ chỗ)</label>
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary" style={{width:'100%', height: '48px', fontSize: '16px'}}>{loading ? 'Đang xử lý...' : 'Xác Nhận Tạo Lịch'}</button>
                        </form>
                    </div>
                );

            case 'checkin':
                return (
                    <div>
                        <div className="content-header"><h2 className="content-title">Check-in Khách Hàng</h2></div>
                        <div className="card-modern" style={{padding: '30px', textAlign: 'center'}}>
                            <p style={{marginBottom: '20px', color: '#6b7280'}}>Nhập mã đặt sân hoặc SĐT để tìm kiếm lịch đặt</p>
                            <div style={{display: 'flex', gap: '10px', maxWidth: '500px', margin: '0 auto'}}>
                                <input type="text" className="input-modern" placeholder="Nhập mã (VD: BK123456)" value={checkinCode} onChange={(e) => setCheckinCode(e.target.value)} />
                                <button className="btn-primary" style={{width: 'auto', whiteSpace: 'nowrap'}} onClick={handleCheckIn}>🔍 Kiểm tra</button>
                            </div>
                            {checkinResult && (
                                <div style={{marginTop: '30px', textAlign: 'left', background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb'}}>
                                    {checkinResult.status === 'error' ? (
                                        <div style={{color: 'red', fontWeight: '600'}}>❌ {checkinResult.text}</div>
                                    ) : (
                                        <div>
                                            <div style={{color: '#00994C', fontWeight: '700', marginBottom: '10px', fontSize: '16px'}}>✅ Tìm thấy lịch đặt!</div>
                                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px'}}>
                                                <div><strong>Khách:</strong> {checkinResult.booking.client}</div>
                                                <div><strong>Sân:</strong> {checkinResult.booking.court}</div>
                                                <div><strong>Giờ:</strong> {checkinResult.booking.time}</div>
                                                <div><strong>Trạng thái:</strong> <span style={{color: 'green'}}>Đã thanh toán</span></div>
                                            </div>
                                            <button className="btn-primary" style={{marginTop: '20px', width: '100%'}}>Xác Nhận Check-in</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'schedule':
                return (
                    <div>
                        <div className="content-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <h2 className="content-title">Lịch Sân Hôm Nay</h2>
                            <div style={{fontSize:'14px', color:'#6b7280', fontWeight:'500'}}>12/06/2025</div>
                        </div>
                        
                        {/* --- SỬA LỖI HIỂN THỊ BẢNG TẠI ĐÂY --- */}
                        {/* Thêm overflowX: 'auto' để có thanh cuộn ngang khi bảng quá lớn */}
                        <div className="card-modern" style={{padding: '0', overflowX: 'auto', border: '1px solid #e5e7eb', maxWidth: '100%'}}>
                            {/* Thêm minWidth để bảng không bị co lại quá nhỏ */}
                            <table style={{width: '100%', minWidth: '950px', borderCollapse: 'collapse', fontSize: '14px'}}>
                                <thead style={{background: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0'}}>
                                    <tr>
                                        {/* Tăng width để dàn đều và kéo rộng */}
                                        <th style={{padding: '16px 24px', textAlign: 'left', width: '25%', fontWeight: '700', whiteSpace: 'nowrap'}}>Sân</th>
                                        <th style={{padding: '16px 24px', textAlign: 'left', width: '25%', fontWeight: '700', whiteSpace: 'nowrap'}}>Khung giờ</th>
                                        <th style={{padding: '16px 24px', textAlign: 'left', width: '30%', fontWeight: '700', whiteSpace: 'nowrap'}}>Khách hàng</th>
                                        <th style={{padding: '16px 24px', textAlign: 'center', width: '20%', fontWeight: '700', whiteSpace: 'nowrap'}}>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
                                        const isPaid = i % 2 === 0;
                                        return (
                                            <tr key={i} style={{borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s'}} onMouseOver={e=>e.currentTarget.style.background='#fcfcfc'} onMouseOut={e=>e.currentTarget.style.background='white'}>
                                                <td style={{padding: '16px 24px', fontWeight: '600', color: '#111827'}}>
                                                    Sân Thăng Long A
                                                </td>
                                                <td style={{padding: '16px 24px', color: '#64748b'}}>
                                                    <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                                        {`0${i+6}:00 - 0${i+7}:00`}
                                                    </div>
                                                </td>
                                                <td style={{padding: '16px 24px'}}>
                                                    <div style={{fontWeight: '600', color: '#334155'}}>Nguyễn Văn Khách {i}</div>
                                                    <div style={{fontSize: '12px', color: '#94a3b8', marginTop: '2px'}}>090912345{i}</div>
                                                </td>
                                                <td style={{padding: '16px 24px', textAlign: 'center'}}>
                                                    <span style={{
                                                        display: 'inline-block',
                                                        padding: '6px 12px', 
                                                        borderRadius: '20px', 
                                                        background: isPaid ? '#dcfce7' : '#fee2e2', 
                                                        color: isPaid ? '#166534' : '#991b1b', 
                                                        fontSize: '12px', 
                                                        fontWeight: '700',
                                                        minWidth: '100px'
                                                    }}>
                                                        {isPaid ? 'Đã thanh toán' : 'Chưa đến'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'settings':
                return (
                    <div>
                        <div className="content-header"><h2 className="content-title">Thông tin tài khoản</h2></div>
                        <form className="profile-form">
                            <div className="form-group">
                                <label className="form-label">Tên nhân viên</label>
                                <input className="input-modern" defaultValue={user?.username} disabled style={{background: '#f9fafb'}} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input className="input-modern" defaultValue={user?.email} disabled style={{background: '#f9fafb'}} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Vai trò</label>
                                <input className="input-modern" defaultValue="Nhân viên bán hàng" disabled style={{background: '#f9fafb'}} />
                            </div>
                        </form>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="profile-wrapper">
            <div className="profile-sidebar">
                <div className="user-summary-card" style={{borderLeft: '4px solid #00994C'}}>
                    <div className="user-avatar-circle" style={{background: 'linear-gradient(135deg, #00994C, #059669)'}}>S</div>
                    <div><div style={{fontWeight:'700'}}>{user?.username}</div><div style={{fontSize:'12px', color:'#6b7280'}}>STAFF</div></div>
                </div>
                <div className="menu-section-title">Nghiệp vụ</div>
                <div className="menu-card-group">
                    <div className={`menu-item ${activeTab==='pos'?'active':''}`} onClick={()=>setActiveTab('pos')}><div className="menu-item-left"><span>🏸</span> Đặt sân tại quầy</div></div>
                    <div className={`menu-item ${activeTab==='checkin'?'active':''}`} onClick={()=>setActiveTab('checkin')}><div className="menu-item-left"><span>✅</span> Check-in khách</div></div>
                    <div className={`menu-item ${activeTab==='schedule'?'active':''}`} onClick={()=>setActiveTab('schedule')}><div className="menu-item-left"><span>📅</span> Xem lịch sân</div></div>
                </div>
                <div className="menu-section-title">Hệ thống</div>
                <div className="menu-card-group">
                    <div className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                        <div className="menu-item-left"><span style={{color: '#00994C'}}>⚙️</span> Thông tin tài khoản</div>
                    </div>
                    <div className="menu-item" onClick={logout} style={{color:'#ef4444'}}><div className="menu-item-left"><span>🚪</span> Đăng xuất</div></div>
                </div>
            </div>
            <div className="profile-main-content animate-fade-in"><div className="content-body" style={{padding:0}}>{renderContent()}</div></div>
        </div>
    );
};

export default StaffDashboardScreen;