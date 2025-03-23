import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AuthUserType } from '@_common/types/auth.type';
import { USER_STATUS } from '@_common/enums/status.enum';
import { TypeOrmConfigService } from '@_common/typeorm-config.service';
import databaseConfig from '@_config/database.config';
import { UsersController } from '@users/users.controller';
import { UsersModule } from '@users/users.module';
import { UserEntity } from '@users/entities/user.entity';
import { GetMeResponseDto } from '@users/dto/get-me.dto';

describe('UsersController', () => {
    let controller: UsersController;
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
                UsersModule,
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        dataSource = module.get<DataSource>(DataSource);
    });

    describe('getMe', () => {
        const userEmail = 'iu@email.com';
        const userPassword = 'valid-password';

        const blockedUserEmail = 'blocked@email.com';

        let normalUser: UserEntity;
        let blockedUser: UserEntity;

        beforeAll(async () => {
            [normalUser, blockedUser] = await dataSource.getRepository(UserEntity).save([
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
            const authUser: AuthUserType = {
                userId: 'a0ffa71a-1927-4efa-9bc8-d840752c2225', // invalid user id
            };

            await expect(controller.getMe(authUser)).rejects.toThrow('User not found.');
        });

        it('throw - User is not normal.', async () => {
            const authUser: AuthUserType = {
                userId: blockedUser.id,
            };

            await expect(controller.getMe(authUser)).rejects.toThrow('User is not normal.');
        });

        it('should return a token', async () => {
            const authUser: AuthUserType = {
                userId: normalUser.id,
            };

            const result = await controller.getMe(authUser);

            expect(result).toEqual(new GetMeResponseDto(normalUser));
        });
    });
});
