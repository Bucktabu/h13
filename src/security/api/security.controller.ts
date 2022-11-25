import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from "@nestjs/common";
import { SecurityService } from "../application/security.service";
import { UserDBModel } from "../../users/infrastructure/entity/userDB.model";

@Controller('security')
export class SecurityController {
  constructor(protected securityService: SecurityService) {}

  @Get('devices')
  getAllActiveSessions(
    @Body('user') user: UserDBModel
  ) {
    return this.securityService.getAllActiveSessions(user.id)
  }

  @Delete('devices')
  @HttpCode(204)
  async deleteActiveSessions(
    @Body() body: any
  ) {
    const result = await this.securityService.deleteAllActiveSessions(body.user!.id, body.tokenPayload.deviceId)

    if (!result) {
      throw new NotFoundException()
    }

    return
  }

  @Delete('devices/:id')
  @HttpCode(204)
  async deleteActiveSessionsById(
    @Body() body: any,
    @Param('id') deviceId: string
  ) {
    const userDevice = await this.securityService.getDeviceById(deviceId)

    if (!userDevice) {
      throw new NotFoundException()
    }

    if (userDevice.userId !== body.user.id) {
      throw new ForbiddenException() // 403
    }

    const isDeleted = await this.securityService.deleteDeviceById(deviceId)

    if (!isDeleted) {
      throw new NotFoundException();
    }

    return
  }
}