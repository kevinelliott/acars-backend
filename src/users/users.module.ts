import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User], 'readonly'),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
