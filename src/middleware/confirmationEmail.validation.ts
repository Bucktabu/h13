import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { EmailConfirmationRepository } from '../emailConfirmation/infrastructure/emailConfirmation.repository';

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

    let isConfirmed = true;
    if (!emailConfirmation) {
      isConfirmed = false;
    }

    if (emailConfirmation!.expirationDate < new Date()) {
      isConfirmed = true;
    }

    if (emailConfirmation!.isConfirmed) {
      isConfirmed = true;
    }

    if (!isConfirmed) {
      return res
        .status(400)
        .send({ errorsMessages: [{ message: 'Bad Request', field: 'code' }] });
    }

    req.body.emailConfirmationId = emailConfirmation.id;
    next();
  }
}
