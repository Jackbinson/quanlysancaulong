// src/views/voucher/VoucherManagementPage.tsx
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { VoucherService } from '../../services/VoucherService'; 
interface Voucher {
    id: string;
    code: string;
    type: 'percentage' | 'fixed'; // Ví dụ: 'percentage' (giảm %), 'fixed' (giảm số tiền cố định)
    value: number; // Giá trị giảm (ví dụ: 10 cho 10%, hoặc 50000 cho 50k VND)
    minAmount: number; // Giá trị đơn hàng tối thiểu để áp dụng voucher
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    isActive: boolean;
}

const VoucherManagementPage: React.FC = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [currentVoucher, setCurrentVoucher] = useState<Voucher | null>(null);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    // Form states for adding/editing voucher
    const [code, setCode] = useState<string>('');
    const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
    const [value, setValue] = useState<number>(0);
    const [minAmount, setMinAmount] = useState<number>(0);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [isActive, setIsActive] = useState<boolean>(true);

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        try {
            // const data = await voucherService.getAllVouchers(); // Sử dụng voucherService (camelCase)
            // Mock data
            const mockVouchers: Voucher[] = [
                { id: 'v1', code: 'SALE10', type: 'percentage', value: 10, minAmount: 100000, startDate: '2023-10-01', endDate: '2023-10-31', isActive: true },
                { id: 'v2', code: 'FREESHIP', type: 'fixed', value: 20000, minAmount: 50000, startDate: '2023-10-15', endDate: '2023-11-15', isActive: true },
                { id: 'v3', code: 'EXPIRED20', type: 'percentage', value: 20, minAmount: 200000, startDate: '2023-09-01', endDate: '2023-09-30', isActive: false },
            ];
            setVouchers(mockVouchers);
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tải danh sách voucher.');
        }
    };

    const handleAddVoucher = () => {
        setCurrentVoucher(null);
        resetForm();
        setShowModal(true);
    };

    const handleEditVoucher = (voucher: Voucher) => {
        setCurrentVoucher(voucher);
        setCode(voucher.code);
        setType(voucher.type);
        setValue(voucher.value);
        setMinAmount(voucher.minAmount);
        setStartDate(voucher.startDate);
        setEndDate(voucher.endDate);
        setIsActive(voucher.isActive);
        setShowModal(true);
    };

    const handleDeleteVoucher = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa voucher này không?')) {
            try {
                // await voucherService.deleteVoucher(id); // Sử dụng voucherService (camelCase)
                setVouchers(vouchers.filter(v => v.id !== id));
                setSuccess('Xóa voucher thành công!');
                setTimeout(() => setSuccess(''), 3000);
            } catch (err: any) {
                setError(err.message || 'Lỗi khi xóa voucher.');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!code || !startDate || !endDate || value <= 0 || minAmount < 0) {
            setError('Vui lòng nhập đầy đủ và chính xác thông tin voucher.');
            return;
        }

        try {
            const voucherData: Omit<Voucher, 'id'> = {
                code, type, value, minAmount, startDate, endDate, isActive
            };

            if (currentVoucher) {
                // Update existing voucher
                // await voucherService.updateVoucher(currentVoucher.id, voucherData); // Sử dụng voucherService (camelCase)
                setVouchers(vouchers.map(v => v.id === currentVoucher.id ? { ...currentVoucher, ...voucherData, id: currentVoucher.id } : v));
                setSuccess('Cập nhật voucher thành công!');
            } else {
                // Add new voucher
                // const newVoucher = await voucherService.createVoucher(voucherData); // Sử dụng voucherService (camelCase)
                const newVoucher: Voucher = { ...voucherData, id: `v${Date.now().toString()}` }; // Mock ID
                setVouchers([...vouchers, newVoucher]);
                setSuccess('Thêm voucher mới thành công!');
            }
            setShowModal(false);
            setTimeout(() => setSuccess(''), 3000);
            fetchVouchers(); // Refresh list
        } catch (err: any) {
            setError(err.message || 'Lỗi khi lưu voucher.');
        }
    };

    const resetForm = () => {
        setCode('');
        setType('percentage');
        setValue(0);
        setMinAmount(0);
        setStartDate('');
        setEndDate('');
        setIsActive(true);
    };

    return (
        <Container fluid className="mt-4">
            <h2 className="mb-4">Quản lý Voucher</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Button variant="primary" className="mb-3" onClick={handleAddVoucher}>
                Thêm Voucher mới
            </Button>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Mã Voucher</th>
                        <th>Loại</th>
                        <th>Giá trị</th>
                        <th>Đơn hàng tối thiểu</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {vouchers.map((voucher) => (
                        <tr key={voucher.id}>
                            <td>{voucher.code}</td>
                            <td>{voucher.type === 'percentage' ? 'Phần trăm' : 'Cố định'}</td>
                            <td>{voucher.type === 'percentage' ? `${voucher.value}%` : `${voucher.value.toLocaleString()} VND`}</td>
                            <td>{voucher.minAmount.toLocaleString()} VND</td>
                            <td>{new Date(voucher.startDate).toLocaleDateString()}</td>
                            <td>{new Date(voucher.endDate).toLocaleDateString()}</td>
                            <td>{voucher.isActive ? 'Hoạt động' : 'Không hoạt động'}</td>
                            <td>
                                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditVoucher(voucher)}>Sửa</Button>
                                <Button variant="danger" size="sm" onClick={() => handleDeleteVoucher(voucher.id)}>Xóa</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentVoucher ? 'Sửa Voucher' : 'Thêm Voucher mới'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Mã Voucher</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập mã voucher"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Loại Voucher</Form.Label>
                            <Form.Control
                                as="select"
                                value={type}
                                onChange={(e) => setType(e.target.value as 'percentage' | 'fixed')}
                            >
                                <option value="percentage">Phần trăm (%)</option>
                                <option value="fixed">Số tiền cố định (VND)</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Giá trị giảm</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder={type === 'percentage' ? "Ví dụ: 10 (cho 10%)" : "Ví dụ: 50000 (cho 50k VND)"}
                                value={value}
                                onChange={(e) => setValue(parseInt(e.target.value) || 0)}
                                required
                                min={0}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Đơn hàng tối thiểu (VND)</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Ví dụ: 100000"
                                value={minAmount}
                                onChange={(e) => setMinAmount(parseInt(e.target.value) || 0)}
                                required
                                min={0}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ngày bắt đầu</Form.Label>
                            <Form.Control
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ngày kết thúc</Form.Label>
                            <Form.Control
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Kích hoạt"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Lưu Voucher
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default VoucherManagementPage;