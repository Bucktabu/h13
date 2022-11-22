import { UserDBModel } from "./userDB.model";
import { EmailConfirmationModel } from "../../../emailConfirmation/infrastructure/entity/emailConfirmation.model";

export class UserAccountModel {
  constructor(
    public accountData: UserDBModel,
    public emailConfirmation: EmailConfirmationModel,
  ) {}
}