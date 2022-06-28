import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { SignUpDTO, SignInDTO, UserDTO } from './dtos';
import { Serialize } from '../decorators';

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
  whoAmI(@Request() req: any) {
    return req.user;
  }
}
