import { UserEntity } from '@users/entities/user.entity';

export class GetMeResponseDto {
    readonly email: string;
    readonly nickname: string;

    constructor(user: UserEntity) {
        this.email = user.email;
        this.nickname = user.nickname;
    }
}
