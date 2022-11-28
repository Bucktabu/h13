import { IsEmail, IsString, Length } from 'class-validator';

export class UserInputModel {
  @IsString()
  @Length(3, 10)
  login: string;

  @IsString()
  @Length(6, 20)
  password: string;
  //password: string = 'dsadad
  @IsString()
  @IsEmail()
  email: string;
}
