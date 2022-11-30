import { IsEmail, IsString, Length, MinLength } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";

export class UserDTO {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(3, 10)
  login: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(6, 20)
  password: string;

  @IsEmail()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(3)
  email: string;
}
