import { BadRequestException, Injectable } from '@nestjs/common';

import { AuthUserType } from '@_common/types/auth.type';
import { USER_STATUS } from '@_common/enums/status.enum';
import { UsersRepository } from '@users/users.repository';
import { GetMeResponseDto } from '@users/dto/get-me.dto';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async getMe({ userId }: AuthUserType) {
        const user = await this.usersRepository.findUserById(userId);
        if (!user) {
            throw new BadRequestException('User not found.');
        }

        if (user.status !== USER_STATUS.NORMAL) {
            throw new BadRequestException('User is not normal.');
        }

        return new GetMeResponseDto(user);
    }
}
