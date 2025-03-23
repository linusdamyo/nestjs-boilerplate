import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtGuard } from '@_common/jwt/jwt.guard';
import { AuthUser } from '@_common/decorators/auth-user.decorator';
import { AuthUserType } from '@_common/types/auth.type';
import { UsersService } from '@users/users.service';
import { GetMeResponseDto } from '@users/dto/get-me.dto';

@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtGuard)
    @Get('/me')
    async getMe(@AuthUser() user: AuthUserType): Promise<GetMeResponseDto> {
        return this.usersService.getMe(user);
    }
}
