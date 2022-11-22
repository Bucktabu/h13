const bcrypt = require('bcrypt')
import { UserViewModel } from './users/api/dto/userView.model';
import { BlogViewModel } from './blogs/blogView.model';
import { PostViewModel } from './posts/postsView.model';
import { CommentViewModel } from './comments/commentView.model';

export const giveSkipNumber = (pageNumber: string, pageSize: string) => {
  return (Number(pageNumber) - 1) * Number(pageSize);
};

export const givePagesCount = (totalCount: number, pageSize: string) => {
  return Math.ceil(totalCount / Number(pageSize));
};

export const _generateHash = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};
export const paginationContentPage = (
  pageNumber: string,
  pageSize: string,
  content:
    | BlogViewModel[]
    | PostViewModel[]
    | UserViewModel[]
    | CommentViewModel[],
  totalCount: number,
) => {
  return {
    pagesCount: givePagesCount(totalCount, pageSize),
    page: Number(pageNumber),
    pageSize: Number(pageSize),
    totalCount: totalCount,
    items: content,
  };
};
