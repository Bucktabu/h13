import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { paginationContentPage } from '../../helper.functions';
import { QueryInputModel } from '../../users/api/dto/queryInput.model';
import { ContentPageModel } from '../../globalTypes/contentPage.type';
import { BlogModel } from '../infrastructure/entity/blog.model';
import { BlogInputModel } from '../api/dto/blogInput.model';
import { v4 as uuidv4 } from 'uuid';
import { blogViewModel } from '../../dataMapper/blogViewModel';

@Injectable()
export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}

  async getBlogs(query: QueryInputModel): Promise<ContentPageModel | null> {
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

  async createBlog(inputModel: BlogInputModel): Promise<BlogModel | null> {
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

    return blogViewModel(createdBlog);
  }

  async updateBlog(
    blogId: string,
    inputModel: BlogInputModel,
  ): Promise<boolean> {
    return await this.blogsRepository.updateBlog(blogId, inputModel);
  }

  async deleteBlogById(blogId: string): Promise<boolean> {
    return await this.blogsRepository.deleteBlogById(blogId);
  }
}
