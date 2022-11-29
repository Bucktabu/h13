import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { NextFunction, Request, Response } from 'express';
import { EmailConfirmationService } from "../users/application/emailConfirmation.service";

@Injectable()
export class ResendingConfirmationValidation implements NestMiddleware {
  constructor(protected emailConfirmationService: EmailConfirmationService,
              protected usersRepository: UsersRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.usersRepository.getUserByIdOrLoginOrEmail(
      req.body.email,
    );

    if (!user) {
      return res
        .status(400)
        .send({ errorsMessages: [{ message: 'Wrong email', field: 'email' }] });
    }

    const isConfirmed = await this.emailConfirmationService.checkConfirmation(user.id)

    if (isConfirmed) {
      return res
        .status(400)
        .send({ errorsMessages: [{ message: 'Email already confirmed', field: 'email' }] });
    }

    req.user = user;
    next();
  }
}