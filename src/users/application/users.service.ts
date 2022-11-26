import { UsersRepository } from '../infrastructure/users.repository';
import { _generateHash, paginationContentPage } from '../../helper.functions';
import { v4 as uuidv4 } from 'uuid';
import { EmailConfirmationRepository } from '../infrastructure/emailConfirmation.repository';
import { EmailManager } from '../../emailTransfer/email.manager';
import { Injectable } from '@nestjs/common';
import { UserDBModel } from '../infrastructure/entity/userDB.model';
import { EmailConfirmationModel } from '../infrastructure/entity/emailConfirmation.model';
import { UserAccountModel } from '../infrastructure/entity/userAccount.model';
import { UserInputModel } from '../api/dto/userInputModel';
import bcrypt from 'bcrypt';
import add from 'date-fns/add';
import { createUserViewModel } from '../../dataMapper/createUserViewModel';
import { ContentPageModel } from '../../globalTypes/contentPage.model';
import { UserViewModel } from '../api/dto/userView.model';
import { QueryInputModel } from '../api/dto/queryInput.model';
import { BanInfoModel } from "../infrastructure/entity/banInfo.model";
import { BanInfoRepository } from "../infrastructure/banInfo.repository";

@Injectable()
export class UsersService {
  constructor(
    protected banInfoRepository: BanInfoRepository,
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
    const usersDB = await this.usersRepository.getUsers(query);
    console.log('1');
    const users = await Promise.all(usersDB.map(async (u) => await this.addBanInfo(u)))
    console.log('users', users);
    const totalCount = await this.usersRepository.getTotalCount(
      query.searchLoginTerm,
      query.searchEmailTerm,
    );
    console.log('5');
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

    const banInfo = new BanInfoModel(
      userAccountId,
      false,
      null,
      null
    )

    const userAccount = new UserAccountModel(accountData, banInfo, emailConfirmation);

    const createdAccount = await this.createUserAccount(userAccount);

    if (!createdAccount) {
      return null;
    }

    await this.emailsManager.sendConfirmationEmail(
      inputModel.email,
      userAccount.emailConfirmation.confirmationCode,
    );

    return createUserViewModel(accountData, banInfo);
  }

  async updateUserPassword(
    userId: string,
    newPassword: string,
  ): Promise<boolean> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await _generateHash(newPassword, passwordSalt); //TODO вынести в отдельную функцию

    return await this.usersRepository.updateUserPassword(
      userId,
      passwordSalt,
      passwordHash,
    );
  }

  async deleteUserById(userId: string): Promise<boolean> {
    const userDeleted = await this.usersRepository.deleteUserById(userId);
    const banInfoDeleted = await this.banInfoRepository.deleteBanInfoById(userId);
    const emailConfirmationDeleted  = await this.emailConfirmationRepository.deleteEmailConfirmationById(userId)

    if (!userDeleted) {
      return false
    }

    return true
  }

  private async createUserAccount(
    userAccount: UserAccountModel
  ): Promise<boolean> {
    const user = await this.usersRepository.createUser(userAccount.accountData);
    const banInfo = await this.banInfoRepository.createBanInfo(userAccount.banInfo)
    const emailConfirmation =
      await this.emailConfirmationRepository.createEmailConfirmation(
        userAccount.emailConfirmation,
      );

    if (!user || !emailConfirmation) {
      return false;
    }

    return true;
  }

  private async addBanInfo(
    userDB: UserDBModel
  ): Promise<UserViewModel> {
    console.log('3');
    const banInfo = await this.banInfoRepository.getBanInfo(userDB.id)
    console.log('4');

    return {
      id: userDB.id,
      login: userDB.login,
      email: userDB.email,
      createdAt: userDB.createdAt,
      banInfo: {
        isBanned: banInfo.isBanned,
        banDate: banInfo.banDate,
        banReason: banInfo.banReason
      }
    };
  }
}