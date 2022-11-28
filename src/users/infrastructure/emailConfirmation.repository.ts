import { Injectable } from '@nestjs/common';
import { EmailConfirmationScheme } from './entity/emailConfirm.scheme';
import { EmailConfirmationModel } from './entity/emailConfirmation.model';

@Injectable()
export class EmailConfirmationRepository {
  async getEmailConfirmationByCodeOrId(
    codeOrId: string,
  ): Promise<EmailConfirmationModel | null> {
    return EmailConfirmationScheme.findOne(
      { $or: [{ confirmationCode: codeOrId }, { id: codeOrId }] },
      { _id: false, __v: false },
    );
  }

  async createEmailConfirmation(emailConfirmation: EmailConfirmationModel) {
    try {
      await EmailConfirmationScheme.create(emailConfirmation);
      return emailConfirmation;
    } catch (e) {
      return null;
    }
  }

  async updateConfirmationCode(
    id: string,
    confirmationCode: string,
    expirationDate?: Date,
  ): Promise<boolean> {
    console.log(confirmationCode, expirationDate);
    const result = await EmailConfirmationScheme.updateOne(
      { id },
      { $set: { confirmationCode, expirationDate } },
    );

    return result.modifiedCount === 1;
  }

  async updateConfirmationInfo(id: string) {
    const result = await EmailConfirmationScheme.updateOne(
      { id },
      { $set: { isConfirmed: true } },
    );

    return result.modifiedCount === 1;
  }

  async deleteEmailConfirmationById(id: string): Promise<boolean> {
    const result = await EmailConfirmationScheme.deleteOne({ id });

    return result.deletedCount === 1;
  }
}
