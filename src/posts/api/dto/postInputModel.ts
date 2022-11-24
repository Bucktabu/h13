import { IsString, Length } from 'class-validator';

export class PostInputModel {
  @IsString()
  @Length(3, 30)
  title: string;

  @IsString()
  @Length(3, 100)
  shortDescription: string;

  @IsString()
  @Length(3, 1000)
  content: string;
  blogId: string;
}
