import { Controller, Get, Param } from '@nestjs/common';

import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(':id')
  findOne(@Param() params): Promise<Object> {
    console.log(params.id);
    return this.messagesService.getMessage(params.id);
  }
}
