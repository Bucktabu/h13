import mongoose from 'mongoose';
import { UserDBModel } from './userDB.model';

const usersScheme = new mongoose.Schema<UserDBModel>({
  id: { type: String, required: true },
  login: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  passwordSalt: { type: String, required: true },
  createdAt: { type: String, required: true },
});

export const UserScheme = mongoose.model('users', usersScheme);
