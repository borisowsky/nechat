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

  async create(username: string, password: string) {
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

  async verify(username: string, password: string) {
    const user = await this.findByUsername(username);

    if (await argon2.verify(user.password, password)) {
      return user;
    } else {
      throw new BadRequestException('Incorrect password');
    }
  }

  async findByUsername(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      throw new NotFoundException(`User ${username} does not exist`);
    }

    return user;
  }
}
