import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import request from 'supertest';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';

import { USER_STATUS } from '@_common/enums/status.enum';
import { JwtPayloadType } from '@_common/types/auth.type';
import { AppModule } from '@_app/app.module';
import { UserEntity } from '@users/entities/user.entity';

describe('UsersController (e2e)', () => {
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

    describe('getMe', () => {
        const userEmail = 'iu@email.com';

        let user: UserEntity;

        beforeAll(async () => {
            user = await dataSource.getRepository(UserEntity).save({
                email: userEmail,
                nickname: 'IU',
                status: USER_STATUS.NORMAL,
            });
        });

        afterAll(async () => {
            await dataSource.getRepository(UserEntity).delete({ id: user.id });
        });

        it('GET /users/me', async () => {
            const payload: JwtPayloadType = { sub: user.id };
            const accessToken = await jwtService.signAsync(payload, { secret: configService.getOrThrow('JWT_SECRET') });

            return request(app.getHttpServer()).get('/users/me').set('Authorization', `Bearer ${accessToken}`).expect(200);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
