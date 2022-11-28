import { EmailConfirmationRepository } from "../infrastructure/emailConfirmation.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailConfirmationService {
  constructor(
    protected emailConfirmationRepository: EmailConfirmationRepository,
  ) {}

  async updateConfirmationInfo(id: string) {
    return this.emailConfirmationRepository.updateConfirmationInfo(id);
  }
}