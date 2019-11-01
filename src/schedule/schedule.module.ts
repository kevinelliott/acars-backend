import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventsModule } from '../events/events.module';
import { EventsGateway } from '../events/events.gateway';
import { ScheduleService } from './schedule.service';
import { Station } from '../entities/station.entity';

@Module({
  imports: [
    EventsModule,
    TypeOrmModule.forFeature([Station])
  ],
  providers: [ScheduleService],
})
export class ScheduleModule {}
