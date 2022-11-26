import mongoose from "mongoose";
import { BanInfoModel } from "./banInfo.model";

const banInfoScheme = new mongoose.Schema<BanInfoModel>({
  id: { type: String, required: true },
  isBanned: { type: Boolean, required: true },
  banDate: { type: Date, required: true },
  banReason: { type: String, required: true },
});

export const BanInfoScheme = mongoose.model('banInfo', banInfoScheme);