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

@Entity('airframes')
export class Airframe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tail: string;

  @OneToMany(type => Message, message => message.airframe)
  messages: [];

  @RelationCount('messages')
  public messagesCount?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
