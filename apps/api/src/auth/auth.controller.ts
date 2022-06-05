import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import { SignUpDto } from './dtos/signUp.dto';
import { SignInDto } from './dtos/signIn.dto';
import { AuthService } from './auth.service';
import { UserEntity } from './entities/UserEntity';

@Controller('auth')
export class AuthController {
  constructor(public authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup')
  async signUp(@Body() user: SignUpDto) {
    try {
      const createdUser = await this.authService.createUser(
        user.username,
        user.password,
      );

      return new UserEntity(createdUser);
    } catch (e) {
      throw new ConflictException(e.message);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signin')
  @HttpCode(200)
  async signIn(@Body() user: SignInDto) {
    try {
      const foundUser = await this.authService.getUser(
        user.username,
        user.password,
      );

      return new UserEntity(foundUser);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
