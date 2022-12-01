import { IsEmail, Validate } from "class-validator";
import { RegistrationEmailResendingValidation } from "../../../../validations/registration-email-resending.validation";

export class RegistrationEmailResendingDto {
  @IsEmail()
  @Validate(RegistrationEmailResendingValidation)
  email: string
}