import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('report_daily_counts')
export class ReportDailyCount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'station_id' })
  stationId: number;

  @Column({ name: 'date' })
  date: Date;

  @Column({ name: 'messages_count' })
  messagesCount: number;
}
