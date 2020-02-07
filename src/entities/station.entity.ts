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
} from 'typeorm';

import { Airframe } from './airframe.entity';
import { Message } from './message.entity';
import { StationMessageCount } from './station_message_count.entity';

@Entity('stations')
export class Station {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ident: string;

  @Column({ name: 'ip_address' })
  ipAddress: string;

  @OneToMany(type => Message, message => message.station)
  messages: [];

  @OneToOne(type => StationMessageCount, stationMessageCount => stationMessageCount.station)
  @JoinColumn({ referencedColumnName: 'station_id' })
  stationMessageCount: StationMessageCount;

  public messagesCount?: number;

  @ManyToMany(type => Airframe, airframe => airframe.stations)
  airframes: Airframe[];

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
