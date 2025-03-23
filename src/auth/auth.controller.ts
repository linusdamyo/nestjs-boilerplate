import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';

import { JwtGuard } from '@_common/jwt/jwt.guard';
import { AuthUser } from '@_common/decorators/auth-user.decorator';
import { AuthUserType } from '@_common/types/auth.type';
import { AuthService } from '@auth/auth.service';
import { SignInRequestDto, SignInResponseDto } from '@auth/dto/sign-in.dto';

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('/signIn')
    async signIn(@Body() body: SignInRequestDto): Promise<SignInResponseDto> {
        return this.authService.signIn(body);
    }

    @UseGuards(JwtGuard)
    @Post('/test')
    authTest(@AuthUser() user: AuthUserType) {
        return user.userId;
    }
}
