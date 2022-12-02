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
  UseGuards, UsePipes
} from "@nestjs/common";
import { AuthBasicGuard } from '../../../guards/auth.basic.guard';
import { AuthBearerGuard } from '../../../guards/auth.bearer.guard';
import { CommentsService } from '../../comments/application/comments.service';
import { PostsService } from '../application/posts.service';
import { CommentDTO } from '../../comments/api/dto/commentDTO';
import { PostWithBlogIdDTO } from './dto/postDTO';
import { Request } from 'express';
import { ReactionDto } from '../../../global-model/reaction.dto';
import { QueryParametersDTO } from '../../../global-model/query-parameters.dto';
import { BlogExistValidationPipe } from "../../../pipe/blog-exist-validation.pipe";

@Controller('posts')
export class PostsController {
  constructor(
    protected commentsService: CommentsService,
    protected postsService: PostsService,
  ) {}

  @Get()
  getPosts(@Query() query: QueryParametersDTO, @Req() req: Request) {
    const blogId = '';
    return this.postsService.getPosts(query, blogId, req.headers.authorization);
  }

  @Get(':id')
  async getPostById(@Param('id') postId: string, @Req() req: Request) {
    const post = await this.postsService.getPostById(
      postId,
      req.headers.authorization,
    );

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  @Get(':id/comments')
  getCommentsByPostId(
    @Query() query: QueryParametersDTO,
    @Param('id') postId: string,
    @Req() req: Request,
  ) {
    return this.commentsService.getComments(
      postId,
      query,
      req.headers.authorization,
    );
  }

  @Post()
  @HttpCode(201)
  @UseGuards(AuthBasicGuard)
  @UsePipes(BlogExistValidationPipe)
  async createPost(@Body() dto: PostWithBlogIdDTO) {
    return this.postsService.createPost(dto);
  }

  @Post('/:id/comments')
  @HttpCode(201)
  @UseGuards(AuthBearerGuard)
  async createComment(
    @Body() dto: CommentDTO,
    @Param('id') postId: string,
    @Req() req: Request,
  ) {

    const post = await this.postsService.getPostById(postId);

    if (!post) {
      throw new NotFoundException();
    }

    return this.commentsService.createComment(postId, dto.content, req.user);
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(AuthBasicGuard)
  async updatePost(
    @Body() dto: PostWithBlogIdDTO,
    @Param('id') postId: string,
  ) {
    const result = await this.postsService.updatePost(postId, dto);

    if (!result) {
      throw new NotFoundException();
    }

    return;
  }

  @Put(':id/like-status')
  @HttpCode(204)
  @UseGuards(AuthBearerGuard)
  async updateLikeStatus(
    @Body() dto: ReactionDto,
    @Param('id') commentId: string,
    @Req() req: Request,
  ) {
    const post = await this.postsService.getPostById(commentId);

    if (!post) {
      throw new NotFoundException();
    }

    await this.postsService.updateLikesInfo(
      req.user.id,
      commentId,
      dto.likeStatus,
    );

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
