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

  @Column({ name: 'last_update_at' })
  lastUpdateAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
