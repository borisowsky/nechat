import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDTO, GetUserDTO, UserDTO } from './dtos';
import { Serialize } from '../decorators';

@Controller('/auth')
@Serialize(UserDTO)
export class AuthController {
  constructor(public authService: AuthService) {}

  @Post('/signup')
  createUser(@Body() user: CreateUserDTO) {
    return this.authService.createUser(user.username, user.password);
  }

  @Post('/signin')
  @HttpCode(200)
  getUser(@Body() user: GetUserDTO) {
    return this.authService.getUser(user.username, user.password);
  }
}
