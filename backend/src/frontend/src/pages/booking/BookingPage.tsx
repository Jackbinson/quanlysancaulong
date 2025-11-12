// src/views/booking/BookingPage.tsx
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { BookingService } from '../../services/BookingService'; // Import BookingService

// Giả định kiểu dữ liệu cho sân và slot thời gian
interface Court {
    id: string;
    name: string;
    description: string;
}

interface TimeSlot {
    id: string;
    time: string; // ví dụ: "08:00 - 09:00"
    isAvailable: boolean;
    price: number;
}

const BookingPage: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedCourt, setSelectedCourt] = useState<string>('');
    const [availableCourts, setAvailableCourts] = useState<Court[]>([]);
    const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    // Mock data for courts (in a real app, this would come from an API)
    useEffect(() => {
        const fetchCourts = async () => {
            // Simulate API call
            const courts: Court[] = [
                { id: 'court1', name: 'Sân số 1', description: 'Sân tiêu chuẩn' },
                { id: 'court2', name: 'Sân số 2', description: 'Sân có điều hòa' },
                { id: 'court3', name: 'Sân VIP', description: 'Sân dành cho thi đấu' },
            ];
            setAvailableCourts(courts);
        };
        fetchCourts();
    }, []);

    // Fetch available time slots based on selected date and court
    useEffect(() => {
        const fetchTimeSlots = async () => {
            if (selectedDate && selectedCourt) {
                setError('');
                // Simulate API call to get time slots
                // In a real app, you'd call BookingService.getAvailableTimeSlots(selectedDate, selectedCourt)
                const mockTimeSlots: TimeSlot[] = [
                    { id: 'slot1', time: '08:00 - 09:00', isAvailable: true, price: 100000 },
                    { id: 'slot2', time: '09:00 - 10:00', isAvailable: false, price: 100000 },
                    { id: 'slot3', time: '10:00 - 11:00', isAvailable: true, price: 120000 },
                    { id: 'slot4', time: '11:00 - 12:00', isAvailable: true, price: 120000 },
                    { id: 'slot5', time: '14:00 - 15:00', isAvailable: true, price: 110000 },
                ];
                setAvailableTimeSlots(mockTimeSlots);
                setSelectedTimeSlot(''); // Reset selected time slot when court or date changes
                setTotalPrice(0);
            } else {
                setAvailableTimeSlots([]);
            }
        };
        fetchTimeSlots();
    }, [selectedDate, selectedCourt]);

    useEffect(() => {
        const selectedSlot = availableTimeSlots.find(slot => slot.id === selectedTimeSlot);
        if (selectedSlot) {
            setTotalPrice(selectedSlot.price);
        } else {
            setTotalPrice(0);
        }
    }, [selectedTimeSlot, availableTimeSlots]);


    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!selectedDate || !selectedCourt || !selectedTimeSlot) {
            setError('Vui lòng chọn đầy đủ ngày, sân và khung giờ.');
            return;
        }

        const selectedSlotDetail = availableTimeSlots.find(slot => slot.id === selectedTimeSlot);
        if (!selectedSlotDetail) {
            setError('Khung giờ không hợp lệ.');
            return;
        }

        if (!selectedSlotDetail.isAvailable) {
            setError('Khung giờ này hiện không khả dụng.');
            return;
        }

        try {
            // Call booking service to create a booking
            const bookingDetails = {
                courtId: selectedCourt,
                date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD
                timeSlotId: selectedTimeSlot,
                totalAmount: totalPrice,
                // userId: (from AuthContext)
            };
            // const response = await BookingService.createBooking(bookingDetails);
            // console.log('Booking successful:', response);
            alert('Đặt sân thành công! Bạn sẽ được chuyển đến trang thanh toán.');
            navigate('/payment', { state: { bookingDetails: { ...bookingDetails, time: selectedSlotDetail.time } } }); // Chuyển sang trang thanh toán
        } catch (err: any) {
            setError(err.message || 'Đặt sân thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Đặt sân cầu lông</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleBooking}>
                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Group controlId="bookingDate">
                            <Form.Label>Chọn ngày</Form.Label>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date: Date | null) => setSelectedDate(date)}
                                dateFormat="dd/MM/yyyy"
                                minDate={new Date()} // Không cho phép chọn ngày trong quá khứ
                                className="form-control"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="selectCourt">
                            <Form.Label>Chọn sân</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedCourt}
                                onChange={(e) => setSelectedCourt(e.target.value)}
                                required
                            >
                                <option value="">-- Chọn sân --</option>
                                {availableCourts.map((court) => (
                                    <option key={court.id} value={court.id}>
                                        {court.name} ({court.description})
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="selectTimeSlot">
                            <Form.Label>Chọn khung giờ</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedTimeSlot}
                                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                                disabled={!selectedCourt || !selectedDate || availableTimeSlots.length === 0}
                                required
                            >
                                <option value="">-- Chọn khung giờ --</option>
                                {availableTimeSlots.map((slot) => (
                                    <option
                                        key={slot.id}
                                        value={slot.id}
                                        disabled={!slot.isAvailable}
                                    >
                                        {slot.time} - {slot.price.toLocaleString()} VND {slot.isAvailable ? '' : '(Đã đặt)'}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>

                {selectedCourt && selectedTimeSlot && totalPrice > 0 && (
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Thông tin đặt sân</Card.Title>
                            <Card.Text>
                                **Sân:** {availableCourts.find(c => c.id === selectedCourt)?.name} <br />
                                **Ngày:** {selectedDate?.toLocaleDateString()} <br />
                                **Khung giờ:** {availableTimeSlots.find(s => s.id === selectedTimeSlot)?.time} <br />
                                **Tổng tiền:** <span className="fw-bold text-danger">{totalPrice.toLocaleString()} VND</span>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                )}

                <Button variant="primary" type="submit" className="w-100"
                    disabled={!selectedDate || !selectedCourt || !selectedTimeSlot || totalPrice === 0}>
                    Tiếp tục thanh toán
                </Button>
            </Form>

            <h3 className="mt-5">Lịch sử đặt sân của bạn</h3>
            {/* Đây là nơi bạn có thể hiển thị lịch sử đặt sân của người dùng */}
            <p>Chức năng này sẽ được phát triển sau, hiển thị danh sách các lần đặt sân đã qua.</p>
        </Container>
    );
};

export default BookingPage;