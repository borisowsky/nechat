import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, CurrentUserInterceptor],
})
export class UsersModule {}
