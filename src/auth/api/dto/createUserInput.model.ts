import { UserDBModel } from "../../../users/infrastructure/entity/userDB.model";

export class CreateUserInputModel {
  constructor(
    loginOrEmail: string,
    password: string
  ) {}
}