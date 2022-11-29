import { IsEmail, IsString } from "class-validator";

export class EmailInputModel {
// ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
  @IsEmail()
  email: string;
}
