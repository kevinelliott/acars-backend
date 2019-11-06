import {
  Entity,
  Column,
  CreateDateColumn,
  JoinColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  RelationCount,
} from 'typeorm';

import { Airframe } from './airframe.entity';
import { Message } from './message.entity';

@Entity('flights')
export class Flight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  flight: string;

  @ManyToOne(type => Airframe, airframe => airframe.messages)
  @JoinColumn({ name: 'airframe_id' })
  airframe: Airframe;

  @OneToMany(type => Message, message => message.flight)
  messages: [];

  @RelationCount('messages')
  public messagesCount?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
