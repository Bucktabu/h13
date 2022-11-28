import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ResendingConfirmationValidation implements NestMiddleware {
  constructor(protected usersRepository: UsersRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.usersRepository.getUserByIdOrLoginOrEmail(
      req.body.email,
    );

    if (!user) {
      return res
        .status(400)
        .send({ errorsMessages: [{ message: 'Wrong email', field: 'email' }] });
    }

    req.user = user;
    next();
  }
}