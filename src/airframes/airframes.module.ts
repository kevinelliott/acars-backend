import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AirframesController } from './airframes.controller';
import { AirframesService } from './airframes.service';

import { Airframe } from '../entities/airframe.entity';
import { Flight } from '../entities/flight.entity';
import { Message } from '../entities/message.entity';
import { Station } from '../entities/station.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Airframe]),
    TypeOrmModule.forFeature([Flight]),
    TypeOrmModule.forFeature([Message]),
    TypeOrmModule.forFeature([Station]),
  ],
  controllers: [AirframesController],
  providers: [AirframesService],
})
export class AirframesModule {}
