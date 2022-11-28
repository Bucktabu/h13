import { BanInfoModel } from '../../infrastructure/entity/banInfo.model';

export class UserViewModel {
  constructor(
    public id: string,
    public login: string,
    public email: string,
    public createdAt: string,
    //public banInfo: BanInfoModel
    public banInfo: {
      isBanned: boolean;
      banDate: Date;
      banReason: string;
    },
  ) {}
}
