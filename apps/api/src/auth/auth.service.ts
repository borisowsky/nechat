import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private hashPassword = (password: string) => {
    return argon2.hash(password);
  };

  private verifyPassword = (hashedPassword: string, password: string) => {
    return argon2.verify(hashedPassword, password);
  };

  async signUp(username: string, password: string) {
    const hashedPassword = await this.hashPassword(password);
    const user = await this.usersService.create(username, hashedPassword);

    return {
      ...user,
      token: this.jwtService.sign({
        id: user.id,
        username: user.username,
      }),
    };
  }

  async signIn(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException(`User ${username} does not exist`);
    }

    if (!(await this.verifyPassword(user.password, password))) {
      throw new BadRequestException('Incorrect password');
    }

    return {
      ...user,
      token: this.jwtService.sign({
        id: user.id,
        username: user.username,
      }),
    };
  }
}
