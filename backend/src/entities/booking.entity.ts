import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { User } from './user.entity';
import { Court } from './court.entity';
import { Payment } from './payment.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  // User có thể là null (khách vãng lai)
  @Column({ name: 'user_id', nullable: true })
  user_id: number | null;

  @Column({ name: 'court_id' })
  court_id: number;

  @Column({ nullable: true })
  staff_checkin_id: number | null;

  // Quan trọng: dùng timestamptz để không sai múi giờ Android
  @Column({ type: 'timestamptz' })
  start_time: Date;

  @Column({ type: 'timestamptz' })
  end_time: Date;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  deposit: number;

  @Column({ length: 50 })
  status: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  // ============ RELATION ============

  @ManyToOne(() => User, (user) => user.bookings, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @ManyToOne(() => Court, (court) => court.bookings)
  @JoinColumn({ name: 'court_id' })
  court: Court;

  @OneToOne(() => Payment, (payment) => payment.booking)
  payment: Payment;
}
