import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';

import { USER_STATUS } from '@_common/enums/status.enum';
import { AppModule } from '@_app/app.module';
import { UserEntity } from '@auth/entities/user.entity';

describe('AuthController (e2e)', () => {
    let app: INestApplication<App>;
    let dataSource: DataSource;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, disableErrorMessages: false }));
        dataSource = app.get<DataSource>(DataSource);

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

    afterAll(async () => {
        await app.close();
    });
});
