import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { BlogsRepository } from "../blogs/infrastructure/blogs.repository";

@Injectable()
export class BlogExistValidation implements NestMiddleware {
  constructor(protected blogsRepository: BlogsRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.body.blogId) {
      return res
        .status(400)
        .send({message: 'Incorrect blog id', field: "blogId"})
    }

    const blog = await this.blogsRepository.getBlogById(req.body.blogId)

    if (!blog) {
      return res
        .status(400)
        .send({message: 'Incorrect blog id', field: "blogId"})
    }

    next()
  }
}