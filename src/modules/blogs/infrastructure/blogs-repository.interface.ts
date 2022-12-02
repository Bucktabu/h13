import { QueryParametersDTO } from "../../../global-model/query-parameters.dto";
import { BlogModel } from "./entity/blog.model";
import { BlogDTO } from "../api/dto/blogDTO";

export interface IBlogsRepository {
  getBlogs(query: QueryParametersDTO): Promise<BlogModel[]>
  getTotalCount(searchNameTerm: string): Promise<number>
  getBlogById(id: string): Promise<BlogModel | null>
  createBlog(newBlog: BlogModel): Promise<BlogModel | null>
  updateBlog(blogId: string, inputModel: BlogDTO): Promise<boolean>
  deleteBlogById(blogId: string): Promise<boolean>
}

export const IBlogsRepository = 'IBlogsRepository'