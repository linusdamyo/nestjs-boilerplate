import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import crypto from 'crypto';
import { validateUserStatus } from '../../_common/auth/users.utils';
import { AuthUserType } from '../../_common/auth/auth-user.decorator';
import { AuthRepository } from '../repository/auth.repository';
import { EmailLoginResponseDto } from '../dto/email-login.dto';
import { KakaoLoginDto, KakaoLoginResponseDto } from '../dto/kakao-login.dto';
import { GoogleLoginDto, GoogleLoginResponseDto } from '../dto/google-login.dto';
import { SocialLoginResponseDto } from '../dto/social-login.dto';
import { SocialLoginPayloadType } from '../_types/social-payload.type';
import { KakaoService } from './kakao.service';
import { GoogleService } from './google.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly kakaoService: KakaoService,
    private readonly googleService: GoogleService,
  ) {}

  async validateEmail(emailInput: string, passwordInput: string): Promise<AuthUserType> {
    const userInfo = await this.authRepository.getUserByEmail(emailInput);
    if (!userInfo) throw new UnauthorizedException();

    validateUserStatus(userInfo.userStatus);

    const [salt, password] = userInfo.password?.split('.');
    const hash = crypto.pbkdf2Sync(passwordInput, salt, 1000, 64, 'sha512').toString('hex');

    if (!salt || !password || password !== hash) throw new UnauthorizedException();

    return userInfo;
  }

  async loginAfterValidate({ userId }: AuthUserType): Promise<EmailLoginResponseDto> {
    const accessToken = await this.createAccessToken({ userId });

    return { accessToken };
  }

  async authKakao({ code, redirectUri }: KakaoLoginDto): Promise<KakaoLoginResponseDto> {
    const payload = await this.kakaoService.getSocialPayload({ code, redirectUri });

    return this.authSocial(payload);
  }

  async authGoogle({ token }: GoogleLoginDto): Promise<GoogleLoginResponseDto> {
    const payload = await this.googleService.getSocialPayload({ token });

    return this.authSocial(payload);
  }

  private async authSocial(payload: SocialLoginPayloadType): Promise<SocialLoginResponseDto> {
    const userInfo = await this.authRepository.getUserBySocialKey(payload.socialType, payload.socialKey);

    if (userInfo) {
      validateUserStatus(userInfo.userStatus);

      const accessToken = await this.createAccessToken(userInfo);

      return { isNewUser: false, accessToken };
    } else {
      const userSocialId = await this.saveSocial(payload);

      return { isNewUser: true, userSocialId };
    }
  }

  private async createAccessToken({ userId }: any): Promise<string> {
    return this.jwtService.signAsync({ userId });
  }

  private async saveSocial({ socialType, socialKey, payload }: SocialLoginPayloadType): Promise<number> {
    const { userSocialId } = (await this.authRepository.getUserSocialBySocialKey(socialType, socialKey)) ?? {};

    const userSocialInfo = await this.authRepository.saveUserSocial(
      Object.assign(
        {
          socialType,
          socialKey,
          payload,
        },
        userSocialId ? { userSocialId } : null,
      ),
    );
    if (!userSocialInfo) throw new BadRequestException('DB Error [social].');

    return userSocialInfo.userSocialId;
  }
}
