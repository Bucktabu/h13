import { UserDBModel } from "./users/infrastructure/entity/userDB.model";

declare global {
  declare namespace Express {
    export interface  Request {
      user: UserDBModel | null
    }
  }
} // расширение типов