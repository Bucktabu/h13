import {
  Body,
  Controller,
  ExecutionContext,
  Get, HttpCode, NotFoundException,
  Post,
  Req,
  ServiceUnavailableException,
  UseGuards
} from "@nestjs/common";
import { AuthBearerGuard } from "../../guard/auth.bearer.guard";
import { UserDBModel } from "../../users/infrastructure/entity/userDB.model";
import { AboutMeViewModel } from "../../dataMapper/aboutMeViewModel";
import {v4 as uuidv4} from "uuid";
import { JwtService } from "../../jwt/application/jwt.service";
import { IpAddress } from "../../decorators/ipAdress.decorator";
import { response } from "express";
import { emailInputModel } from "./dto/emailInput.model";
import { UsersService } from "../../users/application/users.service";
import { NewPasswordInputModel } from "./dto/newPasswordInput.model";
import { AuthService } from "../application/auth.service";
import { UserInputModel } from "../../users/api/dto/userInputModel";
import { SecurityService } from "../../security/application/security.service";
import { Cookies } from "../../decorators/cookie.decorator";
import { TokenPayloadModel } from "../../globalTypes/tokenPayload.model";
import { EmailConfirmationService } from "../../emailConfirmation/aplication/emailConfirmation.service";

@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService,
              protected jwsService: JwtService,
              protected emailConfirmationService: EmailConfirmationService,
              protected securityService: SecurityService,
              protected usersService: UsersService) {}

  @Get()
  @UseGuards(AuthBearerGuard)
  aboutMe(
    @Body('user') user: UserDBModel
  ) {
    return AboutMeViewModel(user)
  }

  @Post('login')
  async createUser(
    @Body() body: UserInputModel,
    @Req() user: UserDBModel,
    @IpAddress() ipAddress,
  ) {
    const deviceId = uuidv4()
    const token = await this.jwsService.createToken(user.id, deviceId)
    const tokenPayload = await this.jwsService.getTokenPayload(token.refreshToken)

    await this.securityService.createUserDevice(tokenPayload, ipAddress)

    response.cookie('refreshToken', token.refreshToken, {secure: true, httpOnly: true})
    return {'accessToken': token.accessToken}
  }

  @Post('password-recovery')
  @HttpCode(204)
  async passwordRecovery(
    @Body('email') email: emailInputModel
  ) {
    const user = await this.usersService.getUserByIdOrLoginOrEmail(email.toString()) // TODO :^)

    if (!user) {
      const result = await this.authService.sendPasswordRecovery(user.id, email.toString())

      if (!result) {
        throw new ServiceUnavailableException()
      }
    }

    return
  }

  @Post('new-password')
  @HttpCode(204)
  async createNewPassword(
    @Body() body: NewPasswordInputModel
  ) {
    const user = await this.usersService.getUserByIdOrLoginOrEmail(body.userId)

    if (!user) {
      throw new NotFoundException()
    }

    const result = await this.usersService.updateUserPassword(body.userId, body.newPassword)

    if (!result) {
      throw new ServiceUnavailableException()
    }

    return
  }

  @Post('registration')
  @HttpCode(204)
  async registration(
    @Body() body: UserInputModel
  ) {
    const result = await this.usersService.createUser(body)

    if (!result) {
      throw new ServiceUnavailableException()
    }

    return
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async registrationConfirmation(
    @Body('emailConfirmationId') id: string
  ) {
    const result = await this.emailConfirmationService.updateConfirmationInfo(id)

    if (!result) {
      throw new ServiceUnavailableException()
    }

    return
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async registrationEmailResending(
    @Body('user') user: UserDBModel
  ) {
    const result = await this.authService.updateConfirmationCode(user.id)

    if (!result) {
      throw new ServiceUnavailableException()
    }

    return
  }

  @Post('refresh-token')
  async createRefreshToken(
    @Body('tokenPayload') tokenPayload: TokenPayloadModel,
    @Cookies('refreshToken') refreshToken: string
  ) {
    const token = await this.securityService.createNewRefreshToken(refreshToken, tokenPayload)

    response.cookie('refreshToken', token.refreshToken, {secure: true, httpOnly: true})
    return {'accessToken': token.accessToken}
  }

  @Post('logout')
  @HttpCode(204)
  async logout(
    @Cookies('refreshToken') refreshToken: string
  ) {
    await this.securityService.logoutFromCurrentSession(refreshToken)

    return
  }
}