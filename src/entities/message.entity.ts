import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import { Airframe } from './airframe.entity';
import { Flight } from './flight.entity';
import { Station } from './station.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Station, station => station.messages)
  @JoinColumn({ name: 'station_id' })
  station: Station;

  @ManyToOne(type => Airframe, airframe => airframe.messages)
  @JoinColumn({ name: 'airframe_id' })
  airframe: Airframe;

  @ManyToOne(type => Flight, flight => flight.messages)
  @JoinColumn({ name: 'flight_id' })
  flight: Flight;

  @Column()
  timestamp: Date;

  @Column()
  tail: string;

  @Column({ name: 'flight' })
  flightNumber: string;

  @Column()
  channel: number;

  @Column()
  frequency: number;

  @Column()
  level: number;

  @Column()
  error: number;

  @Column()
  mode: string;

  @Column()
  label: string;

  @Column({ name: 'block_id' })
  blockId: string;

  @Column({ name: 'message_number' })
  messageNumber: string;

  @Column()
  ack: string;

  @Column('text')
  text: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
