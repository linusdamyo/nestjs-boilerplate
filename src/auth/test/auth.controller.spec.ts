import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { USER_STATUS } from '@_common/enums/status.enum';
import { TypeOrmConfigService } from '@_common/typeorm-config.service';
import databaseConfig from '@_config/database.config';
import { AuthController } from '@auth/auth.controller';
import { AuthModule } from '@auth/auth.module';
import { SignInRequestDto } from '@auth/dto/sign-in.dto';
import { UserEntity } from '@auth/entities/user.entity';

describe('AuthController', () => {
    let controller: AuthController;
    let dataSource: DataSource;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: `${__dirname}/../../_config/.env.${process.env.NODE_ENV}`,
                    isGlobal: true,
                    cache: true,
                    load: [databaseConfig],
                }),
                TypeOrmModule.forRootAsync({
                    useClass: TypeOrmConfigService,
                }),
                AuthModule,
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        dataSource = module.get<DataSource>(DataSource);
    });

    describe('signIn', () => {
        const userEmail = 'iu@email.com';
        const userPassword = 'valid-password';

        const blockedUserEmail = 'blocked@email.com';

        beforeAll(async () => {
            await dataSource.getRepository(UserEntity).save([
                {
                    email: userEmail,
                    password: userPassword,
                    status: USER_STATUS.NORMAL,
                },
                {
                    email: blockedUserEmail,
                    password: userPassword,
                    status: USER_STATUS.BLOCKED,
                },
            ]);
        });

        afterAll(async () => {
            await dataSource.getRepository(UserEntity).delete({});
        });

        it('throw - User not found.', async () => {
            const request: SignInRequestDto = {
                username: `not-${userEmail}`,
                password: userPassword,
            };

            await expect(controller.signIn(request)).rejects.toThrow('User not found.');
        });

        it('throw - User is not normal.', async () => {
            const request: SignInRequestDto = {
                username: blockedUserEmail,
                password: userPassword,
            };

            await expect(controller.signIn(request)).rejects.toThrow('User is not normal.');
        });

        it('throw - Invalid password.', async () => {
            const request: SignInRequestDto = {
                username: userEmail,
                password: `invalid-${userPassword}`,
            };

            await expect(controller.signIn(request)).rejects.toThrow('Invalid password.');
        });

        it('should return a token', async () => {
            const request: SignInRequestDto = {
                username: userEmail,
                password: userPassword,
            };

            const result = await controller.signIn(request);

            expect(result).toHaveProperty('accessToken');
        });
    });
});
