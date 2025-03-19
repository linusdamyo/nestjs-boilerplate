import { Controller, Get, Post } from '@nestjs/common';

import { RootService } from './root.service';

@Controller()
export class RootController {
    constructor(private readonly rootService: RootService) {}

    @Get()
    getHello(): { message: string } {
        return this.rootService.getHello();
    }

    @Post()
    post() {
        throw new Error('Wrong request /');
    }
}
