import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Ip,
  NotFoundException, NotImplementedException,
  Post,
  Req,
  Res,
  UseGuards
} from "@nestjs/common";
import { Request, Response } from 'express';
import { AuthService } from '../application/auth.service';
import { EmailConfirmationService } from '../../users/application/emailConfirmation.service';
import { JwtService } from '../application/jwt.service';
import { SecurityService } from '../../security/application/security.service';
import { UsersService } from '../../users/application/users.service';
import { EmailManager } from '../../emailTransfer/email.manager';
import { AuthBearerGuard } from '../../guard/auth.bearer.guard';
import { AuthInputModel } from './dto/authInput.model';
import { EmailInputModel } from "./dto/emailInputModel";
import { NewPasswordInputModel } from './dto/newPasswordInput.model';
import { TokenPayloadModel } from '../../globalTypes/tokenPayload.model';
import { UserDBModel } from '../../users/infrastructure/entity/userDB.model';
import { UserInputModel } from '../../users/api/dto/userInputModel';
import { ToAboutMeViewModel } from '../../dataMapper/toAboutMeViewModel';
import { v4 as uuidv4 } from 'uuid';
import { isEmail } from "class-validator";

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
    return ToAboutMeViewModel(user);
  }

  @Post('login')
  async createUser(
    @Body() body: AuthInputModel,
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
  async passwordRecovery(@Body('email') email: EmailInputModel) {
    if (!isEmail(email)) {
      throw new BadRequestException({
        errorsMessages: [{ message: 'Email should be email', field: 'email' }]
      })
    }

    const user = await this.usersService.getUserByIdOrLoginOrEmail(
      email.toString(),
    ); // TODO :^)

    if (!user) {
      const result = await this.authService.sendPasswordRecovery(
        user.id,
        email.toString(),
      );

      if (!result) {
        throw new NotImplementedException();
      }
    }

    return;
  }

  @Post('new-password')
  @HttpCode(204)
  async createNewPassword(@Body() body: NewPasswordInputModel) {
    const user = await this.usersService.getUserByIdOrLoginOrEmail(body.userId);

    if (!user) {
      throw new NotFoundException();
    }

    const result = await this.usersService.updateUserPassword(
      body.userId,
      body.newPassword,
    );

    if (!result) {
      throw new NotImplementedException();
    }

    return;
  }

  @Post('registration')
  @HttpCode(204)
  async registration(@Body() body: UserInputModel) {
    const createdUser = await this.usersService.createUser(body);

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
  async registrationConfirmation(@Req() req: Request) {
    console.log('-----> id:', req.emailConfirmationId);
    const result = await this.emailConfirmationService.updateConfirmationInfo(
      req.emailConfirmationId,
    );

    if (!result) {
      throw new NotImplementedException();
    }

    return;
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async registrationEmailResending(
    @Body('email') email: EmailInputModel,
    @Req() req: Request
  ) {
    if (!isEmail(email)) {
      throw new BadRequestException({
        errorsMessages: [{ message: 'Email should be email', field: 'email' }]
      })
    }

    console.log(email, isEmail(email));
    const newConfirmationCode = await this.authService.updateConfirmationCode(req.user.id);

    if (!newConfirmationCode) {
      throw new NotImplementedException();
    }

    return await this.emailManager.sendConfirmationEmail(email.toString(), newConfirmationCode);
  }

  @Post('refresh-token')
  async createRefreshToken(
    @Body('tokenPayload') tokenPayload: TokenPayloadModel,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const token = await this.securityService.createNewRefreshToken(
      req.cookies.refreshToken,
      tokenPayload,
    );

    res.status(200)
      .cookie('refreshToken', token.refreshToken, {
        secure: true,
        httpOnly: true,
      })
      .send({ accessToken: token.accessToken });
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Req() req: Request) {
    await this.securityService.logoutFromCurrentSession(req.cookies.refreshToken);

    return;
  }
}