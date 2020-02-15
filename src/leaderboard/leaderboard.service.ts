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
}
