import { PostDBModel } from '../posts/infrastructure/entity/postDB.model';

export const postOutputBeforeCreate = (postsBD: PostDBModel) => {
  return {
    id: postsBD.id,
    title: postsBD.title,
    shortDescription: postsBD.shortDescription,
    content: postsBD.content,
    blogId: postsBD.blogId,
    blogName: postsBD.blogName,
    createdAt: postsBD.createdAt,
    // extendedLikesInfo: {
    //   myStatus: 'None',
    //   likesCount: 0,
    //   dislikesCount: 0,
    //   newestLikes: [],
    // }, // TODO тесты расходятся со свагером?
  };
};
