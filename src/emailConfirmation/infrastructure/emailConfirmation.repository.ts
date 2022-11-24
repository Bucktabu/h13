import { Injectable } from '@nestjs/common';
import { EmailConfirmationScheme } from './entity/emailConfirm.scheme';
import { EmailConfirmationModel } from './entity/emailConfirmation.model';

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

  async updateConfirmationCode(id: string, confirmationCode: string, newExpirationDate?: Date): Promise<boolean> {
    const result = await EmailConfirmationScheme
      .updateOne({id}, {$set: {confirmationCode}})

    return result.modifiedCount === 1
  }

  async giveEmailConfirmationByCodeOrId(codeOrId: string): Promise<EmailConfirmationModel | null> {
    return EmailConfirmationScheme
      .findOne({$or: [{confirmationCode: codeOrId}, {id: codeOrId}]},
        {_id: false, __v: false})
  }
}
