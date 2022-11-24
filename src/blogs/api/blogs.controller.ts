import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Injectable,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { QueryInputModel } from '../../users/api/dto/queryInput.model';
import { PostsService } from '../../posts/application/posts.service';
import { BlogInputModel } from './dto/blogInput.model';
import { BlogViewModel } from './dto/blogView.model';
import { PostInputModel } from '../../posts/api/dto/postInputModel';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsService: BlogsService,
    protected postsService: PostsService,
  ) {}

  @Get()
  getBlogs(
    @Query()
    query: QueryInputModel,
  ) {
    return this.blogsService.getBlogs(query);
  }

  @Get(':id')
  async getBlogById(@Param('id') blogId: string) {
    const blog = await this.blogsService.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException();
    }

    return blog;
  }

  @Get(':id/posts')
  async getPostsPageByBlogId(
    @Query() query: QueryInputModel,
    @Param('id') blogId: string,
  ) {
    return this.postsService.getPosts(query, blogId);
  }

  @Post()
  @HttpCode(201)
  createBlog(@Body() inputModel: BlogInputModel): Promise<BlogViewModel> {
    return this.blogsService.createBlog(inputModel);
  }

  @Post(':id/posts')
  @HttpCode(201)
  async createPostByBlogId(
    @Body() inputModel: PostInputModel,
    @Param('id') blogId: string,
  ) {
    const blog = await this.blogsService.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException();
    }

    const createdPost =  await this.postsService.createPost(inputModel, blog.id);

    return createdPost
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlog(
    @Body() inputModel: BlogInputModel,
    @Param('id') blogId: string,
  ) {
    const result = await this.blogsService.updateBlog(blogId, inputModel);

    if (!result) {
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBlogById(@Param('id') blogId: string) {
    const result = await this.blogsService.deleteBlogById(blogId);

    if (!result) {
      throw new NotFoundException();
    }
  }
}
