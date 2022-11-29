import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SOCIAL_STATUS } from '../../../_enum/status.enum';

@Entity('user_social')
export class UserSocialEntity {
    @PrimaryGeneratedColumn({ name: 'user_social_id' })
    userSocialId: number;

    @Column({ name: 'user_id', nullable: true })
    userId?: number;

    @Column('enum', { enum: SOCIAL_STATUS, name: 'social_status' })
    socialStatus: SOCIAL_STATUS;
}
