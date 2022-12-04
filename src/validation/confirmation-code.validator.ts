import { Injectable, PipeTransform } from '@nestjs/common';
import { EmailConfirmationRepository } from '../modules/users/infrastructure/emailConfirmation.repository';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'ConfirmationCodeValid', async: true })
@Injectable()
export class ConfirmationCodeValidator implements ValidatorConstraintInterface {
  constructor(
    protected emailConfirmationRepository: EmailConfirmationRepository,
  ) {}

  async validate(code: string) {
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

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return "Confirmation code is not valid";
  }
}
