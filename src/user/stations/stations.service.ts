import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Station } from '../../entities/station.entity';

@Injectable()
export class StationsService {
  constructor(
    @InjectRepository(Station, 'default') private readonly stationRepository: Repository<Station>,
    @InjectRepository(Station, 'readonly') private readonly stationReadonlyRepository: Repository<Station>,
  ) {}

  async findOne(id: Number): Promise<Station | undefined> {
    return await this.stationReadonlyRepository
      .findOne({
        where: {
          id: id
        }
      });
  }

  async save(station: Station): Promise<Station | undefined> {
    return await this.stationRepository
      .save(station);
  }
}
