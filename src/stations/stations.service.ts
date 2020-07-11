import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Station } from '../entities/station.entity';

@Injectable()
export class StationsService {
  constructor(
    @InjectRepository(Station, 'default') private readonly stationRepository: Repository<Station>,
    @InjectRepository(Station, 'readonly') private readonly stationRepositoryReadOnly: Repository<Station>,
  ) {}

  async findOne(id: string): Promise<Station | undefined> {
    return await this.stationRepositoryReadOnly
      .findOne({
        relations: ['user'],
        where: {
          id: id
        }
      });
  }
}
