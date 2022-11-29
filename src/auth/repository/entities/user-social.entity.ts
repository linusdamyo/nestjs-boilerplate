import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserEntity } from './user.entity';
import { SOCIAL_STATUS } from '../../../_enum/status.enum';
import { SOCIAL_TYPE } from '../../../_enum/type.enum';

@Entity('user_social')
@Unique(['socialType', 'socialKey'])
export class UserSocialEntity {
    @PrimaryGeneratedColumn({ name: 'user_social_id' })
    userSocialId: number;

    @Column({ name: 'user_id', nullable: true })
    userId?: number;

    @Column('enum', { enum: SOCIAL_TYPE, name: 'social_type' })
    socialType: SOCIAL_TYPE;

    @Column({ name: 'social_key' })
    socialKey: string;

    @Column('enum', { enum: SOCIAL_STATUS, name: 'social_status' })
    socialStatus: SOCIAL_STATUS;

    @Column({ name: 'payload' })
    payload: string;

    @ManyToOne(() => UserEntity, _ => _.userSocialList)
    @JoinColumn({ name: 'user_id' })
    userInfo?: UserEntity;
}
