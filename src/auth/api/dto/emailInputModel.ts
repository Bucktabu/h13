import { IsEmail, IsString } from 'class-validator';

export class EmailInputModel {
  @IsString()
  @IsEmail()
  email: string;
}
