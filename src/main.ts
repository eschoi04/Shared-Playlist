import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { SuccessResponseInterceptor } from './common/interceptors/success';
import { HttpExceptionFilter } from './common/interceptors/error';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  // swagger setup
  const config = new DocumentBuilder()
    .setTitle('Shared Playlist API')
    .setDescription('Temporary room-based playlist service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // type validation setup(class-validator, class-transform)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // global interceptor for success response
  app.useGlobalInterceptors(new SuccessResponseInterceptor());

  // global filter for error response
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
