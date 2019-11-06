import { ClientsModule, Transport } from '@nestjs/microservices';
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
    TypeOrmModule.forFeature([Airframe]),
    TypeOrmModule.forFeature([Flight]),
    TypeOrmModule.forFeature([Message]),
    TypeOrmModule.forFeature([Station]),
  ],
  controllers: [AdminStatsController],
  providers: [AdminStatsService],
})
export class AdminStatsModule {}
