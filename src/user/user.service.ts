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
    return this.stationRepository.find({
      where: { ipAddress: ip }
    });
  }
}
