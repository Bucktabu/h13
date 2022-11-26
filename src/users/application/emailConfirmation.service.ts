import { EmailConfirmationRepository } from '../infrastructure/emailConfirmation.repository';

export class EmailConfirmationService {
  constructor(
    protected emailConfirmationRepository: EmailConfirmationRepository,
  ) {}

  async updateConfirmationInfo(id: string) {
    return this.emailConfirmationRepository.updateConfirmationInfo(id);
  }
}
