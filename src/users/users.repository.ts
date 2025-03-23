import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { UserEntity } from '@users/entities/user.entity';

@Injectable()
export class UsersRepository {
    constructor(private readonly dataSource: DataSource) {}

    async findUserById(userId: string) {
        return this.dataSource.getRepository(UserEntity).findOneBy({ id: userId });
    }
}
