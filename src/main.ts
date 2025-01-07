import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { CustomLogger } from './custom-logger.service';
// import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  // app.useLogger(new Logger());
  // app.enableCors({
  //   origin: 'http://localhost:3000',
  //   credentials: true,
  // });
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
