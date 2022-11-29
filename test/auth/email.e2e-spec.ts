import { INestApplication, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource, In } from 'typeorm';
import request from 'supertest';
import crypto from 'crypto';
import { createTestingApp } from '../_utils/create-testing-app';
import { UserEntity } from '../../src/auth/repository/entities/user.entity';

describe('AuthModule (e2e) - email', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    const userIdSet = new Set<number>();

    beforeAll(async () => {
        app = await createTestingApp();

        dataSource = app.get(DataSource);
    });

    describe('POST /api/auth/email', () => {
        beforeAll(async () => {
            const salt = crypto.randomBytes(16).toString('hex');
            const hash = crypto.pbkdf2Sync('123456', salt, 1000, 64, 'sha512').toString('hex');

            const userInfo = await dataSource.getRepository(UserEntity).save({ email: 'iu@example.com', password: salt + '.' + hash });
            userIdSet.add(userInfo.userId);
        });

        it('이메일 로그인', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/auth/email')
                .send({ username: 'iu@example.com', password: '123456' })
                .expect(HttpStatus.CREATED);

            expect(res.body).toHaveProperty('accessToken');

            const { accessToken } = res.body;
            const { userId } = new JwtService().verify(accessToken, { secret: process.env.JWT_SECRET });

            expect(userId).toEqual(userIdSet.values().next().value);
        });
    });

    afterAll(async () => {
        await dataSource.getRepository(UserEntity).delete({ userId: In([...userIdSet]) });

        await app.close();
    });
});
