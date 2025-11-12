// src/views/payment/PaymentPage.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/BookingService';
import { VoucherService } from '../../services/VoucherService';

interface BookingDetails {
    courtId: string;
    date: string; // YYYY-MM-DD
    timeSlotId: string;
    time: string; // "08:00 - 09:00"
    totalAmount: number;
}

// Định nghĩa kiểu cho một sân để dùng trong availableCourts
interface Court {
    id: string;
    name: string;
    // Thêm các thuộc tính khác của sân nếu cần
}

const PaymentPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingDetails: BookingDetails | undefined = location.state?.bookingDetails;
    // Nhận danh sách sân từ location.state
    const availableCourts: Court[] | undefined = location.state?.availableCourts;

    const [paymentMethod, setPaymentMethod] = useState<string>('card');
    const [voucherCode, setVoucherCode] = useState<string>('');
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [finalAmount, setFinalAmount] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    useEffect(() => {
        if (!bookingDetails) {
            setError('Không tìm thấy thông tin đặt sân. Vui lòng quay lại trang đặt sân.');
            return;
        }
        setFinalAmount(bookingDetails.totalAmount - discountAmount);
    }, [bookingDetails, discountAmount]);

    // Thêm kiểm tra availableCourts ở đây
    if (!bookingDetails || !availableCourts) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error || 'Không tìm thấy thông tin đặt sân hoặc danh sách sân. Vui lòng quay lại trang đặt sân.'}</Alert>
                <Button onClick={() => navigate('/booking')}>Quay lại đặt sân</Button>
            </Container>
        );
    }

    const handleApplyVoucher = async () => {
        setError('');
        setDiscountAmount(0);
        if (!voucherCode) {
            setError('Vui lòng nhập mã voucher.');
            return;
        }
        try {
            // Simulate API call to validate voucher
            // const voucherInfo = await VoucherService.validateVoucher(voucherCode);
            // Mock response
            const mockVoucherInfo = { code: voucherCode, type: 'percentage', value: 10, minAmount: 50000 };
            if (bookingDetails.totalAmount < mockVoucherInfo.minAmount) {
                setError(`Voucher này chỉ áp dụng cho đơn hàng từ ${mockVoucherInfo.minAmount.toLocaleString()} VND.`);
                return;
            }

            let calculatedDiscount = 0;
            if (mockVoucherInfo.type === 'percentage') {
                calculatedDiscount = (bookingDetails.totalAmount * mockVoucherInfo.value) / 100;
            } else if (mockVoucherInfo.type === 'fixed') {
                calculatedDiscount = mockVoucherInfo.value;
            }
            setDiscountAmount(calculatedDiscount);
            setFinalAmount(bookingDetails.totalAmount - calculatedDiscount);
            setSuccess(`Áp dụng voucher thành công! Bạn được giảm ${calculatedDiscount.toLocaleString()} VND.`);
        } catch (err: any) {
            setError(err.message || 'Mã voucher không hợp lệ hoặc đã hết hạn.');
        }
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            // Simulate API call to process payment
            const paymentResult = await bookingService.processPayment({
                bookingId: 'MOCK_BOOKING_ID',
                amount: finalAmount,
                paymentMethod: paymentMethod,
                voucherCode: voucherCode || null,
            });

            // If payment is successful, navigate to a confirmation page
            if (paymentResult.success) {
                setSuccess('Thanh toán thành công! Chuyển hướng đến trang xác nhận...');
                setTimeout(() => {
                    navigate('/payment-success', { state: { paymentResult: paymentResult, bookingDetails: bookingDetails } });
                }, 2000);
            } else {
                setError(paymentResult.message || 'Thanh toán thất bại. Vui lòng thử lại.');
            }

        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.');
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Thanh toán đặt sân</h2>
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <Card className="mb-4">
                        <Card.Header>Thông tin đơn hàng</Card.Header>
                        <Card.Body>
                            {/* Đảm bảo availableCourts và bookingDetails đã có */}
                            <h5>Sân: {availableCourts.find(c => c.id === bookingDetails.courtId)?.name || 'Đang tải...'}</h5>
                            <p>Ngày: {new Date(bookingDetails.date).toLocaleDateString()}</p>
                            <p>Khung giờ: {bookingDetails.time}</p>
                            <p>Tổng tiền ban đầu: <span className="fw-bold">{bookingDetails.totalAmount.toLocaleString()} VND</span></p>
                            {discountAmount > 0 && (
                                <p className="text-success">Giảm giá voucher: -{discountAmount.toLocaleString()} VND</p>
                            )}
                            <h4 className="mt-3">Tổng tiền thanh toán: <span className="text-danger">{finalAmount.toLocaleString()} VND</span></h4>
                        </Card.Body>
                    </Card>

                    <Card className="mb-4">
                        <Card.Header>Mã Voucher</Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Nhập mã voucher (nếu có)</Form.Label>
                                <Row>
                                    <Col xs={8}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập mã voucher"
                                            value={voucherCode}
                                            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                        />
                                    </Col>
                                    <Col xs={4}>
                                        <Button variant="outline-primary" onClick={handleApplyVoucher} disabled={!voucherCode}>
                                            Áp dụng
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Group>
                            {error && error.includes('voucher') && <Alert variant="danger" className="mt-2">{error}</Alert>}
                            {success && success.includes('voucher') && <Alert variant="success" className="mt-2">{success}</Alert>}
                        </Card.Body>
                    </Card>

                    <Card className="mb-4">
                        <Card.Header>Chọn phương thức thanh toán</Card.Header>
                        <Card.Body>
                            <Form onSubmit={handlePayment}>
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="radio"
                                        label="Thẻ ngân hàng (Visa/MasterCard)"
                                        name="paymentMethod"
                                        id="radioCard"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Ví điện tử MoMo"
                                        name="paymentMethod"
                                        id="radioMomo"
                                        value="momo"
                                        checked={paymentMethod === 'momo'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Ví điện tử ZaloPay"
                                        name="paymentMethod"
                                        id="radioZalopay"
                                        value="zalopay"
                                        checked={paymentMethod === 'zalopay'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Chuyển khoản ngân hàng"
                                        name="paymentMethod"
                                        id="radioBank"
                                        value="bank"
                                        checked={paymentMethod === 'bank'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                </Form.Group>
                                {error && !error.includes('voucher') && <Alert variant="danger">{error}</Alert>}
                                {success && !success.includes('voucher') && <Alert variant="success">{success}</Alert>}
                                <Button variant="success" type="submit" className="w-100 mt-3">
                                    Thanh toán {finalAmount.toLocaleString()} VND
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PaymentPage;