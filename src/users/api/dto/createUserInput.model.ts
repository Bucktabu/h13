import { IsEmail, Length, MaxLength, MinLength } from 'class-validator';

export class CreateUserInputModel {
  // @MinLength(3, {
  //   message: 'Login is too short',
  // })
  // @MaxLength(10, {
  //   message: 'Login is too long',
  // })
  @Length(3, 10)
  login: string;
  @Length(6, 20)
  password: string;
  @IsEmail()
  email: string;
}
