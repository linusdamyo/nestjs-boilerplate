import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { CatchEverythingFilter } from '@src/_common/catch-everything.filter';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new CatchEverythingFilter(httpAdapter));

    await app.listen(process.env.PORT ?? 8080);
}
bootstrap().catch(console.error);
