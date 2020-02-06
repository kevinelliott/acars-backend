import {
  AfterLoad,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  RelationCount,
  createQueryBuilder,
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

  public messagesCount?: number;

  @ManyToMany(type => Airframe, airframe => airframe.stations)
  airframes: Airframe[];

  @Column({ name: 'last_report_at' })
  lastReportAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @AfterLoad()
  setMessagesCount() {
    createQueryBuilder(Message)
      .where({ stationId: this.id })
      .getCount()
    .then(result => {
        this.messagesCount = result;
    });
  }
}
