import { Injectable, BadRequestException, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  throwError() {
    this.logger.log('new Error()');
    throw new Error('/api return error.');
  }

  throwBadRequest() {
    throw new BadRequestException();
  }
}
