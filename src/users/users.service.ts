import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return await this.userRepository
      .findOne({
        relations: ['stations'],
        where: {
          username: username
        }
      });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository
      .findOne({
        relations: ['stations'],
        where: {
          email: email
        }
      });
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return await this.userRepository
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
