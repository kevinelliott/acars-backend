import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';

import { Flight } from '../entities/flight.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Flight], 'readonly'),
  ],
  controllers: [FlightsController],
  providers: [FlightsService],
})
export class FlightsModule {}
