import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventsModule } from '../events/events.module';
import { NatsController } from './nats.controller';
import { Message } from '../entities/message.entity';
import { MessageDecoding } from '../entities/message_decoding.entity';

@Module({
  imports: [
    EventsModule,
    TypeOrmModule.forFeature([Message]),
    TypeOrmModule.forFeature([MessageDecoding])
  ],
  controllers: [NatsController],
})
export class NatsModule {}
