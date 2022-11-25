import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoginOrEmailExistValidation implements NestMiddleware {
  constructor(protected usersRepository: UsersRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const loginExist = await this.usersRepository.getUserByIdOrLoginOrEmail(
      req.body.login,
    );
    const error = [];

    if (loginExist) {
      error.push('login');
    }

    const emailExist = await this.usersRepository.getUserByIdOrLoginOrEmail(
      req.body.email,
    );

    if (emailExist) {
      error.push('email');
    }

    if (error.length > 0) {
      const errorsMessages = [];
      for (let i = 0; i < error.length; i++) {
        errorsMessages.push({
          message: `User with this ${error[i]} already exists`,
          field: error[i],
        });
      }

      return res.status(400).send({ errorsMessages });
    }

    return next();
  }
}
