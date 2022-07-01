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

  it('POST /v1/auth/signup – Can sign up a new user', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/v1/auth/signup')
      .send(USER_MOCK)
      .expect(201);

    expect(body.id).toBeDefined();
    expect(body.username).toEqual(USER_MOCK.username);
    expect(body.token).toBeDefined();
    expect(body.password).not.toBeDefined();
  });

  it('POST /v1/auth/signup – Throws an error if trying to sign up user with taken username', async () => {
    await request(app.getHttpServer())
      .post('/v1/auth/signup')
      .send(USER_MOCK)
      .expect(201);

    await request(app.getHttpServer())
      .post('/v1/auth/signup')
      .send(USER_MOCK)
      .expect(400);
  });

  it('POST /v1/auth/signin – Can sign in with given credentials', async () => {
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

  it('POST /v1/auth/signin – Throws corresponding errors for invalid credentials', async () => {
    await request(app.getHttpServer())
      .post('/v1/auth/signup')
      .send(USER_MOCK)
      .expect(201);

    await request(app.getHttpServer())
      .post('/v1/auth/signin')
      .send({ ...USER_MOCK, password: '1nv4l1dp4ssw0rd' })
      .expect(400);

    await request(app.getHttpServer())
      .post('/v1/auth/signin')
      .send({ ...USER_MOCK, username: 'InvalidUser' })
      .expect(404);
  });

  it('GET /v1/auth/whoami – Can get current user', async () => {
    const { body: signedUpUser } = await request(app.getHttpServer())
      .post('/v1/auth/signup')
      .send(USER_MOCK)
      .expect(201);

    expect(signedUpUser.token).toBeDefined();

    const { body: authenticatedUser } = await request(app.getHttpServer())
      .get('/v1/auth/whoami')
      .set('Authorization', `Bearer ${signedUpUser.token}`)
      .expect(200);

    expect(authenticatedUser).toBeDefined();
    expect(authenticatedUser.id).toBeDefined();
    expect(authenticatedUser.username).toEqual(USER_MOCK.username);
    expect(authenticatedUser.password).not.toBeDefined();
  });

  it("GET /v1/auth/whoami – Throws an error if a token isn't present", async () => {
    await request(app.getHttpServer()).get('/v1/auth/whoami').expect(401);
  });
});
