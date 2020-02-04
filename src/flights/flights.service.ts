import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Flight } from '../entities/flight.entity';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight, 'readonly') private readonly flightRepository: Repository<Flight>,
  ) { }

  async getAllFlights(): Promise<Object> {
    return await this.flightRepository
      .find({
        relations: ["airframe"]
      });
  }

  async getFlight(id): Promise<Object> {
    return await this.flightRepository
      .findOne(id, {
        relations: ["airframe", "messages"]
      });
  }

  async getActiveFlights(): Promise<Object> {
    return await this.flightRepository
      .find({
        relations: ['airframe'],
        where: {
          status: 'in-flight'
        }
      });
  }
}
