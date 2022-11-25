import { UsersRepository } from '../infrastructure/users.repository';
import { _generateHash, paginationContentPage } from '../../helper.functions';
import { v4 as uuidv4 } from 'uuid';
import { EmailConfirmationRepository } from '../../emailConfirmation/infrastructure/emailConfirmation.repository';
import { EmailManager } from '../../emailTransfer/email.manager';
import { Injectable } from '@nestjs/common';
import { UserDBModel } from '../infrastructure/entity/userDB.model';
import { EmailConfirmationModel } from '../../emailConfirmation/infrastructure/entity/emailConfirmation.model';
import { UserAccountModel } from '../infrastructure/entity/userAccount.model';
import { UserInputModel } from '../api/dto/userInputModel';
import bcrypt from 'bcrypt';
import add from 'date-fns/add';
import { createdUserViewModel } from '../../dataMapper/createdUserViewModel';
import { ContentPageModel } from '../../globalTypes/contentPage.model';
import { UserViewModel } from '../api/dto/userView.model';
import { QueryInputModel } from '../api/dto/queryInput.model';

@Injectable()
export class UsersService {
  constructor(
    protected emailConfirmationRepository: EmailConfirmationRepository,
    protected emailsManager: EmailManager,
    protected usersRepository: UsersRepository,
  ) {}

  async getUserByIdOrLoginOrEmail(
    IdOrLoginOrEmail: string,
  ): Promise<UserDBModel | null> {
    return this.usersRepository.getUserByIdOrLoginOrEmail(IdOrLoginOrEmail);
  }

  async getUsers(query: QueryInputModel): Promise<ContentPageModel> {
    const users = await this.usersRepository.getUsers(query);
    const totalCount = await this.usersRepository.getTotalCount(
      query.searchLoginTerm,
      query.searchEmailTerm,
    );

    return paginationContentPage(
      query.pageNumber,
      query.pageSize,
      users,
      totalCount,
    );
  }

  async createUser(inputModel: UserInputModel): Promise<UserViewModel> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await _generateHash(inputModel.password, passwordSalt);
    const userAccountId = uuidv4();

    const accountData = new UserDBModel(
      userAccountId,
      inputModel.login,
      inputModel.email,
      passwordSalt,
      passwordHash,
      new Date().toISOString(),
    );

    const emailConfirmation = new EmailConfirmationModel(
      userAccountId,
      uuidv4(),
      add(new Date(), { hours: 24 }),
      false,
    );

    const userAccount = new UserAccountModel(accountData, emailConfirmation);

    const createdAccount = await this.createUserAccount(userAccount);

    if (!createdAccount) {
      return null;
    }

    await this.emailsManager.sendConfirmationEmail(
      inputModel.email,
      userAccount.emailConfirmation.confirmationCode,
    );

    return createdUserViewModel(accountData);
  }

  async updateUserPassword(userId: string, newPassword: string): Promise<boolean> {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await _generateHash(newPassword, passwordSalt) //TODO вынести в отдельную функцию

    return await this.usersRepository.updateUserPassword(userId, passwordSalt, passwordHash)
  }

  deleteUserById(userId: string): Promise<boolean> {
    return this.usersRepository.deleteUserById(userId);
  }

  private async createUserAccount(
    userAccount: UserAccountModel,
  ): Promise<UserAccountModel> {
    const user = await this.usersRepository.createUser(userAccount.accountData);
    const emailConfirmation =
      await this.emailConfirmationRepository.createEmailConfirmation(
        userAccount.emailConfirmation,
      );

    if (!user || !emailConfirmation) {
      return null;
    }

    return userAccount;
  }
}
