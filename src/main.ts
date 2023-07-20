import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionFilter } from './common/http-exceptions.filter';
import { HttpInterceptor } from './common/interceptors/http.interceptor';

async function bootstrap() {

  const { PORT, APP_NAME } = process.env

  const logger = new Logger('bootstrap');
  // const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger: ['debug', 'error'] });
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({ origin: '*' });

  app
    .setGlobalPrefix('api')
    .useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    .useGlobalFilters(new AllExceptionFilter())
    .useGlobalInterceptors(new HttpInterceptor())
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

  
  // await app.listen(process.env.PORT || 3000);

  await app.listen(PORT || 3000, async () => logger.log(`${APP_NAME} ${await app.getUrl()}/api`));

  // logger.debug(`Application is running on PORT: ${process.env.PORT}`);
}
bootstrap();
