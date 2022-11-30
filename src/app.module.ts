import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AuthController } from "./auth/api/auth.controller";
import { BlogsController } from "./blogs/api/blogs.controller";
import { CommentsController } from "./comments/api/comments.controller";
import { PostsController } from "./posts/api/posts.controller";
import { TestingController } from "./testing/testingController";
import { UsersController } from "./users/api/users.controller";
import { AuthService } from "./auth/application/auth.service";
import { BlogsService } from "./blogs/application/blogs.service";
import { CommentsService } from "./comments/application/comments.service";
import { EmailConfirmationService } from "./users/application/emailConfirmation.service";
import { EmailAdapters } from "./emailTransfer/email.adapter";
import { EmailManager } from "./emailTransfer/email.manager";
import { JwtService } from "./auth/application/jwt.service";
import { LikesService } from "./likes/application/likes.service";
import { PostsService } from "./posts/application/posts.service";
import { SecurityService } from "./security/application/security.service";
import { UsersService } from "./users/application/users.service";
import { BanInfoRepository } from "./users/infrastructure/banInfo.repository";
import { BlogsRepository } from "./blogs/infrastructure/blogs.repository";
import { CommentsRepository } from "./comments/infrastructure/comments.repository";
import { EmailConfirmationRepository } from "./users/infrastructure/emailConfirmation.repository";
import { JwtRepository } from "./auth/infrastructure/jwt.repository";
import { LikesRepository } from "./likes/infrastructure/likes.repository";
import { PostsRepository } from "./posts/infrastructure/posts.repository";
import { SecurityRepository } from "./security/infrastructure/security.repository";
import { UsersRepository } from "./users/infrastructure/users.repository";
import { CheckCredential } from "./middleware/checkCredential";
import { ConfirmationCodeValidation } from "./middleware/confirmationCode.validation";
import { ConfirmationEmailValidation } from "./middleware/confirmationEmail.validation";
import { QueryParametersValidation } from "./middleware/queryParameters.validation";
import { LoginOrEmailExistValidation } from "./middleware/loginOrEmailExist.validation";
import { ResendingConfirmationValidation } from "./middleware/resendingConfirmation.validation";
import { RefreshTokenValidation } from "./middleware/refreshToken.validation";
import { BlogExistValidation } from "./middleware/blogExist.validation";

@Module({
  imports: [],
  controllers: [
    AuthController,
    BlogsController,
    CommentsController,
    PostsController,
    TestingController,
    UsersController,
  ],
  providers: [
    BanInfoRepository,
    BlogsRepository,
    CommentsRepository,
    EmailConfirmationRepository,
    JwtRepository,
    LikesRepository,
    PostsRepository,
    SecurityRepository,
    UsersRepository,

    AuthService,
    BlogsService,
    CommentsService,
    EmailAdapters,
    EmailManager,
    EmailConfirmationService,
    JwtService,
    LikesService,
    PostsService,
    SecurityService,
    UsersService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // consumer
    //   .apply(QueryParametersValidation)
    //   .forRoutes({ path: '*', method: RequestMethod.GET });
    consumer
      .apply(CheckCredential)
      .forRoutes({ path: '/auth/login', method: RequestMethod.POST });
    consumer
      .apply(ConfirmationCodeValidation)
      .forRoutes({ path: '/auth/new-password', method: RequestMethod.POST });
    consumer
      .apply(LoginOrEmailExistValidation)
      .forRoutes({path: '/auth/registration', method: RequestMethod.POST});
    consumer
      .apply(ConfirmationEmailValidation)
      .forRoutes({
        path: '/auth/registration-confirmation',
        method: RequestMethod.POST});
    consumer
      .apply(ResendingConfirmationValidation)
      .forRoutes({
        path: '/auth/registration-email-resending',
        method: RequestMethod.POST});
    consumer
      .apply(RefreshTokenValidation)
      .forRoutes({ path: '/auth/refresh-token', method: RequestMethod.POST });
    consumer
      .apply(RefreshTokenValidation)
      .forRoutes({ path: '/security', method: RequestMethod.ALL });
    consumer
      .apply(RefreshTokenValidation)
      .forRoutes({path: '/auth/logout', method: RequestMethod.POST});
    consumer
      .apply(BlogExistValidation)
      .forRoutes({path: '/posts', method: RequestMethod.POST})
    consumer
      .apply(BlogExistValidation)
      .forRoutes({path: '/posts', method: RequestMethod.PUT})
    consumer
      .apply(LoginOrEmailExistValidation)
      .forRoutes({ path: '/posts/registration', method: RequestMethod.POST });
  } // TODO переписать на guards and pipe
}
