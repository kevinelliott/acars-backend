import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Leaderboard } from '../entities/leaderboard.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Leaderboard, 'readonly') private readonly leaderboardRepository: Repository<Leaderboard>,
  ) { }

  async getCurrentLeaderboard(): Promise<Object> {
    return await this.leaderboardRepository
      .findOne({
        relations: ["ranks", 'ranks.station'],
        order: { date: 'DESC' }
      });
  }

  async getLeaderboardForDate(date): Promise<Object> {
    const previous = await this.leaderboardRepository
      .findOne({
        relations: ['ranks', 'ranks.station'],
        where: `date = DATE '${date.toDateString()}' - interval '1 month'`,
        order: { updatedAt: 'DESC' }
      });

    const current = await this.leaderboardRepository
      .findOne({
        relations: ['ranks', 'ranks.station'],
        where: {
          date: date
        },
        order: { updatedAt: 'DESC' }
      });

    const next = await this.leaderboardRepository
      .findOne({
        relations: ['ranks', 'ranks.station'],
        where: `date = DATE '${date.toDateString()}' + interval '1 month'`,
        order: { updatedAt: 'ASC' }
      });

    let output = {
      previous: previous,
      current: current,
      next: next
    }
    return output;
  }
}
