import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { EmailConfirmationRepository } from '../users/infrastructure/emailConfirmation.repository';

@Injectable()
export class ConfirmationCodeValidation implements NestMiddleware {
  constructor(
    protected emailConfirmationRepository: EmailConfirmationRepository,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const emailConfirmation =
      await this.emailConfirmationRepository.getEmailConfirmationByCodeOrId(
        req.body.recoveryCode,
      );

    if (!emailConfirmation) {
      return res.status(400).send({
        errorsMessages: [
          { message: 'Incorrect recovery code', field: 'recoveryCode' },
        ],
      });
    }

    req.body.userId = emailConfirmation.id;
    next();
  }
}
