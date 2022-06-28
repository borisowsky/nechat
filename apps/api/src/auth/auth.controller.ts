import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { UserDTO } from './dtos/user.dto';
import { SignUpDTO } from './dtos/sign-up.dto';
import { SignInDTO } from './dtos/sign-in.dto';
import { AuthService } from './auth.service';
import { Serialize } from '../decorators/serialize.decorator';

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
