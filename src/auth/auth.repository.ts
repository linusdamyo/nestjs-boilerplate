import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { UserEntity } from '@auth/entities/user.entity';

@Injectable()
export class AuthRepository {
    constructor(private readonly dataSource: DataSource) {}

    async findUserByEmail(email: string) {
        return this.dataSource.getRepository(UserEntity).findOneBy({ email });
    }
}
