import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { USER_STATUS } from '@_common/enums/status.enum';

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'email', default: '' })
    email: string;

    @Column({ name: 'nickname', default: '' })
    nickname: string;

    @Column('enum', { enum: USER_STATUS, default: USER_STATUS.NORMAL })
    status: USER_STATUS;
}
