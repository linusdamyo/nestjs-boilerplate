import { lastValueFrom, map } from 'rxjs';
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { SOCIAL_TYPE } from '../../_enum/type.enum';
import { GetSocialLoginPayloadInterface, SocialLoginPayloadType } from '../_types/social-payload.type';
import { GetKaKaoTokenResponse, GetKakaoUserMeResponse, KakaoLoginDto } from '../dto/kakao-login.dto';

@Injectable()
export class KakaoService implements GetSocialLoginPayloadInterface {
    constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}

    async getSocialPayload({ code, redirectUri }: KakaoLoginDto): Promise<SocialLoginPayloadType> {
        const { access_token: kakaoToken } = await this.getKakaoToken(code, redirectUri);
        if (!kakaoToken) throw new UnauthorizedException('카카오 로그인 실패');

        const profile = await this.getKakaoUserMe(kakaoToken);
        if (!profile?.id) throw new BadRequestException('카카오 로그인 실패 - 유저 정보가 없습니다.');

        return {
            socialType: SOCIAL_TYPE.KAKAO,
            socialKey: profile.id,
            payload: JSON.stringify(profile),
        };
    }

    private async getKakaoToken(code: string, redirectUrl: string): Promise<GetKaKaoTokenResponse> {
        return lastValueFrom(
            this.httpService
                .post(
                    `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${this.configService.get(
                        'KAKAO_CLIENT_ID',
                    )}&code=${code}&redirect_uri=${redirectUrl}`,
                )
                .pipe(map(response => response.data)),
        );
    }

    private async getKakaoUserMe(token: string): Promise<GetKakaoUserMeResponse> {
        return lastValueFrom(
            this.httpService
                .get('https://kapi.kakao.com/v2/user/me', { headers: { Authorization: `Bearer ${token}` } })
                .pipe(map(response => response.data)),
        );
    }
}
