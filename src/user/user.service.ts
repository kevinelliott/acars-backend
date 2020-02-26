import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Station } from '../entities/station.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Station, 'readonly') private readonly stationRepository: Repository<Station>,
  ) { }

  async myIp(ip: string): Promise<Object> {
    const data = {
      ipAddress: ip,
      stations: []
    };

    data.stations = await this.stationRepository.find({
      where: { ipAddress: ip }
    });

    return data;
  }
}
