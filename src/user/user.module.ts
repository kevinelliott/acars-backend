import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';

import { Station } from '../entities/station.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Station], 'readonly'),
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
