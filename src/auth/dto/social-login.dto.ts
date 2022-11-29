import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SocialLoginResponseDto {
    @ApiProperty({ description: '신규 회원인 경우 true' })
    isNewUser: boolean;

    @ApiPropertyOptional({ description: '신규 회원인 경우, userSocialId' })
    userSocialId?: number;

    @ApiPropertyOptional({ description: '기존 회원인 경우: JWT access token' })
    accessToken?: string;
}
