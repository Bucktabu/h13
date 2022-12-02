import { Injectable, PipeTransform } from '@nestjs/common';
import { EmailConfirmationService } from '../modules/users/application/emailConfirmation.service';
import { UsersRepository } from '../modules/users/infrastructure/users.repository';

@Injectable()
export class EmailResendingValidationPipe implements PipeTransform {
  constructor(
    protected emailConfirmationService: EmailConfirmationService,
    protected usersRepository: UsersRepository,
  ) {}

  async transform(dto, metadata) {
    const email = dto.email;
    const user = await this.usersRepository.getUserByIdOrLoginOrEmail(email);

    if (!user) {
      return false;
    }

    const isConfirmed = await this.emailConfirmationService.checkConfirmation(
      user.id,
    );

    if (isConfirmed) {
      return false;
    }

    return user;
  }
}
