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
    const eventReceivedTime = Date.now();
    this.logger.log(`Received Message created event from NATS - Message: #${data.id}, Current Time: ${eventReceivedTime}`);

    const message: Message = await this.messageRepository.findOne({
      relations: ['station', 'airframe', 'flight'],
      where: { id: data.id }
    });
    const meetingFoundTime = Date.now();

    const messageTime = Date.parse(message.createdAt.toUTCString());
    const delay = meetingFoundTime - messageTime;
    const delayInSeconds = Math.floor(delay / 1000);
    this.logger.log(`Retrieved Message from DB - Message: #${message.id}, Current Time: ${meetingFoundTime}, Message Time: ${messageTime}, Delay: ${delayInSeconds} seconds`);

    await this.eventsGateway.broadcast('newMessages', message);
    const broadcastedTime = Date.now();
    const secondsSinceEventReceived = (broadcastedTime - eventReceivedTime) / 1000;
    this.logger.log(`Broadcasting Message to browsers - Message: #${message.id}, Current Time: ${broadcastedTime}, Time since Event Received: ${secondsSinceEventReceived} seconds`);
  }
}