import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
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
import { BlogExistValidationPipe } from "./pipe/blog-exist-validation.pipe";
import { ConfirmationCodeValidationPipe } from "./pipe/confirmation-code-validation.pipe";
import { EmailResendingValidationPipe } from "./pipe/email-resending.pipe";
import { EmailExistValidationPipe } from "./pipe/email-exist-validation.pipe";
import { LoginExistValidationPipe } from "./pipe/login-exist-validation,pipe";


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

    BlogExistValidationPipe,
    ConfirmationCodeValidationPipe,
    EmailExistValidationPipe,
    EmailResendingValidationPipe,
    LoginExistValidationPipe
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // consumer
    //   .apply()
    //   .forRoutes({ path:, method: });
  }
}
