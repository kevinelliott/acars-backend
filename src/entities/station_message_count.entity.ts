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
  @JoinColumn({ name: 'station_id' })
  station: Station;

  @Column({ name: 'station_id' })
  stationId: number;

  @Column({ name: 'messages_count' })
  messagesCount: number;
}
