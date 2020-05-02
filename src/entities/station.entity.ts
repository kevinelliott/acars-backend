import {
  AfterLoad,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  ManyToMany,
  RelationCount,
  createQueryBuilder,
  ManyToOne,
} from 'typeorm';

import { Airframe } from './airframe.entity';
import { LeaderboardRank } from './leaderboard_rank.entity';
import { Message } from './message.entity';
import { StationMessageCount } from './station_message_count.entity';
import { User } from './user.entity';

@Entity('stations')
export class Station {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  ident: string;

  @Column({ name: 'ip_address' })
  ipAddress: string;

  @OneToMany(type => LeaderboardRank, rank => rank.station)
  leaderboard_ranks: [];

  @OneToMany(type => Message, message => message.station)
  messages: [];

  @OneToOne(type => StationMessageCount, stationMessageCount => stationMessageCount.station)
  stationMessageCount: StationMessageCount;

  public messagesCount?: number;

  @ManyToMany(type => Airframe, airframe => airframe.stations)
  airframes: Airframe[];

  @Column({ name: 'source_application' })
  sourceApplication: string;

  @Column({ name: 'source_type' })
  sourceType: string;

  @Column({ name: 'source_protocol' })
  sourceProtocol: string;

  @ManyToOne(type => User, user => user.stations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'last_report_at' })
  lastReportAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @AfterLoad()
  setMessagesCount() {
    // createQueryBuilder(Message)
    //   .where('station_id = :id', { id: this.id })
    //   .getCount()
    // .then(result => {
    //     this.messagesCount = result;
    // });
    if (this.stationMessageCount != null) {
      this.messagesCount = this.stationMessageCount.messagesCount;
    }
  }
}
