import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserEntity } from './../repository/entities/user.entity';

export class UsersMeResponseDto {
  @ApiProperty({ description: '닉네임' })
  nickname: string;

  @ApiPropertyOptional({ description: 'email (옵션)' })
  email?: string;

  constructor(userInfo: UserEntity) {
    this.nickname = userInfo.nickname;
    this.email = userInfo.email;
  }
}
