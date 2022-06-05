import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async createUser(username: string, password: string) {
    try {
      const user = await this.prismaService.user.create({
        data: {
          username,
          password: await argon2.hash(password),
        },
      });

      return user;
    } catch {
      throw new BadRequestException(`Username ${username} is taken`);
    }
  }

  async getUser(username: string, password: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      throw new NotFoundException(`Cannot find user ${username}`);
    }

    if (await argon2.verify(user.password, password)) {
      return user;
    } else {
      throw new BadRequestException('Incorrect password');
    }
  }
}
