import {
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';

import { Station } from './station.entity';

@Entity('stations')
export class StationMessageCount {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(type => Station, station => station.id)
  station: Station;

  @JoinColumn()
  stationId: number;

  @Column({ name: 'message_counts' })
  messagesCount: number;
}
