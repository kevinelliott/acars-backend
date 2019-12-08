import { Controller, Get, Param } from '@nestjs/common';

import { FlightsService } from './flights.service';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get('active')
  async findActive(@Param() params): Promise<Object> {
    console.log(params);
    console.log('Getting active flights');
    return this.flightsService.getActiveFlights();
  }

  @Get(':id')
  async findOne(@Param() params): Promise<Object> {
    console.log(params.id);
    return this.flightsService.getFlight(params.id);
  }
}
