import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { Message } from '../entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message, 'readonly') private readonly messageRepository: Repository<Message>,
  ) { }

  async getMessage(id): Promise<Object> {
    return await this.messageRepository
      .findOne(id, {
        relations: ['airframe', 'flight', 'station']
      });
  }

  async getMessages(params): Promise<Object> {
    let query = this.messageRepository.createQueryBuilder('messages')
      .leftJoinAndSelect('messages.airframe', 'airframe')
      .leftJoinAndSelect('messages.flight', 'flight')
      .leftJoinAndSelect('messages.station', 'station');
    if (params.text)
      query = query.andWhere('messages.text ILIKE :text', { text: `%${params.text}%` });
    if (params.airframe_ids)
      query = query.andWhere('messages.airframe_id IN (:...ids)',
        { ids: params.airframe_ids.split(',').map((id: string) => Number(id)) }
      );
    if (params.flight_id)
      query = query.andWhere('messages.flight_id = :id', { id: params.flight_id });

    query = query
      .orderBy({
        'messages.created_at': 'DESC'
      })
      .limit(100);
    return await query.getMany();
  }
}
