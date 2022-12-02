import {
  Body,
  Controller,
  Get,
  HttpCode,
  Ip,
  NotFoundException,
  NotImplementedException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../application/auth.service';
import { EmailConfirmationService } from '../../users/application/emailConfirmation.service';
import { JwtService } from '../application/jwt.service';
import { SecurityService } from '../../security/application/security.service';
import { UsersService } from '../../users/application/users.service';
import { EmailManager } from '../../emailTransfer/email.manager';
import { AuthBearerGuard } from '../../../guards/auth.bearer.guard';
import { CheckCredentialGuard } from '../../../guards/check-credential.guard';
import { RefreshTokenValidationGuard } from '../../../guards/refresh-token-validation.guard';
import { ConfirmationCodeValidationPipe } from '../../../pipe/confirmation-code-validation.pipe';
import { EmailResendingValidationPipe } from '../../../pipe/email-resending.pipe';
import { EmailDTO } from './dto/emailDTO';
import { NewPasswordDTO } from './dto/newPasswordDTO';
import { EmailConfirmationModel } from '../../users/infrastructure/entity/emailConfirmation.model';
import { UserDBModel } from '../../users/infrastructure/entity/userDB.model';
import { UserDTO } from '../../users/api/dto/userDTO';
import { toAboutMeViewModel } from '../../../data-mapper/to-about-me-view.model';
import { v4 as uuidv4 } from 'uuid';
import { AuthDTO } from './dto/authDTO';

@Controller('auth')
export class AuthController {
  constructor(
    protected authService: AuthService,
    protected jwsService: JwtService,
    protected emailManager: EmailManager,
    protected emailConfirmationService: EmailConfirmationService,
    protected securityService: SecurityService,
    protected usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(AuthBearerGuard)
  aboutMe(@Body('user') user: UserDBModel) {
    return toAboutMeViewModel(user);
  }

  @Post('login')
  @UseGuards(CheckCredentialGuard)
  async createUser(
    @Body() dto: AuthDTO, // TODO Если я использую пайп внутри скобок боди, то у меня пропадает валидация входных параметров, а если я применяю пайп ко всему ендпоинту, то я не могу получить пользователя
    @Ip() ipAddress,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const deviceId = uuidv4();
    const token = await this.jwsService.createToken(req.user.id, deviceId);
    const tokenPayload = await this.jwsService.getTokenPayload(
      token.refreshToken,
    );

    await this.securityService.createUserDevice(tokenPayload, ipAddress);
    // console.log('refreshToken=' + token.refreshToken);
    return res
      .status(200)
      .cookie('refreshToken', token.refreshToken, {
        secure: true,
        httpOnly: true,
        //maxAge: 24*60*60*1000
      })
      .send({ accessToken: token.accessToken });
  } // TODO можно все привести к точно такому же виду как в експрессе

  @Post('password-recovery')
  @HttpCode(204)
  async passwordRecovery(@Body() dto: EmailDTO) {
    const user = await this.usersService.getUserByIdOrLoginOrEmail(dto.email);

    if (!user) {
      const result = await this.authService.sendPasswordRecovery(
        user.id,
        dto.email,
      );

      if (!result) {
        throw new NotImplementedException();
      }
    }

    return;
  }

  @Post('new-password')
  @HttpCode(204)
  async createNewPassword(@Body() dto: NewPasswordDTO) {
    const emailConfirmation =
      await this.emailConfirmationService.getConfirmationByCode(
        dto.recoveryCode,
      ); // TODO можно ли как то избавиться от этого

    const user = await this.usersService.getUserByIdOrLoginOrEmail(
      emailConfirmation.id,
    );

    if (!user) {
      throw new NotFoundException();
    }

    const result = await this.usersService.updateUserPassword(
      emailConfirmation.id,
      dto.newPassword,
    );

    if (!result) {
      throw new NotImplementedException();
    }

    return;
  }

  @Post('registration')
  @HttpCode(204)
  async registration(@Body() dto: UserDTO) {
    const createdUser = await this.usersService.createUser(dto);

    if (!createdUser) {
      throw new NotImplementedException();
    }

    await this.emailManager.sendConfirmationEmail(
      createdUser.email,
      createdUser.code,
    );

    return;
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async registrationConfirmation(
    @Body(ConfirmationCodeValidationPipe)
    emailConfirmation: EmailConfirmationModel,
  ) {
    const result = await this.emailConfirmationService.updateConfirmationInfo(
      emailConfirmation.confirmationCode,
    );

    if (!result) {
      throw new NotImplementedException();
    }

    return;
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async registrationEmailResending(
    @Body(EmailResendingValidationPipe) user: UserDBModel,
  ) {
    const newConfirmationCode = await this.authService.updateConfirmationCode(
      user.id,
    );
    console.log(newConfirmationCode);
    if (!newConfirmationCode) {
      throw new NotImplementedException();
    }

    return await this.emailManager.sendConfirmationEmail(
      user.email,
      newConfirmationCode,
    );
  }

  @Post('refresh-token')
  @UseGuards(RefreshTokenValidationGuard)
  async createRefreshToken(@Req() req: Request, @Res() res: Response) {
    const token = await this.securityService.createNewRefreshToken(
      req.cookies.refreshToken,
      req.tokenPayload,
    );

    res
      .status(200)
      .cookie('refreshToken', token.refreshToken, {
        secure: true,
        httpOnly: true,
      })
      .send({ accessToken: token.accessToken });
  }

  @Post('logout')
  @UseGuards(RefreshTokenValidationGuard)
  @HttpCode(204)
  async logout(@Req() req: Request) {
    await this.securityService.logoutFromCurrentSession(
      req.cookies.refreshToken,
    );

    return;
  }
}
