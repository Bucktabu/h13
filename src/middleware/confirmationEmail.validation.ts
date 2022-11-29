import { Injectable, NestMiddleware } from '@nestjs/common';
import { EmailConfirmationRepository } from '../users/infrastructure/emailConfirmation.repository';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ConfirmationEmailValidation implements NestMiddleware {
  constructor(
    protected emailConfirmationRepository: EmailConfirmationRepository,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const emailConfirmation =
      await this.emailConfirmationRepository.getEmailConfirmationByCodeOrId(
        req.body.code,
      );

    let error = false;
    if (!emailConfirmation) {
      error = true;
    } else if (emailConfirmation.isConfirmed === true) {
      error = true;
    } else if (emailConfirmation!.expirationDate < new Date()) {
      error = true;
    }

    if (error) {
      return res
        .status(400)
        .send({ errorsMessages: [{ message: 'Bad Request', field: 'code' }] });
    }

    req.emailConfirmationId = emailConfirmation.id;
    next();
  }
}
