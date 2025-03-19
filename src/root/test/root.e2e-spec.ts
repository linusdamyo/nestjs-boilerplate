import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '@_app/app.module';

describe('RootController (e2e)', () => {
    let app: INestApplication<App>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, disableErrorMessages: false }));

        await app.init();
    });

    it('GET /', () => {
        return request(app.getHttpServer()).get('/').expect(200).expect({ message: 'Hello World!' });
    });

    it('POST /', () => {
        return request(app.getHttpServer()).post('/').expect(500).expect({ statusCode: 500, message: 'Internal server error' });
    });

    afterAll(async () => {
        await app.close();
    });
});
