import mongoose from "mongoose";
import { EmailConfirmationModel } from "./emailConfirmation.model";

const emailConfirmScheme = new mongoose.Schema<EmailConfirmationModel>({
  id: { type: String, required: true },
  confirmationCode: { type: String, required: true },
  expirationDate: { type: Date, required: true },
  isConfirmed: { type: Boolean, required: true },
});

export const EmailConfirmationScheme = mongoose.model(
  'emailConfirm',
  emailConfirmScheme,
);