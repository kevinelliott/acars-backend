import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventsModule } from '../events/events.module';
// import { EventsGateway } from '../events/events.gateway';
import { Flight } from '../entities/flight.entity';
import { ScheduleService } from './schedule.service';
import { Station } from '../entities/station.entity';

@Module({
  imports: [
    EventsModule,
    TypeOrmModule.forFeature([Flight]),
    TypeOrmModule.forFeature([Station])
  ],
  providers: [ScheduleService],
})
export class ScheduleModule {}
