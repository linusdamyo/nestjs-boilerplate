import { INestApplication, HttpStatus } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import request from 'supertest';
import { UserSocialEntity } from './../../src/auth/repository/entities/user-social.entity';
import { UserEntity } from '../../src/users/repository/entities/user.entity';
import { createTestingApp } from '../_utils/create-testing-app';
import { SOCIAL_TYPE } from '../../src/_enum/type.enum';

describe('UsersModule (e2e) - /users', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  const userIdSet = new Set<number>();

  beforeAll(async () => {
    app = await createTestingApp();

    dataSource = app.get(DataSource);
  });

  describe('POST /api/users/by-social', () => {
    let userSocialInfo: UserSocialEntity;

    beforeAll(async () => {
      const userInfo = await dataSource.getRepository(UserEntity).save({ email: 'iu_best@example.com', nickname: '아이유 최고' });
      userIdSet.add(userInfo.userId);

      userSocialInfo = await dataSource.getRepository(UserSocialEntity).save({ socialType: SOCIAL_TYPE.GOOGLE, socialKey: 'lovely_iu' });
    });

    it('회원 가입 실패 - 사용중인 닉네임', async () => {
      const nickname = '아이유 최고';

      const res = await request(app.getHttpServer()).post('/api/users/by-social').send({ userSocialId: userSocialInfo.userSocialId, nickname });

      expect(res.body.message).toBeDefined();
      expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    });

    it('회원 가입 (소셜)', async () => {
      const nickname = '러블리 아이유';

      const res = await request(app.getHttpServer()).post('/api/users/by-social').send({ userSocialId: userSocialInfo.userSocialId, nickname });

      expect(res.body.message).not.toBeDefined();
      expect(res.statusCode).toEqual(HttpStatus.CREATED);

      const userSocialInfoAfter = await dataSource.getRepository(UserSocialEntity).findOneBy({ userSocialId: userSocialInfo.userSocialId });

      expect(userSocialInfoAfter.userId).toBeDefined();
      expect(userSocialInfoAfter.userId).toBeGreaterThan(0);

      userIdSet.add(userSocialInfoAfter.userId);

      const userInfo = await dataSource.getRepository(UserEntity).findOneBy({ userId: userSocialInfoAfter.userId });

      expect(userInfo).toBeDefined();
      expect(userInfo.nickname).toEqual(nickname);
    });

    it('회원 가입 실패 - 이미 가입된 유저', async () => {
      const nickname = '다른 아이유';

      const res = await request(app.getHttpServer()).post('/api/users/by-social').send({ userSocialId: userSocialInfo.userSocialId, nickname });

      expect(res.body.message).toBeDefined();
      expect(res.statusCode).toEqual(HttpStatus.FORBIDDEN);
    });

    afterAll(async () => {
      await dataSource.getRepository(UserSocialEntity).delete({ userSocialId: userSocialInfo.userSocialId });
    });
  });

  afterAll(async () => {
    await dataSource.getRepository(UserEntity).delete({ userId: In([...userIdSet]) });

    await app.close();
  });
});
