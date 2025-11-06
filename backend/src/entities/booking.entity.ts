import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity'; // <-- Import User
import { Court } from './court.entity'; // <-- Import Court
import { Payment } from './payment.entity'; // <-- BẮT BUỘC PHẢI IMPORT PAYMENT

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  // --- Foreign Keys ---
  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ name: 'court_id' })
  court_id: number;
  
  @Column({ nullable: true })
  staff_checkin_id: number;
  // --------------------

  @Column({ type: 'timestamp' })
  start_time: Date;

  @Column({ type: 'timestamp' })
  end_time: Date;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  deposit: number;

  @Column({ length: 50 })
  status: string; // e.g., 'pending', 'confirmed', 'cancelled'

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;


  // --- Mối quan hệ: Many-to-One ---
  
  // Mối quan hệ với User (Bắt buộc phải dùng hàm mũi tên)
  @ManyToOne(() => User, (user) => user.bookings) 
  @JoinColumn({ name: 'user_id' }) // Liên kết với cột user_id
  user: User;

  // Mối quan hệ với Court
  @ManyToOne(() => Court, (court) => court.bookings)
  @JoinColumn({ name: 'court_id' }) // Liên kết với cột court_id
  court: Court;
    
  // --- Mối quan hệ: One-to-One (Ngược lại với Payment) ---
  @OneToOne(() => Payment, (payment) => payment.booking)
  payment: Payment; // <--- KHAI BÁO THUỘC TÍNH 'payment' để khắc phục lỗi biên dịch
}