import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerAppModule } from '@modules/swagger-app/swagger-app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpExceptionFilter } from '@exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  SwaggerAppModule.setup(app);
  await app.listen(3001);
}
bootstrap();
