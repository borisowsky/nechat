import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';

import { UserDTO } from './dtos/user.dto';
import { SignUpDTO } from './dtos/sign-up.dto';
import { SignInDTO } from './dtos/sign-in.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { Serialize } from '../decorators/serialize.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('/auth')
@Serialize(UserDTO)
export class AuthController {
  constructor(public authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() user: SignUpDTO) {
    return this.authService.signUp(user.username, user.password);
  }

  @Post('/signin')
  @HttpCode(200)
  signIn(@Body() user: SignInDTO) {
    return this.authService.signIn(user.username, user.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/whoami')
  whoAmI(@CurrentUser() user: Omit<UserDTO, 'token'>) {
    return user;
  }
}
