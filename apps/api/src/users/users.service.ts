import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  create(username: string, password: string) {
    return this.prismaService.user.create({
      data: {
        username,
        password,
      },
    });
  }

  findByUsername(username: string) {
    return this.prismaService.user.findUnique({
      where: {
        username,
      },
    });
  }
}
