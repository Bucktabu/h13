import { Injectable } from "@nestjs/common";
import { EmailConfirmationScheme } from "./entity/emailConfirm.scheme";
import { EmailConfirmationModel } from "./entity/emailConfirmation.model";

@Injectable()
export class EmailConfirmationRepository {
  async createEmailConfirmation(emailConfirmation: EmailConfirmationModel) {
    try {
      await EmailConfirmationScheme.create(emailConfirmation);
      return emailConfirmation;
    } catch (e) {
      return null;
    }
  }
}
