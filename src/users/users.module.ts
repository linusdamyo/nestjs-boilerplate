import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from '@users/users.service';
import { UsersController } from '@users/users.controller';
import { UsersRepository } from '@users/users.repository';
import { UserEntity } from '@users/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
})
export class UsersModule {}
