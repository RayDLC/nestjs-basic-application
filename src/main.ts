import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionFilter } from './common/http-exceptions.filter';

async function bootstrap() {

  const { PORT, APP_NAME } = process.env

  const logger = new Logger('application-core');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger: ['debug', 'error'] });

  app.enableCors({ origin: '*' });
  app
    .setGlobalPrefix('api')
    .useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    .useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
    .useGlobalFilters(new AllExceptionFilter())
    .disable('x-powered-by')
    .disable('etag');

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(APP_NAME)
    .setDescription('Teslo shop endpoints')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagSorter: 'alpha',
      operationsSorter: 'alpha',
    }
  });

  await app.listen(PORT || 3000, async () => logger.debug(`${APP_NAME} ${await app.getUrl()}/api`));

}
bootstrap();
