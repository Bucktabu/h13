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
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthBasicGuard } from '../../guard/auth.basic.guard';
import { AuthBearerGuard } from '../../guard/auth.bearer.guard';
import { CommentsService } from '../../comments/application/comments.service';
import { PostsService } from '../application/posts.service';
import { CommentInputModel } from '../../comments/api/dto/commentInput.model';
import { QueryInputModel } from '../../users/api/dto/queryInput.model';
import { PostInputModel } from './dto/postInputModel';
import { UserDBModel } from '../../users/infrastructure/entity/userDB.model';

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
  @UseGuards(AuthBasicGuard)
  createPost(@Body() inputModel: PostInputModel) {
    return this.postsService.createPost(inputModel);
  }

  @Post('/:id/comments')
  @HttpCode(201)
  @UseGuards(AuthBearerGuard)
  async createComment(
    @Body('content') content: CommentInputModel,
    @Param('id') postId: string,
    @Req() user: UserDBModel,
  ) {
    const post = await this.postsService.getPostById(postId);

    if (!post) {
      throw new NotFoundException();
    }

    return this.commentsService.createComment(postId, content.toString(), user);
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(AuthBasicGuard)
  async updatePost(
    @Body() inputModel: PostInputModel,
    @Param('id') postId: string,
  ) {
    const result = await this.postsService.updatePost(postId, inputModel);

    if (!result) {
      throw new NotFoundException();
    }

    return;
  }

  @Put(':id/like-status')
  @HttpCode(204)
  @UseGuards(AuthBearerGuard)
  async updateLikeStatus(
    @Body('likeStatus') likeStatus: string,
    @Param('id') commentId: string,
    @Req() user: UserDBModel,
  ) {
    const post = await this.postsService.getPostById(commentId);

    if (!post) {
      throw new NotFoundException();
    }

    await this.postsService.updateLikesInfo(user.id, commentId, likeStatus);

    return;
  }

  @Delete(':id')
  @UseGuards(AuthBasicGuard)
  @HttpCode(204)
  async deletePostById(@Param('id') postId: string) {
    const result = await this.postsService.deletePostById(postId);

    if (!result) {
      throw new NotFoundException();
    }

    return;
  }
}
