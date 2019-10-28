import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, Interval, Timeout, NestSchedule } from 'nest-schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EventsGateway } from '../events/events.gateway';
import { Station } from '../entities/station.entity';

@Injectable() // Only support SINGLETON scope
export class ScheduleService extends NestSchedule {  
  constructor(
    @Inject("EventsGateway") private readonly eventsGateway: EventsGateway,
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

    // if you want to cancel the job, you should return true;
    // return true;
  }
}
