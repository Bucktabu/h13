import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersController } from './users/api/users.controller';
import { UsersService } from './users/application/users.service';
import { UsersRepository } from './users/infrastructure/users.repository';
import { EmailConfirmationRepository } from './users/infrastructure/emailConfirmation.repository';
import { EmailAdapters } from './emailTransfer/email.adapter';
import { EmailManager } from './emailTransfer/email.manager';
import { QueryParametersValidation } from './middleware/queryParameters.validation';
import { TestingController } from './testing/testingController';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { CommentsController } from './comments/api/comments.controller';
import { CommentsService } from './comments/application/comments.service';
import { CommentsRepository } from './comments/infrastructure/comments.repository';
import { JwtService } from './auth/application/jwt.service';
import { JwtRepository } from './auth/infrastructure/jwt.repository';
import { LikesService } from './likes/application/likes.service';
import { LikesRepository } from './likes/infrastructure/likes.repository';
import { PostsController } from './posts/api/posts.controller';
import { PostsService } from './posts/application/posts.service';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { ConfirmationCodeValidation } from './middleware/confirmationCode.validation';
import { ConfirmationEmailValidation } from './middleware/confirmationEmail.validation';
import { ResendingConfirmationValidation } from './middleware/resendingConfirmation.validation';
import { RefreshTokenValidation } from './middleware/refreshToken.validation';
import { LikeStatusValidation } from './middleware/likeStatus.validation';
import { CheckCredential } from './middleware/checkCredential';
import { LoginOrEmailExistValidation } from './middleware/loginOrEmailExist.validation';
import { BanInfoRepository } from "./users/infrastructure/banInfo.repository";

@Module({
  imports: [],
  controllers: [
    BlogsController,
    CommentsController,
    PostsController,
    TestingController,
    UsersController,
  ],
  providers: [
    BlogsService,
    CommentsService,
    EmailAdapters,
    EmailManager,
    EmailConfirmationRepository,
    JwtService,
    LikesService,
    PostsService,
    UsersService,
    BanInfoRepository,
    BlogsRepository,
    CommentsRepository,
    JwtRepository,
    LikesRepository,
    PostsRepository,
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
      .forRoutes({ path: 'logout', method: RequestMethod.POST });
    consumer
      .apply(RefreshTokenValidation)
      .forRoutes({ path: 'security', method: RequestMethod.ALL });
    consumer
      .apply(LikeStatusValidation)
      .forRoutes({path: '/comments/:id/like-status', method: RequestMethod.PUT});
    consumer
      .apply(LoginOrEmailExistValidation)
      .forRoutes({ path: '/posts/registration', method: RequestMethod.POST });
  }
}
