import {
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';

import { Station } from './station.entity';

@Entity('station_message_counts')
export class StationMessageCount {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(type => Station, station => station.stationMessageCount)
  station: Station;

  @Column({ name: 'station_id' })
  stationId: number;

  @Column({ name: 'message_counts' })
  messagesCount: number;
}
