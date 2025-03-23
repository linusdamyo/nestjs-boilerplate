import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from 'nestjs-pino';

import databaseConfig from '@_config/database.config';
import { TypeOrmConfigService } from '@_common/typeorm-config.service';
import { JwtStrategy } from '@_common/jwt/jwt.strategy';
import { AuthModule } from '@auth/auth.module';
import { RootModule } from '@root/root.module';

@Module({
    imports: [
        LoggerModule.forRoot({
            pinoHttp: {
                level: process.env.PINO_LOG_LEVEL || 'info',
                transport:
                    process.env.NODE_ENV !== 'production'
                        ? {
                              target: 'pino-pretty',
                              options: {
                                  colorize: true,
                              },
                          }
                        : undefined,
                customLogLevel(req, res, err) {
                    if (process.env.NODE_ENV === 'test') return 'silent';

                    if (res.statusCode >= 400 && res.statusCode < 500) {
                        return 'warn';
                    } else if (res.statusCode >= 500 || err) {
                        return 'error';
                    } else {
                        return 'info';
                    }
                },
            },
        }),
        ConfigModule.forRoot({
            envFilePath: `${__dirname}/../_config/.env.${process.env.NODE_ENV}`,
            isGlobal: true,
            cache: true,
            load: [databaseConfig],
        }),
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmConfigService,
        }),
        PassportModule,
        AuthModule,
        RootModule,
    ],
    providers: [JwtStrategy],
})
export class AppModule {}
