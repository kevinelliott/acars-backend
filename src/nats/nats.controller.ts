import { Controller, Injectable, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EventsGateway } from '../events/events.gateway';
import { Message} from '../entities/message.entity';

@Injectable()
@Controller()
export class NatsController {
  constructor(
    private readonly eventsGateway: EventsGateway,
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
  ) {}

  private readonly logger = new Logger(NatsController.name);

  @EventPattern('message.created')
  async handleMessageCreated(data: Record<string, unknown>) {
    this.logger.log('Message created: ' + data.toString());

    const result = await this.messageRepository.find({
      relations: ['station', 'airframe', 'flight'],
      where: { id: data.ID }
    })

    this.eventsGateway.broadcast('newMessages', result);
  }
}