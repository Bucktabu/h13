import { Injectable } from '@nestjs/common';
import { JwtService } from '../modules/auth/application/jwt.service';
import { UsersService } from '../modules/users/application/users.service';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RefreshTokenValidation {
  constructor(
    protected jwtService: JwtService,
    protected usersService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.cookies.refreshToken) {
      return res.sendStatus(401);
    }

    const tokenInBlackList = await this.jwtService.checkTokenInBlackList(
        req.cookies.refreshToken,
    );

    if (tokenInBlackList) {
      return res.sendStatus(401);
    }

    const tokenPayload = await this.jwtService.getTokenPayload(
      req.cookies.refreshToken,
    );

    if (!tokenPayload) {
      return res.sendStatus(401);
    }

    const user = await this.usersService.getUserByIdOrLoginOrEmail(
      tokenPayload.userId,
    );

    if (!user) {
      return res.sendStatus(401);
    }

    req.user = user;
    req.tokenPayload = tokenPayload;
    next();
  }
}
