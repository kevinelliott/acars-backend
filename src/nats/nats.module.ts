import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventsModule } from '../events/events.module';
import { NatsController } from './nats.controller';
import { Message } from '../entities/message.entity';

@Module({
  imports: [
    EventsModule,
    TypeOrmModule.forFeature([Message])
  ],
  controllers: [NatsController],
})
export class NatsModule {}
