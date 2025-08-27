import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum AssignmentStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity()
export class RouteAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  routeName: string

  @Column({ type: 'json' })
  routeData: any

  @Column({ type: 'text' })
  truckId: string

  @Column({ type: 'text' })
  operatorId: string

  @Column({ type: 'text' })
  supervisorId: string

  @Column({ type: 'text' })
  city: string

  @Column({
    type: 'text',
    enum: AssignmentStatus,
    default: AssignmentStatus.PENDING,
  })
  status: AssignmentStatus

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}