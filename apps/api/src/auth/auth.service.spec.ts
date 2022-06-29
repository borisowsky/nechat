import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

const MOCKED_USER = {
  id: 1,
  username: 'TestUser',
  password: 't3stp4ssw0rd',
};

const MOCKED_JWT_SERVICE: Partial<JwtService> = {
  sign: () => 'test_jwt_token',
};

const MOCKED_USER_SERVICE: Partial<UsersService> = {
  create: jest.fn(),
  findByUsername: jest.fn(),
};

jest
  .spyOn(MOCKED_USER_SERVICE, 'create')
  .mockImplementation((_username: string, hashedPassword: string) => {
    return Promise.resolve({ ...MOCKED_USER, password: hashedPassword });
  });

describe('AuthService', () => {
  let authSerivce: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: MOCKED_JWT_SERVICE,
        },
        {
          provide: UsersService,
          useValue: MOCKED_USER_SERVICE,
        },
      ],
    }).compile();

    authSerivce = module.get(AuthService);
  });

  it('Can create an instance of auth service', () => {
    expect(authSerivce).toBeDefined();
  });

  it('Can sign up a user with hashed password', async () => {
    const user = await authSerivce.signUp(
      MOCKED_USER.username,
      MOCKED_USER.password,
    );

    expect(user.password).toBeDefined();
    expect(user.password).not.toEqual(MOCKED_USER.password);
  });

  it('Can sign in a user with given credentials', async () => {
    const user = await authSerivce.signUp(
      MOCKED_USER.username,
      MOCKED_USER.password,
    );

    jest
      .spyOn(MOCKED_USER_SERVICE, 'findByUsername')
      .mockReturnValue(Promise.resolve(user));

    const signedInUser = await authSerivce.signIn(
      MOCKED_USER.username,
      MOCKED_USER.password,
    );

    expect(signedInUser).toBeDefined();
  });

  it('Sign in a user with wrong username throws an error', async () => {
    jest
      .spyOn(MOCKED_USER_SERVICE, 'findByUsername')
      .mockImplementation(() => Promise.resolve(null));

    expect(
      authSerivce.signIn('UserThatDoesNotExist', MOCKED_USER.password),
    ).rejects.toThrow(NotFoundException);
  });

  it('Sign in a user with wrong password throws an error', async () => {
    const user = await authSerivce.signUp(
      MOCKED_USER.username,
      MOCKED_USER.password,
    );

    jest
      .spyOn(MOCKED_USER_SERVICE, 'findByUsername')
      .mockImplementation(() => Promise.resolve(user));

    expect(
      authSerivce.signIn(MOCKED_USER.username, '1inc0rr3ctp4ssw0rd'),
    ).rejects.toThrow(BadRequestException);
  });
});
