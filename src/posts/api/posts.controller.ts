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
} from '@nestjs/common';
import { QueryInputModel } from '../../users/api/dto/queryInput.model';
import { PostInputModel } from './dto/postInputModel';
import { PostsService } from '../application/posts.service';
import { CommentsService } from '../../comments/application/comments.service';

@Controller('posts')
export class PostsController {
  constructor(
    protected commentsService: CommentsService,
    protected postsService: PostsService,
  ) {}

  @Get()
  getPosts(
    @Query()
    query: QueryInputModel,
  ) {
    const blogId = '';
    return this.postsService.getPosts(query, blogId);
  }

  @Get(':id')
  async getPostById(@Param('id') postId: string) {
    const post = await this.postsService.getPostById(postId);

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  @Get(':id/comments')
  getCommentsByPostId(
    @Query() query: QueryInputModel,
    @Param('id') postId: string,
  ) {
    return this.commentsService.getComments(postId, query);
  }

  @Post()
  @HttpCode(201)
  createPost(@Body() inputModel: PostInputModel) {
    return this.postsService.createPost(inputModel);
  }

  @Post('/:id/comments')
  @HttpCode(201)
  async createComment(
    @Body('content') content: string,
    @Param('id') postId: string,
  ) {
    const post = await this.postsService.getPostById(postId);

    if (!post) {
      throw new NotFoundException();
    }

    return; //this.commentsService.createComment(postId, content, userId)
  }

  @Put(':id')
  @HttpCode(204)
  async updatePost(
    @Body() inputModel: PostInputModel,
    @Param('id') postId: string,
  ) {
    const result = await this.postsService.updatePost(postId, inputModel);

    if (!result) {
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async deletePostById(@Param('id') postId: string) {
    const result = await this.postsService.deletePostById(postId);

    if (!result) {
      throw new NotFoundException();
    }
  }
}
