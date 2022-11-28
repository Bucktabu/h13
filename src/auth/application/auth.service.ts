import { v4 as uuidv4 } from 'uuid';
import { EmailConfirmationRepository } from '../../users/infrastructure/emailConfirmation.repository';
import { EmailManager } from '../../emailTransfer/email.manager';
import add from 'date-fns/add';

export class AuthService {
  constructor(
    protected emailConfirmationRepository: EmailConfirmationRepository,
    protected emailsManager: EmailManager,
  ) {}

  async sendPasswordRecovery(userId: string, email: string): Promise<boolean> {
    const newRecoveryCode = uuidv4();
    const result =
      await this.emailConfirmationRepository.updateConfirmationCode(
        userId,
        newRecoveryCode,
      );

    if (!result) {
      return false;
    }

    await this.emailsManager.sendPasswordRecoveryEmail(email, newRecoveryCode);
    return true;
  }

  async updateConfirmationCode(userId: string): Promise<boolean> {
    const newConfirmationCode = uuidv4();
    const newExpirationDate = add(new Date(), { hours: 24 });
    console.log('userId:', userId, typeof userId);
    console.log('newConfirmationCode:', newConfirmationCode, typeof newConfirmationCode);
    console.log('newExpirationDate:', newExpirationDate, typeof newExpirationDate);
    const result =
      await this.emailConfirmationRepository.updateConfirmationCode(
        userId,
        newConfirmationCode,
        newExpirationDate,
      ); // TODO не проваливается в эту функцию
    console.log('4');
    if (!result) {
      return false;
    }

    const emailConfirmation =
      await this.emailConfirmationRepository.getEmailConfirmationByCodeOrId(
        userId,
      );
    console.log('5');
    if (!emailConfirmation) {
      return false;
    }

    return true;
  }
}
