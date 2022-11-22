import { UsersRepository } from '../infrastructure/users.repository';
import { _generateHash, paginationContentPage } from '../../helper.functions';
import { v4 as uuidv4 } from 'uuid';
import { EmailConfirmationRepository } from '../../emailConfirmation/infrastructure/emailConfirmation.repository';
import { EmailManager } from "../../emailTransfer/email.manager";
import { Injectable } from "@nestjs/common";
import { UserDBModel } from "../infrastructure/entity/userDB.model";
import { EmailConfirmationModel } from "../../emailConfirmation/infrastructure/entity/emailConfirmation.model";
import { UserAccountModel } from "../infrastructure/entity/userAccount.model";
import { CreateUserInputModel } from "../api/dto/createUserInput.model";
import  bcrypt from 'bcrypt'
import add from 'date-fns/add';

@Injectable()
export class UsersService {
  constructor(
    protected emailConfirmationRepository: EmailConfirmationRepository,
    protected emailsManager: EmailManager,
    protected usersRepository: UsersRepository,
  ) {}

  async getUsers(query) {
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

  async createUser(inputModel: CreateUserInputModel) {
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
    return userAccount;
  }

  async createUserAccount(userAccount: UserAccountModel) {
    const user = await this.usersRepository.createUser(userAccount.accountData);
    const emailConfirmation =
      await this.emailConfirmationRepository.createEmailConfirmation(
        userAccount.emailConfirmation,
      );

    if (!user || !emailConfirmation) {
      return null;
    }

    return { accountData: user, emailConfirmation };
  }

  deleteUserById(userId: string): Promise<boolean> {
    return this.usersRepository.deleteUserById(userId);
  }
}
