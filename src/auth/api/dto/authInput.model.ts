import { IsString } from 'class-validator';

export class AuthInputModel {
  @IsString()
  loginOrEmail: string;

  @IsString()
  password: string;
}
