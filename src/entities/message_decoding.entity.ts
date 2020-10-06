import {
  Entity,
  Column,
  ColumnType,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import { Message } from './message.entity';

@Entity('message_decodings')
export class MessageDecoding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => Message, message => message.message_decodings)
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @Column({ name: 'decoder_name' })
  decoderName: string;

  @Column({ name: 'decoder_version' })
  decoderVersion: string;

  @Column({ name: 'decoder_type' })
  decoderType: string;

  @Column({ name: 'decoder_plugin' })
  decoderPlugin: string;

  @Column({ name: 'decode_level' })
  decodeLevel: string;

  @Column({ name: 'result_raw', type: 'jsonb' })
  resultRaw: any;

  @Column({ name: 'result_formatted', type: 'jsonb' })
  resultFormatted: any;

  @Column({ name: 'remaining_undecoded', type: 'jsonb' })
  remainingUndecoded: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
