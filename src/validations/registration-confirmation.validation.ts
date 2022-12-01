import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraintInterface } from "class-validator";
import { EmailConfirmationRepository } from "../modules/users/infrastructure/emailConfirmation.repository";

@Injectable()
export class RegistrationConfirmationValidation implements ValidatorConstraintInterface {
  constructor(protected emailConfirmationRepository: EmailConfirmationRepository) {}

  async validate(code) {
    const emailConfirmation = await this.emailConfirmationRepository.getEmailConfirmationByCodeOrId(code)

    let noError = true;
    if (!emailConfirmation) {
      noError = false;
    } else if (emailConfirmation.isConfirmed === true) {
      noError = false;
    } else if (emailConfirmation!.expirationDate < new Date()) {
      noError = false;
    }

    return noError
  }

  defaultMessage(args: ValidationArguments) {
    return "Incorrect recovery code"
  }
}