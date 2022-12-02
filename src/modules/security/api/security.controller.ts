import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SecurityService } from '../application/security.service';
import { UserDBModel } from '../../users/infrastructure/entity/userDB.model';
import { RefreshTokenValidationGuard } from '../../../guards/refresh-token-validation.guard';
import { Request } from 'express';
import { User } from "../../../decorator/user.decorator";

@Controller('security')
@UseGuards(RefreshTokenValidationGuard)
export class SecurityController {
  constructor(protected securityService: SecurityService) {}

  @Get('devices')
  getAllActiveSessions(@User() user: UserDBModel) {
    return this.securityService.getAllActiveSessions(user.id);
  }

  @Delete('devices')
  @HttpCode(204)
  async deleteActiveSessions(@Req() req: Request) {
    const result = await this.securityService.deleteAllActiveSessions(
      req.user.id,
      req.tokenPayload.deviceId,
    );

    if (!result) {
      throw new NotFoundException();
    }

    return;
  }

  @Delete('devices/:id')
  @HttpCode(204)
  async deleteActiveSessionsById(
    @Param('id') deviceId: string,
    @User() user: UserDBModel,
  ) {
    const userDevice = await this.securityService.getDeviceById(deviceId);

    if (!userDevice) {
      throw new NotFoundException();
    }

    if (userDevice.userId !== user.id) {
      throw new ForbiddenException(); // 403
    }

    const isDeleted = await this.securityService.deleteDeviceById(deviceId);

    if (!isDeleted) {
      throw new NotFoundException();
    }

    return;
  }
}
