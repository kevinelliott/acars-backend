import { Controller, Injectable, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Timestamp } from 'typeorm';

import { MessageDecoder } from '@airframes/acars-decoder/dist/MessageDecoder';

import { EventsGateway } from '../events/events.gateway';
import { Message} from '../entities/message.entity';
import { MessageDecoding } from 'src/entities/message_decoding.entity';

@Injectable()
@Controller()
export class NatsController {
  constructor(
    private readonly eventsGateway: EventsGateway,
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    @InjectRepository(MessageDecoding) private readonly messageDecodingRepository: Repository<MessageDecoding>,
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
    let secondsSinceEventReceived = (meetingFoundTime - eventReceivedTime) / 1000;

    const messageTime = Date.parse(message.createdAt.toUTCString());
    const delay = meetingFoundTime - messageTime;
    const delayInSeconds = delay / 1000;
    this.logger.log(`Retrieved Message from DB - Message: #${message.id}, Current Time: ${meetingFoundTime}, Message Time: ${messageTime}, Time since Event Received: ${secondsSinceEventReceived} seconds, Delay since Message create: ${delayInSeconds} seconds`);

    await this.eventsGateway.broadcast('newMessages', [message]);
    const broadcastedTime = Date.now();
    secondsSinceEventReceived = (broadcastedTime - eventReceivedTime) / 1000;
    this.logger.log(`Broadcasting Message to browsers - Message: #${message.id}, Current Time: ${broadcastedTime}, Time since Event Received: ${secondsSinceEventReceived} seconds`);

    const decoding = new MessageDecoder().decode(message, { debug: { only_decoded: false } });
    if (decoding.decoded == true) {
      const messageDecoding = new MessageDecoding();
      messageDecoding.message = message;
      messageDecoding.decoderName = 'acars-decoder-typescript';
      messageDecoding.decoderVersion = '1.0.28';
      messageDecoding.decoderType = decoding.decoder.type;
      messageDecoding.decoderPlugin = decoding.decoder.name;
      messageDecoding.decodeLevel = decoding.decoder.decodeLevel;
      messageDecoding.resultRaw = decoding.raw;
      messageDecoding.resultFormatted = decoding.formatted;
      messageDecoding.remainingUndecoded = decoding.remaining;
      await this.messageDecodingRepository.save(messageDecoding);
      this.logger.log(`Saved message decoding (#${messageDecoding.id})`);
    }
  }
}