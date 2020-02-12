import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminStatsController } from './admin_stats.controller';
import { AdminStatsService } from './admin_stats.service';

import { Airframe } from '../../entities/airframe.entity';
import { Flight } from '../../entities/flight.entity';
import { Message } from '../../entities/message.entity';
import { ReportMonthlyCount } from '../../entities/report_monthly_count.entity';
import { ReportDailyCount } from '../../entities/report_daily_count.entity';
import { ReportHourlyCount } from '../../entities/report_hourly_count.entity';
import { Station } from '../../entities/station.entity';
import { StationMessageCount } from '../../entities/station_message_count.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Airframe], 'readonly'),
    TypeOrmModule.forFeature([Flight], 'readonly'),
    TypeOrmModule.forFeature([Message], 'readonly'),
    TypeOrmModule.forFeature([Station], 'readonly'),
    TypeOrmModule.forFeature([StationMessageCount], 'readonly'),
    TypeOrmModule.forFeature([ReportMonthlyCount], 'readonly'),
    TypeOrmModule.forFeature([ReportDailyCount], 'readonly'),
    TypeOrmModule.forFeature([ReportHourlyCount], 'readonly'),
  ],
  controllers: [AdminStatsController],
  providers: [AdminStatsService],
})
export class AdminStatsModule {}
