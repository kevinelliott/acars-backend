import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventsGateway } from '../events/events.gateway';
import { NatsController } from './nats.controller';
import { Message } from '../entities/message.entity';

@Module({
  imports: [EventsGateway, TypeOrmModule.forFeature([Message])],
  controllers: [NatsController],
})
export class NatsModule {}
