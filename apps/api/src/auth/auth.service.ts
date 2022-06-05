import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(username: string, password: string) {
    const user = await this.usersService.createUser(username, password);

    return {
      ...user,
      token: this.jwtService.sign({
        id: user.id,
        username: user.username,
      }),
    };
  }

  async signIn(username: string, password: string) {
    const user = await this.usersService.getUser(username, password);

    return {
      ...user,
      token: this.jwtService.sign({
        id: user.id,
        username: user.username,
      }),
    };
  }
}
