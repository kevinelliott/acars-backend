import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { RavenInterceptor } from 'nest-raven';

import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseInterceptors(new RavenInterceptor())
  @Get()
  findAll(@Query() params): Promise<Object> {
    console.log('API: Getting all messages');
    return this.messagesService.getMessages(params);
  }

  @UseInterceptors(new RavenInterceptor())
  @Get(':id')
  findOne(@Param() params): Promise<Object> {
    console.log(`API: Getting message ${params.id}`);
    return this.messagesService.getMessage(params.id);
  }
}
