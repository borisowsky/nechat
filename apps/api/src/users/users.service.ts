import { Injectable, BadRequestException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(username: string, password: string) {
    try {
      const user = await this.prismaService.user.create({
        data: {
          username,
          password,
        },
      });

      return user;
    } catch {
      throw new BadRequestException(`User ${username} already exist`);
    }
  }

  async findByUsername(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    return user;
  }
}
