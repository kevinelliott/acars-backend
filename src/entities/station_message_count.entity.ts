import {
  Entity,
  Column,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { Station } from './station.entity';

@Entity('stations')
export class StationMessageCount {
  @PrimaryColumn()
  @OneToOne(type => Station, station => station.id)
  stationId: number;

  @Column({ name: 'message_counts' })
  messageCounts: number;
}
