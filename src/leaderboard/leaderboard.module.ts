import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';

import { Leaderboard } from '../entities/leaderboard.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Leaderboard], 'readonly'),
  ],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
