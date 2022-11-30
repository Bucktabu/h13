import { Injectable, NestMiddleware } from '@nestjs/common';
import { EmailConfirmationRepository } from '../modules/users/infrastructure/emailConfirmation.repository';
import { NextFunction, Request, Response } from 'express';

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
