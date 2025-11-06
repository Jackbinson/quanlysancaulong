import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from './booking.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string; // Tên cột phải khớp với tên trong init.sql

  @Column({ length: 100, nullable: true })
  full_name: string;

  @Column({ length: 15, nullable: true })
  phone_number: string;

  @Column({ length: 50, default: 'user' })
  role: string; // 'user', 'staff', 'admin'

  @Column({ nullable: true })
  membership_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  // Mối quan hệ với bookings (Người dùng có nhiều lịch đặt)
  @OneToMany(() => Booking, booking => booking.user) // <--- ĐÃ SỬA DỤNG HÀM MŨI TÊN
  bookings: Booking[];
}