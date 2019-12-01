import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Airframe } from '../../entities/airframe.entity';
import { Flight } from '../../entities/flight.entity';
import { Message } from '../../entities/message.entity';
import { Station } from '../../entities/station.entity';

@Injectable()
export class AdminStatsService {
  constructor(
    @InjectRepository(Airframe) private readonly airframeRepository: Repository<Station>,
    @InjectRepository(Flight) private readonly flightRepository: Repository<Station>,
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    @InjectRepository(Station) private readonly stationRepository: Repository<Station>,
  ) { }

  async getAirframeCount(): Promise<Object> {
    return await this.airframeRepository
      .createQueryBuilder('airframes')
      .leftJoin('airframes.flights', 'flights')
      .leftJoin('airframes.messages', 'messages')
      // .leftJoin('airframes.stations', 'stations')
      .select('airframes.tail', 'tail')
      .addSelect('COUNT(DISTINCT(flights.id)) as flight_count')
      .addSelect('COUNT(DISTINCT(messages.id)) as message_count')
      // .addSelect('COUNT(DISTINCT(stations.id)) as station_count')
      .groupBy('airframes.tail')
      .getRawMany();
  }

  async getMessageErrorStats(): Promise<Object> {
    return await this.messageRepository.createQueryBuilder('messages')
      .groupBy('error')
      .select('error, count(error)')
      .getRawMany();
  }

  async getMessageLabelStats(): Promise<Object> {
    return await this.messageRepository.createQueryBuilder('messages')
      .groupBy('label')
      .select('label, count(label)')
      .getRawMany();
  }

  async getFlightCount(): Promise<Object> {
    return await this.flightRepository.createQueryBuilder('flights')
      .groupBy('flight')
      .select('flight, COUNT(flight)')
      .getRawMany();
  }

  async getStats(): Promise<Object> {
    let airframeCount = await this.getAirframeCount();
    let errorStats = await this.getMessageErrorStats();
    let labelStats = await this.getMessageLabelStats();
    let flightCount = await this.getFlightCount();

    return {
      airlines: [],
      airframes: airframeCount,
      errors: errorStats,
      flights: flightCount,
      frequencies: [],
      labels: labelStats,
      stations: [],
    };
  }

  async getErrors(): Promise<Object> {
    let errorStats = await this.getMessageErrorStats();

    return {
      errors: errorStats
    };
  }
}
