import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersController } from './users/api/users.controller';
import { UsersService } from './users/application/users.service';
import { UsersRepository } from './users/infrastructure/users.repository';
import { EmailConfirmationRepository } from './emailConfirmation/infrastructure/emailConfirmation.repository';
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
import { JwtService } from './jwt/application/jwt.service';
import { JwtRepository } from './jwt/infrastructure/jwt.repository';
import { LikesService } from './likes/application/likes.service';
import { LikesRepository } from './likes/infrastructure/likes.repository';
import { PostsController } from './posts/api/posts.controller';
import { PostsService } from './posts/application/posts.service';
import { PostsRepository } from './posts/infrastructure/posts.repository';

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
  }
}
