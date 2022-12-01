import { IsString, Length, Validate } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";
import { Optional } from "@nestjs/common";
import { BlogExistValidation } from "../../../../validations/blogExist.validation";

export class PostDTO {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(3, 30)
  title: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(3, 100)
  shortDescription: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(3, 1000)
  content: string;
}

export class PostWithBlogIdDTO {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(3, 30)
  title: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(3, 100)
  shortDescription: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(3, 1000)
  content: string;

  @Optional()
  @Validate(BlogExistValidation)
  blogId: string;
}