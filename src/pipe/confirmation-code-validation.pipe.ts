import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { EmailConfirmationRepository } from '../modules/users/infrastructure/emailConfirmation.repository';

@Injectable()
export class ConfirmationCodeValidationPipe implements PipeTransform {
  constructor(
    protected emailConfirmationRepository: EmailConfirmationRepository,
  ) {}

  async transform(dto, metadata) {
    const code = dto.code;
    const emailConfirmation =
      await this.emailConfirmationRepository.getEmailConfirmationByCodeOrId(
        code,
      );

    if (!emailConfirmation) {
      return false;
    }

    if (emailConfirmation.isConfirmed === true) {
      return false;
    }

    if (emailConfirmation.expirationDate < new Date()) {
      return false;
    }

    return emailConfirmation;
  }
}
