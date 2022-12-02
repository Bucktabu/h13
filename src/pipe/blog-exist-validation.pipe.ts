import { BadRequestException, Injectable } from "@nestjs/common";
import { BlogsRepository } from '../modules/blogs/infrastructure/blogs.repository';
import {ValidationArguments,
        ValidatorConstraintInterface} from 'class-validator';

@Injectable()
export class BlogExistValidationPipe implements ValidatorConstraintInterface {
  constructor(protected blogsRepository: BlogsRepository) {}

  async validate(blogId: string) {
    console.log('BlogExistValidationPipe');
    if (!blogId) {
      throw new BadRequestException();
    }

    const blog = await this.blogsRepository.getBlogById(blogId);

    if (!blog) {
      throw new BadRequestException();
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return "Blog doesn't exist";
  }
}
