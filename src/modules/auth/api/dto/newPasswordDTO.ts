import { IsString, Length, Validate } from "class-validator";
import { ConfirmationCodeValidationPipe } from "../../../../pipe/confirmation-code-validation.pipe";

export class NewPasswordDTO {
  @IsString()
  @Length(6, 20)
  newPassword: string;

  @IsString()
  @Validate(ConfirmationCodeValidationPipe)
  recoveryCode: string;
}
