import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AuthController } from "./modules/auth/api/auth.controller";
import { BlogsController } from "./modules/blogs/api/blogs.controller";
import { CommentsController } from "./modules/comments/api/comments.controller";
import { PostsController } from "./modules/posts/api/posts.controller";
import { SecurityController } from "./modules/security/api/security.controller";
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
import { ConfirmationCodeValidationPipe } from "./pipe/confirmation-code-validation.pipe";
import { EmailResendingValidationPipe } from "./pipe/email-resending.pipe";
import { EmailExistValidationPipe } from "./pipe/email-exist-validation.pipe";
import { LoginExistValidationPipe } from "./pipe/login-exist-validation,pipe";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { BlogExistValidator } from "./validation/blog-exist.validator";
import { IBlogsRepository } from "./modules/blogs/infrastructure/blogs-repository.interface";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI)],
  controllers: [
    AuthController,
    BlogsController,
    CommentsController,
    PostsController,
    SecurityController,
    TestingController,
    UsersController
  ],
  providers: [
    BlogExistValidator,
    ConfirmationCodeValidationPipe,
    EmailExistValidationPipe,
    EmailResendingValidationPipe,
    LoginExistValidationPipe,

    BanInfoRepository,
    {
      provide: IBlogsRepository, useClass: BlogsRepository
    },
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
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {}
}