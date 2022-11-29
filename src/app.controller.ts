import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    throwError() {
        return this.appService.throwError();
    }

    @Post()
    throwBadRequest() {
        return this.appService.throwBadRequest();
    }

    @Post('/hello')
    hello(@Body() { hello }: { hello: string }) {
        return { hello };
    }
}
