import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from './booking.entity';
import { Membership } from './membership.entity'; // <-- BẮT BUỘC: Import Membership Entity

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ unique: true })
    email: string;

    @Column()
    password_hash: string;
    
    @Column({ length: 100, nullable: true })
    full_name: string;

    @Column({ length: 15, nullable: true })
    phone_number: string;

    @Column({ length: 50, default: 'user' })
    role: string; // 'user', 'staff', 'admin'

    // 1. Cột khóa ngoại (Foreign Key)
    @Column({ nullable: true, name: 'membership_id' }) 
    membership_id: number; // Cột này đã có trong DB

    // 2. Định nghĩa MỐI QUAN HỆ ManyToOne (Giải quyết lỗi 'Property membership does not exist')
    // Cho phép TypeORM load toàn bộ object Membership khi dùng relations: ['membership']
    @ManyToOne(() => Membership, { nullable: true })
    @JoinColumn({ name: 'membership_id' }) // <-- Liên kết chính xác với cột khóa ngoại
    membership: Membership; // <-- Property bị lỗi đã được định nghĩa!
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    // Mối quan hệ với bookings (Người dùng có nhiều lịch đặt)
    @OneToMany(() => Booking, (booking) => booking.user)
    bookings: Booking[];
}