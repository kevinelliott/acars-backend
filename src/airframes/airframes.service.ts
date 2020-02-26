import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Airframe } from '../entities/airframe.entity';
import { Flight } from '../entities/flight.entity';
import { Message } from '../entities/message.entity';
import { Station } from '../entities/station.entity';

@Injectable()
export class AirframesService {
  constructor(
    @InjectRepository(Airframe) private readonly airframeRepository: Repository<Airframe>,
    @InjectRepository(Flight) private readonly flightRepository: Repository<Station>,
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    @InjectRepository(Station) private readonly stationRepository: Repository<Station>,
  ) { }

  async getAllAirframes(): Promise<Object> {
    return await this.airframeRepository
      .find({
        order: { tail: 'ASC' },
      });
  }

  async getAirframe(id): Promise<Object> {
    return await this.airframeRepository
      .findOne(id, {
        relations: ["flights", "messages"]
      });
  }
}
