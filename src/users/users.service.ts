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
        relations: ['stations', 'stations.stationMessageCount'],
        where: {
          username: username
        }
      });
  }

  async findOneById(id: String): Promise<User | undefined> {
    return await this.userReadonlyRepository
      .findOne({
        relations: ['stations', 'stations.stationMessageCount'],
        where: {
          id: id
        }
      });
  }

  async findOneByConfirmationToken(token: string): Promise<User | undefined> {
    return await this.userReadonlyRepository
      .findOne({
        where: {
          confirmationToken: token
        }
      });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.userReadonlyRepository
      .findOne({
        relations: ['stations', 'stations.stationMessageCount'],
        where: {
          email: email
        }
      });
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return await this.userReadonlyRepository
      .findOne({
        relations: ['stations', 'stations.stationMessageCount'],
        where: {
          username: username
        }
      });
  }

  async create(user: User): Promise<User | undefined> {
    return await this.userRepository
      .save(user);
  }

  async save(user: User): Promise<User | undefined> {
    return await this.userRepository.save(user);
  }
}
