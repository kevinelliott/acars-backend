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

  @Get(':date')
  async specific(@Param() params): Promise<Object> {
    console.log(`API: Getting a specific leaderboard: ${params.date}`);

    const year = Number(params.date.substring(0, 4));
    const month = Number(params.date.substring(4, 6)) - 1;
    const date = new Date(year, month, 1);

    return this.leaderboardService.getLeaderboardForDate(date);
  }

}
