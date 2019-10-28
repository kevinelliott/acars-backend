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

@Entity('flights')
export class Flight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  flight: string;

  @OneToMany(type => Message, message => message.flight)
  messages: [];

  @RelationCount('messages')
  public messagesCount?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
