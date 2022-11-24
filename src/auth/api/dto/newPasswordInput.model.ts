import { IsString, Length } from "class-validator";

export class NewPasswordInputModel {
  @IsString()
  @Length(3, 10)
  newPassword: string;

  @IsString()
  recoveryCode: string;

  userId: string
}