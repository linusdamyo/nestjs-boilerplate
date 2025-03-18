import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';

import { CatchEverythingFilter } from '@src/_common/catch-everything.filter';
import { LoggingInterceptor } from '@src/_common/logging.interceptor';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });

    const logger = app.get(Logger);
    app.useLogger(logger);
    app.useGlobalInterceptors(new LoggingInterceptor(logger));

    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new CatchEverythingFilter(httpAdapter));

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, disableErrorMessages: false }));

    await app.listen(process.env.PORT ?? 8080);
}
bootstrap().catch(console.error);
