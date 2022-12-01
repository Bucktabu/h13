import { Injectable } from "@nestjs/common";
import { BlogsRepository } from "../modules/blogs/infrastructure/blogs.repository";
import { ValidationArguments, ValidatorConstraintInterface } from "class-validator";

@Injectable()
export class BlogExistValidation implements ValidatorConstraintInterface {
  constructor(protected blogsRepository: BlogsRepository) {}

  async validate(blogId: string) {
    if (blogId) {
      return false
    }

    const blog = await this.blogsRepository.getBlogById(blogId)

    if (!blog) {
      return false
    }

    return true
  }

  defaultMessage(args: ValidationArguments) {
    return "Blog doesn't exist";
  }
}