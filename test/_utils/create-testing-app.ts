import { TestingModule, Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from '../../src/_common/exception/all-exceptions.filter';
import { AppModule } from '../../src/app.module';

export const createTestingApp = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    providers: [{ provide: Logger, useValue: { error: process.env.LOGGING === 'true' ? console.log : jest.fn() } }],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.setGlobalPrefix('/api');

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, app.get(Logger)));

  await app.init();

  return app;
};
