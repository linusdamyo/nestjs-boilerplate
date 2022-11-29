import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './controllers/auth.controller';
import { AuthRepository } from './repository/auth.repository';
import { AuthService } from './services/auth.service';
import { KakaoService } from './services/kakao.service';
import { GoogleService } from './services/google.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
    imports: [
        PassportModule,
        ConfigModule,
        HttpModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get('JWT_EXP'),
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthRepository, AuthService, KakaoService, GoogleService, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
