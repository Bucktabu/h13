import { CanActivate, ExecutionContext, Injectable, NestMiddleware } from "@nestjs/common";
import { IpAddressScheme } from './ipAddress.scheme';
import { ThrottlerException } from "@nestjs/throttler";
import { settings } from "../../settings";

@Injectable()
export class IpAddressLimiter implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const ip = req.ip;
    const endpoint = req.url;
    const connectionAt = Date.now();

    await IpAddressScheme.create({ ipAddress: ip, endpoint, connectionAt });
    const connectionsCount = await IpAddressScheme.countDocuments({
      ipAddress: ip,
      endpoint,
      connectionAt: { $gte: connectionAt - Number(settings.CONNECTION_TIME_LIMIT)},
    });

    if (connectionsCount > Number(settings.CONNECTION_COUNT_LIMIT)) {
      throw new ThrottlerException()
    }

    return true;
  }
}
