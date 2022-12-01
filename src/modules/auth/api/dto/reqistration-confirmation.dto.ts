import { Validate } from "class-validator";
import { RegistrationConfirmationValidation } from "../../../../validations/registration-confirmation.validation";

export class RegistrationConfirmationDTO {
  @Validate(RegistrationConfirmationValidation)
  code: string
}