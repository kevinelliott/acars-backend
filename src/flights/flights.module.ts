import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';

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
  controllers: [FlightsController],
  providers: [FlightsService],
})
export class FlightsModule {}
