import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Booking } from './booking.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  booking_id: number;

  @Column()
  user_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 50, nullable: true })
  payment_type: string; // deposit, full, membership

  @Column({ length: 50, default: 'completed' })
  payment_status: string;

  @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
  transaction_date: Date;

  // Quan hệ: Một giao dịch thuộc về một User
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Quan hệ: Một giao dịch có thể liên kết với một Booking
  @OneToOne(() => Booking, (booking) => booking.payment) // <-- ĐÃ SỬA: 'Payment' -> 'payment'
  @JoinColumn({ name: 'booking_id' }) 
  booking: Booking;
}