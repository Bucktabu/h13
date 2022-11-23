import { IsEmail, IsString, Length } from "class-validator";

export class BlogInputModel {
  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
  ) {}
}

export class BlogInputModel1 {
  @IsString()
  @Length(1, 15)
  name: string
  @IsString()
  @Length(1, 100)
  description: string
  @IsString()
  @IsEmail()
  websiteUrl: string
}