import { UserDBModel } from "../../../users/infrastructure/entity/userDB.model";

export class AuthInputModel {
  loginOrEmail: string
  password: string
  user: UserDBModel
}