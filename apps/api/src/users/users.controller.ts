import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UserDTO } from './dtos';
import { CurrentUser } from './decorators/current-user.decorator';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Serialize } from '../decorators/serialize.decorator';

@Controller('/users')
@Serialize(UserDTO)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/whoami')
  whoAmI(@CurrentUser() user: Omit<UserDTO, 'token'>) {
    return user;
  }

  @Get('/:username')
  getUserByName(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }
}
