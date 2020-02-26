import { Controller, Get, Req } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('myip')
  async current(@Req() req): Promise<Object> {
    const ipAddress = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
    console.log(ipAddress.split(':').pop());
    return this.userService.myIp(ipAddress);
  }
}
