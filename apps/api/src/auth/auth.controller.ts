import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDTO, GetUserDTO, UserDTO } from './dtos';
import { Serialize } from '../decorators';

@Controller('auth')
export class AuthController {
  constructor(public authService: AuthService) {}

  @Serialize(UserDTO)
  @Post('signup')
  async createUser(@Body() user: CreateUserDTO) {
    try {
      const createdUser = await this.authService.createUser(
        user.username,
        user.password,
      );

      return createdUser;
    } catch (e) {
      throw new ConflictException(e.message);
    }
  }

  @Serialize(UserDTO)
  @Post('signin')
  @HttpCode(200)
  async signIn(@Body() user: GetUserDTO) {
    try {
      const foundUser = await this.authService.getUser(
        user.username,
        user.password,
      );

      return foundUser;
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
