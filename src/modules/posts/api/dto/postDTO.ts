import { IsNotEmpty, IsString, IsUUID, Length, Validate } from "class-validator";
import { Transform, TransformFnParams } from 'class-transformer';
import { Optional } from '@nestjs/common';
import { BlogExistValidationPipe } from '../../../../pipe/blog-exist-validation.pipe';

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

  @IsNotEmpty()
  @IsUUID()
  @Validate(BlogExistValidationPipe)
  blogId: string;
}
