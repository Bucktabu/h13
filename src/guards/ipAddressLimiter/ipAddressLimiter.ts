import { CanActivate, ExecutionContext, Injectable, NestMiddleware } from "@nestjs/common";
import { IpAddressScheme } from './ipAddress.scheme';
import { ThrottlerException } from "@nestjs/throttler";

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
      connectionAt: { $gte: connectionAt - 10000 },
    });

    if (connectionsCount > 5) {
      throw new ThrottlerException()
    }

    return true;
  }
}
