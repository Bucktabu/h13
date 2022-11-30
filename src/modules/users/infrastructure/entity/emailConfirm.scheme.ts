import mongoose from 'mongoose';
import { EmailConfirmationModel } from './emailConfirmation.model';

const emailConfirmationScheme = new mongoose.Schema<EmailConfirmationModel>({
  id: { type: String, required: true },
  confirmationCode: { type: String, required: true },
  expirationDate: { type: Date, required: true },
  isConfirmed: { type: Boolean, required: true, default: false},
});

export const EmailConfirmationScheme = mongoose.model(
  'emailConfirmation',
  emailConfirmationScheme,
);
