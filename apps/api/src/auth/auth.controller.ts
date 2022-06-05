import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
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
}
