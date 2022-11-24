import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthBasicGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const base64 = Buffer.from(
      `${process.env.BASIC_USER}:${process.env.BASIC_PASS}`,
    ).toString('base64');
    const validAuthHeader = `Basic ${base64}`;

    const authHeader = request.headers.authorization;

    if (authHeader !== validAuthHeader) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
