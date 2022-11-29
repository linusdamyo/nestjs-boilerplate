import { INestApplication, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource, In } from 'typeorm';
import request from 'supertest';
import { createTestingApp } from '../_utils/create-testing-app';
import { KakaoService } from '../../src/auth/services/kakao.service';
import { UserSocialEntity } from '../../src/auth/repository/entities/user-social.entity';
import { UserEntity } from '../../src/auth/repository/entities/user.entity';
import { USER_STATUS, SOCIAL_STATUS } from '../../src/_enum/status.enum';
import { SOCIAL_TYPE } from '../../src/_enum/type.enum';

describe('AuthModule (e2e) - kakao', () => {
    let app: INestApplication;
    let kakaoService: KakaoService;
    let dataSource: DataSource;
    const userSocialIdSet = new Set<number>();
    const userIdSet = new Set<number>();

    beforeAll(async () => {
        app = await createTestingApp();

        kakaoService = app.get(KakaoService);
        dataSource = app.get(DataSource);

        jest.spyOn(kakaoService, 'getSocialPayload').mockImplementation(() =>
            Promise.resolve({
                socialType: SOCIAL_TYPE.KAKAO,
                socialKey: 'kakao_id',
                payload: '{"id":"kakao_id"}',
            }),
        );
    });

    describe('POST /api/auth/kakao', () => {
        it('처음 카카오 ID 연동', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/auth/kakao')
                .send({ code: '123456', redirectUri: 'https://amoo_url' })
                .expect(HttpStatus.CREATED);

            expect(res.body.isNewUser).toBe(true);
            expect(res.body).toHaveProperty('userSocialId');

            userSocialIdSet.add(res.body.userSocialId);
            expect(userSocialIdSet.size).toEqual(1);

            const userSocialInfo = await dataSource.getRepository(UserSocialEntity).findOneBy({ userSocialId: res.body.userSocialId });
            expect(userSocialInfo.socialKey).toEqual('kakao_id');
            expect(userSocialInfo.socialStatus).toEqual(SOCIAL_STATUS.NORMAL);
        });

        it('카카오 ID 연동만 한 경우, user_social 테이블은 기존꺼를 활용', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/auth/kakao')
                .send({ code: '123456', redirectUri: 'https://amoo_url' })
                .expect(HttpStatus.CREATED);

            expect(res.body.isNewUser).toBe(true);
            expect(res.body).toHaveProperty('userSocialId');

            userSocialIdSet.add(res.body.userSocialId);
            expect(userSocialIdSet.size).toEqual(1);

            const userSocialInfo = await dataSource.getRepository(UserSocialEntity).findOneBy({ userSocialId: res.body.userSocialId });
            expect(userSocialInfo.socialKey).toEqual('kakao_id');
            expect(userSocialInfo.socialStatus).toEqual(SOCIAL_STATUS.NORMAL);
        });

        describe('기존 회원인 경우', () => {
            beforeAll(async () => {
                const userInfo = await dataSource.getRepository(UserEntity).save({ userStatus: USER_STATUS.NORMAL });
                await dataSource
                    .getRepository(UserSocialEntity)
                    .update({ userSocialId: userSocialIdSet.values().next().value }, { userId: userInfo.userId });
                userIdSet.add(userInfo.userId);
            });

            it('기존 회원은 로그인 처리', async () => {
                const res = await request(app.getHttpServer())
                    .post('/api/auth/kakao')
                    .send({ code: '123456', redirectUri: 'https://amoo_url' })
                    .expect(HttpStatus.CREATED);

                expect(res.body.isNewUser).toBe(false);
                expect(res.body).toHaveProperty('accessToken');

                const { accessToken } = res.body;
                const { userId } = new JwtService().verify(accessToken, { secret: process.env.JWT_SECRET });

                expect(userId).toEqual(userIdSet.values().next().value);
            });
        });
    });

    afterAll(async () => {
        await dataSource.getRepository(UserSocialEntity).delete({ userSocialId: In([...userSocialIdSet]) });
        await dataSource.getRepository(UserEntity).delete({ userId: In([...userIdSet]) });

        await app.close();
    });
});
