import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ValidationFilter } from './exception/validation.filter';
import { ValidationError } from 'class-validator';
import { ValidationException } from './exception/validation.exception';
import { HttpExceptionFilter } from './exception/http.filter';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter(), new ValidationFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      //skipMissingProperties: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map(
          (error) =>
            `${error.property} has wrong value ${error.value} ${Object.values(
              error.constraints,
            ).join(', ')}`,
        );
        return new ValidationException(messages);
      },
    }),
  );
  await app.listen(3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
