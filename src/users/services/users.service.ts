import { ForbiddenException, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthUserType } from '../../_common/auth/auth-user.decorator';
import { validateUserStatus } from '../../_common/auth/users.utils';
import { UsersRepository } from '../repository/users.repository';
import { CreateUserBySocialDto } from '../dto/create-user-by-social.dto';
import { UsersMeResponseDto } from '../dto/users-me.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUserBySocial({ userSocialId, nickname }: CreateUserBySocialDto): Promise<void> {
    const userSocialInfo = await this.usersRepository.getUserSocial(userSocialId);

    if (userSocialInfo.userId) throw new ForbiddenException('이미 가입된 회원입니다. 로그인을 해주세요~');

    if (await this.usersRepository.existNickname(nickname)) throw new BadRequestException('동일한 닉네임이 존재합니다.');

    await this.usersRepository.createUser(userSocialId, nickname);
  }

  async getMe({ userId }: AuthUserType): Promise<UsersMeResponseDto> {
    const userInfo = await this.usersRepository.getUser(userId);
    if (!userInfo) throw new UnauthorizedException('회원 정보가 존재하지 않습니다.');

    validateUserStatus(userInfo.userStatus);

    return new UsersMeResponseDto(userInfo);
  }
}
