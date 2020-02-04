import { Controller, Get, Param, Query } from '@nestjs/common';

import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  findAll(@Query() params): Promise<Object> {
    console.log('API: Getting all messages');
    return this.messagesService.getMessages(params);
  }

  @Get(':id')
  findOne(@Param() params): Promise<Object> {
    console.log(`API: Getting message ${params.id}`);
    return this.messagesService.getMessage(params.id);
  }
}
