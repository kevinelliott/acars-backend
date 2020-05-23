import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User], 'default'),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
