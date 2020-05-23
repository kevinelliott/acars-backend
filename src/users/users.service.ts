import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User, 'default') private readonly userRepository: Repository<User>,
    @InjectRepository(User, 'readonly') private readonly userReadonlyRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return await this.userReadonlyRepository
      .findOne({
        relations: ['stations'],
        where: {
          username: username
        }
      });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.userReadonlyRepository
      .findOne({
        relations: ['stations'],
        where: {
          email: email
        }
      });
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return await this.userReadonlyRepository
      .findOne({
        relations: ['stations'],
        where: {
          username: username
        }
      });
  }

  async create(user: User): Promise<User | undefined> {
    return await this.userRepository
      .save(user);
  }
}
