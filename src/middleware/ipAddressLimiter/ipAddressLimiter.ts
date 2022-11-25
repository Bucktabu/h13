import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { IpAddressScheme } from './ipAddress.scheme';

@Injectable()
export class IpAddressLimiter implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
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
      return res.sendStatus(429);
    }

    return next();
  }
}
