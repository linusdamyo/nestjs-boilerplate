import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): { message: string } {
        return this.appService.getHello();
    }

    @Post()
    post() {
        throw new Error('Wrong request /');
    }
}
