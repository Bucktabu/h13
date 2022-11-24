import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === 400) {
      const errors = {
        errorsMessage: [],
      };
      const responseBody: any = exception.getResponse();
      responseBody.message.forEach((m) => errors.errorsMessage.push(m));

      response.status(status).send(errors);
    } else {
      // response.status(status).json({
      //   statusCode: status,
      //   timestamp: new Date().toISOString(),
      //   path: request.url,
      // });
      response.sendStatus(status);
    }
  }
}
