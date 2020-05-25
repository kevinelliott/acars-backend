import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';
import { Station } from 'src/entities/station.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Station], 'default'),
    TypeOrmModule.forFeature([Station], 'readonly'),
  ],
  controllers: [StationsController],
  providers: [StationsService],
  exports: [StationsService],
})
export class UserStationsModule {}
