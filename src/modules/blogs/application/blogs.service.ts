import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { BlogDTO } from '../api/dto/blogDTO';
import { BlogModel } from '../infrastructure/entity/blog.model';
import { ContentPageModel } from '../../../global-model/contentPage.model';
import { QueryInputModel } from '../../users/api/dto/queryInput.model';
import { toBlogViewModel } from '../../../data-mapper/to-blog-view.model';
import { paginationContentPage } from '../../../helper.functions';
import { v4 as uuidv4 } from 'uuid';
import { QueryParametersDTO } from '../../../global-model/query-parameters.dto';

@Injectable()
export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}

  async getBlogs(query: QueryParametersDTO): Promise<ContentPageModel | null> {
    const blogs = await this.blogsRepository.getBlogs(query);

    if (!blogs) {
      return null;
    }

    const totalCount = await this.blogsRepository.getTotalCount(
      query.searchNameTerm,
    );

    return paginationContentPage(
      query.pageNumber,
      query.pageSize,
      blogs,
      totalCount,
    );
  }

  async getBlogById(blogId: string): Promise<BlogModel | null> {
    return await this.blogsRepository.getBlogById(blogId);
  }

  async createBlog(inputModel: BlogDTO): Promise<BlogModel | null> {
    const newBlog = new BlogModel(
      uuidv4(),
      inputModel.name,
      inputModel.description,
      inputModel.websiteUrl,
      new Date().toISOString(),
    );

    const createdBlog = await this.blogsRepository.createBlog(newBlog);

    if (!createdBlog) {
      return null;
    }

    return toBlogViewModel(createdBlog);
  }

  async updateBlog(blogId: string, inputModel: BlogDTO): Promise<boolean> {
    return await this.blogsRepository.updateBlog(blogId, inputModel);
  }

  async deleteBlogById(blogId: string): Promise<boolean> {
    return await this.blogsRepository.deleteBlogById(blogId);
  }
}
