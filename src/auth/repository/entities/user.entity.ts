import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserSocialEntity } from './user-social.entity';
import { USER_STATUS } from '../../../_enum/status.enum';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column('enum', { enum: USER_STATUS, name: 'user_status' })
  userStatus: USER_STATUS;

  @Column({ name: 'user_level' })
  userLevel: number;

  @Column({ name: 'email', nullable: true })
  email?: string;

  @Column({ name: 'password', nullable: true })
  password?: string;

  @OneToMany(() => UserSocialEntity, _ => _.userInfo)
  userSocialList?: UserSocialEntity[];
}
