import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  RelationCount,
} from 'typeorm';

import { Message } from './message.entity';

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

  @RelationCount('messages')
  public messagesCount?: number;

  @Column({ name: 'last_report_at' })
  lastReportAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
