import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../../_common/auth/local-auth.guard';
import { AuthService } from '../services/auth.service';
import { EmailLoginDto, EmailLoginResponseDto } from '../dto/email-login.dto';
import { KakaoLoginDto, KakaoLoginResponseDto } from '../dto/kakao-login.dto';
import { GoogleLoginDto, GoogleLoginResponseDto } from '../dto/google-login.dto';

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiTags('Auth')
    @ApiOperation({ summary: '이메일 로그인' })
    @ApiBody({ type: EmailLoginDto })
    @ApiResponse({ type: EmailLoginResponseDto })
    @UseGuards(LocalAuthGuard)
    @Post('/email')
    async authEmail(@Request() req): Promise<EmailLoginResponseDto> {
        return this.authService.loginAfterValidate(req.user);
    }

    @ApiTags('Auth')
    @ApiOperation({ summary: '카카오 로그인' })
    @ApiResponse({ type: KakaoLoginResponseDto })
    @Post('/kakao')
    async authKakao(@Body() body: KakaoLoginDto): Promise<KakaoLoginResponseDto> {
        return this.authService.authKakao(body);
    }

    @ApiTags('Auth')
    @ApiOperation({ summary: '구글 로그인' })
    @ApiResponse({ type: GoogleLoginResponseDto })
    @Post('/google')
    async authGoogle(@Body() body: GoogleLoginDto): Promise<GoogleLoginResponseDto> {
        return this.authService.authGoogle(body);
    }
}
