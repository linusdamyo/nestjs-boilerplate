import { UnauthorizedException } from '@nestjs/common';
import { USER_STATUS } from '../../_enum/status.enum';

export const validateUserStatus = (userStatus: USER_STATUS) => {
  switch (userStatus) {
    case USER_STATUS.NORMAL:
      return;
    case USER_STATUS.DORMANT:
      throw new UnauthorizedException('휴면 상태입니다.');
    case USER_STATUS.WITHDRAW:
    case USER_STATUS.BLOCK:
      throw new UnauthorizedException('탈퇴한 회원입니다.');
    default:
      throw new UnauthorizedException('Unknown user status.');
  }
};
