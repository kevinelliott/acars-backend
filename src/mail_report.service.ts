import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { Station } from './entities/station.entity';
import { User } from './entities/user.entity';

@Injectable()
export class MailReportService {
  constructor(
    private mailerService: MailerService,
  ) {}

  async stationLeaderboardReport(user: User, station: Station, leaderboardRank: any) {
    console.log(leaderboardRank);
    this
      .mailerService
      .sendMail({
        to: `${user.name} <${user.email}>`,
        subject: `Leaderboard Report for Station ${station.ident}`,
        template: 'report_leaderboard',
        context: {
          baseUrl: 'http://app.airframes.io',
          stationIdent: station.ident,
          rank: leaderboardRank.ranking,
          points: leaderboardRank.points,
          airframesLast24Hours: leaderboardRank.airframeLast24HoursCount,
          airframesThisMonth: leaderboardRank.airframeThisMonthCount,
          flightsLast24Hours: leaderboardRank.flightLast24HoursCount,
          flightsThisMonth: leaderboardRank.flightThisMonthCount,
          messagesLast24Hours: leaderboardRank.message24HoursCount,
          messagesThisMonth: leaderboardRank.messageThisMonthCount,
        },
      })
      .then(() => {})
      .catch(() => {});
  }

}
