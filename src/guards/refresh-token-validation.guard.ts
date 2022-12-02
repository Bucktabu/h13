import { CanActivate, ExecutionContext, Injectable, PipeTransform, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '../modules/auth/application/jwt.service';
import { UsersService } from '../modules/users/application/users.service';

@Injectable()
export class RefreshTokenValidationGuard implements CanActivate {
  constructor(
    protected jwtService: JwtService,
    protected usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!req.cookies.refreshToken) {
      throw new UnauthorizedException();
    }

    const tokenInBlackList = await this.jwtService.checkTokenInBlackList(
        req.cookies.refreshToken,
    );

    if (tokenInBlackList) {
      throw new UnauthorizedException();
    }

    const tokenPayload = await this.jwtService.getTokenPayload(
      req.cookies.refreshToken,
    );

    if (!tokenPayload) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.getUserByIdOrLoginOrEmail(
      tokenPayload.userId,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    req.user = user;
    req.tokenPayload = tokenPayload;
    return true
  }
}
