import { BlogModel } from '../blogs/infrastructure/entity/blog.model';

export const toBlogViewModel = (blogDB: BlogModel) => {
  return {
    id: blogDB.id,
    name: blogDB.name,
    description: blogDB.description,
    websiteUrl: blogDB.websiteUrl,
    createdAt: blogDB.createdAt,
  };
};
