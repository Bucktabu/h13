import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraintInterface } from "class-validator";
import { UsersRepository } from "../modules/users/infrastructure/users.repository";

@Injectable()
export class RegistrationEmailResendingValidation implements ValidatorConstraintInterface {
  constructor(protected usersRepository: UsersRepository) {}

  async validate(email) {
    const user = this.usersRepository.getUserByIdOrLoginOrEmail(email)

    if (!user) {
      return false
    }
    // TODO можно ли отсюда достать пользователя
    return true
  }

  defaultMessage(args: ValidationArguments) {
    return "Incorrect email";
  }
}