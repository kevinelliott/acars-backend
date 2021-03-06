import { Controller, Get, Param } from '@nestjs/common';

import { AdminStatsService } from './admin_stats.service';

@Controller('admin/stats')
export class AdminStatsController {
  constructor(private readonly adminStatsService: AdminStatsService) {}

  @Get()
  getStats(): Promise<Object> {
    return this.adminStatsService.getStats();
  }

  @Get('airlines')
  getAirlines(): Promise<Object> {
    return this.adminStatsService.getAirlines();
  }

  @Get('airframes')
  getAirframes(): Promise<Object> {
    return this.adminStatsService.getAirframes();
  }

  @Get('errors')
  getErrors(): Promise<Object> {
    return this.adminStatsService.getErrors();
  }

  @Get('flights')
  getFlights(): Promise<Object> {
    return this.adminStatsService.getFlights();
  }

  @Get('frequencies')
  getFrequencies(): Promise<Object> {
    return this.adminStatsService.getFrequencies();
  }

  @Get('labels')
  getLabels(): Promise<Object> {
    return this.adminStatsService.getLabels();
  }

  @Get('stations')
  getStations(): Promise<Object> {
    return this.adminStatsService.getStations();
  }

  @Get('stations/:id')
  getStation(@Param() params): Promise<Object> {
    return this.adminStatsService.getStationCounts(params.id);
  }

}
