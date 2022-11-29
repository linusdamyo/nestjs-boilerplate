import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { SocialLoginResponseDto } from './social-login.dto';

export class KakaoLoginDto {
    @ApiProperty({ description: '카카오 로그인 code' })
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty({ description: '카카오 로그인 redirect URI' })
    @IsNotEmpty()
    @IsString()
    redirectUri: string;
}

export class GetKaKaoTokenResponse {
    access_token: string;
}

export class GetKakaoUserMeResponse {
    id: string;
}

export class KakaoLoginResponseDto extends SocialLoginResponseDto {}
