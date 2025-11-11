import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity'; 
import { Court } from './court.entity'; 
import { Payment } from './payment.entity'; 

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ name: 'court_id' })
  court_id: number;
  
  @Column({ nullable: true })
  staff_checkin_id: number;

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
  status: string; 

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;


  // Mối quan hệ Many-to-One
  @ManyToOne(() => User, (user) => user.bookings) 
  @JoinColumn({ name: 'user_id' }) 
  user: User;

  @ManyToOne(() => Court, (court) => court.bookings)
  @JoinColumn({ name: 'court_id' }) 
  court: Court;
    
  // Mối quan hệ One-to-One
  @OneToOne(() => Payment, (payment) => payment.booking)
  payment: Payment; 
}