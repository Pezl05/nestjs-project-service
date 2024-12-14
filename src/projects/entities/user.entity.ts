import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
@Index('idx_users_username', ['username'])
@Index('idx_users_email', ['email'])
@Index('idx_users_deleted_at', ['deletedAt'])
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Exclude()
  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  fullName: string;

  @Exclude()
  @Column({ type: 'varchar', length: 50, default: 'member' })
  role: string;

  @Exclude()
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
