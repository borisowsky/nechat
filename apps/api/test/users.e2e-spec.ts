import { INestApplication, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const USER_MOCK = {
  username: 'TestUser',
  password: 't3stp4ssw0rd',
};

describe('UsersController (e2e)', () => {
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

  it('Can get current user', async () => {
    const { body: signedUpUser } = await request(app.getHttpServer())
      .post('/v1/auth/signup')
      .send(USER_MOCK)
      .expect(201);

    expect(signedUpUser.token).toBeDefined();

    const { body: authenticatedUser } = await request(app.getHttpServer())
      .get('/v1/users/whoami')
      .set('Authorization', `Bearer ${signedUpUser.token}`)
      .expect(200);

    expect(authenticatedUser).toBeDefined();
    expect(authenticatedUser.id).toBeDefined();
    expect(authenticatedUser.username).toEqual(USER_MOCK.username);
    expect(authenticatedUser.password).not.toBeDefined();
  });

  it('Can get user by given username', async () => {
    await request(app.getHttpServer())
      .post('/v1/auth/signup')
      .send(USER_MOCK)
      .expect(201);

    const { body } = await request(app.getHttpServer()).get(
      `/v1/users/${USER_MOCK.username}`,
    );

    expect(body).toBeDefined();
    expect(body.id).toBeDefined();
    expect(body.username).toEqual(USER_MOCK.username);
    expect(body.password).not.toBeDefined();
  });
});
