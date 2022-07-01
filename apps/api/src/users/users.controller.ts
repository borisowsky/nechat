import { Controller, Get, NotFoundException, Param } from '@nestjs/common';

import { UserDTO } from './dtos';
import { UsersService } from './users.service';
import { Serialize } from '../decorators/serialize.decorator';

@Controller('/users')
@Serialize(UserDTO)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/:username')
  async getUserByName(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException(`User ${username} does not exist`);
    }

    return user;
  }
}
