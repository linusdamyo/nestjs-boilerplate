import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../_common/auth/jwt-auth.guard';
import { AuthUser, AuthUserType } from '../../_common/auth/auth-user.decorator';
import { UsersService } from '../services/users.service';
import { CreateUserBySocialDto } from '../dto/create-user-by-social.dto';
import { UsersMeResponseDto } from '../dto/users-me.dto';

@ApiTags('User')
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '회원 가입 (소셜 로그인)' })
  @Post('/by-social')
  async createUserBySocial(@Body() body: CreateUserBySocialDto): Promise<void> {
    return this.usersService.createUserBySocial(body);
  }

  @ApiOperation({ summary: '내 정보' })
  @ApiResponse({ type: UsersMeResponseDto })
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMe(@AuthUser() authUser: AuthUserType): Promise<UsersMeResponseDto> {
    return this.usersService.getMe(authUser);
  }
}
