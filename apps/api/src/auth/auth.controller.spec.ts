import { Test } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthController', () => {
  let authController: AuthController;
  let mockedAuthService: Partial<AuthService>;
  let mockedUsersService: Partial<UsersService>;

  beforeEach(async () => {
    mockedAuthService = {};
    mockedUsersService = {};

    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockedAuthService,
        },
        {
          provide: UsersService,
          useValue: mockedUsersService,
        },
      ],
    }).compile();

    authController = module.get(AuthController);
  });

  it('Should be defined', () => {
    expect(authController).toBeDefined();
  });
});
