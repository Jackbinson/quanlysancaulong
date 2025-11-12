// src/types/booking.types.ts
export interface Booking {
    id: string;
    courtId: string;
    date: string; // YYYY-MM-DD
    timeSlotId: string;
    userId: string;
    totalAmount: number;
    status: 'pending_payment' | 'completed' | 'cancelled'; // Các trạng thái có thể có
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
    // Thêm các trường khác nếu cần, ví dụ: paymentId, voucherUsed
}

export interface CreateBookingPayload {
    courtId: string;
    date: string;
    timeSlotId: string;
    totalAmount: number;
    // userId (sẽ được lấy từ token hoặc context ở backend)
}

export interface PaymentDetails {
    bookingId: string;
    amount: number;
    paymentMethod: 'card' | 'momo' | 'zalopay' | 'bank'; // Các phương thức thanh toán
    voucherCode?: string | null;
}

export interface PaymentResult {
    success: boolean;
    message: string;
    transactionId?: string;
    bookingId: string;
    amountPaid: number;
}