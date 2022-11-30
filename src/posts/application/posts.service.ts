import { Injectable } from '@nestjs/common';
import { JwtService } from '../../auth/application/jwt.service';
import { LikesService } from '../../likes/application/likes.service';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import { LikesRepository } from '../../likes/infrastructure/likes.repository';
import { PostsRepository } from '../infrastructure/posts.repository';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { ContentPageModel } from '../../globalTypes/contentPage.model';
import { QueryInputModel } from '../../users/api/dto/queryInput.model';
import { PostDBModel } from '../infrastructure/entity/postDB.model';
import { PostDTO } from '../api/dto/postDTO';
import { PostViewModel } from '../api/dto/postsView.model';
import { paginationContentPage } from '../../helper.functions';
import { postOutputBeforeCreate } from '../../dataMapper/toPostViewModelBeforeCreate';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PostsService {
  constructor(
    protected jwtService: JwtService,
    protected likesService: LikesService,
    protected likesRepository: LikesRepository,
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository,
    protected usersRepository: UsersRepository,
  ) {}

  async getPosts(
    query: QueryInputModel,
    blogId: string,
    token?: string,
  ): Promise<ContentPageModel | null> {
    const postsDB = await this.postsRepository.getPosts(query, blogId);

    if (!postsDB) {
      return null;
    }

    const totalCount = await this.postsRepository.getTotalCount(blogId);
    const userId = await this.jwtService.getUserIdViaToken(token);
    const posts = await Promise.all(
      postsDB.map(async (p) => await this.addLikesInfoForPost(p, userId)),
    );

    return paginationContentPage(
      query.pageNumber,
      query.pageSize,
      posts,
      totalCount,
    );
  }

  async getPostById(
    postId: string,
    token?: string,
  ): Promise<PostViewModel | null> {
    const post = await this.postsRepository.getPostById(postId);

    if (!post) {
      return null;
    }
    console.log(token);
    const userId = await this.jwtService.getUserIdViaToken(token);
    console.log(userId);
    return await this.addLikesInfoForPost(post, userId);
  }

  async createPost(
    dto: PostDTO,
    blogId?: string,
  ): Promise<PostViewModel | null> {
    let id = dto.blogId;
    if (blogId) {
      id = blogId;
    }

    const newPost = new PostDBModel(
      uuidv4(),
      dto.title,
      dto.shortDescription,
      dto.content,
      id,
      await this.getBlogName(id),
      new Date().toISOString(),
    );

    const createdPost = await this.postsRepository.createPost(newPost);

    if (!createdPost) {
      return null;
    }

    return postOutputBeforeCreate(createdPost);
  }

  async getBlogName(blogId: string): Promise<string> {
    const blog = await this.blogsRepository.getBlogById(blogId);

    if (!blog) {
      return '';
    }

    return blog.name;
  }

  async updatePost(
    postId: string,
    dto: PostDTO,
  ): Promise<boolean> {
    return await this.postsRepository.updatePost(postId, dto);
  }

  async updateLikesInfo(
    userId: string,
    commentId: string,
    likeStatus: string,
  ): Promise<boolean> {
    const addedAt = new Date().toISOString();
    const login = await this.usersRepository.getUserByIdOrLoginOrEmail(userId);

    if (!login) {
      return false;
    }

    return await this.likesRepository.updateUserReaction(
      commentId,
      userId,
      likeStatus,
      addedAt,
      login.login,
    );
  }

  async deletePostById(postId: string): Promise<boolean> {
    return await this.postsRepository.deletePostById(postId);
  }

  private async addLikesInfoForPost(
    post: PostDBModel,
    userId: string | null,
  ): Promise<PostViewModel> {
    const result = await this.likesService.getReactionAndReactionCount(
      post.id,
      userId!,
    );
    const newestLikes = await this.likesRepository.getNewestLikes(post.id);

    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        myStatus: result.reaction,
        likesCount: result.likesCount,
        dislikesCount: result.dislikesCount,
        newestLikes: newestLikes!,
      },
    };
  }
}
