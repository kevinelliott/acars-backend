import { Controller, Get, Param } from '@nestjs/common';

import { AirframesService } from './airframes.service';

@Controller('airframes')
export class AirframesController {
  constructor(private readonly airframesService: AirframesService) {}

  @Get()
  async findAll(@Param() params): Promise<Object> {
    console.log('Getting all airframes');
    return this.airframesService.getAllAirframes();
  }

  @Get(':id')
  async findOne(@Param() params): Promise<Object> {
    console.log(params.id);
    return this.airframesService.getAirframe(params.id);
  }
}
