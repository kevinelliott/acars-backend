import { Controller, Get, Req } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('myip')
  async current(@Req() req): Promise<Object> {
    console.log(req.connection.remoteAddress.split(':').pop());
    return this.userService.myIp(req.connection.remoteAddress.split(':').pop());
  }
}
