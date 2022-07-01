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

  it('POST /v1/users/:username – Can get a user by given username', async () => {
    await request(app.getHttpServer())
      .post('/v1/auth/signup')
      .send(USER_MOCK)
      .expect(201);

    const { body } = await request(app.getHttpServer())
      .get(`/v1/users/${USER_MOCK.username}`)
      .expect(200);

    expect(body).toBeDefined();
    expect(body.id).toBeDefined();
    expect(body.username).toEqual(USER_MOCK.username);
    expect(body.password).not.toBeDefined();
  });

  it("POST /v1/users/:username – Throws an error if given username isn't exist", async () => {
    await request(app.getHttpServer())
      .get(`/v1/users/${USER_MOCK.username}`)
      .expect(404);
  });
});
