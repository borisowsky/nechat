import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [UsersService],
  providers: [UsersService],
})
export class UsersModule {}
