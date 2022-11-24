import { Injectable } from '@nestjs/common';
import { PostDBModel } from './entity/postDB.model';
import { QueryInputModel } from '../../users/api/dto/queryInput.model';
import { giveSkipNumber } from '../../helper.functions';
import { PostsScheme } from './entity/posts.scheme';
import { PostInputModel } from '../api/dto/postInputModel';

@Injectable()
export class PostsRepository {
  async getPosts(
    query: QueryInputModel,
    blogId: string | undefined,
  ): Promise<PostDBModel[]> {
    return PostsScheme.find({ blogId: { $regex: blogId } }, { _id: false, __v: false })
      .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
      .skip(giveSkipNumber(query.pageNumber, query.pageSize))
      .limit(Number(query.pageSize))
      .lean();
  }

  async getTotalCount(blogId: string | undefined): Promise<number> {
    return PostsScheme.countDocuments({ blogId: { $regex: blogId } });
  }

  async getPostById(postId: string): Promise<PostDBModel | null> {
    return PostsScheme.findOne({ id: postId }, { _id: false , __v: false});
  }

  async createPost(newPost: PostDBModel): Promise<PostDBModel | null> {
    try {
      await PostsScheme.create(newPost);
      return newPost;
    } catch (e) {
      return null;
    }
  }

  async updatePost(
    postId: string,
    inputModel: PostInputModel,
  ): Promise<boolean> {
    const result = await PostsScheme.updateOne(
      { id: postId },
      {
        $set: {
          title: inputModel.title,
          shortDescription: inputModel.shortDescription,
          content: inputModel.content,
          blogId: inputModel.blogId,
        },
      },
    );

    return result.matchedCount === 1;
  }

  async deletePostById(postId: string): Promise<boolean> {
    const result = await PostsScheme.deleteOne({ id: postId });

    return result.deletedCount === 1;
  }
}