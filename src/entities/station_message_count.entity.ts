import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { Station } from './station.entity';

@Entity('stations')
export class StationMessageCount {
  @PrimaryColumn()
  @OneToOne(type => Station, station => station.id)
  @JoinColumn()
  stationId: number;

  @Column({ name: 'message_counts' })
  messagesCount: number;
}
