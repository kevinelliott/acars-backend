import { Controller, Get, Req, Request, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('myip')
  async current(@Req() req): Promise<Object> {
    const ipAddress = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
    console.log(ipAddress.split(':').pop());
    return this.userService.myIp(ipAddress);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
