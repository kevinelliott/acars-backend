import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import { Station } from './station.entity';
import { Leaderboard } from './leaderboard.entity';

@Entity('leaderboard_ranks')
export class LeaderboardRank {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Leaderboard, leaderboard => leaderboard.ranks)
  @JoinColumn({ name: 'leaderboard_id' })
  leaderboard: Leaderboard;

  @Column({ name: 'ranking'})
  ranking: Number;

  @ManyToOne(type => Station, station => station.leaderboard_ranks)
  @JoinColumn({ name: 'station_id' })
  station: Station;

  @Column({ name: 'airframe_all_time_count'})
  airframeAllTimeCount: Number;

  @Column({ name: 'airframe_this_month_count'})
  airframeThisMonthCount: Number;

  @Column({ name: 'airframe_last_24_hours_count'})
  airframeLast24HoursCount: Number;

  @Column({ name: 'flight_all_time_count'})
  flightAllTimeCount: Number;

  @Column({ name: 'flight_this_month_count'})
  flightThisMonthCount: Number;

  @Column({ name: 'flight_last_24_hours_count'})
  flightLast24HoursCount: Number;

  @Column({ name: 'message_all_time_count'})
  messageAllTimeCount: Number;

  @Column({ name: 'message_this_month_count'})
  messageThisMonthCount: Number;

  @Column({ name: 'message_last_24_hours_count'})
  messageLast24HoursCount: Number;

  @Column({ name: 'points'})
  points: Number;

  // @Column({ name: 'points_detail'})
  // pointsDetail: Object;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
