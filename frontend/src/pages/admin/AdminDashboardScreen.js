import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { mockApiCall } from '../../api/mockApi'; // Import API
import { MOCK_API_BASE, TIME_SLOTS } from '../../utils/constants'; // Import Constants
import '../../App.css'; 

const AdminDashboardScreen = ({ navigateTo }) => {
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('overview');
    const isAdmin = user?.role === 'admin';

    // --- 1. STATE CHO CHỨC NĂNG GỬI THÔNG BÁO ---
    const [notifyData, setNotifyData] = useState({ title: '', content: '' });
    const [sending, setSending] = useState(false);

    // --- 2. STATE CHO CHỨC NĂNG ĐẶT SÂN (POS) ---
    const [courts, setCourts] = useState([]);
    const [bookingData, setBookingData] = useState({
        clientName: '', clientPhone: '', courtId: '',
        date: new Date().toISOString().split('T')[0],
        timeSlot: TIME_SLOTS[0].slot, paymentStatus: 'paid'
    });
    const [posLoading, setPosLoading] = useState(false);
    const [posMessage, setPosMessage] = useState(null);

    // Fetch Sân khi component load (để dùng cho tab POS)
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

    // --- HANDLERS ---

    // Xử lý gửi thông báo
    const handleSendNotification = (e) => {
        e.preventDefault();
        setSending(true);
        setTimeout(() => {
            alert(`✅ Đã gửi thông báo "${notifyData.title}" đến toàn bộ người dùng!`);
            setNotifyData({ title: '', content: '' });
            setSending(false);
        }, 1000);
    };

    // Tính tổng tiền POS
    const calculateTotal = () => {
        const court = courts.find(c => c.id === bookingData.courtId);
        const slot = TIME_SLOTS.find(s => s.slot === bookingData.timeSlot);
        return (court && slot) ? court.price * slot.duration : 0;
    };

    // Xử lý đặt sân POS
    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setPosLoading(true); setPosMessage(null);
        try {
            if (!bookingData.clientName || !bookingData.clientPhone) throw new Error("Vui lòng nhập tên và SĐT khách!");
            const total = calculateTotal();
            await mockApiCall('POST', `${MOCK_API_BASE}/bookings/staff-create`, {
                ...bookingData, totalAmount: total, depositAmount: bookingData.paymentStatus === 'paid' ? total : 0
            });
            setPosMessage({ type: 'success', text: `✅ Đã tạo lịch thành công cho: ${bookingData.clientName}` });
            setBookingData(prev => ({...prev, clientName: '', clientPhone: '', paymentStatus: 'paid'}));
        } catch (err) { setPosMessage({ type: 'error', text: err.message }); }
        finally { setPosLoading(false); }
    };

    // --- RENDER CONTENT ---
    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div>
                        <div className="content-header"><h2 className="content-title">Tổng quan hệ thống</h2></div>
                        {/* Thẻ thống kê */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                            <div style={{ padding: '20px', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                                <h4 style={{ margin: '0 0 8px 0', color: '#065f46', fontSize: '14px' }}>Doanh thu ngày</h4>
                                <div style={{ fontSize: '24px', fontWeight: '800', color: '#059669' }}>2.540.000 đ</div>
                            </div>
                            <div style={{ padding: '20px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                                <h4 style={{ margin: '0 0 8px 0', color: '#1e40af', fontSize: '14px' }}>Đơn đặt mới</h4>
                                <div style={{ fontSize: '24px', fontWeight: '800', color: '#2563eb' }}>12</div>
                            </div>
                            {isAdmin && (
                                <div style={{ padding: '20px', background: '#fff7ed', borderRadius: '12px', border: '1px solid #fed7aa' }}>
                                    <h4 style={{ margin: '0 0 8px 0', color: '#9a3412', fontSize: '14px' }}>Thành viên mới</h4>
                                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#ea580c' }}>5</div>
                                </div>
                            )}
                        </div>

                        <div className="content-header" style={{border: 'none', paddingBottom: '10px', marginBottom: '10px'}}>
                            <h3 className="content-title" style={{fontSize: '16px'}}>Thao tác nhanh</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {/* Nút này giờ sẽ chuyển Tab chứ không chuyển trang */}
                            <button 
                                onClick={() => setActiveTab('pos')}
                                className="btn-primary" 
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', height: '50px' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3zM12 8v8M8 12h8"/></svg>
                                Đặt sân cho khách (POS)
                            </button>
                            {isAdmin && (
                                <button 
                                    onClick={() => setActiveTab('notification')}
                                    className="btn-primary" 
                                    style={{ background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', height: '50px' }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                                    Gửi thông báo ưu đãi
                                </button>
                            )}
                        </div>
                    </div>
                );

            case 'pos': // <--- TAB MỚI: Đặt sân ngay trong Admin Dashboard
                return (
                    <div>
                        <div className="content-header"><h2 className="content-title">Đặt sân tại quầy (POS)</h2></div>
                        {posMessage && <div style={{padding: '12px', borderRadius: '8px', marginBottom: '20px', background: posMessage.type === 'success' ? '#ecfdf5' : '#fef2f2', color: posMessage.type === 'success' ? '#059669' : '#dc2626'}}>{posMessage.text}</div>}
                        
                        <form onSubmit={handleBookingSubmit} style={{display: 'grid', gap: '20px'}}>
                            {/* Card nhập liệu */}
                            <div className="card-modern" style={{padding: '20px'}}>
                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px'}}>
                                    <div className="form-group" style={{margin:0}}>
                                        <label className="form-label">Tên khách</label>
                                        <input className="input-modern" required placeholder="VD: Anh Nam" value={bookingData.clientName} onChange={e => setBookingData({...bookingData, clientName: e.target.value})} />
                                    </div>
                                    <div className="form-group" style={{margin:0}}>
                                        <label className="form-label">SĐT</label>
                                        <input className="input-modern" required placeholder="09xxxx" value={bookingData.clientPhone} onChange={e => setBookingData({...bookingData, clientPhone: e.target.value})} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Chọn Sân</label>
                                    <select className="input-modern" style={{background: 'white'}} value={bookingData.courtId} onChange={e => setBookingData({...bookingData, courtId: e.target.value})}>
                                        {courts.map(c => <option key={c.id} value={c.id}>{c.name} ({c.price.toLocaleString()}đ/h)</option>)}
                                    </select>
                                </div>
                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                                    <div className="form-group" style={{margin:0}}>
                                        <label className="form-label">Ngày</label>
                                        <input type="date" className="input-modern" required value={bookingData.date} onChange={e => setBookingData({...bookingData, date: e.target.value})} />
                                    </div>
                                    <div className="form-group" style={{margin:0}}>
                                        <label className="form-label">Giờ</label>
                                        <select className="input-modern" style={{background: 'white'}} value={bookingData.timeSlot} onChange={e => setBookingData({...bookingData, timeSlot: e.target.value})}>
                                            {TIME_SLOTS.map(s => <option key={s.slot} value={s.slot}>{s.slot}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Card Thanh toán */}
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f0fdf4', padding: '20px', borderRadius: '12px', border: '1px solid #bbf7d0'}}>
                                <div>
                                    <div style={{fontSize: '13px', color: '#166534'}}>Tổng thanh toán</div>
                                    <div style={{fontSize: '24px', fontWeight: '800', color: '#15803d'}}>{calculateTotal().toLocaleString()} đ</div>
                                </div>
                                <div style={{display: 'flex', gap: '15px'}}>
                                    <label style={{display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: '600', color: '#065f46'}}>
                                        <input type="radio" name="payment" value="paid" checked={bookingData.paymentStatus === 'paid'} onChange={() => setBookingData({...bookingData, paymentStatus: 'paid'})} /> Thu tiền ngay
                                    </label>
                                    <label style={{display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#9a3412'}}>
                                        <input type="radio" name="payment" value="pending" checked={bookingData.paymentStatus === 'pending'} onChange={() => setBookingData({...bookingData, paymentStatus: 'pending'})} /> Giữ chỗ
                                    </label>
                                </div>
                            </div>

                            <button type="submit" disabled={posLoading} className="btn-primary" style={{height: '50px'}}>
                                {posLoading ? 'Đang xử lý...' : 'Xác Nhận Tạo Lịch'}
                            </button>
                        </form>
                    </div>
                );

            case 'notification':
                return (
                    <div>
                        <div className="content-header"><h2 className="content-title">Gửi thông báo & Ưu đãi</h2></div>
                        <div className="card-modern" style={{ padding: '30px' }}>
                            <form onSubmit={handleSendNotification}>
                                <div className="form-group">
                                    <label className="form-label">Tiêu đề thông báo</label>
                                    <input type="text" className="input-modern" required placeholder="VD: Khuyến mãi tết 2025" value={notifyData.title} onChange={(e) => setNotifyData({...notifyData, title: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Nội dung chi tiết</label>
                                    <textarea className="input-modern" rows="5" required placeholder="Nhập nội dung..." style={{height: 'auto', paddingTop: '12px'}} value={notifyData.content} onChange={(e) => setNotifyData({...notifyData, content: e.target.value})}></textarea>
                                </div>
                                <button type="submit" className="btn-primary" disabled={sending} style={{width: 'auto'}}>
                                    {sending ? 'Đang gửi...' : 'Gửi Ngay'}
                                </button>
                            </form>
                        </div>
                    </div>
                );

            // Các Case placeholder cho các mục khác
            case 'bookings': return <div className="card-modern" style={{padding:'40px', textAlign:'center'}}>Quản lý Lịch (Đang cập nhật)</div>;
            case 'courts': return <div className="card-modern" style={{padding:'40px', textAlign:'center'}}>Quản lý Sân (Đang cập nhật)</div>;
            case 'users': return <div className="card-modern" style={{padding:'40px', textAlign:'center'}}>Quản lý Users (Đang cập nhật)</div>;
            case 'revenue': return <div className="card-modern" style={{padding:'40px', textAlign:'center'}}>Báo cáo Doanh thu (Đang cập nhật)</div>;
            case 'packages': return <div className="card-modern" style={{padding:'40px', textAlign:'center'}}>Gói thành viên (Đang cập nhật)</div>;

            default: return null;
        }
    };

    return (
        <div className="profile-wrapper">
            {/* SIDEBAR TRÁI */}
            <div className="profile-sidebar">
                <div className="user-summary-card" style={{ borderLeft: isAdmin ? '4px solid #ef4444' : '4px solid #3b82f6' }}>
                    <div className="user-avatar-circle" style={{ background: isAdmin ? '#ef4444' : '#3b82f6' }}>
                        {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div>
                        <div style={{ fontWeight: '700', fontSize: '16px' }}>{user?.username}</div>
                        <div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase' }}>
                            {isAdmin ? 'Quản trị viên' : 'Nhân viên'}
                        </div>
                    </div>
                </div>

                <div className="menu-section-title">Quản lý</div>
                <div className="menu-card-group">
                    <div className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                        <div className="menu-item-left"><span>📊</span> Tổng quan</div>
                    </div>
                    <div className={`menu-item ${activeTab === 'pos' ? 'active' : ''}`} onClick={() => setActiveTab('pos')}>
                        <div className="menu-item-left" style={{color: '#00994C', fontWeight: '600'}}><span>🏸</span> Đặt sân tại quầy (POS)</div>
                        <svg width="16" height="16" stroke="currentColor" fill="none" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                    <div className={`menu-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
                        <div className="menu-item-left"><span>📅</span> Lịch đặt & Check-in</div>
                    </div>
                    <div className={`menu-item ${activeTab === 'courts' ? 'active' : ''}`} onClick={() => setActiveTab('courts')}>
                        <div className="menu-item-left"><span>🏟️</span> Quản lý Sân</div>
                    </div>
                </div>

                {isAdmin && (
                    <>
                        <div className="menu-section-title">Admin</div>
                        <div className="menu-card-group">
                            <div className={`menu-item ${activeTab === 'notification' ? 'active' : ''}`} onClick={() => setActiveTab('notification')}>
                                <div className="menu-item-left" style={{color: '#d97706'}}><span>🔔</span> Gửi thông báo & Ưu đãi</div>
                            </div>
                            <div className={`menu-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                                <div className="menu-item-left"><span>👥</span> Người dùng & Staff</div>
                            </div>
                            <div className={`menu-item ${activeTab === 'revenue' ? 'active' : ''}`} onClick={() => setActiveTab('revenue')}>
                                <div className="menu-item-left"><span>💰</span> Doanh thu</div>
                            </div>
                            <div className={`menu-item ${activeTab === 'packages' ? 'active' : ''}`} onClick={() => setActiveTab('packages')}>
                                <div className="menu-item-left"><span>💎</span> Gói thành viên</div>
                            </div>
                        </div>
                    </>
                )}

                <div className="menu-section-title">Hệ thống</div>
                <div className="menu-card-group">
                    <div className="menu-item" onClick={logout} style={{ color: '#ef4444' }}>
                        <div className="menu-item-left"><span>🚪</span> Đăng xuất</div>
                    </div>
                </div>
            </div>

            {/* NỘI DUNG PHẢI */}
            <div className="profile-main-content animate-fade-in">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboardScreen;