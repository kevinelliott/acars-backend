import { Controller, Injectable, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Timestamp } from 'typeorm';

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
    this.logger.log(`Message created event called: Current Time: ${Date.now()}`);

    const message: Message = await this.messageRepository.findOne({
      relations: ['station', 'airframe', 'flight'],
      where: { id: data.id }
    });
    this.logger.log(`Message: # ${data.id}, Current Time: ${Date.now()}, Message Time: ${message.timestamp}, Delay: ${Date.now() - Date.parse(message.timestamp.toUTCString())}`);

    await this.eventsGateway.broadcast('newMessages', message);
    this.logger.log(`Message broadcasted to browsers: Current Time: ${Date.now()}`);
  }
}