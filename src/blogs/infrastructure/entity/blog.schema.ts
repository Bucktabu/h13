import mongoose from 'mongoose';
import { BlogModel } from './blog.model';

const blogScheme = new mongoose.Schema<BlogModel>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: String, required: true },
});

export const BlogSchema = mongoose.model('blogs', blogScheme);
