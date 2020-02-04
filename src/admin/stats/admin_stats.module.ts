import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminStatsController } from './admin_stats.controller';
import { AdminStatsService } from './admin_stats.service';

import { Airframe } from '../../entities/airframe.entity';
import { Flight } from '../../entities/flight.entity';
import { Message } from '../../entities/message.entity';
import { Station } from '../../entities/station.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Airframe], 'readonly'),
    TypeOrmModule.forFeature([Flight], 'readonly'),
    TypeOrmModule.forFeature([Message], 'readonly'),
    TypeOrmModule.forFeature([Station], 'readonly'),
  ],
  controllers: [AdminStatsController],
  providers: [AdminStatsService],
})
export class AdminStatsModule {}
