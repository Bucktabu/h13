import { EmailConfirmationRepository } from "../infrastructure/emailConfirmation.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailConfirmationService {
  constructor(
    protected emailConfirmationRepository: EmailConfirmationRepository,
  ) {}

  async checkConfirmation(id: string): Promise<boolean> {
    return this.emailConfirmationRepository.checkConfirmation(id)
  }

  async updateConfirmationInfo(id: string) {
    return this.emailConfirmationRepository.updateConfirmationInfo(id);
  }
}