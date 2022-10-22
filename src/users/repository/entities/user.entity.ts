import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { USER_STATUS } from '../../../_enum/status.enum';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ name: 'nickname' })
  nickname: string;

  @Column('enum', { enum: USER_STATUS, name: 'user_status' })
  userStatus: USER_STATUS;

  @Column({ name: 'user_level' })
  userLevel: number;

  @Column({ name: 'email', nullable: true })
  email?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'modified_at', nullable: true })
  modifiedAt?: Date;
}
