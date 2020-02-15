import {
  AfterLoad,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  RelationCount,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { LeaderboardRank } from './leaderboard_rank.entity';

@Entity('leaderboards')
export class Leaderboard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'date' })
  date: Date;

  @OneToMany(type => LeaderboardRank, rank => rank.leaderboard)
  ranks: LeaderboardRank[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
