import { CanActivate, ExecutionContext, Injectable, PipeTransform, UnauthorizedException } from "@nestjs/common";
import { UsersRepository } from '../modules/users/infrastructure/users.repository';
import { UserDBModel } from '../modules/users/infrastructure/entity/userDB.model';
import bcrypt from 'bcrypt';

@Injectable()
export class CheckCredentialGuard implements CanActivate {
  constructor(protected usersRepository: UsersRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const user: UserDBModel | null =
      await this.usersRepository.getUserByIdOrLoginOrEmail(
        req.body.loginOrEmail,
      );

    if (!user) {
      throw new UnauthorizedException()
    }

    const passwordEqual = await bcrypt.compare(
      req.body.password,
      user.passwordHash,
    );

    if (!passwordEqual) {
      throw new UnauthorizedException()
    }

    req.user = user
    return true
  }
}