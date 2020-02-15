import { Controller, Get, Param } from '@nestjs/common';

import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('current')
  async current(@Param() params): Promise<Object> {
    console.log('API: Getting current leaderboard');
    return this.leaderboardService.getCurrentLeaderboard();
  }
}
