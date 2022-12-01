import { CommentBDModel } from '../modules/comments/infrastructure/entity/commentDB.model';
import { CommentViewModel } from '../modules/comments/api/dto/commentView.model';

export const commentOutputBeforeCreate = (
  comment: CommentBDModel,
): CommentViewModel => {
  return {
    id: comment.id,
    content: comment.content,
    userId: comment.userId,
    userLogin: comment.userLogin,
    createdAt: comment.createdAt,
    likesInfo: {
      myStatus: 'None',
      likesCount: 0,
      dislikesCount: 0,
    },
  };
};
