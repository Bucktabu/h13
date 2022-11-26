import { BanInfoModel } from "./entity/banInfo.model";
import { BanInfoScheme } from "./entity/banInfo.scheme";

export class BanInfoRepository {
  getBanInfo(id: string) {
    return BanInfoScheme.findOne({id})
  }

  async createBanInfo(banInfo: BanInfoModel) {
    try {
      await BanInfoScheme.create(banInfo)
      return banInfo
    } catch (e) {
      return null
    }
  }

  async deleteBanInfoById(id: string): Promise<boolean> {
    const result = await BanInfoScheme.deleteOne({ id });

    return result.deletedCount === 1;
  }
}