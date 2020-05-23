import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Flight } from '../entities/flight.entity';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight, 'readonly') private readonly flightRepository: Repository<Flight>,
    @OgmaLogger(FlightsService) private readonly logger: OgmaService,
  ) { }

  async getAllFlights(): Promise<Object> {
    this.logger.info('Getting all flights');
    return await this.flightRepository
      .find({
        relations: ["airframe"]
      });
  }

  async getFlight(id): Promise<Object> {
    this.logger.info(`Getting flight ${id}`);
    return await this.flightRepository
      .findOne(id, {
        relations: ["airframe", "messages"]
      });
  }

  async getActiveFlights(): Promise<Object> {
    this.logger.info(`Getting active flights`);
    return await this.flightRepository
      .find({
        relations: ['airframe'],
        where: {
          status: 'in-flight'
        }
      });
  }
}
