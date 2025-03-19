import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';

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
}
