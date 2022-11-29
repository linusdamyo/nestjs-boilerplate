import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { SOCIAL_TYPE } from '../../_enum/type.enum';
import { GetSocialLoginPayloadInterface, SocialLoginPayloadType } from '../_types/social-payload.type';
import { GoogleLoginDto } from '../dto/google-login.dto';

@Injectable()
export class GoogleService implements GetSocialLoginPayloadInterface {
    #GOOGLE_CLIENT_ID: string;
    #client: OAuth2Client;

    constructor(private readonly configService: ConfigService) {
        this.#GOOGLE_CLIENT_ID = this.configService.get('GOOGLE_CLIENT_ID');
        this.#client = new OAuth2Client(this.#GOOGLE_CLIENT_ID);
    }

    async getSocialPayload({ token }: GoogleLoginDto): Promise<SocialLoginPayloadType> {
        const ticket = await this.#client.verifyIdToken({ idToken: token, audience: this.#GOOGLE_CLIENT_ID });

        const payload = ticket.getPayload();
        if (!payload?.sub) throw new UnauthorizedException('구글 로그인 실패 - 유저 정보가 없습니다.');

        return {
            socialType: SOCIAL_TYPE.GOOGLE,
            socialKey: payload.sub,
            payload: JSON.stringify(payload),
        };
    }
}
