import React, { useState, useEffect } from 'react';
import { mockApiCall } from '../../api/mockApi';
import { MOCK_API_BASE } from '../../utils/constants';
import '../../App.css'; // Import CSS chung

const AdminMembershipScreen = () => {
    // State quản lý dữ liệu
    const [packages, setPackages] = useState([]);
    const [isCreating, setIsCreating] = useState(false); // Trạng thái mở form tạo
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // State form
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        durationDays: 30,
        description: ''
    });

    // 1. Load danh sách gói
    useEffect(() => {
        // Giả lập lấy dữ liệu (hoặc gọi API GET nếu có)
        // Vì mockApi chưa lưu database thật nên mình dùng dữ liệu cứng mẫu để hiển thị
        const mockPackages = [
            { id: 1, name: 'Gói Cơ Bản (Silver)', price: 200000, durationDays: 30, description: 'Giảm 5% đặt sân' },
            { id: 2, name: 'Gói Cao Cấp (Gold)', price: 500000, durationDays: 90, description: 'Giảm 10% đặt sân' },
        ];
        setPackages(mockPackages);
    }, []);

    // 2. Xử lý tạo gói mới
    const handleCreateMembership = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // Gọi API tạo gói
            await mockApiCall('POST', `${MOCK_API_BASE}/memberships`, { 
                ...formData, 
                discount: 0.05 // Mặc định hoặc thêm input nếu cần
            });
            
            setMessage({ type: 'success', text: `✅ Đã tạo gói "${formData.name}" thành công!` });
            
            // Cập nhật lại danh sách (Giả lập thêm vào state)
            const newPackage = { id: Date.now(), ...formData };
            setPackages([...packages, newPackage]);
            
            // Reset form & đóng
            setFormData({ name: '', price: '', durationDays: 30, description: '' });
            setIsCreating(false);

        } catch (err) {
            setMessage({ type: 'error', text: `❌ Lỗi: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    // 3. Xử lý xóa gói
    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa gói này không?')) {
            setPackages(packages.filter(p => p.id !== id));
        }
    };

    return (
        <div className="main-content" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>Quản Lý Gói Thành Viên</h2>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Thiết lập các gói ưu đãi cho khách hàng</p>
                </div>
                {!isCreating && (
                    <button 
                        onClick={() => setIsCreating(true)} 
                        className="btn-primary" 
                        style={{ width: 'auto', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Thêm gói mới
                    </button>
                )}
            </div>

            {/* Thông báo */}
            {message && (
                <div style={{
                    padding: '12px 16px', borderRadius: '8px', marginBottom: '20px',
                    backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
                    color: message.type === 'success' ? '#059669' : '#dc2626',
                    border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
                    fontWeight: '500'
                }}>
                    {message.text}
                </div>
            )}

            {/* FORM TẠO MỚI (Hiện khi bấm nút Thêm) */}
            {isCreating ? (
                <div className="card-modern" style={{ padding: '30px', marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#00994C' }}>Nhập thông tin gói mới</h3>
                    <form onSubmit={handleCreateMembership}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Tên gói</label>
                                <input 
                                    type="text" className="input-modern" required 
                                    placeholder="VD: Gói Vàng"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Giá tiền (VNĐ)</label>
                                <input 
                                    type="number" className="input-modern" required 
                                    placeholder="500000"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Thời hạn (Ngày)</label>
                                <input 
                                    type="number" className="input-modern" required 
                                    value={formData.durationDays}
                                    onChange={(e) => setFormData({...formData, durationDays: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mô tả ưu đãi</label>
                                <input 
                                    type="text" className="input-modern" 
                                    placeholder="VD: Giảm 10% khi đặt sân..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button 
                                type="button" 
                                onClick={() => setIsCreating(false)}
                                style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', fontWeight: '600', color: '#374151' }}
                            >
                                Hủy bỏ
                            </button>
                            <button 
                                type="submit" 
                                className="btn-primary" 
                                disabled={loading}
                                style={{ width: 'auto', paddingLeft: '30px', paddingRight: '30px' }}
                            >
                                {loading ? 'Đang lưu...' : 'Lưu gói này'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                /* DANH SÁCH GÓI (TABLE) */
                <div className="card-modern" style={{ overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <tr>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#6b7280' }}>Tên Gói</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#6b7280' }}>Giá</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#6b7280' }}>Thời hạn</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: '#6b7280' }}>Mô tả</th>
                                <th style={{ padding: '16px', textAlign: 'right', color: '#6b7280' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.length > 0 ? packages.map(pkg => (
                                <tr key={pkg.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '16px', fontWeight: '600', color: '#111827' }}>{pkg.name}</td>
                                    <td style={{ padding: '16px', color: '#00994C', fontWeight: '700' }}>{parseInt(pkg.price).toLocaleString()} đ</td>
                                    <td style={{ padding: '16px' }}>{pkg.durationDays} ngày</td>
                                    <td style={{ padding: '16px', color: '#6b7280' }}>{pkg.description}</td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <button 
                                            onClick={() => handleDelete(pkg.id)}
                                            style={{ background: '#fee2e2', border: 'none', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                                        Chưa có gói nào. Hãy tạo gói mới!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminMembershipScreen;