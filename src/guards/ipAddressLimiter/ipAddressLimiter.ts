import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { IpAddressScheme } from './ipAddress.scheme';
import { ThrottlerException } from "@nestjs/throttler";
import { settings } from "../../settings";

@Injectable()
export class IpAddressLimiter implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const ipAddress = req.ip;
    const endpoint = req.url;
    const connectionAt = Date.now();

    await IpAddressScheme.create({ ipAddress, endpoint, connectionAt });
    const connectionsCount = await IpAddressScheme.countDocuments({
      ipAddress,
      endpoint,
      connectionAt: { $gte: connectionAt - Number(settings.CONNECTION_TIME_LIMIT)},
    });

    if (connectionsCount > Number(settings.CONNECTION_COUNT_LIMIT)) {
      throw new ThrottlerException()
    }

    // setTimeout(async function() {
    //   await IpAddressScheme.deleteOne({ connectionAt });
    // }), 11000)

    return true;
  }
}