import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AuthController } from "./modules/auth/api/auth.controller";
import { BlogsController } from "./modules/blogs/api/blogs.controller";
import { CommentsController } from "./modules/comments/api/comments.controller";
import { PostsController } from "./modules/posts/api/posts.controller";
import { TestingController } from "./modules/testing/testingController";
import { UsersController } from "./modules/users/api/users.controller";
import { AuthService } from "./modules/auth/application/auth.service";
import { BlogsService } from "./modules/blogs/application/blogs.service";
import { CommentsService } from "./modules/comments/application/comments.service";
import { EmailConfirmationService } from "./modules/users/application/emailConfirmation.service";
import { EmailAdapters } from "./modules/emailTransfer/email.adapter";
import { EmailManager } from "./modules/emailTransfer/email.manager";
import { JwtService } from "./modules/auth/application/jwt.service";
import { LikesService } from "./modules/likes/application/likes.service";
import { PostsService } from "./modules/posts/application/posts.service";
import { SecurityService } from "./modules/security/application/security.service";
import { UsersService } from "./modules/users/application/users.service";
import { BanInfoRepository } from "./modules/users/infrastructure/banInfo.repository";
import { BlogsRepository } from "./modules/blogs/infrastructure/blogs.repository";
import { CommentsRepository } from "./modules/comments/infrastructure/comments.repository";
import { EmailConfirmationRepository } from "./modules/users/infrastructure/emailConfirmation.repository";
import { JwtRepository } from "./modules/auth/infrastructure/jwt.repository";
import { LikesRepository } from "./modules/likes/infrastructure/likes.repository";
import { PostsRepository } from "./modules/posts/infrastructure/posts.repository";
import { SecurityRepository } from "./modules/security/infrastructure/security.repository";
import { UsersRepository } from "./modules/users/infrastructure/users.repository";
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

    BlogExistValidation
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(QueryParametersValidation)
      .forRoutes({ path: '*', method: RequestMethod.GET });
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
