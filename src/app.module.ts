import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';

import databaseConfig from '@src/_config/database.config';
import { TypeOrmConfigService } from '@src/_common/typeorm-config.service';
import { AuthModule } from './auth/auth.module';
import { RootModule } from './root/root.module';

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
            envFilePath: `${__dirname}/_config/.env.${process.env.NODE_ENV}`,
            isGlobal: true,
            cache: true,
            load: [databaseConfig],
        }),
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmConfigService,
        }),
        AuthModule,
        RootModule,
    ],
})
export class AppModule {}
