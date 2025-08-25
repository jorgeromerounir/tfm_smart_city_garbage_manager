import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum WasteLevel {
  LIGHT = 'light',
  MEDIUM = 'medium',
  HEAVY = 'heavy',
}

@Entity()
export class Container {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number

  @Column({
    type: 'text',
    enum: WasteLevel,
    default: WasteLevel.LIGHT,
  })
  wasteLevel: WasteLevel

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  temperature: number

  @Column({ type: 'text', nullable: true })
  address: string

  @Column({ type: 'text', nullable: true })
  city: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
