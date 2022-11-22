import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { runDB } from "./db";
import { BadRequestException, HttpException, ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./exception.filter";

const port = process.env.PORT || 5000

async function bootstrap() {
  await runDB()
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    stopAtFirstError: true,
    exceptionFactory: (errorsMessages) => {
      const errorsForResponse = [];

      errorsMessages.forEach(e => {
        const keys = Object.keys(e.constraints);
        keys.forEach(k => {
          errorsForResponse.push({message: e.constraints[k], field: e.property});
        })
      });

      throw new BadRequestException([errorsMessages.map(e => e.constraints)])
    }
  }));
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });
}

bootstrap();
