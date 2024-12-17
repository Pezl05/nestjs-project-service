import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(new Logger());
  // app.enableCors({
  //   origin: 'http://localhost:3000',
  //   credentials: true,
  // });
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT ?? 3003);
}
bootstrap();
