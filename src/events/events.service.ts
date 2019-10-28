import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
  getHello(): string {
    return 'Hello World!';
  }
}
