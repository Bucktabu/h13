import { Module } from '@nestjs/common';
import { UsersController } from './users/api/users.controller';
import { UsersService } from './users/application/users.service';
import { UsersRepository } from './users/infrastructure/users.repository';
import { EmailConfirmationRepository } from "./emailConfirmation/infrastructure/emailConfirmation.repository";
import { EmailAdapters } from "./emailTransfer/email.adapter";
import { EmailManager } from "./emailTransfer/email.manager";

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [EmailAdapters, EmailManager, EmailConfirmationRepository,UsersService, UsersRepository],
})
export class AppModule {}
