import { Injectable, PipeTransform } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraintInterface } from "class-validator";
import { UsersRepository } from "../modules/users/infrastructure/users.repository";

@Injectable()
export class RegistrationEmailResendingValidation implements ValidatorConstraintInterface {
  constructor(protected usersRepository: UsersRepository) {}

  async validate(email): Promise<any> {
    const user = this.usersRepository.getUserByIdOrLoginOrEmail(email)

    if (!user) {
      return false
    }

    return true
  }

  defaultMessage(args: ValidationArguments) {
    return "Incorrect email";
  }
}

@Injectable()
export class RegistrationEmailResendingValidationPipe implements PipeTransform {
  constructor(protected usersRepository: UsersRepository) {}

  async transform(email, metadata) {
    const user = this.usersRepository.getUserByIdOrLoginOrEmail(email)

    if (!user) {
      return false
    }

    return user
  }

}