import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user_id: number;

  @Column({ length: 50 })
  type: string; // 'confirmation', 'marketing'

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  is_read: boolean;

  @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  // Quan hệ: Một thông báo thuộc về một User
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}