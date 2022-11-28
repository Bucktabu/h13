import { UserDBModel } from '../users/infrastructure/entity/userDB.model';

export const ToAboutMeViewModel = (userDB: UserDBModel) => {
  return {
    email: userDB.email,
    login: userDB.login,
    userId: userDB.id,
  };
};