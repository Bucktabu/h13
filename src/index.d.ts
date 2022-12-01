import { UserDBModel } from './modules/users/infrastructure/entity/userDB.model';
import { TokenPayloadModel } from "./global-model/token-payload.model";

declare global {
  declare namespace Express {
    export interface Request {
      user: UserDBModel | null;
      emailConfirmationId: string;
      tokenPayload: TokenPayloadModel;
    }
  }
} // расширение типов
