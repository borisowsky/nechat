import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['warn', 'error'],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const prismaService = app.get(PrismaService);

  await prismaService.enableShutdownHooks(app);
  await app.listen(4000);
}

bootstrap();
