import { Injectable } from '@nestjs/common';
import { CommentBDModel } from './entity/commentDB.model';
import { CommentsSchema } from './entity/comments.scheme';
import { QueryInputModel } from '../../users/api/dto/queryInput.model';
import { giveSkipNumber } from '../../helper.functions';

@Injectable()
export class CommentsRepository {
  async getComments(
    query: QueryInputModel,
    postId: string,
  ): Promise<CommentBDModel[]> {
    return CommentsSchema.find(
      { postId },
      { _id: false, postId: false, __v: false },
    )
      .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
      .skip(giveSkipNumber(query.pageNumber, query.pageSize))
      .limit(Number(query.pageSize))
      .lean();
  }

  async getTotalCount(postId: string): Promise<number> {
    return CommentsSchema.countDocuments({ postId });
  }

  async getCommentById(commentId: string): Promise<CommentBDModel | null> {
    const comment = await CommentsSchema.findOne(
      { id: commentId },
      { projection: { _id: false, postId: false, __v: false } },
    );

    if (!comment) {
      return null;
    }

    return comment;
  }
}
