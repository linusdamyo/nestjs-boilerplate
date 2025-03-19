import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { USER_STATUS } from '@_common/enums/status.enum';
import { SignInRequestDto, SignInResponseDto } from '@auth/dto/sign-in.dto';
import { AuthRepository } from '@auth/auth.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly jwtService: JwtService,
    ) {}

    async signIn({ username, password }: SignInRequestDto) {
        const user = await this.authRepository.findUserByEmail(username);
        if (!user) {
            throw new BadRequestException('User not found.');
        }

        if (user.status !== USER_STATUS.NORMAL) {
            throw new BadRequestException('User is not normal.');
        }

        // TODO: password hash
        if (password !== user.password) {
            throw new BadRequestException('Invalid password.');
        }

        const accessToken = await this.jwtService.signAsync({ sub: user.id });

        return new SignInResponseDto(accessToken);
    }
}
