import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('memberships')
export class Membership {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  discount_percent: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  duration_days: number;

  @Column({ type: 'text', nullable: true })
  description: string;
}