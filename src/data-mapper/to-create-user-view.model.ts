import { BanInfoModel } from '../modules/users/infrastructure/entity/banInfo.model';
import { UserDBModel } from '../modules/users/infrastructure/entity/userDB.model';

export const toCreateUserViewModel = async (
  userDB: UserDBModel,
  banInfo: BanInfoModel,
) => {
  return {
    id: userDB.id,
    login: userDB.login,
    email: userDB.email,
    createdAt: userDB.createdAt,
    // banInfo: {
    //   isBanned: banInfo.isBanned,
    //   banDate: banInfo.banDate,
    //   banReason: banInfo.banReason,
    // },
  };
};
