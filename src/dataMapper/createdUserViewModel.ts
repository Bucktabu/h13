import { UserDBModel } from '../users/infrastructure/entity/userDB.model';

export const createdUserViewModel = (userDB: UserDBModel) => {
  return {
    id: userDB.id,
    login: userDB.login,
    email: userDB.email,
    createdAt: userDB.createdAt,
  };
};
