import { Injectable } from '@nestjs/common';
import { CommentViewModel } from '../commentView.model';
import { CommentBDModel } from '../infrastructure/entity/commentDB.model';
import { JwtService } from '../../jwt/application/jwt.service';
import { LikesService } from '../../likes/application/likes.service';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { QueryInputModel } from '../../users/api/dto/queryInput.model';
import { ContentPageModel } from '../../globalTypes/contentPage.type';
import { paginationContentPage } from '../../helper.functions';

@Injectable()
export class CommentsService {
  constructor(
    protected likesService: LikesService,
    protected jwtService: JwtService,
    protected commentsRepository: CommentsRepository,
  ) {}

  async getComments(
    postId: string,
    query: QueryInputModel,
    token?: string,
  ): Promise<ContentPageModel | null> {
    const commentsDB = await this.commentsRepository.getComments(query, postId);
    const totalCount = await this.commentsRepository.getTotalCount(postId);
    const userId = await this.jwtService.getUserIdViaToken(token);
    const comments = await Promise.all(
      commentsDB.map(async (c) => await this.addLikesInfoForComment(c, userId)),
    );

    return paginationContentPage(
      query.pageNumber,
      query.pageSize,
      comments,
      totalCount,
    );
  }

  async getCommentById(
    commentId: string,
    token?: string,
  ): Promise<CommentViewModel | null> {
    const comment = await this.commentsRepository.getCommentById(commentId);

    if (!comment) {
      return null;
    }

    const userId = await this.jwtService.getUserIdViaToken(token);
    return await this.addLikesInfoForComment(comment, userId);
  }

  private async addLikesInfoForComment(
    comment: CommentBDModel,
    userId: string | null,
  ) {
    const result = await this.likesService.getReactionAndReactionCount(
      comment.id,
      userId!,
    );

    return {
      id: comment.id,
      content: comment.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      createdAt: comment.createdAt,
      likesInfo: {
        myStatus: result.reaction,
        likesCount: result.likesCount,
        dislikesCount: result.dislikesCount,
      },
    };
  }
}
