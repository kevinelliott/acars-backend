import { Controller, Get, Req, Request, UseGuards, Post } from '@nestjs/common';

import { StationsService } from './stations.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class StationsController {
  constructor(private readonly stationService: StationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('stations/:id')
  async saveStation(@Req() req): Promise<Object> {
    console.log(req.body);
    return this.stationService.save(req.body.station);
  }
}
