import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Airframe } from '../entities/airframe.entity';
import { Flight } from '../entities/flight.entity';
import { Message } from '../entities/message.entity';
import { Station } from '../entities/station.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Airframe) private readonly airframeRepository: Repository<Station>,
    @InjectRepository(Flight) private readonly flightRepository: Repository<Station>,
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    @InjectRepository(Station) private readonly stationRepository: Repository<Station>,
  ) { }

  async getMessage(id): Promise<Object> {
    return await this.messageRepository
      .findOne(id, {
        relations: ['airframe', 'flight', 'station']
      });
  }
}
