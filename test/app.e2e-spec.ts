import request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { createTestingApp } from './_utils/create-testing-app';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api - ERROR', async () => {
    const res = await request(app.getHttpServer()).get('/api').expect(HttpStatus.EXPECTATION_FAILED);
    expect(res.body.statusCode).toEqual(HttpStatus.EXPECTATION_FAILED);
    expect(res.body.message).toEqual('/api return error.');
    expect(res.body.path).toEqual('/api');
  });

  it('POST /api - BAD REQUEST ERROR', async () => {
    const res = await request(app.getHttpServer()).post('/api').expect(HttpStatus.BAD_REQUEST);
    expect(res.body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.message).toEqual('Bad Request');
  });

  it('POST /api/hello', async () => {
    const res = await request(app.getHttpServer()).post('/api/hello').send({ hello: 'world' }).expect(HttpStatus.CREATED);
    expect(res.body.hello).toEqual('world');
  });
});
