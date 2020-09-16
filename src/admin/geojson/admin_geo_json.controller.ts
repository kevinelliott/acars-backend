import { Controller, Get, Param } from '@nestjs/common';

import { AdminGeoJsonService } from './admin_geo_json.service';

@Controller('admin/geojson')
export class AdminGeoJsonController {
  constructor(private readonly adminGeoJsonService: AdminGeoJsonService) {}

  @Get('frequencies')
  getFrequencies(): Promise<Object> {
    return this.adminGeoJsonService.getFrequencies();
  }

}
