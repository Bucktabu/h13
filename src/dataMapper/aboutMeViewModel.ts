import { UserDBModel } from '../users/infrastructure/entity/userDB.model';

export const AboutMeViewModel = (userDB: UserDBModel) => {
  return {
    email: userDB.email,
    login: userDB.login,
    userId: userDB.id,
  };
};
