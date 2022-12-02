import { Injectable } from '@nestjs/common';
import { BlogSchema } from './entity/blog.schema';
import { BlogDTO } from '../api/dto/blogDTO';
import { QueryParametersDTO } from '../../../global-model/query-parameters.dto';
import { BlogModel } from './entity/blog.model';
import { giveSkipNumber } from '../../../helper.functions';
import { IBlogsRepository } from "./blogs-repository.interface";

@Injectable()
export class BlogsRepository implements IBlogsRepository{
  async getBlogs(query: QueryParametersDTO): Promise<BlogModel[]> {
    return BlogSchema.find(
      { name: { $regex: query.searchNameTerm, $options: 'i' } },
      { _id: false, __v: false },
    )
      .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
      .skip(giveSkipNumber(query.pageNumber, query.pageSize))
      .limit(query.pageSize)
      .lean();
  }

  async getTotalCount(searchNameTerm: string): Promise<number> {
    return BlogSchema.countDocuments({
      name: { $regex: searchNameTerm, $options: 'i' },
    });
  }

  async getBlogById(id: string): Promise<BlogModel | null> {
    return BlogSchema.findOne({ id: id }, { _id: false, __v: false });
  }

  async createBlog(newBlog: BlogModel): Promise<BlogModel | null> {
    try {
      await BlogSchema.create(newBlog);
      return newBlog;
    } catch (e) {
      return null;
    }
  }

  async updateBlog(blogId: string, inputModel: BlogDTO): Promise<boolean> {
    const result = await BlogSchema.updateOne(
      { id: blogId },
      {
        $set: {
          name: inputModel.name,
          description: inputModel.description,
          websiteUrl: inputModel.websiteUrl,
        },
      },
    );

    return result.matchedCount === 1;
  }

  async deleteBlogById(blogId: string): Promise<boolean> {
    const result = await BlogSchema.deleteOne({ id: blogId });

    return result.deletedCount === 1;
  }
}
