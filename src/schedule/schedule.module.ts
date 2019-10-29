import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventsGateway } from '../events/events.gateway';
import { ScheduleService } from './schedule.service';
import { Station } from '../entities/station.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Station])
  ],
  providers: [EventsGateway, ScheduleService],
})
export class ScheduleModule {}
