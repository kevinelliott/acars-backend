import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';

import { Airframe } from './airframe.entity';
import { Flight } from './flight.entity';
import { MessageDecoding } from './message_decoding.entity';
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
  source: string;

  @Column({ name: 'source_type' })
  sourceType: string;

  @Column({ name: 'link_direction' })
  linkDirection: string;

  @Column({ name: 'from_hex' })
  fromHex: string;

  @Column({ name: 'to_hex' })
  toHex: string;

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
  data: string;

  @Column('text')
  text: string;

  @Column({ name: 'departing_airport' })
  departingAirport: string;

  @Column({ name: 'destination_airport' })
  destinationAirport: string;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column()
  altitude: number;

  @OneToMany(type => MessageDecoding, message_decoding => message_decoding.message)
  message_decodings: MessageDecoding[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
