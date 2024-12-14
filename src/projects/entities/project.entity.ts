import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from './user.entity';

@Entity('projects')
@Index('idx_projects_deleted_at', ['deletedAt'])
@Index('idx_projects_created_by', ['createdBy'])
@Index('idx_projects_status', ['status'])
@Index('idx_projects_dates', ['startDate', 'endDate'])
export class Project {
  @PrimaryGeneratedColumn()
  projectId: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  createdBy: number;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Exclude()
  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
