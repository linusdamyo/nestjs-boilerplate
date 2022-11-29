import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SOCIAL_TYPE } from '../../_enum/type.enum';
import { UserSocialEntity } from './entities/user-social.entity';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class AuthRepository {
    constructor(private readonly dataSource: DataSource) {}

    async getUserByEmail(email: string): Promise<UserEntity> {
        return this.dataSource.getRepository(UserEntity).findOneBy({ email });
    }

    async getUserBySocialKey(socialType: SOCIAL_TYPE, socialKey: string): Promise<UserEntity> {
        return this.dataSource
            .getRepository(UserEntity)
            .createQueryBuilder('user')
            .innerJoin('user.userSocialList', 'social', 'social.social_type = :socialType AND social.social_key = :socialKey', {
                socialType,
                socialKey,
            })
            .getOne();
    }

    async getUserSocialBySocialKey(socialType: SOCIAL_TYPE, socialKey: string): Promise<UserSocialEntity> {
        return this.dataSource.getRepository(UserSocialEntity).findOneBy({ socialType, socialKey });
    }

    async saveUserSocial(userSocialInfo: Partial<UserSocialEntity>): Promise<UserSocialEntity> {
        return this.dataSource.getRepository(UserSocialEntity).save(userSocialInfo);
    }
}
