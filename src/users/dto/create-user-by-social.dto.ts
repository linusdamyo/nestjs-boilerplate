import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateUserBySocialDto {
  @ApiProperty({ description: 'social 로그인에서 받은 userSocialId' })
  @IsPositive()
  userSocialId: number;

  @ApiProperty({ description: '닉네임' })
  @IsNotEmpty()
  @IsString()
  nickname: string;
}
