import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from '@auth/auth.service';
import { AuthController } from '@auth/auth.controller';
import { UserEntity } from '@auth/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
