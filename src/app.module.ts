import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { NatsModule } from './nats/nats.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    EventsModule,
    NatsModule,
    ScheduleModule,
    TypeOrmModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
