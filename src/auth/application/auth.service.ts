import {v4 as uuidv4} from "uuid";
import { EmailConfirmationRepository } from "../../emailConfirmation/infrastructure/emailConfirmation.repository";
import { EmailManager } from "../../emailTransfer/email.manager";
import add from "date-fns/add";

export class AuthService {
  constructor(protected emailConfirmationRepository: EmailConfirmationRepository,
              protected emailsManager: EmailManager) {}

  async sendPasswordRecovery(userId: string, email: string): Promise<boolean> {
    const newRecoveryCode = uuidv4()
    const result = await this.emailConfirmationRepository.updateConfirmationCode(userId, newRecoveryCode)

    if (!result) {
      return false
    }

    await this.emailsManager.sendPasswordRecoveryEmail(email, newRecoveryCode)
    return true
  }

  async updateConfirmationCode(userId: string): Promise<boolean> {
    const newConfirmationCode = uuidv4()
    const newExpirationDate = add(new Date(), {hours: 24})
    const result = await this.emailConfirmationRepository.updateConfirmationCode(userId, newConfirmationCode, newExpirationDate)

    if (!result) {
      return false
    }

    const emailConfirmation = await this.emailConfirmationRepository.giveEmailConfirmationByCodeOrId(userId)

    if (!emailConfirmation) {
      return false
    }

    return true
  }
}