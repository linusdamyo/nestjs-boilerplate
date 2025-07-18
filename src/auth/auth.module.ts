import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from '@auth/auth.service';
import { AuthController } from '@auth/auth.controller';
import { AuthRepository } from '@auth/auth.repository';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.getOrThrow('JWT_EXPIRES_IN'),
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthRepository],
})
export class AuthModule {}
