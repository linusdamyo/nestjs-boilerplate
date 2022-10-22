import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersRepository } from './repository/users.repository';
import { UsersService } from './services/users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersRepository, UsersService],
})
export class UsersModule {}
