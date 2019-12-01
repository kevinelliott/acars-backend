import { Controller, Get } from '@nestjs/common';

import { AdminStatsService } from './admin_stats.service';

@Controller('admin/stats')
export class AdminStatsController {
  constructor(private readonly adminStatsService: AdminStatsService) {}

  @Get()
  getStats(): Promise<Object> {
    return this.adminStatsService.getStats();
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

}
