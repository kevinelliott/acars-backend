import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('report_monthly_counts')
export class ReportMonthlyCount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'station_id' })
  stationId: number;

  @Column({ name: 'date' })
  date: Date;

  @Column({ name: 'messages_count' })
  messagesCount: number;
}
