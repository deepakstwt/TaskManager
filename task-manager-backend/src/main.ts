import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new LoggingInterceptor());

  // Setup Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('TaskManagerOS API')
    .setDescription('Enterprise-grade task management API documentation. Supports real-time tracking, advanced progress analytics, and RBAC security.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Disable ETags to prevent 304 Not Modified issues with dashboard data
  const expressInstance = app.getHttpAdapter().getInstance();
  expressInstance.set('etag', false);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
