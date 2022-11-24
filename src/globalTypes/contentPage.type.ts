import { BlogViewModel } from '../blogs/api/dto/blogView.model';
import { PostViewModel } from '../posts/api/dto/postsView.model';
import { UserViewModel } from '../users/api/dto/userView.model';
import { CommentViewModel } from '../comments/commentView.model';
import { PostDBModel } from '../posts/infrastructure/entity/postDB.model';

export class ContentPageModel {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items:
      | BlogViewModel[]
      | PostDBModel[] /*PostViewModel[]*/
      | UserViewModel[]
      | CommentViewModel[],
  ) {}
}
