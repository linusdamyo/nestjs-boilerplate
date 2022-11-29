import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { SocialLoginResponseDto } from './social-login.dto';

export class GoogleLoginDto {
    @ApiProperty({ description: '구글 로그인 token (credential)' })
    @IsNotEmpty()
    @IsString()
    token: string;
}

export class GoogleLoginResponseDto extends SocialLoginResponseDto {}
