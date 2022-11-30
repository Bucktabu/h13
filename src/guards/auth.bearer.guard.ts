import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../modules/auth/application/jwt.service';
import { UsersService } from '../modules/users/application/users.service';

@Injectable()
export class AuthBearerGuard implements CanActivate {
  constructor(
    protected jwtService: JwtService,
    protected usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      throw new UnauthorizedException();
    }

    const accessToken = request.headers.authorization.split(' ')[1];

    const tokenPayload = await this.jwtService.getTokenPayload(accessToken);

    if (!tokenPayload) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.getUserByIdOrLoginOrEmail(
      tokenPayload.userId,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    request.user = user;
    request.token = tokenPayload;
    return true;
  }
}
