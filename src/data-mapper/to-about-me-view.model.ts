import { UserDBModel } from '../modules/users/infrastructure/entity/userDB.model';

export const toAboutMeViewModel = (userDB: UserDBModel) => {
  return {
    email: userDB.email,
    login: userDB.login,
    userId: userDB.id,
  };
};
