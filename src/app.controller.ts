import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { MailReportService } from './mail_report.service';
import { StationsService } from './user/stations/stations.service';
import { UsersService } from './users/users.service';
import { LeaderboardService } from './leaderboard/leaderboard.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private leaderboardService: LeaderboardService,
    private stationService: StationsService,
    private usersService: UsersService,
    private reportService: MailReportService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/stations/:id/send_leaderboard_report')
  async leaderboardReport(@Request() req) {
    console.log(req.params.id);
    let station = await this.stationService.findOne(req.params.id);
    console.log(station);
    if (!station)
      return false;

    let user = await this.usersService.findOneById(station.userId);
    console.log(user);
    if (!user)
      return false;

    let currentLeaderboardRank = await this.leaderboardService.getCurrentRankForStation(station.id);
    console.log(currentLeaderboardRank);

    this.reportService.stationLeaderboardReport(user, station, currentLeaderboardRank);
    return true;
  }

  @Post('auth/confirm')
  async confirm(@Request() req) {
    return this.authService.confirm(req.body.token);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('auth/register')
  async register(@Request() req) {
   return this.authService.register(req.body);
  }
}
