import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  RelationCount,
} from 'typeorm';

import { Airframe } from './airframe.entity';
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

  @ManyToMany(type => Airframe, airframe => airframe.stations)
  airframes: Airframe[];

  @Column({ name: 'last_report_at' })
  lastReportAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
