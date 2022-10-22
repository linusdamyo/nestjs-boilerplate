import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SOCIAL_STATUS } from '../../_enum/status.enum';
import { UserSocialEntity } from './entities/user-social.entity';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(private readonly dataSource: DataSource) {}

  async getUserSocial(userSocialId: number): Promise<UserSocialEntity> {
    return this.dataSource.getRepository(UserSocialEntity).findOneByOrFail({ userSocialId, socialStatus: SOCIAL_STATUS.NORMAL });
  }

  async getUser(userId: number): Promise<UserEntity> {
    return this.dataSource.getRepository(UserEntity).findOneBy({ userId });
  }

  async existNickname(nickname: string): Promise<boolean> {
    const cnt = await this.dataSource.getRepository(UserEntity).count({ where: { nickname } });
    return cnt > 0;
  }

  async createUser(userSocialId: number, nickname: string): Promise<UserEntity> {
    return this.dataSource.transaction(async manager => {
      const userInfo = await manager.getRepository(UserEntity).save({ nickname });

      await manager.getRepository(UserSocialEntity).update({ userSocialId }, { userId: userInfo.userId });

      return userInfo;
    });
  }
}
