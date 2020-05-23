import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

  async login(user: any) {
    const payload = { email: user.email, username: user.username, sub: user.userId };
    return {
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        gravatar_url: user.gravatarUrl,
        stations: user.stations
      },
      accessToken: this.jwtService.sign(payload),
    };
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
    userDto.encrypted_password = data.password;
    const user = await this.usersService.create(userDto);
    const { password, encrypted_password, ...result } = user;
    return {
      user: result,
      message: 'Check your email to verify your new account.'
    };
  }
}
