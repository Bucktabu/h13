import mongoose from "mongoose";
import { UserIpAddressModel } from "./ipAddress.model";

const ipAddressScheme = new mongoose.Schema<UserIpAddressModel>({
  ipAddress: {type: String, required: true},
  endpoint: {type: String, required: true},
  connectionAt: {type: Number, required: true}
})

export const IpAddressScheme = mongoose.model('ipAddress', ipAddressScheme)