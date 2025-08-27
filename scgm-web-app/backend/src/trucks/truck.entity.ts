import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Truck {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  name: string

  @Column({ type: 'text' })
  licensePlate: string

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  capacity: number

  @Column({ type: 'text', nullable: true })
  city: string

  @Column({ type: 'boolean', default: true })
  available: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}