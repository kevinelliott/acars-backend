import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';

import { UsersService } from '../users/users.service';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    console.log('auth');
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async confirm(token: any) {
    console.log('confirm');
    console.log(token);
    const user = await this.usersService.findOneByConfirmationToken(token);
    if (user) {
      user.status = 'active';
      await this.usersService.save(user);
      return { confirmed: true };
    }
    throw new BadRequestException('Unable to find pending confirmation');
  }

  async login(user: any) {
    const payload = { email: user.email, username: user.username, sub: user.userId };
    return {
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        gravatarUrl: user.gravatarUrl,
        role: user.role,
        stations: user.stations,
        apiKey: user.apiKey,
        status: user.status,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }

  async mail(user: User) {
    console.log(user);
    this
      .mailerService
      .sendMail({
        to: `${user.name} <${user.email}>`,
        subject: 'Airframes Registration Confirmation',
        template: 'confirmation',
        context: {
          baseUrl: 'http://app.airframes.io',
          name: user.name,
          email: user.email,
          username: user.username,
          confirmationToken: user.confirmationToken,
        },
      })
      .then(() => {})
      .catch(() => {});
  }

  async register(data: any) {
    console.log(data);
    let existingUser = await this.usersService.findOneByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    existingUser = await this.usersService.findOneByUsername(data.username);
    if (existingUser) {
      throw new BadRequestException('Username already in use');
    }

    let userDto = new User();
    userDto.email = data.email;
    userDto.name = data.name;
    userDto.username = data.username;
    userDto.password = data.password;
    userDto.encryptedPassword = data.password;
    userDto.confirmationToken = crypto.createHash('md5').digest("hex");
    const user = await this.usersService.create(userDto);
    const { password, encryptedPassword, ...result } = user;

    const mailResult = await this.mail(user);

    return {
      user: result,
      message: 'Check your email to verify your new account.',
    };
  }
}
