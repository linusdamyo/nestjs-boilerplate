import { Injectable } from '@nestjs/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';

@Injectable()
export class RootService {
    constructor(
        @InjectPinoLogger(RootService.name)
        private readonly logger: PinoLogger,
    ) {}

    getHello(): { message: string } {
        this.logger.debug('getHello()');

        return { message: 'Hello World!' };
    }
}
