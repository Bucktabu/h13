import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { PostsService } from '../../posts/application/posts.service';
import { AuthBasicGuard } from '../../guard/auth.basic.guard';
import { BlogDTO } from './dto/blogDTO';
import { BlogViewModel } from './dto/blogView.model';
import { QueryInputModel } from '../../users/api/dto/queryInput.model';
import { PostDTO } from '../../posts/api/dto/postDTO';

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
  async getPostsByBlogId(
    @Query() query: QueryInputModel,
    @Param('id') blogId: string,
  ) {
    const post = await this.blogsService.getBlogById(blogId);

    if (!post) {
      throw new NotFoundException();
    }

    return this.postsService.getPosts(query, blogId);
  }

  @Post()
  @HttpCode(201)
  @UseGuards(AuthBasicGuard)
  createBlog(@Body() inputModel: BlogDTO): Promise<BlogViewModel> {
    return this.blogsService.createBlog(inputModel);
  }

  @Post(':id/posts')
  @HttpCode(201)
  @UseGuards(AuthBasicGuard)
  async createPostByBlogId(
    @Body() inputModel: PostDTO,
    @Param('id') blogId: string,
  ) {
    const blog = await this.blogsService.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException();
    }

    const createdPost = await this.postsService.createPost(inputModel, blog.id);

    return createdPost;
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(AuthBasicGuard)
  async updateBlog(
    @Body() inputModel: BlogDTO,
    @Param('id') blogId: string,
  ) {
    const result = await this.blogsService.updateBlog(blogId, inputModel);

    if (!result) {
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthBasicGuard)
  async deleteBlogById(@Param('id') blogId: string) {
    const result = await this.blogsService.deleteBlogById(blogId);

    if (!result) {
      throw new NotFoundException();
    }
  }
}
