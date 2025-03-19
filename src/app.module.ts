import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';

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
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
