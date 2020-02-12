import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('report_hourly_counts')
export class ReportHourlyCount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'station_id' })
  stationId: number;

  @Column({ name: 'hour' })
  hour: Date;

  @Column({ name: 'messages_count' })
  messagesCount: number;
}
