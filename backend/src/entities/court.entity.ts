import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from './booking.entity';

@Entity('courts')
export class Court {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  hourly_rate: number;

  @Column({ length: 50, default: 'available' })
  status: string; // 'available', 'maintenance', 'booked'

  // Mối quan hệ với bookings (Sân có nhiều lịch đặt)
  @OneToMany(() => Booking, booking => booking.court)
  bookings: Booking[];
}