import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Index } from 'typeorm';
import { User } from 'src/projects/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';

@Entity('project_members')
@Index('idx_project_members_project_id', ['projectId'])
@Index('idx_project_members_user_id', ['userId'])
export class ProjectMember {
    @PrimaryGeneratedColumn()
    projectMemberId: number;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'projectId' })
    projectId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    userId: number;

    @Column({ type: 'varchar', length: 50, default: 'member' })
    role: string;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    joinedAt: Date;
}
