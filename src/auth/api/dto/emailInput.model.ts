import { IsEmail, IsString } from 'class-validator';

export class emailInputModel {
  @IsString()
  @IsEmail()
  email: string;
}
