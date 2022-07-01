import { INestApplication, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const USER_MOCK = {
  username: 'TestUser',
  password: 't3stp4ssw0rd',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    prismaService = module.get(PrismaService);

    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    await app.init();
  });

  afterEach(() => {
    return prismaService.user.deleteMany();
  });

  it('Sign up a new user', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/v1/auth/signup')
      .send(USER_MOCK)
      .expect(201);

    expect(body.id).toBeDefined();
    expect(body.username).toEqual(USER_MOCK.username);
    expect(body.token).toBeDefined();
    expect(body.password).not.toBeDefined();
  });

  it('Sign in a just created user', async () => {
    await request(app.getHttpServer())
      .post('/v1/auth/signup')
      .send(USER_MOCK)
      .expect(201);

    const { body } = await request(app.getHttpServer())
      .post('/v1/auth/signin')
      .send(USER_MOCK)
      .expect(200);

    expect(body.id).toBeDefined();
    expect(body.username).toEqual(USER_MOCK.username);
    expect(body.token).toBeDefined();
    expect(body.password).not.toBeDefined();
  });
});
