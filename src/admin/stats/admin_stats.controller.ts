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

}
