import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

const USER_MOCK = {
  username: 'TestUser',
  password: 't3stp4ssw0rd',
};

const MOCKED_JWT_SERVICE: Partial<JwtService> = {
  sign: () => 'test_jwt_token',
};

const createMockerUsersService = () => {
  const users: User[] = [];

  return {
    create: (username: string, hashedPassword: string) => {
      const user = { id: users.length, username, password: hashedPassword };

      users.push(user);

      return Promise.resolve(user);
    },
    findByUsername: (username: string) => {
      return Promise.resolve(users.find((user) => user.username === username));
    },
  };
};

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
          useValue: createMockerUsersService(),
        },
      ],
    }).compile();

    authSerivce = module.get(AuthService);
  });

  it('Should be defined', () => {
    expect(authSerivce).toBeDefined();
  });

  it('Can sign up a user with hashed password', async () => {
    const user = await authSerivce.signUp(
      USER_MOCK.username,
      USER_MOCK.password,
    );

    expect(user.password).toBeDefined();
    expect(user.password).not.toEqual(USER_MOCK.password);
  });

  it('Can sign in a user with given credentials', async () => {
    await authSerivce.signUp(USER_MOCK.username, USER_MOCK.password);

    const signedInUser = await authSerivce.signIn(
      USER_MOCK.username,
      USER_MOCK.password,
    );

    expect(signedInUser).toBeDefined();
  });

  it('Sign in a user with wrong username throws an error', async () => {
    await expect(
      authSerivce.signIn('UserThatDoesNotExist', USER_MOCK.password),
    ).rejects.toThrow(NotFoundException);
  });

  it('Sign in a user with taken username throws an error', async () => {
    await authSerivce.signUp(USER_MOCK.username, USER_MOCK.password);

    await expect(
      authSerivce.signUp(USER_MOCK.username, USER_MOCK.password),
    ).rejects.toThrow(BadRequestException);
  });

  it('Sign in a user with wrong password throws an error', async () => {
    await authSerivce.signUp(USER_MOCK.username, USER_MOCK.password);

    await expect(
      authSerivce.signIn(USER_MOCK.username, '1inc0rr3ctp4ssw0rd'),
    ).rejects.toThrow(BadRequestException);
  });
});
