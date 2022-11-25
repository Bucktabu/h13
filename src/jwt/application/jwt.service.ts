import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { settings } from '../../settings';
import { JwtRepository } from '../infrastructure/jwt.repository';

@Injectable()
export class JwtService {
  constructor(protected jwtRepository: JwtRepository) {}

  async getTokenPayload(token: string) {
    try {
      const result: any = await jwt.verify(token, settings.JWT_SECRET);
      return result;
    } catch (error) {
      return null;
    }
  }

  async getUserIdViaToken(token?: string): Promise<string | null> {
    let userId;
    if (!token) userId = null;
    else {
      const payload = await this.getTokenPayload(token.split(' ')[1]);
      userId = payload.userId;
    }
    return userId;
  }

  async checkTokenInBlackList(refreshToken: string) {
    return await this.jwtRepository.giveToken(refreshToken);
  }

  async addTokenInBlackList(refreshToken: string) {
    return await this.jwtRepository.addTokenInBlackList(refreshToken);
  }

  async createJWT(userId: string, deviceId: string, timeToExpired: number) {
    return jwt.sign({ userId, deviceId }, settings.JWT_SECRET, {
      expiresIn: `${timeToExpired}s`,
    });
  }

  async createToken(userId: string, deviceId: string) {
    const accessToken = await this.createJWT(userId, deviceId, 5 * 60 * 1000);
    const refreshToken = await this.createJWT(userId, deviceId, 10 * 60 * 1000);

    return { accessToken, refreshToken };
  }
}
