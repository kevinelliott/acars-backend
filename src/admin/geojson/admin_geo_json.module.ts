import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminGeoJsonController } from './admin_geo_json.controller';
import { AdminGeoJsonService } from './admin_geo_json.service';

import { Message } from '../../entities/message.entity';
import { Station } from '../../entities/station.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message], 'default'),
    TypeOrmModule.forFeature([Station], 'default'),
  ],
  controllers: [AdminGeoJsonController],
  providers: [AdminGeoJsonService],
})
export class AdminGeoJsonModule {}
