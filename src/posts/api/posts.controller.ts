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
  getPostById(@Param('id') postId: string) {
    return this.postsService.getPostById(postId);
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
