import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  RelationCount,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Message } from './message.entity';
import { Flight } from './flight.entity';
import { Station } from './station.entity';

@Entity('airframes')
export class Airframe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tail: string;

  @OneToMany(type => Message, message => message.airframe)
  messages: Message[];

  @RelationCount('messages')
  public messagesCount?: number;

  @OneToMany(type => Flight, flight => flight.airframe)
  flights: Flight[];

  @RelationCount('flights')
  public flightsCount?: number;

  @ManyToMany(type => Station, station => station.airframes)
  @JoinTable({
    name: 'messages',
    joinColumn: {
      name: 'airframe_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'station_id',
      referencedColumnName: 'id',
    },
  })
  stations: Station[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
