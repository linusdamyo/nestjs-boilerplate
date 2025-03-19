import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from 'nestjs-pino';

import { RootController } from '@root/root.controller';
import { RootService } from '@root/root.service';

describe('RootController', () => {
    let rootController: RootController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [LoggerModule.forRoot()],
            controllers: [RootController],
            providers: [RootService],
        }).compile();

        rootController = app.get<RootController>(RootController);
    });

    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(rootController.getHello()).toStrictEqual({ message: 'Hello World!' });
        });
    });
});
