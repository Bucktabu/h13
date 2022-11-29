import { IsString, IsUrl, Length } from 'class-validator';
import { trim } from "../../../helper.functions";
import { Transform, TransformFnParams } from "class-transformer";

export class BlogInputModel {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(3, 15)
  name: string;

  @IsString()
  //@Transform((value) => trim(value.toString()))
  @Length(3, 500)
  description: string;

  @IsString()
  //@Transform((value) => trim(value.toString()))
  @Length(3, 100)
  @IsUrl()
  websiteUrl: string;
} // TODO transform trouble
