import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import request from 'supertest';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';

import { USER_STATUS } from '@_common/enums/status.enum';
import { JwtPayloadType } from '@_common/types/auth.type';
import { AppModule } from '@_app/app.module';
import { UserEntity } from '@auth/entities/user.entity';

describe('AuthController (e2e)', () => {
    let app: INestApplication<App>;
    let dataSource: DataSource;
    let jwtService: JwtService;
    let configService: ConfigService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, disableErrorMessages: false }));
        dataSource = app.get<DataSource>(DataSource);
        jwtService = app.get(JwtService);
        configService = app.get(ConfigService);

        await app.init();
    });

    describe('signIn', () => {
        const userEmail = 'iu@email.com';
        const userPassword = 'valid-password';

        beforeAll(async () => {
            await dataSource.getRepository(UserEntity).save({
                email: userEmail,
                password: userPassword,
                status: USER_STATUS.NORMAL,
            });
        });

        afterAll(async () => {
            await dataSource.getRepository(UserEntity).delete({});
        });

        it('POST /auth/signIn', () => {
            return request(app.getHttpServer())
                .post('/auth/signIn')
                .send({
                    username: userEmail,
                    password: userPassword,
                })
                .expect(200);
        });
    });

    describe('POST /auth/test', () => {
        it('Unauthorized', () => {
            return request(app.getHttpServer()).post('/auth/test').expect(HttpStatus.UNAUTHORIZED);
        });

        it('JwtGuard - OK', async () => {
            const payload: JwtPayloadType = { sub: 'abcd' };
            const accessToken = await jwtService.signAsync(payload, { secret: configService.getOrThrow('JWT_SECRET') });

            return request(app.getHttpServer())
                .post('/auth/test')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(HttpStatus.CREATED)
                .expect('abcd');
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
