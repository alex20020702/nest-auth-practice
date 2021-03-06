import { NestFactory, Reflector } from '@nestjs/core';
import * as dotenv from 'dotenv';
dotenv.config();

import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoginGuard } from './auth/guards/login.guard';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const PORT = process.env.PORT || 8080;

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ forbidNonWhitelisted: true }));
  app.useGlobalGuards(
    new LoginGuard(
      app.get(ConfigService),
      app.get(JwtService),
      app.get(Reflector),
    ),
  );

  const config = new DocumentBuilder()
    .setTitle('User auth test')
    .setDescription(
      'This is a small app with users and authentication for them',
    )
    .setVersion('1.0')
    .addTag('nest-test')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(PORT);
  Logger.log('Listening on port ' + PORT);
}
bootstrap();
