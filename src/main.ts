import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './_common/exception/all-exceptions.filter';
import { HttpLoggingInterceptor } from './_common/logging/http-logging.interceptor';
import { AppModule } from './app.module';

import { version } from '../package.json';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: new Logger() });
    app.setGlobalPrefix('/api');

    app.enableCors();

    app.useGlobalInterceptors(new HttpLoggingInterceptor());

    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, transform: true, transformOptions: { enableImplicitConversion: true }, disableErrorMessages: false }),
    );

    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, new Logger(AllExceptionsFilter.name)));

    const config = new DocumentBuilder().setTitle('NestJS Boilerplate API').setDescription('NestJS Boilerplate API 문서').setVersion(version).build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/docs', app, document);

    const configService = app.get(ConfigService);

    await app.listen(configService.get('PORT'));
}
bootstrap();
