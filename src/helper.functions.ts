const bcrypt = require('bcrypt');
import { BlogViewModel } from './modules/blogs/api/dto/blogView.model';
import { CommentViewModel } from './modules/comments/api/dto/commentView.model';
import { PostViewModel } from './modules/posts/api/dto/postsView.model';
import {
  UserViewModel,
  UserViewModelWithBanInfo,
} from './modules/users/api/dto/userView.model';

export const giveSkipNumber = (pageNumber: number, pageSize: number) => {
  return (pageNumber - 1) * pageSize;
};

export const givePagesCount = (totalCount: number, pageSize: number) => {
  return Math.ceil(totalCount / pageSize);
};

export const _generateHash = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const paginationContentPage = (
  pageNumber: number,
  pageSize: number,
  content:
    | BlogViewModel[]
    | PostViewModel[]
    | UserViewModelWithBanInfo[]
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
