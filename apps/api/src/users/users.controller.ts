import { Controller, Get, Param } from '@nestjs/common';
import { Serialize } from 'src/decorators';

import { UserDTO } from './dtos';
import { UsersService } from './users.service';

@Controller('/users')
@Serialize(UserDTO)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/:username')
  getUserByName(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }
}
