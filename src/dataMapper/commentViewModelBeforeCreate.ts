import { CommentBDModel } from "../comments/infrastructure/entity/commentDB.model";
import { CommentViewModel } from "../comments/api/dto/commentView.model";

export const commentOutputBeforeCreate = (comment: CommentBDModel): CommentViewModel => {
  return {
    id: comment.id,
    content: comment.content,
    userId: comment.userId,
    userLogin: comment.userLogin,
    createdAt: comment.createdAt,
    likesInfo: {
      myStatus: 'None',
      likesCount: 0,
      dislikesCount: 0
    }
  }
}