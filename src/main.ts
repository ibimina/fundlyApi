import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors();

  app.setGlobalPrefix(`/api/${configService.get('API_VERSION')}`);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Fundly API')
    .setDescription('Fundly API documentation')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      apiSorter: 'alpha',
      operationsSorter: 'alpha',
      tagsSorter: 'alpha',
    },
    customSiteTitle: 'Fundly API',
    customCss: '.swagger-ui .topbar { background-color: white; }',
  };

  SwaggerModule.setup(
    `/api/${configService.get('API_VERSION')}`,
    app,
    document,
    customOptions,
  );

  await app.listen(configService.get('PORT') || 8000);
}

bootstrap().catch((error) => {
  const logger = new Logger('bootstrap');

  logger.error('Failed to start server', error);
});
