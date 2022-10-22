import { INestApplication, HttpStatus } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import request from 'supertest';
import { UserEntity } from '../../src/users/repository/entities/user.entity';
import { createTestingApp } from '../_utils/create-testing-app';
import { testUserLoginBearer } from '../_utils/test-user-login';

describe('UsersModule (e2e) - /me', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  const userIdSet = new Set<number>();

  beforeAll(async () => {
    app = await createTestingApp();

    dataSource = app.get(DataSource);
  });

  describe('GET /api/users/me', () => {
    beforeAll(async () => {
      const userInfo = await dataSource.getRepository(UserEntity).save({ email: 'iu_me@example.com', nickname: '아이유 me' });
      userIdSet.add(userInfo.userId);
    });

    it('내 정보', async () => {
      const bearer = await testUserLoginBearer(app, userIdSet.values().next().value);

      const res = await request(app.getHttpServer()).get('/api/users/me').set('Authorization', bearer);

      expect(res.body.message).not.toBeDefined();
      expect(res.statusCode).toEqual(HttpStatus.OK);

      expect(res.body).toEqual({
        nickname: '아이유 me',
        email: 'iu_me@example.com',
      });
    });
  });

  afterAll(async () => {
    await dataSource.getRepository(UserEntity).delete({ userId: In([...userIdSet]) });

    await app.close();
  });
});
