import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, Interval, Timeout, NestSchedule } from 'nest-schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Timestamp } from 'typeorm';

import { EventsGateway } from '../events/events.gateway';
import { Flight } from '../entities/flight.entity';
import { Station } from '../entities/station.entity';

@Injectable() // Only support SINGLETON scope
export class ScheduleService extends NestSchedule {
  constructor(
    @Inject("EventsGateway") private readonly eventsGateway: EventsGateway,
    @InjectRepository(Flight) private readonly flightRepository: Repository<Station>,
    @InjectRepository(Station) private readonly stationRepository: Repository<Station>,
  ) {
    super()
  }

  private readonly logger = new Logger(ScheduleService.name);

  // @Cron('0 0 2 * *', {
  //   startTime: new Date(),
  //   endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  // })
  // async cronJob() {
  //   console.log('executing cron job');
  // }

  // @Timeout(5000)
  // onceJob() {
  //   console.log('executing once job');
  // }

  @Interval(3000)
  async intervalJob() {
    this.logger.log('Job running to gather and broadcast updated data.');
    this.eventsGateway.broadcast('events', 'interval-job');

    let stations = await this.stationRepository.find();
    this.logger.log('Preparing to broadcast ' + stations.length + ' stations.');
    this.eventsGateway.broadcast('stations', stations)

    // Update inactive flights
    await this.flightRepository
      .createQueryBuilder()
      .update(Flight)
      .set({ status: 'radio-silence' })
      .where("status = :status AND updated_at <= (timezone('utc', now()) - interval '10 minutes')", { status: 'in-flight' })
      .execute();

    let activeFlights = await this.flightRepository.find({
      relations: ['airframe'],
      where: { status: 'in-flight' }
    });
    this.logger.log('Preparing to broadcast ' + activeFlights.length + ' active flights.');
    this.eventsGateway.broadcast('activeFlights', activeFlights);

    // if you want to cancel the job, you should return true;
    // return true;
  }
}
