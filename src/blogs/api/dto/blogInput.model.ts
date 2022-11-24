import { IsEmail, IsString, Length } from 'class-validator';

export class BlogInputModel {
  @IsString()
  @Length(3, 15)
  name: string;

  @IsString()
  @Length(3, 500)
  description: string;

  @IsString()
  @Length(3, 100)
  @IsEmail()
  websiteUrl: string;
}
