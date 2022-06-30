import { Test } from '@nestjs/testing';

import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    usersService = module.get(UsersService);
  });

  it('Should be defined', () => {
    expect(usersService).toBeDefined();
  });
});
