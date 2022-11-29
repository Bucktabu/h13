import { EmailConfirmationRepository } from "../infrastructure/emailConfirmation.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailConfirmationService {
  constructor(
    protected emailConfirmationRepository: EmailConfirmationRepository,
  ) {}

  async checkConfirmation(id: string): Promise<boolean> {
    const result = await this.emailConfirmationRepository.checkConfirmation(id)

    if (result.isConfirmed === true) {
      return true
    }

    return false
  }

  async updateConfirmationInfo(id: string) {
    return this.emailConfirmationRepository.updateConfirmationInfo(id);
  }
}