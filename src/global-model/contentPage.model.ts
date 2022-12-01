import { BlogViewModel } from '../modules/blogs/api/dto/blogView.model';
import { PostViewModel } from '../modules/posts/api/dto/postsView.model';
import { UserViewModel } from '../modules/users/api/dto/userView.model';
import { CommentViewModel } from '../modules/comments/api/dto/commentView.model';

export class ContentPageModel {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items:
      | BlogViewModel[]
      | PostViewModel[]
      | UserViewModel[]
      | CommentViewModel[],
  ) {}
}
