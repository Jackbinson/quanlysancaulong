// src/services/BookingService.ts
import { Booking, CreateBookingPayload, PaymentDetails, PaymentResult } from '../types/Booking.types'; // Đã sửa tên file type

class BookingService {
    private baseUrl = 'http://localhost:3001/api/bookings'; // Giả định API endpoint

    async createBooking(payload: CreateBookingPayload): Promise<Booking> {
        console.log('Creating booking with payload:', payload);

        // Giả lập API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const newBooking: Booking = {
                    id: `booking${Date.now()}`,
                    courtId: payload.courtId,
                    date: payload.date,
                    timeSlotId: payload.timeSlotId,
                    userId: 'mock_user_id', // Lấy từ context hoặc token
                    totalAmount: payload.totalAmount,
                    status: 'pending_payment',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                resolve(newBooking);
            }, 1000);
        });

        /*
        // Ví dụ với fetch API thực tế
        const response = await fetch(`${this.baseUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${getToken()}` // Thêm token nếu cần xác thực
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Đặt sân thất bại.');
        }

        return response.json();
        */
    }

    async processPayment(details: PaymentDetails): Promise<PaymentResult> {
        console.log('Processing payment with details:', details);

        // Giả lập API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Logic xử lý thanh toán giả định
                if (details.amount > 0 && details.paymentMethod) {
                    resolve({
                        success: true,
                        message: 'Thanh toán thành công!',
                        transactionId: `TX${Date.now()}`,
                        bookingId: details.bookingId,
                        amountPaid: details.amount,
                    });
                } else {
                    reject(new Error('Thông tin thanh toán không hợp lệ.'));
                }
            }, 1500);
        });

        /*
        // Ví dụ với fetch API thực tế
        const response = await fetch(`${this.baseUrl}/payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(details),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Thanh toán thất bại.');
        }

        return response.json();
        */
    }

    async getBookingHistory(userId: string): Promise<Booking[]> {
        console.log('Fetching booking history for user:', userId);

        // Giả lập API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockHistory: Booking[] = [
                    { id: 'b001', courtId: 'court1', date: '2023-10-20', timeSlotId: 'slot3', userId: userId, totalAmount: 120000, status: 'completed', createdAt: '2023-10-18T10:00:00Z', updatedAt: '2023-10-18T10:05:00Z' },
                    { id: 'b002', courtId: 'court2', date: '2023-10-22', timeSlotId: 'slot1', userId: userId, totalAmount: 100000, status: 'completed', createdAt: '2023-10-20T11:30:00Z', updatedAt: '2023-10-20T11:35:00Z' },
                ];
                resolve(mockHistory);
            }, 800);
        });

        /*
        // Ví dụ với fetch API thực tế
        const response = await fetch(`${this.baseUrl}/history/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${getToken()}`
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Lỗi khi tải lịch sử đặt sân.');
        }

        return response.json();
        */
    }
}

export const bookingService = new BookingService(); 