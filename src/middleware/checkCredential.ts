import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { Request, Response, NextFunction } from 'express';
import { UserDBModel } from '../users/infrastructure/entity/userDB.model';
import bcrypt from 'bcrypt';

@Injectable()
export class CheckCredential implements NestMiddleware {
  constructor(protected usersRepository: UsersRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const user: UserDBModel | null =
      await this.usersRepository.getUserByIdOrLoginOrEmail(
        req.body.loginOrEmail,
      );

    if (!user) {
      return res.sendStatus(401);
    }

    const passwordEqual = await bcrypt.compare(
      req.body.password,
      user.passwordHash,
    );

    if (!passwordEqual) {
      return res.sendStatus(401);
    }

    req.user = user;
    return next();
  }
}