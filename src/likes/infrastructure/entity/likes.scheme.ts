import mongoose from 'mongoose';
import { LikesModel } from './likes.model';

const likesScheme = new mongoose.Schema<LikesModel>({
  parentId: { type: String, required: true },
  userId: { type: String, required: true },
  status: { type: String, required: true },
  addedAt: { type: String, required: true },
  login: { type: String, required: true },
});

export const LikesScheme = mongoose.model('likes', likesScheme);
