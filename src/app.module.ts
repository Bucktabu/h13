import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { UsersController } from "./users/api/users.controller";
import { UsersService } from "./users/application/users.service";
import { UsersRepository } from "./users/infrastructure/users.repository";
import { EmailConfirmationRepository } from "./users/infrastructure/emailConfirmation.repository";
import { EmailAdapters } from "./emailTransfer/email.adapter";
import { EmailManager } from "./emailTransfer/email.manager";
import { QueryParametersValidation } from "./middleware/queryParameters.validation";
import { TestingController } from "./testing/testingController";
import { BlogsController } from "./blogs/api/blogs.controller";
import { BlogsService } from "./blogs/application/blogs.service";
import { BlogsRepository } from "./blogs/infrastructure/blogs.repository";
import { CommentsController } from "./comments/api/comments.controller";
import { CommentsService } from "./comments/application/comments.service";
import { CommentsRepository } from "./comments/infrastructure/comments.repository";
import { JwtService } from "./auth/application/jwt.service";
import { JwtRepository } from "./auth/infrastructure/jwt.repository";
import { LikesService } from "./likes/application/likes.service";
import { LikesRepository } from "./likes/infrastructure/likes.repository";
import { PostsController } from "./posts/api/posts.controller";
import { PostsService } from "./posts/application/posts.service";
import { PostsRepository } from "./posts/infrastructure/posts.repository";
import { ConfirmationCodeValidation } from "./middleware/confirmationCode.validation";
import { ConfirmationEmailValidation } from "./middleware/confirmationEmail.validation";
import { ResendingConfirmationValidation } from "./middleware/resendingConfirmation.validation";
import { RefreshTokenValidation } from "./middleware/refreshToken.validation";
import { LikeStatusValidation } from "./middleware/likeStatus.validation";
import { CheckCredential } from "./middleware/checkCredential";
import { LoginOrEmailExistValidation } from "./middleware/loginOrEmailExist.validation";
import { BanInfoRepository } from "./users/infrastructure/banInfo.repository";
import { AuthController } from "./auth/api/auth.controller";
import { AuthService } from "./auth/application/auth.service";
import { EmailConfirmationService } from "./users/application/emailConfirmation.service";
import { SecurityService } from "./security/application/security.service";
import { SecurityRepository } from "./security/infrastructure/security.repository";

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
    BanInfoRepository,
    BlogsRepository,
    CommentsRepository,
    EmailConfirmationRepository,
    JwtRepository,
    LikesRepository,
    PostsRepository,
    SecurityRepository,
    UsersRepository,
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
    consumer.apply(ConfirmationEmailValidation).forRoutes({
      path: '/auth/registration-confirmation',
      method: RequestMethod.POST,
    });
    consumer.apply(ResendingConfirmationValidation).forRoutes({
      path: '/auth/registration-email-resending',
      method: RequestMethod.POST,
    });
    consumer
      .apply(RefreshTokenValidation)
      .forRoutes({ path: '/auth/refresh-token', method: RequestMethod.POST });
    consumer
      .apply(RefreshTokenValidation)
      .forRoutes({ path: '/security', method: RequestMethod.ALL });
    consumer.apply(LikeStatusValidation).forRoutes({
      path: '/comments/:id/like-status',
      method: RequestMethod.PUT,
    });
    consumer
      .apply(RefreshTokenValidation)
      .forRoutes({path: '/auth/logout', method: RequestMethod.POST});
    consumer
      .apply(LoginOrEmailExistValidation)
      .forRoutes({ path: '/posts/registration', method: RequestMethod.POST });
  }
}
